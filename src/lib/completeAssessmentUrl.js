import { getMergedAmplifyOutputs } from './amplifyOutputs.js'

/**
 * Public HTTPS Function URL for POST completeAssessment.
 * Priority: VITE_COMPLETE_ASSESSMENT_URL → amplify_outputs custom → alternate keys (Gen 2 output shape drift).
 */
export function getCompleteAssessmentUrl() {
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
