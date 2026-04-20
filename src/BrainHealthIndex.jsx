import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { FluentProvider, Button } from '@fluentui/react-components'
import { Brain, X, ArrowRight, ChevronLeft } from 'lucide-react'
import BHIReportContent from './components/BHIReportContent'
import { getCompleteAssessmentUrl, primeCompleteAssessmentUrl } from './lib/completeAssessmentUrl'

// ---- Caregiver quiz questions ----
const CAREGIVER_QUESTIONS = [
  { id: 'name',       type: 'text',      domain: 'About your loved one', text: "What is your loved one's first name?", placeholder: 'First name' },
  { id: 'age',        type: 'number',    domain: 'About your loved one', text: 'How old are they?', placeholder: 'Age' },
  { id: 'relation',   type: 'choice',    domain: 'About your loved one', text: 'What is your relationship to them?', options: ['Parent', 'Grandparent', 'Spouse', 'Sibling', 'Other'] },
  { id: 'memory1',    type: 'frequency', domain: 'Memory',    text: 'How often does {name} repeat the same question or story within the same conversation?' },
  { id: 'memory2',    type: 'frequency', domain: 'Memory',    text: 'Does {name} forget recent events or conversations from the past day or two?' },
  { id: 'language1',  type: 'frequency', domain: 'Language',  text: 'Does {name} pause mid-sentence searching for words, or use the wrong word without realising it?' },
  { id: 'language2',  type: 'frequency', domain: 'Language',  text: 'Does {name} have difficulty following a conversation or lose their train of thought?' },
  { id: 'attention1', type: 'frequency', domain: 'Attention', text: 'Does {name} seem confused in familiar places, like their own home or neighbourhood?' },
  { id: 'attention2', type: 'frequency', domain: 'Attention', text: 'Does {name} have difficulty following multi-step instructions, like a recipe or directions?' },
  { id: 'behavior',   type: 'frequency', domain: 'Behaviour', text: "Has {name}'s personality, mood, or social behaviour changed noticeably compared to 1-2 years ago?" },
  { id: 'judgment',   type: 'frequency', domain: 'Judgement', text: 'Has {name} made unusual financial decisions, had trouble managing bills, or seemed more vulnerable to being taken advantage of?' },
  { id: 'function',   type: 'choice',    domain: 'Daily Function', text: 'Is {name} still managing daily tasks independently?', options: ['Fully independent', 'Mostly independent, with occasional help', 'Needs help with some tasks', 'Needs help with most tasks', 'Requires full-time assistance'] },
  { id: 'trajectory', type: 'choice',    domain: 'Trajectory', text: 'Over the past 6 months, have the changes you are seeing gotten:', options: ['Better', 'Stayed the same', 'Slightly worse', 'Noticeably worse', 'Much worse'] },
]

const FREQUENCY_SCALE = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']

function domainLevel(scores) {
  const valid = scores.filter(s => s != null && !isNaN(s))
  if (!valid.length) return 'low'
  const avg = valid.reduce((a, b) => a + b, 0) / valid.length
  if (avg >= 3.5) return 'elevated'
  if (avg >= 2.0) return 'moderate'
  return 'low'
}

function computeResults(answers) {
  const lovedOneName = (typeof answers.name === 'string' ? answers.name : 'Your loved one').trim() || 'Your loved one'
  const lovedOneAge = answers.age || null
  const relationOptions = ['Parent', 'Grandparent', 'Spouse', 'Sibling', 'Other']
  const caregiverRelation = answers.relation ? (relationOptions[answers.relation - 1] || '') : ''

  const memory   = domainLevel([answers.memory1, answers.memory2])
  const language = domainLevel([answers.language1, answers.language2])
  const attention = domainLevel([answers.attention1, answers.attention2])
  const behavior  = domainLevel([answers.behavior, answers.judgment])

  const ds = { elevated: 2, moderate: 1, low: 0 }
  const domainTotal = ds[memory] + ds[language] + ds[attention] + ds[behavior]
  const functionScore = answers.function ? Math.floor((answers.function - 1) * 0.75) : 0
  const trajectoryScore = answers.trajectory ? Math.max(0, answers.trajectory - 2) : 0
  const total = domainTotal + functionScore + trajectoryScore

  const stageIndex = total <= 1 ? 0 : total <= 3 ? 1 : total <= 6 ? 2 : total <= 9 ? 3 : 4

  return { lovedOneName, lovedOneAge, caregiverRelation, stageIndex, memory, language, attention, behavior }
}

