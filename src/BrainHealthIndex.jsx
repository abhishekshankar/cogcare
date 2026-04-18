import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FluentProvider, Button } from '@fluentui/react-components'
import { Brain, X, ArrowRight, ChevronLeft, Mail, Loader2 } from 'lucide-react'
import BHIReportContent from './components/BHIReportContent'
import { getCompleteAssessmentUrl } from './lib/completeAssessmentUrl'

// ---- Quiz data (ported from main branch CCAQuiz) ----
const CCA_QUIZ_QUESTIONS = [
  { text: "Does the person have difficulty staying focused on a task for more than 15 minutes?", domain: "Attention" },
  { text: "Does the person feel mentally exhausted or 'foggy' for most of the day?", domain: "Cognitive" },
  { text: "Has the person's sleep quality noticeably changed in the past 12 months?", domain: "Sleep" },
  { text: "Does the person feel anxious, worried, or on edge most of the time?", domain: "Mood" },
  { text: "Has the person's mood been persistently low or flat — not just sad, but emotionally blunted?", domain: "Mood" },
  { text: "Does the person repeat the same questions, statements, or actions within minutes of doing them?", domain: "FTD-Compulsive" },
  { text: "Has the person shown a noticeable reduction in warmth, compassion, or interest in other people?", domain: "FTD-Social" },
  { text: "Has the person done or said things that are socially inappropriate and seemed unaware it was wrong?", domain: "FTD-Disinhibition" },
  { text: "Has the person's personality changed significantly in the past 1–3 years?", domain: "FTD-Core" },
  { text: "Does the person have difficulty finding words or expressing themselves verbally?", domain: "Language" },
  { text: "Has the person's ability to plan, organize, or sequence tasks declined?", domain: "Executive" },
  { text: "Does the person have unusual eating habits, food cravings, or overeat compulsively?", domain: "FTD-Compulsive" },
  { text: "Is the person less aware of their own behavioral changes than family members are?", domain: "Anosognosia" },
  { text: "Has the person become more rigid, inflexible, or insistent on routines?", domain: "FTD-Compulsive" },
  { text: "Has the person lost interest in hobbies, relationships, or activities they previously enjoyed?", domain: "Apathy" },
  { text: "Does the person show any signs of motor difficulties: slowing, stiffness, tremor, or falls?", domain: "Motor" },
  { text: "How would you rate the overall change in this person's day-to-day functioning compared to 2 years ago?", domain: "Global" },
]

const CCA_LIKERT = ["Not at all", "Rarely", "Sometimes", "Often", "Almost always"]
const CCA_GLOBAL_SCALE = ["No change", "Mild decline", "Moderate decline", "Significant decline", "Severe decline"]

function computeResults(answers) {
  const ftdScore = (
    (answers[6] || 1) + (answers[7] || 1) + (answers[8] || 1) + (answers[9] || 1) +
    (answers[12] || 1) + (answers[13] || 1) + (answers[14] || 1)
  ) / 7
  const depressionScore = ((answers[4] || 1) + (answers[5] || 1) + (answers[15] || 1) + (answers[3] || 1)) / 4
  const cognitiveScore = ((answers[1] || 1) + (answers[2] || 1) + (answers[10] || 1) + (answers[11] || 1)) / 4
  const globalDecline = answers[17] || 1
  let bvftd = ftdScore * 25
  let eoad = (cognitiveScore * 15) + (globalDecline * 3)
  let depression = depressionScore * 20
  let mixed = ((ftdScore + depressionScore) / 2) * 15
  let normal = Math.max(5, 100 - bvftd - eoad - depression - mixed)
  const total = bvftd + eoad + depression + mixed + normal
  bvftd = Math.round((bvftd / total) * 100)
  eoad = Math.round((eoad / total) * 100)
  depression = Math.round((depression / total) * 100)
  mixed = Math.round((mixed / total) * 100)
  normal = 100 - bvftd - eoad - depression - mixed
  const urgency = ftdScore >= 3.5 ? 'HIGH' : ftdScore >= 2.5 ? 'UNCERTAIN' : 'LOW'
  return {
    differentials: [
      { label: 'bvFTD-Probable', probability: bvftd, color: '#c0392b' },
      { label: 'EOAD Pattern', probability: eoad, color: '#e67e22' },
      { label: 'Late-Onset Depression', probability: depression, color: '#2980b9' },
      { label: 'Mixed/Uncertain', probability: mixed, color: '#8e44ad' },
      { label: 'Normal Aging', probability: normal, color: '#27ae60' },
    ],
    domains: {
      'Social Cognition': Math.round(((answers[7] || 1) / 5) * 100),
      'Disinhibition': Math.round(((answers[8] || 1) / 5) * 100),
      'Compulsive Behaviors': Math.round(((answers[14] || 1) + (answers[6] || 1) + (answers[12] || 1)) / 15 * 100),
      'Apathy': Math.round(((answers[15] || 1) / 5) * 100),
      'Executive Function': Math.round(((answers[11] || 1) / 5) * 100),
      'Mood/Affect': Math.round(((answers[5] || 1) / 5) * 100),
    },
    urgency,
    motorFlag: (answers[16] || 1) >= 3,
    ftdScore: Math.round(ftdScore * 10) / 10,
  }
}

