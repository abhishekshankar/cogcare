import { useState } from 'react'
import { Brain, Calendar, Map, Shield, Download, Mail, Share2, Check, Info, Loader2 } from 'lucide-react'

const STAGES = [
  { label: 'Normal Aging',    short: 'Normal',   desc: 'Memory lapses typical of age. No intervention needed.' },
  { label: 'Early Changes',   short: 'Early',    desc: 'Subtle but consistent changes that warrant professional attention.' },
  { label: 'Mild Impairment', short: 'Mild MCI', desc: 'Noticeable cognitive changes affecting some daily activities.' },
  { label: 'Moderate',        short: 'Moderate', desc: 'Significant memory and thinking difficulties requiring support.' },
  { label: 'Advanced',        short: 'Advanced', desc: 'Substantial care and structured support required.' },
]

const DOMAIN_COPY = {
  memory: {
    elevated: 'Repeating the same questions within short periods, forgetting recent conversations with family.',
    moderate: 'Occasionally forgetting appointments and recent events, generally recovers with reminders.',
    low:      'Mild forgetfulness consistent with normal aging -- names, occasional dates.',
  },
  language: {
    elevated: 'Frequently pausing mid-sentence to search for words, substituting incorrect words without awareness.',
    moderate: 'Struggling to recall common words in conversation, sometimes losing train of thought.',
    low:      'No significant language changes reported at this time.',
  },
  attention: {
    elevated: 'Confusion in familiar environments, difficulty following multi-step tasks or conversations.',
    moderate: 'Difficulty concentrating on complex tasks, easily distracted in busy environments.',
    low:      'Attention appears largely intact for routine activities.',
  },
  behavior: {
    elevated: 'Noticeable personality shifts, increased anxiety, or withdrawal from social activities.',
    moderate: 'Occasional irritability or mood changes, slightly more than baseline for this person.',
    low:      'Mood and personality appear stable, minor irritability noted.',
  },
}

const DOMAIN_META = {
  memory:    { emoji: '🧩', label: 'Memory' },
  language:  { emoji: '💬', label: 'Language' },
  attention: { emoji: '🔍', label: 'Attention' },
  behavior:  { emoji: '🌿', label: 'Behavior' },
}

const CONCERN_LABEL = { low: 'Low concern', moderate: 'Moderate concern', elevated: 'Elevated concern' }

const CONCERN_STYLE = {
  low:      { bg: '#EEF5F0', border: '#B8D9C1', color: '#2A5A3A', dot: '#4A9060' },
  moderate: { bg: '#FDF3E8', border: '#F0C07A', color: '#7A4A10', dot: '#C4813A' },
  elevated: { bg: '#FBF0ED', border: '#DFA89E', color: '#7A2E1F', dot: '#A84232' },
}

