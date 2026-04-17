import { useCallback, useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { generateClient } from 'aws-amplify/data'
import {
  fetchUserAttributes,
  signOut,
  updatePassword,
  fetchAuthSession,
  confirmSignIn,
} from 'aws-amplify/auth'
import { uploadData, getUrl, remove } from 'aws-amplify/storage'
import { Brain, LogOut, Settings2, LayoutGrid, FlaskConical, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import BHIReportContent from '../components/BHIReportContent'
import CreatePasswordCard from '../components/CreatePasswordCard'
import { computeBrainCreditFromResults } from '../../lib/brainCredit'
import {
  clearPendingNewPasswordFlag,
  hasPendingNewPasswordFlag,
} from '../lib/authFlags'
import PanelHeader from '../components/bhi/PanelHeader'
import SectionLabel from '../components/bhi/SectionLabel'
import { TabBar, TabBarLink } from '../components/bhi/TabBar'
import CardButton from '../components/bhi/CardButton'

const client = generateClient()

const FALLBACK_CONSULTANTS = [
  {
    name: 'Dr. Example Advisor',
    title: 'Cognitive Neurology',
    bio: 'Placeholder — replace with DynamoDB-seeded consultants after deploy.',
    photoUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400',
    bookingUrl: 'https://cogcare.org/',
    contactEmail: 'hello@cogcare.org',
    sortOrder: 0,
  },
]

function BrainCreditTab({ profile, latestResults, assessmentCount }) {
  const score =
    profile?.brainCreditScore ??
    (latestResults
      ? computeBrainCreditFromResults(latestResults, {
          completedAssessmentCount: assessmentCount ?? 1,
        })
      : null)
  return (
    <div className="space-y-6">
      <PanelHeader
        sectionLabel="Overview"
        title="Brain credit"
        subtitle='A single score derived from your latest Brain Health Index (v1). Higher reflects a stronger "normal aging" pattern in your results — not a diagnosis.'
      />
      <div className="rounded-3xl border border-[#E8DCC4] bg-white p-8 shadow-sm">
        <SectionLabel className="text-[#3D4B3E]/50">Your score</SectionLabel>
        <p className="mt-4 font-serif text-6xl tabular-nums text-[#3D4B3E]">{score ?? '—'}</p>
        <p className="mt-4 text-xs text-[#3D4B3E]/60">Range 300–850 (v1 formula documented in backend).</p>
      </div>
    </div>
  )
}

function TestsTab({ assessments, onRefresh }) {
  const [open, setOpen] = useState(null)
  const sorted = [...assessments].sort(
    (a, b) => new Date(b.completedAt) - new Date(a.completedAt),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PanelHeader sectionLabel="History" title="My tests" />
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-full border border-[#E8DCC4] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#3D4B3E] hover:bg-[#F3EFE9]"
        >
          Refresh
        </button>
      </div>
      {sorted.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[#E8DCC4] bg-white/60 px-6 py-12 text-center text-sm text-[#3D4B3E]/70">
          No assessments yet. Complete the Brain Health Index on the home page and email your results to save them
          here.
        </p>
      ) : (
        <ul className="space-y-3">
          {sorted.map((a) => {
            let summary = 'BHI'
            try {
              const r = JSON.parse(a.resultsJson || '{}')
              summary = r.urgency ? `Urgency: ${r.urgency}` : 'Brain Health Index'
            } catch {
              /* ignore */
            }
            return (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => setOpen(a)}
                  className="w-full rounded-2xl border border-[#E8DCC4] bg-white px-5 py-4 text-left shadow-sm transition hover:border-[#3D4B3E]/30"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">
                    {new Date(a.completedAt).toLocaleString()}
                  </p>
                  <p className="mt-1 font-medium text-[#1A1A1A]">{a.type}</p>
                  <p className="mt-1 text-sm text-[#3D4B3E]/75">{summary}</p>
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {open ? (
        <div
          className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#3D4B3E]/30 backdrop-blur-sm"
            onClick={() => setOpen(null)}
            aria-label="Close"
          />
          <div className="relative z-10 max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-[#E8DCC4] bg-[#FDFBF7] p-6 shadow-2xl sm:rounded-3xl">
            <div className="mb-4 flex justify-between gap-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">Saved report</p>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="text-sm font-semibold text-[#A67B5B] hover:underline"
              >
                Close
              </button>
            </div>
            {(() => {
              try {
                const r = JSON.parse(open.resultsJson || '{}')
                return <BHIReportContent quizResults={r} />
              } catch {
                return <p className="text-sm text-red-700">Could not load results.</p>
              }
            })()}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function MoreTestsTab() {
  const cards = [
    { title: 'Cognitive reserve', hint: 'Coming soon', icon: Sparkles },
    { title: 'Sleep & mood check-in', hint: 'Coming soon', icon: LayoutGrid },
    { title: 'Motor & gait screen', hint: 'Coming soon', icon: FlaskConical },
  ]
  return (
    <div className="space-y-6">
      <PanelHeader
        sectionLabel="Explore"
        title="More tests"
        subtitle="Placeholders for future assessments — same card rhythm as the home page pillars."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <CardButton key={c.title} icon={c.icon} title={c.title} hint={c.hint} />
        ))}
      </div>
    </div>
  )
}

function ConsultantsTab({ rows }) {
  const list = rows.length ? rows : FALLBACK_CONSULTANTS
  return (
    <div className="space-y-6">
      <PanelHeader
        sectionLabel="Support"
        title="Consultations"
        subtitle="Connect with specialists. v1 uses seeded or static data until your team curates the directory."
      />
      <div className="grid gap-6 sm:grid-cols-2">
        {list.map((c, i) => (
          <div
            key={c.id ?? c.name + i}
            className="overflow-hidden rounded-2xl border border-[#E8DCC4] bg-white shadow-sm"
          >
            {c.photoUrl ? (
              <img src={c.photoUrl} alt="" className="aspect-[4/3] w-full object-cover" />
            ) : null}
            <div className="p-5">
              <p className="font-serif text-lg text-[#3D4B3E]">{c.name}</p>
              {c.title ? (
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#A67B5B]">{c.title}</p>
              ) : null}
              {c.bio ? <p className="mt-3 text-sm leading-relaxed text-[#3D4B3E]/85">{c.bio}</p> : null}
              <a
                href={c.bookingUrl || `mailto:${c.contactEmail || ''}`}
                className="mt-4 inline-flex rounded-full bg-[#3D4B3E] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white"
              >
                Request consultation
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsTab({ email, profile, onProfileSaved }) {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwMsg, setPwMsg] = useState('')
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
    setPwMsg('')
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
      onProfileSaved()
    } catch (err) {
      setPwMsg(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setFileBusy(false)
      e.target.value = ''
    }
  }

  async function clearAvatar() {
    if (!profile?.avatarKey) return
    setFileBusy(true)
    try {
      await remove({ path: profile.avatarKey })
      const { data: existing } = await client.models.UserProfile.list({ limit: 1 })
      const row = existing?.[0]
      if (row?.id) await client.models.UserProfile.update({ id: row.id, avatarKey: null })
      setAvatarUrl(null)
      onProfileSaved()
    } catch (err) {
      setPwMsg(err instanceof Error ? err.message : 'Remove failed.')
    } finally {
      setFileBusy(false)
    }
  }

  return (
    <div className="space-y-10">
      <PanelHeader sectionLabel="Account" title="Settings" />

      <section className="rounded-2xl border border-[#E8DCC4] bg-white p-6 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3D4B3E]/50">Email</p>
        <p className="mt-2 text-sm font-medium text-[#1A1A1A]">{email || '—'}</p>
      </section>

      <section className="rounded-2xl border border-[#E8DCC4] bg-white p-6 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3D4B3E]/50">Profile photo</p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-full border border-[#E8DCC4] bg-[#F3EFE9]">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-[#3D4B3E]/40">No photo</div>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer rounded-full bg-[#3D4B3E] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white hover:bg-[#2D382D]">
              {fileBusy ? '…' : 'Upload'}
              <input type="file" accept="image/*" className="sr-only" onChange={onPickFile} disabled={fileBusy} />
            </label>
            {profile?.avatarKey ? (
              <button
                type="button"
                onClick={clearAvatar}
                disabled={fileBusy}
                className="rounded-full border border-[#E8DCC4] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#3D4B3E]"
              >
                Remove
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E8DCC4] bg-white p-6 shadow-sm">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3D4B3E]/50">Change password</p>
        <form onSubmit={handlePw} className="mt-4 space-y-3 max-w-md">
          <input
            type="password"
            autoComplete="current-password"
            placeholder="Current password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            className="w-full rounded-xl border border-[#E8DCC4] px-4 py-3 text-sm"
            required
          />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="New password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className="w-full rounded-xl border border-[#E8DCC4] px-4 py-3 text-sm"
            required
          />
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Confirm new password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            className="w-full rounded-xl border border-[#E8DCC4] px-4 py-3 text-sm"
            required
          />
          <button
            type="submit"
            className="rounded-full bg-[#3D4B3E] px-5 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white"
          >
            Update password
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-dashed border-[#E8DCC4] bg-[#F3EFE9]/40 p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3D4B3E]/50">Notifications</p>
        <p className="mt-2 text-sm text-[#3D4B3E]/70">Email reminders — coming soon.</p>
      </section>

      {pwMsg ? <p className="text-sm text-[#3D4B3E]">{pwMsg}</p> : null}
    </div>
  )
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [profile, setProfile] = useState(null)
  const [assessments, setAssessments] = useState([])
  const [consultants, setConsultants] = useState([])
  const [loading, setLoading] = useState(true)
  const [showPwdCard, setShowPwdCard] = useState(() => hasPendingNewPasswordFlag())

  const load = useCallback(async () => {
    setLoading(true)
    try {
      if (hasPendingNewPasswordFlag()) {
        return
      }
      const attrs = await fetchUserAttributes()
      setEmail(attrs.email || attrs.preferred_username || '')
      const { data: profiles } = await client.models.UserProfile.list({ limit: 1 })
      setProfile(profiles?.[0] ?? null)
      const { data: assess } = await client.models.Assessment.list()
      setAssessments(assess ?? [])
      const { data: cons } = await client.models.Consultant.list()
      setConsultants(cons ?? [])
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function handleSignOut() {
    clearPendingNewPasswordFlag()
    await signOut()
    navigate('/')
  }

  let latestResults = null
  try {
    const sorted = [...assessments].sort(
      (a, b) => new Date(b.completedAt) - new Date(a.completedAt),
    )
    if (sorted[0]?.resultsJson) latestResults = JSON.parse(sorted[0].resultsJson)
  } catch {
    /* ignore */
  }

  if (loading && !showPwdCard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFBF7] text-[#3D4B3E]">
        Loading dashboard…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A]">
      {showPwdCard ? (
        <div className="border-b border-[#E8DCC4] bg-[#F3EFE9]/95 px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <CreatePasswordCard
              subtitle="Choose a permanent password to finish signing in."
              onComplete={async (pw) => {
                await confirmSignIn({ challengeResponse: pw })
                clearPendingNewPasswordFlag()
                setShowPwdCard(false)
                await load()
              }}
            />
          </div>
        </div>
      ) : null}
      <header className="border-b border-[#E8DCC4] bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-serif text-lg italic text-[#3D4B3E]">
            <Brain className="h-5 w-5 text-[#A67B5B]" strokeWidth={1.5} aria-hidden />
            Dashboard
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-full border border-[#E8DCC4] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#3D4B3E] hover:bg-[#F3EFE9]"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </div>
        <TabBar>
          <TabBarLink to="/dashboard" end>
            Brain credit
          </TabBarLink>
          <TabBarLink to="/dashboard/tests">My tests</TabBarLink>
          <TabBarLink to="/dashboard/more-tests">More tests</TabBarLink>
          <TabBarLink to="/dashboard/consultants">Consultations</TabBarLink>
          <TabBarLink to="/dashboard/settings">
            <span className="inline-flex items-center gap-1">
              <Settings2 className="h-3.5 w-3.5" aria-hidden />
              Settings
            </span>
          </TabBarLink>
        </TabBar>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <Routes>
          <Route
            index
            element={
              <BrainCreditTab
                profile={profile}
                latestResults={latestResults}
                assessmentCount={assessments.length}
              />
            }
          />
          <Route
            path="tests"
            element={<TestsTab assessments={assessments} onRefresh={load} />}
          />
          <Route path="more-tests" element={<MoreTestsTab />} />
          <Route
            path="consultants"
            element={<ConsultantsTab rows={consultants} />}
          />
          <Route
            path="settings"
            element={
              <SettingsTab email={email} profile={profile} onProfileSaved={load} />
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  )
}
