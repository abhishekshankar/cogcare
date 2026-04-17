import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import BrainHealthIndex from '../BrainHealthIndex'
import {
  X,
  ArrowRight,
  Brain,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react'

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

export default function HomePage() {
  const [selectedCard, setSelectedCard] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResults, setQuizResults] = useState(null)
  const handleCloseQuiz = useCallback(() => setShowQuiz(false), [])
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
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
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
        className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-500 pt-[max(0.5rem,env(safe-area-inset-top))] ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md py-3 sm:py-4 shadow-sm'
            : 'bg-transparent py-4 sm:py-6 md:py-8'
        }`}
      >
        <div className="mx-auto flex max-w-7xl flex-nowrap items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 md:gap-6">
          <a
            href={`${BASE}/`}
            className="group flex min-w-0 shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap sm:gap-2.5"
          >
            <Brain
              className="h-5 w-5 shrink-0 text-[#A67B5B] transition-transform duration-300 group-hover:scale-110 sm:h-6 sm:h-7"
              strokeWidth={1.5}
              aria-hidden
            />
            <span className="font-serif text-xl tracking-tighter text-[#3D4B3E] whitespace-nowrap sm:text-2xl md:text-3xl">
              Cog<span className="italic">Care</span>
              <span className="ml-0.5 font-sans text-sm font-medium tracking-normal text-[#A67B5B] opacity-80 sm:text-base">
                .org
              </span>
            </span>
          </a>

          <nav
            className="flex shrink-0 flex-nowrap items-center justify-end gap-2 text-[9px] font-bold uppercase tracking-[0.14em] text-[#3D4B3E] sm:gap-4 sm:text-[10px] sm:tracking-[0.2em] md:gap-8"
            aria-label="Primary"
          >
            <a
              href="https://cogcare.org/"
              className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap px-1 py-2 transition-opacity hover:opacity-60"
              rel="noopener noreferrer"
            >
              Education
            </a>
            <a
              href="https://cogcare.org/blog/"
              className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap px-1 py-2 transition-opacity hover:opacity-60"
              rel="noopener noreferrer"
            >
              Blog
            </a>
            <Link
              to="/login"
              className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap px-1 py-2 transition-opacity hover:opacity-60"
            >
              Sign in
            </Link>
            <a
              href="https://cogcare.org/"
              className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-full bg-[#3D4B3E] px-3.5 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white transition-all hover:bg-[#2D382D] sm:px-6 sm:py-2.5 sm:text-[10px] sm:tracking-[0.2em] md:px-10 md:py-3.5"
              rel="noopener noreferrer"
            >
              Donate
            </a>
          </nav>
        </div>
      </header>

      <section className="relative flex min-h-[100dvh] items-center overflow-hidden pt-[max(5.5rem,env(safe-area-inset-top))] sm:pt-28">
        <div className="max-w-7xl mx-auto w-full grid items-center gap-8 px-4 sm:px-6 md:grid-cols-12 lg:gap-24">
          <div className="z-10 pt-8 sm:pt-12 md:col-span-7 lg:pt-24">
            <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full bg-[#F3EFE9] px-2.5 py-1.5 text-[8px] font-bold uppercase leading-tight tracking-[0.2em] text-[#A67B5B] sm:mb-8 sm:px-3 sm:text-[9px] sm:tracking-[0.25em]">
              <Sparkles className="h-3 w-3 shrink-0" aria-hidden />
              <span className="min-w-0">
                Evidence-Based Cognitive Wellness
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-serif leading-[1.05] tracking-tight text-[#1A1A1A] sm:mb-8 sm:text-5xl md:mb-10 md:text-6xl lg:text-8xl lg:leading-[1.05]">
              Dementia is <br />
              <span className="italic text-[#3D4B3E]">Modifiable.</span>
            </h1>

            <p className="mb-8 max-w-xl text-base font-light leading-relaxed text-slate-500 sm:mb-10 sm:text-lg md:text-xl lg:text-2xl">
              Scientific breakthroughs reveal that 40% of dementia risk is linked
              to factors we can change. Your protective journey begins with daily
              rituals.
            </p>

            <div className="w-full max-w-sm rounded-[2rem] border border-[#F3EFE9] bg-white/40 p-5 shadow-sm backdrop-blur-md sm:rounded-[2.5rem] sm:p-6 lg:max-w-md lg:rounded-[3rem] lg:p-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6">
                Start your BRAIN check-in
              </p>
              <button
                type="button"
                onClick={() => setShowQuiz(true)}
                className="w-full bg-[#3D4B3E] text-white px-8 py-4 rounded-full font-bold uppercase tracking-[0.15em] text-[10px] flex items-center justify-center gap-3 hover:shadow-2xl hover:-translate-y-1 transition-all"
              >
                Begin Assessment
                <ArrowRight className="w-4 h-4" aria-hidden />
              </button>
            </div>
          </div>

          <div className="relative mt-10 flex justify-center md:col-span-5 md:mt-0">
            <div className="relative aspect-[4/5] w-full max-w-[min(100%,20rem)] overflow-hidden rounded-[2.25rem] border-[8px] border-white shadow-[0_40px_80px_-15px_rgba(61,75,62,0.12)] ring-1 ring-slate-100 sm:max-w-sm sm:rounded-[3rem] sm:border-[12px] lg:max-w-lg lg:rounded-[4.5rem] lg:border-[16px]">
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

          <p className="md:col-span-12 mt-10 w-full text-center text-base font-light leading-[1.65] text-slate-600 sm:mt-12 sm:text-lg md:mt-14 md:text-xl md:leading-relaxed lg:text-[1.35rem] lg:leading-[1.7]">
            CogCare is a nonprofit devoted to brain health. Our physicians—trained
            at UCLA, Mayo Clinic, Penn, Harvard, and other leading institutions—came
            together to develop a new approach to brain assessment.
          </p>
        </div>
      </section>

      <section
        className="bg-white py-16 sm:py-24 md:py-32"
        aria-labelledby="pillars-heading"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-16 grid items-end gap-10 lg:mb-24 lg:grid-cols-2 lg:gap-20">
            <div>
              <h2
                id="pillars-heading"
                className="mb-6 text-3xl font-serif leading-tight text-[#1A1A1A] sm:mb-8 sm:text-4xl md:text-5xl lg:text-6xl"
              >
                Dementia Does Not <br />
                <span className="italic text-[#3D4B3E]">Differentiate.</span>
              </h2>
              <p className="max-w-lg text-base font-light leading-relaxed text-slate-400 sm:text-lg md:text-xl">
                High-end cognitive care should be a universal standard. We build
                the inclusive architecture for brain health across all
                communities.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <div className="h-px w-full lg:w-48 bg-slate-200" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedCard(card)}
                className="group relative h-[min(78vh,520px)] w-full cursor-pointer overflow-hidden rounded-[2rem] border-0 bg-slate-50 p-0 text-left transition-all duration-700 hover:shadow-2xl sm:h-[540px] sm:rounded-[3rem] md:h-[580px] lg:rounded-[3.5rem]"
              >
                <img
                  src={card.image}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1500ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-50 group-hover:opacity-70 transition-opacity" />

                <div className="absolute bottom-0 left-0 w-full transform p-6 text-white transition-transform duration-700 sm:p-10">
                  <p className="mb-3 text-[8px] font-bold uppercase tracking-[0.25em] text-white/60 sm:mb-4 sm:text-[9px] sm:tracking-[0.3em]">
                    {card.category}
                  </p>
                  <h3 className="mb-4 max-w-[220px] font-serif text-xl leading-tight sm:mb-8 sm:text-2xl">
                    {card.title}
                  </h3>
                  <div className="flex translate-y-2 items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] opacity-100 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                    Explore
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {selectedCard && (
        <div
          className="fixed inset-0 z-[100] flex items-end justify-end sm:items-center"
          role="presentation"
        >
          <button
            type="button"
            className="animate-modal-backdrop absolute inset-0 cursor-pointer border-0 bg-[#3D4B3E]/20 p-0 backdrop-blur-md"
            onClick={() => setSelectedCard(null)}
            aria-label="Close panel"
          />
          <div
            className="animate-modal-panel relative flex h-[92dvh] max-h-[100dvh] w-full max-w-2xl flex-col overflow-y-auto bg-[#FDFBF7] shadow-2xl sm:h-full sm:max-h-none"
            role="dialog"
            aria-modal="true"
            aria-labelledby="card-detail-title"
          >
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setSelectedCard(null)}
              className="absolute right-4 top-4 z-10 rounded-full border border-slate-100 bg-white p-3 transition-all hover:bg-[#F3EFE9] sm:right-10 sm:top-10 sm:p-4"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-slate-800" aria-hidden />
            </button>

            <div className="px-5 pb-16 pt-24 sm:px-10 sm:pb-24 sm:pt-32 md:px-20">
              <div className="inline-block px-4 py-1.5 bg-[#3D4B3E] text-white text-[9px] font-bold uppercase tracking-[0.25em] mb-12 rounded-full">
                {selectedCard.category}
              </div>
              <h2
                id="card-detail-title"
                className="mb-10 font-serif text-3xl italic leading-[1.15] text-[#1A1A1A] sm:mb-12 sm:text-4xl md:mb-16 md:text-5xl lg:text-6xl"
              >
                {selectedCard.title}
              </h2>

              <div className="mb-10 aspect-[16/10] overflow-hidden rounded-[1.75rem] border-[6px] border-white shadow-2xl sm:mb-12 sm:rounded-[2.5rem] sm:border-[10px] md:mb-16 md:rounded-[3.5rem] md:border-[12px]">
                <img
                  src={selectedCard.image}
                  className="w-full h-full object-cover"
                  alt=""
                />
              </div>

              <div className="max-w-none">
                <p className="mb-10 whitespace-pre-line border-l-2 border-[#A67B5B] pl-5 text-base font-light italic leading-relaxed text-slate-600 sm:mb-12 sm:pl-8 sm:text-lg md:mb-16 md:text-xl lg:text-2xl">
                  {selectedCard.content}
                </p>

                <div className="space-y-6">
                  <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.4em] text-[#3D4B3E] sm:mb-8">
                    Next Steps
                  </p>
                  <button
                    type="button"
                    className="group flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm transition-all hover:border-[#3D4B3E] hover:shadow-xl sm:rounded-[2rem] sm:p-8"
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

      <footer className="border-t border-[#E8DCC4] bg-[#F3EFE9] py-16 sm:py-24 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-16 grid gap-12 md:mb-24 md:grid-cols-3 md:gap-16">
            <div className="md:col-span-2">
              <span className="mb-6 block font-serif text-3xl italic tracking-tight text-[#3D4B3E] sm:mb-10 sm:text-4xl">
                CogCare.org
              </span>
              <p className="mb-6 max-w-sm text-base font-light italic leading-relaxed text-slate-400 sm:mb-8">
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
                    href="https://cogcare.org/blog/"
                    className="hover:opacity-50 transition-opacity"
                    rel="noopener noreferrer"
                  >
                    Blog
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
          <div className="flex flex-col items-center gap-6 border-t border-[#E8DCC4] pt-10 text-center md:flex-row md:items-center md:justify-between md:gap-8 md:pt-16 md:text-left">
            <p className="text-[10px] font-bold uppercase italic tracking-[0.25em] text-slate-300">
              © 2026 CogCare Initiative • Empowering Cognitive Resilience
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-300 sm:gap-10">
              <a
                href="https://cogcare.org/blog/"
                className="hover:text-[#3D4B3E] transition-colors"
                rel="noopener noreferrer"
              >
                Blog
              </a>
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

      <BrainHealthIndex
        open={showQuiz}
        onClose={handleCloseQuiz}
        quizAnswers={quizAnswers}
        setQuizAnswers={setQuizAnswers}
        quizResults={quizResults}
        setQuizResults={setQuizResults}
      />
    </div>
  )
}
