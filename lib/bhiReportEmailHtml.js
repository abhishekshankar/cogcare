/**
 * Shared HTML for BHI report emails (Lambda completeAssessment + legacy api/send-quiz-email).
 * Keep in sync with product copy in dashboard report UI.
 */

/** @param {unknown} s */
export function escapeHtml(s) {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * @param {Record<string, unknown> | null | undefined} results
 * @param {{ footerSource?: 'CogCare' | 'CogCare.org' }} [options]
 */
export function buildBhiReportEmailHtml(results, options = {}) {
  const footerSource = options.footerSource ?? 'CogCare'
  const tagline =
    footerSource === 'CogCare.org'
      ? 'Summary from CogCare.org — not a clinical diagnosis.'
      : 'Summary from CogCare — not a clinical diagnosis.'

  if (!results || typeof results !== 'object') {
    return '<p>Brain Health Index results</p>'
  }

  const differentials = Array.isArray(results.differentials) ? results.differentials : []
  const domains =
    results.domains && typeof results.domains === 'object' ? results.domains : {}
  const urgency = results.urgency

  const urgencyRow = urgency
    ? `<p style="margin:16px 0;"><strong>Urgency:</strong> ${escapeHtml(urgency)}</p>`
    : ''

  const diffRows = differentials
    .map(
      (d) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(d.label)}</td>` +
        `<td style="padding:8px;border-bottom:1px solid #eee;text-align:right;font-weight:600;color:${escapeHtml(d.color)}">${escapeHtml(d.probability)}%</td></tr>`,
    )
    .join('')

  const domainRows = Object.entries(domains)
    .map(
      ([name, score]) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(name)}</td>` +
        `<td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${escapeHtml(score)}%</td></tr>`,
    )
    .join('')

  return `
<!DOCTYPE html>
<html><head><meta charset="utf-8" /></head>
<body style="font-family:Georgia,serif;color:#1A1A1A;line-height:1.5;max-width:560px;margin:0 auto;padding:24px;">
  <h1 style="font-size:22px;font-style:italic;color:#3D4B3E;">Your Brain Health Index</h1>
  <p style="color:#666;font-size:14px;">${tagline}</p>
  ${urgencyRow}
  <h2 style="font-size:12px;text-transform:uppercase;letter-spacing:0.12em;color:#888;margin-top:24px;">Differential analysis</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">${diffRows}</table>
  <h2 style="font-size:12px;text-transform:uppercase;letter-spacing:0.12em;color:#888;margin-top:24px;">Domain scores</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">${domainRows}</table>
  <p style="margin-top:32px;font-size:12px;color:#888;">Please consult a qualified healthcare professional with questions.</p>
</body></html>`
}

/**
 * Single email: BHI report + one-click dashboard link (magic link).
 * @param {Record<string, unknown> | null | undefined} results
 * @param {{
 *   magicLinkUrl: string
 *   email: string
 *   expiresInMinutes?: number
 *   isNewAccount?: boolean
 *   footerSource?: 'CogCare' | 'CogCare.org'
 * }} options
 */
export function buildBhiReportWithMagicLinkEmailHtml(results, options) {
  const {
    magicLinkUrl,
    email,
    expiresInMinutes = 15,
    isNewAccount = true,
    footerSource = 'CogCare',
  } = options

  const reportInner = buildBhiReportEmailHtml(results, { footerSource })
  const accountLine = isNewAccount
    ? `<p style="margin:0 0 16px;font-size:15px;color:#1A1A1A;">We've created your CogCare account using <strong>${escapeHtml(email)}</strong>.</p>`
    : `<p style="margin:0 0 16px;font-size:15px;color:#1A1A1A;">Sign in with one click to save this assessment to your dashboard (${escapeHtml(email)}).</p>`

  const cta = `
<div style="font-family:sans-serif;color:#1A1A1A;max-width:560px;margin:0 auto 28px;padding:20px 24px;background:#F3EFE9;border-radius:12px;border:1px solid #E8DCC4;">
  <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#A67B5B;">Your dashboard</p>
  ${accountLine}
  <p style="margin:0 0 16px;font-size:14px;color:#444;line-height:1.5;">Open the link below on this device to view your full report. The link expires in <strong>${escapeHtml(String(expiresInMinutes))} minutes</strong>. If it expires, retake the quiz from the home page or use <strong>Forgot password</strong> on the sign-in page.</p>
  <a href="${escapeHtml(magicLinkUrl)}" style="display:inline-block;padding:14px 24px;background:#3D4B3E;color:#fff;text-decoration:none;border-radius:10px;font-weight:700;font-size:14px;">Open my dashboard</a>
  <p style="margin:16px 0 0;font-size:12px;color:#666;word-break:break-all;">If the button doesn't work, copy and paste this URL:<br /><a href="${escapeHtml(magicLinkUrl)}" style="color:#3D4B3E;">${escapeHtml(magicLinkUrl)}</a></p>
</div>`

  return reportInner.replace(
    /<body[^>]*>/,
    (open) => `${open}${cta}`,
  )
}
