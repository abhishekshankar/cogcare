// CogCare.org Homepage — Sections

// ═══════════════════════════════════════════════════════════════════════════
// NAV
// ═══════════════════════════════════════════════════════════════════════════

function Nav({ onCTA }) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: scrolled ? 'rgba(253,251,247,0.88)' : 'rgba(253,251,247,0.4)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: scrolled ? '1px solid var(--color-sand)' : '1px solid transparent',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '18px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24
      }}>
        <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Ico.brain size={22} color="var(--color-clay)" />
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 22, color: 'var(--color-forest)', letterSpacing: '-0.02em', fontWeight: 500
          }}>
            Cog<em style={{ fontStyle: 'italic' }}>Care</em>
          </span>
        </a>

        <div className="nav-links" style={{
          display: 'flex', gap: 32, alignItems: 'center'
        }}>
          {['How it works', 'The Index', 'Science', 'About', 'FAQ'].map(l => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} style={{
              fontSize: 13, color: 'var(--color-forest)', textDecoration: 'none',
              fontWeight: 500, opacity: 0.75,
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={e => e.target.style.opacity = 1}
            onMouseLeave={e => e.target.style.opacity = 0.75}>
              {l}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="#" style={{
            fontSize: 13, color: 'var(--color-forest)', textDecoration: 'none',
            fontWeight: 500, opacity: 0.75, display: 'none'
          }} className="nav-signin">Sign in</a>
          <BtnPrimary onClick={onCTA} style={{ padding: '10px 18px', fontSize: 10 }}>
            Take the Index
          </BtnPrimary>
        </div>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HERO — Editorial
// ═══════════════════════════════════════════════════════════════════════════

function Hero({ tone, audience, headlineCopy, onCTA }) {
  const copy = {
    warm: {
      eyebrow: 'Brain Health Index · 8 minutes',
      headline: <>You noticed something.<br /><em>That instinct deserves to be taken seriously.</em></>,
      sub: "A warm, confidential assessment that turns what you've observed about a loved one into a clear next step — reviewed by cognitive specialists."
    },
    clinical: {
      eyebrow: 'Clinically validated · 8-minute screening',
      headline: <>Early signs matter. <em>We help you read them.</em></>,
      sub: "The Brain Health Index is a structured screening tool that translates observed behaviors into domain-level cognitive indicators, reviewed by board-certified specialists."
    },
    urgent: {
      eyebrow: 'The window matters',
      headline: <>The first two years are the ones that count. <em>Don't wait.</em></>,
      sub: "Most caregivers notice signs 1–2 years before diagnosis. Early action opens every door — from reversible causes to disease-modifying therapies. Start in 8 minutes."
    }
  };
  const c = copy[tone] || copy.warm;
  const head = headlineCopy || c.headline;

  return (
    <Section style={{ padding: 'clamp(40px, 6vw, 80px) 0 clamp(60px, 8vw, 100px)' }}>
      <div className="hero-grid" style={{
        display: 'grid',
        gridTemplateColumns: '1.1fr 0.9fr',
        gap: 'clamp(32px, 5vw, 80px)',
        alignItems: 'center'
      }}>
        {/* Copy side */}
        <div>
          <SectionLabel style={{ marginBottom: 24 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '4px 10px', background: 'rgba(166,123,91,0.08)',
              border: '1px solid rgba(166,123,91,0.2)',
              borderRadius: 9999, color: 'var(--color-clay)'
            }}>
              <span style={{ width: 6, height: 6, background: 'var(--color-clay)', borderRadius: '50%' }} />
              {c.eyebrow}
            </span>
          </SectionLabel>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2.25rem, 5.5vw, 4.2rem)',
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
            color: 'var(--color-forest)',
            marginBottom: 24,
            textWrap: 'balance'
          }}>
            {head}
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 1.35vw, 18px)',
            lineHeight: 1.7,
            color: 'var(--color-text-secondary)',
            maxWidth: 520,
            marginBottom: 36,
            textWrap: 'pretty'
          }}>
            {c.sub}
          </p>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <BtnPrimary onClick={onCTA} large>
              Take the Brain Health Index
              <Ico.arrowRight size={14} color="white" />
            </BtnPrimary>
            <BtnGhost>
              <Ico.clock size={14} /> Learn how it works
            </BtnGhost>
          </div>

          {/* Trust strip */}
          <div style={{
            display: 'flex', gap: 28, marginTop: 48, flexWrap: 'wrap',
            paddingTop: 28, borderTop: '1px solid var(--color-sand)'
          }}>
            {[
              { icon: <Ico.shield size={16} color="var(--color-clay)" />, label: 'HIPAA-grade privacy' },
              { icon: <Ico.heart size={16} color="var(--color-clay)" />, label: 'Nonprofit 501(c)(3)' },
              { icon: <Ico.users size={16} color="var(--color-clay)" />, label: 'Reviewed by specialists' },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {t.icon}
                <span style={{
                  fontSize: 12, color: 'var(--color-forest)', opacity: 0.75,
                  fontWeight: 500
                }}>{t.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Image side */}
        <div style={{ position: 'relative', minHeight: 480 }}>
          {/* Organic background blobs */}
          <Blob color="var(--color-clay)" opacity={0.08} style={{ top: -40, right: -60, width: 260, height: 260 }} />
          <Blob color="var(--color-forest)" opacity={0.06} style={{ bottom: -40, left: -40, width: 200, height: 200 }} />

          {/* Hero illustration — warm editorial composition */}
          <div style={{
            position: 'relative',
            aspectRatio: '4/5',
            borderRadius: 32,
            overflow: 'hidden',
            boxShadow: '0 30px 80px -20px rgba(26,60,52,0.22)',
            transform: 'rotate(-1deg)',
            background: 'linear-gradient(165deg, #F3EFE9 0%, #E8DCC4 45%, #D4B594 100%)'
          }}>
            <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
              <defs>
                <radialGradient id="sun" cx="75%" cy="25%" r="55%">
                  <stop offset="0%" stopColor="#FFF5E1" stopOpacity="0.95"/>
                  <stop offset="40%" stopColor="#F5E6C8" stopOpacity="0.5"/>
                  <stop offset="100%" stopColor="#E8DCC4" stopOpacity="0"/>
                </radialGradient>
                <linearGradient id="windowLight" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FEF8E7" stopOpacity="0.85"/>
                  <stop offset="100%" stopColor="#F3E3B8" stopOpacity="0"/>
                </linearGradient>
                <linearGradient id="skin1" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#E8C9A8"/>
                  <stop offset="100%" stopColor="#C9A882"/>
                </linearGradient>
                <linearGradient id="skin2" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#D4B594"/>
                  <stop offset="100%" stopColor="#A67B5B"/>
                </linearGradient>
                <linearGradient id="sweater" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#5A6A55"/>
                  <stop offset="100%" stopColor="#3D4B3E"/>
                </linearGradient>
                <linearGradient id="shawl" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#E8DCC4"/>
                  <stop offset="100%" stopColor="#B89874"/>
                </linearGradient>
                <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="0.4"/>
                </filter>
              </defs>

              {/* Sunlit window wash */}
              <rect width="400" height="500" fill="url(#sun)"/>

              {/* Distant window frame / soft bokeh background */}
              <rect x="240" y="30" width="150" height="220" fill="url(#windowLight)" opacity="0.8" rx="4"/>
              <line x1="315" y1="30" x2="315" y2="250" stroke="#F3E3B8" strokeWidth="2" opacity="0.5"/>
              <line x1="240" y1="140" x2="390" y2="140" stroke="#F3E3B8" strokeWidth="2" opacity="0.5"/>

              {/* Soft leafy bokeh dots */}
              <circle cx="50" cy="80" r="28" fill="#C9D4B5" opacity="0.35"/>
              <circle cx="90" cy="50" r="18" fill="#B8C4A0" opacity="0.3"/>
              <circle cx="30" cy="140" r="20" fill="#D4B594" opacity="0.25"/>

              {/* Table surface */}
              <path d="M 0 380 Q 200 365 400 380 L 400 500 L 0 500 Z" fill="#B89874" opacity="0.55"/>
              <path d="M 0 380 Q 200 365 400 380 L 400 390 Q 200 375 0 390 Z" fill="#A67B5B" opacity="0.4"/>

              {/* Tea cup on table (distant left) */}
              <ellipse cx="70" cy="390" rx="28" ry="6" fill="#3D4B3E" opacity="0.12"/>
              <path d="M 48 380 Q 48 365 70 365 Q 92 365 92 380 Q 90 392 70 392 Q 50 392 48 380 Z" fill="#FDFBF7"/>
              <ellipse cx="70" cy="367" rx="20" ry="4" fill="#A67B5B" opacity="0.5"/>
              <path d="M 88 378 Q 98 378 98 384 Q 98 388 90 388" fill="none" stroke="#FDFBF7" strokeWidth="2.5"/>
              {/* Steam */}
              <path d="M 62 360 Q 58 350 62 342 Q 66 334 62 326" stroke="#FDFBF7" strokeWidth="2" fill="none" opacity="0.6" strokeLinecap="round"/>
              <path d="M 72 360 Q 76 348 72 338" stroke="#FDFBF7" strokeWidth="2" fill="none" opacity="0.4" strokeLinecap="round"/>

              {/* Older figure — background, shawled shoulders */}
              <g opacity="0.95" filter="url(#soft)">
                {/* Shoulders/shawl */}
                <path d="M 140 500 Q 130 420 180 380 Q 220 355 260 380 Q 310 420 300 500 Z" fill="url(#shawl)"/>
                {/* Shawl fold detail */}
                <path d="M 165 460 Q 195 430 230 440" stroke="#A67B5B" strokeWidth="1.5" fill="none" opacity="0.4"/>
                <path d="M 175 485 Q 215 460 260 475" stroke="#A67B5B" strokeWidth="1.5" fill="none" opacity="0.3"/>
                {/* Neck */}
                <path d="M 205 360 Q 215 375 225 360 L 230 385 Q 215 395 200 385 Z" fill="url(#skin2)"/>
                {/* Head */}
                <ellipse cx="215" cy="320" rx="48" ry="55" fill="url(#skin2)"/>
                {/* Hair - silver, swept back */}
                <path d="M 168 315 Q 165 275 200 265 Q 235 262 262 285 Q 268 305 260 320 Q 250 290 215 285 Q 185 290 172 320 Z" fill="#D4C4B0"/>
                <path d="M 170 312 Q 178 295 195 290" stroke="#E8DCC4" strokeWidth="2" fill="none" opacity="0.7"/>
                <path d="M 240 290 Q 255 295 260 310" stroke="#E8DCC4" strokeWidth="2" fill="none" opacity="0.7"/>
                {/* Subtle facial shadows — no features, abstract */}
                <ellipse cx="200" cy="330" rx="4" ry="2" fill="#8B6F47" opacity="0.4"/>
                <ellipse cx="230" cy="330" rx="4" ry="2" fill="#8B6F47" opacity="0.4"/>
                <path d="M 205 355 Q 215 358 225 355" stroke="#8B6F47" strokeWidth="1.5" fill="none" opacity="0.35" strokeLinecap="round"/>
                {/* Warm light on face (rim) */}
                <ellipse cx="245" cy="310" rx="18" ry="28" fill="#FFF5E1" opacity="0.22"/>
              </g>

              {/* Younger figure — foreground, on right, shoulder + arm reaching */}
              <g>
                {/* Sweater shoulder/arm */}
                <path d="M 400 500 L 400 300 Q 360 295 340 330 Q 320 370 330 420 Q 340 465 360 500 Z" fill="url(#sweater)"/>
                {/* Sweater texture lines */}
                <path d="M 345 350 Q 360 355 380 352" stroke="#2D382D" strokeWidth="1" fill="none" opacity="0.5"/>
                <path d="M 340 380 Q 360 385 385 382" stroke="#2D382D" strokeWidth="1" fill="none" opacity="0.4"/>
                <path d="M 338 410 Q 360 415 388 412" stroke="#2D382D" strokeWidth="1" fill="none" opacity="0.4"/>

                {/* Reaching hand (hers — resting on older figure's shoulder) */}
                <g>
                  {/* forearm */}
                  <path d="M 345 340 Q 320 345 295 365 Q 280 378 275 388 L 300 395 Q 320 378 340 370 Q 348 355 345 340 Z" fill="url(#skin1)"/>
                  {/* wrist sleeve cuff */}
                  <path d="M 340 345 Q 350 340 348 355 Q 340 355 335 352 Z" fill="#2D382D"/>
                  {/* Hand */}
                  <path d="M 275 385 Q 260 390 255 400 Q 253 410 262 415 Q 270 418 282 412 Q 295 408 302 398 L 300 390 Z" fill="url(#skin1)"/>
                  {/* Fingers — subtle */}
                  <path d="M 263 400 Q 260 408 265 413" stroke="#C9A882" strokeWidth="1.5" fill="none" opacity="0.6"/>
                  <path d="M 273 398 Q 271 407 276 413" stroke="#C9A882" strokeWidth="1.5" fill="none" opacity="0.5"/>
                  <path d="M 283 395 Q 282 404 287 410" stroke="#C9A882" strokeWidth="1.5" fill="none" opacity="0.5"/>
                  {/* Highlight on back of hand */}
                  <ellipse cx="285" cy="398" rx="10" ry="4" fill="#FFF5E1" opacity="0.3" transform="rotate(-15 285 398)"/>
                </g>
              </g>

              {/* Light rays / dust motes for atmosphere */}
              <circle cx="280" cy="80" r="1.5" fill="#FFF5E1" opacity="0.9"/>
              <circle cx="310" cy="140" r="1" fill="#FFF5E1" opacity="0.7"/>
              <circle cx="180" cy="180" r="1.2" fill="#FFF5E1" opacity="0.6"/>
              <circle cx="340" cy="220" r="1" fill="#FFF5E1" opacity="0.5"/>
              <circle cx="120" cy="240" r="1.3" fill="#FFF5E1" opacity="0.5"/>

              {/* Soft warm vignette */}
              <radialGradient id="vignette" cx="50%" cy="50%" r="75%">
                <stop offset="60%" stopColor="black" stopOpacity="0"/>
                <stop offset="100%" stopColor="#8B6F47" stopOpacity="0.25"/>
              </radialGradient>
              <rect width="400" height="500" fill="url(#vignette)"/>
            </svg>
          </div>

          {/* Floating quote card */}
          <div style={{
            position: 'absolute', bottom: -24, left: -24,
            background: 'white',
            border: '1px solid var(--color-sand)',
            borderRadius: 20,
            padding: '18px 22px',
            maxWidth: 280,
            boxShadow: '0 20px 40px -10px rgba(26,60,52,0.18)',
            transform: 'rotate(2deg)'
          }}>
            <Ico.quote size={20} color="var(--color-clay)" />
            <p style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 15, fontStyle: 'italic', color: 'var(--color-forest)',
              lineHeight: 1.5, marginTop: 8
            }}>
              Finally, something that took what I'd been noticing seriously.
            </p>
            <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginTop: 8, fontWeight: 500 }}>
              — Elena R., daughter
            </p>
          </div>

          {/* Trust badge */}
          <div style={{
            position: 'absolute', top: 20, right: -12,
            background: 'var(--color-forest)',
            color: 'white',
            borderRadius: 16,
            padding: '14px 18px',
            boxShadow: '0 12px 30px -8px rgba(26,60,52,0.3)',
            transform: 'rotate(3deg)'
          }}>
            <div style={{
              fontSize: 9, fontWeight: 700, opacity: 0.7,
              letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4
            }}>Completed by</div>
            <div style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 28, fontWeight: 400, lineHeight: 1
            }}>12,400+</div>
            <div style={{ fontSize: 10, opacity: 0.8, marginTop: 4 }}>caregivers</div>
          </div>
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// HOW IT WORKS
// ═══════════════════════════════════════════════════════════════════════════

