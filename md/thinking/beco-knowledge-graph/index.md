# A Knowledge Graph That Grades Its Own Evidence · Jose Romero

A DOI-verified knowledge graph of 420+ behavioural-science sources, built to separate what the research shows from what design decks keep repeating.

Source: https://www.joseromerodesign.com/thinking/beco-knowledge-graph/

Personal Research Infrastructure · Work in Progress

# A knowledge graph that _grades its own evidence._

Four hundred and twenty sources. Every one DOI-verified. Built to separate what behavioural science actually shows from what design decks have been repeating for a decade.

Why this exists

## “Nudge” became a word before it became a discipline.

Behavioural-science vocabulary spreads through design faster than its evidence does. Named “laws” get cited in decks, style guides, and design documentation, and almost nobody checks whether the research behind them actually holds up.

Jakob’s Law? Murphy’s Law? Occam’s Razor? Hick’s Law? The Law of Triviality?

This graph exists to answer that question, for every one of them, on the record — and to keep the answer current as new evidence shows up.

The core idea

## Three tiers. _One direction only._

### The Science

Source → Finding. DOI-verified, graded replicated, disputed, undetermined, or not applicable.

Backed by

### The Trust Rating

BiasHeuristic. An honest backing status and a separate myth-risk rating, independent of how popular the claim is.

Illustrated by

### The Practice

Application. Real products, campaigns, and studies, provenance-graded, with a mandatory ethical read.

The arrow only runs one way. A real-world example can illustrate a bias. It can never inflate the rating above it. Popularity in practice and rigor in research stay visibly, permanently separate.

At a glance

## Not a _prototype._

420Sources 431Findings 243Named Concepts 221Topics 960Authors 222Real-World Examples

Hosted on Neo4j Aura, always-on and reachable from anywhere, not a local file on one laptop.

How it’s built

## A map, _not a spreadsheet._

What actually makes it reliable

## The rule is simple. _Holding it is the hard part._

Every source needs a real, checkable DOI. Every finding gets one of four grades — replicated, disputed, undetermined, or not applicable — never just “cited.” Every write to the live database runs through a validation pass before it touches anything. Fields are closed-enum, not free text, so “sort of backed, I guess” was never an option to begin with.

That discipline is the entire point. Picking quotes that sound authoritative is easy. Holding a consistent bar for what actually counts as evidence, and writing it down every single time, is the part that's usually skipped.

See it work

## Scarcity Principle, _start to finish._

Source Scarcity tactics in marketing Journal of Retailing, 2022 → Finding 416 effect sizes, 131 studies Scarcity cues reliably increase purchase intent, moderated by product type. → BiasHeuristic Scarcity Principle Verified · no myth risk → Application Booking.com’s urgency messaging Real case study · clarified after EU enforcement, 2020

Every link in that chain is a real, independently checkable citation, not a paraphrase of “research shows.”

Proof it’s not just filing

## When the evidence isn’t there, _the graph says so._

Running the same audit against fifteen widely-cited “laws” — Murphy’s Law, Occam’s Razor, Jakob’s Law, and the Law of Triviality among them — found no rigorous backing behind any of them. That doesn’t mean the underlying observations are wrong. It means the evidence usually attached to them isn’t there when you actually go look for it.

1 reversal The claim that lottery winners aren’t any happier than everyone else, cited in nearly every “money doesn’t buy happiness” argument, is directly disputed by a 2020 correction of a measurement error in the original study. 17%, not 17 points A study on outcome bias among NBA coaches was cited as showing “17 percentage points” more likely to change lineups after a loss. The source actually says 17 percent — a relative change. Checked against the original DOI and corrected to match. Useful, not just accurate

## A reliable answer _nobody can find_ isn’t reliable.

Semantic search over the findings, tested against a labeled set of real questions rather than eyeballed. The production configuration beats two reasonable alternatives by a real margin.

ConfigurationMRRHit@1

Production (query-instruction prefix)0.8110.733

Ablation · no instruction prefix0.6600.567

Ablation · alternate embedding model0.7510.667

One result changed an approach already shipped: a re-ranking step that clearly improves search over the findings makes search over the named biases worse. A technique that works for one part of a system doesn’t automatically work for another part just because it’s the same system.

Not just a database

## Ask it _a question._

$ python3 query.py "does scarcity actually work?" Scarcity Principle · verified · foundational Limited availability increases perceived value and desirability. Real-world examples (4): • Booking.com’s urgency messaging · manipulative-use risk flagged • Groupon’s combined time- and quantity-limited framing categorize.py

The confidence-first audit: what’s solid, what’s contested, and which popular “laws” carry real myth risk.

query.py

Semantic search over the findings and the named biases, with disputes, support, and full source provenance surfaced in one pass.

Neo4j Aura

Always-on, queryable from anywhere, not a local file someone has to request access to.

Work in progress, on purpose

## Built to grow. _Built to be checked._

Right now, this is mine: I query it, I maintain it, I’m the only one who has ever written to it. The current stretch of work is depth, not breadth: extending source coverage on the corpus’s most-cited, most foundational names, so the concepts practitioners lean on hardest rest on more than a single study.

I wanted other designers to explore this themselves rather than take my word for what’s in it, so there’s now a browsable version of the whole graph — the same clusters, the same citations, no highlight reel. It’s a snapshot, not a live connection, and read-only for now. Anyone working in this field can already open a claim and see exactly what backs it; letting other people write to it is the part still ahead.

✓ 202 real-world examples across all domains ✓ Retrieval tuned and measured, not assumed ✓ Open for anyone to browse → Extending literature depth on foundational names Get in touch

## If you’ve ever cited a “law” you’d never checked, _you’re not alone._

That's exactly why I built this. I'm always glad to talk through what's behind a specific claim, walk through the graph directly, or hear about a source I'm missing.

[Explore the graph →](https://www.joseromerodesign.com/thinking/beco-explorer/) [Get in touch →](mailto:joseromero.next@gmail.com)
