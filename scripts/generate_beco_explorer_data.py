#!/usr/bin/env python3
"""
generate_beco_explorer_data.py — snapshot exporter for the public BECO
Knowledge Graph explorer (/thinking/beco-explorer/).

Deliberately NOT a live Aura connection from the browser — this is a
build-time export, run manually and committed, per the sourcing decision
in the BECO Knowledge Graph repo's docs/PUBLIC_ATLAS_VISION.md (no
credential exposure, no free-tier rate-limit risk, works on plain static
hosting). Re-run this after any ingest round you want reflected publicly;
nothing here runs automatically.

Output, under assets/data/beco-explorer/:
  tree.json        — full Cluster -> Domain -> Topic -> BiasHeuristic
                      hierarchy, summary fields only (names, counts,
                      backing_status/myth_risk badges). One file, fetched
                      once — small enough (no embeddings, no findings/
                      applications detail) to ship upfront and drive the
                      whole browse + client-side search experience.
  biases/<id>.json — one file per BiasHeuristic, fetched only when a user
                      actually opens it: full description, every backing
                      Finding (with its Source citation), every Application
                      (with its provenance/ethical-risk grading), and
                      RELATED_TO neighbours.

Usage:
    cd "Professional Data" ... actually run from anywhere; it locates the
    BECO Knowledge Graph repo's neo4j_env.py by absolute path below.
    python3 scripts/generate_beco_explorer_data.py
"""

import json
import os
import sys
from datetime import date
from pathlib import Path

BECO_REPO = "/Users/joseromero/Documents/Projects/BECO Knowledge Graph"
sys.path.insert(0, BECO_REPO)
import neo4j_env  # noqa: E402

neo4j_env.load()

from neo4j import GraphDatabase, basic_auth  # noqa: E402

NEO4J_URI = os.environ["NEO4J_URI"]
NEO4J_USER = os.environ.get("NEO4J_USERNAME", os.environ.get("NEO4J_USER", "neo4j"))
NEO4J_PASSWORD = os.environ["NEO4J_PASSWORD"]
NEO4J_DATABASE = os.environ.get("NEO4J_DATABASE", "neo4j")

REPO_ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = REPO_ROOT / "assets" / "data" / "beco-explorer"
BIASES_DIR = OUT_DIR / "biases"

UNCATEGORIZED_DOMAIN = {"id": "domain-uncategorized", "name": "Uncategorized", "description": "Not yet assigned a domain."}
UNCATEGORIZED_TOPIC = {"id": "topic-uncategorized", "name": "Uncategorized", "description": "Not yet assigned a topic."}


def run(session, query, **params):
    return list(session.run(query, **params))