function HowItWorks() {
  const steps = [
    {
      n: '01',
      title: 'Tell us what you\'ve noticed',
      desc: 'Eight minutes of gentle questions about memory, language, attention, and behavior — drawn directly from validated clinical screening tools.',
      detail: '25 questions · No medical jargon'
    },
    {
      n: '02',
      title: 'Receive a structured report',
      desc: 'Your observations are mapped to cognitive domains and a stage indicator. Written for humans — not a clinician\'s summary thrown at you.',
      detail: 'Instant · Shareable with family'
    },
    {
      n: '03',
      title: 'Talk to a specialist if you want',
      desc: 'Review the report with a board-certified cognitive specialist in a 45-minute conversation. No obligation. No rushed exam.',
      detail: 'Optional · Covered by most insurance'
    }
  ];

  return (
    <Section id="how-it-works" bg="var(--color-cream)">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'start' }}>
        <div style={{ maxWidth: 420 }}>
          <SectionLabel>How CogCare works</SectionLabel>
          <DisplayH2 style={{ marginBottom: 20 }}>
            Three quiet steps,<br/>from noticing to knowing.
          </DisplayH2>
          <BodyLead>
            The hardest part is often the first one — trusting your instinct enough to do anything with it. We designed the Index to make that step small, calm, and private.
          </BodyLead>
        </div>

        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: 16 }} className="steps-grid">
          {steps.map((s, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr auto',
              gap: 24,
              alignItems: 'start',
              padding: '28px 32px',
              background: 'white',
              border: '1px solid var(--color-sand)',
              borderRadius: 24,
              boxShadow: '0 2px 10px rgba(26,60,52,0.04)',
              transition: 'transform 0.25s, box-shadow 0.25s'
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,60,52,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 10px rgba(26,60,52,0.04)'; }}
            >
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 36, fontStyle: 'italic',
                color: 'var(--color-clay)',
                lineHeight: 1, opacity: 0.6
              }}>{s.n}</div>
              <div>
                <h3 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 22, fontWeight: 500,
                  color: 'var(--color-forest)',
                  marginBottom: 8, letterSpacing: '-0.01em'
                }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.65, marginBottom: 10 }}>{s.desc}</p>
                <span style={{
                  fontSize: 11, color: 'var(--color-clay)', fontWeight: 600,
                  letterSpacing: '0.08em'
                }}>{s.detail}</span>
              </div>
              <div style={{ alignSelf: 'center', color: 'var(--color-forest)', opacity: 0.3 }}>
                <Ico.arrowRight size={18} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// BRAIN HEALTH INDEX — what it measures
