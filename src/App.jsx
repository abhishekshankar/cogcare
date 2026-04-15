import { useState, useEffect, useRef } from 'react'
import {
  X,
  ArrowRight,
  Brain,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

export default function App() {
  const [selectedCard, setSelectedCard] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const closeBtnRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!selectedCard) return
    const onKey = (e) => {
      if (e.key === 'Escape') setSelectedCard(null)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeBtnRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [selectedCard])

  const cards = [
    {
      id: 1,
      title: 'Across Every Community',
      category: 'Equity',
      image:
        'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800',
      content: `Dementia does not see borders, but it does affect communities differently. Research shows that older Black Americans are about twice as likely to have Alzheimer's or other dementias as older whites. Hispanic and Latino Americans are about one and a half times as likely. These differences aren't just about biology; they are often tied to things like access to healthcare, quality of education, and heart health.

When we say "Dementia Does Not Differentiate," we mean that everyone deserves the same chance at a healthy brain. By focusing on health equity, we can make sure that life-saving information and care reach every neighborhood. Whether it is through community workshops or culturally relevant health tips, our goal is to empower every person—regardless of their race, gender, or income—to take charge of their cognitive future. Hope belongs to everyone.`,
    },
    {
      id: 2,
      title: 'Modifiable Risk, Shared Hope',
      category: 'Prevention',
      image:
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
      content: `Did you know that nearly 40% of dementia cases worldwide might be prevented or delayed? This is one of the most hopeful discoveries in modern medicine. Science tells us that dementia is modifiable. This means our daily habits can actually lower our risk or slow down cognitive decline. 

To keep your brain strong, focus on these key areas: Keep your blood pressure in check, stay physically active every day, and protect your hearing with earplugs or hearing aids if needed. It is also vital to stay socially connected with friends and family, eat nutritious foods, and avoid smoking. Even small changes, like taking a daily walk or learning a new hobby, can build "cognitive reserve." Your brain is resilient, and it is never too late—or too early—to start protecting it.`,
    },
    {
      id: 3,
      title: 'Respectful Language Matters',
      category: 'Advocacy',
      image:
        'https://images.unsplash.com/photo-1516307362420-9dd191f6d247?auto=format&fit=crop&q=80&w=800',
      content: `The words we use to talk about dementia have a powerful impact. For a long time, people used words like "demented" or "victim," which can make someone feel powerless or ashamed. Today, we choose "person-first" language. We say "a person living with dementia" because a diagnosis is only one part of who they are. They are still a parent, a friend, an artist, and a human being with a story.

Using respectful language helps break down the stigma that keeps people from seeking help. Instead of saying someone is "suffering from" the condition, we talk about their journey and their needs. We avoid terms that suggest someone is disappearing. By speaking with dignity, we create a community where people living with dementia feel seen, heard, and valued.`,
    },
    {
      id: 4,
      title: 'Support for Caregivers',
      category: 'Care',
      image:
        'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800',
      content: `If you are caring for someone living with dementia, you are doing one of the most important jobs in the world. But you don't have to do it alone. Caregiving can be rewarding, but it can also be physically and emotionally tiring. Providing "Shared Hope" means supporting the supporters. 

We offer a library of education designed for your specific needs. This includes tips on how to communicate when words become difficult, how to manage daily safety at home, and how to find local support groups. Remember that "self-care" isn't selfish—it is necessary. When you take a moment to rest or talk to a counselor, you are becoming a more resilient caregiver. From online training modules to 24/7 helplines, we are here to provide the tools you need.`,
    },
  ]

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1A1A1A] font-sans selection:bg-[#E8DCC4]">
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md py-4 shadow-sm'
            : 'bg-transparent py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-nowrap items-center justify-between gap-3 sm:gap-6">
          <a
            href={`${BASE}/`}
            className="flex shrink-0 items-center gap-2 sm:gap-2.5 cursor-pointer group whitespace-nowrap"
          >
            <Brain
              className="w-6 h-6 sm:w-7 sm:h-7 shrink-0 text-[#A67B5B] group-hover:scale-110 transition-transform duration-300"
              strokeWidth={1.5}
              aria-hidden
            />
            <span className="font-serif text-2xl sm:text-3xl tracking-tighter text-[#3D4B3E] whitespace-nowrap">
              Cog<span className="italic">Care</span>
              <span className="text-[#A67B5B] text-sm sm:text-base font-sans font-medium tracking-normal ml-0.5 opacity-80">
                .org
              </span>
            </span>
          </a>

          <nav
            className="flex shrink-0 flex-nowrap items-center gap-4 sm:gap-6 md:gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#3D4B3E]"
            aria-label="Primary"
          >
            <a
              href="https://cogcare.org/"
              className="inline-flex items-center justify-center hover:opacity-60 transition-opacity whitespace-nowrap py-2"
              rel="noopener noreferrer"
            >
              Education
            </a>
            <a
              href="https://cogcare.org/"
              className="bg-[#3D4B3E] hover:bg-[#2D382D] text-white px-5 sm:px-8 md:px-10 py-2.5 sm:py-3.5 rounded-full inline-flex items-center justify-center whitespace-nowrap transition-all"
              rel="noopener noreferrer"
            >
              Donate
            </a>
          </nav>
        </div>
      </header>

      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-12 gap-8 lg:gap-24 items-center">
          <div className="md:col-span-7 z-10 pt-12 lg:pt-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F3EFE9] rounded-full text-[9px] font-bold uppercase tracking-[0.25em] text-[#A67B5B] mb-8 w-fit">
              <Sparkles className="w-3 h-3 shrink-0" aria-hidden />
              Evidence-Based Cognitive Wellness
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-8xl font-serif leading-[1.05] mb-8 lg:mb-10 text-[#1A1A1A] tracking-tight">
              Dementia is <br />
              <span className="italic text-[#3D4B3E]">Modifiable.</span>
            </h1>

            <p className="text-lg md:text-xl lg:text-2xl text-slate-500 mb-10 max-w-xl font-light leading-relaxed">
              Scientific breakthroughs reveal that 40% of dementia risk is linked
              to factors we can change. Your protective journey begins with daily
              rituals.
            </p>

            <div className="max-w-sm lg:max-w-md w-full bg-white/40 backdrop-blur-md p-6 lg:p-8 rounded-[2.5rem] lg:rounded-[3rem] border border-[#F3EFE9] shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">
                Start your BRAIN check-in
              </p>
              <button
                type="button"
                className="w-full bg-[#3D4B3E] text-white px-8 py-4 rounded-full font-bold uppercase tracking-[0.15em] text-[10px] flex items-center justify-center gap-3 hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                Begin Assessment
                <ArrowRight className="w-4 h-4" aria-hidden />
              </button>
            </div>
          </div>

          <div className="md:col-span-5 relative flex justify-center mt-12 md:mt-0">
            <div className="relative w-full max-w-sm lg:max-w-lg aspect-[4/5] rounded-[3.5rem] lg:rounded-[4.5rem] overflow-hidden shadow-[0_40px_80px_-15px_rgba(61,75,62,0.12)] border-[12px] lg:border-[16px] border-white ring-1 ring-slate-100">
              <img
                src="https://cogcare.org/wp-content/uploads/2024/09/marcus-aurelius-6787978.jpg"
                alt="Portrait representing cognitive resilience and well-being"
                className="w-full h-full object-cover grayscale-[0.05]"
              />
              <div className="absolute inset-0 bg-[#3D4B3E]/5 mix-blend-multiply" />
            </div>

            <div className="absolute -bottom-8 -left-8 lg:-bottom-10 lg:-left-10 bg-white p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl max-w-[180px] lg:max-w-[220px] hidden md:block border border-[#F3EFE9] transform -rotate-3 hover:rotate-0 transition-all duration-700">
              <p className="text-[8px] lg:text-[9px] font-bold uppercase tracking-[0.25em] text-[#A67B5B] mb-2 lg:mb-3">
                Key Discovery
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl lg:text-5xl font-serif text-[#3D4B3E]">
                  40
                </span>
                <span className="text-lg lg:text-xl font-serif text-[#3D4B3E] italic">
                  %
                </span>
              </div>
              <p className="text-[9px] lg:text-[10px] leading-relaxed text-slate-400 font-medium mt-2 lg:mt-3 italic">
                of cases preventable through modification.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-white" aria-labelledby="pillars-heading">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-end mb-24">
            <div>
              <h2
                id="pillars-heading"
                className="text-5xl md:text-6xl font-serif text-[#1A1A1A] mb-8 leading-tight"
              >
                Dementia Does Not <br />
                <span className="italic text-[#3D4B3E]">Differentiate.</span>
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed max-w-lg font-light">
                High-end cognitive care should be a universal standard. We build
                the inclusive architecture for brain health across all
                communities.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <div className="h-px w-full lg:w-48 bg-slate-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedCard(card)}
                className="group relative h-[580px] rounded-[3.5rem] overflow-hidden cursor-pointer bg-slate-50 transition-all duration-700 hover:shadow-2xl text-left w-full border-0 p-0"
              >
                <img
                  src={card.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />

                <div className="absolute bottom-0 left-0 p-10 w-full text-white transform transition-transform duration-700">
                  <p className="text-[9px] font-bold uppercase tracking-[0.3em] mb-4 text-white/60">
                    {card.category}
                  </p>
                  <h3 className="text-2xl font-serif mb-8 leading-tight max-w-[200px]">
                    {card.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-2 group-hover:translate-y-0">
                    Explore
                    <ArrowUpRight className="w-4 h-4" aria-hidden />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedCard && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-end"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-[#3D4B3E]/20 backdrop-blur-md animate-modal-backdrop border-0 cursor-pointer p-0"
            onClick={() => setSelectedCard(null)}
            aria-label="Close panel"
          />
          <div
            className="relative bg-[#FDFBF7] w-full max-w-2xl h-full shadow-2xl overflow-y-auto animate-modal-panel flex flex-col"
            role="dialog"
            aria-modal="true"
            aria-labelledby="card-detail-title"
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setSelectedCard(null)}
              className="absolute top-10 right-10 p-4 bg-white hover:bg-[#F3EFE9] rounded-full transition-all z-10 border border-slate-100"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-800" aria-hidden />
            </button>

            <div className="pt-32 pb-24 px-10 md:px-20">
              <div className="inline-block px-4 py-1.5 bg-[#3D4B3E] text-white text-[9px] font-bold uppercase tracking-[0.25em] mb-12 rounded-full">
                {selectedCard.category}
              </div>
              <h2
                id="card-detail-title"
                className="text-5xl md:text-6xl font-serif text-[#1A1A1A] mb-16 leading-[1.1] italic"
              >
                {selectedCard.title}
              </h2>

              <div className="aspect-[16/10] rounded-[3.5rem] overflow-hidden mb-16 shadow-2xl border-[12px] border-white">
                <img
                  src={selectedCard.image}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>

              <div className="max-w-none">
                <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-light whitespace-pre-line mb-16 italic border-l-2 border-[#A67B5B] pl-10">
                  {selectedCard.content}
                </p>

                <div className="space-y-6">
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#3D4B3E] mb-8">
                    Next Steps
                  </p>
                  <button
                    type="button"
                    className="w-full p-8 bg-white border border-slate-100 rounded-[2rem] flex items-center justify-between hover:border-[#3D4B3E] transition-all group shadow-sm hover:shadow-xl text-left"
                  >
                    <span className="font-serif text-lg text-[#1A1A1A]">
                      CogCare {selectedCard.category} Resource
                    </span>
                    <div className="w-12 h-12 rounded-full bg-[#FDFBF7] flex items-center justify-center group-hover:bg-[#3D4B3E] group-hover:text-white transition-all shrink-0">
                      <ArrowRight className="w-5 h-5" aria-hidden />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="bg-[#F3EFE9] py-32 border-t border-[#E8DCC4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-16 mb-24">
            <div className="col-span-2">
              <span className="font-serif italic text-4xl tracking-tight text-[#3D4B3E] block mb-10">
                CogCare.org
              </span>
              <p className="text-slate-400 max-w-sm leading-relaxed font-light italic text-base mb-8">
                A modern boutique initiative for brain longevity. Designed to
                empower, grounded in clinical proof, and accessible to everyone.
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A67B5B]">
                Cognitive Care Alliance is a 501(c)(3) organization.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#3D4B3E] mb-10 opacity-40">
                Essentials
              </p>
              <ul className="space-y-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#3D4B3E]">
                <li>
                  <a
                    href="https://cogcare.org/"
                    className="hover:opacity-50 transition-opacity"
                    rel="noopener noreferrer"
                  >
                    Education Portal
                  </a>
                </li>
                <li>
                  <a
                    href="https://cogcare.org/"
                    className="hover:opacity-50 transition-opacity"
                    rel="noopener noreferrer"
                  >
                    Donation Hub
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-16 border-t border-[#E8DCC4] flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-slate-300 italic">
              © 2026 CogCare Initiative • Empowering Cognitive Resilience
            </p>
            <div className="flex gap-10 text-[10px] uppercase tracking-[0.25em] font-bold text-slate-300">
              <a
                href="https://cogcare.org/"
                className="hover:text-[#3D4B3E] transition-colors"
                rel="noopener noreferrer"
              >
                Privacy & Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
