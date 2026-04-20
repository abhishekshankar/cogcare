/**
 * Mirrors the Amplify Hosting preBuild check on `src/amplify_outputs.json`.
 * Exits 0 always (warn-only), matching amplify.yml — local stubs often lack the function URL.
 */
const fs = require('fs')
const path = require('path')

const p = path.join(__dirname, '..', 'src', 'amplify_outputs.json')
if (!fs.existsSync(p)) {
  console.error('[verify] Missing', p)
  process.exit(1)
}

const j = JSON.parse(fs.readFileSync(p, 'utf8'))
const u = (j.custom && j.custom.completeAssessmentFunctionUrl) || ''
const ok = String(u).trim().startsWith('https://')
const tag = process.env.CI ? 'preBuild' : 'verify'
console.log(`[${tag}] completeAssessmentFunctionUrl looks valid:`, ok)
if (!ok) {
  console.warn(
    `[${tag}] WARNING: Empty or non-HTTPS URL is normal for a local stub. CI runs ampx generate outputs before this check. If quiz email fails in production, set VITE_COMPLETE_ASSESSMENT_URL in Amplify Hosting to the completeAssessment Lambda Function URL.`,
  )
}

const cw = (j.custom && j.custom.calendlyWebhookFunctionUrl) || ''
const cwOk = String(cw).trim().startsWith('https://')
console.log(`[${tag}] calendlyWebhookFunctionUrl looks valid:`, cwOk)
if (!cwOk) {
  console.warn(
    `[${tag}] WARNING: Empty or non-HTTPS Calendly webhook URL is normal for a local stub. After deploy, register this URL in Calendly and set the CALENDLY_WEBHOOK_SIGNING_KEY secret to match your subscription.`,
  )
}