// ═══════════════════════════════════════════════════════════════════════════

function TheIndex({ onCTA }) {
  const domains = [
    { key: 'memory', emoji: '🧩', title: 'Memory', desc: 'Short-term recall, repetition patterns, event memory, reminder dependence.' },
    { key: 'language', emoji: '💬', title: 'Language', desc: 'Word retrieval, sentence completion, conversational fluency, naming objects.' },
    { key: 'attention', emoji: '🔍', title: 'Attention', desc: 'Focus on tasks, orientation in familiar places, following multi-step instructions.' },
    { key: 'behavior', emoji: '🌿', title: 'Behavior & mood', desc: 'Personality shifts, withdrawal, anxiety, apathy, sleep rhythm changes.' },
  ];

  return (
    <Section id="the-index">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 64, alignItems: 'center' }}>
        {/* Left: copy */}
        <div>
          <SectionLabel>The Brain Health Index</SectionLabel>
          <DisplayH2 style={{ marginBottom: 24 }}>
            Four domains.<br/>
            One clear picture.
          </DisplayH2>
          <BodyLead style={{ marginBottom: 28 }}>
            The Index evaluates four evidence-backed cognitive domains drawn from the CDR, MoCA, and MMSE clinical scales — adapted into questions that <em>caregivers</em> can answer about observed behavior.
          </BodyLead>

          <div style={{
            padding: '20px 22px',
            background: 'rgba(166,123,91,0.06)',
            border: '1px solid rgba(166,123,91,0.2)',
            borderRadius: 16,
            marginBottom: 24
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Ico.sparkle size={16} color="var(--color-clay)" />
              <span style={{
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.15em', color: 'var(--color-clay)'
              }}>What you get</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--color-text-primary)', lineHeight: 1.65 }}>
              A stage indicator (Normal → Advanced), per-domain concern levels, and a 3-step care pathway — all written in the language you actually speak.
            </p>
          </div>

          <BtnPrimary onClick={onCTA}>
            Start the Index <Ico.arrowRight size={13} color="white" />
          </BtnPrimary>
        </div>

        {/* Right: domain cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {domains.map((d, i) => (
            <div key={d.key} style={{
              padding: '24px 22px',
              background: 'white',
              border: '1px solid var(--color-sand)',
              borderRadius: 20,
              transition: 'all 0.25s',
              transform: i % 2 === 0 ? 'translateY(16px)' : 'none'
            }}>
              <div style={{ fontSize: 28, marginBottom: 14, lineHeight: 1 }}>{d.emoji}</div>
              <h4 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 20, fontWeight: 500, color: 'var(--color-forest)',
                marginBottom: 8, letterSpacing: '-0.01em'
              }}>{d.title}</h4>
              <p style={{
                fontSize: 12.5, color: 'var(--color-text-secondary)',
                lineHeight: 1.6
              }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// WHY EARLY DETECTION — stat-driven
// ═══════════════════════════════════════════════════════════════════════════

function WhyEarly() {
  const stats = [
    { big: '1–2', unit: 'years', label: 'Caregivers notice signs before a formal diagnosis is made.', source: 'Alzheimer\'s Association, 2024' },
    { big: '40%', unit: '', label: 'Of dementia cases are potentially preventable with early intervention on modifiable risks.', source: 'The Lancet Commission, 2024' },
    { big: '3×', unit: '', label: 'More treatment options are available at the Mild stage than at Moderate or Advanced.', source: 'Neurology, 2023' },
  ];

  return (
    <Section bg="var(--color-forest)" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Decorative */}
      <Blob color="#FDFBF7" opacity={0.04} style={{ top: '-10%', right: '-5%', width: 400, height: 400 }} />
      <Blob color="var(--color-clay)" opacity={0.12} style={{ bottom: '-20%', left: '-10%', width: 500, height: 500 }} />

      <div style={{ position: 'relative', maxWidth: 920, margin: '0 auto', textAlign: 'center' }}>
        <SectionLabel style={{ color: 'rgba(255,255,255,0.5)' }}>Why early detection changes everything</SectionLabel>
        <h2 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
          fontWeight: 400,
          fontStyle: 'italic',
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          color: 'white',
          marginBottom: 20,
          textWrap: 'balance'
        }}>
          The earlier you look,<br/>the more you can do.
        </h2>
        <p style={{
          fontSize: 17, color: 'rgba(255,255,255,0.7)',
          lineHeight: 1.7, maxWidth: 640, margin: '0 auto 64px',
          textWrap: 'pretty'
        }}>
          Most dementia research is done on people well past the point where intervention would have mattered most. Early detection flips that — and families hold the earliest clue.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20,
        position: 'relative'
      }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 24,
            padding: '32px 28px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 16 }}>
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(3.2rem, 7vw, 5rem)',
                fontWeight: 400,
                color: 'white',
                lineHeight: 0.9,
                letterSpacing: '-0.03em'
              }}>{s.big}</span>
              {s.unit && (
                <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>{s.unit}</span>
              )}
            </div>
            <p style={{
              fontSize: 14, color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.6, marginBottom: 16
            }}>{s.label}</p>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', marginBottom: 12 }} />
            <p style={{
              fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase', letterSpacing: '0.15em'
            }}>{s.source}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SPECIALISTS
