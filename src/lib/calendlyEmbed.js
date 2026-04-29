const SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js'

let scriptPromise = null

export function loadCalendlyScript() {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.Calendly) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Calendly script failed')))
      return
    }
    const s = document.createElement('script')
    s.src = SCRIPT_SRC
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Calendly script failed'))
    document.body.appendChild(s)
  })
  return scriptPromise
}

/**
 * @param {string} bookingUrl - full Calendly event URL
 * @param {{
 *   email?: string
 *   name?: string
 *   subjectId?: string
 *   assessmentId?: string
 *   ownerSub?: string
 * }} prefill
 */
export function buildCalendlyEmbedUrl(bookingUrl, prefill = {}) {
  try {
    const u = new URL(bookingUrl, 'https://calendly.com')
    if (prefill.email) u.searchParams.set('email', prefill.email)
    if (prefill.name) u.searchParams.append('name', prefill.name)
    if (prefill.subjectId) {
      u.searchParams.append('a1', prefill.subjectId)
      u.searchParams.set('utm_source', 'cogcare-dashboard')
    }
    if (prefill.assessmentId) u.searchParams.append('a2', prefill.assessmentId)
    if (prefill.ownerSub) u.searchParams.append('a3', prefill.ownerSub)
    return u.toString()
  } catch {
    return bookingUrl
  }
}

/** @returns {() => void} cleanup */
export function subscribeCalendlyScheduled(onScheduled) {
  const handler = (e) => {
    if (!e.data || typeof e.data !== 'object') return
    if (e.data.event !== 'calendly.event_scheduled') return
    onScheduled(e.data.payload)
  }
  window.addEventListener('message', handler)
  return () => window.removeEventListener('message', handler)
}