// ---- Fluent 2 theme (exact CogCare 3.0 colors) ----
const cogcareTheme = {
  colorBrandBackground: '#3D4B3E',
  colorBrandBackgroundHover: '#2D382D',
  colorBrandBackgroundPressed: '#2D382D',
  colorBrandForeground1: '#3D4B3E',
  colorNeutralBackground1: '#FDFBF7',
  colorNeutralBackground2: '#F3EFE9',
  colorNeutralBackground3: '#F3EFE9',
  colorNeutralStroke1: '#E8DCC4',
  colorNeutralStroke2: '#E8DCC4',
  colorNeutralForeground1: '#1A1A1A',
  colorNeutralForeground2: '#3D4B3E',
  borderRadiusMedium: '12px',
  borderRadiusLarge: '16px',
  borderRadiusXLarge: '24px',
}

// ---- BHIQuiz ----
function BHIQuiz({ quizAnswers, setQuizAnswers, onComplete }) {
  const [qi, setQi] = useState(0)
  const total = CCA_QUIZ_QUESTIONS.length
  const q = CCA_QUIZ_QUESTIONS[qi]
  const isGlobal = qi === 16
  const scale = isGlobal ? CCA_GLOBAL_SCALE : CCA_LIKERT
  const selected = quizAnswers[qi + 1] || null
  const pct = (qi + 1) / total

  const handleSelect = (_ev, data) => {
    setQuizAnswers(prev => ({ ...prev, [qi + 1]: Number(data.value) }))
  }

  const handleNext = () => {
    if (qi < total - 1) {
      setQi(qi + 1)
    } else {
      const finalAnswers = selected
        ? { ...quizAnswers, [qi + 1]: selected }
        : quizAnswers
      onComplete(computeResults(finalAnswers))
    }
  }

  const handleBack = () => {
    if (qi > 0) setQi(qi - 1)
  }

  return (
    <div className="flex h-full flex-col">
      {/* Progress + domain */}
      <div className="shrink-0 border-b border-[#E8DCC4]/80 bg-[#FDFBF7] px-4 pb-5 pt-5 sm:px-8 sm:pb-6 sm:pt-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-[#F3EFE9] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#A67B5B] ring-1 ring-[#E8DCC4]/60">
            {q.domain}
          </span>
          <span className="text-[11px] font-semibold tabular-nums text-[#3D4B3E]/80">
            Question <span className="text-[#3D4B3E]">{qi + 1}</span>
            <span className="mx-1 font-normal text-[#3D4B3E]/40">/</span>
            {total}
          </span>
        </div>
        <div className="mb-1.5 flex justify-between text-[10px] font-medium uppercase tracking-[0.12em] text-[#3D4B3E]/45">
          <span>Progress</span>
          <span>{Math.round(pct * 100)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#E8DCC4]/90">
          <div
            className="h-full rounded-full bg-[#3D4B3E] transition-[width] duration-500 ease-out"
            style={{ width: `${Math.min(100, pct * 100)}%` }}
          />
        </div>
      </div>

      {/* Question + options */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-[#3D4B3E]/40">
          {isGlobal ? 'Overall function' : 'How often'}
        </p>
        <h2 className="mb-8 font-serif text-[1.35rem] leading-[1.35] tracking-tight text-[#1A1A1A] sm:mb-10 sm:text-2xl sm:leading-snug md:text-[1.65rem]">
          {q.text}
        </h2>

        <fieldset className="min-w-0 border-0 p-0">
          <legend className="sr-only">Choose one answer</legend>
          <div className="flex flex-col gap-2.5 sm:gap-3">
            {scale.map((label, i) => {
              const value = i + 1
              const isOn = selected === value
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    handleSelect(null, { value: String(value) })
                  }
                  className={[
                    'group flex w-full min-h-[52px] items-center gap-3 rounded-2xl border px-3.5 py-3.5 text-left transition-all duration-200 sm:min-h-[56px] sm:gap-4 sm:px-4 sm:py-4',
                    isOn
                      ? 'border-[#3D4B3E] bg-[#F3EFE9] shadow-[0_0_0_1px_rgba(61,75,62,0.12)] ring-2 ring-[#3D4B3E]/15'
                      : 'border-[#E8DCC4] bg-white hover:border-[#A67B5B]/45 hover:bg-[#FFFCF8] active:scale-[0.99]',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums sm:h-10 sm:w-10 sm:text-sm',
                      isOn
                        ? 'bg-[#3D4B3E] text-white'
                        : 'bg-[#F3EFE9] text-[#3D4B3E] group-hover:bg-[#E8DCC4]/80',
                    ].join(' ')}
                    aria-hidden
                  >
                    {value}
                  </span>
                  <span
                    className={[
                      'min-w-0 flex-1 text-[13px] font-medium leading-snug sm:text-sm',
                      isOn ? 'text-[#1A1A1A]' : 'text-[#3D4B3E]',
                    ].join(' ')}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </fieldset>
      </div>

      {/* Navigation */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-[#E8DCC4] bg-[#F3EFE9]/50 px-4 py-4 backdrop-blur-sm sm:px-8 sm:py-5">
        {qi > 0 ? (
          <Button
            appearance="subtle"
            icon={<ChevronLeft className="h-4 w-4" />}
            onClick={handleBack}
          >
            Back
          </Button>
        ) : (
          <div className="min-w-[4rem]" aria-hidden />
        )}
        <Button
          appearance="primary"
          disabled={!selected}
          onClick={handleNext}
          icon={<ArrowRight className="h-4 w-4" />}
          iconPosition="after"
          className={!selected ? 'opacity-50' : ''}
        >
          {qi < total - 1 ? 'Next' : 'View results'}
        </Button>
      </div>
    </div>
  )
}

/** In dev, Vite serves POST /api/send-quiz-email (see vite-plugin-local-email-api.js). */
const LEGACY_QUIZ_EMAIL_URL =
  import.meta.env.VITE_QUIZ_EMAIL_API_URL ||
  (import.meta.env.DEV ? '/api/send-quiz-email' : '')

// ---- BHIReport ----
function BHIReport({ quizResults, onReset, quizAnswers, onClose }) {
  const navigate = useNavigate()
  const completeAssessmentUrl = getCompleteAssessmentUrl()
  const canEmail = Boolean(completeAssessmentUrl || LEGACY_QUIZ_EMAIL_URL)

  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState('idle')
  const [emailMessage, setEmailMessage] = useState('')

  const sendResultsEmail = async () => {
    if (!canEmail) return
    const trimmed = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailMessage('Please enter a valid email address.')
      setEmailStatus('error')
      return
    }
    setEmailStatus('sending')
    setEmailMessage('')
    try {
      const url = completeAssessmentUrl || LEGACY_QUIZ_EMAIL_URL
      const body = completeAssessmentUrl
        ? JSON.stringify({
            email: trimmed,
            results: quizResults,
            answers: quizAnswers ?? {},
          })
        : JSON.stringify({ email: trimmed, results: quizResults })
      const res = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body,
      })
      const text = await res.text()
      let data = {}
      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        data = {}
      }
      if (!res.ok) {
        const serverMsg =
          (typeof data.error === 'string' && data.error) ||
          (typeof data.message === 'string' && data.message) ||
          (text && text.length < 400 ? text.trim() : '')
        throw new Error(serverMsg || `Request failed (${res.status})`)
      }
      setEmailStatus('sent')
      setEmailMessage('')
      if (completeAssessmentUrl) {
        onClose?.()
        navigate('/login?from=quiz&returnTo=' + encodeURIComponent('/dashboard'))
      }
    } catch (err) {
      setEmailStatus('error')
      let msg = err instanceof Error ? err.message : 'Could not send email.'
      if (msg === 'Failed to fetch' || msg === 'Load failed' || msg === 'NetworkError when attempting to fetch resource.') {
        msg =
          'Could not reach the email service (network or browser blocked the request). If this persists, confirm the app has a valid assessment URL in deployment settings, or try another network.'
      }
      setEmailMessage(msg)
    }
  }

  const emailCard = (
    <div className="mb-8 rounded-2xl border border-[#E8DCC4] bg-white/80 p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F3EFE9] text-[#3D4B3E]">
          <Mail className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">
            Email my results
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-[#3D4B3E]/85">
            {canEmail
              ? completeAssessmentUrl
                ? 'Create your account and save this assessment to your dashboard (check email for login).'
                : 'Get a copy of this summary sent to your inbox.'
              : import.meta.env.DEV
                ? 'Email sending is not configured locally. Add VITE_QUIZ_EMAIL_API_URL to .env, set VITE_COMPLETE_ASSESSMENT_URL, or run npm run sandbox so amplify_outputs.json includes your function URL.'
                : 'Email delivery is not available from this app right now. Save or screenshot your results, or try again later.'}
          </p>
        </div>
      </div>
      {canEmail ? (
        emailStatus === 'sent' ? (
          <p className="text-sm font-medium text-[#3D4B3E]" role="status">
            {completeAssessmentUrl
              ? 'Check your email for your report and temporary password, then sign in.'
              : 'Check your inbox — we sent your Brain Health Index summary.'}
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <label className="sr-only" htmlFor="bhi-email">
                Email address
              </label>
              <input
                id="bhi-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (emailStatus === 'error') {
                    setEmailStatus('idle')
                    setEmailMessage('')
                  }
                }}
                disabled={emailStatus === 'sending'}
                className="min-h-[48px] flex-1 rounded-xl border border-[#E8DCC4] bg-[#FDFBF7] px-4 text-sm text-[#1A1A1A] outline-none ring-0 transition placeholder:text-slate-400 focus:border-[#3D4B3E] focus:ring-2 focus:ring-[#3D4B3E]/20 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={sendResultsEmail}
                disabled={emailStatus === 'sending'}
                className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl bg-[#3D4B3E] px-5 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#2D382D] disabled:opacity-50 sm:px-6"
              >
                {emailStatus === 'sending' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                    Sending
                  </>
                ) : (
                  'Send'
                )}
              </button>
            </div>
            {emailStatus === 'error' && emailMessage ? (
              <p className="mt-3 text-[13px] text-red-700" role="alert">
                {emailMessage}
              </p>
            ) : null}
          </>
        )
      ) : null}
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-6">
        <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#A67B5B]">
          Assessment Complete
        </p>
        <BHIReportContent quizResults={quizResults} middleSlot={emailCard} />

      </div>

      {/* Footer */}
      <div className="border-t border-[#E8DCC4] bg-[#F3EFE9] px-4 py-5 sm:px-8 sm:py-6">
        <p className="mb-4 text-[11px] leading-relaxed text-[#3D4B3E] opacity-60">
          This is not a clinical diagnosis. Please consult a qualified healthcare professional.
        </p>
        <Button appearance="outline" onClick={onReset}>
          Start Over
        </Button>
      </div>
    </div>
  )
}

// ---- BrainHealthIndex overlay shell ----
export default function BrainHealthIndex({
  open,
  onClose,
  quizAnswers,
  setQuizAnswers,
  quizResults,
  setQuizResults,
}) {
  // ESC to close + body scroll lock
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  const handleComplete = useCallback((results) => {
    setQuizResults(results)
  }, [setQuizResults])

  const handleReset = useCallback(() => {
    setQuizAnswers({})
    setQuizResults(null)
  }, [setQuizAnswers, setQuizResults])

  const step = quizResults ? 'report' : 'quiz'

  if (!open) return null

  return (
    <FluentProvider theme={cogcareTheme}>
      <div
        className="fixed inset-0 z-[60] flex min-h-0 flex-col overflow-hidden sm:flex-row"
        style={{
          /* Full-bleed scrim so safe-area padding is not transparent (avoids site header showing above the modal). */
          backgroundColor: 'rgba(61,75,62,0.5)',
          paddingTop: 'env(safe-area-inset-top)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
      {/* Dimmed backdrop — click to close */}
      <div
        role="button"
        tabIndex={0}
        className="min-h-0 flex-1 animate-modal-backdrop cursor-pointer sm:min-h-0"
        style={{ background: 'rgba(61,75,62,0.5)' }}
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose() }}
        aria-label="Close assessment"
      />

      {/* Slide-in panel — full width on small screens; max-h-full keeps sheet within the padded viewport (min-h-[25%] + 85dvh could overflow on short phones). */}
      <div
        className="animate-modal-panel flex min-h-0 max-h-full w-full max-w-none flex-col border-t border-[#E8DCC4] bg-[#FDFBF7] shadow-[0_-20px_60px_rgba(61,75,62,0.15)] sm:max-h-none sm:h-full sm:w-[58vw] sm:max-w-[700px] sm:min-w-[min(100%,320px)] sm:border-l sm:border-t-0 sm:shadow-[-20px_0_60px_rgba(61,75,62,0.15)]"
      >
        {/* Panel header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E8DCC4] px-4 py-4 sm:px-8 sm:py-5">
          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <Brain className="h-5 w-5 shrink-0 text-[#A67B5B]" strokeWidth={1.5} aria-hidden="true" />
            <span className="truncate font-serif text-base italic text-[#3D4B3E] sm:text-lg">
              Brain Health Index
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#3D4B3E] transition-colors hover:bg-[#F3EFE9]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {step === 'quiz' && (
            <BHIQuiz
              quizAnswers={quizAnswers}
              setQuizAnswers={setQuizAnswers}
              onComplete={handleComplete}
            />
          )}
          {step === 'report' && quizResults && (
            <BHIReport
              quizResults={quizResults}
              quizAnswers={quizAnswers}
              onReset={handleReset}
              onClose={onClose}
            />
          )}
        </div>
      </div>
      </div>
    </FluentProvider>
  )
}

