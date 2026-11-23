/** Bordered card shell for “More tests” style tiles. */
export default function CardButton({ icon: Icon, title, hint, className = '' }) {
  return (
    <div
      className={`rounded-2xl border border-[#E8DCC4] bg-white p-6 shadow-sm ${className}`.trim()}
    >
      {Icon ? <Icon className="mb-3 h-6 w-6 text-[#A67B5B]" strokeWidth={1.5} aria-hidden /> : null}
      <p className="font-serif text-lg text-[#3D4B3E]">{title}</p>
      {hint ? (
        <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[#3D4B3E]/45">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
