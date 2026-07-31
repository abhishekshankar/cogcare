# ADR: Cognition Network Phase 2 — Authenticated member portal

**Status:** Accepted (Phase 2 complete)  
**Date:** 2026-07-31  
**Scope:** Smallest complete authenticated member experience behind existing Cognito auth.

## Context

Phase 1 delivered invitation-only founding onboarding, consent-gated public profiles, and admin invite tooling. Phase 2 adds a **member-only portal** for accepted founding members — without exposing other members' private data, implying endorsement, or collecting PHI.

## Decisions

### Route & gating

| Route | Purpose |
|-------|---------|
| `/dashboard/cognition-network` | Authenticated member portal (Cognito `ProtectedRoute`) |

- Tab appears only when `findMemberConsultantByEmail(email)` returns a row with `networkCohort` set.
- Admin invite tooling stays at `/dashboard/network` (admin group only).
- Unauthenticated users redirect to login; non-members redirect to `/dashboard`.

### Portal sections

1. **Overview** — cohort, role, participation mode, visibility summary + disclaimer.
2. **Cognition briefings** — static editorial cards (`lib/networkBriefings.js`); not clinical guidance.
3. **Profile & consent** — independent controls reusing `validateNetworkMemberProfile` (post-join variant of onboarding rules).
4. **Participation mode** — passive / active / selective; passive private is first-class.
5. **Contribution opportunities** — scoped optional asks with interest / decline actions.
6. **Activity & recognition** — **only** from recorded contributions (`lib/networkContributions.js`); empty state when none.
7. **Compact feedback** — reuses `NetworkOnboardingFeedback` with `member_portal` context.

### Data layer boundaries

| Concern | Phase 2 approach |
|---------|------------------|
| Read own `Consultant` | Amplify `Consultant.list` + `findMemberConsultantByEmail` (authenticated read already authorized) |
| Update own profile/consent | **Typed adapter** `networkMemberService.js` — dev `POST /api/network-member-profile`; production ponytail until `updateNetworkMemberProfile` Lambda ships |
| Briefings | Static lib seed (no PHI) |
| Opportunities / responses | Static lib seed + dev adapter `networkMemberContentService.js` |
| Contributions | Dev store only; production returns empty until recorded-contribution writer exists |
| Feedback | Extends Phase 1 `networkFeedbackService` with `member_portal` context |

**Never** use `Consultant.list` in the portal to show other members' private fields.

### Safety (unchanged from Phase 1)

- No diagnosis, medical advice, or PHI in network fields.
- Listing / membership never implies endorsement, employment, or active participation.
- Accessibility: semantic labels, focus-visible, reduced-motion-friendly spinners, keyboard-usable forms.

### Testing

- **Unit:** `tests/networkMemberLookup.test.js`, `tests/networkMemberProfile.test.js`, `tests/networkBriefings.test.js`, `tests/networkOpportunities.test.js`
- **E2E:** `e2e/network.spec.js` — auth gating, portal load, private defaults, briefing cards, opportunity interest/decline, member feedback
- **E2E auth:** `VITE_E2E_NETWORK_MOCKS=1` bypasses `ProtectedRoute`; GraphQL mock returns founding member consultant

### Explicitly out of scope (Phase 2)

- `updateNetworkMemberProfile` production Lambda
- `NetworkFeedback` / contribution persistence in Amplify
- Member-to-member directory browsing
- Automated Brevo sends
- Open enrollment

## Phase 3 — replace or extend

| Phase 2 (keep or replace) | Phase 3 direction |
|---------------------------|-------------------|
| Profile update dev adapter | Authenticated `updateNetworkMemberProfile` Lambda (JWT email = `contactEmail`) |
| Static briefings | CMS or admin-published briefing model |
| Static opportunities | Admin-scoped opportunity model + recorded contributions |
| `VITE_E2E_NETWORK_MOCKS` auth bypass | CI sandbox fixtures with real Cognition Network models |

## Key files

**Shared lib:** `lib/networkMemberProfile.js`, `lib/networkBriefings.js`, `lib/networkOpportunities.js`, `lib/networkContributions.js`, `lib/networkRoutes.js`

**Frontend:** `src/pages/NetworkMemberPortalPage.jsx`, `src/hooks/useNetworkMember.js`, `src/services/networkMemberService.js`, `src/services/networkMemberContentService.js`, `src/lib/networkMemberLookup.js`

**Dev API:** `api/network-member-profile.js`, `api/network-member-opportunity-response.js`, `api/network-member-contributions.js`

**Tests:** `tests/networkMember*.test.js`, `tests/networkBriefings.test.js`, `tests/networkOpportunities.test.js`, `e2e/network.spec.js`

**Prior ADR:** [2026-07-31-cognition-network-phase-1.md](./2026-07-31-cognition-network-phase-1.md)
