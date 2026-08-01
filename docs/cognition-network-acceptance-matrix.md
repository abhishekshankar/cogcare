# Cognition Network — end-user acceptance matrix

**Source:** [ADR 2026-08-01 — institutional platform](./adr/2026-08-01-cognition-network-phase-5-8-institutional-platform.md)
**Last updated:** 2026-08-01

This matrix maps promised member and administrator experiences, security/consent invariants, and non-goals to automated and manual verification IDs. Automated IDs are implemented in this repository unless marked manual-only.

## Personas

| Persona | Description |
|---|---|
| **Public visitor** | Unauthenticated; may view founding landing, invite entry, consultant slug (if public). |
| **Invited founder** | Accepts invitation token; completes onboarding and optional feedback. |
| **Network member** | Cognito-authenticated consultant with JWT-resolved membership; uses `/network/member`. |
| **Network admin** | Cognito user in `admin` group; uses `/network/admin`. |
| **Care user** | Cogcare patient/dashboard user — must not see Network institutional navigation mixed into care flows. |

## Security and consent invariants

| ID | Invariant | Verification |
|---|---|---|
| SEC-01 | Unauthenticated requests cannot read or mutate Network institutional data | AUTO-NET-SEC-01, PILOT-NET-SEC-01 |
| SEC-02 | Signed-in non-admin cannot invoke admin operations | AUTO-NET-ADM-05, UNIT-NET-SEC-02, PILOT-NET-SEC-02 |
| SEC-03 | Member reads/writes scoped to JWT-resolved member id | UNIT-NET-SEC-03, PILOT-NET-SEC-03 |
| SEC-04 | Item decisions verify ownership (attribution, introduction party) | UNIT-NET-SEC-04, PILOT-NET-SEC-04 |
| SEC-05 | Unknown operations, malformed JSON, invalid enums rejected | UNIT-NET-SEC-05, PILOT-NET-SEC-05 |
| SEC-06 | Overlong text and PHI/diagnostic language rejected | UNIT-NET-SEC-06, AUTO-NET-SEC-06, PILOT-NET-SEC-06 |
| SEC-07 | Consent changes append evidence or API fails with compensation | MANUAL-NET-SEC-07, PILOT-NET-SEC-07 |
| SEC-08 | Public attribution requires item-specific member approval | AUTO-NET-ATTR-01, PILOT-NET-ATTR-01 |
| SEC-09 | Introductions require two independent acceptances | AUTO-NET-INTRO-01, PILOT-NET-INTRO-01 |
| SEC-10 | Notification queueing refused without communication consent | AUTO-NET-NOTIF-01, PILOT-NET-NOTIF-01 |
| SEC-11 | Notification dispatch re-checks consent (no silent send) | PILOT-NET-NOTIF-02 (consent is revoked before dispatch; delivery must cancel) |
| SEC-12 | Admin dashboard omits member email from feedback and opportunity notes | PILOT-NET-PRIV-01 |
| SEC-13 | No care-user dashboard navigation in Network shells | AUTO-NET-NAV-01 |
| SEC-14 | No member directory, likes, rankings, or social mechanics | MANUAL-NET-SEC-14, AUTO-NET-NAV-02 |
| SEC-15 | Production pilot uses synthetic identities only; zero email dispatch | PILOT-NET-SAFE-01 |

## Public and authentication separation

| ID | Requirement | Persona | Verification |
|---|---|---|---|
| PUB-01 | Founding landing loads with institutional promise and passive-membership copy | Public | AUTO-NET-PUB-01 |
| PUB-02 | Member sign-in is Network-branded; no patient “New here” signup | Public | AUTO-NET-PUB-02 |
| PUB-03 | Admin route redirects unauthenticated users to login with admin role | Public | AUTO-NET-PUB-03 |
| PUB-04 | Member portal redirects unauthenticated users to Network login | Public | AUTO-NET-PUB-04 |
| PUB-05 | Admin login shows administrator branding when `role=admin` | Public | AUTO-NET-PUB-05 |
| PUB-06 | Invite without token shows unavailable state | Public | AUTO-NET-INV-01 |
| PUB-07 | Invalid invite token shows unavailable state | Public | AUTO-NET-INV-02 |
| PUB-08 | Cross-venture return link when `returnTo` is sibling venture | Public | AUTO-NET-PUB-06 |
| PUB-09 | Unknown consultant slug shows not found | Public | AUTO-NET-PUB-07 |

## Member workspace — private / passive experience

