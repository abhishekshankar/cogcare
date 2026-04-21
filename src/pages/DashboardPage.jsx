import { useMemo, useState, useCallback, useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom'
import { confirmSignIn, signOut } from 'aws-amplify/auth'
import { Brain, LogOut, Settings2, UserPlus } from 'lucide-react'
import CreatePasswordCard from '../components/CreatePasswordCard'
import { TabBar, TabBarLink } from '../components/bhi/TabBar'
import BrainCreditTab from '../components/dashboard/BrainCreditTab'
import TestsTab from '../components/dashboard/TestsTab'
import MoreTestsTab from '../components/dashboard/MoreTestsTab'
import ConsultantsTab from '../components/dashboard/ConsultantsTab'
import SettingsTab from '../components/dashboard/SettingsTab'
import BookConsultPage from '../components/dashboard/BookConsultPage'
import SubjectSwitcher from '../components/dashboard/SubjectSwitcher'
import DashboardErrorBanner from '../components/dashboard/DashboardErrorBanner'
import DashboardMainSkeleton from '../components/dashboard/DashboardMainSkeleton'
import DashboardQuizChooser from '../components/dashboard/DashboardQuizChooser'
import AddProfileOnlyDialog from '../components/dashboard/AddProfileOnlyDialog'
import BrainHealthIndex from '../BrainHealthIndex'
import { useDashboardData } from '../hooks/useDashboardData'
import { clearPendingNewPasswordFlag, hasPendingNewPasswordFlag } from '../lib/authFlags'
import { buildInitialAnswersFromSubject } from '../lib/persistDashboardAssessment.js'
import { BHI_SUBJECT_QUESTION_IDS } from '../lib/bhiQuizConfig.js'

export default function DashboardPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    client,
    email,
    sub,
    profile,
    subjects,
    activeSubjectId,
    setActiveSubjectId,
    assessmentsForActiveSubject,
    consultants,
    appointmentsForActiveSubject,
    loading,
    loadError,
    load,
    avatarUrl,
  } = useDashboardData()

  const [showPwdCard, setShowPwdCard] = useState(() => hasPendingNewPasswordFlag())

  const [quizChooserOpen, setQuizChooserOpen] = useState(false)
  const [addProfileOpen, setAddProfileOpen] = useState(false)
  const [dashboardQuizOpen, setDashboardQuizOpen] = useState(false)
  const [dashboardQuizSessionKey, setDashboardQuizSessionKey] = useState(0)
  const [dashQuizExcludedIds, setDashQuizExcludedIds] = useState([])
  const [dashQuizPersistSubjectId, setDashQuizPersistSubjectId] = useState(null)
  const [dashQuizAnswersDefaults, setDashQuizAnswersDefaults] = useState({})
  const [dashboardQuizAnswers, setDashboardQuizAnswers] = useState({})
  const [dashboardQuizResults, setDashboardQuizResults] = useState(null)
  const [postQuizSwitch, setPostQuizSwitch] = useState(null)

  const activeSubjectIdRef = useRef(activeSubjectId)
  const subjectsRef = useRef(subjects)
  useEffect(() => {
    activeSubjectIdRef.current = activeSubjectId
  }, [activeSubjectId])
  useEffect(() => {
    subjectsRef.current = subjects
  }, [subjects])

  const openAssessmentChooser = useCallback(() => setQuizChooserOpen(true), [])

  const startQuizForSubject = useCallback(
    (subjectId) => {
      const s = subjects.find((x) => x.id === subjectId)
      if (!s) return
      const initial = buildInitialAnswersFromSubject(s)
      setDashQuizAnswersDefaults(initial)
      setDashboardQuizAnswers(initial)
      setDashQuizExcludedIds(BHI_SUBJECT_QUESTION_IDS)
      setDashQuizPersistSubjectId(subjectId)
      setDashboardQuizResults(null)
      setDashboardQuizSessionKey((k) => k + 1)
      setDashboardQuizOpen(true)
    },
    [subjects],
  )

  const startQuizNewPerson = useCallback(() => {
    setDashQuizAnswersDefaults({})
    setDashboardQuizAnswers({})
    setDashQuizExcludedIds([])
    setDashQuizPersistSubjectId(null)
    setDashboardQuizResults(null)
    setDashboardQuizSessionKey((k) => k + 1)
    setDashboardQuizOpen(true)
  }, [])

  const persistToDashboard = useMemo(() => {
    if (!sub || !client) return null
    return {
      client,
      ownerSub: sub,
      existingSubjectId: dashQuizPersistSubjectId,
    }
  }, [sub, client, dashQuizPersistSubjectId])

  const handleDashboardQuizClose = useCallback(() => {
    setDashboardQuizOpen(false)
    setDashQuizExcludedIds([])
    setDashQuizPersistSubjectId(null)
    setDashQuizAnswersDefaults({})
    setDashboardQuizAnswers({})
    setDashboardQuizResults(null)
  }, [])

  /**
   * Full-screen / fixed overlays (BHI, chooser, dialogs) live outside <main>. If the user changes
   * tabs without dismissing them, they keep z-stacking above the Calendly embed and block it.
   */
  useEffect(() => {
    queueMicrotask(() => {
      setQuizChooserOpen(false)
      setAddProfileOpen(false)
      setPostQuizSwitch(null)
      handleDashboardQuizClose()
    })
  }, [location.pathname, handleDashboardQuizClose])

  const handleDashboardPersisted = useCallback(
    async (info) => {
      await load()
      const curActive = activeSubjectIdRef.current
      if (info.subjectId && info.subjectId !== curActive) {
        const active = subjectsRef.current.find((s) => s.id === curActive)
        setPostQuizSwitch({
          subjectId: info.subjectId,
          careDisplayName: info.careDisplayName,
          activeDisplayName: active?.displayName ?? 'this profile',
        })
      }
    },
    [load],
  )

  const displayName = useMemo(() => {
    const fromProfile = profile?.displayName?.trim()
    if (fromProfile) return fromProfile
    const local = email?.split('@')[0]?.trim()
    return local || 'Member'
  }, [email, profile?.displayName])

  const latestResults = useMemo(() => {
    try {
      const sorted = [...assessmentsForActiveSubject].sort(
        (a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0),
      )
      if (sorted[0]?.resultsJson) return JSON.parse(sorted[0].resultsJson)
    } catch {
      /* ignore */
    }
    return null
  }, [assessmentsForActiveSubject])

  const consultActiveSubjectName = useMemo(() => {
    const s = subjects?.find((x) => x.id === activeSubjectId)
    const name = s?.displayName?.trim()
    if (name) return s?.isSelf ? `${name} (you)` : name
    return 'This profile'
  }, [subjects, activeSubjectId])

  async function handleSignOut() {
    clearPendingNewPasswordFlag()
    await signOut()
    navigate('/')
  }

  const showMainSkeleton = loading && !showPwdCard

  const headerActionClassName =
    'inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-forest shadow-sm transition-colors hover:bg-surface sm:min-h-0'

  return (
    <div className="min-h-screen bg-page text-ink">
      {showPwdCard ? (
        <div className="border-b border-border bg-surface/95 px-4 py-6 sm:px-6">
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
      <header className="border-b border-border bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl min-w-0 items-center justify-between gap-3 px-4 py-5 sm:gap-4 sm:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto sm:gap-3 md:gap-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Link
              to="/"
              className="flex shrink-0 items-center gap-2 font-serif text-lg italic text-forest"
            >
              <Brain className="h-5 w-5 text-clay" strokeWidth={1.5} aria-hidden />
              Dashboard
            </Link>
            <span className="hidden h-4 w-px shrink-0 bg-border sm:block" aria-hidden />
            <div className="flex min-w-0 shrink-0 items-center gap-2">
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-surface">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase text-forest/35">
                    {displayName.slice(0, 1)}
                  </div>
                )}
              </div>
              <p className="max-w-[10rem] truncate text-sm font-medium text-forest sm:max-w-[14rem] md:max-w-none">
                <span className="text-forest/60">Hi, </span>
                {displayName}
              </p>
            </div>
            {subjects?.length ? (
              <>
                <span className="hidden h-4 w-px shrink-0 bg-border sm:block" aria-hidden />
                <SubjectSwitcher
                  subjects={subjects}
                  activeSubjectId={activeSubjectId}
                  onChange={setActiveSubjectId}
                />
              </>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={openAssessmentChooser}
              className={headerActionClassName}
              aria-label="Add someone you care for, with or without a test"
            >
              <UserPlus className="h-4 w-4 shrink-0 text-clay" strokeWidth={1.75} aria-hidden />
              Add loved one
            </button>
            <button type="button" onClick={handleSignOut} className={headerActionClassName}>
              <LogOut className="h-4 w-4 shrink-0" aria-hidden />
              Sign out
            </button>
          </div>
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
        <div className="space-y-6">
          {loadError ? <DashboardErrorBanner message={loadError} onRetry={load} /> : null}
          {showMainSkeleton ? (
            <DashboardMainSkeleton />
          ) : (
            <Routes>
              <Route
                index
                element={
                  <BrainCreditTab
                    profile={profile}
                    latestResults={latestResults}
                    assessmentCount={assessmentsForActiveSubject.length}
                    assessments={assessmentsForActiveSubject}
                    onStartAssessment={openAssessmentChooser}
                  />
                }
              />
              <Route
                path="tests"
                element={
                  <TestsTab
                    client={client}
                    assessments={assessmentsForActiveSubject}
                    onRefresh={load}
                    onOpenAssessmentChooser={openAssessmentChooser}
                  />
                }
              />
              <Route path="more-tests" element={<MoreTestsTab />} />
              <Route
                path="consultants"
                element={
                  <ConsultantsTab
                    rows={consultants}
                    appointments={appointmentsForActiveSubject}
                    activeSubjectName={consultActiveSubjectName}
                    hasMultipleSubjects={(subjects?.length ?? 0) > 1}
                  />
                }
              />
              <Route
                path="consultations/book"
                element={
                  <BookConsultPage
                    client={client}
                    email={email}
                    ownerSub={sub}
                    consultants={consultants}
                    subjects={subjects}
                    activeSubjectId={activeSubjectId}
                    setActiveSubjectId={setActiveSubjectId}
                    onRefresh={load}
                  />
                }
              />
              <Route
                path="settings"
                element={
                  <SettingsTab
                    email={email}
                    profile={profile}
                    subjects={subjects}
                    onProfileSaved={load}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          )}
        </div>
      </main>

      <DashboardQuizChooser
        open={quizChooserOpen}
        onClose={() => setQuizChooserOpen(false)}
        subjects={subjects}
        activeSubjectId={activeSubjectId}
        onStartForSubject={startQuizForSubject}
        onStartNewPerson={startQuizNewPerson}
        onAddProfileOnly={() => setAddProfileOpen(true)}
      />

      <AddProfileOnlyDialog
        open={addProfileOpen}
        onClose={() => setAddProfileOpen(false)}
        ownerSub={sub}
        client={client}
        onRefresh={load}
        onCreated={(newId) => setActiveSubjectId(newId)}
      />

      <BrainHealthIndex
        key={dashboardQuizSessionKey}
        open={dashboardQuizOpen}
        onClose={handleDashboardQuizClose}
        quizAnswers={dashboardQuizAnswers}
        setQuizAnswers={setDashboardQuizAnswers}
        quizResults={dashboardQuizResults}
        setQuizResults={setDashboardQuizResults}
        excludedQuestionIds={dashQuizExcludedIds}
        quizAnswersDefaults={dashQuizAnswersDefaults}
        persistToDashboard={persistToDashboard}
        onDashboardPersisted={handleDashboardPersisted}
      />

      {postQuizSwitch ? (
        <div
          className="fixed inset-0 z-[210] flex items-end justify-center bg-forest/40 p-4 backdrop-blur-sm sm:items-center"
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="post-quiz-switch-title"
            className="w-full max-w-md rounded-2xl border border-border bg-page p-6 shadow-xl"
          >
            <h2 id="post-quiz-switch-title" className="font-serif text-xl italic text-forest">
              Switch dashboard view?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-forest/90">
              You saved an assessment for{' '}
              <span className="font-semibold text-ink">{postQuizSwitch.careDisplayName}</span>. You are still viewing{' '}
              <span className="font-semibold text-ink">{postQuizSwitch.activeDisplayName}</span>.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setActiveSubjectId(postQuizSwitch.subjectId)
                  setPostQuizSwitch(null)
                }}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-forest px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white hover:bg-forest-dark sm:min-h-0"
              >
                View {postQuizSwitch.careDisplayName}
              </button>
              <button
                type="button"
                onClick={() => setPostQuizSwitch(null)}
                className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full border border-border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-forest hover:bg-surface sm:min-h-0"
              >
                Stay on {postQuizSwitch.activeDisplayName}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
