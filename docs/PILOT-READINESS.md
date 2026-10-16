# Learning companion pilot

Updated October 15, 2026. [Board](https://github.com/users/jackson-harris-iii/projects/2).

## Implemented in this release

Native `/learn`, six lessons, project starters, ChatGPT sign-in, private account saves and automatic restoration on another device. Google/Gmail is available inside the hosted ChatGPT sign-in flow, which still requires a ChatGPT account. Separate Google-only OAuth is not implemented. Do not label the existing button as direct Google sign-in or close that requirement without owner agreement.

Guests can try the course locally. Account progress includes the project profile and evidence notes; it is stored in Sites-provisioned D1. Emails are not database keys. No notes are sent to an AI model, analytics service, or another learner. The site operator and hosting provider have administrative access; “private” means not publicly shared, not end-to-end encrypted.

Account-scoped browser drafts support interrupted saves. A stale revision requires an explicit choice; newer server progress is never silently overwritten. Guest migration requires confirmation, and old v1/v2 imports remain supported. JSON export is optional. Erasing account progress clears its project/notes and increments a revision tombstone; old device drafts are not remotely wiped and can be intentionally restored by their owner. No background history or private transcript ingestion.

## Verification and release

Tests cover anonymous and email-only rejection, two learners, same-origin writes, account switches, malformed/oversized input, stale writes after erase, second-device restoration, offline recovery, conflict choices, concurrent typing, and unreadable drafts. Run lint, typecheck, all tests/build, and inspect a real browser flow. Record the actual hosted revision and browser results in the release issue before claiming live readiness.

Authentication trusts only Sites dispatch, which strips caller identity headers and injects authenticated identity. Never expose the Worker directly on a public workers.dev route. Validate spoofed headers against the hosted edge before collecting real learner data. Local synthetic identity tests verify the application boundary, not real OAuth.

Rollback: redeploy the previously successful Sites version if release verification fails. The additive table can remain; do not roll back migrations or erase learner records. Old versions cannot provide account saving, so communicate that limitation if rollback is necessary.

## Small-group instructions

Share the verified `/learn` link with two or three people. Ask them to sign in, use fictional or low-stakes information, and spend 20–30 minutes on one project. Have them reload or open another device and confirm their notes return. Ask where they got stuck and which question helped them check their work.

This is a pilot: projects use templates, checkpoints are self-checked, and conversational tutoring happens in the learner's chosen assistant. It is not certification. Direct Google-only sign-in, adaptive tutoring and social branches remain separate work.
