# IKEA Ways of Working System · Jose Romero

A cross-tool design operations framework for IKEA’s New Business Platform, spanning Figma, Jira, Confluence and Phrase, built to run without its author.

Source: https://www.joseromerodesign.com/work/ikea-ways-of-working/

Design Operations · Systems · Facilitation

# A process designed to survive people.

When I joined the IKEA Home Services team, there was no shared working system. I built one: a cross-tool framework spanning Figma, Jira, Confluence, and Phrase, from first principles.

- **Client:** IKEA / Ingka Group

- **Agency:** Garaje de Ideas / Groupe EDG

- **My role:** Design Operations Lead

- **Period:** 2025–Present

- **Scope:** Process Design · Documentation · Tool Architecture · AI Workflow Design · Facilitation

## In short

The problem

When I joined, the team’s process lived in people’s heads: files scattered across tools, no agreed home for anything, and translation errors reaching users before anyone caught them.

What I did

I mapped the real work, wrote rules for what lives in Figma, Confluence, Jira and Phrase, redesigned the content workflow into five phases with clear owners, and set a rule for when to adapt Skapa components.

Result

Adoption is uneven, but the structure holds: newcomers onboard without a personal guide, handoffs share one shape, and QA now catches translation errors before release.

WoW System Architecture Skapa-First Decision Framework The problem

## Eight failure modes, not one

When I joined the team, the working process existed, but only in people's heads. Files were spread across Figma, Confluence, and local drives with no consistent structure. Nobody could say for certain what belonged in Figma, what in Confluence, or what in Jira, and the answer changed depending on who you asked.

What looked like a cultural problem was a structural one. A root cause audit surfaced eight distinct failure modes actively slowing the team down. They were not independent; each fed the others:

_Eight interlocking failure modes. The underlying pattern: information held informally, and no owner for the gaps between tools._

Approach

## Principles first, tools second

The first step was making the existing state legible. Mapping what was actually happening, not the ideal, not what people believed happened, revealed that the problems were structural, not behavioural. People weren't being careless; the system had no clear rules about who owned what at which stage.

The obvious move is to audit the tools first and write documentation around them, but that gets the order backwards. Without a structural principle underneath it, documentation is just one more thing to keep updated.

I started by mapping the actual work: the types of tasks the team performed, their interdependencies, the decisions that kept getting lost, the questions that kept being asked by new team members. From that map, I derived a set of structural rules: what type of information lives in each tool, when it moves between tools, who owns it at each stage.

"Design truth lives in Figma, context truth in Confluence, progress truth in Jira, and the moment the same fact exists in two of those without one clearly overriding the other, something's already gone wrong."

Once the principles were clear, the documentation wrote itself. Tools were assigned roles. Naming conventions followed from those roles. Onboarding followed from the naming conventions.

The framework

## Four tools, one backbone

The framework assigns a single, non-overlapping role to each of the four primary tools. The rule is simple enough to hold in memory without documentation:

_One rule: every tool has one job. The system holds because the principle is simple enough to remember without the documentation._

_Working reference artifact: the complete WoW system architecture as distributed to the team. Covers tool-role assignments, Figma project structure, Skapa library hierarchy, and the five-phase content workflow in a single reference surface._

The content workflow

## Five phases. Two owners.

Alongside the tool framework, the team needed a clear workflow for how design work, particularly content and translations, moved through the production cycle. The existing process had no defined phases, no explicit ownership handoffs, and no point at which translations could be verified before they reached users.

The redesigned workflow is structured as five phases with explicit ownership. Phases one through three are designer-owned: content is defined, localisation keys are set up, and designs are handed off. Phases four and five are engineering-owned: implementation, integration, and QA happen here. The release is the output of a completed cycle, not a deadline that compresses earlier phases.

The critical structural change was in Phase Two. Content localisation keys, the strings that feed the translation system, had to be created during design, not during development. Moving key creation earlier made translations a parallel track from Phase Two onward, which meant they were ready when QA began rather than still in progress.

