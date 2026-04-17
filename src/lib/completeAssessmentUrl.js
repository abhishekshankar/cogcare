import { getMergedAmplifyOutputs } from './amplifyOutputs.js'

/** Public HTTPS Function URL for POST completeAssessment (from sandbox outputs, Vite env, or merged overrides). */
export function getCompleteAssessmentUrl() {
  const fromEnv = import.meta.env.VITE_COMPLETE_ASSESSMENT_URL
  if (typeof fromEnv === 'string' && fromEnv.trim()) return fromEnv.trim()
  const outputs = getMergedAmplifyOutputs()
  const fromOutputs = outputs?.custom?.completeAssessmentFunctionUrl
  if (typeof fromOutputs === 'string' && fromOutputs.trim()) return fromOutputs.trim()
  return ''
}
