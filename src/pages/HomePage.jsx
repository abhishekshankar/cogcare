import { useState, useEffect, useRef, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import BrainHealthIndex from '../BrainHealthIndex'
import { useAuthIdentity } from '../lib/useAuthIdentity'
import CogcareHome from '../components/cogcare-home/CogcareHome.jsx'
import { X, ArrowRight, Brain } from 'lucide-react'

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const authIdentity = useAuthIdentity()
  const [showQuiz, setShowQuiz] = useState(false)
  const [showIntro, setShowIntro] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResults, setQuizResults] = useState(null)
  const handleCloseQuiz = useCallback(() => setShowQuiz(false), [])
  const closeIntroRef = useRef(null)

  useEffect(() => {
    if (searchParams.get('startQuiz') !== 'newSubject') return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- open quiz modal when landing with ?startQuiz=newSubject from dashboard
    setShowQuiz(true)
    const next = new URLSearchParams(searchParams)
    next.delete('startQuiz')
    setSearchParams(next, { replace: true })
  }, [searchParams, setSearchParams])

  useEffect(() => {
    if (!showIntro) return
    const onKey = (e) => {
      if (e.key === 'Escape') setShowIntro(false)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeIntroRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [showIntro])

  const startAssessment = useCallback(() => {
    setShowIntro(true)
  }, [])

  return (
    <div className="min-h-screen">
      <CogcareHome onTakeAssessment={startAssessment} authIdentity={authIdentity} />

      {showIntro && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forest/30 backdrop-blur-md p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="intro-title"
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-page shadow-2xl p-8 sm:p-10">
            <button
              ref={closeIntroRef}
              type="button"
              onClick={() => setShowIntro(false)}
              className="absolute top-5 right-5 text-ink-faint hover:text-ink transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-2xl bg-forest text-white px-6 py-5 mb-7">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-2">
                The clinical bottom line
              </p>
              <p className="text-base font-semibold leading-snug">
                By the time most people <em>notice</em> cognitive decline, it has been quietly progressing for 10–20 years. The window to act is now. Not later.
              </p>
            </div>

            <h2 id="intro-title" className="text-xl font-bold text-forest mb-4 leading-snug">
              What we're actually measuring
            </h2>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                { label: 'Memory', sub: 'encoding & recall' },
                { label: 'Attention', sub: 'focus & vigilance' },
                { label: 'Processing speed', sub: 'reaction & fluency' },
                { label: 'Executive function', sub: 'planning & control' },
              ].map(({ label, sub }) => (
                <div key={label} className="rounded-xl border border-forest/10 bg-white px-4 py-3">
                  <p className="text-xs font-bold text-forest">{label}</p>
                  <p className="text-[10px] text-ink-faint mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowIntro(false)
                setShowQuiz(true)
              }}
              className="w-full bg-forest text-white px-8 py-4 rounded-full font-bold uppercase tracking-[0.15em] text-[10px] flex items-center justify-center gap-3 hover:shadow-2xl hover:-translate-y-1 transition-all mb-6"
            >
              Start My Assessment
              <ArrowRight className="w-4 h-4" aria-hidden />
            </button>

            <div className="rounded-2xl bg-forest/5 border border-forest/10 px-5 py-4 mb-5 text-sm text-ink-muted flex gap-3 items-start">
              <Brain className="w-5 h-5 text-forest mt-0.5 shrink-0" aria-hidden />
              <p>
                You'll receive a <strong className="text-forest">personalised Brain Health report</strong> for your loved one, saved to your account and emailable to their doctor, so your observations are always on record.
              </p>
            </div>
          </div>
        </div>
      )}

      <BrainHealthIndex
        open={showQuiz}
        onClose={handleCloseQuiz}
        quizAnswers={quizAnswers}
        setQuizAnswers={setQuizAnswers}
        quizResults={quizResults}
        setQuizResults={setQuizResults}
      />
    </div>
  )
}
