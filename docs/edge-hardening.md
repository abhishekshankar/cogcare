# Edge hardening (CAPTCHA, API Gateway, WAF)

The app already applies **in-Lambda** abuse controls: per-email daily limits via the **`OnboardingAttempt`** model in [`amplify/functions/completeAssessment/handler.ts`](../amplify/functions/completeAssessment/handler.ts). This document covers **optional** layers in front of the HTTPS function URL when you need stricter or IP-based protection.

## When to add edge controls

- Bots or scripted traffic hitting the function URL despite email-based caps.
- Need for **IP-based** throttling (Lambda-only caps are keyed by email, not IP).
- Compliance or security review asks for **CAPTCHA** or **WAF** explicitly.

## AWS WAF (rate-based rule)

1. Put a stable HTTPS endpoint in front of the function URL—commonly **CloudFront** with the Lambda URL (or API Gateway) as origin, or an **Application Load Balancer** if you already use one.
2. Attach an **AWS WAF web ACL** to that distribution or ALB.
3. Add a **rate-based rule** (e.g. 2,000 requests per 5 minutes per IP, tuned to your traffic) and optionally AWS Managed Rules for known bad inputs.

References: [AWS WAF rate-based rule](https://docs.aws.amazon.com/waf/latest/developerguide/waf-rule-statement-type-rate-based.html).

## API Gateway usage plans

1. Create an **HTTP API** or **REST API** in API Gateway with a route that invokes the same Lambda (or forwards to the function URL).
2. Enable **usage plans** with per-key or per-plan throttle and quota limits.
3. Update the frontend to call the **API Gateway URL** instead of the raw function URL (e.g. set `VITE_COMPLETE_ASSESSMENT_URL` to the gateway stage URL).

This adds operational overhead (keys, rotation, monitoring) but gives standard API product controls.

## CAPTCHA (server-verified)

Not implemented in this repo. A typical pattern:

1. Client loads a CAPTCHA script (**Cloudflare Turnstile**, **hCaptcha**, or **reCAPTCHA v3**).
2. On quiz completion, the client sends the CAPTCHA token **with** the existing `completeAssessment` payload.
3. Lambda verifies the token with the provider’s **secret** (store in Lambda secrets alongside Brevo) **before** creating Cognito users or sending email. Reject with **400** if verification fails.

Keep tokens **server-verified only**; never trust the client flag alone.

## Choosing a stack

| Approach | Pros | Cons |
|----------|------|------|
| Keep Lambda + `OnboardingAttempt` only | Already shipped; email-scoped | No IP-level throttle |
| WAF + CloudFront | Strong bot/IP throttling at edge | Extra infra and cost |
| API Gateway usage plans | Familiar API quotas | More moving parts |
| CAPTCHA in Lambda | Stops automated submissions | UX friction; provider setup |

See also [docs/cogcare-amplify.md](cogcare-amplify.md) for sandbox, secrets, and env vars.