def build_tree(session):
    # Cluster is a real node in Aura but deliberately not a navigation tier here:
    # it's a thin grouping layer with no content of its own (no direct Findings/
    # Applications), and one extra click before reaching anything real. Domain is
    # the top of the public hierarchy; each domain still carries its cluster's
    # name as a plain label, not a browsable level.
    domains = run(session, """
        MATCH (dm:Domain)-[:IN_CLUSTER]->(c:Cluster)
        RETURN dm.uuid AS id, dm.name AS name, dm.description AS description, c.name AS cluster_name
        ORDER BY dm.name
    """)

    topics_by_domain = {}
    for t in run(session, """
        MATCH (t:Topic)-[:IN_DOMAIN]->(dm:Domain)
        RETURN t.uuid AS id, t.name AS name, t.description AS description, dm.uuid AS domain_id
        ORDER BY t.name
    """):
        topics_by_domain.setdefault(t["domain_id"], []).append(dict(t))

    biases_by_topic = {}
    orphan_biases = []
    for b in run(session, """
        MATCH (b:BiasHeuristic)
        OPTIONAL MATCH (b)-[:ABOUT]->(t:Topic)
        OPTIONAL MATCH (b)-[:ILLUSTRATED_BY]->(app:Application)
        OPTIONAL MATCH (b)-[:BACKED_BY]->(f:Finding)
        WITH b, t, count(DISTINCT app) AS application_count, count(DISTINCT f) AS finding_count
        RETURN b.uuid AS id, b.name AS name, b.description AS description,
               b.backing_status AS backing_status,
               b.myth_risk AS myth_risk, b.prevalence AS prevalence,
               t.uuid AS topic_id, application_count, finding_count
        ORDER BY b.name
    """):
        entry = {
            "id": b["id"], "name": b["name"], "description": b["description"],
            "backing_status": b["backing_status"],
            "myth_risk": b["myth_risk"], "prevalence": b["prevalence"],
            "application_count": b["application_count"], "finding_count": b["finding_count"],
        }
        if b["topic_id"]:
            biases_by_topic.setdefault(b["topic_id"], []).append(entry)
        else:
            orphan_biases.append(entry)

    # A Topic's real content isn't only its named BiasHeuristics — a Finding
    # attaches to a Topic the same way (ABOUT), and 116 of them currently sit
    # on a topic with no bias crystallized from it yet. Surfacing only the
    # bias path made a genuinely populated topic look empty. Exclude findings
    # already reachable through one of this topic's own biases so nothing is
    # shown twice.
    standalone_findings_by_topic = {}
    for f in run(session, """
        MATCH (t:Topic)<-[:ABOUT]-(f:Finding)
        WHERE NOT EXISTS {
            MATCH (b:BiasHeuristic)-[:ABOUT]->(t)
            MATCH (b)-[:BACKED_BY]->(f)
        }
        OPTIONAL MATCH (src:Source)-[:REPORTS]->(f)
        OPTIONAL MATCH (src)-[:AUTHORED_BY]->(a:Author)
        WITH t, f, src, collect(DISTINCT a.name) AS authors
        RETURN t.uuid AS topic_id, f.uuid AS id, f.description AS description,
               f.replication_status AS replication_status, f.effect_size AS effect_size,
               src.title AS source_title, src.year AS source_year, src.venue AS source_venue,
               src.doi AS source_doi, src.url AS source_url, authors
        ORDER BY f.description
    """):
        entry = dict(f)
        entry.pop("topic_id")
        standalone_findings_by_topic.setdefault(f["topic_id"], []).append(entry)

    tree_domains = []
    for d in domains:
        d = dict(d)
        topic_nodes = []
        for t in topics_by_domain.get(d["id"], []):
            topic_nodes.append({
                "id": t["id"], "name": t["name"], "description": t["description"],
                "biases": biases_by_topic.get(t["id"], []),
                "standalone_findings": standalone_findings_by_topic.get(t["id"], []),
            })
        tree_domains.append({
            "id": d["id"], "name": d["name"], "description": d["description"],
            "cluster_name": d["cluster_name"],
            "topics": topic_nodes,
        })

    if orphan_biases:
        tree_domains.append({
            **UNCATEGORIZED_DOMAIN,
            "cluster_name": None,
            "topics": [{**UNCATEGORIZED_TOPIC, "biases": orphan_biases, "standalone_findings": []}],
        })

    return tree_domains