// ═══════════════════════════════════════════════════════════════════════════

function Specialists() {
  const docs = [
    { name: 'Dr. Priya Sharma, MD', role: 'Cognitive Neurology', inst: 'Formerly UCLA Medical Center', seed: 0 },
    { name: 'Dr. Marcus Webb, MD', role: 'Geriatric Psychiatry', inst: 'Mayo Clinic affiliate', seed: 1 },
    { name: 'Dr. Elena Ruiz, MD, PhD', role: 'Preventive Neurology', inst: 'Penn Medicine', seed: 2 },
    { name: 'Dr. James Chen, MD', role: 'Behavioral Neurology', inst: 'Johns Hopkins affiliate', seed: 3 },
  ];

  return (
    <Section id="specialists">
      <div style={{ maxWidth: 720, marginBottom: 56 }}>
        <SectionLabel>Specialists you'd never get a 45-minute appointment with</SectionLabel>
        <DisplayH2 style={{ marginBottom: 20 }}>
          The people reviewing your report<br />
          <em>have actually been in the room.</em>
        </DisplayH2>
        <BodyLead>
          Every CogCare consultation is led by a board-certified specialist in cognitive or geriatric care — the same clinicians who sit on academic appointments at institutions like UCLA, Mayo, Penn, and Hopkins.
        </BodyLead>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 20
      }}>
        {docs.map((d) => (
          <div key={d.name} style={{
            background: 'white',
            border: '1px solid var(--color-sand)',
            borderRadius: 24,
            overflow: 'hidden',
            transition: 'transform 0.25s, box-shadow 0.25s'
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(26,60,52,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
          >
            <div style={{ aspectRatio: '4/4.5' }}>
              <PortraitPlaceholder seed={d.seed} />
            </div>
            <div style={{ padding: '20px 22px' }}>
              <h4 style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 17, fontWeight: 500,
                color: 'var(--color-forest)',
                marginBottom: 6, letterSpacing: '-0.01em',
                lineHeight: 1.25
              }}>{d.name}</h4>
              <p style={{ fontSize: 12, color: 'var(--color-clay)', fontWeight: 600, marginBottom: 4 }}>{d.role}</p>
              <p style={{ fontSize: 11.5, color: 'var(--color-text-tertiary)' }}>{d.inst}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Partner logos strip */}
      <div style={{
        marginTop: 72,
        padding: '36px 0',
        borderTop: '1px solid var(--color-sand)',
        borderBottom: '1px solid var(--color-sand)'
      }}>
        <div style={{
          fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.22em', color: 'var(--color-text-tertiary)',
          textAlign: 'center', marginBottom: 24
        }}>
          Clinical partners & institutional affiliations
        </div>
        <div style={{
          display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {['UCLA HEALTH', 'MAYO CLINIC', 'PENN MEDICINE', 'JOHNS HOPKINS', 'STANFORD'].map(p => (
            <div key={p} style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 17, fontWeight: 500,
              color: 'var(--color-forest)',
              opacity: 0.35,
              letterSpacing: '0.08em'
            }}>{p}</div>
          ))}
        </div>
      </div>
    </Section>
  );
}

Object.assign(window, { Nav, Hero, HowItWorks, TheIndex, WhyEarly, Specialists });
