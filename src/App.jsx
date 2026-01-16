import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  Activity, 
  Zap, 
  Layers, 
  Lock, 
  ChevronRight, 
  Play, 
  BarChart3, 
  Users, 
  ArrowRight, 
  Check, 
  Menu, 
  X,
  Smartphone,
  ShieldCheck,
  Leaf,
  AlertCircle,
  Gift,
  TrendingUp,
  Clock,
  Star,
  Search,
  Target,
  Car,
  Repeat,
  Moon,
  CloudFog,
  Battery,
  Smile,
  MapPin,
  Calendar,
  Award,
  Stethoscope,
  Phone,
  Filter,
  Heart,
  ExternalLink,
  BookOpen,
  FileText,
  GraduationCap
} from 'lucide-react';

/**
 * Utility for scroll reveal animations
 */
const RevealOnScroll = ({ children, className = "", delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

/**
 * Exit Intent Popup
 */
const ExitIntentPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0 && !hasShown) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShown]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 lg:p-12 max-w-lg w-full relative shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
        </button>

        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Gift className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
          </div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1a3c34] mb-2">Wait! Before You Go...</h3>
          <p className="text-[#5c7a70] text-sm sm:text-base">
            Get the free "Scattered Starter Survival Guide"
          </p>
        </div>

        <ul className="text-left mb-8 space-y-3 text-sm text-[#1a3c34]">
          <li className="flex items-center">
            <Check className="w-5 h-5 text-[#4a7c59] mr-3" />
            <span>3 dopamine-boosting morning routines</span>
          </li>
          <li className="flex items-center">
            <Check className="w-5 h-5 text-[#4a7c59] mr-3" />
            <span>The 25-minute focus protocol</span>
          </li>
          <li className="flex items-center">
            <Check className="w-5 h-5 text-[#4a7c59] mr-3" />
            <span>Environment optimization checklist</span>
          </li>
        </ul>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full px-4 py-2.5 sm:py-3 rounded-full border-2 border-gray-200 mb-3 sm:mb-4 focus:outline-none focus:border-[#4a7c59] transition-colors text-sm sm:text-base"
        />

        <button className="w-full bg-gradient-to-r from-[#1a3c34] via-[#2a5c4f] to-[#1a3c34] text-white py-2.5 sm:py-3 rounded-full font-bold hover:from-[#2a5c4f] hover:via-[#1a3c34] hover:to-[#2a5c4f] transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02] text-sm sm:text-base">
          SEND ME THE GUIDE
        </button>

        <p className="text-xs text-gray-400 text-center mt-4">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
};

/**
 * Medical Disclaimer Component
 */
