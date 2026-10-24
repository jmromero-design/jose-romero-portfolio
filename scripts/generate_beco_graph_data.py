#!/usr/bin/env python3
"""
generate_beco_graph_data.py — node-link snapshot for the BECO explorer
(/thinking/beco-explorer/: the map and its cards).

Reads the card explorer's static export (assets/data/beco-explorer/), so it
needs no Aura connection: run generate_beco_explorer_data.py first after an
ingest round, then this. Nothing here runs automatically.

The layout is computed here, once, so the browser only draws: a soft radial
force layout where every tier (cluster, domain, topic, concept, evidence,
source, author) is pulled toward its own ring, springs keep each node near
what it belongs to, and repulsion spreads the rest. Concepts that sit in
several topics, related concepts and shared sources pull across the rings,
which is what makes it read as a network rather than a tree.

Output: assets/data/beco-graph/graph.json
  nodes  [[type, x, y, label, extra], ...]   type is an index into `types`
  edges  [a, b, a, b, ...]                    structural links
  rel    [a, b, ...]                          concept-to-concept RELATED_TO
  extra  per type: cluster/domain/topic {id, d: description}, concept {id,
         g: grade, m: myth, k: kind, f: findings, a: apps}, finding {r:
         replication, d: text}, source {y, v}, application {e: ethical risk}

Usage: python3 scripts/generate_beco_graph_data.py
"""

import json
import math
from pathlib import Path

import numpy as np
from scipy.spatial import cKDTree

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets/data/beco-explorer"
OUT = ROOT / "assets/data/beco-graph/graph.json"

TYPES = ["cluster", "domain", "topic", "concept", "finding", "application", "source", "author"]
# target ring per type, in layout units; the force pass only loosely holds them
RING = {"cluster": 210, "domain": 320, "topic": 440, "concept": 580,
        "finding": 735, "application": 735, "source": 865, "author": 1000}
GRADE = {"verified": "v", "partial": "p", "no_rigorous_backing_found": "n"}
SEED = 7


def clip(text, n):
    text = " ".join((text or "").split())
    return text if len(text) <= n else text[: n - 1].rstrip() + "…"


def build():
    tree = json.loads((SRC / "tree.json").read_text())
    nodes, index, edges, rel = [], {}, set(), set()

    def node(key, type_, label, extra=None):
        if key in index:
            return index[key]
        index[key] = len(nodes)
        nodes.append({"key": key, "t": type_, "label": label, "x": extra or {}})
        return index[key]

    def link(a, b):
        if a != b:
            edges.add((min(a, b), max(a, b)))

    def evidence(owner, f, fkey):
        fi = node(fkey, "finding", clip(f.get("source_title"), 90),
                  {"r": f.get("replication_status") or "", "d": clip(f.get("description"), 220)})
        link(owner, fi)
        skey = "src:" + (f.get("source_doi") or f.get("source_title") or fkey).lower()
        si = node(skey, "source", clip(f.get("source_title"), 120),
                  {"y": f.get("source_year"), "v": clip(f.get("source_venue"), 60)})
        link(fi, si)
        for name in f.get("authors") or []:
            name = name if isinstance(name, str) else name.get("name", "")
            if name:
                link(si, node("au:" + name.lower(), "author", name))

    clusters = {}
    for d in tree["domains"]:
        cname = d["cluster_name"]
        if cname not in clusters:
            slug = "cluster-" + "-".join("".join(ch if ch.isalnum() else " " for ch in cname.lower()).split())
            clusters[cname] = node("cl:" + cname, "cluster", cname, {"id": slug})
        di = node(d["id"], "domain", d["name"], {"id": d["id"], "d": clip(d.get("description"), 200)})
        link(clusters[cname], di)
        for tp in d["topics"]:
            ti = node(tp["id"], "topic", tp["name"], {"id": tp["id"], "d": clip(tp.get("description"), 240)})
            link(di, ti)
            for f in tp.get("standalone_findings") or []:
                evidence(ti, f, f["id"])
            for b in tp["biases"]:
                ci = node(b["id"], "concept", b["name"], {"id": b["id"]})
                link(ti, ci)

    for ci_key in [n["key"] for n in nodes if n["t"] == "concept"]:
        ci = index[ci_key]
        detail = json.loads((SRC / "biases" / f"{ci_key}.json").read_text())
        nodes[ci]["x"].update({
            "g": GRADE.get(detail.get("backing_status"), "n"),
            "m": detail.get("myth_risk") or "",
            "k": detail.get("kind") or "",
            "f": len(detail.get("findings") or []),
            "a": len(detail.get("applications") or []),
        })
        for k, f in enumerate(detail.get("findings") or []):
            evidence(ci, f, f"{ci_key}#f{k}")
        for k, a in enumerate(detail.get("applications") or []):
            ai = node(f"{ci_key}#a{k}", "application", clip(a.get("title"), 90),
                      {"e": a.get("ethical_risk") or ""})
            link(ci, ai)
        for r in detail.get("related") or []:
            if r["id"] in index:
                a, b = ci, index[r["id"]]
                if a != b:
                    rel.add((min(a, b), max(a, b)))
    return tree, nodes, sorted(edges), sorted(rel)


