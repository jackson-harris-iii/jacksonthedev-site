# Small pilot and saved progress

Product decision: October 15, 2026. Support both **Continue with ChatGPT** and **Continue with Google** (including Gmail accounts). Learners should resume across devices without moving JSON files.

## What exists

The native `/learn` course is on the feature branch/PR: six lessons, interest-based project starters, browser autosave, self-checked evidence, JSON portability and exported coaching prompts. The live website is separate from this checkout. A GitHub push is not deployment, and a localhost URL cannot be sent to remote testers.

This is suitable for a guided feedback session after the host URL is verified. It is not yet a finished self-serve course with account recovery or an in-site adaptive tutor. On the same browser/origin, ordinary return visits already restore progress automatically. JSON is currently the cross-device/backup mechanism, not required for every visit.

## Pilot gates

- Hosted native `/learn` route and teaching downloads work on the intended public URL; record the deployed revision and rollback.
- Mobile/desktop intake, one lesson, saved notes after reload and recovery/error states verified with synthetic inputs.
- Tester instructions say template-based projects and self-checked evidence, with local-only progress limitations until accounts ship.
- Ask two or three learners to spend 20–30 minutes on one objective. Observe whether they can start, produce an artifact, explain one check and resume. Ask where they got stuck and what they would change.
- Keep feedback private unless explicitly approved for public publication. Do not collect real employer/family data as exercise material.

## Account and persistence design requirements

Sites documentation confirms hosted ChatGPT identity and a stable per-Site `oai-authenticated-user-id`. The existing helper currently centers on email; it needs adaptation before owning persisted records. Sites owns the sign-in/callback routes. Do not replace that stack or assume a public caller's identity headers are trusted.

Direct Google login support on this hosting boundary is not yet established. Confirm a supported integration and its server-side session boundary, provider registration, consent/redirect configuration and secret storage before implementation. A Google login option within ChatGPT's own login screen is not proof that we implemented a separate Google sign-in option on this site.

Use an internal learner ID and verified provider subject mappings. Email is display/contact data, not an automatic merge key. Linking ChatGPT and Google requires explicit proof while signed in, a conflict/recovery flow and tests. Do not silently merge two records because emails match.

Once identity is established, implement D1/Drizzle-backed progress with per-user API authorization, versioned optimistic updates, save/offline/error state, recoverable local drafts, explicit migration of existing v1/v2 browser progress, and export/delete controls. Keep public lessons anonymous-compatible. Test two different users and two devices, stale concurrent edits, session expiry, CSRF, malformed payloads and partial migration recovery. Update privacy copy before any learner data leaves the browser.

## Tracking

[Board](https://github.com/users/jackson-harris-iii/projects/2) · [Sign-in](https://github.com/jackson-harris-iii/jacksonthedev-site/issues/3) · [Automatic cross-device progress](https://github.com/jackson-harris-iii/jacksonthedev-site/issues/4) · [Pilot release](https://github.com/jackson-harris-iii/jacksonthedev-site/issues/5).

Accounts and automatic recovery are higher priority than live tutoring or social branches. Provider setup is an explicit dependency; no nonfunctional login buttons ship as a substitute.