const MedicalDisclaimer = () => {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 sm:p-5 mb-6 sm:mb-8 rounded-r-lg">
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-semibold text-amber-900 mb-2">
            ⚠️ Important: CogCare provides educational wellness information and is not a substitute for professional medical advice, diagnosis, or treatment.
          </p>
          <p className="text-xs sm:text-sm text-amber-800 mb-3">
            If you're experiencing severe symptoms, suicidal thoughts, or mental health crisis, contact a healthcare provider immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs text-amber-700">
            <a href="tel:988" className="flex items-center hover:text-amber-900 font-medium">
              🇺🇸 US: 988 Suicide & Crisis Lifeline
            </a>
            <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-amber-900 font-medium">
              🌍 International: Find local resources at findahelpline.com
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Privacy & Data Security Banner
 */
const PrivacyBanner = ({ setActivePage }) => {
  return (
    <div className="bg-[#1a3c34] text-white p-4 sm:p-5 mb-6 sm:mb-8 rounded-lg">
      <div className="flex items-start">
        <Lock className="w-5 h-5 sm:w-6 sm:h-6 mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm sm:text-base font-bold mb-2">🔒 Your Data is Private & Secure</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm mb-3">
                <div className="flex items-start">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#4a7c59] flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">HIPAA-Level Encryption (AES-256)</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#4a7c59] flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">Zero Data Selling - Never shared with advertisers</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#4a7c59] flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">Anonymous Results - No personally identifiable information required</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#4a7c59] flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">GDPR & CCPA Compliant</span>
                </div>
              </div>
          <div className="flex flex-wrap gap-3 text-xs sm:text-sm">
            <button 
              onClick={() => setActivePage('privacy')}
              className="text-[#8fb89c] hover:text-white underline font-medium"
            >
              View Privacy Policy
            </button>
            <span className="text-gray-400">•</span>
            <button 
              onClick={() => setActivePage('privacy')}
              className="text-[#8fb89c] hover:text-white underline font-medium"
            >
              Data Security Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Research Foundation Section
 */
const ResearchFoundation = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#eff2ef] border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealOnScroll>
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-lg border border-gray-100">
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-block bg-blue-100 text-blue-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold mb-4">
                PEER-REVIEWED SCIENCE
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3c34] mb-4 sm:mb-6">
                Built on Peer-Reviewed Neuroscience
              </h2>
              <p className="text-base sm:text-lg text-[#5c7a70] max-w-3xl mx-auto">
                Our protocols synthesize findings from leading research institutions and published studies.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
              <div className="bg-[#eff2ef] rounded-xl p-4 sm:p-5 md:p-6">
                <h3 className="font-bold text-[#1a3c34] mb-3 sm:mb-4 text-base sm:text-lg md:text-xl">Research Institutions</h3>
                <ul className="space-y-3 text-xs sm:text-sm md:text-base text-[#5c7a70]">
                  <li className="flex items-start">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#1a3c34] text-xs sm:text-sm md:text-base">Stanford Neurobiology Lab</p>
                      <p className="text-[10px] sm:text-xs md:text-sm leading-relaxed">Dr. Andrew Huberman - Circadian optimization, dopamine regulation research</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#1a3c34] text-xs sm:text-sm md:text-base">McGill University Department of Psychiatry</p>
                      <p className="text-[10px] sm:text-xs md:text-sm leading-relaxed">Light exposure effects on motivation & mood</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#1a3c34] text-xs sm:text-sm md:text-base">NIH National Institute of Mental Health</p>
                      <p className="text-[10px] sm:text-xs md:text-sm leading-relaxed">Cortisol regulation, stress response systems</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-[#eff2ef] rounded-xl p-4 sm:p-5 md:p-6">
                <h3 className="font-bold text-[#1a3c34] mb-3 sm:mb-4 text-base sm:text-lg md:text-xl">Key Research Studies</h3>
                <ul className="space-y-3 text-xs sm:text-sm md:text-base text-[#5c7a70]">
                  <li className="flex items-start">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#1a3c34] text-xs sm:text-sm md:text-base">Tsai et al. (2011)</p>
                      <p className="text-[10px] sm:text-xs md:text-sm leading-relaxed">Sunshine-exposure variation of human striatal dopamine D2/D3 receptor availability</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#1a3c34] text-xs sm:text-sm md:text-base">Šrámek et al. (2000)</p>
                      <p className="text-[10px] sm:text-xs md:text-sm leading-relaxed">Cold water immersion increases dopamine by 250%</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-[#1a3c34] text-xs sm:text-sm md:text-base">Ma et al. (2017)</p>
                      <p className="text-[10px] sm:text-xs md:text-sm leading-relaxed">Diaphragmatic breathing reduces cortisol by 23% after 20 sessions</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-[#1a3c34] text-white rounded-xl p-4 sm:p-5 md:p-6 text-center">
              <p className="text-xs sm:text-sm md:text-base mb-4 leading-relaxed px-2">
                127+ peer-reviewed studies in Journal of Psychiatry & Neuroscience, Frontiers in Psychology, Psychoneuroendocrinology, and Smart Health
              </p>
              <button className="text-[#8fb89c] hover:text-white font-semibold text-xs sm:text-sm md:text-base underline">
                View Complete Research Bibliography →
              </button>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

/**
 * Comparison Matrix Component
 */
const ComparisonMatrix = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealOnScroll>
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block bg-blue-100 text-blue-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold mb-4">
              COMPETITIVE COMPARISON
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3c34] mb-4 sm:mb-6">
              CogCare vs. Traditional Approaches
            </h2>
            <p className="text-base sm:text-lg text-[#5c7a70] max-w-3xl mx-auto">
              See how CogCare compares to other solutions you might be considering
            </p>
          </div>
          
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="w-full border-collapse bg-white rounded-xl shadow-lg overflow-hidden">
                <thead className="bg-[#1a3c34] text-white">
                  <tr>
                    <th className="p-3 sm:p-4 text-left text-xs sm:text-sm md:text-base font-bold whitespace-nowrap">Solution</th>
                    <th className="p-3 sm:p-4 text-left text-xs sm:text-sm md:text-base font-bold">Best For</th>
                    <th className="p-3 sm:p-4 text-left text-xs sm:text-sm md:text-base font-bold hidden md:table-cell">Method</th>
                    <th className="p-3 sm:p-4 text-left text-xs sm:text-sm md:text-base font-bold whitespace-nowrap">Cost</th>
                    <th className="p-3 sm:p-4 text-left text-xs sm:text-sm md:text-base font-bold hidden lg:table-cell">Timeline</th>
                  </tr>
                </thead>
              <tbody className="text-xs sm:text-sm md:text-base">
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 sm:p-4 font-semibold text-[#1a3c34] text-xs sm:text-sm">Therapy<br className="hidden sm:block"/><span className="sm:hidden">(BetterHelp)</span></td>
                  <td className="p-3 sm:p-4 text-[#5c7a70] text-xs sm:text-sm">Emotional processing, relationship issues</td>
                  <td className="p-3 sm:p-4 text-[#5c7a70] text-xs sm:text-sm hidden md:table-cell">Talk therapy, mindset work</td>
                  <td className="p-3 sm:p-4 text-[#5c7a70] text-xs sm:text-sm whitespace-nowrap">$100-300/session</td>
                  <td className="p-3 sm:p-4 text-[#5c7a70] text-xs sm:text-sm hidden lg:table-cell">6-12 months</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 sm:p-4 font-semibold text-[#1a3c34] text-xs sm:text-sm">Psychiatry</td>
                  <td className="p-3 sm:p-4 text-[#5c7a70] text-xs sm:text-sm">Clinical depression, severe anxiety</td>
                  <td className="p-3 sm:p-4 text-[#5c7a70] text-xs sm:text-sm hidden md:table-cell">Medication trials</td>
                  <td className="p-3 sm:p-4 text-[#5c7a70] text-xs sm:text-sm whitespace-nowrap">$150-400 + meds</td>
                  <td className="p-3 sm:p-4 text-[#5c7a70] text-xs sm:text-sm hidden lg:table-cell">3-6 months</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 sm:p-4 font-semibold text-[#1a3c34] text-xs sm:text-sm">Meditation Apps<br className="hidden sm:block"/><span className="sm:hidden">(Calm, etc.)</span></td>
                  <td className="p-3 sm:p-4 text-[#5c7a70] text-xs sm:text-sm">General stress relief, relaxation</td>
                  <td className="p-3 sm:p-4 text-[#5c7a70] text-xs sm:text-sm hidden md:table-cell">Guided meditation</td>
                  <td className="p-3 sm:p-4 text-[#5c7a70] text-xs sm:text-sm whitespace-nowrap">$70-100/year</td>
                  <td className="p-3 sm:p-4 text-[#5c7a70] text-xs sm:text-sm hidden lg:table-cell">Ongoing</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-3 sm:p-4 font-semibold text-[#1a3c34] text-xs sm:text-sm">Brain Training<br className="hidden sm:block"/><span className="sm:hidden">(Lumosity)</span></td>
                  <td className="p-3 sm:p-4 text-[#5c7a70] text-xs sm:text-sm">Cognitive games, memory practice</td>
                  <td className="p-3 sm:p-4 text-[#5c7a70] text-xs sm:text-sm hidden md:table-cell">Gamified exercises</td>
                  <td className="p-3 sm:p-4 text-[#5c7a70] text-xs sm:text-sm whitespace-nowrap">$60-120/year</td>
                  <td className="p-3 sm:p-4 text-[#5c7a70] text-xs sm:text-sm hidden lg:table-cell">3-6 months</td>
                </tr>
                <tr className="border-b-2 border-[#4a7c59] bg-[#eff2ef]">
                  <td className="p-3 sm:p-4 font-bold text-[#1a3c34] text-sm sm:text-base md:text-lg">CogCare</td>
                  <td className="p-3 sm:p-4 font-semibold text-[#1a3c34] text-xs sm:text-sm">"Functional but not optimal" (focus, energy, clarity)</td>
                  <td className="p-3 sm:p-4 font-semibold text-[#1a3c34] text-xs sm:text-sm hidden md:table-cell">Diagnostic → optimization protocols</td>
                  <td className="p-3 sm:p-4 font-bold text-[#4a7c59] text-sm sm:text-base md:text-lg whitespace-nowrap">$147 one-time</td>
                  <td className="p-3 sm:p-4 font-semibold text-[#1a3c34] text-xs sm:text-sm hidden lg:table-cell">2-4 weeks</td>
                </tr>
              </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 md:mt-12 bg-[#eff2ef] rounded-xl p-4 sm:p-6 md:p-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1a3c34] mb-3 sm:mb-4">🔍 The CogCare Difference:</h3>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm md:text-base text-[#5c7a70]">
              <li className="flex items-start">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a7c59] mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed"><strong className="text-[#1a3c34]">Not therapy replacement</strong> → Complement for biology optimization</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a7c59] mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed"><strong className="text-[#1a3c34]">Not medication</strong> → But works synergistically with prescribed treatments</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a7c59] mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed"><strong className="text-[#1a3c34]">Not generic content</strong> → Diagnostic precision for YOUR specific deficits</span>
              </li>
              <li className="flex items-start">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a7c59] mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed"><strong className="text-[#1a3c34]">Not gamified distraction</strong> → Evidence-based protocols with measurable outcomes</span>
              </li>
            </ul>
          </div>
          
          <div className="mt-6 sm:mt-8 md:mt-12 bg-white border-2 border-[#4a7c59] rounded-xl p-4 sm:p-6 md:p-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1a3c34] mb-3 sm:mb-4">When to Use What:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-xs sm:text-sm md:text-base">
              <div>
                <p className="font-bold text-[#1a3c34] mb-3 text-sm sm:text-base">Use CogCare IF:</p>
                <ul className="space-y-2 text-[#5c7a70]">
                  <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">You're high-functioning but hitting cognitive bottlenecks</span></li>
                  <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">You've tried "just focus harder" and it doesn't stick</span></li>
                  <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">You want measurable improvement in 2-4 weeks</span></li>
                  <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">You prefer lifestyle optimization over medication</span></li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-[#1a3c34] mb-3 text-sm sm:text-base">Use Therapy IF:</p>
                <ul className="space-y-2 text-[#5c7a70]">
                  <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">You need to process trauma, grief, relationship issues</span></li>
                  <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">You're working on mindset, self-worth, emotional patterns</span></li>
                </ul>
                <p className="font-bold text-[#1a3c34] mb-3 mt-4 text-sm sm:text-base">Use Psychiatry IF:</p>
                <ul className="space-y-2 text-[#5c7a70]">
                  <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">Clinical depression/anxiety requiring pharmaceutical intervention</span></li>
                  <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">Bipolar disorder, schizophrenia, severe conditions</span></li>
                </ul>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs sm:text-sm md:text-base text-[#5c7a70] text-center leading-relaxed px-2">
                <strong className="text-[#1a3c34]">Use All Three Together:</strong> Therapy (mindset) + Psychiatry (medication if needed) + CogCare (biology)
                <br className="hidden sm:block"/>This integrated approach addresses: psychology, pharmacology, AND physiology
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

/**
 * Assessment Validation Methodology
 */
const AssessmentValidation = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealOnScroll>
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-block bg-green-100 text-green-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold mb-4">
              VALIDATION METHODOLOGY
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3c34] mb-4 sm:mb-6">
              How We Validate Our Assessments
            </h2>
            <p className="text-base sm:text-lg text-[#5c7a70] max-w-3xl mx-auto">
              Unlike generic personality quizzes, our assessment engine uses validated scientific methods.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-[#eff2ef] rounded-xl p-4 sm:p-6 md:p-8">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4a7c59] text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mr-3 sm:mr-4 flex-shrink-0">
                  1
                </div>
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-[#1a3c34] leading-tight">Temporal Pattern Analysis</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-[#5c7a70] mb-3 sm:mb-4 leading-relaxed">
                Maps WHEN symptoms occur → Identifies specific neurochemical dysfunction patterns
              </p>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-600 italic leading-relaxed">
                Based on: Circadian neuroscience research (Diehl et al., 1994)
              </p>
            </div>
            
            <div className="bg-[#eff2ef] rounded-xl p-4 sm:p-6 md:p-8">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4a7c59] text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mr-3 sm:mr-4 flex-shrink-0">
                  2
                </div>
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-[#1a3c34] leading-tight">Context-Dependent Profiling</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-[#5c7a70] mb-3 sm:mb-4 leading-relaxed">
                Analyzes triggers, not just severity. Distinguishes between dopamine depletion vs. cortisol dysregulation.
              </p>
            </div>
            
            <div className="bg-[#eff2ef] rounded-xl p-4 sm:p-6 md:p-8">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4a7c59] text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mr-3 sm:mr-4 flex-shrink-0">
                  3
                </div>
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-[#1a3c34] leading-tight">Validated Against Clinical Outcomes</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-[#5c7a70] mb-3 sm:mb-4 leading-relaxed">
                Profiles refined using data from 247,000+ users. Cross-referenced with standardized psychological assessments (PSS, GAD-7), objective biomarkers (HRV, cortisol curves), and 90-day outcome tracking.
              </p>
            </div>
            
            <div className="bg-[#eff2ef] rounded-xl p-4 sm:p-6 md:p-8">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4a7c59] text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mr-3 sm:mr-4 flex-shrink-0">
                  4
                </div>
                <h3 className="text-base sm:text-xl md:text-2xl font-bold text-[#1a3c34] leading-tight">Machine Learning Refinement</h3>
              </div>
              <p className="text-xs sm:text-sm md:text-base text-[#5c7a70] mb-3 sm:mb-4 leading-relaxed">
                Algorithm continuously improves prediction accuracy. Current classification precision: <strong className="text-[#1a3c34]">87% match to clinical phenotypes</strong>.
              </p>
            </div>
          </div>
          
          <div className="mt-6 sm:mt-8 md:mt-12 text-center px-4">
            <p className="text-sm sm:text-base md:text-lg font-semibold text-[#1a3c34] leading-relaxed">
              Your results aren't based on "what sounds right"—they're derived from measurable neurobiological patterns.
            </p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

/**
 * Navbar Component
 */
const Navbar = ({ activePage, setActivePage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-[#eff2ef]/95 backdrop-blur-md border-b border-[#1a3c34]/5" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <div 
          className="flex items-center space-x-2 text-[#1a3c34] font-bold tracking-tight cursor-pointer"
          onClick={() => setActivePage('home')}
        >
          <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-[#4a7c59]" />
          <span className="text-lg sm:text-xl">CogCare</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-[#5c7a70]">
          <button 
            onClick={() => setActivePage('directory')}
            className={`flex items-center transition-colors ${activePage === 'directory' ? 'text-[#1a3c34] font-bold' : 'hover:text-[#1a3c34]'}`}
          >
            <Search className="w-4 h-4 mr-1.5" />
            Find a Professional
          </button>
          
          <button 
            onClick={() => setActivePage('programs')}
            className={`transition-colors ${activePage === 'programs' ? 'text-[#1a3c34] font-bold' : 'hover:text-[#1a3c34]'}`}
          >
            Programs
          </button>
          
          <button 
            onClick={() => setActivePage('assessments')}
            className={`transition-colors flex items-center ${activePage === 'assessments' ? 'text-[#1a3c34] font-bold' : 'hover:text-[#1a3c34]'}`}
          >
            Assessments <ChevronRight className="w-3 h-3 ml-1 rotate-90" />
          </button>
          
          <button 
            onClick={() => setActivePage('certification')}
            className={`transition-colors ${activePage === 'certification' ? 'text-[#1a3c34] font-bold' : 'hover:text-[#1a3c34]'}`}
          >
            Get Certified
          </button>
          
          <button className="bg-gradient-to-r from-[#1a3c34] via-[#2a5c4f] to-[#1a3c34] text-white px-5 py-2.5 sm:py-2 rounded-full hover:from-[#2a5c4f] hover:via-[#1a3c34] hover:to-[#2a5c4f] transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02] text-xs sm:text-sm font-bold min-h-[44px]">
            Login
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden text-[#1a3c34]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-14 sm:top-16 left-0 w-full bg-[#eff2ef] backdrop-blur-xl border-b border-[#1a3c34]/10 p-4 sm:p-6 flex flex-col space-y-3 md:hidden shadow-xl max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          <button onClick={() => { setActivePage('directory'); setMobileMenuOpen(false); }} className="text-[#1a3c34] font-medium text-left py-2 text-base">Find a Professional</button>
          <button onClick={() => { setActivePage('programs'); setMobileMenuOpen(false); }} className="text-[#1a3c34] font-medium text-left py-2 text-base">Programs</button>
          <button onClick={() => { setActivePage('assessments'); setMobileMenuOpen(false); }} className="text-[#1a3c34] font-medium text-left py-2 text-base">Assessments</button>
          <button onClick={() => { setActivePage('certification'); setMobileMenuOpen(false); }} className="text-[#1a3c34] font-medium text-left py-2 text-base">Get Certified</button>
          <button className="bg-gradient-to-r from-[#1a3c34] via-[#2a5c4f] to-[#1a3c34] text-white px-4 py-3.5 rounded-full w-full text-base font-medium mt-2 hover:from-[#2a5c4f] hover:via-[#1a3c34] hover:to-[#2a5c4f] transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02]">
            Take a Quiz
          </button>
        </div>
      )}
    </nav>
  );
};

/* =========================================
   PROFESSIONAL DIRECTORY COMPONENT
   ========================================= */
const ProfessionalDirectory = ({ setActivePage }) => {
  const specialties = [
    { name: "ADHD & Focus Specialists", count: 247, price: "$180", icon: Target, color: "red" },
    { name: "Anxiety & Stress Therapists", count: 412, price: "$165", icon: Activity, color: "orange" },
    { name: "Sleep Medicine Specialists", count: 156, price: "$220", icon: Moon, color: "indigo" },
    { name: "Depression Experts", count: 523, price: "$175", icon: Smile, color: "blue" },
    { name: "Brain Fog Specialists", count: 189, price: "$195", icon: CloudFog, color: "gray" },
    { name: "Memory & Alzheimer's", count: 134, price: "$250", icon: Brain, color: "purple" },
    { name: "Chronic Pain Specialists", count: 112, price: "$210", icon: Zap, color: "yellow" },
    { name: "Women's Brain Health", count: 145, price: "$200", icon: Leaf, color: "pink" },
    { name: "Peak Performance Coaches", count: 89, price: "$300", icon: TrendingUp, color: "green" },
    { name: "Burnout Recovery", count: 234, price: "$190", icon: Battery, color: "red" },
    { name: "Metabolic Psychiatry", count: 76, price: "$275", icon: AppleIcon, color: "emerald" }, // Using Apple icon placeholder for nutrition
    { name: "Neurofeedback", count: 103, price: "$150", icon: Layers, color: "cyan" },
  ];

  // Placeholder icon component
  function AppleIcon(props) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/></svg>
  }

  const featuredPros = [
    {
      name: "Dr. Sarah Chen, MD",
      title: "Board-Certified Psychiatrist | ADHD Specialist",
      rating: 4.9,
      reviews: 127,
      location: "New York, NY + Virtual",
      price: "$250/session",
      insurance: ["Aetna", "BCBS"],
      available: "Tomorrow",
      tags: ["Adult ADHD", "Meds Management", "CBT"],
      image: "/api/placeholder/100/100"
    },
    {
      name: "Dr. James Martinez, PsyD",
      title: "Clinical Psychologist | Anxiety Expert",
      rating: 4.8,
      reviews: 94,
      location: "Los Angeles, CA + Virtual",
      price: "$200/session",
      insurance: ["Cigna", "United"],
      available: "Next Week",
      tags: ["Anxiety", "Panic", "Somatic"],
      image: "/api/placeholder/100/100"
    },
    {
      name: "Elena Rostova, NBC-HWC",
      title: "Certified Brain Health Coach",
      rating: 5.0,
      reviews: 42,
      location: "Virtual Only",
      price: "$150/session",
      insurance: ["Out-of-Network"],
      available: "Today",
      tags: ["Brain Fog", "Nutrition", "Habits"],
      image: "/api/placeholder/100/100"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* SECTION 1: HERO WITH SEARCH */}
      <section className="bg-[#eff2ef] pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 border-b border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-[#1a3c34] mb-4 sm:mb-6 leading-tight">
            Find a Brain Health Specialist Near You
          </h1>
          <p className="text-[#5c7a70] text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12 px-2">
            Connect with licensed professionals who understand your unique brain needs.
            All practitioners trained in neuroscience-based approaches.
          </p>

          <div className="bg-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl max-w-4xl mx-auto border border-gray-100 flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <select className="w-full pl-12 pr-4 py-3 sm:py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4a7c59] appearance-none text-sm sm:text-base text-[#1a3c34] font-medium">
                <option>What are you looking for?</option>
                <option>ADHD & Focus Specialists</option>
                <option>Anxiety & Stress Therapists</option>
                <option>Sleep Medicine Specialists</option>
                <option>Depression Experts</option>
                <option>Brain Fog Specialists</option>
              </select>
              <ChevronRight className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" />
            </div>
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <MapPin className="w-5 h-5" />
              </div>
              <input 
                type="text" 
                placeholder="ZIP Code or City" 
                className="w-full pl-12 pr-4 py-3 sm:py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4a7c59] text-sm sm:text-base text-[#1a3c34]"
              />
            </div>
            <button className="bg-gradient-to-r from-[#1a3c34] via-[#2a5c4f] to-[#1a3c34] hover:from-[#2a5c4f] hover:via-[#1a3c34] hover:to-[#2a5c4f] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02] whitespace-nowrap text-sm sm:text-base">
              Search Now
            </button>
          </div>

          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-[10px] sm:text-xs font-bold text-[#5c7a70] uppercase tracking-wide px-2">
            <span className="flex items-center"><Check className="w-4 h-4 mr-2 text-[#4a7c59]" /> 1,847 Verified Pros</span>
            <span className="flex items-center"><Check className="w-4 h-4 mr-2 text-[#4a7c59]" /> Licensed & Credentialed</span>
            <span className="flex items-center"><Check className="w-4 h-4 mr-2 text-[#4a7c59]" /> Taking New Patients</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: QUIZ INTEGRATION */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#1a3c34] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-8 sm:gap-12 relative overflow-hidden">
            <div className="relative z-10 flex-1 w-full">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 leading-tight">Not Sure What Kind of Specialist You Need?</h2>
              <p className="text-gray-300 mb-6 sm:mb-8 text-sm sm:text-base">
                Take our 5-minute assessment. We'll analyze your symptoms and match you with the exact type of professional who can help.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  onClick={() => setActivePage('home')} // Should scroll to quiz usually
                  className="bg-gradient-to-r from-[#4a7c59] to-[#5a9c69] text-white px-6 py-3 rounded-full font-bold hover:from-[#3a6347] hover:to-[#4a8c59] transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02] flex items-center justify-center"
                >
                  <Target className="w-4 h-4 mr-2" /> Quick Symptom Checker
                </button>
                <button className="bg-white/10 text-white px-6 py-3 rounded-full font-bold hover:bg-white/20 transition-all border border-white/20 flex items-center justify-center">
                  <Brain className="w-4 h-4 mr-2" /> Comprehensive Assessment
                </button>
              </div>
            </div>
            {/* Visual element */}
            <div className="hidden md:block w-64 h-64 bg-white/10 rounded-full blur-3xl absolute -right-10 -top-10"></div>
          </div>
        </div>
      </section>

      {/* SECTION 3: BROWSE BY SPECIALTY */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3c34] mb-2">Browse by Specialty</h2>
              <p className="text-[#5c7a70] text-sm sm:text-base">Find experts for your specific brain health needs.</p>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto -mx-4 sm:mx-0 px-4 sm:px-0">
              {['Popular', 'Mental Health', 'Cognitive', 'Performance'].map(tab => (
                  <button key={tab} className="px-3 sm:px-4 py-2.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold bg-white text-[#5c7a70] border border-gray-200 hover:border-[#1a3c34] hover:text-[#1a3c34] transition-all whitespace-nowrap flex-shrink-0 min-h-[44px]">
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {specialties.map((spec, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all cursor-pointer group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gray-100`}> 
                  <spec.icon className={`w-6 h-6 text-[#1a3c34]`} />
                </div>
                <h3 className="font-bold text-[#1a3c34] text-lg mb-2 group-hover:text-[#4a7c59] transition-colors">{spec.name}</h3>
                <div className="flex justify-between items-center text-xs text-[#5c7a70] mb-4">
                  <span>{spec.count} specialists</span>
                  <span>Avg {spec.price}/hr</span>
                </div>
                <div className="text-[#4a7c59] text-xs font-bold flex items-center">
                  FIND SPECIALIST <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="text-[#1a3c34] font-bold border-b-2 border-[#1a3c34] hover:text-[#4a7c59] hover:border-[#4a7c59] pb-1 transition-all">
              View All 74 Specialties
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3c34] text-center mb-8 sm:mb-12 md:mb-16">How to Find Your Specialist</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              { title: "Search or Quiz", desc: "Choose your specialty or take our assessment for a match." },
              { title: "Browse Profiles", desc: "Review credentials, pricing, and patient reviews." },
              { title: "Book Consultation", desc: "Schedule directly. Many offer free 15-min intro calls." },
              { title: "Start Journey", desc: "Begin working with a pro who understands your brain." }
            ].map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="w-16 h-16 bg-[#eff2ef] rounded-full flex items-center justify-center text-[#1a3c34] font-bold text-2xl mx-auto mb-6 relative z-10">
                  {i + 1}
                </div>
                {i < 3 && <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-100 -z-0"></div>}
                <h3 className="font-bold text-[#1a3c34] mb-2">{step.title}</h3>
                <p className="text-sm text-[#5c7a70]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: FEATURED PROFESSIONALS */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-[#1a3c34]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Featured Professionals</h2>
            <button className="text-[#4a7c59] font-bold hover:text-white transition-colors text-sm sm:text-base">Browse All →</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredPros.map((pro, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 hover:translate-y-[-4px] transition-transform duration-300">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-[#1a3c34] leading-tight">{pro.name}</h3>
                    <p className="text-xs text-[#5c7a70] mb-1">{pro.title}</p>
                    <div className="flex items-center text-xs font-bold text-[#1a3c34]">
                      <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                      {pro.rating} <span className="text-gray-400 font-normal ml-1">({pro.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 text-xs text-[#5c7a70] mb-6">
                  <div className="flex items-center"><MapPin className="w-3 h-3 mr-2" /> {pro.location}</div>
                  <div className="flex items-center"><TrendingUp className="w-3 h-3 mr-2" /> {pro.price}</div>
                  <div className="flex items-center"><Calendar className="w-3 h-3 mr-2" /> Available: {pro.available}</div>
                  <div className="flex items-center"><ShieldCheck className="w-3 h-3 mr-2" /> Accepts: {pro.insurance.join(", ")}</div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {pro.tags.map((tag, j) => (
                    <span key={j} className="px-2 py-1 bg-gray-100 rounded-md text-[10px] font-bold text-gray-600">{tag}</span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="py-2.5 sm:py-2 rounded-xl border border-gray-200 text-[#1a3c34] font-bold text-xs sm:text-sm hover:bg-gray-50 min-h-[44px]">View Profile</button>
                  <button className="py-2.5 sm:py-2 rounded-xl bg-gradient-to-r from-[#1a3c34] via-[#2a5c4f] to-[#1a3c34] text-white font-bold text-xs sm:text-sm hover:from-[#2a5c4f] hover:via-[#1a3c34] hover:to-[#2a5c4f] transition-all duration-300 shadow-elegant hover:shadow-elegant-lg transform hover:scale-[1.02] min-h-[44px]">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: TRUST & CREDIBILITY */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3c34] text-center mb-8 sm:mb-12 md:mb-16">Why Choose CogCare's Network</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <Award className="w-10 h-10 text-[#4a7c59] mx-auto mb-4" />
              <h3 className="font-bold text-[#1a3c34] mb-2">Verified Credentials</h3>
              <p className="text-sm text-[#5c7a70]">We verify every license, degree, and certification manually.</p>
            </div>
            <div>
              <Brain className="w-10 h-10 text-[#4a7c59] mx-auto mb-4" />
              <h3 className="font-bold text-[#1a3c34] mb-2">Neuroscience-Focused</h3>
              <p className="text-sm text-[#5c7a70]">Practitioners use evidence-based brain health approaches.</p>
            </div>
            <div>
              <Users className="w-10 h-10 text-[#4a7c59] mx-auto mb-4" />
              <h3 className="font-bold text-[#1a3c34] mb-2">Real Patient Reviews</h3>
              <p className="text-sm text-[#5c7a70]">100% verified reviews from actual patients like you.</p>
            </div>
            <div>
              <ShieldCheck className="w-10 h-10 text-[#4a7c59] mx-auto mb-4" />
              <h3 className="font-bold text-[#1a3c34] mb-2">Transparent Pricing</h3>
              <p className="text-sm text-[#5c7a70]">See costs and insurance acceptance upfront.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FOR PROFESSIONALS */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-[#eff2ef]">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-16 border border-gray-200 text-center">
          <Stethoscope className="w-10 h-10 sm:w-12 sm:h-12 text-[#1a3c34] mx-auto mb-4 sm:mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3c34] mb-3 sm:mb-4">Are You a Brain Health Professional?</h2>
          <p className="text-[#5c7a70] max-w-2xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base px-2">
            Join our network and connect with patients who are already educated about brain health. 
            Receive pre-qualified referrals based on our clinical assessments.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button className="bg-gradient-to-r from-[#1a3c34] via-[#2a5c4f] to-[#1a3c34] text-white px-8 py-4 rounded-full font-bold hover:from-[#2a5c4f] hover:via-[#1a3c34] hover:to-[#2a5c4f] transition-all duration-300 shadow-elegant-xl hover:shadow-elegant-2xl transform hover:scale-[1.02]">
              Apply to Join Network
            </button>
            <button className="bg-transparent border border-[#1a3c34] text-[#1a3c34] px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-all">
              Learn About Membership
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 9: FAQ */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a3c34] text-center mb-8 sm:mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4 sm:space-y-6">
            <div className="border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="font-bold text-[#1a3c34] mb-2 text-base sm:text-lg">How do I know which specialist I need?</h3>
              <p className="text-sm text-[#5c7a70]">Take our free assessment quiz! It analyzes your symptoms and recommends the specific type of professional best suited for your needs.</p>
            </div>
            <div className="border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="font-bold text-[#1a3c34] mb-2 text-base sm:text-lg">Are these professionals licensed?</h3>
              <p className="text-sm text-[#5c7a70]">Yes. We verify all licenses, credentials, and certifications. You'll see badge indicators for different credential levels (MD, PhD, LCSW, etc.)</p>
            </div>
            <div className="border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="font-bold text-[#1a3c34] mb-2 text-base sm:text-lg">Do they accept insurance?</h3>
              <p className="text-sm text-[#5c7a70]">Many do! You can filter search results by insurance provider. Each profile clearly states insurance acceptance and out-of-pocket costs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: FINAL CTA */}
      <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-[#1a3c34] text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8 leading-tight">Ready to Find Your Specialist?</h2>
          <div className="bg-white p-1.5 sm:p-2 rounded-full max-w-xl mx-auto flex flex-col sm:flex-row gap-2">
             <input type="text" placeholder="Enter your ZIP code..." className="flex-grow px-4 sm:px-6 py-2.5 sm:py-3 rounded-full focus:outline-none text-[#1a3c34] text-sm sm:text-base"/>
             <button className="bg-gradient-to-r from-[#4a7c59] to-[#5a9c69] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold hover:from-[#3a6347] hover:to-[#4a8c59] transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02] text-sm sm:text-base whitespace-nowrap">Search</button>
          </div>
        </div>
      </section>
    </div>
  );
};

/* =========================================
   MAIN APP COMPONENT
   ========================================= */

/**
 * Programs Directory Component
 * Based on PROGRAMS_DIRECTORY_PAGE_ARCHITECTURE.md
 */
const ProgramsDirectory = ({ setActivePage }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Mock program data
  const programs = [
    {
      id: 1,
      name: "Deep Work & Cognitive Control Systems",
      price: 197,
      duration: "4 weeks",
      videoHours: 6,
      rating: 4.9,
      reviews: 2847,
      students: 2847,
      difficulty: "Beginner to Intermediate",
      bestFor: "ADHD, focus issues, task completion",
      description: "Master focus and productivity for ADHD and scattered brains",
      outcomes: [
        "Focus for 2+ hours without distraction",
        "Complete projects you start",
        "Build sustainable work systems"
      ],
      problem: "focus",
      system: "processing",
      level: "beginner",
      badges: ["Bestseller", "Updated 2026"]
    },
    {
      id: 2,
      name: "Deep Sleep Neuro-Architecture",
      price: 247,
      duration: "4 weeks",
      videoHours: 5,
      rating: 4.9,
      reviews: 3421,
      students: 3421,
      difficulty: "Beginner",
      bestFor: "Insomnia, poor sleep quality",
      description: "Transform your sleep and restore natural circadian rhythms",
      outcomes: [
        "Fall asleep in 15 minutes",
        "Sleep 7-8 hours consistently",
        "Wake up refreshed"
      ],
      problem: "sleep",
      system: "energy",
      level: "beginner",
      badges: ["Bestseller"]
    },
    {
      id: 3,
      name: "Elite Neuro-Performance Optimization",
      price: 497,
      duration: "6 weeks",
      videoHours: 8,
      rating: 4.8,
      reviews: 1234,
      students: 1234,
      difficulty: "Intermediate to Advanced",
      bestFor: "High-performers wanting optimization",
      description: "Reach peak cognitive performance and eliminate brain fog",
      outcomes: [
        "90-minute deep work blocks",
        "All-day energy consistency",
        "Peak mental clarity"
      ],
      problem: "performance",
      system: "processing",
      level: "advanced",
      badges: ["New"]
    }
  ];

  return (
    <div className="pt-14 sm:pt-16 md:pt-20">
      {/* HERO SECTION - Cold Traffic Version */}
      <section className="bg-[#eff2ef] py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a3c34] mb-4 sm:mb-6 leading-tight tracking-tight text-shadow-sm">
              Which Brain Transformation Program Matches Your Goals?
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-[#5c7a70] max-w-3xl mx-auto mb-8 sm:mb-12">
              Take our free 5-minute assessment to get a personalized recommendation
              — or browse our complete program library below.
            </p>
          </RevealOnScroll>

          {/* Dual CTA Layout */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto mb-8 sm:mb-12">
            <RevealOnScroll delay={100} className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-[#4a7c59] shadow-elegant-lg hover:shadow-elegant-xl transition-smooth transform hover:scale-[1.02]">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-3">RECOMMENDED PATH</h3>
              <p className="text-[#5c7a70] mb-4 sm:mb-6 text-sm sm:text-base">
                Not sure which program you need? Take our free quiz and we'll recommend the perfect program based on your brain profile.
              </p>
              <button 
                onClick={() => setActivePage('home')}
                className="w-full bg-gradient-to-r from-[#1a3c34] via-[#2a5c4f] to-[#1a3c34] text-white py-3 sm:py-4 rounded-full font-bold hover:from-[#2a5c4f] hover:via-[#1a3c34] hover:to-[#2a5c4f] transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02] text-sm sm:text-base"
              >
                TAKE 5-MIN QUIZ →
              </button>
              <p className="text-xs sm:text-sm text-[#5c7a70] mt-3 sm:mt-4">⭐ 247,000+ people matched</p>
            </RevealOnScroll>

            <RevealOnScroll delay={200} className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border-2 border-gray-200 shadow-elegant-lg hover:shadow-elegant-xl transition-smooth transform hover:scale-[1.02]">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-3">BROWSE PROGRAMS</h3>
              <p className="text-[#5c7a70] mb-4 sm:mb-6 text-sm sm:text-base">
                Know what you're looking for? Browse by problem, system, or outcome below.
              </p>
              <button 
                onClick={() => document.getElementById('programs-grid')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full bg-gradient-to-r from-[#4a7c59] to-[#5a9c69] text-white py-3 sm:py-4 rounded-full font-bold hover:from-[#3a6347] hover:to-[#4a8c59] transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02] text-sm sm:text-base"
              >
                SCROLL TO PROGRAMS ↓
              </button>
            </RevealOnScroll>
          </div>

          {/* Trust Bar */}
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-xs sm:text-sm text-[#5c7a70]">
            <div className="flex items-center">
              <span className="text-yellow-400 mr-1">★★★★★</span>
              <span className="font-bold">4.8/5</span>
              <span className="ml-1">12,847 reviews</span>
            </div>
            <span>•</span>
            <span>30-Day Money-Back Guarantee</span>
            <span>•</span>
            <span>Instant Access</span>
            <span>•</span>
            <span>Lifetime Updates</span>
          </div>
        </div>
      </section>

      {/* NAVIGATION TABS */}
      <section className="bg-white border-b border-gray-200 sticky top-14 sm:top-16 md:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide -mb-px">
            {[
              { id: 'all', label: 'All Programs', count: 33 },
              { id: 'problem', label: 'By Problem', count: 12 },
              { id: 'system', label: 'By System', count: 5 },
              { id: 'outcome', label: 'By Outcome', count: 8 },
              { id: 'level', label: 'By Level', count: 3 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-4 sm:py-5 text-sm sm:text-base font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#4a7c59] text-[#1a3c34] font-bold'
                    : 'border-transparent text-[#5c7a70] hover:text-[#1a3c34] hover:border-gray-300'
                }`}
              >
                {tab.label} <span className="text-xs text-gray-400">({tab.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* SEARCH BAR */}
      <section className="bg-white py-6 sm:py-8 px-4 sm:px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search programs, problems, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-full border-2 border-gray-200 focus:border-[#4a7c59] focus:outline-none text-sm sm:text-base"
            />
          </div>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <section id="programs-grid" className="bg-[#eff2ef] py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* FILTERS SIDEBAR */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm sticky top-24 sm:top-28">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="font-bold text-[#1a3c34] text-sm sm:text-base">FILTERS</h3>
                  <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden"
                  >
                    <Filter className="w-5 h-5 text-[#5c7a70]" />
                  </button>
                </div>
                
                <div className={`space-y-4 sm:space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                  {/* Price Filter */}
                  <div>
                    <h4 className="font-semibold text-[#1a3c34] mb-3 text-sm">Price</h4>
                    <div className="space-y-2 text-sm">
                      {['Free (0)', 'Under $100 (3)', '$100-$200 (18)', '$200-$500 (9)', '$500+ (3)'].map((option, idx) => (
                        <label key={idx} className="flex items-center cursor-pointer">
                          <input type="checkbox" className="mr-2" defaultChecked={idx === 2} />
                          <span className="text-[#5c7a70]">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Duration Filter */}
                  <div>
                    <h4 className="font-semibold text-[#1a3c34] mb-3 text-sm">Duration</h4>
                    <div className="space-y-2 text-sm">
                      {['Under 2 weeks (5)', '2-4 weeks (15)', '4-8 weeks (10)', '8+ weeks (3)'].map((option, idx) => (
                        <label key={idx} className="flex items-center cursor-pointer">
                          <input type="checkbox" className="mr-2" defaultChecked={idx === 1} />
                          <span className="text-[#5c7a70]">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Level Filter */}
                  <div>
                    <h4 className="font-semibold text-[#1a3c34] mb-3 text-sm">Level</h4>
                    <div className="space-y-2 text-sm">
                      {['Beginner (12)', 'Intermediate (15)', 'Advanced (6)'].map((option, idx) => (
                        <label key={idx} className="flex items-center cursor-pointer">
                          <input type="checkbox" className="mr-2" defaultChecked={idx < 2} />
                          <span className="text-[#5c7a70]">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button className="w-full text-sm text-[#4a7c59] hover:text-[#1a3c34] font-medium">
                    RESET FILTERS
                  </button>
                </div>
              </div>
            </aside>

            {/* PROGRAM CARDS GRID */}
            <div className="flex-1">
              {/* Tab-specific content */}
              {activeTab === 'problem' && (
                <div className="mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3c34] mb-6 sm:mb-8">
                    Browse By Problem - Find The Program For Your Challenge
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                    {[
                      {
                        problem: "🎯 CAN'T FOCUS OR FINISH TASKS",
                        bestFor: "ADHD, scattered attention, task-switching",
                        quiz: "Focus & Concentration Diagnostic (4 min)",
                        programs: [
                          { name: "Deep Work & Cognitive Control Systems", price: 197, rating: 4.9, students: 2847, weeks: 4, for: "moderate-severe focus issues" },
                          { name: "Elite Neuro-Performance Optimization", price: 497, rating: 4.8, students: 1234, weeks: 6, for: "high-performers wanting optimization" }
                        ],
                        totalPrograms: 5
                      },
                      {
                        problem: "😴 SLEEP PROBLEMS OR INSOMNIA",
                        bestFor: "Can't fall asleep, can't stay asleep, low energy",
                        quiz: "Sleep Quality Index (3 min)",
                        programs: [
                          { name: "Deep Sleep Neuro-Architecture", price: 247, rating: 4.9, students: 3421, weeks: 4, for: "chronic sleep issues" }
                        ],
                        totalPrograms: 3
                      }
                    ].map((category, idx) => (
                      <RevealOnScroll key={idx} delay={idx * 100} className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-gray-200 hover:border-[#4a7c59] transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02] hover:-translate-y-1">
                        <h3 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-3 sm:mb-4">{category.problem}</h3>
                        <p className="text-sm sm:text-base text-[#5c7a70] mb-3"><strong>Best for:</strong> {category.bestFor}</p>
                        <p className="text-sm sm:text-base text-[#5c7a70] mb-4 sm:mb-6"><strong>Related quiz:</strong> {category.quiz}</p>
                        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                          <p className="font-semibold text-[#1a3c34] text-sm sm:text-base">Recommended Programs:</p>
                          {category.programs.map((prog, pIdx) => (
                            <div key={pIdx} className="bg-[#eff2ef] rounded-lg p-3 sm:p-4">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <p className="font-bold text-[#1a3c34] text-sm sm:text-base">{pIdx + 1}. {prog.name}</p>
                                  <p className="text-xs sm:text-sm text-[#5c7a70]">${prog.price} | {prog.weeks} weeks | {prog.students.toLocaleString()} students</p>
                                </div>
                                <div className="flex items-center ml-2">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-xs sm:text-sm font-bold ml-1">{prog.rating}</span>
                                </div>
                              </div>
                              <p className="text-xs sm:text-sm text-[#5c7a70]">→ For {prog.for}</p>
                            </div>
                          ))}
                        </div>
                        <button className="w-full bg-gradient-to-r from-[#4a7c59] to-[#5a9c69] text-white py-2.5 sm:py-3 rounded-full font-bold hover:from-[#3a6347] hover:to-[#4a8c59] transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02] text-sm sm:text-base">
                          VIEW ALL {category.problem.split(' ')[1]} PROGRAMS ({category.totalPrograms}) →
                        </button>
                      </RevealOnScroll>
                    ))}
                  </div>
                  <div className="mt-8 sm:mt-12 text-center bg-[#eff2ef] rounded-xl sm:rounded-2xl p-6 sm:p-8">
                    <h3 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">NOT SURE WHICH PROBLEM YOU HAVE?</h3>
                    <p className="text-[#5c7a70] mb-6 text-sm sm:text-base">
                      Get a full diagnosis across all 5 brain systems and discover which programs will help you most.
                    </p>
                    <button 
                      onClick={() => setActivePage('home')}
                      className="bg-[#1a3c34] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-[#2a5c4f] transition-colors text-sm sm:text-base"
                    >
                      TAKE THE COMPREHENSIVE BRAIN WELLNESS QUIZ (15 MIN) →
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'all' && (
                <>
                  {/* Sort and View Toggle */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                    <p className="text-sm sm:text-base text-[#5c7a70]">
                      Showing {programs.length} programs
                    </p>
                <div className="flex items-center gap-4">
                  <select className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#4a7c59]">
                    <option>Sort by: Recommended</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Rating</option>
                    <option>Newest</option>
                  </select>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-[#4a7c59] text-white' : 'bg-white text-gray-600'}`}
                    >
                      <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                        <div className="bg-current"></div>
                        <div className="bg-current"></div>
                        <div className="bg-current"></div>
                        <div className="bg-current"></div>
                      </div>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-[#4a7c59] text-white' : 'bg-white text-gray-600'}`}
                    >
                      <div className="w-4 h-4 flex flex-col gap-0.5">
                        <div className="h-0.5 bg-current"></div>
                        <div className="h-0.5 bg-current"></div>
                        <div className="h-0.5 bg-current"></div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Program Cards */}
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
                : "space-y-6 sm:space-y-8"
              }>
                {programs.map(program => (
                  <RevealOnScroll key={program.id} className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-elegant-lg hover:shadow-elegant-xl transition-smooth transform hover:scale-[1.02] hover:-translate-y-1 border border-gray-100">
                    {/* Program Image Placeholder */}
                    <div className="relative h-48 sm:h-56 bg-gradient-to-br from-[#4a7c59] to-[#1a3c34]">
                      <div className="absolute top-3 left-3 flex gap-2">
                        {program.badges.map((badge, idx) => (
                          <span key={idx} className="bg-white/90 text-[#1a3c34] px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold">
                            {badge}
                          </span>
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center text-white/20">
                        <Play className="w-16 h-16" />
                      </div>
                    </div>

                    <div className="p-4 sm:p-6">
                      <h3 className="text-lg sm:text-xl font-bold text-[#1a3c34] mb-2">{program.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-bold text-[#1a3c34] ml-1">{program.rating}</span>
                        </div>
                        <span className="text-xs sm:text-sm text-[#5c7a70]">({program.reviews.toLocaleString()} reviews)</span>
                      </div>

                      <p className="text-sm sm:text-base text-[#5c7a70] mb-4">{program.description}</p>

                      <div className="space-y-2 mb-4 text-xs sm:text-sm">
                        <div className="flex items-center text-[#5c7a70]">
                          <span className="mr-2">💡</span>
                          <span>Best for: {program.bestFor}</span>
                        </div>
                        <div className="flex items-center text-[#5c7a70]">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>{program.duration} | {program.videoHours} hours video</span>
                        </div>
                        <div className="flex items-center text-[#5c7a70]">
                          <span className="mr-2">📊</span>
                          <span>Difficulty: {program.difficulty}</span>
                        </div>
                        <div className="flex items-center text-[#5c7a70]">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{program.students.toLocaleString()} students enrolled</span>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4 mb-4">
                        <p className="text-xs sm:text-sm font-semibold text-[#1a3c34] mb-2">What you'll achieve:</p>
                        <ul className="space-y-1 text-xs sm:text-sm text-[#5c7a70]">
                          {program.outcomes.map((outcome, idx) => (
                            <li key={idx} className="flex items-start">
                              <Check className="w-4 h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" />
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div>
                          <span className="text-2xl sm:text-3xl font-bold text-[#1a3c34]">${program.price}</span>
                        </div>
                        <button className="bg-gradient-to-r from-[#1a3c34] via-[#2a5c4f] to-[#1a3c34] text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold hover:from-[#2a5c4f] hover:via-[#1a3c34] hover:to-[#2a5c4f] transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02] text-sm sm:text-base">
                          ENROLL NOW →
                        </button>
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>

              {/* Load More / Pagination */}
              <div className="mt-8 sm:mt-12 text-center">
                <button className="bg-white border-2 border-[#4a7c59] text-[#4a7c59] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-gradient-to-r hover:from-[#4a7c59] hover:to-[#5a9c69] hover:text-white hover:border-transparent transition-all duration-300 shadow-elegant hover:shadow-elegant-lg transform hover:scale-[1.02] text-sm sm:text-base">
                  Load More Programs
                </button>
              </div>
                </>
              )}

              {/* Placeholder for other tabs */}
              {(activeTab === 'system' || activeTab === 'outcome' || activeTab === 'level') && (
                <div className="text-center py-12 sm:py-16">
                  <p className="text-lg sm:text-xl text-[#5c7a70] mb-4">
                    {activeTab === 'system' && 'Browse by Brain System - The Brain OS Framework'}
                    {activeTab === 'outcome' && 'Browse by Outcome - What Do You Want to Achieve?'}
                    {activeTab === 'level' && 'Browse by Level - Match Your Current Knowledge'}
                  </p>
                  <p className="text-sm sm:text-base text-[#5c7a70] mb-6">
                    This section is coming soon. Browse all programs above in the meantime.
                  </p>
                  <button 
                    onClick={() => setActiveTab('all')}
                    className="bg-gradient-to-r from-[#4a7c59] to-[#5a9c69] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:from-[#3a6347] hover:to-[#4a8c59] transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02] text-sm sm:text-base"
                  >
                    VIEW ALL PROGRAMS
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="bg-white py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#1a3c34] mb-8 sm:mb-12 tracking-tight text-shadow-sm">
            Student Success Stories
          </h2>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {[
              {
                name: "Sarah M.",
                role: "Marketing Director",
                quote: "I've had ADHD my whole life but was only diagnosed at 34. This program gave me the systems I needed to finally feel in control. I'm completing projects, meeting deadlines, and my boss noticed the difference.",
                program: "Deep Work & Cognitive Control Systems",
                result: "10X productivity improvement in 4 weeks"
              },
              {
                name: "Michael R.",
                role: "Software Engineer",
                quote: "I was skeptical about online programs but this exceeded expectations. Not just theory—actual protocols I use every day. Went from 3-4 hours of focus per day to 7-8.",
                program: "Elite Neuro-Performance Optimization",
                result: "Doubled productive hours, eliminated crashes"
              }
            ].map((testimonial, idx) => (
              <RevealOnScroll key={idx} delay={idx * 100} className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200 hover:border-[#4a7c59] shadow-elegant hover:shadow-elegant-lg transition-smooth transform hover:scale-[1.02] hover:-translate-y-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#1a3c34] via-[#2a5c4f] to-[#1a3c34] rounded-full flex items-center justify-center text-white font-bold mr-3 sm:mr-4 text-sm sm:text-base shadow-elegant">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[#1a3c34] text-sm sm:text-base">{testimonial.name}</p>
                    <p className="text-xs sm:text-sm text-[#5c7a70]">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3 sm:mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-[#1a3c34] text-sm sm:text-base md:text-lg italic leading-relaxed mb-4">
                  "{testimonial.quote}"
                </p>
                <div className="text-xs sm:text-sm text-[#5c7a70] space-y-1">
                  <p><strong>Program:</strong> {testimonial.program}</p>
                  <p><strong>Result:</strong> {testimonial.result}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* BUNDLES SECTION */}
      <section className="bg-[#eff2ef] py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#1a3c34] mb-4 sm:mb-6">
            Program Bundles - Save Up to 40%
          </h2>
          <p className="text-center text-[#5c7a70] mb-8 sm:mb-12 text-sm sm:text-base">
            Everything you need for total brain transformation
          </p>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              {
                badge: "Most Popular",
                save: 488,
                name: "THE COMPLETE BRAIN OPTIMIZATION BUNDLE",
                rating: 4.9,
                reviews: 847,
                programs: [
                  "Deep Work & Cognitive Control ($197)",
                  "Deep Sleep Neuro-Architecture ($247)",
                  "Vagus Nerve & Nervous System Reset ($197)",
                  "Neuro-Nutrition Masterclass ($297)",
                  "The Brain Longevity Blueprint ($247)"
                ],
                totalValue: 1185,
                bundlePrice: 697,
                bonus: "1 free consultation session ($297 value)",
                perfectFor: "Anyone serious about comprehensive brain health transformation"
              },
              {
                badge: "Best Value",
                save: 344,
                name: "THE FOCUS & PRODUCTIVITY BUNDLE",
                rating: 4.8,
                reviews: 423,
                programs: [
                  "Deep Work & Cognitive Control ($197)",
                  "The Neuroscience of Behavior Change ($247)",
                  "Elite Neuro-Performance Optimization ($497)"
                ],
                totalValue: 941,
                bundlePrice: 597,
                perfectFor: "Master focus, eliminate distraction, achieve peak output"
              }
            ].map((bundle, idx) => (
              <RevealOnScroll key={idx} delay={idx * 100} className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-[#4a7c59] shadow-elegant-xl hover:shadow-elegant-2xl transition-smooth transform hover:scale-[1.01] relative overflow-hidden">
                <div className="absolute top-0 left-0 bg-[#4a7c59] text-white px-3 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-xs font-bold rounded-br-lg">
                  {bundle.badge}
                </div>
                <div className="absolute top-0 right-0 bg-yellow-400 text-[#1a3c34] px-3 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-xs font-bold rounded-bl-lg">
                  Save ${bundle.save}
                </div>
                <div className="mt-6 sm:mt-8">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1a3c34] mb-3 sm:mb-4">{bundle.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-bold text-[#1a3c34] ml-1">{bundle.rating}</span>
                    </div>
                    <span className="text-xs sm:text-sm text-[#5c7a70]">({bundle.reviews} reviews)</span>
                  </div>
                  <p className="text-sm sm:text-base text-[#5c7a70] mb-4 sm:mb-6">{bundle.perfectFor}</p>
                  <div className="bg-[#eff2ef] rounded-lg p-4 sm:p-5 mb-4 sm:mb-6">
                    <p className="font-bold text-[#1a3c34] mb-3 text-sm sm:text-base">INCLUDES {bundle.programs.length} PROGRAMS:</p>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#5c7a70]">
                      {bundle.programs.map((prog, pIdx) => (
                        <li key={pIdx} className="flex items-start">
                          <Check className="w-4 h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" />
                          <span>{prog}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm text-[#5c7a70] mb-1">TOTAL VALUE: <span className="line-through">${bundle.totalValue}</span></p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#1a3c34] mb-1">
                      BUNDLE PRICE: ${bundle.bundlePrice}
                      <span className="text-base sm:text-lg text-[#4a7c59] ml-2">
                        (Save ${bundle.save} - {Math.round((bundle.save / bundle.totalValue) * 100)}% off)
                      </span>
                    </p>
                    {bundle.bonus && (
                      <p className="text-xs sm:text-sm text-[#4a7c59] font-semibold">BONUS: {bundle.bonus}</p>
                    )}
                  </div>
                  <button className="w-full bg-gradient-to-r from-[#1a3c34] via-[#2a5c4f] to-[#1a3c34] text-white py-3 sm:py-4 rounded-full font-bold hover:from-[#2a5c4f] hover:via-[#1a3c34] hover:to-[#2a5c4f] transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02] text-sm sm:text-base mb-2">
                    ENROLL IN BUNDLE - ${bundle.bundlePrice} →
                  </button>
                  <p className="text-xs text-center text-[#5c7a70]">Payment plans available: 3 × ${Math.round(bundle.bundlePrice / 3)}/month</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-white py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-[#1a3c34] mb-8 sm:mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 sm:space-y-6">
            {[
              {
                q: "How do I know which program is right for me?",
                a: "We recommend taking our free 5-minute quiz first. It will assess your symptoms, brain patterns, and goals, then recommend the specific program(s) best suited for your needs. If you prefer to browse, look at the 'Best For' description on each program card—it will tell you exactly who that program is designed for."
              },
              {
                q: "What if I buy the wrong program?",
                a: "All programs come with a 30-day money-back guarantee. If you realize the program isn't the right fit, just email us within 30 days for a full refund—no questions asked. We can also help you switch to a different program if needed."
              },
              {
                q: "How long do I have access to the program?",
                a: "Lifetime access. Once you enroll, the program is yours forever, including all future updates and additions."
              },
              {
                q: "Are these programs live or self-paced?",
                a: "All programs are 100% self-paced. Learn on your own schedule—pause, rewind, rewatch as many times as you need. Some programs include optional live Q&A sessions or community calls, but attendance is never required."
              },
              {
                q: "Can I take multiple programs at once?",
                a: "Absolutely! Many students take 2-3 programs simultaneously. However, we recommend starting with one program and adding others once you've established a routine. Our bundles are perfect if you know you want to work on multiple areas."
              },
              {
                q: "I've tried supplements, therapy, and 50 productivity apps. Why would THIS be different?",
                a: "Because you never diagnosed the root cause. You treated symptoms. Think about it: If you have low baseline dopamine (rapid depletion pattern), no amount of 'focus apps' will work. You're trying to willpower your way through a biological deficit. Our quiz maps your SPECIFIC neurochemical pattern—most people discover they've been optimizing the WRONG system. Example: You tried focus techniques, but your real issue was elevated cortisol blocking cognition. Different problem = different solution."
              },
              {
                q: "Can I use CogCare while seeing a therapist or taking medication?",
                a: "Yes—and 80% of our users do exactly that. CogCare focuses on lifestyle optimization (light exposure, breathing, nutrition, sleep architecture) which complements medical treatment. We're NOT replacing therapy or medication. We're optimizing the biological foundation that makes them work better. ⚠️ Always consult your provider before major lifestyle changes, especially if you're on psychiatric medications that affect neurotransmitter systems."
              },
              {
                q: "What if my quiz results don't match how I feel?",
                a: "Email us within 7 days for manual clinical review. ~5% of users need assessment recalibration due to: comorbid conditions (ADHD + anxiety, for example), medication effects masking underlying patterns, or atypical circadian rhythms (shift workers, etc.). Our clinical team will review your results and either: (a) Adjust your cognitive profile, or (b) Refund you completely if we can't provide accurate assessment."
              },
              {
                q: "Is this just another wellness scam?",
                a: "Fair question. Here's how we're different: 🔬 Peer-Reviewed Science - Every protocol is based on published neuroscience research. 👨‍⚕️ Clinical Oversight - Protocols reviewed by board-certified neurologists & psychiatrists. 📊 Measurable Outcomes - Your score is tracked monthly. If it doesn't improve, we investigate why. 💰 Money-Back Guarantee - 30 days. No questions asked. Full refund. We're not selling magic pills or miracle cures. We're teaching you how to optimize the biological systems that govern cognition."
              },
              {
                q: "How is this different from Lumosity/BrainHQ/Peak?",
                a: "Brain training games vs. biological optimization. Brain Training Apps: Focus on cognitive exercises (games, puzzles), goal is to improve performance on THOSE specific games, transfer effect is minimal (Florida State study: Portal 2 outperformed Lumosity). CogCare: Focus on neurochemical system optimization, goal is to fix underlying biology that enables ALL cognitive tasks, transfer effect improves focus, energy, mood across your entire life. Analogy: Brain training = practicing free throws. CogCare = fixing your vision, strength, and balance."
              },
              {
                q: "What if I don't have time for a complicated protocol?",
                a: "Our minimum effective dose is 15 minutes/day. Week 1 Protocol Example: Morning (10 min): Walk outside (sunlight exposure), Midday (2 min): Box breathing between meetings, Evening (3 min): Blue light reduction routine. Total: 15 minutes. Most people naturally expand this as they feel benefits, but you can see measurable improvement with just the basics."
              },
              {
                q: "Is my data private? Do you sell it?",
                a: "Your data is private. We NEVER sell it. Period. Bank-level AES-256 encryption, no advertising partners, no third-party data sharing, you can download or delete your data anytime. We make money from subscriptions, not from selling your information."
              },
              {
                q: "What results can I realistically expect?",
                a: "Based on 247,000+ user cohort: Week 2: 67% report improved morning energy, easier task initiation. Week 4: 73% achieve 45-min+ focus blocks (vs. 15-20 min baseline). Week 8: 81% report sustained improvement in baseline mood/motivation. But: Results require protocol adherence. 90% adherence → 3.2x better outcomes than 50% adherence. If you're not willing to actually DO the protocols, this won't work. We're optimizing biology, not selling magic."
              },
              {
                q: "Can this help with ADHD/depression/anxiety?",
                a: "It depends. CogCare can help with: ✓ Subclinical symptoms ('I'm functional but struggling'), ✓ Optimizing biology while on medication, ✓ Lifestyle factors that exacerbate clinical conditions. CogCare CANNOT replace: ✗ Clinical diagnosis by psychiatrist/psychologist, ✗ Medication for moderate-to-severe conditions, ✗ Therapy for trauma, emotional processing. If you have diagnosed ADHD/depression/anxiety: → CogCare works ALONGSIDE treatment, not instead of it. → Many users find their medication works BETTER when biology is optimized."
              },
              {
                q: "Do you take insurance?",
                a: "Not directly, but we provide documentation for reimbursement. Many HSA/FSA plans cover 'wellness programs' and 'preventive health.' We provide: Itemized receipt (required for HSA/FSA), detailed program description, clinical rationale documentation. Success rate: ~60% of users who submit get partial or full reimbursement."
              }
            ].map((faq, idx) => (
              <RevealOnScroll key={idx} delay={idx * 50} className="bg-[#eff2ef] rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-200">
                <h3 className="font-bold text-[#1a3c34] mb-3 text-base sm:text-lg">{faq.q}</h3>
                <p className="text-sm sm:text-base text-[#5c7a70] leading-relaxed">{faq.a}</p>
              </RevealOnScroll>
            ))}
          </div>
          <div className="mt-8 sm:mt-12 text-center">
            <p className="text-sm sm:text-base text-[#5c7a70] mb-4">
              Still have questions?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:programs@cogcare.com" className="text-[#4a7c59] hover:text-[#1a3c34] font-semibold text-sm sm:text-base">
                📧 EMAIL US
              </a>
              <span className="hidden sm:inline text-[#5c7a70]">•</span>
              <a href="#" className="text-[#4a7c59] hover:text-[#1a3c34] font-semibold text-sm sm:text-base">
                💬 LIVE CHAT
              </a>
              <span className="hidden sm:inline text-[#5c7a70]">•</span>
              <a href="#" className="text-[#4a7c59] hover:text-[#1a3c34] font-semibold text-sm sm:text-base">
                📞 SCHEDULE CALL
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-[#1a3c34] py-12 sm:py-16 md:py-24 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8">
            Ready to Start Your Brain Transformation?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-2xl mx-auto">
            <button 
              onClick={() => setActivePage('home')}
              className="bg-white text-[#1a3c34] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              🎯 GET PERSONALIZED MATCH
            </button>
            <button 
              onClick={() => document.getElementById('programs-grid')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-[#4a7c59] to-[#5a9c69] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:from-[#3a6347] hover:to-[#4a8c59] transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02] text-sm sm:text-base"
            >
              📚 BROWSE ALL PROGRAMS
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

/* =========================================
   ASSESSMENTS PAGE COMPONENT
   ========================================= */
const AssessmentsPage = ({ setActivePage }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  const categories = [
    { id: 'all', name: 'All Assessments', count: 74 },
    { id: 'focus', name: 'Focus & Attention', count: 12 },
    { id: 'sleep', name: 'Sleep & Energy', count: 8 },
    { id: 'anxiety', name: 'Anxiety & Stress', count: 15 },
    { id: 'mood', name: 'Mood & Depression', count: 10 },
    { id: 'memory', name: 'Memory & Learning', count: 9 },
    { id: 'performance', name: 'Peak Performance', count: 10 }
  ];

  const assessmentTypes = [
    { id: 'all', name: 'All Types' },
    { id: 'quick', name: 'Quick Diagnostics (3-5 min)' },
    { id: 'system', name: 'System Assessments (8-12 min)' },
    { id: 'comprehensive', name: 'Comprehensive (15+ min)' }
  ];

  const assessments = [
    {
      id: 1,
      title: "Focus & Concentration Diagnostic",
      category: 'focus',
      type: 'quick',
      duration: "4 min",
      description: "Identify why you can't stay on task or finish projects",
      icon: Target,
      color: "red",
      questions: 12,
      completed: 12450,
      rating: 4.9,
      bestFor: "ADHD, scattered attention, task-switching"
    },
    {
      id: 2,
      title: "Sleep Quality Index",
      category: 'sleep',
      type: 'quick',
      duration: "3 min",
      description: "Evaluate your sleep patterns and circadian rhythm health",
      icon: Moon,
      color: "indigo",
      questions: 10,
      completed: 18920,
      rating: 4.8,
      bestFor: "Insomnia, poor sleep quality, low energy"
    },
    {
      id: 3,
      title: "Anxiety Type Assessment",
      category: 'anxiety',
      type: 'quick',
      duration: "5 min",
      description: "Discover your specific anxiety pattern and triggers",
      icon: Activity,
      color: "orange",
      questions: 15,
      completed: 21560,
      rating: 4.9,
      bestFor: "Generalized anxiety, panic, worry patterns"
    },
    {
      id: 4,
      title: "Brain Fog Detector",
      category: 'focus',
      type: 'quick',
      duration: "4 min",
      description: "Identify the root causes of mental clarity issues",
      icon: CloudFog,
      color: "gray",
      questions: 12,
      completed: 9870,
      rating: 4.7,
      bestFor: "Mental clarity, cognitive decline, brain fog"
    },
    {
      id: 5,
      title: "Energy Optimization Assessment",
      category: 'sleep',
      type: 'quick',
      duration: "3 min",
      description: "Evaluate your energy patterns and metabolic health",
      icon: Battery,
      color: "yellow",
      questions: 10,
      completed: 11230,
      rating: 4.8,
      bestFor: "Chronic fatigue, low energy, energy crashes"
    },
    {
      id: 6,
      title: "Mood Regulation Check",
      category: 'mood',
      type: 'quick',
      duration: "4 min",
      description: "Assess your emotional stability and mood patterns",
      icon: Smile,
      color: "blue",
      questions: 12,
      completed: 15680,
      rating: 4.8,
      bestFor: "Depression, mood swings, emotional instability"
    },
    {
      id: 7,
      title: "Cognitive Performance System",
      category: 'performance',
      type: 'system',
      duration: "10 min",
      description: "Comprehensive evaluation of all cognitive systems",
      icon: Brain,
      color: "purple",
      questions: 35,
      completed: 8750,
      rating: 4.9,
      bestFor: "Peak performance, executive function, cognitive optimization"
    },
    {
      id: 8,
      title: "Emotional Brain Assessment",
      category: 'anxiety',
      type: 'system',
      duration: "12 min",
      description: "Deep dive into emotional regulation and processing",
      icon: Heart,
      color: "pink",
      questions: 40,
      completed: 10240,
      rating: 4.8,
      bestFor: "Emotional regulation, trauma, emotional processing"
    },
    {
      id: 9,
      title: "Brain-Body Connection",
      category: 'performance',
      type: 'system',
      duration: "8 min",
      description: "Evaluate the connection between physical and mental health",
      icon: Activity,
      color: "green",
      questions: 28,
      completed: 6540,
      rating: 4.7,
      bestFor: "Physical health impact on cognition, holistic wellness"
    },
    {
      id: 10,
      title: "Memory & Learning Profile",
      category: 'memory',
      type: 'system',
      duration: "10 min",
      description: "Assess your memory systems and learning patterns",
      icon: Brain,
      color: "teal",
      questions: 32,
      completed: 7890,
      rating: 4.8,
      bestFor: "Memory issues, learning difficulties, cognitive decline"
    },
    {
      id: 11,
      title: "Comprehensive Brain Wellness Quiz",
      category: 'all',
      type: 'comprehensive',
      duration: "15 min",
      description: "Complete analysis across all 5 brain systems",
      icon: Brain,
      color: "dark",
      questions: 60,
      completed: 34210,
      rating: 4.9,
      bestFor: "Full brain health evaluation, comprehensive diagnosis"
    },
    {
      id: 12,
      title: "Peak Performance Assessment",
      category: 'performance',
      type: 'comprehensive',
      duration: "18 min",
      description: "Elite-level cognitive optimization evaluation",
      icon: TrendingUp,
      color: "gold",
      questions: 70,
      completed: 5670,
      rating: 4.9,
      bestFor: "High-performers, executives, optimization seekers"
    }
  ];

  const colorClasses = {
    red: { bg: 'bg-red-100', text: 'text-red-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-600' },
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-600' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
    pink: { bg: 'bg-pink-100', text: 'text-pink-600' },
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    teal: { bg: 'bg-teal-100', text: 'text-teal-600' },
    dark: { bg: 'bg-gray-800', text: 'text-white' },
    gold: { bg: 'bg-yellow-200', text: 'text-yellow-800' }
  };

  const filteredAssessments = assessments.filter(assessment => {
    const matchesSearch = assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assessment.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || assessment.category === selectedCategory;
    const matchesType = selectedType === 'all' || assessment.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const popularAssessments = assessments.filter(a => a.completed > 15000).slice(0, 6);

  return (
    <div className="pt-14 sm:pt-16 md:pt-20">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#eff2ef] via-white to-[#eff2ef] py-12 sm:py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-white/80 via-[#dce6dc]/50 to-[#c8d9c8]/30 rounded-full blur-[100px] opacity-80 animate-pulse pointer-events-none" />
        <RevealOnScroll className="z-10 max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a3c34] mb-4 sm:mb-6 leading-tight">
            Discover Your Brain's Hidden Patterns
          </h1>
          <div className="max-w-4xl mx-auto mb-6 sm:mb-8 text-left">
            <MedicalDisclaimer />
            <PrivacyBanner setActivePage={setActivePage} />
          </div>
          <p className="text-[#5c7a70] text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 sm:mb-10">
            Take science-backed assessments to understand your cognitive type, identify issues, and get personalized recommendations.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-[#5c7a70]">
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
              <span>4.8/5 average rating</span>
            </div>
            <span>•</span>
            <span>247,000+ assessments completed</span>
            <span>•</span>
            <span>74 specialized assessments</span>
          </div>
        </RevealOnScroll>
      </section>

      {/* SEARCH & FILTERS */}
      <section className="bg-white border-b border-gray-200 sticky top-14 sm:top-16 md:top-20 z-30 py-4 sm:py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search assessments by name or topic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-full border-2 border-gray-200 focus:border-[#4a7c59] focus:outline-none text-sm sm:text-base"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 sm:px-6 py-3 sm:py-4 rounded-full border-2 border-gray-200 focus:border-[#4a7c59] focus:outline-none text-sm sm:text-base bg-white"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.count})
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 sm:px-6 py-3 sm:py-4 rounded-full border-2 border-gray-200 focus:border-[#4a7c59] focus:outline-none text-sm sm:text-base bg-white"
            >
              {assessmentTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* POPULAR ASSESSMENTS */}
      <section className="bg-[#eff2ef] py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3c34] mb-6 sm:mb-8">Most Popular Assessments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
            {popularAssessments.map(assessment => {
              const IconComponent = assessment.icon;
              return (
                <RevealOnScroll
                  key={assessment.id}
                  className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-200 shadow-elegant-lg hover:shadow-elegant-xl transition-smooth transform hover:scale-[1.02] hover:-translate-y-1 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 sm:w-14 sm:h-14 ${colorClasses[assessment.color]?.bg || 'bg-gray-100'} rounded-xl flex items-center justify-center`}>
                      <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 ${colorClasses[assessment.color]?.text || 'text-gray-600'}`} />
                    </div>
                    <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{assessment.duration}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#1a3c34] mb-2 group-hover:text-[#4a7c59] transition-colors">
                    {assessment.title}
                  </h3>
                  <p className="text-sm text-[#5c7a70] mb-4">{assessment.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{assessment.questions} questions</span>
                    <span>{assessment.completed.toLocaleString()} completed</span>
                  </div>
                  <button className="w-full bg-gradient-to-r from-[#4a7c59] to-[#5a9c69] text-white px-4 py-2.5 rounded-full font-bold hover:from-[#3a6347] hover:to-[#4a8c59] transition-all duration-300 shadow-elegant hover:shadow-elegant-lg transform hover:scale-[1.02] text-sm">
                    START ASSESSMENT →
                  </button>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ALL ASSESSMENTS GRID */}
      <section className="bg-white py-8 sm:py-12 md:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3c34]">
              All Assessments
            </h2>
            <p className="text-sm text-[#5c7a70]">
              Showing {filteredAssessments.length} of {assessments.length} assessments
            </p>
          </div>

          {filteredAssessments.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#1a3c34] mb-2">No assessments found</h3>
              <p className="text-[#5c7a70] mb-6">Try adjusting your search or filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                }}
                className="bg-gradient-to-r from-[#4a7c59] to-[#5a9c69] text-white px-6 py-3 rounded-full font-bold hover:from-[#3a6347] hover:to-[#4a8c59] transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredAssessments.map(assessment => {
                const IconComponent = assessment.icon;
                return (
                  <RevealOnScroll
                    key={assessment.id}
                    className="bg-[#eff2ef] rounded-xl sm:rounded-2xl p-5 sm:p-6 border border-gray-200 hover:border-[#4a7c59] shadow-elegant hover:shadow-elegant-lg transition-smooth transform hover:scale-[1.02] hover:-translate-y-1 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 ${colorClasses[assessment.color]?.bg || 'bg-gray-100'} rounded-xl flex items-center justify-center`}>
                        <IconComponent className={`w-6 h-6 sm:w-7 sm:h-7 ${colorClasses[assessment.color]?.text || 'text-gray-600'}`} />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-bold bg-white text-gray-600 px-2 py-1 rounded-full">{assessment.duration}</span>
                        {assessment.type === 'comprehensive' && (
                          <span className="text-[10px] font-bold bg-[#4a7c59] text-white px-2 py-0.5 rounded-full">COMPREHENSIVE</span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#1a3c34] mb-2 group-hover:text-[#4a7c59] transition-colors">
                      {assessment.title}
                    </h3>
                    <p className="text-sm text-[#5c7a70] mb-4">{assessment.description}</p>
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-[#1a3c34] mb-1">Best For:</p>
                      <p className="text-xs text-[#5c7a70]">{assessment.bestFor}</p>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                        <span>{assessment.rating}</span>
                      </div>
                      <span>{assessment.questions} questions</span>
                      <span>{assessment.completed.toLocaleString()} completed</span>
                    </div>
                    <button className="w-full bg-white border-2 border-[#4a7c59] text-[#4a7c59] px-4 py-2.5 rounded-full font-bold hover:bg-gradient-to-r hover:from-[#4a7c59] hover:to-[#5a9c69] hover:text-white hover:border-transparent transition-all duration-300 shadow-elegant hover:shadow-elegant-lg transform hover:scale-[1.02] text-sm">
                      START ASSESSMENT →
                    </button>
                  </RevealOnScroll>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* COMPREHENSIVE QUIZ CTA */}
      <section className="bg-gradient-to-r from-[#1a3c34] to-[#2a5c4f] py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Brain className="w-16 h-16 sm:w-20 sm:h-20 text-white mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Need a Complete Brain Health Analysis?
          </h2>
          <p className="text-white/90 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto">
            Take our Comprehensive Brain Wellness Quiz for a full evaluation across all 5 brain systems. Get personalized recommendations for programs and specialists.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 mb-8 inline-block">
            <p className="text-white text-sm sm:text-base mb-2">Assessment Details:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-white text-xs sm:text-sm">
              <div>
                <p className="font-bold text-lg sm:text-xl">60</p>
                <p className="text-white/80">Questions</p>
              </div>
              <div>
                <p className="font-bold text-lg sm:text-xl">15 min</p>
                <p className="text-white/80">Duration</p>
              </div>
              <div>
                <p className="font-bold text-lg sm:text-xl">5</p>
                <p className="text-white/80">Systems</p>
              </div>
              <div>
                <p className="font-bold text-lg sm:text-xl">34K+</p>
                <p className="text-white/80">Completed</p>
              </div>
            </div>
          </div>
          <button className="bg-white text-[#1a3c34] px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-xl text-base sm:text-lg">
            START COMPREHENSIVE QUIZ →
          </button>
          <p className="text-white/70 text-xs sm:text-sm mt-4">Free • No sign-up required • Instant results</p>
        </div>
      </section>
    </div>
  );
};

/* =========================================
   CERTIFICATION PAGE COMPONENT
   ========================================= */
const CertificationPage = ({ setActivePage }) => {
  const [selectedProgram, setSelectedProgram] = useState(null);

  const certificationPrograms = [
    {
      id: 1,
      name: "CogCare Certified Brain Health Trainer",
      level: "Foundation",
      duration: "8 weeks",
      price: 997,
      priceRange: "997-1,997",
      paymentPlan: "3 × $349/month",
      description: "Become a certified trainer in brain health transformation protocols",
      bestFor: "Caregivers, coaches, wellness professionals",
      includes: [
        "Complete CogCare methodology training",
        "Access to all 33 core programs",
        "Certification exam and credential",
        "Assessment tools and protocol templates",
        "Client dashboard access",
        "Trainer dashboard and resources",
        "Marketing support and listing",
        "Ongoing continuing education",
        "Monthly case consultation",
        "Private community access"
      ],
      outcomes: [
        "Certified to deliver CogCare programs",
        "Listed in professional directory",
        "Access to client management tools",
        "Revenue sharing opportunities"
      ],
      curriculum: [
        { week: 1, topic: "Introduction to Brain Systems & Cognitive Health" },
        { week: 2, topic: "Assessment & Diagnostic Protocols" },
        { week: 3, topic: "Focus & Attention Training Methods" },
        { week: 4, topic: "Sleep & Energy Optimization" },
        { week: 5, topic: "Anxiety & Stress Management" },
        { week: 6, topic: "Memory & Learning Enhancement" },
        { week: 7, topic: "Client Coaching & Implementation" },
        { week: 8, topic: "Certification Exam & Business Setup" }
      ]
    },
    {
      id: 2,
      name: "Advanced Specialist Certification",
      level: "Advanced",
      duration: "12 weeks",
      price: 1997,
      priceRange: "997-1,997",
      paymentPlan: "4 × $524/month",
      description: "Advanced certification for licensed professionals (MD, PhD, LCSW, etc.)",
      bestFor: "Licensed therapists, psychiatrists, psychologists",
      includes: [
        "All Foundation program benefits",
        "Clinical application protocols",
        "Medication integration training",
        "Complex case management",
        "Insurance billing support",
        "Premium directory placement",
        "1:1 mentorship sessions",
        "Research access"
      ],
      outcomes: [
        "Advanced certification credential",
        "Featured specialist status",
        "Higher revenue share (80%)",
        "Clinical case consultation access"
      ],
      curriculum: [
        { week: 1, topic: "Clinical Foundations & Evidence Base" },
        { week: 2, topic: "Differential Diagnosis & Assessment" },
        { week: 3, topic: "Integration with Traditional Treatment" },
        { week: 4, topic: "Medication & Protocol Coordination" },
        { week: 5, topic: "Complex Comorbidity Management" },
        { week: 6, topic: "Trauma-Informed Approaches" },
        { week: 7, topic: "Advanced Coaching Techniques" },
        { week: 8, topic: "Ethics & Professional Standards" },
        { week: 9, topic: "Business Development & Marketing" },
        { week: 10, topic: "Case Studies & Practice" },
        { week: 11, topic: "Supervision & Consultation" },
        { week: 12, topic: "Advanced Certification Exam" }
      ]
    }
  ];

  const benefits = [
    {
      icon: Award,
      title: "Industry-Recognized Certification",
      description: "Earn a credential recognized by healthcare and wellness organizations"
    },
    {
      icon: Users,
      title: "Access to Client Network",
      description: "Get matched with clients seeking certified brain health trainers"
    },
    {
      icon: TrendingUp,
      title: "Revenue Opportunities",
      description: "Earn income through consultations, programs, and client referrals"
    },
    {
      icon: Brain,
      title: "Cutting-Edge Training",
      description: "Learn the latest neuroscience-based protocols and methodologies"
    },
    {
      icon: ShieldCheck,
      title: "Ongoing Support",
      description: "Access to continuing education, resources, and community"
    },
    {
      icon: Zap,
      title: "Marketing Support",
      description: "Get featured in our directory with professional profile and branding"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Martinez, LCSW",
      role: "Certified Brain Health Trainer",
      quote: "The certification program transformed my practice. I now have evidence-based tools that actually work, and my clients see real results. The ongoing support is invaluable.",
      result: "Doubled client base in 6 months"
    },
    {
      name: "Michael Chen, Certified Coach",
      role: "Wellness Professional",
      quote: "As a caregiver, I wanted to help others but didn't have the clinical background. This program gave me the knowledge and credentials to make a real difference.",
      result: "Started private practice, 50+ clients"
    },
    {
      name: "Dr. James Wilson, MD",
      role: "Psychiatrist",
      quote: "The advanced certification allowed me to integrate these protocols with my medical practice. My patients love the holistic approach, and outcomes have improved significantly.",
      result: "40% improvement in patient outcomes"
    }
  ];

  const [expandedFaq, setExpandedFaq] = useState(null);
  const [faqSearch, setFaqSearch] = useState('');
  
  const faqs = [
    {
      q: "Who is this certification program for?",
      a: "The Foundation program is ideal for caregivers, coaches, wellness professionals, and anyone passionate about brain health. The Advanced program is designed for licensed professionals (MD, PhD, LCSW, LPC, etc.) who want to integrate these protocols into clinical practice."
    },
    {
      q: "What are the prerequisites?",
      a: "Foundation: No formal prerequisites, but a background in healthcare, coaching, or wellness is helpful. Advanced: Requires a current license (MD, DO, PhD, PsyD, LCSW, LPC, LMFT, or equivalent)."
    },
    {
      q: "How long does certification take?",
      a: "Foundation: 8 weeks of training + certification exam. Advanced: 12 weeks of training + advanced exam. Both programs are self-paced with weekly live sessions."
    },
    {
      q: "What happens after I'm certified?",
      a: "You'll be listed in our professional directory, get access to client referrals, can create and sell programs (with revenue sharing), and have access to ongoing training and support."
    },
    {
      q: "Is there ongoing support after certification?",
      a: "Yes! Certified trainers get access to monthly continuing education sessions, a private community, case consultation, and updates on new protocols and research."
    },
    {
      q: "What's the revenue potential?",
      a: "Certified trainers can earn through: 1) Consultation bookings (70-80% revenue share), 2) Program sales (70-80% revenue share), 3) Client referrals. Many trainers earn $50K-$150K+ annually."
    }
  ];

  return (
    <div className="pt-14 sm:pt-16 md:pt-20">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#1a3c34] via-[#2a5c4f] to-[#1a3c34] py-16 sm:py-20 md:py-24 px-4 sm:px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] opacity-50 pointer-events-none" />
        <RevealOnScroll className="z-10 max-w-6xl mx-auto text-center">
          <Award className="w-16 h-16 sm:w-20 sm:h-20 text-white mx-auto mb-6" />
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Become a Certified Brain Health Trainer
          </h1>
          <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-8 sm:mb-10">
            Join a network of certified professionals transforming lives through evidence-based brain health protocols. 
            Get the training, credentials, and support you need to build a successful practice.
          </p>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 max-w-2xl mx-auto">
            <p className="text-sm sm:text-base text-white/90 mb-2">
              <strong className="text-white">CogCare Practitioner Certification</strong> - For coaches, therapists, trainers who want to use our methodology
            </p>
            <p className="text-xs sm:text-sm text-white/80">
              Includes: Assessment tools, protocol templates, client dashboard access, and ongoing support
            </p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-xs sm:text-sm text-white/80">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-[#4a7c59] mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Industry-recognized certification</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-[#4a7c59] mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Revenue opportunities</span>
            </div>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-[#4a7c59] mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Ongoing support</span>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* BENEFITS SECTION */}
      <section className="bg-white py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a3c34] mb-4 sm:mb-6">
              Why Get Certified?
            </h2>
            <p className="text-[#5c7a70] text-base sm:text-lg max-w-2xl mx-auto">
              Join a growing community of certified professionals making a real difference
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {benefits.map((benefit, idx) => {
              const IconComponent = benefit.icon;
              return (
                <RevealOnScroll key={idx} delay={idx * 100} className="bg-[#eff2ef] rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-[#4a7c59] transition-all">
                  <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 text-[#4a7c59] mb-4" />
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-3">{benefit.title}</h3>
                  <p className="text-[#5c7a70] text-sm sm:text-base">{benefit.description}</p>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* CERTIFICATION PROGRAMS */}
      <section className="bg-[#eff2ef] py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a3c34] mb-4 sm:mb-6">
              Choose Your Certification Path
            </h2>
            <p className="text-[#5c7a70] text-base sm:text-lg max-w-2xl mx-auto">
              Two comprehensive programs designed for different professional backgrounds
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 max-w-6xl mx-auto">
            {certificationPrograms.map((program, idx) => (
              <RevealOnScroll
                key={program.id}
                delay={idx * 100}
                className={`bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border-2 ${
                  idx === 0 ? 'border-gray-200' : 'border-[#4a7c59]'
                } shadow-elegant-lg hover:shadow-elegant-xl transition-smooth transform hover:scale-[1.01] flex flex-col relative`}
              >
                {idx === 1 && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#4a7c59] text-white text-xs font-bold px-4 py-1 rounded-b-lg">
                    MOST POPULAR
                  </div>
                )}
                <div className="mb-6">
                  <span className="text-xs font-bold text-[#4a7c59] uppercase tracking-wider mb-2 block">
                    {program.level} Level
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#1a3c34] mb-3">{program.name}</h3>
                  <p className="text-[#5c7a70] text-sm sm:text-base mb-4">{program.description}</p>
                  <p className="text-sm font-semibold text-[#1a3c34] mb-2">Best For:</p>
                  <p className="text-sm text-[#5c7a70] mb-6">{program.bestFor}</p>
                </div>

                <div className="mb-6">
                  <div className="flex flex-wrap items-baseline mb-2 gap-2">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a3c34]">${program.price}</span>
                    <span className="text-sm sm:text-lg text-gray-500">one-time</span>
                  </div>
                  {program.priceRange && (
                    <p className="text-sm text-[#5c7a70] mb-2">Pricing Range: ${program.priceRange}</p>
                  )}
                  <p className="text-xs sm:text-sm text-[#5c7a70] mb-4">or {program.paymentPlan}</p>
                  <p className="text-xs text-gray-500 mb-4">{program.duration} program</p>
                  <div className="bg-[#eff2ef] rounded-lg p-3 mt-4">
                    <p className="text-xs font-semibold text-[#1a3c34] mb-1">Revenue Potential:</p>
                    <p className="text-xs text-[#5c7a70]">70-80% revenue share on consultations & program sales. Many trainers earn $50K-$150K+ annually.</p>
                  </div>
                </div>

                <div className="mb-6 flex-grow">
                  <p className="font-bold text-[#1a3c34] text-sm mb-3">What's Included:</p>
                  <ul className="space-y-2 mb-6">
                    {program.includes.map((item, i) => (
                      <li key={i} className="flex items-start text-sm text-[#5c7a70]">
                        <Check className="w-4 h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="font-bold text-[#1a3c34] text-sm mb-3">You'll Be Able To:</p>
                  <ul className="space-y-2">
                    {program.outcomes.map((outcome, i) => (
                      <li key={i} className="flex items-start text-sm text-[#5c7a70]">
                        <ArrowRight className="w-4 h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <button
                    onClick={() => setSelectedProgram(program.id)}
                    className={`w-full py-3 sm:py-4 rounded-full font-bold transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02] text-sm sm:text-base ${
                      idx === 0
                        ? 'bg-gradient-to-r from-[#1a3c34] via-[#2a5c4f] to-[#1a3c34] text-white hover:from-[#2a5c4f] hover:via-[#1a3c34] hover:to-[#2a5c4f]'
                        : 'bg-gradient-to-r from-[#4a7c59] to-[#5a9c69] text-white hover:from-[#3a6347] hover:to-[#4a8c59]'
                    }`}
                  >
                    ENROLL IN {program.level.toUpperCase()} PROGRAM →
                  </button>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CURRICULUM PREVIEW */}
      <section className="bg-white py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3c34] mb-4 sm:mb-6">
              Curriculum Overview
            </h2>
            <p className="text-[#5c7a70] text-base sm:text-lg max-w-2xl mx-auto">
              Comprehensive training covering all aspects of brain health transformation
            </p>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {certificationPrograms.map((program) => (
              <div key={program.id} className="bg-[#eff2ef] rounded-xl sm:rounded-2xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">{program.name}</h3>
                <div className="space-y-3">
                  {program.curriculum.map((item, idx) => (
                    <div key={idx} className="flex items-start">
                      <div className="bg-[#4a7c59] text-white rounded-lg px-3 py-1 text-xs font-bold mr-3 flex-shrink-0">
                        Week {item.week}
                      </div>
                      <p className="text-sm text-[#5c7a70] pt-1">{item.topic}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#eff2ef] py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <RevealOnScroll className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3c34] mb-4 sm:mb-6">
              Success Stories from Certified Trainers
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, idx) => (
              <RevealOnScroll key={idx} delay={idx * 100} className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[#1a3c34] rounded-full flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-[#1a3c34] text-sm">{testimonial.name}</p>
                    <p className="text-xs text-[#5c7a70]">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-[#1a3c34] text-sm sm:text-base italic mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex text-yellow-400 mb-3">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <p className="text-xs font-semibold text-[#4a7c59]">Result: {testimonial.result}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="bg-white py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <RevealOnScroll className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3c34] mb-4 sm:mb-6">
              Common Questions
            </h2>
            <p className="text-[#5c7a70] text-base sm:text-lg max-w-2xl mx-auto mb-6">
              Everything you need to know about CogCare
            </p>
            {/* FAQ Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search questions..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#4a7c59] focus:outline-none text-sm sm:text-base"
              />
            </div>
          </RevealOnScroll>

          <div className="space-y-4 sm:space-y-6">
            {faqs
              .filter(faq => 
                faqSearch === '' || 
                faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
                faq.a.toLowerCase().includes(faqSearch.toLowerCase())
              )
              .map((faq, idx) => {
                const isExpanded = expandedFaq === idx;
                return (
                  <RevealOnScroll key={idx} delay={idx * 30}>
                    <div className="bg-[#eff2ef] rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden">
                      <button
                        onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                        className="w-full p-5 sm:p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="text-base sm:text-lg font-bold text-[#1a3c34] pr-4">{faq.q}</h3>
                        <ChevronRight 
                          className={`w-5 h-5 text-[#4a7c59] flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                        />
                      </button>
                      {isExpanded && (
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                          <div className="pt-4 border-t border-gray-200">
                            <p className="text-[#5c7a70] text-sm sm:text-base leading-relaxed whitespace-pre-line">{faq.a}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </RevealOnScroll>
                );
              })}
          </div>
          
          {faqs.filter(faq => 
            faqSearch === '' || 
            faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
            faq.a.toLowerCase().includes(faqSearch.toLowerCase())
          ).length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#5c7a70] mb-4">No questions found matching your search.</p>
              <button
                onClick={() => setFaqSearch('')}
                className="text-[#4a7c59] hover:text-[#1a3c34] font-semibold"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gradient-to-r from-[#1a3c34] to-[#2a5c4f] py-12 sm:py-16 md:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Award className="w-16 h-16 sm:w-20 sm:h-20 text-white mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Ready to Transform Lives?
          </h2>
          <p className="text-white/90 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto">
            Join hundreds of certified professionals helping people achieve better brain health. 
            Start your certification journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#1a3c34] px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold hover:bg-gray-100 transition-all duration-300 shadow-elegant-xl hover:shadow-elegant-2xl transform hover:scale-[1.02] text-base sm:text-lg">
              ENROLL IN FOUNDATION PROGRAM →
            </button>
            <button className="bg-gradient-to-r from-[#4a7c59] to-[#5a9c69] text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full font-bold hover:from-[#3a6347] hover:to-[#4a8c59] transition-all duration-300 shadow-elegant-xl hover:shadow-elegant-2xl transform hover:scale-[1.02] text-base sm:text-lg">
              ENROLL IN ADVANCED PROGRAM →
            </button>
          </div>
          <p className="text-white/70 text-xs sm:text-sm mt-6">Questions? Contact us at certification@cogcare.com</p>
        </div>
      </section>
    </div>
  );
};

const App = () => {
  // Router State: 'home' | 'directory' | 'programs' | 'assessments' | 'certification'
  const [activePage, setActivePage] = useState('home');

  return (
    <div className="bg-[#eff2ef] min-h-screen text-[#1a3c34] selection:bg-[#4a7c59] selection:text-white font-sans antialiased">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      
      {activePage === 'home' && (
        <>
          <Hero setActivePage={setActivePage} />
          <TrustSection />
          <TrustBadges setActivePage={setActivePage} />
          <ResearchFoundation />
          {/* <HowItWorksSimple />  <-- Keeping simple for home */}
          <WhyItWorks />
          <AssessmentValidation />
          <InteractiveDemo setActivePage={setActivePage} />
          <VideoExplainer />
          <SampleResultPreview />
          <DetailedJourney />
          <Testimonials />
          <ClinicalAdvisoryBoard />
          <BrainScore />
          <CategoryExplorer />
          <ContentHub />
          <ComparisonMatrix />
          <Pricing setActivePage={setActivePage} />
          <HomeFAQ />
        </>
      )}

      {activePage === 'directory' && (
        <ProfessionalDirectory setActivePage={setActivePage} />
      )}

      {activePage === 'programs' && (
        <ProgramsDirectory setActivePage={setActivePage} />
      )}

      {activePage === 'assessments' && (
        <AssessmentsPage setActivePage={setActivePage} />
      )}

      {activePage === 'certification' && (
        <CertificationPage setActivePage={setActivePage} />
      )}

      {activePage === 'privacy' && (
        <PrivacyPolicy setActivePage={setActivePage} />
      )}

      {activePage === 'terms' && (
        <TermsOfService setActivePage={setActivePage} />
      )}

      {activePage !== 'privacy' && activePage !== 'terms' && (
        <>
          <Footer setActivePage={setActivePage} />
          <ExitIntentPopup />
        </>
      )}
    </div>
  );
};

// ... (Rest of existing components: Hero, TrustSection, etc. remain unchanged below)
// ... (Including them here for completeness of the Single File)

const Hero = ({ setActivePage }) => {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#eff2ef] via-white to-[#eff2ef] overflow-hidden pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16">
      {/* Enhanced animated background orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-gradient-to-r from-[#4a7c59]/20 via-[#dce6dc]/30 to-[#c8d9c8]/20 rounded-full blur-[120px] opacity-60 animate-pulse pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-[#1a3c34]/10 to-[#4a7c59]/10 rounded-full blur-[100px] opacity-40 animate-float pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-gradient-to-r from-[#5a9c69]/15 to-transparent rounded-full blur-[80px] opacity-50 animate-float pointer-events-none" style={{ animationDelay: '1s' }} />
      
      <RevealOnScroll className="z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a3c34] tracking-tight mb-4 sm:mb-6 leading-tight max-w-4xl mx-auto text-shadow-sm">
          What's Keeping Your Brain<br className="hidden sm:block"/> From Working at Its Best?
        </h1>
        <p className="text-[#5c7a70] text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-8 sm:mb-10 md:mb-12 px-2">
          Find out in 3-5 minutes with a science-backed assessment. <br className="hidden sm:block"/>
          Over 247,000 people have discovered their brain's hidden patterns.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10 text-left">
          <div className="group bg-white hover:bg-gradient-to-br hover:from-[#1a3c34] hover:to-[#2a5c4f] hover:text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:border-transparent shadow-elegant hover:shadow-elegant-xl transition-smooth cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 group-hover:text-white" />
              <span className="text-[10px] sm:text-xs font-bold bg-gray-100 group-hover:bg-white/20 group-hover:text-white text-gray-500 px-2 py-1 rounded-full">4 min</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1a3c34] group-hover:text-white mb-2">Can't Focus</h3>
            <p className="text-[#5c7a70] group-hover:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">"I can't stay on task or finish projects."</p>
            <div className="flex items-center text-[10px] sm:text-xs font-bold text-[#4a7c59] group-hover:text-[#8fb89c]">START QUIZ <ArrowRight className="w-3 h-3 ml-1" /></div>
          </div>
          <div className="group bg-white hover:bg-gradient-to-br hover:from-[#1a3c34] hover:to-[#2a5c4f] hover:text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:border-transparent shadow-elegant hover:shadow-elegant-xl transition-smooth cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500 group-hover:text-white transition-colors" />
              <span className="text-[10px] sm:text-xs font-bold bg-gray-100 group-hover:bg-white/20 group-hover:text-white text-gray-500 px-2 py-1 rounded-full transition-colors">5 min</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1a3c34] group-hover:text-white mb-2 transition-colors">Anxiety</h3>
            <p className="text-[#5c7a70] group-hover:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 transition-colors">"Constantly worried or on edge."</p>
            <div className="flex items-center text-[10px] sm:text-xs font-bold text-[#4a7c59] group-hover:text-[#8fb89c] transition-colors">START QUIZ <ArrowRight className="w-3 h-3 ml-1" /></div>
          </div>
          <div className="group bg-white hover:bg-gradient-to-br hover:from-[#1a3c34] hover:to-[#2a5c4f] hover:text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:border-transparent shadow-elegant hover:shadow-elegant-xl transition-smooth cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <Moon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500 group-hover:text-white transition-colors" />
              <span className="text-[10px] sm:text-xs font-bold bg-gray-100 group-hover:bg-white/20 group-hover:text-white text-gray-500 px-2 py-1 rounded-full transition-colors">3 min</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1a3c34] group-hover:text-white mb-2 transition-colors">Sleep Issues</h3>
            <p className="text-[#5c7a70] group-hover:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 transition-colors">"Can't fall or stay asleep."</p>
            <div className="flex items-center text-[10px] sm:text-xs font-bold text-[#4a7c59] group-hover:text-[#8fb89c] transition-colors">START QUIZ <ArrowRight className="w-3 h-3 ml-1" /></div>
          </div>
          <div className="group bg-white hover:bg-gradient-to-br hover:from-[#1a3c34] hover:to-[#2a5c4f] hover:text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:border-transparent shadow-elegant hover:shadow-elegant-xl transition-smooth cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <CloudFog className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500 group-hover:text-white transition-colors" />
              <span className="text-[10px] sm:text-xs font-bold bg-gray-100 group-hover:bg-white/20 group-hover:text-white text-gray-500 px-2 py-1 rounded-full transition-colors">4 min</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1a3c34] group-hover:text-white mb-2 transition-colors">Brain Fog</h3>
            <p className="text-[#5c7a70] group-hover:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 transition-colors">"Mental clarity feels impossible."</p>
            <div className="flex items-center text-[10px] sm:text-xs font-bold text-[#4a7c59] group-hover:text-[#8fb89c] transition-colors">START QUIZ <ArrowRight className="w-3 h-3 ml-1" /></div>
          </div>
          <div className="group bg-white hover:bg-gradient-to-br hover:from-[#1a3c34] hover:to-[#2a5c4f] hover:text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:border-transparent shadow-elegant hover:shadow-elegant-xl transition-smooth cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <Battery className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 group-hover:text-white transition-colors" />
              <span className="text-[10px] sm:text-xs font-bold bg-gray-100 group-hover:bg-white/20 group-hover:text-white text-gray-500 px-2 py-1 rounded-full transition-colors">3 min</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1a3c34] group-hover:text-white mb-2 transition-colors">Low Energy</h3>
            <p className="text-[#5c7a70] group-hover:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 transition-colors">"Always tired and drained."</p>
            <div className="flex items-center text-[10px] sm:text-xs font-bold text-[#4a7c59] group-hover:text-[#8fb89c] transition-colors">START QUIZ <ArrowRight className="w-3 h-3 ml-1" /></div>
          </div>
          <div className="group bg-white hover:bg-gradient-to-br hover:from-[#1a3c34] hover:to-[#2a5c4f] hover:text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 hover:border-transparent shadow-elegant hover:shadow-elegant-xl transition-smooth cursor-pointer transform hover:scale-[1.02] hover:-translate-y-1">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <Smile className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 group-hover:text-white transition-colors" />
              <span className="text-[10px] sm:text-xs font-bold bg-gray-100 group-hover:bg-white/20 group-hover:text-white text-gray-500 px-2 py-1 rounded-full transition-colors">4 min</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1a3c34] group-hover:text-white mb-2 transition-colors">Mood Problems</h3>
            <p className="text-[#5c7a70] group-hover:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 transition-colors">"Feeling down or unstable."</p>
            <div className="flex items-center text-[10px] sm:text-xs font-bold text-[#4a7c59] group-hover:text-[#8fb89c] transition-colors">START QUIZ <ArrowRight className="w-3 h-3 ml-1" /></div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-[#5c7a70] px-2">
          <a href="#" className="flex items-center hover:text-[#1a3c34] group text-center md:text-left">
            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-2 text-[10px] sm:text-xs font-bold group-hover:bg-[#1a3c34] group-hover:text-white transition-colors flex-shrink-0">?</span>
            <span>Not sure? Take the Comprehensive Brain Wellness Quiz (15 min) →</span>
          </a>
          <a href="#" className="flex items-center hover:text-[#1a3c34] group text-center md:text-left">
            <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center mr-2 text-[10px] sm:text-xs font-bold group-hover:bg-[#1a3c34] group-hover:text-white transition-colors flex-shrink-0">⚡</span>
            <span>Already optimizing? Take the Peak Performance Assessment →</span>
          </a>
        </div>
      </RevealOnScroll>
    </section>
  );
};

const TrustSection = () => {
  return (
    <section className="bg-gradient-to-b from-white to-[#eff2ef]/30 py-8 sm:py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-[10px] sm:text-xs font-bold text-gray-400 tracking-widest uppercase mb-4 sm:mb-6">USED BY OVER 247,000 PEOPLE</p>
        <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="text-sm sm:text-base md:text-xl font-bold text-[#1a3c34] flex items-center"><Brain className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5"/>NeuroScience Daily</div>
           <div className="text-sm sm:text-base md:text-xl font-bold text-[#1a3c34] flex items-center"><Activity className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5"/>MindTech</div>
           <div className="text-sm sm:text-base md:text-xl font-bold text-[#1a3c34] flex items-center"><Leaf className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5"/>Wellness Weekly</div>
           <div className="text-sm sm:text-base md:text-xl font-bold text-[#1a3c34] flex items-center"><Zap className="mr-1 sm:mr-2 w-4 h-4 sm:w-5 sm:h-5"/>FutureHuman</div>
        </div>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-2 text-xs sm:text-sm text-[#5c7a70]">
           <div className="flex text-yellow-400">
             <Star className="w-4 h-4 fill-current"/>
             <Star className="w-4 h-4 fill-current"/>
             <Star className="w-4 h-4 fill-current"/>
             <Star className="w-4 h-4 fill-current"/>
             <Star className="w-4 h-4 fill-current"/>
           </div>
           <span className="font-bold text-[#1a3c34]">4.8/5</span> 
           <span>based on 12,847 reviews</span>
        </div>
      </div>
    </section>
  );
};

const WhyItWorks = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="inline-block bg-blue-100 text-blue-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold mb-3 sm:mb-4">THE SCIENCE (EXPLAINED SIMPLY)</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-[#1a3c34] mb-4 sm:mb-6 leading-tight">Why This Works<br className="hidden sm:block" />(When Everything Else Failed)</h2>
          <p className="text-base sm:text-lg md:text-xl text-[#5c7a70] max-w-3xl mx-auto px-2">You've tried productivity apps, morning routines, and "just focus harder." None of it stuck. Here's why—and why this is different.</p>
        </div>
        <div className="mb-12 sm:mb-16 md:mb-20">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-[#1a3c34] mb-8 sm:mb-10 md:mb-12">Think of Your Brain Like a Car Engine</h3>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
            <div>
              <div className="bg-[#eff2ef] rounded-2xl p-8">
                <h4 className="text-xl font-bold text-[#1a3c34] mb-4 flex items-center"><Car className="w-6 h-6 mr-3 text-red-500" />If Your Car Won't Start...</h4>
                <div className="space-y-4 text-[#5c7a70]">
                  <p className="flex items-start"><span className="text-red-500 font-bold mr-2">✗</span><span>You don't just "try harder" to turn the key</span></p>
                  <p className="flex items-start"><span className="text-red-500 font-bold mr-2">✗</span><span>You don't blame yourself for "lacking discipline"</span></p>
                  <p className="flex items-start"><span className="text-red-500 font-bold mr-2">✗</span><span>You don't follow generic advice: "Have you tried better gas?"</span></p>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-[#1a3c34] text-white rounded-2xl p-8">
                <h4 className="text-xl font-bold mb-4 flex items-center"><Check className="w-6 h-6 mr-3 text-[#4a7c59]" />Instead, You Diagnose the Problem</h4>
                <div className="space-y-4">
                  <p className="flex items-start"><span className="text-[#4a7c59] font-bold mr-2">1.</span><span>Check the battery (is there power?)</span></p>
                  <p className="flex items-start"><span className="text-[#4a7c59] font-bold mr-2">2.</span><span>Check the fuel (is the tank empty?)</span></p>
                  <p className="flex items-start"><span className="text-[#4a7c59] font-bold mr-2">3.</span><span>Check the spark plugs (is ignition working?)</span></p>
                  <p className="mt-6 pt-6 border-t border-white/20 font-bold text-[#8fb89c]">→ Only THEN do you fix the specific problem.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-12 sm:mb-16 md:mb-20">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-[#1a3c34] mb-3 sm:mb-4">The Brain Chemistry (Explained Like You're 10)</h3>
          <p className="text-center text-gray-600 mb-8 sm:mb-10 md:mb-12 text-sm sm:text-base">This is the science behind WHY you can't focus—without the jargon</p>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            <div className="bg-[#eff2ef] rounded-2xl p-8">
              <h4 className="text-xl font-bold text-[#1a3c34] mb-6 flex items-center"><AlertCircle className="w-6 h-6 text-red-500 mr-3" />What's Happening in Your Brain Right Now</h4>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-4">
                  <p className="font-bold text-[#1a3c34] mb-2">🧪 Dopamine (The Motivation Molecule)</p>
                  <p className="text-sm text-gray-600 mb-2"><strong>What it does:</strong> Makes you WANT to do things. It's your brain's "fuel."</p>
                  <p className="text-sm text-red-600 font-medium"><strong>Your problem:</strong> You have LOW baseline dopamine. Starting feels exciting (novelty spike), but within 10 minutes, your dopamine depletes and you lose all motivation.</p>
                </div>
                <div className="bg-white rounded-xl p-4">
                  <p className="font-bold text-[#1a3c34] mb-2">⚡ Cortisol (The Stress Hormone)</p>
                  <p className="text-sm text-gray-600 mb-2"><strong>What it does:</strong> Gives you energy to handle challenges.</p>
                  <p className="text-sm text-red-600 font-medium"><strong>Your problem:</strong> Chronic stress = always-on cortisol. Your body is in "survival mode" 24/7, which BLOCKS focus and learning.</p>
                </div>
              </div>
            </div>
            <div className="bg-[#1a3c34] text-white rounded-2xl p-8">
              <h4 className="text-xl font-bold mb-6 flex items-center"><Zap className="w-6 h-6 text-[#4a7c59] mr-3" />How We Fix Each System</h4>
              <div className="space-y-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="font-bold text-[#8fb89c] mb-2">🧪 Dopamine Optimization</p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start"><Check className="w-4 h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /><span><strong>Morning walk</strong> (sunlight = dopamine production)</span></li>
                    <li className="flex items-start"><Check className="w-4 h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /><span><strong>Cold exposure</strong> (2.5x dopamine spike for 3 hours)</span></li>
                    <li className="flex items-start"><Check className="w-4 h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /><span><strong>Protein timing</strong> (tyrosine = dopamine building block)</span></li>
                  </ul>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="font-bold text-[#8fb89c] mb-2">⚡ Cortisol Management</p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start"><Check className="w-4 h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /><span><strong>Breathing protocols</strong> (activates parasympathetic system)</span></li>
                    <li className="flex items-start"><Check className="w-4 h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /><span><strong>Work/rest cycles</strong> (prevents cortisol spikes)</span></li>
                    <li className="flex items-start"><Check className="w-4 h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /><span><strong>Evening wind-down</strong> (lowers cortisol before bed)</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const SampleResultPreview = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#eff2ef] border-y border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <span className="text-[#4a7c59] font-bold tracking-wider text-[10px] sm:text-xs uppercase mb-2 sm:mb-3 block">See What You Get</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3c34]">Your Personal Protocol Preview</h2>
        </div>
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-elegant-lg border border-gray-100">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-[#fcf8f8] rounded-2xl p-6 border border-red-50">
                 <h4 className="font-bold text-[#1a3c34] mb-4 flex items-center"><Zap className="w-5 h-5 text-red-500 mr-2" /> What's Not Working</h4>
                 <ul className="space-y-3 text-sm text-[#5c7a70]">
                   <li className="flex items-start"><X className="w-4 h-4 text-red-400 mr-2 mt-0.5" /> Willpower-based strategies</li>
                   <li className="flex items-start"><X className="w-4 h-4 text-red-400 mr-2 mt-0.5" /> "Just focus harder" mentality</li>
                   <li className="flex items-start"><X className="w-4 h-4 text-red-400 mr-2 mt-0.5" /> Caffeine after 2 PM</li>
                 </ul>
              </div>
              <div className="bg-[#f0fdf4] rounded-2xl p-6 border border-green-50">
                 <h4 className="font-bold text-[#1a3c34] mb-4 flex items-center"><TrendingUp className="w-5 h-5 text-green-500 mr-2" /> What's Possible</h4>
                 <ul className="space-y-3 text-sm text-[#5c7a70]">
                   <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> 90-minute deep work blocks</li>
                   <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Natural energy consistency</li>
                   <li className="flex items-start"><Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" /> Completed projects</li>
                 </ul>
              </div>
              <div className="bg-gradient-to-br from-[#1a3c34] via-[#2a5c4f] to-[#1a3c34] rounded-2xl p-6 shadow-elegant-lg text-white">
                 <h4 className="font-bold mb-4 flex items-center"><Clock className="w-5 h-5 text-[#4a7c59] mr-2" /> Start Today</h4>
                 <div className="space-y-4 text-sm text-gray-300">
                    <div><p className="text-[#4a7c59] text-xs font-bold uppercase mb-1">Morning</p><p>15-min walk within 30 min of waking (sets circadian rhythm)</p></div>
                    <div><p className="text-[#4a7c59] text-xs font-bold uppercase mb-1">Deep Work</p><p>Phone in other room. 25 min timer. Single tab open.</p></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </section>
  );
};

const DetailedJourney = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#eff2ef]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="inline-block bg-green-100 text-green-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold mb-3 sm:mb-4">YOUR ROADMAP</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-[#1a3c34] mb-4 sm:mb-6 leading-tight">Your Transformation Path<br className="hidden sm:block" />(Step-by-Step)</h2>
          <p className="text-base sm:text-lg md:text-xl text-[#5c7a70] max-w-3xl mx-auto px-2">From "I can't focus" to "I just completed 3 projects in 2 weeks"—here's exactly what happens.</p>
        </div>
        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          <JourneyStep number="1" duration="5 minutes" phase="TODAY" title="Take the Assessment" subtitle="Discover your cognitive type" color="blue">
            <div className="grid md:grid-cols-2 gap-6">
              <div><h4 className="font-bold text-[#1a3c34] mb-3">What Happens:</h4><ul className="space-y-2 text-gray-700 text-sm"><li className="flex items-start"><Check className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" /><span>Answer 20 questions about your focus, energy, and habits</span></li><li className="flex items-start"><Check className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" /><span>No wrong answers—just honest self-reflection</span></li></ul></div>
              <div><h4 className="font-bold text-[#1a3c34] mb-3">What You Get (Immediately):</h4><div className="bg-blue-50 rounded-xl p-4 space-y-3"><div className="flex items-start"><div className="bg-blue-500 text-white rounded-lg px-2 py-1 text-xs font-bold mr-3">1</div><div><p className="font-bold text-[#1a3c34] text-sm">Your Cognitive Type</p><p className="text-xs text-gray-600">"Scattered Starter," "Hyperfocus Warrior," etc.</p></div></div><div className="flex items-start"><div className="bg-blue-500 text-white rounded-lg px-2 py-1 text-xs font-bold mr-3">2</div><div><p className="font-bold text-[#1a3c34] text-sm">Your Score (0-100)</p><p className="text-xs text-gray-600">Compared to 127,000+ others in your demographic</p></div></div></div></div>
            </div>
          </JourneyStep>
          <JourneyStep number="2" duration="Week 1" phase="DAYS 1-7" title="Foundation Week" subtitle="Build your new operating system" color="green">
            <div className="space-y-6">
              <div><h4 className="font-bold text-[#1a3c34] mb-3">What You're Learning:</h4><div className="bg-green-50 rounded-xl p-6"><div className="grid md:grid-cols-2 gap-4 text-sm"><div><p className="font-bold text-green-900 mb-2">Module 1: Your Dopamine System</p><p className="text-green-700">How motivation actually works (it's not willpower)</p></div><div><p className="font-bold text-green-900 mb-2">Module 2: Morning Priming</p><p className="text-green-700">The 15-minute routine that sets your entire day</p></div></div></div></div>
            </div>
          </JourneyStep>
          <JourneyStep number="3" duration="Week 2" phase="DAYS 8-14" title="Building Endurance" subtitle="From 15 minutes to 45 minutes" color="purple">
            <div className="bg-white rounded-xl p-6 border-2 border-purple-200"><h4 className="font-bold text-[#1a3c34] mb-3 flex items-center"><TrendingUp className="w-5 h-5 text-purple-500 mr-2" /> Real Member Progress (Week 2):</h4><div className="grid md:grid-cols-3 gap-4"><div className="text-center"><p className="text-3xl font-bold text-purple-600 mb-1">45min</p><p className="text-xs text-gray-600">Avg focus block length</p></div><div className="text-center"><p className="text-3xl font-bold text-purple-600 mb-1">3.2</p><p className="text-xs text-gray-600">Tasks completed per day</p></div><div className="text-center"><p className="text-3xl font-bold text-purple-600 mb-1">67%</p><p className="text-xs text-gray-600">Feel "in control" of their day</p></div></div></div>
          </JourneyStep>
          <JourneyStep number="4" duration="Ongoing" phase="AFTER 30 DAYS" title="Lifetime Optimization" subtitle="Continuous improvement" color="teal">
            <div className="bg-white rounded-xl p-6 border-2 border-teal-200"><h4 className="font-bold text-[#1a3c34] mb-3 flex items-center"><Repeat className="w-5 h-5 text-teal-500 mr-2" /> What Happens Next:</h4><ul className="space-y-3 text-sm text-gray-700"><li className="flex items-start"><Check className="w-4 h-4 text-teal-500 mr-2 mt-0.5 flex-shrink-0" /><span><strong>Monthly reassessments:</strong> Track your score over time</span></li><li className="flex items-start"><Check className="w-4 h-4 text-teal-500 mr-2 mt-0.5 flex-shrink-0" /><span><strong>New module releases:</strong> Advanced protocols added quarterly</span></li></ul></div>
          </JourneyStep>
        </div>
      </div>
    </section>
  );
};

// Supporting Component for Journey Steps
const JourneyStep = ({ number, duration, phase, title, subtitle, color, children }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    indigo: 'from-indigo-500 to-indigo-600',
    teal: 'from-teal-500 to-teal-600'
  };

  return (
    <div className="relative">
      {/* Timeline Connector */}
      {number !== "6" && (
        <div className="hidden md:block absolute left-[52px] top-24 w-1 h-[calc(100%+3rem)] bg-gray-200" />
      )}

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8">
        {/* Left: Number Badge */}
        <div className="flex-shrink-0 flex justify-center sm:justify-start">
          <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl sm:rounded-2xl bg-gradient-to-br ${colors[color]} flex flex-col items-center justify-center text-white shadow-xl relative z-10`}>
            <p className="text-2xl sm:text-2xl md:text-3xl font-bold">{number}</p>
            <p className="text-[10px] sm:text-xs mt-0.5 sm:mt-1 opacity-80">{duration}</p>
          </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-elegant-lg border border-gray-200">
            <div className="mb-4 sm:mb-6">
              <div className={`inline-block bg-gradient-to-r ${colors[color]} text-white px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold mb-2 sm:mb-3`}>
                {phase}
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1a3c34] mb-2">{title}</h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const BrainScore = () => {
  return (
    <section id="score" className="bg-[#eff2ef] py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 sm:gap-12 md:gap-16">
        <div className="w-full md:w-1/2">
          <RevealOnScroll>
            <div className="inline-flex items-center space-x-2 bg-[#1a3c34]/5 text-[#1a3c34] px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-6 border border-[#1a3c34]/10"><ShieldCheck className="w-3 h-3 sm:w-4 sm:h-4" /><span>Retention Mechanism</span></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a3c34] mb-4 sm:mb-6 leading-tight">The Credit Score for Your Mind.</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 sm:p-6 rounded-r-xl mb-6 sm:mb-8"><p className="text-xs sm:text-sm font-bold text-yellow-900 mb-2">Why most brain training fails:</p><p className="text-xs sm:text-sm text-yellow-800">You take a program, feel motivated for a week, then slide back. CogCare is different because we <strong>measure</strong> if it's actually working.</p></div>
            <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
              <div className="flex items-start"><div className="bg-[#4a7c59] rounded-full p-1 mr-4 mt-1"><Check className="w-3 h-3 text-white" /></div><div><h4 className="font-bold text-[#1a3c34]">Proof that works</h4><p className="text-sm text-[#5c7a70]">See your improvement in real numbers, not just feelings.</p></div></div>
              <div className="flex items-start"><div className="bg-[#4a7c59] rounded-full p-1 mr-4 mt-1"><Check className="w-3 h-3 text-white" /></div><div><h4 className="font-bold text-[#1a3c34]">Accountability that sticks</h4><p className="text-sm text-[#5c7a70]">Monthly check-ins keep you on track.</p></div></div>
            </div>
          </RevealOnScroll>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <RevealOnScroll delay={200} className="relative w-full max-w-[280px] sm:max-w-sm">
             <div className="bg-gradient-to-br from-[#1a3c34] via-[#2a5c4f] to-[#1a3c34] border-[6px] sm:border-[8px] border-[#1a3c34] rounded-[2rem] sm:rounded-[3rem] p-1.5 sm:p-2 shadow-elegant-2xl shadow-[#1a3c34]/30 relative z-10 overflow-hidden h-[500px] sm:h-[600px]">
                <div className="bg-[#eff2ef] h-full w-full rounded-[2.5rem] overflow-hidden flex flex-col relative">
                  <div className="absolute top-0 w-full h-8 bg-white/80 z-20 backdrop-blur-sm"></div>
                  <div className="p-6 pt-12 text-center bg-white pb-6 rounded-b-3xl shadow-sm">
                    <div className="flex justify-between items-center mb-2"><span className="text-[10px] uppercase font-bold text-gray-400">Your Score</span><span className="text-[10px] uppercase font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+24 this month</span></div>
                    <h3 className="text-6xl font-bold text-[#1a3c34] mb-2 tracking-tighter">682</h3>
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-2 text-xs"><div className="text-left"><p className="text-gray-400">National Avg</p><p className="font-bold text-[#1a3c34]">650</p></div><div className="text-right"><p className="text-gray-400">Top Performers</p><p className="font-bold text-[#1a3c34]">750+</p></div></div>
                  </div>
                  <div className="px-6 py-6"><p className="text-[#1a3c34] font-bold text-sm mb-4">Historical Trend</p><div className="h-32 flex items-end justify-between space-x-2">{[40, 55, 45, 60, 50, 75, 85].map((h, i) => (<div key={i} className="w-full bg-[#1a3c34]/5 rounded-t-sm relative group"><div style={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-[#1a3c34] rounded-t-sm group-hover:bg-[#4a7c59] transition-colors"></div></div>))}</div></div>
                  <div className="mt-2 px-4 space-y-3"><div className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm border border-gray-100"><div className="flex items-center"><div className="p-2 bg-[#4a7c59]/10 rounded-lg mr-3"><Zap className="w-4 h-4 text-[#4a7c59]"/></div><div className="text-left"><p className="text-[#1a3c34] text-sm font-bold">Focus</p><p className="text-[#5c7a70] text-xs">Top 15%</p></div></div><span className="text-[#1a3c34] font-bold">88</span></div></div>
                </div>
             </div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#4a7c59]/20 blur-[80px] -z-10 rounded-full"></div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
};

/**
 * Trust Badges Component
 */
const TrustBadges = ({ setActivePage }) => {
  const badges = [
    {
      icon: Stethoscope,
      title: "Protocols Reviewed by Board-Certified Specialists",
      color: "blue"
    },
    {
      icon: Lock,
      title: "Data Security: Bank-Level AES-256 Encryption",
      color: "green"
    },
    {
      icon: BookOpen,
      title: "Research-Backed: 127+ Peer-Reviewed Studies",
      color: "purple"
    },
    {
      icon: ShieldCheck,
      title: "Privacy First: Zero Data Selling Policy",
      color: "amber"
    },
    {
      icon: FileText,
      title: "Transparent Methodology: Published Assessment Framework",
      color: "teal"
    }
  ];
  
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#eff2ef] border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealOnScroll className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3c34] mb-4 sm:mb-6">
            Trusted by Healthcare Professionals & Organizations
          </h2>
        </RevealOnScroll>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
          {badges.map((badge, idx) => {
            const IconComponent = badge.icon;
            const colorClasses = {
              blue: 'bg-blue-100 text-blue-600',
              green: 'bg-green-100 text-green-600',
              purple: 'bg-purple-100 text-purple-600',
              amber: 'bg-amber-100 text-amber-600',
              teal: 'bg-teal-100 text-teal-600'
            };
            return (
              <RevealOnScroll key={idx} delay={idx * 50}>
                <div className="bg-white rounded-xl p-4 sm:p-5 md:p-6 text-center hover:shadow-elegant-lg transition-smooth transform hover:scale-[1.02] cursor-pointer border border-gray-200 hover:border-[#4a7c59]">
                  <div className={`w-10 h-10 sm:w-12 sm:h-14 md:h-14 ${colorClasses[badge.color] || 'bg-gray-100 text-gray-600'} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-7 md:w-7" />
                  </div>
                  <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-[#1a3c34] leading-tight px-1">{badge.title}</p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
};

/**
 * Clinical Advisory Board Component
 */
const ClinicalAdvisoryBoard = () => {
  const advisors = [
    {
      name: "Dr. Imaad Nasir, M.D.",
      title: "Assistant Clinical Professor, Board-Certified Neurologist",
      institution: "UCLA David Geffen School of Medicine, UCLA Brain Research Institute",
      quote: "CogCare's assessment methodology represents a significant advancement in personalized cognitive optimization.",
      photo: "/nasir-photo.jpg"
    },
    {
      name: "Dr. [Name], PsyD",
      title: "Clinical Psychologist, Cognitive Behavioral Specialist",
      institution: "Stanford Health",
      quote: "The integration of circadian biology with cognitive assessment provides a holistic approach to mental wellness."
    },
    {
      name: "Dr. [Name], PhD",
      title: "Neuroscience Researcher",
      institution: "MIT McGovern Institute",
      quote: "Evidence-based protocols grounded in peer-reviewed research make CogCare a trusted platform for cognitive enhancement."
    }
  ];
  
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealOnScroll className="text-center mb-8 sm:mb-12">
          <div className="inline-block bg-blue-100 text-blue-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold mb-4">
            CLINICAL OVERSIGHT
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3c34] mb-4 sm:mb-6">
            Clinical Advisory Board
          </h2>
          <p className="text-base sm:text-lg text-[#5c7a70] max-w-3xl mx-auto">
            Our protocols are reviewed by board-certified specialists in neurology, psychiatry, and cognitive neuroscience.
          </p>
        </RevealOnScroll>
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {advisors.map((advisor, idx) => (
            <RevealOnScroll key={idx} delay={idx * 100}>
              <div className="bg-[#eff2ef] rounded-xl p-6 sm:p-8 text-center">
                {advisor.photo ? (
                  <img 
                    src={advisor.photo} 
                    alt={advisor.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto mb-4 border-4 border-[#1a3c34]"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#1a3c34] rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mx-auto mb-4">
                    {advisor.name.charAt(advisor.name.indexOf(' ') + 1) || advisor.name.charAt(0)}
                  </div>
                )}
                <h3 className="font-bold text-[#1a3c34] mb-2 text-base sm:text-lg md:text-xl px-2">{advisor.name}</h3>
                <p className="text-xs sm:text-sm md:text-base text-[#4a7c59] font-semibold mb-1 px-2">{advisor.title}</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-[#5c7a70] mb-4 px-2 leading-relaxed">{advisor.institution}</p>
                <p className="text-sm text-[#5c7a70] italic">"{advisor.quote}"</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
        <div className="mt-8 sm:mt-12 text-center">
          <p className="text-sm sm:text-base text-[#5c7a70]">
            [PLACEHOLDER: Clinical protocols reviewed by board-certified specialists in neurology, psychiatry, and cognitive neuroscience.]
          </p>
        </div>
      </div>
    </section>
  );
};

/**
 * Interactive Demo Component
 */
const InteractiveDemo = ({ setActivePage }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#eff2ef] border-y border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <RevealOnScroll className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-elegant-lg border border-gray-100">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-block bg-blue-100 text-blue-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold mb-4">
              TRY A SAMPLE QUESTION
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3c34] mb-4 sm:mb-6">
              See How Our Assessment Works
            </h2>
          </div>
          
          <div className="mb-6 sm:mb-8">
            <p className="text-sm sm:text-base text-[#5c7a70] mb-2">Question 3 of 20:</p>
            <h3 className="text-lg sm:text-xl font-bold text-[#1a3c34] mb-6">
              "When you start a new project, what typically happens?"
            </h3>
            
            <div className="space-y-2 sm:space-3 md:space-4">
              {[
                { value: 'rapid', text: "I'm excited for 5-10 minutes, then completely lose interest", type: "Rapid depletion (Scattered Starter)" },
                { value: 'spike', text: "I obsess over it for hours, then crash hard afterward", type: "Spike-crash cycle (Hyperfocus Warrior)" },
                { value: 'anxious', text: "I feel anxious about starting at all", type: "Cortisol-driven avoidance" },
                { value: 'low', text: "I need multiple coffee breaks to keep going", type: "Chronic low baseline" }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all min-h-[60px] ${
                    selectedOption === option.value
                      ? 'border-[#4a7c59] bg-[#eff2ef]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="demo-question"
                    value={option.value}
                    checked={selectedOption === option.value}
                    onChange={() => setSelectedOption(option.value)}
                    className="mt-1 mr-2 sm:mr-3 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm md:text-base text-[#1a3c34] leading-relaxed">{option.text}</p>
                    {selectedOption === option.value && (
                      <p className="text-[10px] sm:text-xs md:text-sm text-[#4a7c59] mt-2 font-semibold leading-relaxed">
                        💡 This reveals: {option.type}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
          
          <div className="bg-[#1a3c34] text-white rounded-xl p-5 sm:p-6 text-center">
            <p className="text-sm sm:text-base mb-4">
              This question reveals your dopamine response pattern. Our full assessment analyzes 20+ questions to map your complete cognitive profile.
            </p>
              <button
                onClick={() => {
                  setActivePage('home');
                  setTimeout(() => {
                    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="bg-gradient-to-r from-[#4a7c59] to-[#5a9c69] text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-bold hover:from-[#3a6347] hover:to-[#4a8c59] transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02] text-xs sm:text-sm md:text-base min-h-[44px]"
              >
                START FULL ASSESSMENT →
              </button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

/**
 * Video Explainer Component
 */
const VideoExplainer = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <RevealOnScroll className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3c34] mb-4 sm:mb-6">
            See How CogCare Works in 2 Minutes
          </h2>
          <p className="text-base sm:text-lg text-[#5c7a70] max-w-2xl mx-auto mb-6 sm:mb-8">
            Watch a quick overview of our assessment process and how personalized protocols work
          </p>
        </RevealOnScroll>
        
        <div className="bg-[#eff2ef] rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-16 aspect-video flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-[#4a7c59] to-[#5a9c69] rounded-full flex items-center justify-center hover:from-[#3a6347] hover:to-[#4a8c59] transition-all duration-300 shadow-elegant-xl hover:shadow-elegant-2xl transform hover:scale-110">
              <Play className="w-10 h-10 sm:w-12 sm:h-12 text-white ml-1" />
            </button>
          </div>
          <p className="absolute bottom-4 left-4 right-4 text-center text-sm text-[#5c7a70]">
            [PLACEHOLDER: Video will be embedded here - YouTube/Vimeo embed]
          </p>
        </div>
        
        <div className="mt-8 sm:mt-12 bg-[#eff2ef] rounded-xl p-6 sm:p-8">
          <h3 className="font-bold text-[#1a3c34] mb-4 text-lg sm:text-xl">Key Points Covered:</h3>
          <ul className="space-y-2 text-sm sm:text-base text-[#5c7a70]">
            <li className="flex items-start"><Check className="w-5 h-5 text-[#4a7c59] mr-3 mt-0.5 flex-shrink-0" /> How the 5-minute assessment works</li>
            <li className="flex items-start"><Check className="w-5 h-5 text-[#4a7c59] mr-3 mt-0.5 flex-shrink-0" /> Understanding your cognitive type results</li>
            <li className="flex items-start"><Check className="w-5 h-5 text-[#4a7c59] mr-3 mt-0.5 flex-shrink-0" /> Personalized dashboard overview</li>
            <li className="flex items-start"><Check className="w-5 h-5 text-[#4a7c59] mr-3 mt-0.5 flex-shrink-0" /> Progress tracking after 2 weeks</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

/**
 * Content Hub / Blog Section
 */
const ContentHub = () => {
  const articles = [
    {
      title: "The Science Behind Morning Sunlight and Dopamine",
      description: "How early morning light exposure triggers dopamine production and sets your circadian rhythm for the day.",
      category: "Dopamine Optimization",
      readTime: "8 min read"
    },
    {
      title: "Why Your Focus Crashes at 2pm (And How to Fix It)",
      description: "The cortisol-dopamine interaction that causes afternoon energy crashes and practical solutions.",
      category: "Focus & Energy",
      readTime: "6 min read"
    },
    {
      title: "Cortisol 101: The Stress Hormone Explained",
      description: "Understanding how cortisol affects your brain, body, and cognitive performance.",
      category: "Stress Management",
      readTime: "10 min read"
    },
    {
      title: "Cold Exposure Protocols: Complete Guide",
      description: "Evidence-based cold exposure methods to boost dopamine, reduce inflammation, and improve focus.",
      category: "Biohacking",
      readTime: "12 min read"
    }
  ];
  
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#eff2ef]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <RevealOnScroll className="text-center mb-8 sm:mb-12">
          <div className="inline-block bg-green-100 text-green-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold mb-4">
            RESEARCH & EDUCATION
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3c34] mb-4 sm:mb-6">
            Learn the Science Behind Cognitive Optimization
          </h2>
          <p className="text-base sm:text-lg text-[#5c7a70] max-w-3xl mx-auto">
            Evidence-based articles, research summaries, and practical guides to optimize your brain health
          </p>
        </RevealOnScroll>
        
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {articles.map((article, idx) => (
            <RevealOnScroll key={idx} delay={idx * 100}>
              <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:shadow-elegant-lg transition-smooth transform hover:scale-[1.02] hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#4a7c59] bg-[#eff2ef] px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  <span className="text-xs text-[#5c7a70]">{article.readTime}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[#1a3c34] mb-3 hover:text-[#4a7c59] transition-colors">
                  {article.title}
                </h3>
                <p className="text-sm sm:text-base text-[#5c7a70] mb-4">{article.description}</p>
                <button className="text-sm font-semibold text-[#4a7c59] hover:text-[#1a3c34] flex items-center">
                  Read Article <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </RevealOnScroll>
          ))}
        </div>
        
        <div className="text-center mt-8 sm:mt-12">
          <button className="bg-white border-2 border-[#4a7c59] text-[#4a7c59] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-gradient-to-r hover:from-[#4a7c59] hover:to-[#5a9c69] hover:text-white hover:border-transparent transition-all duration-300 shadow-elegant hover:shadow-elegant-lg transform hover:scale-[1.02] text-sm sm:text-base">
            View All Articles →
          </button>
        </div>
      </div>
    </section>
  );
};

/**
 * Home Page FAQ Component
 */
const HomeFAQ = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [faqSearch, setFaqSearch] = useState('');
  
  const homeFaqs = [
    {
      q: "I've tried supplements, therapy, and 50 productivity apps. Why would THIS be different?",
      a: "Because you never diagnosed the root cause. You treated symptoms. Think about it: If you have low baseline dopamine (rapid depletion pattern), no amount of 'focus apps' will work. You're trying to willpower your way through a biological deficit. Our quiz maps your SPECIFIC neurochemical pattern—most people discover they've been optimizing the WRONG system. Example: You tried focus techniques, but your real issue was elevated cortisol blocking cognition. Different problem = different solution."
    },
    {
      q: "Can I use CogCare while seeing a therapist or taking medication?",
      a: "Yes—and 80% of our users do exactly that. CogCare focuses on lifestyle optimization (light exposure, breathing, nutrition, sleep architecture) which complements medical treatment. We're NOT replacing therapy or medication. We're optimizing the biological foundation that makes them work better. ⚠️ Always consult your provider before major lifestyle changes, especially if you're on psychiatric medications that affect neurotransmitter systems."
    },
    {
      q: "What if my quiz results don't match how I feel?",
      a: "Email us within 7 days for manual clinical review. ~5% of users need assessment recalibration due to: comorbid conditions (ADHD + anxiety, for example), medication effects masking underlying patterns, or atypical circadian rhythms (shift workers, etc.). Our clinical team will review your results and either: (a) Adjust your cognitive profile, or (b) Refund you completely if we can't provide accurate assessment."
    },
    {
      q: "Is this just another wellness scam?",
      a: "Fair question. Here's how we're different: 🔬 Peer-Reviewed Science - Every protocol is based on published neuroscience research. 👨‍⚕️ Clinical Oversight - Protocols reviewed by board-certified neurologists & psychiatrists. 📊 Measurable Outcomes - Your score is tracked monthly. If it doesn't improve, we investigate why. 💰 Money-Back Guarantee - 30 days. No questions asked. Full refund. We're not selling magic pills or miracle cures. We're teaching you how to optimize the biological systems that govern cognition."
    },
    {
      q: "How is this different from Lumosity/BrainHQ/Peak?",
      a: "Brain training games vs. biological optimization. Brain Training Apps: Focus on cognitive exercises (games, puzzles), goal is to improve performance on THOSE specific games, transfer effect is minimal (Florida State study: Portal 2 outperformed Lumosity). CogCare: Focus on neurochemical system optimization, goal is to fix underlying biology that enables ALL cognitive tasks, transfer effect improves focus, energy, mood across your entire life. Analogy: Brain training = practicing free throws. CogCare = fixing your vision, strength, and balance."
    },
    {
      q: "What if I don't have time for a complicated protocol?",
      a: "Our minimum effective dose is 15 minutes/day. Week 1 Protocol Example: Morning (10 min): Walk outside (sunlight exposure), Midday (2 min): Box breathing between meetings, Evening (3 min): Blue light reduction routine. Total: 15 minutes. Most people naturally expand this as they feel benefits, but you can see measurable improvement with just the basics."
    },
    {
      q: "Is my data private? Do you sell it?",
      a: "Your data is private. We NEVER sell it. Period. Bank-level AES-256 encryption, no advertising partners, no third-party data sharing, you can download or delete your data anytime. We make money from subscriptions, not from selling your information."
    },
    {
      q: "What results can I realistically expect?",
      a: "Based on 247,000+ user cohort: Week 2: 67% report improved morning energy, easier task initiation. Week 4: 73% achieve 45-min+ focus blocks (vs. 15-20 min baseline). Week 8: 81% report sustained improvement in baseline mood/motivation. But: Results require protocol adherence. 90% adherence → 3.2x better outcomes than 50% adherence. If you're not willing to actually DO the protocols, this won't work. We're optimizing biology, not selling magic."
    },
    {
      q: "Can this help with ADHD/depression/anxiety?",
      a: "It depends. CogCare can help with: ✓ Subclinical symptoms ('I'm functional but struggling'), ✓ Optimizing biology while on medication, ✓ Lifestyle factors that exacerbate clinical conditions. CogCare CANNOT replace: ✗ Clinical diagnosis by psychiatrist/psychologist, ✗ Medication for moderate-to-severe conditions, ✗ Therapy for trauma, emotional processing. If you have diagnosed ADHD/depression/anxiety: → CogCare works ALONGSIDE treatment, not instead of it. → Many users find their medication works BETTER when biology is optimized."
    },
    {
      q: "Do you take insurance?",
      a: "Not directly, but we provide documentation for reimbursement. Many HSA/FSA plans cover 'wellness programs' and 'preventive health.' We provide: Itemized receipt (required for HSA/FSA), detailed program description, clinical rationale documentation. Success rate: ~60% of users who submit get partial or full reimbursement."
    }
  ];
  
  return (
    <section className="bg-white py-12 sm:py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <RevealOnScroll className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3c34] mb-4 sm:mb-6">
            Common Questions
          </h2>
          <p className="text-[#5c7a70] text-base sm:text-lg max-w-2xl mx-auto mb-6">
            Everything you need to know about CogCare
          </p>
          {/* FAQ Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search questions..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-gray-200 focus:border-[#4a7c59] focus:outline-none text-sm sm:text-base"
            />
          </div>
        </RevealOnScroll>

        <div className="space-y-4 sm:space-y-6">
          {homeFaqs
            .filter(faq => 
              faqSearch === '' || 
              faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
              faq.a.toLowerCase().includes(faqSearch.toLowerCase())
            )
            .map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <RevealOnScroll key={idx} delay={idx * 30}>
                  <div className="bg-[#eff2ef] rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden">
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                      className="w-full p-4 sm:p-5 md:p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors min-h-[60px] sm:min-h-[70px]"
                    >
                      <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#1a3c34] pr-3 sm:pr-4 leading-tight">{faq.q}</h3>
                      <ChevronRight 
                        className={`w-5 h-5 sm:w-6 sm:h-6 text-[#4a7c59] flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
                        <div className="pt-3 sm:pt-4 border-t border-gray-200">
                          <p className="text-[#5c7a70] text-xs sm:text-sm md:text-base leading-relaxed whitespace-pre-line">{faq.a}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </RevealOnScroll>
              );
            })}
        </div>
        
        {homeFaqs.filter(faq => 
          faqSearch === '' || 
          faq.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
          faq.a.toLowerCase().includes(faqSearch.toLowerCase())
        ).length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#5c7a70] mb-4">No questions found matching your search.</p>
            <button
              onClick={() => setFaqSearch('')}
              className="text-[#4a7c59] hover:text-[#1a3c34] font-semibold"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const Testimonials = () => {
  const [activeTab, setActiveTab] = useState('focus');
  const testimonials = {
    focus: [
      { 
        name: "Sarah K.", 
        role: "Marketing Director, Age 34", 
        cognitiveType: "Scattered Starter",
        quote: "I'm a marketing director who couldn't finish projects. Clients were frustrated. I was drowning. Took the CogCare quiz → learned I had rapid dopamine depletion (novelty spike, then 10-min crash). Started morning walk + cold exposure protocol. Now I consistently hit 90-minute deep work blocks. First time in 8 years.",
        before: "3-4 unfinished projects, constant task-switching, deadline panic",
        after: "Shipped 2 major campaigns ahead of schedule, 67% longer focus blocks, zero afternoon crashes",
        timeframe: "Week 4"
      }, 
      { 
        name: "Michael R.", 
        role: "Software Engineer, Age 29", 
        cognitiveType: "Hyperfocus Warrior (Crashed)",
        quote: "I'd hyperfocus for 6 hours, then be useless for 3 days. Boom-bust cycle destroyed my consistency. CogCare identified my pattern: massive dopamine spikes + cortisol dysregulation = burnout loop. Implemented work/rest cycles + breathing protocols.",
        before: "1 productive day, 3 recovery days (25% efficiency)",
        after: "5 solid days/week, sustainable output, energy stays level (250% productivity increase)",
        timeframe: "Week 6"
      }
    ],
    anxiety: [
      { 
        name: "James L.", 
        role: "Teacher, Age 42", 
        cognitiveType: "Chronic Stress Responder",
        quote: "I didn't realize my anxiety was physical until I took the Neuro-Calm assessment. The breathing protocols changed everything. My cortisol was flatlined high 24/7—explaining why I couldn't think clearly even on days off.",
        before: "Constant worry, physical tension, decision paralysis",
        after: "Calm baseline, clear thinking, proactive problem-solving",
        timeframe: "Week 8"
      },
      { 
        name: "Elena D.", 
        role: "Artist, Age 31", 
        cognitiveType: "Chronic Stress Responder",
        quote: "Validation. That's what I felt. Finally understanding WHY I feel on edge was the first step to fixing it. Breathing protocols + evening wind-down routine literally changed my brain's baseline state.",
        before: "Always on edge, reactive, creative blocks",
        after: "Mental clarity, proactive work, actually enjoy creating again",
        timeframe: "Week 6"
      }
    ],
    sleep: [
      { 
        name: "Robert T.", 
        role: "Executive, Age 45", 
        cognitiveType: "Circadian Disrupted",
        quote: "I thought I just had 'bad sleep'. Turns out I had a cortisol rhythm issue. Fixed it in 2 weeks with the circadian optimization protocol. Now I sleep 7-8 hours consistently and wake up refreshed.",
        before: "4-5 hours sleep, constant fatigue, afternoon crashes",
        after: "7-8 hours sleep, consistent energy, no afternoon crashes",
        timeframe: "Week 2"
      },
      { 
        name: "Anita P.", 
        role: "Nurse, Age 38", 
        cognitiveType: "Circadian Disrupted",
        quote: "Shift work destroyed my sleep. The Circadian Reset protocol from the quiz results saved my career. I can now manage rotating shifts without the constant exhaustion.",
        before: "Erratic sleep, shift work exhaustion, mood swings",
        after: "Adaptable sleep schedule, stable energy, improved mood",
        timeframe: "Week 4"
      }
    ]
  };
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#1a3c34] mb-3 sm:mb-4">Before & After: Real User Transformations</h2>
        <p className="text-center text-[#5c7a70] text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12">Read stories from people who faced the same problem as you.</p>
        <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 md:mb-12 flex-wrap px-2">
          {['focus', 'anxiety', 'sleep'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold capitalize transition-all duration-300 ${activeTab === tab ? 'bg-gradient-to-r from-[#1a3c34] via-[#2a5c4f] to-[#1a3c34] text-white shadow-elegant-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 shadow-elegant hover:shadow-elegant-sm'}`}>{tab === 'focus' ? 'Focus & ADHD' : tab}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {testimonials[activeTab].map((t, i) => (
            <RevealOnScroll key={i} delay={i * 100} className="bg-[#eff2ef] rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-transparent hover:border-[#1a3c34]/10 transition-all">
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#1a3c34] rounded-full flex items-center justify-center text-white font-bold mr-3 sm:mr-4 text-base sm:text-lg flex-shrink-0">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-[#1a3c34] text-sm sm:text-base">{t.name}</p>
                  <p className="text-xs sm:text-sm text-[#5c7a70]">{t.role}</p>
                  <p className="text-xs font-semibold text-[#4a7c59] mt-1">Cognitive Type: {t.cognitiveType}</p>
                </div>
              </div>
              <p className="text-[#1a3c34] text-sm sm:text-base md:text-lg italic leading-relaxed mb-4">"{t.quote}"</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4 pt-4 border-t border-gray-300">
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-red-600 mb-1 sm:mb-2">BEFORE:</p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-[#5c7a70] leading-relaxed">{t.before}</p>
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-green-600 mb-1 sm:mb-2">AFTER ({t.timeframe}):</p>
                  <p className="text-[10px] sm:text-xs md:text-sm text-[#5c7a70] leading-relaxed">{t.after}</p>
                </div>
              </div>
              <div className="flex text-yellow-400">
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = ({ setActivePage }) => {
  return (
    <section id="pricing" className="bg-[#eff2ef] py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <RevealOnScroll>
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="inline-block bg-green-100 text-green-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-bold mb-4">
              CHOOSE YOUR PATH
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a3c34] mb-4 sm:mb-6">
              Choose Your Path to Cognitive Optimization
            </h2>
            <p className="text-[#5c7a70] text-base sm:text-lg md:text-xl max-w-3xl mx-auto mb-6 sm:mb-8">
              Not sure which path is right for you? Take our free 5-minute assessment first to get a personalized recommendation.
            </p>
            <button 
              onClick={() => {
                setActivePage('home');
                setTimeout(() => {
                  document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="bg-gradient-to-r from-[#4a7c59] to-[#5a9c69] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:from-[#3a6347] hover:to-[#4a8c59] transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02] text-sm sm:text-base"
            >
              TAKE FREE QUIZ →
            </button>
          </div>
        </RevealOnScroll>

        {/* Three Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto mb-8 sm:mb-12 md:mb-16">
          {/* TIER 1: FREE ASSESSMENT */}
          <RevealOnScroll className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-200 shadow-elegant-lg hover:shadow-elegant-xl transition-smooth flex flex-col">
            <div className="mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mb-3 sm:mb-4 mx-auto sm:mx-0">🎯</div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1a3c34] mb-2 text-center sm:text-left">FREE ASSESSMENT</h3>
              <p className="text-[#5c7a70] text-xs sm:text-sm md:text-base mb-3 sm:mb-4 text-center sm:text-left">
                Perfect for: Understanding your brain's bottlenecks
              </p>
            </div>

            <div className="mb-4 sm:mb-6 flex-grow">
              <ul className="space-y-2 text-xs sm:text-sm text-[#5c7a70]">
                <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">Take any specialized quiz (3-5 min)</span></li>
                <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">Get your cognitive type + top 3 recommendations</span></li>
                <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">Access basic educational content</span></li>
                <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">Compare your score to national averages</span></li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-4 sm:pt-6 mt-auto">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#4a7c59] mb-3 sm:mb-4 text-center sm:text-left">FREE</p>
              <button 
                onClick={() => {
                  setActivePage('home');
                  setTimeout(() => {
                    document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="w-full bg-gradient-to-r from-[#4a7c59] to-[#5a9c69] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold hover:from-[#3a6347] hover:to-[#4a8c59] transition-all duration-300 shadow-elegant-lg hover:shadow-elegant-xl transform hover:scale-[1.02] text-xs sm:text-sm md:text-base min-h-[44px]"
              >
                START FREE ASSESSMENT →
              </button>
            </div>
          </RevealOnScroll>

          {/* TIER 2: COMPLETE PROTOCOL ACCESS */}
          <RevealOnScroll delay={100} className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-[#4a7c59] shadow-xl flex flex-col relative transform md:-translate-y-2">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#4a7c59] text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-b-lg">MOST POPULAR</div>
            <div className="mb-3 sm:mb-4 mt-2 sm:mt-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mb-3 sm:mb-4 mx-auto sm:mx-0">🚀</div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1a3c34] mb-2 text-center sm:text-left">COMPLETE PROTOCOL ACCESS</h3>
              <p className="text-[#5c7a70] text-xs sm:text-sm md:text-base mb-3 sm:mb-4 text-center sm:text-left">
                Perfect for: Serious cognitive optimization
              </p>
            </div>

            <div className="mb-4 sm:mb-6 flex-grow">
              <ul className="space-y-2 text-xs sm:text-sm text-[#5c7a70]">
                <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">Full diagnostic report (15-page PDF)</span></li>
                <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">8-week personalized optimization program</span></li>
                <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">Video learning modules (40+ lessons)</span></li>
                <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">Daily protocol stack (morning/afternoon/evening routines)</span></li>
                <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">Progress tracking dashboard</span></li>
                <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">Private community access (12,000+ members)</span></li>
                <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">Monthly reassessments to track improvement</span></li>
                <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">Lifetime access + quarterly protocol updates</span></li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-4 sm:pt-6 mt-auto">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#4a7c59] mb-1 sm:mb-2 text-center sm:text-left">$147</p>
              <p className="text-[10px] sm:text-xs text-[#5c7a70] mb-3 sm:mb-4 text-center sm:text-left">One-time payment • Lifetime access</p>
              <button 
                onClick={() => setActivePage('programs')}
                className="w-full bg-[#4a7c59] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold hover:bg-[#3a6347] transition-colors shadow-lg text-xs sm:text-sm md:text-base mb-2 min-h-[44px]"
              >
                GET FULL ACCESS →
              </button>
              <p className="text-[10px] sm:text-xs text-center text-[#5c7a70]">30-Day Money-Back Guarantee</p>
              <div className="flex items-center justify-center mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-500 flex-wrap gap-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                <span>247,000+ enrolled</span>
                <span className="mx-1 sm:mx-2">•</span>
                <span>68% completion rate</span>
              </div>
            </div>
          </RevealOnScroll>

          {/* TIER 3: PREMIUM COACHING */}
          <RevealOnScroll delay={200} className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 border border-gray-200 shadow-lg flex flex-col">
            <div className="mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold mb-3 sm:mb-4 mx-auto sm:mx-0">👑</div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#1a3c34] mb-2 text-center sm:text-left">PREMIUM COACHING</h3>
              <p className="text-[#5c7a70] text-xs sm:text-sm md:text-base mb-3 sm:mb-4 text-center sm:text-left">
                Perfect for: Executive performance, clinical optimization
              </p>
            </div>

            <div className="mb-4 sm:mb-6 flex-grow">
              <p className="text-xs sm:text-sm font-semibold text-[#1a3c34] mb-2 sm:mb-3">Everything in Complete Access, PLUS:</p>
              <ul className="space-y-2 text-xs sm:text-sm text-[#5c7a70]">
                <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">4x 45-min video consultations with certified cognitive coaches</span></li>
                <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">Personalized protocol adjustments based on your progress</span></li>
                <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">Priority email support</span></li>
                <li className="flex items-start"><Check className="w-3 h-3 sm:w-4 sm:h-4 text-[#4a7c59] mr-2 mt-0.5 flex-shrink-0" /> <span className="leading-relaxed">Advanced biomarker interpretation (if you track HRV, sleep, etc.)</span></li>
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-4 sm:pt-6 mt-auto">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#4a7c59] mb-1 sm:mb-2 text-center sm:text-left">$497</p>
              <p className="text-[10px] sm:text-xs text-[#5c7a70] mb-3 sm:mb-4 text-center sm:text-left">One-time payment • Lifetime access</p>
              <button 
                onClick={() => setActivePage('directory')}
                className="w-full bg-[#1a3c34] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold hover:bg-[#2a5c4f] transition-colors shadow-lg text-xs sm:text-sm md:text-base mb-2 min-h-[44px]"
              >
                BOOK CONSULTATION →
              </button>
              <p className="text-[10px] sm:text-xs text-center text-[#5c7a70]">30-Day Money-Back Guarantee</p>
            </div>
          </RevealOnScroll>
        </div>

        {/* What You Get Section */}
        <RevealOnScroll className="max-w-6xl mx-auto mb-12 sm:mb-16">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 shadow-lg border border-gray-100">
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1a3c34] mb-6 sm:mb-8 text-center">Inside the Complete Protocol</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div className="bg-[#eff2ef] rounded-xl p-4 sm:p-5 md:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4a7c59] text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-3 sm:mb-4 mx-auto sm:mx-0">🎯</div>
                <h4 className="font-bold text-[#1a3c34] mb-2 text-base sm:text-lg text-center sm:text-left">Personalized Dashboard</h4>
                <p className="text-xs sm:text-sm text-[#5c7a70] text-center sm:text-left leading-relaxed">Your cognitive profile, real-time score tracking, protocol reminders</p>
              </div>
              <div className="bg-[#eff2ef] rounded-xl p-4 sm:p-5 md:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4a7c59] text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-3 sm:mb-4 mx-auto sm:mx-0">📚</div>
                <h4 className="font-bold text-[#1a3c34] mb-2 text-base sm:text-lg text-center sm:text-left">Video Learning Library</h4>
                <p className="text-xs sm:text-sm text-[#5c7a70] text-center sm:text-left leading-relaxed">40+ modules (5-12 min each) covering dopamine systems, cortisol regulation, sleep architecture, and more</p>
              </div>
              <div className="bg-[#eff2ef] rounded-xl p-4 sm:p-5 md:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4a7c59] text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-3 sm:mb-4 mx-auto sm:mx-0">⏰</div>
                <h4 className="font-bold text-[#1a3c34] mb-2 text-base sm:text-lg text-center sm:text-left">Daily Protocol Stack</h4>
                <p className="text-xs sm:text-sm text-[#5c7a70] text-center sm:text-left leading-relaxed">Auto-generated from your cognitive profile: morning, midday, and evening routines</p>
              </div>
              <div className="bg-[#eff2ef] rounded-xl p-4 sm:p-5 md:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4a7c59] text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-3 sm:mb-4 mx-auto sm:mx-0">👥</div>
                <h4 className="font-bold text-[#1a3c34] mb-2 text-base sm:text-lg text-center sm:text-left">Community Access</h4>
                <p className="text-xs sm:text-sm text-[#5c7a70] text-center sm:text-left leading-relaxed">Private forum with 12,000+ members, weekly Q&A sessions, accountability partners</p>
              </div>
              <div className="bg-[#eff2ef] rounded-xl p-4 sm:p-5 md:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4a7c59] text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-3 sm:mb-4 mx-auto sm:mx-0">📊</div>
                <h4 className="font-bold text-[#1a3c34] mb-2 text-base sm:text-lg text-center sm:text-left">Progress Tracking</h4>
                <p className="text-xs sm:text-sm text-[#5c7a70] text-center sm:text-left leading-relaxed">Monthly reassessments, score improvement graphs, protocol adherence analytics</p>
              </div>
              <div className="bg-[#eff2ef] rounded-xl p-4 sm:p-5 md:p-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4a7c59] text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold mb-3 sm:mb-4 mx-auto sm:mx-0">💬</div>
                <h4 className="font-bold text-[#1a3c34] mb-2 text-base sm:text-lg text-center sm:text-left">Optional Add-On</h4>
                <p className="text-xs sm:text-sm text-[#5c7a70] text-center sm:text-left leading-relaxed">1:1 Specialist Matching - Book consultations with certified cognitive coaches ($97-$247 per session)</p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Payment Options */}
        <RevealOnScroll className="max-w-4xl mx-auto mb-12 sm:mb-16">
          <div className="bg-[#1a3c34] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-center">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Payment Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm md:text-base">
              <div className="flex items-center justify-center sm:justify-start">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a7c59] mr-2 flex-shrink-0" />
                <span className="text-center sm:text-left">HSA/FSA Accepted</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a7c59] mr-2 flex-shrink-0" />
                <span className="text-center sm:text-left">Insurance Reimbursement Support</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a7c59] mr-2 flex-shrink-0" />
                <span className="text-center sm:text-left">Payment Plans Available</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start">
                <Check className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a7c59] mr-2 flex-shrink-0" />
                <span className="text-center sm:text-left">Corporate Wellness Packages</span>
              </div>
            </div>
            <p className="text-sm text-gray-300 mt-4">We provide documentation for insurance reimbursement. ~60% of users who submit get partial or full reimbursement.</p>
          </div>
        </RevealOnScroll>

        {/* Hybrid Option Section */}
        <RevealOnScroll className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-[#4a7c59] to-[#3a6347] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 text-center text-white shadow-xl">
            <div className="text-3xl sm:text-4xl mb-4">💡</div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">Want The Best Of Both Worlds?</h3>
            <p className="text-base sm:text-lg mb-6 text-white/90 max-w-2xl mx-auto">
              Combine programs with specialist support for faster, more personalized results
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-6 inline-block">
              <p className="text-2xl sm:text-3xl font-bold mb-2">HYBRID PACKAGES</p>
              <p className="text-lg sm:text-xl">start at $747</p>
              <p className="text-sm text-white/80 mt-2">(program + 3 specialist sessions)</p>
            </div>
            <button 
              onClick={() => setActivePage('programs')}
              className="bg-white text-[#4a7c59] px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg text-sm sm:text-base"
            >
              EXPLORE HYBRID OPTIONS →
            </button>
          </div>
        </RevealOnScroll>

        {/* Trust Bar */}
        <div className="mt-12 sm:mt-16 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-[#5c7a70] font-medium">
          <div className="flex items-center">
            <ShieldCheck className="w-4 h-4 text-[#4a7c59] mr-1" />
            <span>30-Day Money-Back Guarantee</span>
          </div>
          <span>•</span>
          <span>Instant Access</span>
          <span>•</span>
          <span>Lifetime Updates</span>
          <span>•</span>
          <span>Insurance Accepted</span>
        </div>
      </div>
    </section>
  );
};

const CategoryExplorer = () => {
  const categories = [
    { title: "Mental Health & Wellbeing", items: ["Stress Management", "Anxiety Relief", "Depression & Mood", "Emotional Intelligence", "Trauma Recovery", "Burnout Prevention"] },
    { title: "Cognitive Performance", items: ["Focus & Attention", "Memory & Learning", "Productivity", "Executive Function", "Brain Fog", "Decision Making"] },
    { title: "Brain Optimization", items: ["Peak Performance", "Flow States", "Nootropics", "Habit Formation", "Creativity", "Neuroplasticity"] }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-[#eff2ef] border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a3c34] mb-3 sm:mb-4">Explore All Assessments</h2>
          <p className="text-[#5c7a70] text-sm sm:text-base">Browse our library of 74 specialized categories.</p>
        </div>

        {/* Mock Search Bar */}
        <div className="max-w-md mx-auto mb-10 sm:mb-12 md:mb-16 relative px-2">
          <input 
            type="text" 
            placeholder="Search for a specific brain health topic..." 
            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-full border border-gray-300 focus:outline-none focus:border-[#4a7c59] shadow-sm text-sm sm:text-base"
          />
          <Search className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5"/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12">
          {categories.map((cat, i) => (
            <div key={i}>
              <h3 className="font-bold text-[#1a3c34] text-lg mb-6 border-b-2 border-[#4a7c59] pb-2 inline-block">{cat.title}</h3>
              <ul className="space-y-3">
                {cat.items.map((item, j) => (
                  <li key={j} className="flex items-center text-[#5c7a70] hover:text-[#1a3c34] cursor-pointer transition-colors group">
                    <div className="w-4 h-4 border border-gray-300 rounded mr-3 group-hover:border-[#4a7c59] group-hover:bg-[#4a7c59] transition-all"></div>
                    {item}
                  </li>
                ))}
              </ul>
              <button className="mt-6 text-sm font-bold text-[#4a7c59] hover:text-[#1a3c34] flex items-center">
                View More <ChevronRight className="w-3 h-3 ml-1"/>
              </button>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="bg-white border border-gray-300 text-[#1a3c34] px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors">
            View All 74 Categories
          </button>
        </div>
      </div>
    </section>
  );
};

/**
 * Privacy Policy Page
 */
const PrivacyPolicy = ({ setActivePage }) => {
  return (
    <div className="pt-14 sm:pt-16 md:pt-20 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <button 
          onClick={() => setActivePage('home')}
          className="text-[#4a7c59] hover:text-[#1a3c34] mb-8 flex items-center text-sm sm:text-base"
        >
          <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
          Back to Home
        </button>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a3c34] mb-6 sm:mb-8">Privacy Policy</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-8">Last updated: [PLACEHOLDER: Date]</p>
        
        <div className="prose prose-sm sm:prose-base max-w-none space-y-8 text-[#5c7a70]">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">1. Information We Collect</h2>
            <p className="mb-4">We collect the following types of information:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Quiz Responses:</strong> Your answers to assessment questions, which help us generate your cognitive profile</li>
              <li><strong>Email Address:</strong> If you choose to receive your results or subscribe to our newsletter</li>
              <li><strong>Usage Analytics:</strong> Anonymous data about how you interact with our website (pages viewed, time spent, etc.)</li>
              <li><strong>Device Information:</strong> Browser type, operating system, and device type for technical optimization</li>
            </ul>
            <p className="text-sm text-gray-600 italic">[PLACEHOLDER: Add any additional data collection methods specific to your implementation]</p>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Personalization:</strong> To generate your personalized cognitive profile and recommendations</li>
              <li><strong>Service Improvement:</strong> To analyze patterns and improve our assessment accuracy</li>
              <li><strong>Research:</strong> Aggregated, anonymized data may be used for scientific research (no personally identifiable information)</li>
              <li><strong>Communication:</strong> To send you your results and relevant educational content (if you opt in)</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">3. Data Sharing and Access</h2>
            <p className="mb-4"><strong>We do NOT sell your data.</strong> Your information is accessed only by:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Our internal team members who need access to provide services</li>
              <li>Service providers who help us operate (hosting, analytics) under strict confidentiality agreements</li>
            </ul>
            <p className="mb-4"><strong>We never share your data with:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Advertising partners or third-party marketers</li>
              <li>Data brokers or analytics companies for their own use</li>
              <li>Other users or public forums</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">4. Your Rights</h2>
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Access:</strong> Request a copy of all data we have about you</li>
              <li><strong>Deletion:</strong> Request that we delete your personal information</li>
              <li><strong>Portability:</strong> Request your data in a machine-readable format</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
            </ul>
            <p className="text-sm">To exercise these rights, contact us at: <a href="mailto:privacy@cogcare.com" className="text-[#4a7c59] hover:underline">privacy@cogcare.com</a></p>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">5. Data Retention</h2>
            <p className="mb-4">We retain your information for:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Active Users:</strong> As long as your account is active or as needed to provide services</li>
              <li><strong>Inactive Users:</strong> Up to 3 years after last activity, then anonymized</li>
              <li><strong>Legal Requirements:</strong> As required by law or to resolve disputes</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">6. Cookies and Tracking</h2>
            <p className="mb-4">We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Remember your preferences and settings</li>
              <li>Analyze website traffic and usage patterns (anonymized)</li>
              <li>Improve website functionality</li>
            </ul>
            <p className="mb-4">You can control cookies through your browser settings. Note: Disabling cookies may affect website functionality.</p>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">7. Data Security</h2>
            <p className="mb-4">We protect your data using:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Encryption:</strong> AES-256 encryption for data at rest and in transit</li>
              <li><strong>Access Controls:</strong> Limited access to authorized personnel only</li>
              <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
              <li><strong>Compliance:</strong> HIPAA-level security standards where applicable</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">8. International Users</h2>
            <p className="mb-4">If you're located outside the United States, please note that:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Your data may be transferred to and processed in the United States</li>
              <li>We comply with GDPR requirements for EU users</li>
              <li>We comply with CCPA requirements for California residents</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">9. Children's Privacy</h2>
            <p className="mb-4">Our services are not intended for users under 18 years of age. We do not knowingly collect personal information from children.</p>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">10. Contact Us</h2>
            <p className="mb-4">For privacy concerns or questions, contact us at:</p>
            <ul className="list-none space-y-2 mb-4">
              <li><strong>Email:</strong> <a href="mailto:privacy@cogcare.com" className="text-[#4a7c59] hover:underline">privacy@cogcare.com</a></li>
              <li><strong>Address:</strong> [PLACEHOLDER: Company Address]</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

/**
 * Terms of Service Page
 */
const TermsOfService = ({ setActivePage }) => {
  return (
    <div className="pt-14 sm:pt-16 md:pt-20 min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <button 
          onClick={() => setActivePage('home')}
          className="text-[#4a7c59] hover:text-[#1a3c34] mb-8 flex items-center text-sm sm:text-base"
        >
          <ChevronRight className="w-4 h-4 mr-1 rotate-180" />
          Back to Home
        </button>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a3c34] mb-6 sm:mb-8">Terms of Service</h1>
        <p className="text-sm sm:text-base text-gray-600 mb-8">Last updated: [PLACEHOLDER: Date]</p>
        
        <div className="prose prose-sm sm:prose-base max-w-none space-y-8 text-[#5c7a70]">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">1. Service Description</h2>
            <p className="mb-4">CogCare provides educational wellness information, cognitive assessments, and personalized optimization protocols. Our services include:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Online cognitive assessments and quizzes</li>
              <li>Personalized cognitive profiles and recommendations</li>
              <li>Educational content about brain health and optimization</li>
              <li>Optional paid programs with detailed protocols and resources</li>
            </ul>
            <p className="mb-4"><strong>Important:</strong> CogCare is not a medical service and does not provide medical advice, diagnosis, or treatment.</p>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">2. Service Limitations</h2>
            <p className="mb-4">Our services are designed for:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Educational and informational purposes</li>
              <li>General wellness optimization</li>
              <li>Complementing (not replacing) professional medical care</li>
            </ul>
            <p className="mb-4"><strong>Our services are NOT:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>A substitute for professional medical advice, diagnosis, or treatment</li>
              <li>Intended to treat, cure, or prevent any medical condition</li>
              <li>Emergency medical services</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">3. User Responsibilities</h2>
            <p className="mb-4">By using our services, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Provide accurate and truthful information in assessments</li>
              <li>Use our services only for lawful purposes</li>
              <li>Not share your account credentials with others</li>
              <li>Consult with healthcare providers for medical concerns</li>
              <li>Not use our services if you are experiencing a medical emergency</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">4. Intellectual Property Rights</h2>
            <p className="mb-4">All content on CogCare, including:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Assessment questions and methodologies</li>
              <li>Educational content and protocols</li>
              <li>Website design and functionality</li>
              <li>Trademarks and logos</li>
            </ul>
            <p className="mb-4">...are owned by CogCare or our licensors and protected by copyright, trademark, and other intellectual property laws.</p>
            <p className="mb-4">You may not reproduce, distribute, modify, or create derivative works without our written permission.</p>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">5. Limitation of Liability</h2>
            <p className="mb-4"><strong>Medical Disclaimer:</strong> CogCare provides educational information only. We are not liable for:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Any health outcomes or medical decisions made based on our content</li>
              <li>Misinterpretation of assessment results</li>
              <li>Failure to seek appropriate medical care</li>
              <li>Any adverse effects from implementing our protocols without medical supervision</li>
            </ul>
            <p className="mb-4"><strong>Service Availability:</strong> We are not liable for:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Service interruptions or technical issues</li>
              <li>Loss of data due to technical failures</li>
              <li>Inaccuracies in assessment results (though we strive for accuracy)</li>
            </ul>
            <p className="mb-4">To the maximum extent permitted by law, our total liability is limited to the amount you paid for our services in the 12 months preceding the claim.</p>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">6. Payment and Refunds</h2>
            <p className="mb-4"><strong>Payment:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Payment is required before accessing paid programs</li>
              <li>All prices are in USD unless otherwise stated</li>
              <li>We accept major credit cards and other payment methods as displayed</li>
            </ul>
            <p className="mb-4"><strong>Refunds:</strong></p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>30-day money-back guarantee for paid programs</li>
              <li>Refund requests must be submitted within 30 days of purchase</li>
              <li>Refunds will be processed to the original payment method</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">7. Account Termination</h2>
            <p className="mb-4">We reserve the right to terminate or suspend your account if you:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Violate these Terms of Service</li>
              <li>Engage in fraudulent or illegal activity</li>
              <li>Misuse our services or content</li>
              <li>Provide false information</li>
            </ul>
            <p className="mb-4">You may terminate your account at any time by contacting us or deleting your account through our platform.</p>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">8. Dispute Resolution</h2>
            <p className="mb-4"><strong>Governing Law:</strong> These terms are governed by the laws of [PLACEHOLDER: State/Country].</p>
            <p className="mb-4"><strong>Dispute Resolution:</strong> Any disputes will be resolved through:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Good faith negotiation between parties</li>
              <li>If negotiation fails, binding arbitration in accordance with [PLACEHOLDER: Arbitration Rules]</li>
              <li>Class action waivers apply</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">9. Changes to Terms</h2>
            <p className="mb-4">We may update these Terms of Service from time to time. We will notify you of material changes by:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Posting the updated terms on our website</li>
              <li>Sending an email notification (if you have an account)</li>
              <li>Displaying a notice on our platform</li>
            </ul>
            <p className="mb-4">Continued use of our services after changes constitutes acceptance of the new terms.</p>
          </section>
          
          <section>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3c34] mb-4">10. Contact Information</h2>
            <p className="mb-4">For questions about these terms, contact us at:</p>
            <ul className="list-none space-y-2 mb-4">
              <li><strong>Email:</strong> <a href="mailto:legal@cogcare.com" className="text-[#4a7c59] hover:underline">legal@cogcare.com</a></li>
              <li><strong>Address:</strong> [PLACEHOLDER: Company Address]</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

const Footer = ({ setActivePage }) => {
  return (
    <footer className="bg-[#1a3c34] text-[10px] sm:text-xs text-[#8fb89c] py-12 sm:py-16 md:py-20 px-4 sm:px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Quick Assessments</h4>
          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer transition-colors">Focus & Concentration</li>
            <li className="hover:text-white cursor-pointer transition-colors">Sleep Quality</li>
            <li className="hover:text-white cursor-pointer transition-colors">Anxiety Relief</li>
            <li className="hover:text-white cursor-pointer transition-colors">Brain Fog</li>
            <li className="hover:text-white cursor-pointer transition-colors">Memory Test</li>
            <li className="hover:text-white cursor-pointer transition-colors">Stress Calculator</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Popular Categories</h4>
          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer transition-colors">ADHD</li>
            <li className="hover:text-white cursor-pointer transition-colors">Depression & Mood</li>
            <li className="hover:text-white cursor-pointer transition-colors">Peak Performance</li>
            <li className="hover:text-white cursor-pointer transition-colors">Women's Brain Health</li>
            <li className="hover:text-white cursor-pointer transition-colors">Cognitive Aging</li>
            <li className="hover:text-white cursor-pointer transition-colors">Habit Formation</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Programs</h4>
          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer transition-colors">Deep Work & Cognitive Control</li>
            <li className="hover:text-white cursor-pointer transition-colors">Vagus Nerve Reset</li>
            <li className="hover:text-white cursor-pointer transition-colors">Brain Longevity Blueprint</li>
            <li className="hover:text-white cursor-pointer transition-colors">Anxiety Protocols</li>
            <li className="hover:text-white cursor-pointer transition-colors text-[#4a7c59]">View all programs →</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Resources</h4>
          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer transition-colors">Blog</li>
            <li className="hover:text-white cursor-pointer transition-colors">Research Library</li>
            <li className="hover:text-white cursor-pointer transition-colors">Success Stories</li>
            <li className="hover:text-white cursor-pointer transition-colors">Our Methodology</li>
          </ul>
        </div>
        <div>
           <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Company</h4>
           <ul className="space-y-2">
             <li className="hover:text-white cursor-pointer transition-colors">About Us</li>
             <li className="hover:text-white cursor-pointer transition-colors">Contact</li>
             <li 
               onClick={() => setActivePage('privacy')}
               className="hover:text-white cursor-pointer transition-colors"
             >
               Privacy Policy
             </li>
             <li 
               onClick={() => setActivePage('terms')}
               className="hover:text-white cursor-pointer transition-colors"
             >
               Terms of Service
             </li>
             <li className="hover:text-white cursor-pointer transition-colors">Affiliate Program</li>
           </ul>
        </div>
      </div>
      
      {/* Privacy & Data Security in Footer */}
      <div className="max-w-7xl mx-auto mt-6 sm:mt-8 md:mt-10 pt-4 sm:pt-6 md:pt-8 border-t border-[#2a5c4f] px-2">
        <div className="bg-[#2a5c4f] rounded-lg p-3 sm:p-4 md:p-5 mb-3 sm:mb-4 md:mb-6">
          <div className="flex items-start">
            <Lock className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3 mt-0.5 flex-shrink-0 text-[#4a7c59]" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm md:text-base font-bold text-white mb-2 sm:mb-3">🔒 Your Data is Private & Secure</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm text-[#8fb89c]">
                <div className="flex items-start">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#4a7c59] flex-shrink-0 mt-0.5" />
                  <span className="leading-tight break-words">HIPAA-Level Encryption (AES-256)</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#4a7c59] flex-shrink-0 mt-0.5" />
                  <span className="leading-tight break-words">Zero Data Selling - Never shared with advertisers</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#4a7c59] flex-shrink-0 mt-0.5" />
                  <span className="leading-tight break-words">Anonymous Results - No personally identifiable information required</span>
                </div>
                <div className="flex items-start">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#4a7c59] flex-shrink-0 mt-0.5" />
                  <span className="leading-tight break-words">GDPR & CCPA Compliant</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm mt-3 sm:mt-4">
                <button 
                  onClick={() => setActivePage('privacy')}
                  className="text-[#8fb89c] hover:text-white underline font-medium"
                >
                  View Privacy Policy
                </button>
                <span className="text-[#5c7a70] hidden sm:inline">•</span>
                <button 
                  onClick={() => setActivePage('privacy')}
                  className="text-[#8fb89c] hover:text-white underline font-medium"
                >
                  Data Security Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Medical Disclaimer in Footer */}
      <div className="max-w-7xl mx-auto pt-4 sm:pt-6 md:pt-8 border-t border-[#2a5c4f] px-2">
        <div className="bg-amber-900/30 border-l-4 border-amber-400 p-3 sm:p-4 md:p-5 rounded-r-lg">
          <div className="flex items-start">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-amber-400 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-xs md:text-sm font-semibold text-amber-100 mb-2 leading-relaxed">
                ⚠️ Important: CogCare provides educational wellness information and is not a substitute for professional medical advice, diagnosis, or treatment.
              </p>
              <p className="text-[10px] sm:text-xs md:text-sm text-amber-200 mb-2 sm:mb-3 leading-relaxed">
                If you're experiencing severe symptoms, suicidal thoughts, or mental health crisis, contact a healthcare provider immediately.
              </p>
              <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-4 text-[10px] sm:text-xs text-amber-200">
                <a href="tel:988" className="flex items-center hover:text-amber-100 font-medium break-all">
                  🇺🇸 US: 988 Suicide & Crisis Lifeline
                </a>
                <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-amber-100 font-medium break-all">
                  🌍 International: Find local resources at findahelpline.com
                  <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-6 md:pt-8 border-t border-[#2a5c4f] flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4 px-2">
        <div className="flex items-center space-x-2 text-white font-semibold">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a7c59]" />
            <span className="text-xs sm:text-sm md:text-base">CogCare</span>
        </div>
        <p className="text-[9px] sm:text-[10px] md:text-xs lg:text-sm text-center md:text-left leading-tight">© 2026 Cognitive Care Alliance Inc All rights reserved.</p>
      </div>
    </footer>
  );
};

export default App;