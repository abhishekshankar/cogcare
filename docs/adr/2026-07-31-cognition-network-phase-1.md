# ADR: Cognition Network Phase 1 — Founding launch & invitation journey

**Status:** Accepted (Phase 1 complete)  
**Date:** 2026-07-31  
**Scope:** Invitation-only founding cohort for Cognition Network across CogCare, Cogtraining, and Neuro Second Opinion.

## Context

CogCare needs an invitation-only, no-fee network layer for physicians, researchers, educators, care leaders, technologists, and public-health voices. Phase 1 delivers a shippable vertical slice: public founding story, private invite links, consent-gated profiles, admin copy-link tooling, and onboarding — without automated email sends, PHI collection, or implied clinical endorsement.

## Phase 1 decisions

### Data (Amplify / DynamoDB)

- **`NetworkInvitation`** (`tokenHash` PK) for pending founding invites.
- **`Consultant`** extended with network fields: `slug`, `organization`, `profileVisibility`, `participationMode`, `publicNameConsentAt`, `ventureAssociationsJson`, `communicationPreference`, `onboardingNote`, `disclosureAcknowledgedAt`, etc.
- **`acceptNetworkInvitation` Lambda** (Function URL): JWT email must match invite; server re-validates onboarding payload; creates `Consultant`, marks invite accepted. No outbound email in this phase.

### Routes

| Route | Purpose |
|-------|---------|
| `/network` | Founding launch landing + intro tutorial |
| `/network/invite/:token` or `/network/invite?token=` | Invite validation, sign-in, onboarding, success |
| `/dr/:slug` | Public member profile (`consultantVisibility.js` gates consent + visibility) |
| `/dashboard/network` | Admin invite management (Cognito `admin` group) |

Canonical paths live in `lib/networkRoutes.js`.

### Invitation entry

- Token from **route param or query string** (`resolveNetworkInviteToken`); path style preferred via `buildNetworkInvitePath`.
- Missing/invalid/revoked/expired invites → `NetworkInviteUnavailable` with neutral copy.

### Onboarding & consent

- Minimum non-PHI fields only (name, title, organization, optional URL/bio/interests/note).
- **Four independent consent controls** (join privately, public visibility, name/bio use, communications). Joining does **not** force public listing or outreach; defaults are private + no communications.
- Shared validation: `lib/networkOnboarding.js` (`validateNetworkOnboarding`) — same rules on client and Lambda.
- `publicNameConsentAt` set only when public/directory visibility **and** explicit name/bio consent.

### Success & feedback

- Post-accept **confirmation state** on the invite page (`NetworkOnboardingSuccess`) — no immediate redirect.
- Compact feedback form with typed adapter (`src/services/networkFeedbackService.js`).
- **Production persistence ceiling** (ponytail in service): no `NetworkFeedback` Amplify model yet; production falls back to `mailto:hello@cogcare.org`. Dev writes to `/api/network-feedback` → `.local/network-feedback.jsonl`.

### Safety & compliance

- Directory-only disclaimers; no diagnosis, medical advice, or PHI in network fields.
- Neutral “Cognition Network member” badge; no implied employment, endorsement, or active participation.
- Accessibility: semantic labels, focus-visible, reduced-motion, keyboard-usable forms.

### Testing

- **Unit:** routes, consent independence, validation, feedback adapter, visibility (`tests/network*.test.js`, `tests/consultantVisibility.test.js`).
- **E2E:** `e2e/network.spec.js` — routes, missing token, private onboarding success, feedback API. Playwright sets `VITE_E2E_NETWORK_MOCKS=1` (invitation fetch + session shim only; no `window` hooks).

### Explicitly out of scope (Phase 1)

- Automated Brevo invitation sends
- Production feedback persistence
- Member directory discovery beyond existing consultants tab
- Prisma clinical layer / PHI workflows
- Open enrollment or payments

## Phase 2 — replace or extend

Phase 2 member portal is documented in [2026-07-31-cognition-network-phase-2.md](./2026-07-31-cognition-network-phase-2.md).

| Phase 1 (keep or replace) | Phase 2 direction (shipped) |
|---------------------------|---------------------------|
| Admin **copy-link only** invites | Member portal at `/dashboard/cognition-network` |
| Feedback **mailto / local JSONL** | Member portal feedback context + dev adapter |
| `Consultant.list` for `/dr/:slug` | Own-member lookup via `networkMemberLookup.js` |
| Static founding landing | Briefings + opportunities in member portal |
| Single accept Lambda | Profile update dev adapter (production Lambda deferred) |
| `VITE_E2E_NETWORK_MOCKS` shim | Extended for member portal auth + consultant mock |

## Phase 3 — replace or extend

| Phase 2 (keep or replace) | Phase 3 direction |
|---------------------------|-------------------|
| Admin **copy-link only** invites | **`sendNetworkInvitation` Lambda** + Brevo template (`lib/networkInvitationEmailHtml.js`) |
| Feedback **mailto / local JSONL** | **`NetworkFeedback` model** or authenticated Lambda behind `networkFeedbackService` ponytail |
| Profile update dev adapter | **`updateNetworkMemberProfile` Lambda** |
| Static briefings/opportunities | Admin-published models + recorded contributions |
| `VITE_E2E_NETWORK_MOCKS` shim | Remove when sandbox fixtures run in CI with real Cognition Network models in `amplify_outputs.json` |

## Activation (Phase 1)

1. Deploy Amplify Gen 2 backend (`npm run sandbox` or CI) for new models + `acceptNetworkInvitation` Function URL.
2. Ensure `acceptNetworkInvitationFunctionUrl` appears in outputs / `public/runtime-email-config.json`.
3. Add admin user to Cognito **`admin`** group for `/dashboard/network`.

## Consequences

- **Positive:** End-to-end invite → onboarding → optional public profile → admin workflow; consent model is explicit and test-covered.
- **Trade-off:** Accept + public profiles require backend deploy; invites and feedback are not fully persisted in production yet.
- **Risk:** Production feedback relies on email until Phase 2 writer ships — intentional, documented ceiling.

## Key files

**Backend:** `amplify/data/resource.ts`, `amplify/backend.ts`, `amplify/functions/acceptNetworkInvitation/`

**Shared lib:** `lib/networkConstants.js`, `lib/networkOnboarding.js`, `lib/networkFeedback.js`, `lib/networkRoutes.js`, `lib/networkInvitationStatus.js`, `lib/slugify.js`, `lib/networkInvitationEmailHtml.js`

**Frontend:** `src/pages/Network*.jsx`, `src/pages/ConsultantProfilePage.jsx`, `src/components/network/*`, `src/components/dashboard/NetworkInviteAdminTab.jsx`, `src/lib/consultantVisibility.js`, `src/lib/networkInvitations.js`, `src/services/networkFeedbackService.js`

**Tests:** `tests/network*.test.js`, `e2e/network.spec.js`, `e2e/helpers/networkE2e.js`

**Design direction:** [2026-07-31-cognition-network-design-direction.md](./2026-07-31-cognition-network-design-direction.md)  
**Copy reference:** [2026-07-31-cognition-network-copy.md](./2026-07-31-cognition-network-copy.md)
