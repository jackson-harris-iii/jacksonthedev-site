# Site and learning companion delivery

The [working agreement](../AGENTS.md) owns the rules. This runbook describes their use. Jackson is the repository owner; the active assistant carries the task through the following responsibilities sequentially by default.

| Responsibility | Input | Output / proof | Stop condition |
| --- | --- | --- | --- |
| Planner | User outcome, current callers, relevant tests | Small plan, file list, acceptance criteria, risks, unresolved decisions | Material behavior or permissions are ambiguous |
| Implementer | Agreed scope and baseline | Focused diff, updated tests and docs | Scope expansion or missing capability |
| Verifier | Changed behavior and criteria | Exact command results, inspected UI evidence where relevant, tested revision | Failure, missing proof or revision mismatch |
| Reviewer | Diff, criteria, checks, evidence | Finding dispositions and reviewed revision | Unresolved material finding or unavailable requested reviewer |
| Release owner | Current acceptance and review proof | Authorized merge/release plus verification and rollback | Release authorization absent |

These roles do not create agents. A self-review is useful but is not independent review. External reviewer availability must be checked for this repository; access elsewhere does not transfer.

## Ordinary change

1. Inspect `git status`, current branch/base, relevant code and tests. Preserve dirty work. Reuse the current suitable feature branch for the same outcome; use a separate branch/worktree when parallel work or isolation requires it.
2. Write acceptance criteria as observable behavior, including negative cases where they matter. For a bug, capture a reproducible baseline before the fix when possible. A source-adoption task also needs a compact adaptation map.
3. Build the smallest useful change and update the affected maintained docs. Keep learner-facing explanation separate from engineering controls.
4. Run relevant tests. The current full baseline is `npm run lint`, `npm run typecheck`, `npm test`. These operate on the working checkout; there is no snapshot wrapper yet. Record `git rev-parse HEAD` and disclose uncommitted changes. Use a clean committed run when claiming proof for a commit; do not attach dirty-tree results to an unrelated SHA.
5. Inspect the diff and public-data boundary. Prepare a PR using the template. Record local/remote/tested/reviewed revisions explicitly when they differ. Hosted PR checks may run a synthetic merge commit; record that tested commit and its relation to the PR head rather than pretending they are identical.
6. After an authorized push, inspect current checks and review findings. Fix supported findings without an extra routine approval gate. Rerun affected proof and request another review only for the new head. Stop after two correction passes or ten minutes waiting on the reviewer and report what remains.
7. Handoff with outcome, PR, exact validation, known gaps and release state. Merge, deployment and production verification are distinct steps.

## Evidence example for the companion

| Criterion | Suitable proof |
| --- | --- |
| Old progress remains readable | v1/v2 migration fixture and export roundtrip tests |
| Notes survive navigation/reload | Browser journey with synthetic notes |
| Editing a checked note requires a fresh check | Browser test of the changed status |
| Public route still renders | Worker-bundle route regression test |
| Learner data stays local | Relevant code/data-flow inspection and network assertions when available; do not infer this from copy alone |
| A future account cannot read another person's evidence | Server authorization test with two distinct users; an anonymous-only test is insufficient |

Use synthetic learner data for captures. Keep raw logs/media outside Git and deployment uploads. The current workflow does not publish evidence automatically. Before publishing a sanitized report, verify its destination and revision and read it back.

## Review and enforcement status

Current: hosted lint/typecheck/build/test workflow; written delivery agreement; PR evidence template; one repo-owned skill. CI execution is not proof that GitHub requires the check before merge.

Planned: committed-snapshot verifier, push hook, tested report publisher, external reviewer setup, required-check configuration. No unattended coding service is included. Greptile is the proposed reviewer to match the reference workflow; if selected, require an explicit current-head 5/5 plus finding dispositions and applicable checks. Until configured and proved here, label Greptile not configured. A different reviewer policy is an explicit owner decision, never a fabricated equivalent score.

[Implementation phases and acceptance](FACTORY-IMPLEMENTATION-PLAN.md).