function StageSpectrum({ stageIndex }) {
  const pct = (stageIndex / (STAGES.length - 1)) * 100
  return (
    <div style={{ padding: '4px 0 8px' }}>
      <div style={{
        position: 'relative', height: 10, borderRadius: 9999, overflow: 'visible',
        background: 'linear-gradient(to right, #4A9060, #8DC07A, #E8C060, #D4804A, #A84232)',
        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
      }}>
        {STAGES.map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: -3, bottom: -3,
            left: `${(i / (STAGES.length - 1)) * 100}%`,
            transform: 'translateX(-50%)',
            width: i === 0 || i === STAGES.length - 1 ? 0 : 1,
            background: 'rgba(255,255,255,0.5)',
          }} />
        ))}
        <div style={{
          position: 'absolute', top: '50%',
          left: `${pct}%`,
          transform: 'translate(-50%, -50%)',
          width: 22, height: 22,
          background: 'white',
          borderRadius: '50%',
          border: '3px solid #3D4B3E',
          boxShadow: '0 2px 8px rgba(26,60,52,0.25)',
          zIndex: 2,
          transition: 'left 0.6s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 8, height: 8, borderRadius: '50%', background: '#3D4B3E',
          }} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        {STAGES.map((s, i) => (
          <div key={i} style={{
            flex: 1, textAlign: 'center',
            fontSize: i === stageIndex ? 10 : 9,
            fontWeight: i === stageIndex ? 700 : 500,
            color: i === stageIndex ? '#3D4B3E' : 'rgba(61,75,62,0.4)',
            lineHeight: 1.3,
            transition: 'all 0.3s',
          }}>
            {s.short}
            {i === stageIndex && (
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#3D4B3E', margin: '4px auto 0' }} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function DomainCard({ domain, level, delay }) {
  const meta = DOMAIN_META[domain]
  const sty = CONCERN_STYLE[level] ?? CONCERN_STYLE.low
  const copy = DOMAIN_COPY[domain]?.[level] ?? ''
  return (
    <div className={`fade-up ${delay}`} style={{
      background: sty.bg, border: `1px solid ${sty.border}`,
      borderRadius: 18, padding: '16px 18px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>{meta.emoji}</span>
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', color: '#1A1A1A' }}>{meta.label}</span>
        </div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em',
          padding: '3px 10px', borderRadius: 9999,
          background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(0,0,0,0.06)',
          color: sty.color, whiteSpace: 'nowrap',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: sty.dot, display: 'inline-block', flexShrink: 0 }} />
          {CONCERN_LABEL[level]}
        </span>
      </div>
      <p style={{ fontSize: 12.5, lineHeight: 1.65, color: sty.color, fontStyle: 'italic', margin: 0, opacity: 0.9 }}>
        "{copy}"
      </p>
    </div>
  )
}

function CarePathway() {
  const steps = [
    { icon: <Brain size={18} />, label: 'Today', sublabel: 'Assessment complete', desc: "You've taken the most important first step -- noticing and acting.", active: true },
    { icon: <Calendar size={18} />, label: 'Next 7-14 days', sublabel: 'Specialist consult', desc: 'A 45-minute session with a cognitive health specialist to interpret these results.', active: false },
    { icon: <Map size={18} />, label: 'Next 3-6 months', sublabel: 'Personalised care plan', desc: 'A structured roadmap: monitoring cadence, lifestyle interventions, and next evaluations.', active: false },
  ]
  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute', top: 28, left: 28, right: 28, height: 2,
        background: 'linear-gradient(to right, #3D4B3E, rgba(61,75,62,0.2))',
        zIndex: 0,
      }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, position: 'relative', zIndex: 1 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: s.active ? '#3D4B3E' : 'white',
              border: `2px solid ${s.active ? '#3D4B3E' : '#E8DCC4'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 12,
              boxShadow: s.active ? '0 6px 20px rgba(61,75,62,0.2)' : '0 2px 8px rgba(26,60,52,0.06)',
              color: s.active ? 'white' : '#3D4B3E',
            }}>
              {s.icon}
            </div>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#A67B5B', marginBottom: 3 }}>{s.label}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#3D4B3E', marginBottom: 6, lineHeight: 1.3 }}>{s.sublabel}</div>
            <div style={{ fontSize: 11.5, color: '#64748B', lineHeight: 1.6 }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function BHIReportContent({
  quizResults,
  showActions = true,
  email, setEmail,
  emailStatus, emailMessage,
  onSendEmail, canEmail,
  emailScenario, onResetEmail,
}) {
  if (!quizResults) return null

  const { lovedOneName, lovedOneAge, stageIndex, memory, language, attention, behavior } = quizResults
  const name = lovedOneName || 'Your loved one'
  const stage = STAGES[stageIndex ?? 0]

  const domains = [
    { key: 'memory',    level: memory },
    { key: 'language',  level: language },
    { key: 'attention', level: attention },
    { key: 'behavior',  level: behavior },
  ]
  const elevatedCount = domains.filter(d => d.level === 'elevated').length
  const moderateCount = domains.filter(d => d.level === 'moderate').length

  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showGuideForm, setShowGuideForm] = useState(false)
  const [guideEmail, setGuideEmail] = useState('')
  const [guideSent, setGuideSent] = useState(false)

  const handleShareClick = () => {
    setShowEmailForm(true)
    setTimeout(() => {
      document.getElementById('bhi-share-email-input')?.focus()
    }, 50)
  }

  return (
    <div style={{ maxWidth: 660, margin: '0 auto' }}>

      {/* 1. Caregiver validation opener */}
      <div className="fade-up d1" style={{
        background: 'linear-gradient(135deg, rgba(74,144,96,0.07) 0%, rgba(243,239,233,0.6) 100%)',
        border: '1px solid rgba(74,144,96,0.18)',
        borderRadius: 24, padding: '24px 26px', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{
            flexShrink: 0, width: 36, height: 36, borderRadius: '50%',
            background: '#3D4B3E', display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 2,
          }}>
            <Check size={16} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '1.15rem', lineHeight: 1.55, color: '#1A1A1A', fontStyle: 'italic', marginBottom: 8,
            }}>
              You noticed something was different. That instinct is almost always right --{' '}
              <strong style={{ fontStyle: 'normal', color: '#3D4B3E' }}>
                most caregivers notice signs 1-2 years before a formal diagnosis.
              </strong>
            </p>
            <p style={{ fontSize: 12.5, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              This report reflects what you shared about {name}{lovedOneAge ? `, age ${lovedOneAge}` : ''}. It is a clinical screening guide, not a diagnosis.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Cognitive stage */}
      <div className="fade-up d2" style={{
        background: 'white', border: '1px solid #E8DCC4',
        borderRadius: 24, padding: '22px 24px', marginBottom: 20,
        boxShadow: '0 2px 12px rgba(26,60,52,0.05)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#A67B5B', marginBottom: 6 }}>
              Cognitive Stage Assessment
            </div>
            <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.75rem', color: '#1A1A1A', lineHeight: 1.2 }}>
              {stage.label}
            </div>
          </div>
          <div style={{
            flexShrink: 0, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em',
            color: '#3D4B3E', background: '#F3EFE9', border: '1px solid #E8DCC4',
            borderRadius: 9999, padding: '5px 14px', marginTop: 4,
          }}>
            For {name}
          </div>
        </div>
        <StageSpectrum stageIndex={stageIndex ?? 0} />
        <div style={{ marginTop: 14, borderRadius: 14, border: '1px solid #E8DCC4', padding: '14px 16px', background: '#FDFBF7' }}>
          <p style={{ fontSize: 13, color: '#1A1A1A', lineHeight: 1.5, margin: '0 0 10px' }}>{stage.desc}</p>
          <div style={{ height: 1, borderTop: '1px dashed #E8DCC4', margin: '10px 0' }} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Info size={13} style={{ color: '#A67B5B', flexShrink: 0, marginTop: 1 }} />
            <p style={{ fontSize: 11.5, color: '#A67B5B', fontStyle: 'italic', lineHeight: 1.5, margin: 0 }}>
              This is a screening indicator, not a medical diagnosis. Only a licensed clinician can diagnose cognitive conditions.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Symptom domains */}
      <div className="fade-up d3" style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#A67B5B', marginBottom: 6 }}>
            Symptom Domains
          </div>
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.3rem', color: '#1A1A1A', lineHeight: 1.25, marginBottom: 8 }}>
            What the assessment revealed
          </div>
          <p style={{ fontSize: 12.5, color: '#64748B', lineHeight: 1.6, margin: 0 }}>
            Based on your responses, {name} shows{' '}
            {elevatedCount > 0 && <><strong style={{ color: '#7A2E1F' }}>{elevatedCount} elevated</strong> and </>}
            <strong style={{ color: '#7A4A10' }}>{moderateCount} moderate</strong> concern area{moderateCount !== 1 ? 's' : ''}.{' '}
            The quoted behaviors below are drawn directly from what you reported.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {domains.map((d, i) => (
            <DomainCard key={d.key} domain={d.key} level={d.level} delay={`d${i + 4}`} />
          ))}
        </div>
      </div>

      {/* 4. Care pathway */}
      <div className="fade-up d5" style={{
        background: 'white', border: '1px solid #E8DCC4',
        borderRadius: 24, padding: '22px 24px', marginBottom: 20,
        boxShadow: '0 2px 12px rgba(26,60,52,0.05)',
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#A67B5B', marginBottom: 6 }}>
          Your Care Pathway
        </div>
        <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.3rem', color: '#1A1A1A', marginBottom: 20, lineHeight: 1.25 }}>
          A clear path forward
        </div>
        <CarePathway />
      </div>

      {/* 5. What happens in a consult */}
      <div className="fade-up d6" style={{
        background: 'rgba(243,239,233,0.55)', border: '1px solid #E8DCC4',
        borderRadius: 24, padding: '22px 26px', marginBottom: 20,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 }}>
          <Shield size={16} style={{ color: '#3D4B3E', flexShrink: 0 }} />
          <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '1.15rem', color: '#3D4B3E' }}>
            What actually happens in a consult
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            ['No surprises', `The specialist will have already reviewed this report. The session is a conversation, not an exam. ${name} will not be "tested" in a stressful way.`],
            ['Your loved one stays comfortable', `Cognitive assessments are designed to be calm and conversational. Most people find them less intimidating than they expected.`],
            ['You are part of the conversation', `Caregivers are an essential part of the appointment. Your observations -- like the ones you recorded today -- are clinical data.`],
            ['No commitment required', `The consult produces a recommendation, not an obligation. You leave with clarity and options, not a forced care plan.`],
          ].map(([title, body], i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
                background: '#3D4B3E', color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, marginTop: 1,
              }}>{i + 1}</div>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#3D4B3E' }}>{title}. </span>
                <span style={{ fontSize: 13, color: '#64748B', lineHeight: 1.65 }}>{body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Primary CTA */}
      <div className="fade-up d7" style={{
        background: 'linear-gradient(135deg, #1A3C34 0%, #3D4B3E 100%)',
        borderRadius: 28, padding: '28px 28px 24px', marginBottom: 20,
        boxShadow: '0 12px 40px rgba(26,60,52,0.18)',
      }}>
        {/* Doctor intro */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 22 }}>
          <img
            src="https://bri.ucla.edu/wp-content/uploads/2025/03/Nasir_I_Photo.jpg"
            alt="Dr. Imaad Nasir, M.D."
            style={{
              width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', flexShrink: 0,
              border: '2px solid rgba(255,255,255,0.25)',
            }}
          />
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'white', margin: '0 0 2px' }}>
              Dr. Imaad Nasir, M.D.
            </p>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#A67B5B', margin: '0 0 6px' }}>
              Neurology · UCLA Brain Research Institute
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.55, margin: 0 }}>
              Assistant Clinical Professor at UCLA's David Geffen School of Medicine. Book a free consult to discuss what these results mean for your loved one.
            </p>
          </div>
        </div>
        <a
          href="https://calendly.com/cogcare/30min"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            width: '100%', padding: '18px 28px',
            background: 'white', color: '#3D4B3E', border: 'none', borderRadius: 9999,
            fontSize: 14, fontWeight: 700, letterSpacing: '0.02em',
            textDecoration: 'none', marginBottom: 14,
            boxSizing: 'border-box',
          }}
        >
          Review these results with a cognitive specialist
          <span style={{ marginLeft: 8, fontSize: 11, opacity: 0.6, fontWeight: 500 }}>Recommended</span>
        </a>
        <p style={{
          textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.75)',
          lineHeight: 1.6, fontStyle: 'italic', margin: 0,
        }}>
          You're not overreacting. Getting expert eyes on this early is one of the most loving things you can do.
        </p>
      </div>

      {/* 7. Save / share */}
      {showActions && <>
      <div className="fade-up d7" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(61,75,62,0.45)', textAlign: 'center', marginBottom: 14 }}>
          Save or share this report
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
          {[
            { label: 'Download PDF', sub: 'Full report', icon: <Download size={15} /> },
            { label: 'Email to family', sub: 'Share with loved ones', icon: <Mail size={15} /> },
            { label: 'Send to doctor', sub: 'Share with their GP', icon: <Share2 size={15} /> },
          ].map((btn, i) => (
            <button key={i} onClick={handleShareClick} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '16px 10px', gap: 6,
              background: 'white', border: '1px solid #E8DCC4', borderRadius: 18,
              color: '#3D4B3E', cursor: 'pointer',
              transition: 'background 0.2s, box-shadow 0.2s',
              fontFamily: 'inherit',
            }}>
              <span>{btn.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{btn.label}</span>
              <span style={{ fontSize: 10, fontWeight: 400, color: 'rgba(61,75,62,0.5)' }}>{btn.sub}</span>
            </button>
          ))}
        </div>

        {showEmailForm && (
          <div style={{ marginTop: 12, border: '1px solid #E8DCC4', borderRadius: 16, padding: '16px 18px', background: '#FDFBF7' }}>
            {emailStatus === 'sent' ? (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em', color: '#A67B5B', marginBottom: 8 }}>
                  Check your inbox
                </p>
                <p style={{ fontSize: 13, color: '#3D4B3E', margin: '0 0 8px' }}>
                  Your Brain Health Index report has been sent to {email}.
                </p>
                <button onClick={onResetEmail} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#A67B5B', textDecoration: 'underline', textUnderlineOffset: 3, padding: 0 }}>
                  Wrong email? Try again
                </button>
              </div>
            ) : (
              <>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#3D4B3E', marginBottom: 10, opacity: 0.7 }}>
                  Enter your email and we'll send you the full report.
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    id="bhi-share-email-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') onSendEmail() }}
                    disabled={emailStatus === 'sending'}
                    style={{
                      flex: 1, padding: '10px 14px', borderRadius: 10,
                      border: '1px solid #E8DCC4', background: 'white',
                      fontSize: 13, color: '#1A1A1A', outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                  <button
                    onClick={onSendEmail}
                    disabled={!canEmail || emailStatus === 'sending'}
                    style={{
                      padding: '10px 18px', borderRadius: 10,
                      background: '#3D4B3E', color: 'white', border: 'none',
                      fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.08em',
                      textTransform: 'uppercase', opacity: emailStatus === 'sending' ? 0.6 : 1,
                      display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit',
                    }}
                  >
                    {emailStatus === 'sending' ? <><Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />Sending</> : 'Send'}
                  </button>
                </div>
                {emailStatus === 'error' && emailMessage && (
                  <p style={{ fontSize: 12, color: '#A84232', marginTop: 8, lineHeight: 1.5 }}>{emailMessage}</p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* 8. Not ready to book */}
      <div className="fade-up d8" style={{
        border: '1px dashed #E8DCC4', borderRadius: 20, padding: '20px 22px',
        textAlign: 'center', marginBottom: 8,
      }}>
        {!showGuideForm ? (
          <>
            <p style={{ fontSize: 13.5, color: '#3D4B3E', marginBottom: 6, lineHeight: 1.6 }}>
              <strong>Not ready to book?</strong> That's okay.
            </p>
            <p style={{ fontSize: 12.5, color: '#64748B', marginBottom: 12, lineHeight: 1.6 }}>
              Get our caregiver's guide + symptom tracker by email. Free, no commitment.
            </p>
            <button onClick={() => setShowGuideForm(true)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 13.5, fontWeight: 600, color: '#A67B5B',
              textDecoration: 'underline', textUnderlineOffset: 3, fontFamily: 'inherit',
            }}>
              Send me the caregiver's guide →
            </button>
          </>
        ) : guideSent ? (
          <p style={{ fontSize: 13, color: '#3D4B3E', fontWeight: 500, margin: 0 }}>Guide sent! Check your inbox.</p>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={guideEmail}
              onChange={e => setGuideEmail(e.target.value)}
              style={{
                flex: 1, padding: '10px 14px', borderRadius: 10,
                border: '1px solid #E8DCC4', fontSize: 13, outline: 'none', fontFamily: 'inherit',
              }}
            />
            <button
              onClick={() => setGuideSent(true)}
              style={{
                padding: '10px 16px', borderRadius: 10,
                background: '#A67B5B', color: 'white', border: 'none',
                fontSize: 11, fontWeight: 700, cursor: 'pointer',
                textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'inherit',
              }}
            >
              Send
            </button>
          </div>
        )}
      </div>
      </>}

    </div>
  )
}
