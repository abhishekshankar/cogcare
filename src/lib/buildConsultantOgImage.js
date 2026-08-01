/**
 * Returns a data: URL for a 1200x630 SVG OG card for a consultant. Uses the
 * CogCare palette and includes name, credentials, affiliation, and the
 * licensed-states summary. Avoids fetching the photo (CORS pain across
 * crawler bots) — name typography carries the card.
 *
 * For production you'll likely want to bake these to PNG via a Lambda+
 * resvg or @vercel/og at deploy time and host them at /og/<slug>.png so
 * crawlers that don't execute SVG-as-image can still see them. This util
 * is the in-app fallback and the source of truth for the design.
 */

function escapeXml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

const AFFILIATION_LABEL = {
  in_house: 'CogCare Clinical',
  verified_partner: 'Verified Partner',
  marketplace: 'Marketplace',
}

export function buildConsultantOgSvg(consultant) {
  const name = escapeXml(consultant.name || 'CogCare Consultant')
  const credentials = escapeXml(consultant.credentials || '')
  const title = escapeXml(consultant.title || '')
  const affiliation = AFFILIATION_LABEL[consultant.affiliation] || ''
  const states = Array.isArray(consultant.licensedStates)
    ? consultant.licensedStates.join(' · ')
    : ''

  const subline = [credentials, title].filter(Boolean).join(' · ')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F5EFE0"/>
      <stop offset="100%" stop-color="#E8DCC4"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="60" y="60" width="1080" height="510" rx="32" fill="#ffffff" opacity="0.92"/>
  <text x="100" y="140" font-family="Georgia, 'Times New Roman', serif" font-size="22" letter-spacing="3" fill="#A0522D" font-weight="700">COGCARE · CONSULTANT</text>
  <text x="100" y="270" font-family="Georgia, 'Times New Roman', serif" font-size="78" fill="#3D4B3E">${name}</text>
  ${subline ? `<text x="100" y="330" font-family="Georgia, 'Times New Roman', serif" font-size="32" fill="#3D4B3E" opacity="0.78">${escapeXml(subline)}</text>` : ''}
  ${affiliation ? `<rect x="100" y="380" width="${affiliation.length * 14 + 40}" height="44" rx="22" fill="#B8D9C1" opacity="0.6"/><text x="120" y="409" font-family="Georgia, serif" font-size="22" font-weight="700" letter-spacing="2" fill="#2D3D2E">${escapeXml(affiliation.toUpperCase())}</text>` : ''}
  ${states ? `<text x="100" y="510" font-family="Georgia, serif" font-size="26" fill="#3D4B3E" opacity="0.7">Licensed: ${escapeXml(states)}</text>` : ''}
  <text x="1140" y="540" text-anchor="end" font-family="Georgia, serif" font-size="20" fill="#3D4B3E" opacity="0.55">cogcare.org</text>
</svg>`
}

export function buildConsultantOgDataUrl(consultant) {
  const svg = buildConsultantOgSvg(consultant)
  // Use base64 so OG crawlers that strip semicolons in data URLs still work.
  if (typeof btoa === 'function') {
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}
