# ADR: Cognition Network Phases 5–8 — institutional platform

**Status:** Accepted
**Date:** 2026-08-01
**Supersedes:** Phase 4 roadmap statements that opportunities, feedback, contributions, and briefings are static or local-only.

## Decision

The Cognition Network is a standalone professional institution. It uses the existing Cognito user pool only as identity infrastructure; `/network/member` and `/network/admin` remain separate from Cogcare's care-user dashboard, navigation, and role semantics.

All Network records are accessed through two function-mediated APIs:

- `networkMemberApi`: verifies a Cognito ID token, derives the email claim, and resolves exactly one `Consultant` membership. Client-supplied identity is never authoritative.
- `networkAdminApi`: verifies the same token and requires the `admin` Cognito group.

Amplify models have no broad authenticated-member access. Lambda resources receive query/mutate access at the schema boundary. Admin GraphQL access remains group-gated where operationally necessary.

## Domain model

| Record | Purpose | Important invariant |
|---|---|---|
| `NetworkBriefing` | Targeted editorial briefing | Member sees published only; non-clinical |
| `NetworkOpportunity` | Scoped optional professional ask | Draft/published/closed/archived; never implies participation |
| `NetworkOpportunityResponse` | Member's private response | Member identity comes from JWT; quiet decline is terminal and valid |
| `NetworkFeedback` | Portal feedback | No PHI; admin list omits member email |
| `NetworkConsentEvent` | Append-only consent evidence | No update/delete API; profile API rolls back if evidence fails |
| `NetworkContribution` / `NetworkImpact` | Admin-verified work and outcome | Never inferred from membership |
| `AttributionApproval` | Item-specific permission to name a member | Pending → approved/declined by that member only |
| `NetworkIntroduction` | Consent-mediated professional introduction | Both parties must independently accept before status is `consented` |
| `NetworkInitiative` / `NetworkProposal` | Institution-led work and member ideas | Proposal starts submitted; admin reviews without promising adoption |
| `NetworkEvent` / `NetworkEventResponse` | Controlled salon/event and RSVP | No public attendee list or social mechanics |
| `NetworkMemberPreference` | Topic and cadence choices | Non-none cadence requires current communication consent |
| `NetworkNotification` | Consent-enforced message and delivery ledger | Queueing and dispatch independently recheck current communication consent |
| `NetworkMetric` | Privacy-minimized outcome aggregate | No raw member activity stream or ranking |

## API contracts

Both APIs are `POST` JSON operation endpoints and return `Cache-Control: no-store`.

Member operations: `workspace`, `respondOpportunity`, `submitFeedback`, `decideAttribution`, `submitProposal`, `respondEvent`, `savePreferences`, `decideIntroduction`.

Admin operations: `dashboard`, `saveBriefing`, `saveOpportunity`, `recordContribution`, `recordImpact`, `requestAttribution`, `createIntroduction`, `saveInitiative`, `saveEvent`, `reviewProposal`, `queueNotification`, `dispatchNotification`, `recomputeMetrics`.

Unknown operations, malformed JSON, invalid enums, overlong text, and PHI/diagnostic language are rejected. The member API scopes every owned read/write by the server-resolved membership id. Admin dashboard outputs remove feedback email and opportunity-response email/note.

## State transitions

- Briefing: `draft → published → archived`.
- Opportunity: `draft → published → closed|archived`; a member response may be `interested`, `declined`, or `withdrawn`.
- Attribution: `pending → approved|declined`; only the named member decides.
- Introduction: each party independently moves its consent from `pending` to `accepted|declined`; only two accepts produce `consented`.
- Proposal: `submitted → under_review → accepted|declined`.
- Event: `draft → published → closed|archived`; RSVP is `attending|declined|waitlist|withdrawn`.
- Notification: `queued → sent`; dispatch re-fetches the member and cancels with `cancelled_no_consent` when current consent is absent. `sentAt` is proof recorded after the provider accepts delivery.

## Consent and safety

The four existing profile consent dimensions remain independent. `updateNetworkMemberProfile` compares persisted before/after values and appends `NetworkConsentEvent` in the same request. Because Amplify Data exposes no cross-model transaction here, an audit failure triggers an immediate compensating rollback and the request fails. A future transactional store may supersede this mechanism.

No Network field may contain PHI, diagnosis, or medical advice. Membership, opportunity interest, or a verified contribution never authorizes public attribution. There are no likes, follows, rankings, leaderboards, streaks, or member-browsable directory.

## Migration and deployment

The new models are additive. Existing static briefings/opportunities are development and E2E fallback only once function URLs are present. Deployment creates empty tables; administrators deliberately author or verify records after deploy. No synthetic production contribution, impact, response, consent, or outcome is seeded.

The Amplify output must expose `networkMemberApiFunctionUrl` and `networkAdminApiFunctionUrl`; hosting environment overrides are `VITE_NETWORK_MEMBER_API_URL` and `VITE_NETWORK_ADMIN_API_URL`.

## Accessibility and truthful empty states

Existing native controls and standalone Network shell remain. Empty collections explicitly say nothing is published/recorded; they do not show fabricated examples as activity. Passive/private membership and quiet decline remain satisfactory states.

## Acceptance criteria

1. An unauthenticated request cannot read or mutate Network institutional data.
2. A signed-in non-admin cannot invoke admin operations.
3. Member reads/writes are scoped to the JWT-resolved member id; item decisions verify ownership.
4. Only published, currently open opportunities appear in a member workspace.
5. Opportunity responses and feedback persist in Amplify when the function URL exists.
6. Consent changes either persist with an append-only event or the API fails and compensates.
7. Public attribution cannot be represented as approved without the named member's item-specific decision.
8. Introductions require two independent acceptances.
9. Notification queueing is refused without current communication consent.
10. Member/admin shells contain no care-user dashboard navigation.
11. Unit, build, lint, and Network E2E checks pass before production deployment.
12. Production verification uses controlled test identities only and does not contact real members.

## Non-goals

Clinical collaboration, patient records, care delivery, medical advice, public social networking, automatic email delivery, and inferred endorsements are explicitly outside the Network platform.
