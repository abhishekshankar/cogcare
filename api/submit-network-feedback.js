import {
  appendNetworkFeedbackRecord,
  resolveNetworkFeedbackStoreFile,
} from '../lib/networkFeedbackPersistence.js'

/**
 * Dev-only persistence for Cognition Network onboarding feedback.
 * Appends JSON lines to `.local/network-feedback.jsonl` (gitignored).
 *
 * @param {{ method?: string, body?: Record<string, unknown> }} req
 * @param {{ status: (code: number) => { json: (data: unknown) => void } }} res
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const result = appendNetworkFeedbackRecord(
    {
      message: typeof req.body?.message === 'string' ? req.body.message : '',
      memberEmail: typeof req.body?.memberEmail === 'string' ? req.body.memberEmail : undefined,
      slug: typeof req.body?.slug === 'string' ? req.body.slug : undefined,
      context: typeof req.body?.context === 'string' ? req.body.context : undefined,
    },
    resolveNetworkFeedbackStoreFile(),
  )

  if (!result.ok) {
    const status = result.error === 'Could not save feedback locally.' ? 500 : 400
    return res.status(status).json({
      error: result.error,
      ...(result.detail ? { detail: result.detail } : {}),
    })
  }

  return res.status(201).json({ ok: true, id: result.record.id, channel: 'local' })
}
