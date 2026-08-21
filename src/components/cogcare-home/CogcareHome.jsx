import './cogcare-home.css'
import {
  Nav,
  Hero,
  HowItWorks,
  TheIndex,
  WhyEarly,
  Specialists,
} from './sections-part1.jsx'
import {
  Testimonials,
  Science,
  Mission,
  FAQ,
  Newsletter,
  CogtrainingModule,
  Footer,
} from './sections-part2.jsx'

function scrollToHowItWorks() {
  document
    .getElementById('how-it-works')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollToTheIndex() {
  document
    .querySelector('#the-index')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/**
 * Design-system marketing homepage (docs/CogCare Design System (1)/homepage), ported as ES modules.
 * @param {{ onTakeAssessment?: () => void, authIdentity?: 'signedIn' | 'loading' | 'signedOut' }} props
 */
export default function CogcareHome({ onTakeAssessment, authIdentity }) {
  const onPrimaryCta = onTakeAssessment ?? scrollToTheIndex

  return (
    <div className="cogcare-ds-home">
      <Nav onPrimaryCta={onPrimaryCta} authIdentity={authIdentity} />
      <Hero
        tone="warm"
        audience="caregiver"
        onPrimaryCta={onPrimaryCta}
        onLearnHow={scrollToHowItWorks}
      />
      <HowItWorks />
      <TheIndex onPrimaryCta={onPrimaryCta} />
      <WhyEarly />
      <Specialists />
      <Testimonials />
      <Science />
      <Mission />
      <FAQ />
      <Newsletter />
      <CogtrainingModule />
      <Footer />
    </div>
  )
}
