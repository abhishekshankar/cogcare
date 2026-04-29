import SectionLabel from './SectionLabel'

export default function PanelHeader({ sectionLabel, title, subtitle }) {
  return (
    <div className="space-y-2">
      {sectionLabel ? <SectionLabel>{sectionLabel}</SectionLabel> : null}
      <h2 className="font-serif text-2xl italic text-forest">{title}</h2>
      {subtitle ? <p className="max-w-xl text-sm leading-relaxed text-forest/80">{subtitle}</p> : null}
    </div>
  )
}
