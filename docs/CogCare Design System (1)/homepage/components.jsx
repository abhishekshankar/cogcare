// CogCare.org Homepage — Shared Components

// ═══════════════════════════════════════════════════════════════════════════
// ICONS (Lucide-style, inline SVG)
// ═══════════════════════════════════════════════════════════════════════════

const Ico = {
  brain: (p = {}) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth={p.sw||1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5a3 3 0 1 0-5.997-.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
      <path d="M12 5a3 3 0 1 1 5.997-.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/>
    </svg>
  ),
  arrowRight: (p = {}) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  check: (p = {}) => (
    <svg width={p.size||14} height={p.size||14} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  plus: (p = {}) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  minus: (p = {}) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  clock: (p = {}) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  shield: (p = {}) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  sparkle: (p = {}) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    </svg>
  ),
  quote: (p = {}) => (
    <svg width={p.size||28} height={p.size||28} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"/>
    </svg>
  ),
  star: (p = {}) => (
    <svg width={p.size||12} height={p.size||12} viewBox="0 0 24 24" fill={p.color||'currentColor'} stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  mail: (p = {}) => (
    <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  ),
  flask: (p = {}) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2v7.5L4 20a1.5 1.5 0 0 0 1.3 2.5h13.4A1.5 1.5 0 0 0 20 20L14 9.5V2"/>
      <line x1="8" y1="2" x2="16" y2="2"/>
      <line x1="7" y1="16" x2="17" y2="16"/>
    </svg>
  ),
  heart: (p = {}) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
    </svg>
  ),
  users: (p = {}) => (
    <svg width={p.size||18} height={p.size||18} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="8.5" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  menu: (p = {}) => (
    <svg width={p.size||20} height={p.size||20} viewBox="0 0 24 24" fill="none" stroke={p.color||'currentColor'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
};

// ═══════════════════════════════════════════════════════════════════════════
// PLACEHOLDER IMAGERY — abstract, organic shapes for warmth
// Uses simple SVG compositions that feel human without stock-photo risk
// ═══════════════════════════════════════════════════════════════════════════

function PortraitPlaceholder({ seed = 1, label, style = {} }) {
  // Abstract warm portrait — organic blob, implied figure
  const palettes = [
    { bg: '#F3EFE9', fig: '#C9A882', accent: '#A67B5B' },
    { bg: '#EDE4D3', fig: '#B89874', accent: '#3D4B3E' },
    { bg: '#E8DCC4', fig: '#A67B5B', accent: '#3D4B3E' },
    { bg: '#F5EFE6', fig: '#D4B594', accent: '#8B6F47' },
  ];
  const p = palettes[seed % palettes.length];
  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%', minHeight: 240,
      borderRadius: 24, overflow: 'hidden',
      background: `linear-gradient(135deg, ${p.bg} 0%, ${p.bg} 100%)`,
      ...style
    }}>
      <svg viewBox="0 0 300 380" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
        <defs>
          <radialGradient id={`grad-${seed}`} cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="white" stopOpacity="0"/>
          </radialGradient>
        </defs>
        {/* Soft background wash */}
        <rect width="300" height="380" fill={`url(#grad-${seed})`}/>
        {/* Shoulders */}
        <ellipse cx="150" cy="400" rx="140" ry="100" fill={p.fig} opacity="0.85"/>
        {/* Head */}
        <circle cx="150" cy="180" r="68" fill={p.fig}/>
        {/* Hair shadow */}
        <path d={`M 90 160 Q 150 100 210 160 Q 205 130 150 115 Q 95 130 90 160 Z`} fill={p.accent} opacity="0.3"/>
        {/* Light glint */}
        <ellipse cx="175" cy="165" rx="15" ry="25" fill="white" opacity="0.15"/>
      </svg>
      {label && (
        <div style={{
          position: 'absolute', bottom: 10, left: 12,
          fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
          color: 'rgba(0,0,0,0.35)', background: 'rgba(255,255,255,0.5)',
          padding: '2px 8px', borderRadius: 4, backdropFilter: 'blur(4px)'
        }}>{label}</div>
      )}
    </div>
  );
}

// Organic blob decoration
function Blob({ color = '#A67B5B', opacity = 0.08, style = {} }) {
  return (
    <svg viewBox="0 0 200 200" style={{ position: 'absolute', ...style }}>
      <path fill={color} opacity={opacity} d="M45.4,-58.1C58.5,-49.2,68.4,-34.6,71.6,-18.6C74.8,-2.6,71.3,14.9,62.7,28.6C54.1,42.3,40.4,52.3,24.9,59.1C9.4,66,-7.9,69.7,-22.8,65.1C-37.7,60.5,-50.2,47.6,-58.6,32.5C-67,17.5,-71.4,0.3,-68.7,-15.6C-66,-31.5,-56.3,-46.2,-43.1,-55.3C-29.9,-64.4,-14.9,-67.8,1.3,-69.4C17.5,-71,35,-67,45.4,-58.1Z" transform="translate(100 100)" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT PRIMITIVES
// ═══════════════════════════════════════════════════════════════════════════

function Section({ children, style = {}, bg, id }) {
  return (
    <section id={id} style={{
      padding: 'clamp(60px, 9vw, 120px) 0',
      background: bg || 'transparent',
      position: 'relative',
      ...style
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        {children}
      </div>
    </section>
  );
}

function SectionLabel({ children, style = {}, color = 'var(--color-clay)' }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.22em', color,
      marginBottom: 14, ...style
    }}>{children}</div>
  );
}

function DisplayH2({ children, style = {}, italic = true }) {
  return (
    <h2 style={{
      fontFamily: "'Playfair Display', Georgia, serif",
      fontSize: 'clamp(2rem, 4.2vw, 3.2rem)',
      fontWeight: 400,
      fontStyle: italic ? 'italic' : 'normal',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      color: 'var(--color-forest)',
      textWrap: 'balance',
      ...style
    }}>{children}</h2>
  );
}

function BodyLead({ children, style = {} }) {
  return (
    <p style={{
      fontSize: 'clamp(15px, 1.3vw, 18px)',
      lineHeight: 1.7,
      color: 'var(--color-text-secondary)',
      maxWidth: 640,
      textWrap: 'pretty',
      ...style
    }}>{children}</p>
  );
}

function BtnPrimary({ children, onClick, style = {}, large = false }) {
  return (
    <button onClick={onClick} className="btn-primary" style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      padding: large ? '18px 32px' : '14px 26px',
      background: 'var(--color-forest)',
      color: 'white', border: 'none', borderRadius: 9999,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: large ? 13 : 11,
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      ...style
    }}>{children}</button>
  );
}

function BtnGhost({ children, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      padding: '12px 22px',
      background: 'transparent',
      color: 'var(--color-forest)',
      border: '1px solid var(--color-sand)',
      borderRadius: 9999,
      fontFamily: "'DM Sans', sans-serif",
      fontSize: 11, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.12em',
      cursor: 'pointer',
      transition: 'all 0.2s',
      ...style
    }}>{children}</button>
  );
}

// Export to window
Object.assign(window, {
  Ico, PortraitPlaceholder, Blob,
  Section, SectionLabel, DisplayH2, BodyLead,
  BtnPrimary, BtnGhost,
});
