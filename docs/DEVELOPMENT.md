# Development and version control

Use Node 24 LTS, `npm ci`, then `npm run dev -- --port 5173`. Open the localhost URL printed by Vinext (normally `http://localhost:5173/learn`); this runtime may bind the IPv6 loopback rather than `127.0.0.1`.

The course is at `/learn`. Run `npm run lint`, `npm run typecheck`, and `npm test` before merging. Tests build the real Worker bundle and request the public routes, in addition to checking the pure learning model.

Keep work on feature branches and review a pull request before deployment. CI checks source and build behavior; it does not deploy to Sites or update the production domain.

Public contributions should contain reusable course content and synthetic examples only. Never add call transcripts, learner exports, private research, credentials, account state, or recordings. Public visibility does not imply permission to reuse third-party trademarks or redistribute linked videos.

The private pre-publication planning document was removed from the branch history before initial publication. Its original source and full history backup remain outside the public repository. Never push backup refs or use `git push --mirror` from a working directory holding private archival refs.

See [learning architecture](LEARNING-ARCHITECTURE.md) for the current boundaries and the criteria for adding storage, tutoring, and ingestion.

Repository guidance starts in [AGENTS.md](../AGENTS.md). Use the [delivery workflow](AGENT-WORKFLOW.md) and [factory implementation plan](FACTORY-IMPLEMENTATION-PLAN.md) for the staged verification/review setup. The current CI remains operational; `npm run verify` now implements phase 1; hooks and external reviewer integrations remain planned.

After committing, run `npm run verify` for the isolated full gate. See [verification](VERIFICATION.md), [the GitHub progress board](https://github.com/users/jackson-harris-iii/projects/2), and [pilot readiness](PILOT-READINESS.md).

## Account progress preview

Declare D1 as `DB`, generate migrations with `npm run db:generate`, and build with `npm run build`. Apply new local SQL with `node node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_nappy_wind_dancer.sql` (once per local database). Preview the built Worker with `node node_modules/wrangler/bin/wrangler.js dev --config dist/server/wrangler.json --local --ip 127.0.0.1 --port 5187 --persist-to .wrangler/state`. This version's `vinext start` does not attach the D1 binding.

`tests/learn-progress.test.mjs` uses synthetic identities and SQLite to exercise the same queries, validation and synchronization controller. Real sign-in is owned by Sites dispatch and must be checked on the hosted site. Never ship a fake identity or expose a local synthetic-auth proxy beyond loopback. GET progress is private/no-store; PUT/DELETE require same-origin JSON, current verified account ID, and revision.
