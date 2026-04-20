/** Bordered card shell for “More tests” style tiles. */
export default function CardButton({ icon: Icon, title, hint, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-border bg-white p-6 shadow-sm ${className}`.trim()}
    >
      {Icon ? <Icon className="mb-3 h-6 w-6 text-clay" strokeWidth={1.5} aria-hidden /> : null}
      <p className="font-serif text-lg text-forest">{title}</p>
      {hint ? (
        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.15em] text-forest/45">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
