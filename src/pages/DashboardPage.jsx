import { useMemo, useState } from 'react'
import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'
import { confirmSignIn, signOut } from 'aws-amplify/auth'
import { Brain, LogOut, Settings2 } from 'lucide-react'
import CreatePasswordCard from '../components/CreatePasswordCard'
import { TabBar, TabBarLink } from '../components/bhi/TabBar'
import BrainCreditTab from '../components/dashboard/BrainCreditTab'
import TestsTab from '../components/dashboard/TestsTab'
import MoreTestsTab from '../components/dashboard/MoreTestsTab'
import ConsultantsTab from '../components/dashboard/ConsultantsTab'
import SettingsTab from '../components/dashboard/SettingsTab'
import DashboardErrorBanner from '../components/dashboard/DashboardErrorBanner'
import DashboardMainSkeleton from '../components/dashboard/DashboardMainSkeleton'
import { useDashboardData } from '../hooks/useDashboardData'
import { clearPendingNewPasswordFlag, hasPendingNewPasswordFlag } from '../lib/authFlags'

export default function DashboardPage() {
  const navigate = useNavigate()
  const {
    client,
    email,
    profile,
    assessments,
    consultants,
    loading,
    loadError,
    load,
    avatarUrl,
  } = useDashboardData()

  const [showPwdCard, setShowPwdCard] = useState(() => hasPendingNewPasswordFlag())

  const displayName = useMemo(() => {
    const fromProfile = profile?.displayName?.trim()
    if (fromProfile) return fromProfile
    const local = email?.split('@')[0]?.trim()
    return local || 'Member'
  }, [email, profile?.displayName])

  const latestResults = useMemo(() => {
    try {
      const sorted = [...assessments].sort(
        (a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0),
      )
      if (sorted[0]?.resultsJson) return JSON.parse(sorted[0].resultsJson)
    } catch {
      /* ignore */
    }
    return null
  }, [assessments])

  async function handleSignOut() {
    clearPendingNewPasswordFlag()
    await signOut()
    navigate('/')
  }

  const showMainSkeleton = loading && !showPwdCard

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
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 sm:gap-4">
            <Link
              to="/"
              className="flex shrink-0 items-center gap-2 font-serif text-lg italic text-[#3D4B3E]"
            >
              <Brain className="h-5 w-5 text-[#A67B5B]" strokeWidth={1.5} aria-hidden />
              Dashboard
            </Link>
            <span className="hidden h-4 w-px shrink-0 bg-[#E8DCC4] sm:block" aria-hidden />
            <div className="flex min-w-0 max-w-[min(100%,14rem)] items-center gap-2 sm:max-w-xs">
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-[#E8DCC4] bg-[#F3EFE9]">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase text-[#3D4B3E]/35">
                    {displayName.slice(0, 1)}
                  </div>
                )}
              </div>
              <p className="truncate text-sm font-medium text-[#3D4B3E]">
                <span className="text-[#3D4B3E]/60">Hi, </span>
                {displayName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-[#E8DCC4] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#3D4B3E] hover:bg-[#F3EFE9] sm:min-h-0"
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
                    assessmentCount={assessments.length}
                    assessments={assessments}
                  />
                }
              />
              <Route
                path="tests"
                element={<TestsTab client={client} assessments={assessments} onRefresh={load} />}
              />
              <Route path="more-tests" element={<MoreTestsTab />} />
              <Route path="consultants" element={<ConsultantsTab rows={consultants} />} />
              <Route
                path="settings"
                element={<SettingsTab email={email} profile={profile} onProfileSaved={load} />}
              />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          )}
        </div>
      </main>
    </div>
  )
}
