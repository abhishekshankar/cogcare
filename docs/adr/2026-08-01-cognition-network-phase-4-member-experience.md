# ADR: Cognition Network Phase 4 — Professional member experience specification

**Status:** Accepted (Phase 4 IA + privacy boundary shipped against Phase 2–3 data and adapters)
**Date:** 2026-08-01
**Scope:** Full target specification for the professional/advisor member experience at `/network/member`, plus the smallest honest improvement to information architecture and membership read authorization shippable now.

**Prior ADRs:** [Phase 1](./2026-07-31-cognition-network-phase-1.md) · [Phase 2](./2026-07-31-cognition-network-phase-2.md) · [Phase 3](./2026-07-31-cognition-network-phase-3.md)

---

## Context

Phases 1–3 shipped invitation-only onboarding, a consent model, an authenticated member portal, cross-venture association, and a production `updateNetworkMemberProfile` Lambda (JWT-verified profile writes). The portal worked but read as a flat stack of cards with no wayfinding, contribution opportunities stated *what* was being asked without *why*, and production membership reads still used `Consultant.list` in the browser — a privacy boundary violation.

This ADR does two things:

1. Specifies the **complete target member experience** — proposition, personas, IA, lifecycle, surfaces, requirements, boundaries — so future phases have one place to check against.
2. Records the **Phase 4 decisions actually shipped**: in-page workspace navigation; opportunity "why" field end-to-end; server-authorized GET-my-membership on the existing `updateNetworkMemberProfile` function URL; professional workspace framing in Overview.

---

## 1. Member proposition

**Core promise (unchanged):** A trusted circle advancing better cognitive care.

The Cognition Network member experience is a **private professional institution**, not a patient dashboard and not a social network. A member should feel: personally recognized, under no obligation to perform, in full control of what (if anything) becomes visible, and free to leave activity blank without penalty.

## 2. Personas & participation modes

| Persona | Typical entry | Primary use of the portal |
|---|---|---|
| Physician / clinician | Personal invite from a founding host | Skim briefings, keep passive private membership |
| Researcher | Personal invite | Review scoped opportunities tied to their field |
| Educator (Cogtraining) | Personal invite, cogtraining venture association | Curriculum-adjacent opportunities |
| Care leader | Personal invite | Directory visibility for institutional credibility |
| Builder / technologist | Personal invite | Cross-venture navigation, opportunity review |

Participation modes (`lib/networkMemberProfile.js`, unchanged): **passive**, **active**, **selective**. Passive is first-class at every surface — it is never the class treated as "incomplete."

## 3. Information architecture (target)

```
/network/member  (standalone Network shell — no Cogcare patient nav)
├─ Overview           membership, cohort, role, participation, visibility summary
├─ Briefings           editorial, non-clinical
├─ Ventures             (conditional — only if member has venture associations)
├─ Profile & consent    four independent consent controls
├─ Matched opportunities scoped, optional, why + time + scope, quiet decline
├─ Verified contributions only recorded contributions; explicit empty state
└─ Feedback              compact, reuses onboarding feedback adapter
```

A sticky in-page section nav (shipped this phase) sits above Overview, one anchor per rendered section. It is plain `<a href="#id">` markup — keyboard-reachable via normal tab order, no JS focus management required, no new component.

## 4. Lifecycle

1. Invitation accepted (Phase 1) → `Consultant` record created, private + no-communications defaults.
2. First authenticated portal visit → Overview renders current state; no forced tour, no stepper, no % complete.
3. Member may, in any order and at any time: adjust consent, respond to an opportunity, associate ventures, or do nothing.
4. Declining an opportunity or staying fully passive is a terminal, satisfactory state — not a funnel step.
5. Any recorded contribution appears under Activity; membership alone never fabricates activity.

## 5. Detailed surfaces (shipped now vs. next vs. later)

