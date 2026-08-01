# Cognition Network — physician end-user acceptance suite

**Source:** [ADR Phases 5–8 — institutional platform](./adr/2026-08-01-cognition-network-phase-5-8-institutional-platform.md)
**Companion:** [General acceptance matrix](./cognition-network-acceptance-matrix.md)
**Last updated:** 2026-08-01

This document defines **physician-specific** acceptance criteria for the Cognition Network. It is not a rename of generic member tests: personas, journeys, and `PHYS-*` IDs reflect how a busy clinician actually encounters invitation, consent, optional asks, and institutional workflows.

## Physician personas

| ID | Persona | Clinical context | Network posture |
|---|---|---|---|
| **PHY-A** | Busy specialist joining privately | Behavioral neurologist; limited time; no desire for public listing | Passive, private, communications off |
| **PHY-B** | Public-profile physician | Willing to be listed for professional discovery | Public or directory visibility; name/bio consent explicit |
| **PHY-C** | Physician with communications off | Reads portal when convenient; no email cadence | Communications unchecked; institution prefs capped at `none` |
| **PHY-D** | Physician invited to contribute | Founding cohort; may submit proposals or express interest | Optional engagement; no implied endorsement |
| **PHY-E** | Physician receiving attribution / introduction / event requests | Admin-verified recognition or salon invite | Item-specific decisions; dual consent for introductions |
| **PHY-F** | Physician with wrong or missing membership | Signed in with care account, expired invite, or no Consultant row | Truthful blocking states; no data leakage |

## Journey narratives

### PHY-A — Private passive founding physician

**Preconditions:** Valid pending invitation for `founder@example.com`; physician role; Cogcare venture.

**Journey:** Opens invite link → signs in with invited email → completes onboarding with “Join privately” → lands in member workspace.

**Expected experience:** Overview shows physician role, passive membership copy, private visibility, zero matched opportunities pressure. Briefings and opportunities are optional reads. No patient dashboard links, directory browsing, or rankings.

**Risk rationale:** Physicians must not infer employment, clinical endorsement, or obligation to participate.

**Tests:** `PHYS-ONB-01`, `PHYS-PORT-01`, `PHYS-PORT-02`, `PHYS-CONTENT-01`

---

### PHY-B — Public profile with independent consents

**Preconditions:** Active membership; profile form available.

**Journey:** Enables public profile + name/bio consent while leaving communications off → saves → reloads portal.

**Expected experience:** Visibility label updates; communications remain off; revoking public profile persists after reload.

**Risk rationale:** Consent dimensions must remain independent; revocation must stick without silent re-enrollment.

**Tests:** `PHYS-CONSENT-01`, `PHYS-CONSENT-02`, `PHYS-CONSENT-04`

---

### PHY-C — Communications off; institution preferences gated

**Preconditions:** `communicationPreference: none`.

**Journey:** Opens Institution → Topics & notifications → attempts non-`none` cadence.

**Expected experience:** Non-`none` cadence options disabled until communications enabled in Profile & consent. Enabling communications unlocks cadence save.

**Risk rationale:** Notification queueing/dispatch must not bypass communication consent (ADR §Consent and safety).

**Tests:** `PHYS-PREF-01`, `PHYS-UNIT` + `AUTO-NET-NOTIF-01` (matrix)

---

### PHY-D — Optional opportunities and proposals

**Preconditions:** Published physician-targeted opportunity within venture and time window.

**Journey:** Expresses interest → withdraws → declines quietly OR submits institutional proposal.

**Expected experience:** Rationale (“Why”) visible; interest/decline/withdraw states truthful; double-submit idempotent; closed/future/venture-mismatched asks hidden.

**Risk rationale:** Opportunity interest must never imply endorsement; wrong-scope asks erode trust.

**Tests:** `PHYS-OPP-01`–`PHYS-OPP-04`, `PHYS-PROP-01`, `PHYS-ADMIN-01`

---

### PHY-E — Institutional decisions (attribution, introduction, events)

**Preconditions:** Pending attribution; pending introduction as recipient; published salon.

**Journey:** Approves/declines attribution; consents/declines introduction; RSVPs attending; hits capacity waitlist on full event.

**Expected experience:** Cross-member attribution not shown; introduction purpose only (no contact details); attendance private; terminal declines stick.

**Risk rationale:** Public attribution and introductions are high-risk consent surfaces; event RSVP must not become a social graph.

**Tests:** `PHYS-ATTR-01`–`PHYS-ATTR-02`, `PHYS-INTRO-01`–`PHYS-INTRO-02`, `PHYS-EVENT-01`

---

### PHY-F — Invitation and membership edge cases

**Preconditions:** Tokens missing, invalid, expired, revoked, accepted; or session email ≠ invite email; or no Consultant membership.

**Journey:** Follows invite URL or member portal deep link.

**Expected experience:** Clear unavailable/mismatch/no-membership states; no partial onboarding; sign-out blocks `/network/member` until re-auth.

**Risk rationale:** Invitation integrity and JWT-resolved membership prevent wrong-account data exposure.

**Tests:** `PHYS-INV-01`–`PHYS-INV-07`, `PHYS-PORT-03`, `PHYS-SESSION-01`, `PHYS-AUTH-01`

---

## Edge-case catalog

