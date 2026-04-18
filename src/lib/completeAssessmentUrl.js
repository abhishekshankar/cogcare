import { getMergedAmplifyOutputs } from './amplifyOutputs.js'

/** @type {string | null} */
let runtimeUrl = null
/** @type {Promise<void> | null} */
let primePromise = null

function syncResolveUrl() {
  const fromEnv = import.meta.env.VITE_COMPLETE_ASSESSMENT_URL
  if (typeof fromEnv === 'string' && fromEnv.trim()) return fromEnv.trim()

  const outputs = getMergedAmplifyOutputs()
  const custom = outputs?.custom && typeof outputs.custom === 'object' ? outputs.custom : {}
  const candidates = [
    custom.completeAssessmentFunctionUrl,
    outputs?.completeAssessmentFunctionUrl,
    custom.complete_assessment_function_url,
  ]
  for (const c of candidates) {
    if (typeof c === 'string' && c.trim().startsWith('http')) return c.trim()
  }
  return ''
}

/**
 * Load same-origin /runtime-email-config.json (written at build from ampx outputs + env).
 * Resolves before quiz email POST so production always picks up the merged URL.
 */
export function primeCompleteAssessmentUrl() {
  if (primePromise) return primePromise
  primePromise = (async () => {
    try {
      const base = import.meta.env.BASE_URL || '/'
      const path = `${base.endsWith('/') ? base : `${base}/`}runtime-email-config.json`
      const res = await fetch(path, { credentials: 'omit', cache: 'no-store' })
      if (!res.ok) return
      const j = await res.json()
      const u = j?.completeAssessmentFunctionUrl
      if (typeof u === 'string' && u.trim().startsWith('https://')) {
        runtimeUrl = u.trim()
      }
    } catch {
      /* ignore — fall back to syncResolveUrl */
    }
  })()
  return primePromise
}

/**
 * Public HTTPS Function URL for POST completeAssessment.
 * Priority: runtime JSON → VITE_* → bundled amplify_outputs custom.
 */
export function getCompleteAssessmentUrl() {
  if (runtimeUrl) return runtimeUrl
  return syncResolveUrl()
}