| Surface | Shipped now (Phase 2–4) | Next (Phase 5 candidate) | Later |
|---|---|---|---|
| Overview | Cohort, role, participation, visibility, matched-opportunity and contribution summaries, passive callout, disclaimer | — | — |
| Briefings | Static editorial cards (`lib/networkBriefings.js`) | Admin-published briefing model | Per-member relevance filtering |
| Ventures | Cards scoped to member's own associations; portable deep links | — | Venture-specific activity rollups |
| Profile & consent | Four independent controls; production `updateNetworkMemberProfile` Lambda POST (JWT) | Change history / audit log for the member | — |
| Membership read | Production GET on same function URL — JWT email, server-side `Consultant` query, single row returned | — | — |
| Matched opportunities | Why + scope + time + brand; interest/decline UI; venture-filtered; **session/dev persistence only** | Persisted responses via Amplify model | Admin-authored opportunities, closing reminders |
| Verified contributions | Only `lib/networkContributions.js` recorded entries; explicit empty state | Recorded-contribution writer (Amplify) | Aggregate, opt-in peer benchmarking (never rankings) |
| Feedback | Reuses onboarding adapter, `member_portal` context; dev/local persistence only | `NetworkFeedback` Amplify model | — |
| Workspace nav | Sticky in-page section anchors (Phase 4) | — | Persisted last-visited section (local only, no tracking) |

## 6. Functional requirements

- FR1: Portal MUST render only the signed-in member's own data. Broad authenticated reads on `Consultant` are disabled; production member reads derive email from the verified JWT, while care-side directory reads use a consent-filtered public projection.
- FR2: Every consent control MUST be independently toggleable; enabling one MUST NOT silently enable another.
- FR3: Declining or ignoring an opportunity MUST NOT alter membership status, participation mode, or visibility.
- FR4: Activity MUST show an explicit empty state when no contributions are recorded — never an inferred or synthetic entry.
- FR5: In-page navigation MUST be reachable by keyboard alone (native anchors satisfy this) and MUST NOT require JavaScript to be visible (progressive: plain links, no client-side router needed for scroll).
- FR6: No section may imply endorsement, employment, or active participation from mere presence in a list.

## 7. Consent, authorization, and data boundaries

Unchanged from Phase 1–3 (see [copy reference](./2026-07-31-cognition-network-copy.md) and [Phase 2 ADR](./2026-07-31-cognition-network-phase-2.md)):

- No PHI, diagnosis, or medical advice in any network field.
- Four independent consents: join privately, public visibility, name/bio use, communications.
- `publicNameConsentAt` set only when public/directory visibility **and** explicit name/bio consent.
- Membership and Cognito auth are shared infrastructure; the Network shell, nav, and sign-out are standalone — no Cogcare patient dashboard component is reachable from `/network/member`.

**Phase 4 membership read/write adapter (`networkMemberService.js`):**

| Environment | Read own `Consultant` | Update profile |
|---|---|---|
| Production | `GET` `updateNetworkMemberProfileFunctionUrl` + Bearer id token | `POST` same URL + Bearer id token |
| Vite dev (no function URL) | `GET /api/network-member-profile?email=` (dev store only) | `POST /api/network-member-profile` |
| E2E (`VITE_E2E_NETWORK_MOCKS`) | GraphQL mock (dashboard auth bypass) or function URL mock | dev adapter when mocks enabled (no Cognito JWT in Playwright) |

Never trust a client-supplied email for authorization in production.

Broad authenticated GraphQL reads on `Consultant` are removed. Administrator reads remain group-gated. The normal Cogcare consultant directory now uses `getNetworkPublicData?directory=1`, which returns only active, separately consented public/directory projections and omits private Network fields.

## 8. Accessibility

- Semantic headings retained (`h1`/`h2`/`h3` unchanged by this phase).
- New nav uses `<nav aria-label="Member workspace sections">` with plain anchor children — no custom tab widget, no `role` overrides, so screen readers get native link semantics.
- `sticky` positioning does not trap focus or scroll; `prefers-reduced-motion` rules already apply globally and are untouched.
- Opportunity "why" text uses the same `networkLabel` / `networkBodySm` tokens as the rest of the card — no new contrast risk.

## 9. Analytics events

No analytics pipeline exists for the Network surfaces today (confirmed by reading `src/services/network*.js` — none call an analytics client). This ADR does **not** introduce one. If/when analytics are added, the target event set is:

