# Repository-owned software factory plan

Status: instruction foundation established; phase 1 committed-snapshot verifier implemented, pending the current PR review. Hooks, external review and merge enforcement remain planned.

## Outcome and scope

Make the JacksonTheDev site and `/learn` a single, reviewable example of the workflow it teaches: specify an outcome, implement within clear boundaries, verify independently where possible, repair review findings, and preserve useful evidence. Keep the current React/TypeScript/Vinext/Cloudflare application and npm lockfile. No framework migration, second application, unattended agent fleet or paid service is part of this foundation.

The related workspace workflow was inspected as a reference, not installed or run here. Private source locations and revision notes are retained outside this public repository. This public plan contains independently written site-specific requirements, not copied private operational content. Review coverage: referenced chat messages, repository instructions/skills/runbooks, reviewer configuration and selected verification-script sections. No fresh video viewing or execution of the reference repository's pipeline is claimed.

## Adaptation map

| Stage / trigger | Inputs and procedure | Output and success proof | Failure / dependencies / side effects | Site status |
| --- | --- | --- | --- | --- |
| Task intake | Outcome, base, callers; scope and isolate edits | Plan with criteria and affected paths | Preserve dirty work; resolve material ambiguity | Written agreement established |
| Skill selection | Task and phase; select repo skill | Fresh-clone-resolvable delivery procedure | Missing tools disclosed; no automatic installation | One local skill established |
| Build | Site boundaries and standards; implement small diff | Tests for changed behavior and maintained docs | No blanket legacy refactor | Existing implementation plus rules |
| Verify committed source | Commit/tree, locked dependencies, named checks; isolated checkout | Report identifies tested SHA, commands, results | Nonzero/missing/timed-out checks remain failures; isolated generated output | Local snapshot wrapper and matching CI implemented |
| Review/repair | Current head, findings, acceptance map; fix then prove again | Current review and disposition of applicable findings | Two correction passes, ten-minute wait ceiling; provider setup needed | Procedure written; external integration unverified |
| Documentation | Behavior diff and audience; update source guides/examples | Valid links/examples; rendered diagrams when changed | Public/private separation; no UI-only hiding | Maintained repo docs; automatic checker planned |
| Publish/release | Authorized destination and reviewed source | Correct commit, CI and deployed behavior checked separately | No automatic merge/deploy from a score | Existing GitHub source; no release automation added |

## Phase 0 — portable agreement (this change)