// ---- Fluent 2 theme — uses :root tokens from docs/cogcare-design-system/colors_and_type.css ----
const cogcareTheme = {
  colorBrandBackground: 'var(--color-forest)',
  colorBrandBackgroundHover: 'var(--color-forest-dark)',
  colorBrandBackgroundPressed: 'var(--color-forest-dark)',
  colorBrandForeground1: 'var(--color-forest)',
  colorNeutralForegroundOnBrand: '#FFFFFF',
  colorNeutralBackground1: 'var(--color-bg)',
  colorNeutralBackground2: 'var(--color-surface)',
  colorNeutralBackground3: 'var(--color-surface)',
  colorNeutralStroke1: 'var(--color-border)',
  colorNeutralStroke2: 'var(--color-border)',
  colorNeutralForeground1: 'var(--color-ink)',
  colorNeutralForeground2: 'var(--color-forest)',
  borderRadiusMedium: '12px',
  borderRadiusLarge: '16px',
  borderRadiusXLarge: '24px',
}

// ---- BHIQuiz ----
function BHIQuiz({ quizAnswers, setQuizAnswers, onComplete }) {
  const [qi, setQi] = useState(0)
  const total = CAREGIVER_QUESTIONS.length
  const q = CAREGIVER_QUESTIONS[qi]
  const pct = (qi + 1) / total
  const name = (typeof quizAnswers.name === 'string' && quizAnswers.name.trim()) || 'your loved one'
  const questionText = q.text.replace(/\{name\}/g, name)
  const currentValue = quizAnswers[q.id]

  const canProceed = (() => {
    if (q.type === 'text') return typeof currentValue === 'string' && currentValue.trim().length > 0
    if (q.type === 'number') return typeof currentValue === 'number' && currentValue > 0 && currentValue < 130
    return currentValue != null
  })()

  const setAnswer = (val) => setQuizAnswers(prev => ({ ...prev, [q.id]: val }))

  const handleNext = () => {
    if (!canProceed) return
    if (qi < total - 1) { setQi(qi + 1) } else { onComplete(computeResults(quizAnswers)) }
  }

  const handleBack = () => { if (qi > 0) setQi(qi - 1) }

  const options = q.type === 'frequency' ? FREQUENCY_SCALE : (q.options || [])

  return (
    <div className="flex h-full flex-col">
      {/* Progress + domain */}
      <div className="shrink-0 border-b border-border/80 bg-page px-4 pb-3 pt-3 sm:px-8 sm:pb-4 sm:pt-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-surface px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-clay ring-1 ring-border/60">
            {q.domain}
          </span>
          <span className="text-[11px] font-semibold tabular-nums text-forest/80">
            Question <span className="text-forest">{qi + 1}</span>
            <span className="mx-1 font-normal text-forest/40">/</span>
            {total}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border/90">
          <div className="h-full rounded-full bg-forest transition-[width] duration-500 ease-out" style={{ width: `${Math.min(100, pct * 100)}%` }} />
        </div>
      </div>

      {/* Question + input */}
      <div className="flex flex-1 min-h-0 flex-col px-4 py-4 sm:px-8 sm:py-5">
        <p className="mb-1.5 shrink-0 text-[10px] font-bold uppercase tracking-[0.25em] text-forest/40">
          {q.domain}
        </p>
        <h2 className="mb-4 shrink-0 font-serif text-[1.1rem] leading-snug tracking-tight text-ink sm:text-xl">
          {questionText}
        </h2>

        {/* Text input */}
        {q.type === 'text' && (
          <input
            type="text"
            value={currentValue || ''}
            onChange={e => setAnswer(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && canProceed) handleNext() }}
            placeholder={q.placeholder}
            autoFocus
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-ink-faint focus:border-forest focus:ring-2 focus:ring-forest/20"
          />
        )}

        {/* Number input */}
        {q.type === 'number' && (
          <input
            type="number"
            value={currentValue || ''}
            onChange={e => setAnswer(Number(e.target.value))}
            onKeyDown={e => { if (e.key === 'Enter' && canProceed) handleNext() }}
            placeholder={q.placeholder}
            min={1}
            max={120}
            autoFocus
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-base text-ink outline-none placeholder:text-ink-faint focus:border-forest focus:ring-2 focus:ring-forest/20"
          />
        )}

        {/* Choice or frequency buttons */}
        {(q.type === 'choice' || q.type === 'frequency') && (
          <fieldset className="min-h-0 min-w-0 flex-1 border-0 p-0">
            <legend className="sr-only">Choose one answer</legend>
            <div className="flex h-full flex-col justify-between gap-2">
              {options.map((label, i) => {
                const value = i + 1
                const isOn = currentValue === value
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setAnswer(value)}
                    className={[
                      'group flex w-full flex-1 items-center gap-3 rounded-xl border px-3 py-2 text-left transition-all duration-200',
                      isOn
                        ? 'border-forest bg-surface ring-2 ring-forest/15'
                        : 'border-border bg-white hover:border-clay/45 hover:bg-page active:scale-[0.99]',
                    ].join(' ')}
                  >
                    {q.type === 'frequency' && (
                      <span className={['flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold tabular-nums', isOn ? 'bg-forest text-white' : 'bg-surface text-forest group-hover:bg-border/80'].join(' ')} aria-hidden>
                        {value}
                      </span>
                    )}
                    <span className={['min-w-0 flex-1 text-[13px] font-medium leading-snug', isOn ? 'text-ink' : 'text-forest'].join(' ')}>
                      {label}
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>
        )}
      </div>

      {/* Navigation */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-surface/50 px-4 py-3 backdrop-blur-sm sm:px-8 sm:py-4">
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
          disabled={!canProceed}
          onClick={handleNext}
          icon={<ArrowRight className="h-4 w-4" />}
          iconPosition="after"
          className={!canProceed ? 'opacity-50' : ''}
        >
          {qi < total - 1 ? 'Next' : 'View results'}
        </Button>
      </div>
    </div>
  )
}

/**
 * Legacy email-only path when `VITE_COMPLETE_ASSESSMENT_URL` is unset: no Cognito onboarding or
 * “existing account” dashboard linking — use the Lambda URL for full quiz completion behavior.
 * In dev, Vite serves POST /api/send-quiz-email (see vite-plugin-local-email-api.js).
 */
const LEGACY_QUIZ_EMAIL_URL =
  import.meta.env.VITE_QUIZ_EMAIL_API_URL ||
  (import.meta.env.DEV ? '/api/send-quiz-email' : '')

// ---- BHIReport ----
function BHIReport({ quizResults, onReset, quizAnswers, onClose }) {
  const navigate = useNavigate()
  const [fnUrl, setFnUrl] = useState(() => getCompleteAssessmentUrl())
  useEffect(() => {
    let alive = true
    void primeCompleteAssessmentUrl().then(() => {
      if (alive) setFnUrl(getCompleteAssessmentUrl())
    })
    return () => {
      alive = false
    }
  }, [])
  const completeAssessmentUrl = fnUrl
  const canEmail = Boolean(completeAssessmentUrl || LEGACY_QUIZ_EMAIL_URL)

  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState('idle')
  const [emailMessage, setEmailMessage] = useState('')
  /** After successful Lambda submit: `new_user` | `existing_user` (legacy API omits). */
  const [emailScenario, setEmailScenario] = useState(null)
  const [existingAccountModalOpen, setExistingAccountModalOpen] = useState(false)

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
      await primeCompleteAssessmentUrl()
      const resolvedFnUrl = getCompleteAssessmentUrl()
      const url = resolvedFnUrl || LEGACY_QUIZ_EMAIL_URL
      const body = resolvedFnUrl
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
      const scenario =
        typeof data.scenario === 'string' ? data.scenario : 'new_user'
      setEmailScenario(scenario)
      setEmailStatus('sent')
      setEmailMessage('')
      if (resolvedFnUrl && scenario === 'existing_user') {
        setExistingAccountModalOpen(true)
        return
      }
    } catch (err) {
      setEmailStatus('error')
      let msg = err instanceof Error ? err.message : 'Could not send email.'
      if (msg === 'Failed to fetch' || msg === 'Load failed' || msg === 'NetworkError when attempting to fetch resource.') {
        msg =
          'Could not reach the email service. Try another network or browser, disable blockers, then confirm Amplify: backend deployed, Brevo secrets set, and Hosting env VITE_COMPLETE_ASSESSMENT_URL or build output runtime-email-config.json includes your Lambda Function URL.'
      }
      setEmailMessage(msg)
    }
  }

  const returnToEnc = encodeURIComponent('/dashboard')
  const encEmail = encodeURIComponent(email.trim())
  /** quizFlow=existing skips the “temporary password” hint on LoginPage. */
  const signInQuizUrl = `/login?from=quiz&quizFlow=existing&returnTo=${returnToEnc}&prefillEmail=${encEmail}`

  return (
    <div className="flex flex-col h-full">
      {existingAccountModalOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/50 p-4 sm:items-center"
          role="presentation"
          onClick={() => setExistingAccountModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="bhi-existing-account-title"
            className="w-full max-w-md rounded-2xl border border-border bg-page p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              id="bhi-existing-account-title"
              className="font-serif text-xl italic text-forest"
            >
              You already have an account
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-forest/90">
              This email is registered with CogCare. We added this quiz to your dashboard and emailed
              you your report.
            </p>
            <p className="mt-3 text-sm font-medium leading-relaxed text-forest">
              Check your email for a magic link—or, if you remember your password, sign in.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-forest px-4 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition hover:bg-forest-dark"
                onClick={() => {
                  setExistingAccountModalOpen(false)
                  onClose?.()
                  navigate(signInQuizUrl)
                }}
              >
                Sign in
              </button>
            </div>
            <button
              type="button"
              className="mt-4 w-full text-center text-sm text-clay underline-offset-4 hover:underline"
              onClick={() => setExistingAccountModalOpen(false)}
            >
              Not now
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-8 sm:py-6">
        <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-clay sr-only">
          Assessment Complete
        </p>
        <BHIReportContent
          quizResults={quizResults}
          email={email}
          setEmail={setEmail}
          emailStatus={emailStatus}
          emailMessage={emailMessage}
          onSendEmail={sendResultsEmail}
          canEmail={canEmail}
          emailScenario={emailScenario}
          onResetEmail={() => { setEmailStatus('idle'); setEmailScenario(null); setEmailMessage('') }}
        />
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-surface px-4 py-5 sm:px-8 sm:py-6">
        <p className="mb-4 text-[11px] leading-relaxed text-forest opacity-60">
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

  const ANALYZING_STEPS = [
    'Reviewing symptom patterns...',
    'Mapping to cognitive domains...',
    'Identifying care pathway...',
    'Preparing your report...',
  ]

  const [analyzing, setAnalyzing] = useState(false)
  const [analyzingStep, setAnalyzingStep] = useState(0)
  const pendingResults = useRef(null)
  const analyzingInterval = useRef(null)

  const handleComplete = useCallback((results) => {
    pendingResults.current = results
    setAnalyzing(true)
    setAnalyzingStep(0)
    let step = 0
    analyzingInterval.current = setInterval(() => {
      step++
      if (step >= ANALYZING_STEPS.length) {
        clearInterval(analyzingInterval.current)
        setTimeout(() => {
          setAnalyzing(false)
          setQuizResults(pendingResults.current)
        }, 600)
      } else {
        setAnalyzingStep(step)
      }
    }, 650)
  }, [setQuizResults])

  const handleReset = useCallback(() => {
    clearInterval(analyzingInterval.current)
    setAnalyzing(false)
    setAnalyzingStep(0)
    pendingResults.current = null
    setQuizAnswers({})
    setQuizResults(null)
  }, [setQuizAnswers, setQuizResults])

  const step = analyzing ? 'analyzing' : quizResults ? 'report' : 'quiz'

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
        className="animate-modal-panel flex min-h-0 max-h-full w-full max-w-none flex-col border-t border-border bg-page shadow-brand-lg sm:max-h-none sm:h-full sm:w-[58vw] sm:max-w-[700px] sm:min-w-[min(100%,320px)] sm:border-l sm:border-t-0 sm:shadow-brand-xl"
      >
        {/* Panel header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-4 sm:px-8 sm:py-5">
          <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
            <Brain className="h-5 w-5 shrink-0 text-clay" strokeWidth={1.5} aria-hidden="true" />
            <span className="truncate font-serif text-base italic text-forest sm:text-lg">
              Brain Health Index
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-forest transition-colors hover:bg-surface"
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
          {step === 'analyzing' && (
            <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
              <div style={{ marginBottom: 24 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%', background: '#F3EFE9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'bhi-pulse 1.4s ease-in-out infinite',
                }}>
                  <Brain className="h-[18px] w-[18px] text-clay" strokeWidth={1.5} />
                </div>
              </div>
              <p style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '1.2rem', fontStyle: 'italic', color: '#3D4B3E',
                marginBottom: 10, textAlign: 'center',
              }}>
                Analysing your responses
              </p>
              <p style={{
                fontSize: 13, color: '#A67B5B', fontWeight: 600,
                letterSpacing: '0.05em', minHeight: 20, textAlign: 'center',
                transition: 'opacity 0.3s',
              }}>
                {ANALYZING_STEPS[analyzingStep]}
              </p>
            </div>
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

