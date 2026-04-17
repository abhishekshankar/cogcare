import outputs from '../amplify_outputs.json'

/** Public HTTPS Function URL for POST completeAssessment (from sandbox outputs or Vite env). */
export function getCompleteAssessmentUrl() {
  const fromEnv = import.meta.env.VITE_COMPLETE_ASSESSMENT_URL
  if (typeof fromEnv === 'string' && fromEnv.trim()) return fromEnv.trim()
  const fromOutputs = outputs?.custom?.completeAssessmentFunctionUrl
  if (typeof fromOutputs === 'string' && fromOutputs.trim()) return fromOutputs.trim()
  return ''
}
