import { useState, useEffect, useCallback } from 'react'
import {
  FluentProvider,
  RadioGroup,
  Radio,
  Button,
  ProgressBar,
} from '@fluentui/react-components'
import { Brain, X, ArrowRight, ChevronLeft } from 'lucide-react'

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
    <div className="flex flex-col h-full">
      {/* Progress header */}
      <div className="px-8 pt-6 pb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">{q.domain}</span>
          <span className="text-[11px] text-[#3D4B3E] font-medium">{qi + 1} of {total}</span>
        </div>
        <ProgressBar value={pct} max={1} thickness="medium" />
      </div>

      {/* Question + answers */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <h2 className="font-serif italic text-2xl text-[#1A1A1A] leading-snug mb-8">{q.text}</h2>
        <RadioGroup
          value={selected ? String(selected) : ''}
          onChange={handleSelect}
          layout="vertical"
        >
          {scale.map((label, i) => (
            <Radio key={String(i + 1)} value={String(i + 1)} label={label} />
          ))}
        </RadioGroup>
      </div>

      {/* Navigation */}
      <div className="px-8 py-5 border-t border-[#E8DCC4] flex items-center justify-between bg-[#FDFBF7]">
        {qi > 0 ? (
          <Button
            appearance="subtle"
            icon={<ChevronLeft className="w-4 h-4" />}
            onClick={handleBack}
          >
            Back
          </Button>
        ) : (
          <div />
        )}
        <Button
          appearance="primary"
          disabled={!selected}
          onClick={handleNext}
          icon={<ArrowRight className="w-4 h-4" />}
          iconPosition="after"
        >
          {qi < total - 1 ? 'Next' : 'View Results'}
        </Button>
      </div>
    </div>
  )
}

const URGENCY_CONFIG = {
  HIGH:      { label: 'High Priority', color: '#c0392b', bg: '#fdf0ef' },
  UNCERTAIN: { label: 'Uncertain',     color: '#e67e22', bg: '#fef6ed' },
  LOW:       { label: 'Low Concern',   color: '#27ae60', bg: '#edfaf1' },
}

// ---- BHIReport ----
function BHIReport({ quizResults, onReset }) {
  const { differentials, domains, urgency } = quizResults
  // TODO: surface motorFlag — motor symptoms warrant a specialist referral note
  const u = URGENCY_CONFIG[urgency] ?? URGENCY_CONFIG['LOW']

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-8 py-6">

        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A67B5B] mb-2">
            Assessment Complete
          </p>
          <h2 className="font-serif italic text-3xl text-[#1A1A1A] mb-4">
            Your Brain Health Index
          </h2>
          <span
            className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full"
            style={{ color: u.color, background: u.bg }}
          >
            {u.label}
          </span>
        </div>

        {/* Differentials */}
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3D4B3E] opacity-50 mb-4">
            Differential Analysis
          </p>
          <div className="space-y-4">
            {differentials.map(d => (
              <div key={d.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[12px] font-medium text-[#1A1A1A]">{d.label}</span>
                  <span className="text-[11px] font-bold" style={{ color: d.color }}>
                    {d.probability}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#E8DCC4] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${d.probability}%`, background: d.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Domain scores */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3D4B3E] opacity-50 mb-4">
            Domain Scores
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(domains).map(([name, score]) => (
              <span
                key={name}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-[#E8DCC4]"
                style={{
                  background: score > 60 ? '#fdf0ef' : '#F3EFE9',
                  color: score > 60 ? '#c0392b' : '#3D4B3E',
                }}
              >
                {name}: {score}%
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="px-8 py-6 border-t border-[#E8DCC4] bg-[#F3EFE9]">
        <p className="text-[11px] text-[#3D4B3E] opacity-60 mb-4 leading-relaxed">
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
    <FluentProvider
      theme={cogcareTheme}
      style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex' }}
    >
      {/* Dimmed backdrop — click to close */}
      <div
        role="button"
        tabIndex={0}
        className="flex-1 animate-modal-backdrop cursor-pointer"
        style={{ background: 'rgba(61,75,62,0.5)' }}
        onClick={onClose}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClose() }}
        aria-label="Close assessment"
      />

      {/* Slide-in panel */}
      <div
        className="animate-modal-panel flex flex-col bg-[#FDFBF7]"
        style={{
          width: '58vw',
          maxWidth: '700px',
          minWidth: '320px',
          borderLeft: '1px solid #E8DCC4',
          boxShadow: '-20px 0 60px rgba(61,75,62,0.15)',
        }}
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#E8DCC4] shrink-0">
          <div className="flex items-center gap-2.5">
            <Brain className="w-5 h-5 text-[#A67B5B]" strokeWidth={1.5} aria-hidden="true" />
            <span className="font-serif italic text-lg text-[#3D4B3E]">Brain Health Index</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F3EFE9] transition-colors text-[#3D4B3E]"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
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
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </FluentProvider>
  )
}

export { cogcareTheme, computeResults, CCA_QUIZ_QUESTIONS, CCA_LIKERT, CCA_GLOBAL_SCALE, BHIQuiz, BHIReport }
