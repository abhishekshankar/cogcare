/** Uppercase tracking label (quiz / BHI dashboard). */
export default function SectionLabel({ children, className = '' }) {
  return (
    <p
      className={`text-[10px] font-bold uppercase tracking-[0.25em] text-[#A67B5B] ${className}`.trim()}
    >
      {children}
    </p>
  )
}