| ID | Requirement | Verification |
|---|---|---|
| MEM-01 | Overview shows private defaults and passive-membership validity | AUTO-NET-MEM-01 |
| MEM-02 | Section navigation covers overview, briefings, profile, opportunities, activity, institution, feedback | AUTO-NET-MEM-02 |
| MEM-03 | Venture cards explain independence from endorsement | AUTO-NET-MEM-03 |
| MEM-04 | No patient dashboard links (My tests, Consultations, etc.) | AUTO-NET-NAV-01 |
| MEM-05 | Mobile viewport preserves main landmarks and section nav | AUTO-NET-A11Y-02 |

## Member workspace — institutional sections

| ID | Requirement | Verification |
|---|---|---|
| INS-01 | Briefings section shows editorial content or truthful empty state | AUTO-NET-INS-01 |
| INS-02 | Opportunities explain rationale; interest, quiet decline, withdrawal, and re-entry work | AUTO-NET-INS-02, AUTO-NET-OPP-01, AUTO-NET-OPP-02, AUTO-NET-OPP-03 |
| INS-03 | Activity shows verified contributions only or truthful empty state | AUTO-NET-INS-04 |
| INS-04 | Attribution panel: approve/decline pending items; empty when none | AUTO-NET-ATTR-01, AUTO-NET-ATTR-02 |
| INS-05 | Introduction panel: dual consent; decline quietly | AUTO-NET-INTRO-01, AUTO-NET-INTRO-02 |
| INS-06 | Initiatives list and proposal submission | AUTO-NET-INS-05 |
| INS-07 | Events RSVP attending/decline; no public attendee list copy | AUTO-NET-INS-06 |
| INS-08 | Preferences: non-none cadence disabled without communications consent | AUTO-NET-INS-07 |
| INS-09 | Feedback saves from portal | AUTO-NET-INS-08 |
| INS-10 | Profile & consent: independent dimensions; save persists | AUTO-NET-INS-09 |

## Administrator operations

| ID | Requirement | Verification |
|---|---|---|
| ADM-01 | Intelligence tab shows privacy-minimized metrics | AUTO-NET-ADM-01 |
| ADM-02 | Operations tab loads institution operations shell | AUTO-NET-ADM-02 |
| ADM-03 | Author briefing and opportunity forms present | AUTO-NET-ADM-03 |
| ADM-04 | Record contribution/impact, introduction, event, attribution, notification queue UI | AUTO-NET-ADM-04 |
| ADM-05 | Non-admin authenticated user sees access required | AUTO-NET-ADM-05 |
| ADM-06 | Authoring/review flows persist via API (production) | PILOT-NET-ADM-01 |

## Onboarding

| ID | Requirement | Verification |
|---|---|---|
| ONB-01 | Private onboarding submission shows success with private defaults | AUTO-NET-ONB-01 |
| ONB-02 | Post-onboarding feedback saves | AUTO-NET-ONB-02 |

## Traceability — automated test files

| Suite | File | IDs covered |
|---|---|---|
| Playwright E2E | `e2e/network.spec.js` | AUTO-NET-* |
| Node unit | `tests/networkAcceptanceApi.test.js` | UNIT-NET-* |
| Node unit | `tests/networkApiValidation.test.js` | UNIT-NET-SEC-06 (partial) |
| Node unit | `tests/networkOwnership.test.js` | UNIT-NET-SEC-03 |
| Node unit | `tests/networkAdminAuth.test.js` | UNIT-NET-SEC-02 |
| Node unit | `tests/networkLoginSeparation.test.js` | AUTO-NET-PUB-03, AUTO-NET-PUB-05 (static) |
| Production pilot | `scripts/network-production-pilot.mjs` | PILOT-NET-* |

## Manual-only checks

| ID | Requirement | Rationale |
|---|---|---|
| MANUAL-NET-SEC-07 | Consent rollback on audit failure | Requires live Amplify compensating transaction |
| MANUAL-NET-SEC-14 | No public member directory browsing | Product policy; no UI surface to automate |
| MANUAL-NET-DEPLOY-01 | Amplify outputs expose both function URLs | Post-deploy infrastructure check |

## Production pilot safety contract

The pilot script (`npm run verify:network-production`):

1. Creates uniquely named `@example.com` Cognito users with `MessageAction: SUPPRESS`.
2. Calls `dispatchNotification` only after revoking the synthetic member's consent; the API must cancel before reaching any email provider.
3. Creates only records tagged with `runId`; deletes all in `finally`.
4. Emits per-check JSON results and a summary with `communicationsSent: 0`.