def seed_positions(nodes, edges):
    """Radial tree start: each node takes an angular slice of its parent's,
    sized by how much hangs beneath it, at its type's ring."""
    n = len(nodes)
    children = [[] for _ in range(n)]
    parent = [-1] * n
    order = sorted(range(n), key=lambda i: TYPES.index(nodes[i]["t"]))
    adj = [[] for _ in range(n)]
    for a, b in edges:
        adj[a].append(b)
        adj[b].append(a)
    rank = {i: TYPES.index(nodes[i]["t"]) for i in range(n)}
    for i in order:
        if rank[i] == 0:
            continue
        ups = [j for j in adj[i] if rank[j] < rank[i]]
        if ups:
            p = min(ups, key=lambda j: (rank[j], j))
            parent[i] = p
            children[p].append(i)
    weight = [1.0] * n
    for i in sorted(range(n), key=lambda i: -rank[i]):
        weight[i] = 1.0 + sum(weight[c] for c in children[i])
    pos = np.zeros((n, 2))
    angle = [0.0] * n

    def place(items, lo, hi):
        total = sum(weight[i] for i in items) or 1
        a = lo
        for i in items:
            span = (hi - lo) * weight[i] / total
            angle[i] = a + span / 2
            r = RING[nodes[i]["t"]]
            pos[i] = (r * math.cos(angle[i]), r * math.sin(angle[i]))
            place(children[i], a, a + span)
            a += span

    roots = [i for i in range(n) if parent[i] == -1]
    place(roots, 0, 2 * math.pi)
    return pos


def relax(nodes, edges, rel, pos, iters=360):
    rng = np.random.default_rng(SEED)
    n = len(nodes)
    pos = pos + rng.normal(0, 4, pos.shape)
    ring = np.array([RING[nd["t"]] for nd in nodes], dtype=float)
    E = np.array(edges + rel, dtype=int)
    rest = np.array([60.0] * len(edges) + [140.0] * len(rel))
    stiff = np.array([0.06] * len(edges) + [0.012] * len(rel))
    size = np.array([{"cluster": 5, "domain": 3, "topic": 1.4, "concept": 1.8}.get(nd["t"], 1.0) for nd in nodes])
    cutoff = 120.0
    # cluster hubs stay where the seed put them: the middle of their own slice
    pinned = np.array([nd["t"] == "cluster" for nd in nodes])
    anchor = pos.copy()

    def scatter(idx, vec):
        return np.stack([np.bincount(idx, vec[:, 0], n), np.bincount(idx, vec[:, 1], n)], 1)

    for it in range(iters):
        cool = 1 - it / iters
        force = np.zeros_like(pos)
        # repulsion between nearby pairs only: ~ size_i·size_j / d²
        pairs = cKDTree(pos).query_pairs(cutoff, output_type="ndarray")
        if len(pairs):
            a, b = pairs[:, 0], pairs[:, 1]
            d = pos[a] - pos[b]
            dist2 = (d ** 2).sum(1) + 1e-2
            f = d * (900 * size[a] * size[b] / dist2 / np.sqrt(dist2))[:, None]
            force += scatter(a, f) - scatter(b, f)
        # springs
        dv = pos[E[:, 1]] - pos[E[:, 0]]
        dl = np.linalg.norm(dv, axis=1) + 1e-6
        f = (stiff * (dl - rest))[:, None] * dv / dl[:, None]
        force += scatter(E[:, 0], f) - scatter(E[:, 1], f)
        # each tier back toward its ring
        r = np.linalg.norm(pos, axis=1) + 1e-6
        force += (0.08 * (ring - r) / r)[:, None] * pos
        pos += np.clip(force, -12, 12) * (0.25 + 0.75 * cool)
        pos[pinned] = anchor[pinned]
    return pos


def main():
    tree, nodes, edges, rel = build()
    pos = relax(nodes, edges, rel, seed_positions(nodes, edges))
    pos -= pos.mean(0)
    scale = 1000 / np.abs(pos).max()
    pos *= scale
    out_nodes = []
    for nd, (x, y) in zip(nodes, pos):
        row = [TYPES.index(nd["t"]), round(float(x), 1), round(float(y), 1), nd["label"]]
        if nd["x"]:
            row.append(nd["x"])
        out_nodes.append(row)
    data = {
        "generated_at": tree.get("generated_at"),
        "types": TYPES,
        "nodes": out_nodes,
        "edges": [v for e in edges for v in e],
        "rel": [v for e in rel for v in e],
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
    counts = {t: sum(1 for nd in nodes if nd["t"] == t) for t in TYPES}
    print(f"{len(nodes)} nodes {counts}, {len(edges)} edges, {len(rel)} related, {OUT.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
