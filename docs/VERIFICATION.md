# Committed-source verification

Run `npm run verify` from the repository root after committing tracked changes. Node 24 is the CI baseline; macOS and Linux are supported. No extra libraries or global hook installation are required.

The verifier records HEAD and its tree, rejects tracked edits, and creates a detached temporary Git worktree. Untracked files and local environment files are excluded; tracked environment files and symlinks escaping the checkout are rejected. It installs the lockfile with a fresh `npm ci`, then runs named lint, typecheck, build and `test:checks` stages. The build runs once. The working checkout's dependencies, generated output and preview server are untouched.

Commands receive a small environment allowlist and an isolated HOME/npm configuration/cache. They do not inherit app/provider tokens or NODE_OPTIONS. This is source/dependency isolation, not a security sandbox: trusted scripts can access the machine and network. It is not a bit-for-bit hermetic build or independent attestation.

Each command has a ten-minute timeout. Interrupts and timeouts terminate the owned process group on macOS/Linux; the verifier removes its worktree and temporary files. It fails on missing scripts/lockfile, failed/blocked/missing/duplicated stages, source revision changes, tracked changes during the run or cleanup failure. Install failure blocks dependent stages; later checks retain diagnostics after a lint/type/build failure. There is no review-only success override.

Reports and raw logs are in ignored `.artifacts/verification/<run>/`. `report.json` and `report.md` include commit/tree, Node version, timestamps, command arguments, statuses and log hashes. CI uploads only the report files; raw logs stay out of the public artifact. Inspect anything before sharing it. Reports do not assert browser behavior, independent review, branch protection, merge permission or deployment.

`npm test` still builds then runs all model, route and verifier tests. `npm run test:checks` runs the tests against an existing build and is used internally by the verifier. `node --test tests/verification.test.mjs` exercises failure behavior with disposable Git/npm fixtures.

A newer commit needs a new report. A report's SHA refers to the tested commit, which can be a GitHub synthetic merge commit rather than the PR head. Preserve that distinction in PR evidence. A failing run reports its exact step; inspect the named log locally, fix the problem, commit and rerun. If cleanup fails, inspect `git worktree list` before removing only the reported temporary checkout.

CI runs this command with a 30-minute overall job timeout. Hard runner termination can prevent final reporting; absent reports and cancelled jobs are not passing proof. Local hooks and a report publisher remain separate planned work. Rollback: revert the verifier/CI change and return CI to the existing lint/typecheck/test commands.
