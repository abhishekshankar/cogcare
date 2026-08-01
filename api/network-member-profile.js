import fs from 'node:fs/promises'
import path from 'node:path'
import {
  memberProfilePatchFromValidated,
  validateNetworkMemberProfile,
} from '../lib/networkMemberProfile.js'
import { findMemberConsultantByEmail } from '../src/lib/networkMemberLookup.js'

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
 * @param {{ method?: string, body?: Record<string, unknown>, query?: Record<string, string | string[] | undefined> }} req
 * @param {{ status: (code: number) => { json: (data: unknown) => void } }} res
 */
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const rawEmail = req.query?.email
    const email =
      typeof rawEmail === 'string'
        ? rawEmail.trim().toLowerCase()
        : Array.isArray(rawEmail)
          ? String(rawEmail[0] || '').trim().toLowerCase()
          : ''
    if (!email) {
      return res.status(400).json({ error: 'email query parameter is required.' })
    }

    const store = await readStore()
    const profiles = store.profiles && typeof store.profiles === 'object' ? store.profiles : {}
    const consultant = profiles[email]
    if (!consultant || !findMemberConsultantByEmail([consultant], email)) {
      return res.status(404).json({ error: 'No membership record found.' })
    }
    return res.status(200).json({ ok: true, consultant })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : ''
  const consultantId = typeof req.body?.consultantId === 'string' ? req.body.consultantId.trim() : ''
  const form = req.body?.form && typeof req.body.form === 'object' ? req.body.form : null

  if (!email || !consultantId || !form) {
    return res.status(400).json({ error: 'email, consultantId, and form are required.' })
  }

  const validation = validateNetworkMemberProfile(form)
  if (!validation.ok) {
    return res.status(400).json({ error: validation.error })
  }

  const store = await readStore()
  const profiles = store.profiles && typeof store.profiles === 'object' ? store.profiles : {}
  const existing = profiles[email]
  if (existing && existing.id !== consultantId) {
    return res.status(403).json({ error: 'Could not verify your membership record.' })
  }

  const patch = memberProfilePatchFromValidated(validation.value)
  const consultant = {
    ...(existing || { id: consultantId, contactEmail: email, networkCohort: 'founding' }),
    ...patch,
    id: consultantId,
    contactEmail: email,
  }

  if (!findMemberConsultantByEmail([consultant], email)) {
    return res.status(403).json({ error: 'Membership record is not valid.' })
  }

  profiles[email] = consultant
  store.profiles = profiles
  await writeStore(store)

  return res.status(200).json({ ok: true, consultant })
}
