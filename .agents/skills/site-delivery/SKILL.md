---
name: site-delivery
description: Plan, implement and verify changes to the JacksonTheDev site and its learning companion, preserving learner progress and producing revision-linked review evidence.
---

# Site delivery

Read the repository [agreement](../../../AGENTS.md) and [workflow](../../../docs/AGENT-WORKFLOW.md). They are canonical; this skill routes the work rather than duplicating their rules.

1. Locate the outcome in current callers, tests and documentation. For `/learn`, inspect the catalog, pure model and client component separately. Record the base, affected paths and observable acceptance criteria before a complex edit.
2. If adopting a demonstrated workflow, record what was actually reviewed and map each relevant stage to trigger, inputs, procedure, output, proof, failure handling, dependencies and side effects. Separate source facts from your proposed adaptation. A README or old review score does not prove runtime behavior.
3. Implement within the current site's boundaries. For progress changes, preserve v1/v2 import behavior or add an explicit migration and recovery path. For new data flows, update the learner-facing promise and test the boundary.
4. Run the agreement's applicable checks. Pair application tests with a browser journey when behavior lives in the client. Docs-only work needs path/link checks, not a claim of a fresh application run. Preserve exact statuses and tested revisions.
5. Inspect the staged diff for public suitability. Prepare the PR evidence map, documentation impact and rollback. Commit/push only within the authorized task. Never upload raw private research or real learner data as proof.
6. When review is available, inspect findings against the code; repair supported issues and rerun affected checks. Use the agreement's bounded loop. Missing or stale external review remains visible; no invented score, automatic merge or deployment.

For future verifier/hooks/reviewer implementation, read [the factory plan](../../../docs/FACTORY-IMPLEMENTATION-PLAN.md). A proposed script name is not an executable tool. This skill does not launch agents or install integrations.
