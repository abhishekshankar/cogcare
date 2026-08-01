import fs from 'node:fs/promises'
import path from 'node:path'

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

/**
 * @param {{ method?: string, url?: string }} req
 * @param {{ status: (code: number) => { json: (data: unknown) => void } }} res
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const url = new URL(req.url || '', 'http://localhost')
  const email = (url.searchParams.get('email') || '').trim().toLowerCase()
  const store = await readStore()
  const contributions = store.contributions?.[email] ?? []

  return res.status(200).json({ ok: true, contributions })
}