_Five phases, two owners. The key structural change: translation keys set up in Phase 2 (design), not Phase 4 (engineering), which made them verifiable in QA for the first time._

_Branch-level workflow artifact, showing how the five-phase process maps to daily Figma work: branch lifecycle from creation to deletion, naming conventions, handoff protocol, and Jira integration in one operational view._

Figma framework

## Component decisions, not component chaos.

File structure and naming conventions solve the organisation problem. Component governance solves a different one: when to use what already exists, when to adapt it, and when to propose something new.

IKEA's Skapa design system provides a solid foundation of icons, foundations, and components. But a product team building features for the Home App will eventually encounter scenarios Skapa doesn't cover. Without a rule, those gaps get filled inconsistently: every designer making a different call, with no trail and no review. The Skapa-First decision framework makes the rule explicit: check Skapa first, adapt if needed, and only propose new components when no existing solution is feasible, with written justification and a governance review before anything enters production.

_Component governance artifact, the Skapa-First decision framework as distributed to designers. Three evaluation paths: YES (use directly), MAYBE (adapt as a variant), NO (justify and submit for governance review before production)._

Phrase optimisation

## From untestable to verifiable

The translation workflow was the most acute failure point. In the existing state, localisation keys were created late in the cycle, typically by engineering, not design, which compressed the translation window, forced localisation to happen in parallel with development rather than before it, and left QA with no mechanism to verify language quality before release. Translation errors were caught by end users, not by the team.

The redesigned workflow shifted both the ownership and timing of key creation. Designers create content keys during Phase Two, as part of the design process, before handoff. This turns translation into a parallel track that is ready when development completes. Quality assurance now includes a dedicated translation review step: language errors are catchable before they ship.

"If you can't test a problem before release, you will ship it. Testable translations weren't a nice-to-have; they were the reason the quality bar held."

The change also reduced the cognitive load on engineering. When keys arrive in development already created and named correctly, engineers aren't making content decisions under deadline. The system produces better work because each role is doing the work it's positioned to do.

AI workflow design

## When the process is solid, you can design what comes next.

Fixing the structural failures was necessary. But it also opened a different question: now that handoffs and ownership were explicit and documented, which parts of the design workflow could be fundamentally restructured, not just improved, using AI?

Two threads emerged from this:

Shape Up facilitation

Shape Up sessions are cognitively demanding: problem framing, constraint definition, appetite-setting, and rough solution sketching, all compressed into a few hours. I designed and tested facilitation workflows that use AI to support the shaping process: structuring prompting sequences, helping surface edge cases before pitches are written, and synthesizing multi-participant outputs into pitch-ready documentation.

Multi-agent orchestration for product shaping

Complex features usually involve multiple stakeholders: product, engineering, content, business. For those, I designed a multi-agent approach that distributes the shaping task across specialized agents: problem decomposition, constraint mapping, and solution evaluation. Outputs are structured to flow directly into the Confluence documentation format established by the ways-of-working system. The process and the AI layer are the same system.

"Most designers pick up AI as another tool in the kit. What I'm doing here is closer to designing AI into the workflow itself, a different skill, and honestly the direction systems thinking was always heading anyway."

This work is ongoing and is being shared with senior design professionals at Garaje de Ideas as part of an active AI literacy programme.

Outcome

## Imperfect adoption. Structural bones held.

Adoption has been uneven, which was expected. Some habits stuck fast, others are still catching on team by team, and a few corners of the process still get worked out informally rather than by the book.

But the structural bones held. New team members can now onboard without needing a personal guide through every tool. Handoffs have a consistent shape. When the process breaks down, it breaks down in identifiable ways: a naming convention ignored, a Confluence page not updated. Both get fixed by adjusting documentation, not by hunting through files or asking the right person.

The translation workflow change had the most immediate effect: QA could verify language quality before release for the first time. The feedback loop shortened from "a user reports a translation issue" to "QA catches it in pre-production."

Honestly, that's fine by me. I'd rather have a system that keeps functioning when people cut corners than one that only works if everybody follows it to the letter. The second kind looks great on paper and falls apart the day its one caretaker goes on holiday.