| Area | Edge case | Expected behavior | Verification |
|---|---|---|---|
| Invitation | Missing token | Unavailable + explain token required | `PHYS-INV-01` |
| Invitation | Invalid token | Not found / invalid | `PHYS-INV-02` |
| Invitation | Expired (status or `expiresAt`) | Blocked with expiry message | `PHYS-INV-03`, `PHYS-UNIT-INV-01` |
| Invitation | Revoked | Blocked | `PHYS-INV-04` |
| Invitation | Already accepted | Blocked | `PHYS-INV-05` |
| Invitation | Email mismatch | Alert + switch account CTA | `PHYS-INV-06` |
| Invitation | Revoked / accepted link re-visited | Public lookup stops disclosing invitee email/name | `PHYS-INV-07` |
| Membership | No Consultant / inactive cohort row | No membership record UI | `PHYS-PORT-03`, `PHYS-UNIT-MEM-01` |
| Content | Researcher-only briefing | Hidden from physician | `PHYS-CONTENT-01`, `PHYS-UNIT-AUD-01` |
| Content | Venture-only opportunity | Hidden until venture associated | `PHYS-OPP-02` |
| Content | Closed / future opportunity | Not listed | `PHYS-OPP-01`, `PHYS-UNIT-OPP-01` |
| Content | Zero institutional records | Truthful empty copy | `PHYS-EMPTY-01` |
| Safety | PHI / patient identifiers in feedback | Rejected | `PHYS-PROP-01`, `PHYS-UNIT-SEC-01` |
| Safety | Borderline professional clinical language in proposals | Allowed when non-PHI | `PHYS-PROP-01` |
| API | 401 / 500 / slow workspace | Safe errors / loading then content | `PHYS-API-01`, `PHYS-API-02` |
| Session | Session invalid mid-portal-use | Sign-out + redirect to login, not a broken workspace | `PHYS-API-03` |
| Event | RSVP at full capacity | Server-side waitlist, not client-trusted | `PHYS-EVENT-01`, `PHYS-UNIT-EVENT-01` |
| Session | Reload / back button | Persisted opportunity state | `PHYS-SESSION-02` |
| Session | Sign out + deep link | Login redirect | `PHYS-SESSION-01`, `PHYS-AUTH-01` |
| UX | Mobile nav + landmarks | Section nav + `main` | `PHYS-A11Y-01`, `PHYS-A11Y-02` |
| Admin | Published opportunity visible to physician | End-to-end admin → member | `PHYS-ADMIN-01` |

## Manual-only cases

| ID | Requirement | Rationale |
|---|---|---|
| `MANUAL-PHYS-SEC-01` | Consent audit rollback on Amplify compensating failure | Requires live transactional failure injection |
| `MANUAL-PHYS-NOTIF-01` | Notification dispatch cancelled when consent revoked between queue and dispatch | Covered in production pilot (`PILOT-NET-NOTIF-02`); not safe to send email in E2E |
| `MANUAL-PHYS-MTAB-01` | Multi-tab race on same opportunity response | Playwright single-context; manual cross-tab verification |
| `MANUAL-PHYS-CAP-01` | Two physicians claim the final event place concurrently | Current count-then-write is not atomic; requires a transactional reservation design before high-demand events |
| `MANUAL-PHYS-MEM-01` | More than five duplicate/care-only Consultant rows share one email | Current Amplify list-and-filter membership lookup can miss the Network row; requires an indexed unique membership key |
| `MANUAL-PHYS-TZ-01` | Event timezone display for physician in non-UTC locale | Browser locale matrix; spot-check salon copy |
| `MANUAL-PHYS-ZOOM-01` | 200% zoom reflow on profile consent fieldsets | Visual QA |
| `MANUAL-PHYS-PILOT-01` | Production pilot with synthetic `@example.com` identities | `npm run verify:network-production` only |

## Traceability — automated suites

| Suite | File | ID prefix |
|---|---|---|
| Playwright physician E2E | `e2e/network-physician.spec.js` | `PHYS-*` |
| Node physician unit | `tests/networkPhysicianAcceptance.test.js` | `PHYS-UNIT-*` |
| Existing network E2E (regression) | `e2e/network.spec.js` | `AUTO-NET-*` |
| Shared validation unit | `tests/networkApiValidation.test.js` | (shared with matrix) |

## E2E mock scenario controls

Playwright helpers reset or set Vite mock state via:

- `POST /__e2e__/network-reset` — body `{ "scenario": "default" \| "physician-empty-workspace" \| ... }`
- `POST /__e2e__/network-scenario` — body `{ "scenario": "<name>" }`

| Scenario | Purpose |
|---|---|
| `default` | Founding physician with institutional seed data |
| `physician-public-profile` | Public listing consents |
| `physician-communications-on` | Communications enabled |
| `physician-empty-workspace` | Truthful zero-content states |
| `physician-no-membership` | No Consultant row |
| `physician-cross-member-attribution` | Attribution owned by another member |
| `physician-introduction-both-parties` | Dual pending introduction |
| `physician-event-full` | Event at capacity → waitlist |
| `api-401` / `api-500` / `api-slow` | Member API fault injection |

Invite tokens (mock public data):

| Token | State |
|---|---|
| `e2e-founders-token` | Pending, valid |
| `e2e-invite-expired` | Expired via `expiresAt` |
| `e2e-invite-revoked` | Revoked |
| `e2e-invite-accepted` | Already accepted |

## Running checks (Node 20)

```bash
npx playwright test e2e/network-physician.spec.js
npx playwright test e2e/network.spec.js
npm test
npm run lint
npm run build
```

Do **not** run `npm run verify:network-production` as part of routine physician suite CI — it touches deployed Cognito/Lambda with synthetic identities.
