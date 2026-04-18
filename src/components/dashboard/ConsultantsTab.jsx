import PanelHeader from '../bhi/PanelHeader'
import { FALLBACK_CONSULTANTS } from './consultantsFallback'

export default function ConsultantsTab({ rows }) {
  const usingFallback = !rows?.length
  const list = usingFallback ? FALLBACK_CONSULTANTS : rows

  return (
    <div className="space-y-6">
      <PanelHeader
        sectionLabel="Support"
        title="Consultations"
        subtitle="Connect with specialists. v1 uses seeded or static data until your team curates the directory."
      />
      {usingFallback ? (
        <div
          className="rounded-xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm text-amber-950/90"
          role="status"
        >
          Directory not configured — showing sample profiles for layout preview only.
        </div>
      ) : null}
      <div className="grid gap-6 sm:grid-cols-2">
        {list.map((c, i) => (
          <div
            key={c.id ?? c.name + i}
            className="overflow-hidden rounded-2xl border border-[#E8DCC4] bg-white shadow-sm"
          >
            {c.photoUrl ? (
              <img src={c.photoUrl} alt="" className="aspect-[4/3] w-full object-cover" />
            ) : null}
            <div className="p-5">
              <p className="font-serif text-lg text-[#3D4B3E]">{c.name}</p>
              {c.title ? (
                <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#A67B5B]">{c.title}</p>
              ) : null}
              {c.bio ? <p className="mt-3 text-sm leading-relaxed text-[#3D4B3E]/85">{c.bio}</p> : null}
              <a
                href={c.bookingUrl || `mailto:${c.contactEmail || ''}`}
                className="mt-4 inline-flex min-h-[44px] items-center rounded-full bg-[#3D4B3E] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white sm:min-h-0"
              >
                Request consultation
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
