import { useCallback, useEffect, useState } from 'react'
import { generateClient } from 'aws-amplify/data'
import { updatePassword, fetchAuthSession } from 'aws-amplify/auth'
import { uploadData, getUrl, remove } from 'aws-amplify/storage'
import PanelHeader from '../bhi/PanelHeader'

const client = generateClient()

export default function SettingsTab({ email, profile, onProfileSaved }) {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [avatarMsg, setAvatarMsg] = useState('')
  const [fileBusy, setFileBusy] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)

  const loadAvatarUrl = useCallback(async (key) => {
    if (!key) {
      setAvatarUrl(null)
      return
    }
    try {
      const u = await getUrl({ path: key })
      setAvatarUrl(u.url.toString())
    } catch {
      setAvatarUrl(null)
    }
  }, [])

  useEffect(() => {
    loadAvatarUrl(profile?.avatarKey)
  }, [profile?.avatarKey, loadAvatarUrl])

  async function handlePw(e) {
    e.preventDefault()
    setPwMsg('')
    if (newPw !== confirmPw) {
      setPwMsg('New passwords do not match.')
      return
    }
    try {
      await updatePassword({ oldPassword: currentPw, newPassword: newPw })
      setPwMsg('Password updated.')
      setCurrentPw('')
      setNewPw('')
      setConfirmPw('')
    } catch (err) {
      setPwMsg(err instanceof Error ? err.message : 'Update failed.')
    }
  }

  async function onPickFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileBusy(true)
    setAvatarMsg('')
    try {
      const session = await fetchAuthSession()
      const id = session.identityId
      if (!id) throw new Error('Missing identity')
      const path = `profile-pictures/${id}/avatar`
      await uploadData({
        path,
        data: file,
        options: { contentType: file.type || 'image/jpeg' },
      }).result
      const { data: existing, errors: listErr } = await client.models.UserProfile.list({ limit: 1 })
      if (listErr?.length) throw new Error(listErr[0].message)
      let row = existing?.[0]
      if (!row) {
        const { data: created, errors: cErr } = await client.models.UserProfile.create({
          displayName: (email || 'member').split('@')[0] || 'Member',
          avatarKey: path,
        })
        if (cErr?.length) throw new Error(cErr[0].message)
        row = created
      } else if (row.id) {
        await client.models.UserProfile.update({ id: row.id, avatarKey: path })
      }
      await loadAvatarUrl(path)
      setAvatarMsg('Photo updated.')
      onProfileSaved()
    } catch (err) {
      setAvatarMsg(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setFileBusy(false)
      e.target.value = ''
    }
  }

  async function clearAvatar() {
    if (!profile?.avatarKey) return
    setFileBusy(true)
    setAvatarMsg('')
    try {
      await remove({ path: profile.avatarKey })
      const { data: existing } = await client.models.UserProfile.list({ limit: 1 })
      const row = existing?.[0]
      if (row?.id) await client.models.UserProfile.update({ id: row.id, avatarKey: null })
      setAvatarUrl(null)
      setAvatarMsg('Photo removed.')
      onProfileSaved()
    } catch (err) {
      setAvatarMsg(err instanceof Error ? err.message : 'Remove failed.')
    } finally {
      setFileBusy(false)
    }
  }

  return (
    <div className="space-y-10">
      <PanelHeader sectionLabel="Account" title="Settings" />

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/50">Email</p>
        <p className="mt-2 text-sm font-medium text-ink">{email || '—'}</p>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/50">Profile photo</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-full border border-border bg-surface">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-forest/40">No photo</div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-full bg-forest px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white hover:bg-forest-dark">
              {fileBusy ? '…' : 'Upload'}
              <input type="file" accept="image/*" className="sr-only" onChange={onPickFile} disabled={fileBusy} />
            </label>
            {profile?.avatarKey ? (
              <button
                type="button"
                onClick={clearAvatar}
                disabled={fileBusy}
                className="rounded-full border border-border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-forest"
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
        {avatarMsg ? <p className="mt-3 text-sm text-forest">{avatarMsg}</p> : null}
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/50">Change password</p>
        <form onSubmit={handlePw} className="mt-4 max-w-md space-y-3">
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Current password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            className="w-full rounded-xl border border-border px-4 py-3 text-sm"
            required
          />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="New password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className="w-full rounded-xl border border-border px-4 py-3 text-sm"
            required
          />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Confirm new password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            className="w-full rounded-xl border border-border px-4 py-3 text-sm"
            required
          />
          <button
            type="submit"
            className="rounded-full bg-forest px-5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white"
          >
            Update password
          </button>
        </form>
        {pwMsg ? <p className="mt-3 text-sm text-forest">{pwMsg}</p> : null}
      </section>

      <section className="rounded-2xl border border-dashed border-border bg-surface/40 p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest/50">Notifications</p>
        <p className="mt-2 text-sm text-forest/70">Email reminders — coming soon.</p>
      </section>
    </div>
  )
}