Affected files: `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `.github/pull_request_template.md`, `.agents/skills/site-delivery/SKILL.md`, this plan, `docs/AGENT-WORKFLOW.md`, README and development links.

Acceptance: another checkout can follow the agreement without sibling files or personal symlinks; rules fit this public site and preserve learning/progress semantics; installed capabilities are distinguished from planned ones. Verify changed relative links, existing commands and skill format. No application behavior change.

## Phase 1 — reproducible verification and evidence

Implemented files: `scripts/verify.mjs`, `scripts/verification-report.mjs`, `tests/verification.test.mjs`, `package.json`, `.gitignore`, `.github/workflows/ci.yml`, and [verification runbook](VERIFICATION.md). `npm run verify` is available.

- Add a repo-owned `npm run verify` entry point with explicitly named lint, typecheck, build and model/route-test steps. Refactor test commands carefully so the bundle builds once and no current assertion disappears.
- Final commit verification rejects tracked edits and tests the chosen commit in an isolated temporary checkout with locked dependencies. Do not copy environment files. Choose dependency installation versus documented local sharing explicitly; shared node_modules is not hermetic proof.
- Write a versioned report with commit/tree, timestamps, exact argv, exit status, named results and sanitized artifact hashes. Keep raw evidence ignored and outside deployment inputs. Preserve failed, skipped, blocked, pending and not-run states; a successful aggregate cannot hide a missing required step.
- Use explicit timeouts and clean up only owned processes/checkouts. Preserve source checkout, preview server and generated output.
- Validate report freshness before publishing or declaring readiness; a hash identifies an artifact but does not independently attest execution.

Acceptance/tests: fail a required command deliberately; omit a required step; simulate timeout; change HEAD during a run; supply tracked edits or untracked source; verify cleanup after failure; run a clean clone on Node 24 in CI. Each false-green case must be rejected. Confirm app tests still pass.

## Phase 2 — browser proof and push workflow

Proposed files: browser-test configuration and synthetic fixtures (runner choice below), verifier adapter, tracked hook and setup script, `tests/push-policy.test.mjs`, report publisher, CI and development docs.

- Automate the currently manual companion journeys: intake, draft reload, answer checks, checked-note invalidation, lesson navigation, old export restore, invalid import preservation, replacement cancellation and unavailable storage. Test narrow and wide viewports and keyboard use.
- Select a browser runner compatible with the existing runtime after a small spike; do not copy a Cypress requirement merely because another repo uses it. Justify any dependency.
- An explicitly installed local hook can verify the committed branch update and discourage direct `main` changes. Do not silently overwrite an existing hooksPath. Keep a documented uninstall/rollback path. Hooks are bypassable.
- A report publisher must verify repository, PR and remote head, redact before posting, retain prior revisions and read back the published result. It must not copy real learner state or personal source files.

Acceptance/tests: drive the actual shipped hook in a temporary test repo; test feature push, protected branch, tag and delete policies; reject wrong repository/PR/SHA and stale evidence; publish only an authorized synthetic report. Browser tests must catch an intentionally broken persistence/checkpoint case. Keep local previews unaffected.

## Phase 3 — independent review and merge controls

Proposed files: `.greptile/` configuration if that provider is selected, `docs/REVIEW.md`, review parser/tests and CI/ruleset documentation.

- Confirm Greptile availability and desired access on this repository. A configuration file alone does not install its GitHub app. Do not purchase or expand access implicitly.
- With the provider enabled, request one review, gather summary/comments/threads with pagination, and match explicit reviewed SHA to current PR head. A completed job is not a 5/5 verdict or resolution of findings.
- Carry supported findings through fix → proof → authorized push → re-review; stop at two correction passes or ten minutes waiting. Missing, stale or conflicting results cannot become green. Human product/style review remains separate when requested.
- Configure required CI/review checks on `main` only after confirming exact check names and repository settings. Record a failing-PR experiment and rollback. Do not claim branch protection from local hook behavior.

Acceptance/tests: stale score, missing score, unresolved old thread, paginated findings, wrong head and provider outage; one real bounded review on a small change. Separately verify server-side rules reject a failing merge. No automatic merge or deployment.

## Phase 4 — use the system to evolve `/learn`

Sequence after the development workflow is dependable:

1. Public, sanitized worked example: small change, spec, tests, review and correction. Keep engineering controls out of the beginner intake; link the example from an appropriate later lesson.
2. Cross-device progress: choose trusted identity boundary, implement server API plus D1/Drizzle migrations and record authorization, import/export/delete behavior, rollback and two-user negative tests.
3. Bounded tutoring: server-side model calls, reviewed resource IDs, cost limits, cancellation, evaluation cases and explicit learner data handling. Preserve coaching/export fallback on service failure.
4. Source watcher: explicit private intake, review queue and human acceptance into versioned public curriculum. No private-history endpoint in the client. Then consider opt-in shared branches; no leaderboard.

Affected runtime files begin with `app/learn/`, `db/schema.ts`, future server routes and their tests. Detailed data and auth decisions belong in a separate feature spec before implementation. [Current architecture](LEARNING-ARCHITECTURE.md) remains authoritative.

## Decisions and recommended defaults

| Question | Recommendation / when needed |
| --- | --- |
| Development roles or always-running agents? | Sequential responsibilities; one active agent by default. No fleet required. |
| Independent reviewer? | Greptile to match the reference, subject to repo-specific setup/access. Resolve before phase 3. |
| Verification order? | Cheap focused regression first locally; explicit complete commit gate before readiness. Browser suite becomes required once reliable. |
| New docs host? | Keep public engineering Markdown in Git for now. Add a reading surface only when audience needs justify it. Private team docs require a private source/access boundary. |
| Hook mechanism/browser dependency? | Decide in phase 2 after inspecting existing Git config and a bounded runtime spike. No dependency selected by this plan. |
| Accounts/tutor provider and budget? | ChatGPT and Google sign-in are both required (October 15). Provider setup, account linking and tutor budget remain open. Resolve before those data flows are built; public lessons remain usable without accounts. |
| Release target and authorization? | Existing hosting remains. Source publication, merge and production release are separate states. |

## Risks, validation and rollback

The main risks are private data entering public history, stale evidence being treated as current, author-controlled checks being mistaken for independent enforcement, preview disruption, and progress loss during schema changes. The rules address these now; the later automated controls need the failure tests above before being called operational.

This foundation changes documents and an instruction skill only. Validate paths, links, frontmatter and diff hygiene; do not rerun application builds solely to validate prose. Each executable phase requires its focused failure tests plus the existing application baseline. Review and release each phase separately. Revert the foundation commit to remove these instructions; later hooks require explicit local uninstall, integrations require their own settings rollback, and data changes require migration-specific recovery.
