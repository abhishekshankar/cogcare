import fs from 'node:fs/promises'
import path from 'node:path'
import { isKnownOpportunity, validateOpportunityResponse } from '../lib/networkOpportunities.js'

const STORE = path.join(process.cwd(), '.local', 'network-member-store.json')

async function readStore() {
  try {
    const raw = await fs.readFile(STORE, 'utf8')
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

async function writeStore(store) {
  await fs.mkdir(path.dirname(STORE), { recursive: true })
  await fs.writeFile(STORE, JSON.stringify(store, null, 2))
}

/**
 * @param {{ method?: string, url?: string, body?: Record<string, unknown> }} req
 * @param {{ status: (code: number) => { json: (data: unknown) => void } }} res
 */
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const url = new URL(req.url || '', 'http://localhost')
    const email = (url.searchParams.get('email') || '').trim().toLowerCase()
    const store = await readStore()
    const responses = store.opportunityResponses?.[email] ?? []
    return res.status(200).json({ ok: true, responses })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const opportunityId = typeof req.body?.opportunityId === 'string' ? req.body.opportunityId.trim() : ''
  const kind = typeof req.body?.kind === 'string' ? req.body.kind.trim() : ''

  if (!email || !opportunityId) {
    return res.status(400).json({ error: 'email and opportunityId are required.' })
  }

  const validation = validateOpportunityResponse(kind)
  if (!validation.ok) {
    return res.status(400).json({ error: validation.error })
  }

  if (!isKnownOpportunity(opportunityId)) {
    return res.status(404).json({ error: 'This opportunity is no longer available.' })
  }

  const response = {
    opportunityId,
    kind: validation.value,
    respondedAt: new Date().toISOString(),
  }

  const store = await readStore()
  const all = store.opportunityResponses && typeof store.opportunityResponses === 'object'
    ? store.opportunityResponses
    : {}
  const existing = Array.isArray(all[email]) ? all[email] : []
  all[email] = [...existing.filter((r) => r.opportunityId !== opportunityId), response]
  store.opportunityResponses = all
  await writeStore(store)

  return res.status(200).json({ ok: true, response })
}
