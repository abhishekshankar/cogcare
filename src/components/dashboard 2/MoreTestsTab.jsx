import { LayoutGrid, FlaskConical, Sparkles } from 'lucide-react'
import PanelHeader from '../bhi/PanelHeader'
import CardButton from '../bhi/CardButton'

export default function MoreTestsTab() {
  const cards = [
    { title: 'Cognitive reserve', hint: 'Coming soon', icon: Sparkles },
    { title: 'Sleep & mood check-in', hint: 'Coming soon', icon: LayoutGrid },
    { title: 'Motor & gait screen', hint: 'Coming soon', icon: FlaskConical },
  ]
  return (
    <div className="space-y-6">
      <PanelHeader
        sectionLabel="Explore"
        title="More tests"
        subtitle="Placeholders for future assessments — same card rhythm as the home page pillars."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <CardButton key={c.title} icon={c.icon} title={c.title} hint={c.hint} />
        ))}
      </div>
    </div>
  )
}
