# Calendly on the Free plan (CogCare)

Calendly **Free** includes embeds and scheduling, but **workspace API webhooks** (`POST /webhook_subscriptions`) require a **paid** plan (e.g. Standard and above). See [Calendly pricing](https://calendly.com/pricing) and [Webhooks overview](https://help.calendly.com/hc/en-us/articles/223195488-Webhooks-overview).

## What works without upgrading

1. **Inline embed** — Dashboard → **Book a consultation** loads the Calendly widget (`Calendly.initInlineWidget` in `BookConsultPage.jsx`).
2. **Prefill** — `src/lib/calendlyEmbed.js` adds email, name, and custom params (`a1`–`a3`) to the booking URL.
3. **Browser event** — When the invitee finishes scheduling, the iframe sends `calendly.event_scheduled`. We listen in `subscribeCalendlyScheduled` and create a **`ConsultAppointment`** with **`status: pending`** via the authenticated Data client (no Lambda).
4. **Operational truth** — Invitees still receive Calendly confirmation emails; hosts see events in the Calendly UI.

## What you do not get on Free

- **No** server-side `invitee.created` / `invitee.canceled` payloads to the `calendly-webhook` Lambda, so rows are **not** automatically upgraded with Calendly invitee URI, start/end times, cancel/reschedule URLs, or cancel/sync when someone uses email links.

## Operator checklist (Free)

- Treat **Calendly scheduled events + email** as the source of truth for exact times and reschedule/cancel links.
- In CogCare, **Consultations** shows **Pending** for browser-recorded visits until you upgrade and wire webhooks (or you add a separate manual process).

## When you upgrade (Standard+)

1. Deploy backend; copy **`custom.calendlyWebhookFunctionUrl`** from `amplify_outputs.json` (or Lambda → Function URL).
2. Register the subscription: `scripts/register-calendly-webhook.mjs` with `CALENDLY_PAT` and `WEBHOOK_URL`.
3. Set Lambda env **`CALENDLY_WEBHOOK_SIGNING_KEY`** from the API response `signing_key`.
4. Webhook handler can then upsert **`ConsultAppointment`** with full metadata.
