# Designing with AI · Jose Romero

A framework for human-led, agent-assisted product design: process architecture, real checkpoints, drift, and what AI asks of senior designers.

Source: https://www.joseromerodesign.com/thinking/ai-workflow-framework/

Thinking · AI · Process Design

# Designing with AI

A framework for human-led, agent-assisted product design. On process architecture, genuine checkpoints, drift, and what AI augmentation actually demands.

**Design Operations** · IKEA / Ingka Group · June 2026, updated October 2026 · 18 min read

**Topic**· Design Operations**Context**· IKEA / Ingka Group**Published**· June 2026**Updated**· October 2026**Read** · 18 min

Contents

- Preface

- The reframe

- The architecture

- Human-in-the-loop

- Facilitation

- What this demands

[← Case study](https://www.joseromerodesign.com/work/ai-workflow-framework/) [← All thinking](https://www.joseromerodesign.com/thinking/)

Preface

Most design teams I talk to are stuck on the wrong question. "Which AI tool should we use?" is a procurement question dressed up as a design one, and answering it first is exactly how you end up with what most teams have right now: demos that look great, output that's all over the place, and a workflow that's harder to audit than what it replaced.

The more interesting question is: if you were designing a workflow from scratch, knowing that AI agents would be part of it, how would you structure the process? Where would the humans be? What would they actually do? What would agents handle? And how would you know if it was working?

That is the question this framework tries to answer. It grew out of real work inside IKEA's digital experience design team, and was extended afterward into something that can operate independently of any specific toolset. What follows is the full argument, including the parts that failed before they worked.

Process design

## The reframe

The distinction between tool use and workflow design is not semantic. A tool you use is optional and interchangeable. A workflow layer you've designed is part of the architecture: different risk profile, different level of care required.

Most teams I've seen treat AI as a feature bolted onto whatever workflow already exists: a Figma plugin generating copy variants, a ChatGPT tab summarising research notes, an assistant drafting the first pass. None of that is wrong on its own. The catch is that AI used this way just inherits whatever was already broken about the process.

An ad hoc process doesn't get more structured with AI in it. It gets faster and more ad hoc. Undocumented decisions don't become documented; they become confidently, plausibly wrong. And if a team hasn't agreed on what they're actually trying to achieve, AI will happily optimise for something else entirely.

An unclear process doesn't get slower when you add AI to it. It gets fast, unclear, and, because the output looks polished, much harder to catch.

What worked for me was treating AI the way I'd treat any other systems design problem: pin down the inputs, the outputs, the handoffs, who decides what and when: the workflow first, with AI designed into it afterward, not the other way around.

The useful question stopped being "what can AI do?" and became "where does this actually belong in the process, and how would I know if it wasn't working?" Slower to answer, but it's the one that matters.

Systems architecture

## The architecture

The framework organises AI-assisted design work into three tiers of agents operating across five phases.

### The three tiers

Shape Up's fixed appetite and variable scope maps well here. The appetite constrains the Orchestrator's context management. Betting table moments become genuine human decision points rather than rubber stamps.

**Tier 1: the Orchestrator** sits at the top. Its job is to manage context across the entire project: maintaining the project record, summarising phase outputs, coordinating handoffs between phases, and escalating to human decision-makers when something is genuinely ambiguous or consequential. The Orchestrator does not make design decisions. It manages the conditions under which design decisions are made.

**Tier 2: Phase Agents** each own a single phase: Discovery, Shaping, Betting, Building, or Retrospective. They receive inputs from the Orchestrator, coordinate the Task Agents within their phase, and produce structured outputs for human review at the phase exit.

**Tier 3: Task Agents** are narrow specialists. A constraints analysis agent. A user needs synthesis agent. A decision logging agent. A scope monitoring agent. Each does one thing within its phase and produces a structured output that feeds directly into the Phase Agent's synthesis. Their narrowness is a feature, not a limitation: narrow scope means clear accountability and containable failure.

### The five phases

The phases follow the Shape Up methodology's core rhythm: discovery shapes the problem, shaping produces a pitch, betting commits the scope, building executes it, and the retrospective evolves the framework itself. Each phase has explicit exit criteria: conditions that must be met before the framework advances.

This matters because it prevents the most common failure in AI-assisted workflows: phases that technically complete but don't actually resolve anything. Exit criteria force resolution. They prevent the appearance of progress masking the absence of it.

### Why the structure matters

The three-tier hierarchy is not bureaucracy. It is containment. An agent that operates with too broad a mandate will drift. An agent that receives poorly scoped inputs will hallucinate plausibly. The hierarchy creates the conditions under which each agent can be reliable: clear scope, well-formed inputs, structured outputs, and a human review layer at every meaningful transition.

The hierarchy creates the conditions under which each agent can be reliable. Clear scope, well-formed inputs, structured outputs, and a human review layer at every meaningful transition.

Design the process well and the AI is just another layer inside it.

Trust & governance

## Human-in-the-loop, for real

I've stopped trusting the phrase "human-in-the-loop" on its own: it covers everything from a real decision-making role down to a confirmation dialog nobody reads before clicking through. Plenty of workflows advertise human oversight and deliver a formality instead.

High-confidence AI output is not a signal of correctness; it is often a trigger for more careful review. Fluency and accuracy are not correlated. This is counterintuitive and worth making explicit to the whole team.

The framework takes a different position: human checkpoints must be hard gates: moments where the workflow literally cannot advance without a named human decision. Not a notification. Not a summary email. A decision, with a record of who made it and why.

### What a genuine checkpoint looks like

Every meaningful phase transition requires a Confirmation Block: a structured AI output that captures the agent's current understanding of the problem, the assumptions it's carrying forward, and the decisions that remain open. The human reviewer's job is not to approve this as a courtesy. It is to read it adversarially: what is wrong here? What is missing? What has shifted?

Confirmation Block Discovery Phase · Awaiting human review

Problem statement

Users in the onboarding flow abandon at the document upload step due to perceived complexity and uncertainty about data handling. Primary signal: drop-off analytics + usability session recordings (n=12).

Assumptions carried forward

Primary persona: first-time users, low technical confidence. Success metric: abandonment reduction at upload step. Scope: native mobile only. Desktop parity not in this cycle.

Decisions deferred

Whether to redesign the upload UI or add contextual guidance only. Requires human resolution before Shaping phase begins.

Open questions

Legal sign-off on revised data handling copy. Dependency on backend team for file validation timeline.

→ Please confirm, correct, or expand before the workflow advances.

If a human reads that summary and has nothing to correct, I'd treat that as a yellow flag, not a green one. It might mean the agent captured a genuinely clean phase output. It might also mean the reviewer skimmed it. I've learned to assume the second until I have a reason not to.

### The drift problem

Nobody talks about drift as a failure mode, probably because it doesn't announce itself. From the inside, it just looks like the project is moving forward.

Drift is the gradual divergence between the AI's working model and the team's actual intent. It's different from a single error, which is visible and correctable. Drift is cumulative: small misalignments that compound across phases until the gap between "what we're building" and "what we said we were building" becomes significant.

It shows up as framing drift (the problem statement shifts subtly), persona drift (the target user becomes different from the research), or priority drift (a trade-off resolved early gets re-litigated without anyone flagging it). By the time it's visible, several phases of work may already be built on the wrong foundation.

The defences against drift are structural: a project context document updated and reviewed at each phase transition; original intent literally re-read at every phase gate, from a document not from memory; and confirmation blocks that explicitly surface the agent's current problem framing for human comparison.

The most important defence is cultural: a team environment where questioning the AI's framing is expected and rewarded, not treated as friction.

### Context as a design discipline

Context architecture is information design. Structuring a complex interface calls for the same instincts: hierarchy, compression, what to show and what to defer. They transfer directly to managing context in a multi-agent system.

Working with language models in a multi-phase workflow means accepting a real constraint: agents don't have memory in the way human team members do. Each operates within a context window: a bounded space of information it can actively process. When that window fills up, context is summarised, compressed, or lost.

That's just how the technology behaves, not a flaw to engineer away, and designing around it turned out to be its own skill. Four mechanisms in the framework handle it:

- **Context Initialisation**: a living project document maintained across all phases, re-injected at each phase start

- **Incremental Summarisation**: structured compression of phase outputs that preserves decisions and open questions

- **Selective Injection**: task-specific context packages that give each agent only what it needs for its scope

- **Context Auditing**: a human-led review of context accuracy at each phase boundary

The skill of context architecture, knowing what information to carry forward, how to compress it without losing signal, when the context has drifted from reality, is one of the most underrated skills in AI-augmented design work. It is also one of the most teachable.

Leadership & practice

## Facilitation

Embedding AI into a design workflow doesn't make the facilitator's job easier. It's a different job.

The clearest shift: the facilitator stops being the one processing everything the group says. AI now handles most of the transcription, tagging, and first-pass synthesis. That frees up attention, but it adds a new responsibility in its place: watching the system as closely as the room, tracking what the AI is doing with what people just said, and getting participants to actually interrogate those outputs instead of nodding along.

The pattern I've seen most often: a group that has been in a two-hour session accepts an AI synthesis as authoritative because it looks organised. The facilitator needs to actively model skepticism, not just once, but consistently.

There is a specific risk here. When AI summarises a two-hour workshop into a crisp set of insight clusters, participants tend to accept that summary as authoritative, because it looks organised and confident. The facilitator must actively resist this: prompting the group to interrogate the synthesis, identify what was lost in compression, and surface disagreements the system may have smoothed over.

Watch the room and the system both. When they disagree, trust the room.

### What doesn't change

- **Holding purpose**: AI can track topics but cannot hold intent. The facilitator owns why the session is happening.

- **Reading the room**: no model can sense when a team is losing confidence, when a voice is being systematically deferred to, or when the group is about to commit to something they don't actually understand.

- **Judgment calls**: when the AI's synthesis contradicts the facilitator's read of the room, the facilitator's judgment takes precedence. Always.

### The norm worth protecting

The most important condition for AI-augmented facilitation is one that cannot be designed into the system: the normalisation of skepticism toward AI output.

On teams that get this right, pushing back on the system's output isn't read as distrust or slowing things down; it's read as someone doing their job well. "I don't think this captures what we actually said" is worth more than the polite silence it usually gets.

Building this norm requires explicit leadership. The facilitator must model skepticism: asking critical questions about AI synthesis in front of the group, praising pushback, and making it clear that the AI is a collaborator with a defined and bounded role, not a source of truth.

Skills & calibration

## What this demands

AI augmentation doesn't simplify the designer's role. It changes it.

Less time goes into production work now: first drafts, structured synthesis, applying a repetitive pattern, most of that's moved to agents. More time goes into setting direction, evaluating what comes back, and making the judgment calls where user need, business constraint, and design quality don't line up cleanly. The responsibility for the outcome hasn't moved at all.

AI assistance does not transfer accountability. It changes the form of the work required to fulfil it.

### The skills that design education hasn't caught up with

Tired reviewers accept more. Build time and structure for careful review into the process itself. Don't rely on team discipline to do the work that the process should do.

- **Prompt craft**: giving an agent enough specificity to be useful without boxing out its actual contribution. It's closer to writing a brief than writing a spec, and a longer prompt isn't a better one; a precise one is.

- **Output evaluation**: assessing AI output critically and quickly: what is right, what is wrong, what needs investigation. This requires both domain knowledge and a clear mental model of what the work is supposed to achieve.

- **Context architecture**: deciding what information must carry forward across phases, how it should be compressed, and what can be safely left behind. A new kind of information design that senior designers are well-positioned to develop.

- **Drift detection**: noticing when the AI's framing has shifted subtly from original intent. This requires keeping original intent visible and referring to it regularly, from a document, not from memory.

- **Calibrated trust**: knowing when AI output is likely reliable and when it requires deeper scrutiny. Calibration develops with practice and should be made explicit across the team.

### The framework as a living practice

A framework that is treated as finished stops improving. The retrospective phase is specifically designed to prevent this: at the end of each cycle, the team reviews not just the design work but the framework itself. What worked. What generated overhead without value. What needs to change.

The practices described here are the result of real experimentation: what has worked, what has failed, and what has been learned. They represent a current state, not a final one. Every team that adopts this framework will encounter situations it doesn't fully address. The right response is to adapt and document, not to follow mechanically.

To close

The framework is an attempt to make human judgment more effective, not to replace it. The AI layer exists to serve the process. The process exists to serve the design. The design exists to serve the people who use it.

The agents, the workflow, the tooling: none of it matters as much as that chain of accountability holding end to end. That's the actual point.

[← Back to Thinking](https://www.joseromerodesign.com/thinking/) [View the case study →](https://www.joseromerodesign.com/work/ai-workflow-framework/)
