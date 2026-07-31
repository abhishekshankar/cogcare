import { escapeHtml } from './bhiReportEmailHtml.js'
import { brandLabel, roleLabel } from './networkConstants.js'
import { NETWORK_CORE_PROMISE, NETWORK_ETHICAL_SCARCITY, NETWORK_PRIMARY_ACTION, NETWORK_SECONDARY_ACTION } from './networkIntro.js'

/**
 * HTML for a Cognition Network founding invitation (preview / future Brevo send).
 * @param {{
 *   inviteeName?: string
 *   inviteUrl: string
 *   personalNote?: string
 *   roleCategory?: string
 *   brands?: string[]
 *   invitedByName?: string
 * }} params
 */
export function buildNetworkInvitationEmailHtml(params) {
  const {
    inviteeName,
    inviteUrl,
    personalNote,
    roleCategory,
    brands = [],
    invitedByName = 'The CogCare team',
  } = params

  const greeting = inviteeName ? `Dear ${escapeHtml(inviteeName)},` : 'Hello,'
  const roleLine = roleCategory
    ? `<p style="margin:0 0 16px;color:#3D4B3E;">We are inviting you as a <strong>${escapeHtml(roleLabel(roleCategory))}</strong> in our founding cohort.</p>`
    : ''
  const brandLine =
    brands.length > 0
      ? `<p style="margin:0 0 16px;color:#3D4B3E;">This invitation spans ${escapeHtml(brands.map(brandLabel).join(', '))}.</p>`
      : ''
  const noteBlock = personalNote
    ? `<blockquote style="margin:20px 0;padding:16px 20px;border-left:4px solid #A67B5B;background:#F3EFE9;color:#3D4B3E;">${escapeHtml(personalNote)}</blockquote>`
    : ''
  const understandUrl = new URL('/network#network-intro-title', inviteUrl).href

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FDFBF7;font-family:'DM Sans',Helvetica,Arial,sans-serif;color:#1A1A1A;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FDFBF7;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid #E8DCC4;border-radius:16px;overflow:hidden;">
        <tr><td style="padding:28px 28px 0;">
          <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#A67B5B;">Invitation only · No fee</p>
          <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:28px;font-weight:700;color:#1A1A1A;font-style:italic;">The Cogcare Cognition Network</h1>
          <p style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:18px;font-style:italic;color:#1A1A1A;line-height:1.4;">${escapeHtml(NETWORK_CORE_PROMISE)}</p>
        </td></tr>
        <tr><td style="padding:0 28px 28px;">
          <p style="margin:0 0 16px;color:#3D4B3E;">${greeting}</p>
          <p style="margin:0 0 16px;color:#3D4B3E;line-height:1.6;">
            ${escapeHtml(invitedByName)} has invited you to join the founding launch of
            <strong>The Cogcare Cognition Network</strong>, bringing together clinicians, researchers,
            educators, care leaders, technologists, and public-health voices.
          </p>
          ${roleLine}
          ${brandLine}
          ${noteBlock}
          <p style="margin:24px 0 16px;color:#3D4B3E;line-height:1.6;">
            Membership is invitation-only and carries no fee. You may join privately and choose whether any profile information is published.
          </p>
          <p style="margin:0 0 24px;color:rgba(61,75,62,0.75);font-size:14px;line-height:1.6;border-left:3px solid #A67B5B;padding-left:16px;">
            ${escapeHtml(NETWORK_ETHICAL_SCARCITY)}
          </p>
          <p style="margin:0 0 16px;text-align:center;">
            <a href="${escapeHtml(inviteUrl)}" style="display:inline-block;padding:14px 28px;background:#3D4B3E;color:#FFFFFF;text-decoration:none;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;">${escapeHtml(NETWORK_PRIMARY_ACTION)}</a>
          </p>
          <p style="margin:0 0 24px;text-align:center;">
            <a href="${escapeHtml(understandUrl)}" style="display:inline-block;padding:12px 24px;border:1px solid #E8DCC4;background:#FFFFFF;color:#1A3C34;text-decoration:none;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.08em;">${escapeHtml(NETWORK_SECONDARY_ACTION)}</a>
          </p>
          <p style="margin:0;font-size:12px;color:rgba(61,75,62,0.65);line-height:1.5;">
            If the button does not work, copy this link into your browser:<br>
            <a href="${escapeHtml(inviteUrl)}" style="color:#3D4B3E;word-break:break-all;">${escapeHtml(inviteUrl)}</a>
          </p>
        </td></tr>
        <tr><td style="padding:20px 28px;background:#F3EFE9;border-top:1px solid #E8DCC4;">
          <p style="margin:0;font-size:11px;color:rgba(61,75,62,0.55);">CogCare · Cognition Network founding launch</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}
