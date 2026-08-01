import { useCallback, useEffect, useMemo, useState } from 'react'
import { Copy, Mail, Plus, RefreshCw, XCircle } from 'lucide-react'
import PanelHeader from '../bhi/PanelHeader'
import {
  createNetworkInvitation,
  listNetworkInvitations,
  revokeNetworkInvitation,
  sendNetworkInvitationEmail,
} from '../../lib/networkInvitations'
import { buildNetworkInvitationEmailHtml } from '../../../lib/networkInvitationEmailHtml.js'
import {
  NETWORK_BRANDS,
  NETWORK_COHORTS,
  NETWORK_INVITE_STATUSES,
  NETWORK_ROLE_CATEGORIES,
  brandLabel,
  parseBrandsJson,
  roleLabel,
} from '../../../lib/networkConstants.js'

function formatWhen(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString()
  } catch {
    return iso
  }
}

export default function NetworkInviteAdminTab({ adminEmail }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [lastCreated, setLastCreated] = useState(null)
  const [showEmailPreview, setShowEmailPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendNotice, setSendNotice] = useState('')
  const [form, setForm] = useState({
    email: '',
    inviteeName: '',
    roleCategory: 'physician',
    brands: ['cogcare'],
    personalNote: '',
    cohort: 'founding',
  })

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listNetworkInvitations()
      setRows(
        [...data].sort((a, b) => {
          const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
          const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
          return tb - ta
        }),
      )
    } catch (e) {
      setError(e?.message || 'Could not load invitations.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- load invitations on mount
    load()
  }, [load])

  const emailPreviewHtml = useMemo(() => {
    if (!lastCreated) return ''
    return buildNetworkInvitationEmailHtml({
      inviteeName: form.inviteeName || undefined,
      inviteUrl: lastCreated.inviteUrl,
      personalNote: form.personalNote || undefined,
      roleCategory: form.roleCategory,
      brands: form.brands,
      invitedByName: adminEmail || 'The CogCare team',
    })
  }, [lastCreated, form, adminEmail])

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    setError('')
    setLastCreated(null)
    try {
      const result = await createNetworkInvitation({
        email: form.email,
        inviteeName: form.inviteeName,
        cohort: form.cohort,
        roleCategory: form.roleCategory,
        brands: form.brands,
        personalNote: form.personalNote,
        invitedByEmail: adminEmail,
      })
      setLastCreated(result)
      setForm((f) => ({ ...f, email: '', inviteeName: '', personalNote: '' }))
      await load()
    } catch (err) {
      setError(err?.message || 'Could not create invitation.')
    } finally {
      setCreating(false)
    }
  }

  function toggleBrand(id) {
    setForm((f) => {
      const has = f.brands.includes(id)
      const brands = has ? f.brands.filter((b) => b !== id) : [...f.brands, id]
      return { ...f, brands: brands.length ? brands : ['cogcare'] }
    })
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="space-y-6">
      <PanelHeader
        sectionLabel="Cognition Network"
        title="Founding invitations"
        subtitle="Create invitation-only links for the founding cohort, review the message, and send only when you are ready."
      />

      {error ? (
        <div
          className="rounded-xl border border-error-border bg-error-bg px-4 py-3 text-sm text-error"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <form
        onSubmit={handleCreate}
        className="rounded-2xl border border-border bg-white p-5 shadow-brand-sm space-y-4"
        aria-labelledby="network-invite-form-title"
      >
        <p id="network-invite-form-title" className="text-[10px] font-bold uppercase tracking-[0.14em] text-clay">
          New invitation
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block" htmlFor="admin-invite-email">
            <span className="text-xs font-medium text-forest">Email *</span>
            <input
              id="admin-invite-email"
              required
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
            />
          </label>
          <label className="block" htmlFor="admin-invite-name">
            <span className="text-xs font-medium text-forest">Invitee name</span>
            <input
              id="admin-invite-name"
              autoComplete="name"
              value={form.inviteeName}
              onChange={(e) => setForm((f) => ({ ...f, inviteeName: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
            />
          </label>
          <label className="block" htmlFor="admin-invite-role">
            <span className="text-xs font-medium text-forest">Role</span>
            <select
              id="admin-invite-role"
              value={form.roleCategory}
              onChange={(e) => setForm((f) => ({ ...f, roleCategory: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
            >
              {NETWORK_ROLE_CATEGORIES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block" htmlFor="admin-invite-cohort">
            <span className="text-xs font-medium text-forest">Cohort</span>
            <select
              id="admin-invite-cohort"
              value={form.cohort}
              onChange={(e) => setForm((f) => ({ ...f, cohort: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
            >
              {NETWORK_COHORTS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <fieldset>
          <legend className="text-xs font-medium text-forest">Brands</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {NETWORK_BRANDS.map((b) => (
              <button
                key={b.id}
                type="button"
                aria-pressed={form.brands.includes(b.id)}
                onClick={() => toggleBrand(b.id)}
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  form.brands.includes(b.id)
                    ? 'bg-forest text-white'
                    : 'border border-border bg-surface text-forest'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="block" htmlFor="admin-invite-note">
          <span className="text-xs font-medium text-forest">Personal note (optional)</span>
          <textarea
            id="admin-invite-note"
            rows={3}
            value={form.personalNote}
            onChange={(e) => setForm((f) => ({ ...f, personalNote: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-sm"
            placeholder="A short note included in the invitation email preview."
          />
        </label>

        <button
          type="submit"
          disabled={creating}
          aria-busy={creating}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-forest px-5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white disabled:opacity-60"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {creating ? 'Creating…' : 'Create invitation link'}
        </button>
      </form>

      {lastCreated ? (
        <div className="rounded-2xl border border-[#B8D9C1] bg-[#B8D9C1]/15 p-5">
          <p className="text-sm font-medium text-forest">Invitation created</p>
          <p className="mt-2 break-all text-xs text-forest/80">{lastCreated.inviteUrl}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copyText(lastCreated.inviteUrl)}
              aria-label="Copy invitation link"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-forest"
            >
              <Copy className="h-4 w-4" aria-hidden />
              Copy link
            </button>
            <button
              type="button"
              onClick={() => setShowEmailPreview((v) => !v)}
              aria-expanded={showEmailPreview}
              aria-controls="network-invite-email-preview"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-forest"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {showEmailPreview ? 'Hide email preview' : 'Preview email'}
            </button>
            <button
              type="button"
              disabled={sending}
              onClick={async () => {
                setSending(true)
                setError('')
                setSendNotice('')
                try {
                  await sendNetworkInvitationEmail({
                    to: lastCreated.invitation.email,
                    inviteUrl: lastCreated.inviteUrl,
                    inviteeName: lastCreated.invitation.inviteeName,
                    personalNote: lastCreated.invitation.personalNote,
                    roleCategory: lastCreated.invitation.roleCategory,
                    brands: parseBrandsJson(lastCreated.invitation.brandsJson),
                    invitedByName: adminEmail || 'The CogCare team',
                  })
                  setSendNotice(`Invitation email sent to ${lastCreated.invitation.email}.`)
                } catch (e) {
                  setError(e?.message || 'Invitation email could not be delivered.')
                } finally {
                  setSending(false)
                }
              }}
              className="inline-flex items-center gap-2 rounded-full bg-forest px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white disabled:opacity-60"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {sending ? 'Sending…' : 'Send invitation email'}
            </button>
          </div>
          {sendNotice ? <p className="mt-3 text-sm text-forest" role="status">{sendNotice}</p> : null}
          {showEmailPreview ? (
            <iframe
              id="network-invite-email-preview"
              title="Invitation email preview"
              srcDoc={emailPreviewHtml}
              className="mt-4 h-[420px] w-full rounded-xl border border-border bg-white"
            />
          ) : null}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <h2 className="font-serif text-lg text-forest">All invitations</h2>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-forest"
        >
          <RefreshCw className="h-3.5 w-3.5" aria-hidden />
          Refresh
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-forest/70" role="status" aria-live="polite">
          Loading invitations…
        </p>
      ) : rows.length === 0 ? (
        <p className="text-sm text-forest/70">No invitations yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="min-w-full text-left text-sm">
            <caption className="sr-only">Cognition Network invitations</caption>
            <thead className="border-b border-border bg-surface/60 text-[10px] font-bold uppercase tracking-[0.12em] text-clay">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Invitee
                </th>
                <th scope="col" className="px-4 py-3">
                  Role
                </th>
                <th scope="col" className="px-4 py-3">
                  Status
                </th>
                <th scope="col" className="px-4 py-3">
                  Expires
                </th>
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const brands = parseBrandsJson(row.brandsJson)
                return (
                  <tr key={row.tokenHash} className="border-b border-border/70 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink">{row.inviteeName || row.email}</p>
                      <p className="text-xs text-forest/65">{row.email}</p>
                      {brands.length ? (
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-forest/55">
                          {brands.map(brandLabel).join(' · ')}
                        </p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-forest/80">{roleLabel(row.roleCategory)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-forest">
                        {NETWORK_INVITE_STATUSES[row.status] || row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-forest/70">{formatWhen(row.expiresAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {row.status === 'pending' ? (
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await revokeNetworkInvitation(row.tokenHash)
                              await load()
                            } catch (e) {
                              setError(e?.message || 'Could not revoke invitation.')
                            }
                          }}
                          aria-label={`Revoke invitation for ${row.email}`}
                          className="inline-flex items-center gap-1 text-xs text-error"
                        >
                          <XCircle className="h-3.5 w-3.5" aria-hidden />
                          Revoke
                        </button>
                      ) : row.consultantSlug ? (
                        <a href={`/dr/${row.consultantSlug}`} className="text-xs underline">
                          Profile
                        </a>
                      ) : null}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
