# Cognition Network Phase 3 — Integration runbook

**Date:** 2026-07-31  
**ADR:** [2026-07-31-cognition-network-phase-3.md](./adr/2026-07-31-cognition-network-phase-3.md)

## What shipped

Cross-venture integration with **no shared auth** and **consent-gated public associations**:

1. Canonical venture registry (`lib/ventureRegistry.js`)
2. Member portal venture cards + scoped opportunities
3. Admin intelligence tab (aggregate metrics)
4. Cogtraining `/cognition-network` entry point
5. NSO `cognition-network.html` entry point

## Verify locally (CogCare)

```bash
cd cogcare
npm run lint
npm run test
npm run build
npm run test:e2e -- e2e/network.spec.js
```

Dev server (port 5173 if free):

```bash
npm run dev
```

Manual checks:

| URL | Expect |
|-----|--------|
| `/dashboard/cognition-network` (E2E mock or member) | Venture cards, scoped opportunities |
| `/dashboard/network` (admin) | Invitations + **Intelligence** tabs |
| `/dr/:slug` (public + consented) | Venture association badges only with name consent |

## Verify locally (Cogtraining)

```bash
cd cogtraining
pnpm --filter @cog/web test -- lib/cognition-network.test.ts
pnpm --filter @cog/web lint
pnpm --filter @cog/web build
```

Visit `http://localhost:3000/cognition-network` — independence copy + link to CogCare hub with `returnTo`.

## Verify locally (NSO)

```bash
cd neurosecondopinion.org
node --test cognition-network.test.mjs
```

Serve static (e.g. `npx serve .`) and open `/cognition-network.html`.

## Deep link contract

```
https://{venture-origin}{path}?returnTo={encoded-return-url}
```

- `returnTo` is explicit; ventures must not set cross-domain cookies.
- Hub URL: `https://cogcare.org/network?returnTo=…`
- Member portal return default: `/dashboard/cognition-network`

## Production-only gaps

| Gap | Workaround today |
|-----|------------------|
| Intelligence requires live Amplify `NetworkInvitation` + `Consultant` | Admin must be in Cognito `admin` group; deploy backend first |
| Opportunity response aggregates in intelligence | Not persisted centrally — intelligence uses invitation + member fields only |
| `updateNetworkMemberProfile` Lambda | Dev adapter only; production profile saves are in-memory ceiling |
| Automated invitation email | Copy-link + preview only (Phase 1–2 behavior) |

## Rollout checklist (human gate items not done by agents)

- [ ] Deploy CogCare Amplify backend (if schema/Lambda changes pending)
- [ ] Deploy CogCare frontend
- [ ] Deploy Cogtraining (`cf:deploy`)
- [ ] Deploy NSO (Amplify Hosting per `DEPLOY.md`)
- [ ] Confirm footer/nav links on production origins
- [ ] Admin smoke-test intelligence tab with real invitation data

## Safety reminders

- No PHI, diagnosis, or medical advice in network copy or opportunities.
- Public venture associations require **separate** name/bio consent — never default-on.
- Listing never implies employment, endorsement, or active participation.
