// CogCare — Shared UI Components
// Used by: ui_kits/app/index.html

// ── Icons (inline SVG, matching Lucide style) ────────────────────────────────
function IconBrain({ size = 20, color = '#A67B5B', strokeWidth = 1.5 }) {
  return React.createElement('svg', {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round',
  },
    React.createElement('path', { d: 'M12 5a3 3 0 1 0-5.997-.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z' }),
    React.createElement('path', { d: 'M12 5a3 3 0 1 1 5.997-.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z' }),
    React.createElement('path', { d: 'M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4' }),
    React.createElement('path', { d: 'M17.599 6.5a3 3 0 0 0 .399-1.375' }),
    React.createElement('path', { d: 'M6.003 5.125A3 3 0 0 0 6.401 6.5' })
  );
}

function IconArrowRight({ size = 16, color = 'currentColor' }) {
  return React.createElement('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('line', { x1: 5, y1: 12, x2: 19, y2: 12 }),
    React.createElement('polyline', { points: '12 5 19 12 12 19' })
  );
}

function IconChevronRight({ size = 16, color = 'currentColor' }) {
  return React.createElement('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('polyline', { points: '9 18 15 12 9 6' })
  );
}

function IconLogOut({ size = 16, color = 'currentColor' }) {
  return React.createElement('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }),
    React.createElement('polyline', { points: '16 17 21 12 16 7' }),
    React.createElement('line', { x1: 21, y1: 12, x2: 9, y2: 12 })
  );
}

function IconSettings({ size = 14, color = 'currentColor' }) {
  return React.createElement('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('circle', { cx: 12, cy: 12, r: 3 }),
    React.createElement('path', { d: 'M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z' })
  );
}

function IconDownload({ size = 16, color = 'currentColor' }) {
  return React.createElement('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
    React.createElement('polyline', { points: '7 10 12 15 17 10' }),
    React.createElement('line', { x1: 12, y1: 15, x2: 12, y2: 3 })
  );
}

function IconTrash({ size = 16, color = 'currentColor' }) {
  return React.createElement('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('polyline', { points: '3 6 5 6 21 6' }),
    React.createElement('path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2' })
  );
}

function IconSparkles({ size = 12, color = '#A67B5B' }) {
  return React.createElement('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' },
    React.createElement('path', { d: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z' })
  );
}

// ── Primitive Components ─────────────────────────────────────────────────────

function SectionLabel({ children, style = {} }) {
  return React.createElement('div', {
    style: {
      fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.2em', color: 'rgba(61,75,62,0.5)',
      fontFamily: "'DM Sans', sans-serif", ...style
    }
  }, children);
}

function PanelHeader({ sectionLabel, title, subtitle }) {
  return React.createElement('div', { style: { marginBottom: 8 } },
    React.createElement(SectionLabel, { style: { marginBottom: 6 } }, sectionLabel),
    React.createElement('div', {
      style: {
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: '1.6rem', fontStyle: 'italic', fontWeight: 400,
        color: '#3D4B3E', lineHeight: 1.2, marginBottom: subtitle ? 8 : 0
      }
    }, title),
    subtitle && React.createElement('p', {
      style: { fontSize: 13, color: '#64748B', lineHeight: 1.6, margin: 0, fontFamily: "'DM Sans', sans-serif" }
    }, subtitle)
  );
}

function Card({ children, style = {}, dashed = false }) {
  return React.createElement('div', {
    style: {
      background: 'white',
      border: `1px ${dashed ? 'dashed' : 'solid'} #E8DCC4`,
      borderRadius: 20, padding: 24,
      boxShadow: '0 4px 6px -1px rgba(26,60,52,0.05), 0 2px 4px -1px rgba(26,60,52,0.03)',
      ...style
    }
  }, children);
}

function GlassCard({ children, style = {} }) {
  return React.createElement('div', {
    style: {
      background: 'rgba(255,255,255,0.75)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.4)',
      borderRadius: 24,
      boxShadow: '0 10px 30px -5px rgba(26,60,52,0.10)',
      ...style
    }
  }, children);
}

function BtnPrimary({ children, onClick, disabled, style = {} }) {
  return React.createElement('button', {
    onClick, disabled,
    style: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      gap: 8, padding: '12px 24px',
      background: disabled ? '#9BB09C' : '#3D4B3E', color: 'white',
      borderRadius: 9999, border: 'none', cursor: disabled ? 'default' : 'pointer',
      fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.14em',
      transition: 'all 0.25s ease', ...style
    }
  }, children);
}

function BtnGhost({ children, onClick, style = {} }) {
  return React.createElement('button', {
    onClick,
    style: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      gap: 6, padding: '8px 16px',
      background: 'transparent', color: '#3D4B3E',
      borderRadius: 9999, border: '1px solid #E8DCC4', cursor: 'pointer',
      fontFamily: "'DM Sans', sans-serif", fontSize: 10, fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.12em',
      transition: 'background 0.2s ease', ...style
    }
  }, children);
}

function ScoreBar({ score, min = 300, max = 850 }) {
  const pct = Math.min(100, Math.max(0, ((score - min) / (max - min)) * 100));
  return React.createElement('div', null,
    React.createElement('div', {
      style: { height: 10, borderRadius: 9999, background: '#F3EFE9', overflow: 'hidden' }
    },
      React.createElement('div', {
        style: {
          width: `${pct}%`, height: '100%', borderRadius: 9999,
          background: '#3D4B3E', opacity: 0.85,
          transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)'
        }
      })
    ),
    React.createElement('div', {
      style: {
        display: 'flex', justifyContent: 'space-between', marginTop: 5,
        fontSize: 10, color: 'rgba(61,75,62,0.5)', fontWeight: 500,
        fontFamily: 'monospace'
      }
    },
      React.createElement('span', null, min),
      React.createElement('span', null, max)
    )
  );
}

// Export to window for use in other scripts
Object.assign(window, {
  IconBrain, IconArrowRight, IconChevronRight, IconLogOut,
  IconSettings, IconDownload, IconTrash, IconSparkles,
  SectionLabel, PanelHeader, Card, GlassCard,
  BtnPrimary, BtnGhost, ScoreBar
});
