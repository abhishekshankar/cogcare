# ADR: Cognition Network Phase 3 — Cross-venture ecosystem integration

**Status:** Accepted (Phase 3 complete)  
**Date:** 2026-07-31  
**Scope:** Smallest safe cross-venture integration across CogCare, Cogtraining, and Neuro Second Opinion — registry, consent-gated associations, portable deep links, admin intelligence, and sibling entry points. No cross-domain auth, PHI, or backend mutations in this phase.

## Context

Phases 1–2 delivered invitation-only founding onboarding and an authenticated member portal on CogCare. Phase 3 connects the three ventures with a **canonical registry** and **consent-aware association contract**, while preserving venture independence and the Phase 1–2 safety model.

## Decisions

### Canonical venture registry (`lib/ventureRegistry.js`)

| Venture ID | Label | Origin | Network entry |
|------------|-------|--------|-----------------|
| `cogcare` | CogCare | `https://cogcare.org` | `/network` |
| `cogtraining` | Cogtraining | `https://cogtraining.org` | `/cognition-network` |
| `nso` | Neuro Second Opinion | `https://neurosecondopinion.org` | `/cognition-network.html` |

- `NETWORK_BRANDS` in `lib/networkConstants.js` derives from the registry (backward compatible).
- `buildVentureDeepLink({ ventureId, path, returnTo })` produces portable URLs with explicit `returnTo` — **no** cross-domain cookies, shared credentials, or SSO.

### Consent-aware member association (`lib/networkVentureAssociation.js`)

- Members select venture associations in the portal (directory context only).
- **Public** display of associations on `/dr/:slug` requires `publicNameConsentAt` **and** public/directory visibility — same gate as name/bio.
- `filterOpportunitiesForVentures` scopes contribution opportunities to associated ventures.
- Independence copy: `VENTURE_INDEPENDENCE_DISCLAIMER`.

### Member portal (extend Phase 2)

- **Venture cards** (`NetworkVentureCards`) — cross-venture navigation with `returnTo` back to `/dashboard/cognition-network`.
- **Scoped opportunities** — cogtraining + NSO asks added to `NETWORK_OPPORTUNITIES`; filtered per member associations in `networkMemberContentService`.

### Admin network intelligence (`NetworkIntelligencePanel`)

Route: `/dashboard/network` → **Intelligence** tab (alongside Invitations).

Aggregate, non-PHI metrics only:

- First **10 / 30 / 100** cohort progress
- Invitation states (pending, accepted, revoked, expired)
- Consent coverage (public name consent, private members, communications opt-in)
- Participation mode distribution
- Venture association counts (aggregate)
- Engagement health score (derived from acceptance rate + participation — no individual drill-down)

Computed client-side via `computeNetworkIntelligence` from `NetworkInvitation.list` + `Consultant.list` (admin auth).

### Sibling venture entry points

| Venture | Surface | Links to |
|---------|---------|----------|
| Cogtraining | `/cognition-network` + footer | `https://cogcare.org/network?returnTo=…` |
| Neuro Second Opinion | `cognition-network.html` + footer | `https://cogcare.org/network?returnTo=…` |

Each page states independence / no-endorsement language and does **not** imply shared login.

### Explicitly out of scope (Phase 3)

- `sendNetworkInvitation` Lambda + automated Brevo sends
- `NetworkFeedback` / contribution persistence in Amplify
- `updateNetworkMemberProfile` production Lambda
- Cross-domain session, SSO, or shared cookies
- Public publishing of unapproved venture names on sibling sites
- PHI, diagnosis, or medical advice in network fields

## Testing

- **Unit:** `tests/ventureRegistry.test.js`, `tests/networkVentureAssociation.test.js`, `tests/networkIntelligence.test.js`; extended `tests/networkOpportunities.test.js`
- **E2E:** `e2e/network.spec.js` — venture cards, intelligence tab, scoped opportunities
- **Sibling:** `apps/web/lib/cognition-network.test.ts` (Cogtraining); `cognition-network.test.mjs` (NSO)

## Key files

**Registry & contract:** `lib/ventureRegistry.js`, `lib/networkVentureAssociation.js`, `lib/networkIntelligence.js`

**UI:** `src/components/network/NetworkVentureCards.jsx`, `src/components/dashboard/NetworkAdminPanel.jsx`, `src/components/dashboard/NetworkIntelligencePanel.jsx`

**Runbook:** [cognition-network-phase-3-runbook.md](../cognition-network-phase-3-runbook.md)

**Prior ADRs:** [Phase 1](./2026-07-31-cognition-network-phase-1.md) · [Phase 2](./2026-07-31-cognition-network-phase-2.md)

## Consequences

- **Positive:** One registry, consent-gated public associations, portable deep links, admin cohort visibility, clear sibling entry points.
- **Trade-off:** Intelligence is admin-client aggregation until a dedicated read-only Lambda ships; opportunity/engagement response rates not in intelligence until persistence exists.
- **Risk:** Production intelligence requires Amplify deploy + admin Cognito group — same as Phase 1.
