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