| Event | Trigger | Notes |
|---|---|---|
| `network_portal_view` | Portal mount | No PII beyond authenticated email hash |
| `network_section_nav_click` | In-page anchor click | Section id only |
| `network_opportunity_response` | Interest/decline | Opportunity id + response kind, no free text |
| `network_consent_change` | Profile save | Which consent flags changed, not their values |

Until a decision is made to instrument these, they remain **later** — do not claim they are shipped.

## 10. Non-goals (explicit, unchanged intent from Phase 1–3, restated for this ADR)

- No social feed, likes, reactions, or follower counts.
- No points, streaks, badges, or leaderboards.
- No member-to-member directory browsing.
- No fabricated outcomes, testimonials, or activity.
- No persistence claims beyond what adapters actually write (see §5 table).

## 11. Staged roadmap

- **Shipped now (Phase 4):** in-page workspace navigation; opportunity "why" field end-to-end; GET-my-membership on `updateNetworkMemberProfile` function URL; removal of broad authenticated `Consultant` reads; consent-filtered care-directory projection; professional workspace Overview framing; this spec.
- **Next (Phase 5 candidate):** `NetworkFeedback` Amplify model; recorded-contribution writer; opportunity-response persistence via Amplify.
- **Later:** admin-authored briefings/opportunities; analytics instrumentation; audit history on the member's own consent changes.

Note: production profile **writes** via `updateNetworkMemberProfile` Lambda shipped in Phase 3 backend work — Phase 4 adds the matching **read** path and closes the browser `Consultant.list` boundary.

## 12. Launch acceptance criteria (measurable)

1. `/network/member` renders Overview, Briefings, Profile & consent, Matched opportunities, Verified contributions, and Feedback for an authenticated member with a `Consultant` record — verified by `e2e/network.spec.js`.
2. Ventures section renders only when the member has at least one venture association — verified by conditional render + existing venture E2E test.
3. Every rendered `NETWORK_OPPORTUNITIES` entry includes a non-empty `why` field that does not contain "diagnos" or "PHI" — verified by `tests/networkOpportunities.test.js`.
4. The workspace section nav exposes one anchor per rendered section and each target id exists in the DOM — verified by `tests/networkMemberWorkspace.test.js` and E2E.
5. No Cogcare patient-dashboard navigation (e.g. "My tests", "More tests", "Consultations") is present anywhere under `/network/member` — verified by E2E assertion.
6. Declining an opportunity or leaving all consent at private/no-communications defaults never blocks portal load or shows an error state — verified by existing passive-path E2E coverage.
7. `networkMemberService.js` does not call `Consultant.list` in production — verified by `tests/networkMemberService.test.js`; production reads use JWT-backed GET.

## Consequences

- **Positive:** Closes IA gaps (wayfinding, opportunity rationale, institutional Overview) and the membership read privacy boundary without new models or dependencies.
- **Trade-off:** The sticky nav is a flat anchor list, not a true sidebar with active-section highlighting — acceptable for a single-scroll portal at current section count; revisit if sections exceed ~8.
- **Risk:** Opportunity responses and contributions still lack production persistence — UI states this honestly. Admin intelligence still uses admin-gated `Consultant.list` client-side (admin-only surface).

## Key files

**Spec (this ADR):** `docs/adr/2026-08-01-cognition-network-phase-4-member-experience.md`

**Changed:** `amplify/data/resource.ts`, `amplify/functions/updateNetworkMemberProfile/handler.ts`, `amplify/functions/getNetworkPublicData/handler.ts`, `lib/networkOpportunities.js`, `lib/networkMemberWorkspace.js`, `src/services/networkMemberService.js`, `src/services/consultantDirectoryService.js`, `src/pages/NetworkMemberPortalPage.jsx`, `api/network-member-profile.js`, `tests/networkConsultantPrivacy.test.js`, `tests/networkOpportunities.test.js`, `tests/networkMemberWorkspace.test.js`, `tests/networkMemberService.test.js`

**Unchanged, referenced:** `lib/networkBriefings.js`, `lib/networkContributions.js`, `lib/networkMemberProfile.js`, `lib/networkVentureAssociation.js`, `src/hooks/useNetworkMember.js`, `src/pages/NetworkWorkspacePage.jsx`, `amplify/backend.ts`
