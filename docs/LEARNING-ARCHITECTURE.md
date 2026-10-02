# Learning course architecture decision

October 2, 2026 · first course release

## Decision

Keep the existing React / TypeScript / Vinext / Cloudflare site. Add a native `/learn` route with a small client component, versioned curriculum data, and pure domain functions. No iframe, separate application, new framework, database, or LLM dependency is needed for the current release.

Current deployment uses the Sites hosting configuration and Cloudflare Worker entry point. D1 and R2 bindings are currently null and the Drizzle schema is empty. Existing identity helpers depend on trusted hosting-platform headers; they are not an independent public authentication system.

The existing stack can render lessons, offer a wizard, select project templates, and save/export local progress. More infrastructure would not improve these learning outcomes by itself.

## What is implemented

- `app/learn/catalog.json`: stable capability IDs, six lessons, resource links, four interest branches; dated content version.
- `app/learn/model.ts`: validation, v1 pilot export migration, project selection, evidence gate, coaching prompt. Independent of React and hosting.
- `LearningCompanion.tsx`: intake, quizzes, draft evidence, self-checked checkpoints, local storage, JSON import/export, accessible inline confirmations.
- `public/learn/`: approved teaching skill, resource review notes, synthetic exercises. No private source material.
- GitHub CI: lint, typecheck, model tests, build and server-rendered route regression tests. No automatic production deployment.

Notes save as drafts while typing. Changing a checked note returns it to attempted. A correct multiple-choice answer and sufficient text only permit the label self-checked; they do not certify understanding. Unknown lesson IDs in an import cause rejection rather than silent data loss. A read failure preserves the unreadable browser data until the learner explicitly replaces or erases it.

Localhost pilot storage and production storage are separate origins. Learners use JSON export/import to move between them. The app supports v1 pilot exports and v2 exports. Draft notes are included in v2 exports. Browser storage is not a backup or cross-device account system.

## Next architectural boundaries

1. **Saved accounts:** add a server-side progress API and D1/Drizzle tables when cross-device progress is required. Use stable lesson IDs, explicit migrations, per-user authorization, deletion/export, and optimistic version checks. Prefer a straightforward relational model over a graph database.
2. **Live adaptive tutor:** server-side model calls only; validate structured responses against the reviewed catalog. Add budget/rate limits, request timeouts, cancellation, provenance, evaluation fixtures, and cost/error telemetry without logging raw private conversations by default. Start with bounded tutoring turns, not an unconstrained agent.
3. **Living curriculum:** keep private ingestion separate from public delivery. Explicit sources enter a review queue; a human accepts a versioned lesson change. Use an asynchronous job/queue only when ingestion becomes substantial. No browser-history or transcript endpoints belong in the public course client.
4. **Artifacts and sharing:** use R2 if actual uploads become necessary. Private by default, scoped access, retention/deletion, content validation and opt-in sharing. Add friends/branches only after the basic learning flow is useful. Progress evidence and access permissions remain separate concepts.

Suggested future relational entities: users, course_versions, lessons, prerequisite_edges, learner_projects, evidence_attempts, source_candidates, and sharing_grants. Store evidence attempts separately from the latest checkpoint so a correction doesn't erase history. No tables are created prematurely in this release.

## Framework risk and reassessment trigger

The installed Vinext version is `1.0.0-beta.5`. Its upstream project describes active development and compatibility gaps, especially around newer App Router features. [Primary source](https://github.com/cloudflare/vinext), reviewed October 2, 2026. The site's current routes build and render under the installed version; that does not validate every future feature.

Before accounts or paid/high-stakes tutoring, test the exact auth, session, streaming, caching, request-isolation, and deployment behavior on the production platform. If those tests expose unsupported behavior or operational instability, migrate the thin routing/hosting layer to a supported stable deployment rather than rewriting the curriculum or domain logic. Avoid upgrading the framework and introducing private learner data in the same change.

Do not trust identity headers supplied by a public caller. The trusted edge must remove incoming values and inject authenticated identity, or the application must verify its own session. Add authorization per saved record. Model agreement is not a correctness proof, and lesson completion never grants execution permissions.

## Release scope

This feature is ready for local preview and review after checks pass. Publishing the GitHub source does not deploy it to the live website. Keep production deployment as a separate release with preview verification and a rollback target.
