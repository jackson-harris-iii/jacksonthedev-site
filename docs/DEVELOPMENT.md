# Development and version control

Use Node 24 LTS, `npm ci`, then `npm run dev -- --port 5173`. Open the localhost URL printed by Vinext (normally `http://localhost:5173/learn`); this runtime may bind the IPv6 loopback rather than `127.0.0.1`.

The course is at `/learn`. Run `npm run lint`, `npm run typecheck`, and `npm test` before merging. Tests build the real Worker bundle and request the public routes, in addition to checking the pure learning model.

Keep work on feature branches and review a pull request before deployment. CI checks source and build behavior; it does not deploy to Sites or update the production domain.

Public contributions should contain reusable course content and synthetic examples only. Never add call transcripts, learner exports, private research, credentials, account state, or recordings. Public visibility does not imply permission to reuse third-party trademarks or redistribute linked videos.

The private pre-publication planning document was removed from the branch history before initial publication. Its original source and full history backup remain outside the public repository. Never push backup refs or use `git push --mirror` from a working directory holding private archival refs.

See [learning architecture](LEARNING-ARCHITECTURE.md) for the current boundaries and the criteria for adding storage, tutoring, and ingestion.