def build_bias_detail(session, bias_id):
    row = run(session, "MATCH (b:BiasHeuristic {uuid: $id}) RETURN b", id=bias_id)[0]
    b = dict(row["b"])
    b.pop("embedding", None)

    findings = []
    for f in run(session, """
        MATCH (b:BiasHeuristic {uuid: $id})-[:BACKED_BY]->(f:Finding)
        OPTIONAL MATCH (src:Source)-[:REPORTS]->(f)
        OPTIONAL MATCH (src)-[:AUTHORED_BY]->(a:Author)
        WITH f, src, collect(DISTINCT a.name) AS authors
        RETURN f.description AS description, f.effect_size AS effect_size,
               f.effect_size_ci AS effect_size_ci, f.replication_status AS replication_status,
               f.finding_type AS finding_type,
               src.title AS source_title, src.year AS source_year, src.venue AS source_venue,
               src.doi AS source_doi, src.url AS source_url, src.source_type AS source_type,
               authors
        ORDER BY f.description
    """, id=bias_id):
        findings.append(dict(f))

    applications = []
    for a in run(session, """
        MATCH (b:BiasHeuristic {uuid: $id})-[:ILLUSTRATED_BY]->(app:Application)
        RETURN app.title AS title, app.description AS description,
               app.industry_context AS industry_context, app.provenance AS provenance,
               app.ethical_risk AS ethical_risk, app.ethical_note AS ethical_note,
               app.source_url AS source_url, app.date_observed AS date_observed
        ORDER BY app.title
    """, id=bias_id):
        applications.append(dict(a))

    related = []
    for r in run(session, """
        MATCH (b:BiasHeuristic {uuid: $id})-[:RELATED_TO]-(other:BiasHeuristic)
        RETURN DISTINCT other.uuid AS id, other.name AS name,
               other.backing_status AS backing_status, other.myth_risk AS myth_risk
        ORDER BY other.name
    """, id=bias_id):
        related.append(dict(r))

    return {
        "id": b.get("uuid"),
        "name": b.get("name"),
        "aliases": b.get("aliases") or [],
        "description": b.get("description"),
        "design_relevance_note": b.get("design_relevance_note"),
        "backing_status": b.get("backing_status"),
        "myth_risk": b.get("myth_risk"),
        "myth_risk_note": b.get("myth_risk_note"),
        "prevalence": b.get("prevalence"),
        "prevalence_note": b.get("prevalence_note"),
        "last_reviewed_at": b.get("last_reviewed_at"),
        "findings": findings,
        "applications": applications,
        "related": related,
    }


def main():
    driver = GraphDatabase.driver(NEO4J_URI, auth=basic_auth(NEO4J_USER, NEO4J_PASSWORD))
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    BIASES_DIR.mkdir(parents=True, exist_ok=True)

    with driver.session(database=NEO4J_DATABASE) as session:
        totals = {}
        for label, key in [("Cluster", "clusters"), ("Domain", "domains"), ("Topic", "topics"),
                            ("BiasHeuristic", "biases"), ("Finding", "findings"),
                            ("Source", "sources"), ("Application", "applications"),
                            ("Author", "authors")]:
            totals[key] = run(session, f"MATCH (n:{label}) RETURN count(n) AS c")[0]["c"]

        print("Building hierarchy tree...")
        domains = build_tree(session)
        tree = {
            "generated_at": date.today().isoformat(),
            "totals": totals,
            "domains": domains,
        }
        (OUT_DIR / "tree.json").write_text(json.dumps(tree, ensure_ascii=False, separators=(",", ":")))
        print(f"  wrote tree.json ({(OUT_DIR / 'tree.json').stat().st_size:,} bytes)")

        # dict.fromkeys dedupes while preserving first-seen order — a bias linked to more
        # than one Topic (e.g. Choice Blindness, since Phase 142's ABOUT-link fix) walks
        # more than one Domain/Topic path here, so a plain list comprehension double- or
        # triple-writes the same file with identical content. Harmless, but ~30% wasted
        # Neo4j round-trips on every run.
        all_bias_ids = list(dict.fromkeys(
            b["id"] for d in domains for t in d["topics"] for b in t["biases"]
        ))
        print(f"Building {len(all_bias_ids)} bias detail files...")
        for i, bias_id in enumerate(all_bias_ids, 1):
            detail = build_bias_detail(session, bias_id)
            (BIASES_DIR / f"{bias_id}.json").write_text(
                json.dumps(detail, ensure_ascii=False, separators=(",", ":"))
            )
            if i % 50 == 0:
                print(f"  {i}/{len(all_bias_ids)}...")

    driver.close()
    print(f"Done. {len(all_bias_ids)} bias files written to {BIASES_DIR}")


if __name__ == "__main__":
    main()
