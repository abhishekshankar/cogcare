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
  Filter
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
      className={`transition-all duration-1000 ease-out transform ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
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

        <button className="w-full bg-[#1a3c34] text-white py-2.5 sm:py-3 rounded-full font-bold hover:bg-[#2a5c4f] transition-colors shadow-lg text-sm sm:text-base">
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
          
          <div className="group relative cursor-pointer h-16 flex items-center">
            <span className="hover:text-[#1a3c34] transition-colors flex items-center">
              Assessments <ChevronRight className="w-3 h-3 ml-1 rotate-90" />
            </span>
            {/* Mega Menu Mockup */}
            <div className="absolute top-14 left-1/2 -translate-x-1/2 w-[600px] bg-white rounded-xl shadow-xl p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100 grid grid-cols-3 gap-6 z-50">
               <div>
                 <p className="text-xs font-bold text-[#4a7c59] uppercase mb-3">Quick Diagnostics</p>
                 <ul className="space-y-2 text-xs text-gray-600">
                   <li className="hover:text-[#1a3c34] hover:underline">Focus & Concentration</li>
                   <li className="hover:text-[#1a3c34] hover:underline">Sleep Quality</li>
                   <li className="hover:text-[#1a3c34] hover:underline">Anxiety Type</li>
                   <li className="hover:text-[#1a3c34] hover:underline">Brain Fog Detector</li>
                 </ul>
               </div>
               <div>
                 <p className="text-xs font-bold text-[#4a7c59] uppercase mb-3">System Assessments</p>
                 <ul className="space-y-2 text-xs text-gray-600">
                   <li className="hover:text-[#1a3c34] hover:underline">Cognitive Performance</li>
                   <li className="hover:text-[#1a3c34] hover:underline">Emotional Brain</li>
                   <li className="hover:text-[#1a3c34] hover:underline">Brain-Body Connect</li>
                 </ul>
               </div>
               <div>
                 <p className="text-xs font-bold text-[#4a7c59] uppercase mb-3">Comprehensive</p>
                 <ul className="space-y-2 text-xs text-gray-600">
                   <li className="hover:text-[#1a3c34] hover:underline font-bold">Brain Wellness Quiz</li>
                   <li className="text-[10px] text-gray-400">15-minute full analysis</li>
                 </ul>
               </div>
            </div>
          </div>
          <a href="#courses" className="hover:text-[#1a3c34] transition-colors">Courses</a>
          
          <button className="bg-[#1a3c34] text-white px-5 py-2 rounded-full hover:bg-[#2a5c4f] transition-colors shadow-lg shadow-[#1a3c34]/10 text-xs font-bold">
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
          <a href="#assessments" className="text-[#1a3c34] font-medium py-2 text-base">Assessments</a>
          <a href="#courses" className="text-[#1a3c34] font-medium py-2 text-base">Courses</a>
          <button className="bg-[#1a3c34] text-white px-4 py-3.5 rounded-full w-full text-base font-medium mt-2">
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
              <select className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4a7c59] appearance-none text-[#1a3c34] font-medium">
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
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:border-[#4a7c59] text-[#1a3c34]"
              />
            </div>
            <button className="bg-[#1a3c34] hover:bg-[#2a5c4f] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold transition-colors whitespace-nowrap text-sm sm:text-base">
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
                  className="bg-[#4a7c59] text-white px-6 py-3 rounded-full font-bold hover:bg-[#3a6347] transition-all flex items-center justify-center"
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
                <button key={tab} className="px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-white text-[#5c7a70] border border-gray-200 hover:border-[#1a3c34] hover:text-[#1a3c34] transition-all whitespace-nowrap flex-shrink-0">
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
                  <button className="py-2 rounded-xl border border-gray-200 text-[#1a3c34] font-bold text-xs hover:bg-gray-50">View Profile</button>
                  <button className="py-2 rounded-xl bg-[#1a3c34] text-white font-bold text-xs hover:bg-[#2a5c4f]">Book Now</button>
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
            <button className="bg-[#1a3c34] text-white px-8 py-4 rounded-full font-bold hover:bg-[#2a5c4f] transition-all shadow-lg">
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
             <button className="bg-[#4a7c59] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold hover:bg-[#3a6347] text-sm sm:text-base whitespace-nowrap">Search</button>
          </div>
        </div>
      </section>
    </div>
  );
};

/* =========================================
   MAIN APP COMPONENT
   ========================================= */

const App = () => {
  // Router State: 'home' | 'directory'
  const [activePage, setActivePage] = useState('home');

  return (
    <div className="bg-[#eff2ef] min-h-screen text-[#1a3c34] selection:bg-[#4a7c59] selection:text-white font-sans antialiased">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      
      {activePage === 'home' && (
        <>
          <Hero />
          <TrustSection />
          {/* <HowItWorksSimple />  <-- Keeping simple for home */}
          <WhyItWorks />
          <SampleResultPreview />
          <DetailedJourney />
          <Testimonials />
          <BrainScore />
          <CategoryExplorer />
          <Pricing />
        </>
      )}

      {activePage === 'directory' && (
        <ProfessionalDirectory setActivePage={setActivePage} />
      )}

      <Footer />
      <ExitIntentPopup />
    </div>
  );
};

// ... (Rest of existing components: Hero, TrustSection, etc. remain unchanged below)
// ... (Including them here for completeness of the Single File)

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-[#eff2ef] overflow-hidden pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-gradient-to-r from-white/80 via-[#dce6dc]/50 to-[#c8d9c8]/30 rounded-full blur-[100px] opacity-80 animate-pulse pointer-events-none" />
      <RevealOnScroll className="z-10 text-center px-4 sm:px-6 max-w-6xl mx-auto w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1a3c34] tracking-tight mb-4 sm:mb-6 leading-tight max-w-4xl mx-auto">
          What's Keeping Your Brain<br className="hidden sm:block"/> From Working at Its Best?
        </h1>
        <p className="text-[#5c7a70] text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed mb-8 sm:mb-10 md:mb-12 px-2">
          Find out in 3-5 minutes with a science-backed assessment. <br className="hidden sm:block"/>
          Over 247,000 people have discovered their brain's hidden patterns.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-8 sm:mb-10 text-left">
          <div className="group bg-white hover:bg-[#1a3c34] hover:text-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-transparent hover:border-[#1a3c34] shadow-sm hover:shadow-xl transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <Target className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 group-hover:text-white" />
              <span className="text-[10px] sm:text-xs font-bold bg-gray-100 group-hover:bg-white/20 group-hover:text-white text-gray-500 px-2 py-1 rounded-full">4 min</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#1a3c34] group-hover:text-white mb-2">Can't Focus</h3>
            <p className="text-[#5c7a70] group-hover:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4">"I can't stay on task or finish projects."</p>
            <div className="flex items-center text-[10px] sm:text-xs font-bold text-[#4a7c59] group-hover:text-[#8fb89c]">START QUIZ <ArrowRight className="w-3 h-3 ml-1" /></div>
          </div>
          <div className="group bg-white hover:bg-[#1a3c34] hover:text-white rounded-2xl p-6 border border-transparent hover:border-[#1a3c34] shadow-sm hover:shadow-xl transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <Activity className="w-8 h-8 text-orange-500 group-hover:text-white" />
              <span className="text-xs font-bold bg-gray-100 group-hover:bg-white/20 group-hover:text-white text-gray-500 px-2 py-1 rounded-full">5 min</span>
            </div>
            <h3 className="text-xl font-bold text-[#1a3c34] group-hover:text-white mb-2">Anxiety</h3>
            <p className="text-[#5c7a70] group-hover:text-gray-300 text-sm mb-4">"Constantly worried or on edge."</p>
            <div className="flex items-center text-xs font-bold text-[#4a7c59] group-hover:text-[#8fb89c]">START QUIZ <ArrowRight className="w-3 h-3 ml-1" /></div>
          </div>
          <div className="group bg-white hover:bg-[#1a3c34] hover:text-white rounded-2xl p-6 border border-transparent hover:border-[#1a3c34] shadow-sm hover:shadow-xl transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <Moon className="w-8 h-8 text-indigo-500 group-hover:text-white" />
              <span className="text-xs font-bold bg-gray-100 group-hover:bg-white/20 group-hover:text-white text-gray-500 px-2 py-1 rounded-full">3 min</span>
            </div>
            <h3 className="text-xl font-bold text-[#1a3c34] group-hover:text-white mb-2">Sleep Issues</h3>
            <p className="text-[#5c7a70] group-hover:text-gray-300 text-sm mb-4">"Can't fall or stay asleep."</p>
            <div className="flex items-center text-xs font-bold text-[#4a7c59] group-hover:text-[#8fb89c]">START QUIZ <ArrowRight className="w-3 h-3 ml-1" /></div>
          </div>
          <div className="group bg-white hover:bg-[#1a3c34] hover:text-white rounded-2xl p-6 border border-transparent hover:border-[#1a3c34] shadow-sm hover:shadow-xl transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <CloudFog className="w-8 h-8 text-gray-500 group-hover:text-white" />
              <span className="text-xs font-bold bg-gray-100 group-hover:bg-white/20 group-hover:text-white text-gray-500 px-2 py-1 rounded-full">4 min</span>
            </div>
            <h3 className="text-xl font-bold text-[#1a3c34] group-hover:text-white mb-2">Brain Fog</h3>
            <p className="text-[#5c7a70] group-hover:text-gray-300 text-sm mb-4">"Mental clarity feels impossible."</p>
            <div className="flex items-center text-xs font-bold text-[#4a7c59] group-hover:text-[#8fb89c]">START QUIZ <ArrowRight className="w-3 h-3 ml-1" /></div>
          </div>
          <div className="group bg-white hover:bg-[#1a3c34] hover:text-white rounded-2xl p-6 border border-transparent hover:border-[#1a3c34] shadow-sm hover:shadow-xl transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <Battery className="w-8 h-8 text-yellow-500 group-hover:text-white" />
              <span className="text-xs font-bold bg-gray-100 group-hover:bg-white/20 group-hover:text-white text-gray-500 px-2 py-1 rounded-full">3 min</span>
            </div>
            <h3 className="text-xl font-bold text-[#1a3c34] group-hover:text-white mb-2">Low Energy</h3>
            <p className="text-[#5c7a70] group-hover:text-gray-300 text-sm mb-4">"Always tired and drained."</p>
            <div className="flex items-center text-xs font-bold text-[#4a7c59] group-hover:text-[#8fb89c]">START QUIZ <ArrowRight className="w-3 h-3 ml-1" /></div>
          </div>
          <div className="group bg-white hover:bg-[#1a3c34] hover:text-white rounded-2xl p-6 border border-transparent hover:border-[#1a3c34] shadow-sm hover:shadow-xl transition-all cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <Smile className="w-8 h-8 text-blue-400 group-hover:text-white" />
              <span className="text-xs font-bold bg-gray-100 group-hover:bg-white/20 group-hover:text-white text-gray-500 px-2 py-1 rounded-full">4 min</span>
            </div>
            <h3 className="text-xl font-bold text-[#1a3c34] group-hover:text-white mb-2">Mood Problems</h3>
            <p className="text-[#5c7a70] group-hover:text-gray-300 text-sm mb-4">"Feeling down or unstable."</p>
            <div className="flex items-center text-xs font-bold text-[#4a7c59] group-hover:text-[#8fb89c]">START QUIZ <ArrowRight className="w-3 h-3 ml-1" /></div>
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
    <section className="bg-white py-8 sm:py-12 border-b border-gray-100">
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
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 shadow-lg border border-gray-100">
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
              <div className="bg-[#1a3c34] rounded-2xl p-6 shadow-sm text-white">
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
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-200">
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
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 sm:p-6 rounded-r-xl mb-6 sm:mb-8"><p className="text-xs sm:text-sm font-bold text-yellow-900 mb-2">Why most brain training fails:</p><p className="text-xs sm:text-sm text-yellow-800">You take a course, feel motivated for a week, then slide back. CogCare is different because we <strong>measure</strong> if it's actually working.</p></div>
            <div className="space-y-3 sm:space-y-4 mb-8 sm:mb-10">
              <div className="flex items-start"><div className="bg-[#4a7c59] rounded-full p-1 mr-4 mt-1"><Check className="w-3 h-3 text-white" /></div><div><h4 className="font-bold text-[#1a3c34]">Proof that works</h4><p className="text-sm text-[#5c7a70]">See your improvement in real numbers, not just feelings.</p></div></div>
              <div className="flex items-start"><div className="bg-[#4a7c59] rounded-full p-1 mr-4 mt-1"><Check className="w-3 h-3 text-white" /></div><div><h4 className="font-bold text-[#1a3c34]">Accountability that sticks</h4><p className="text-sm text-[#5c7a70]">Monthly check-ins keep you on track.</p></div></div>
            </div>
          </RevealOnScroll>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <RevealOnScroll delay={200} className="relative w-full max-w-[280px] sm:max-w-sm">
             <div className="bg-[#1a3c34] border-[6px] sm:border-[8px] border-[#1a3c34] rounded-[2rem] sm:rounded-[3rem] p-1.5 sm:p-2 shadow-2xl shadow-[#1a3c34]/30 relative z-10 overflow-hidden h-[500px] sm:h-[600px]">
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

const Testimonials = () => {
  const [activeTab, setActiveTab] = useState('focus');
  const testimonials = {
    focus: [{ name: "Sarah K.", role: "Marketing Director", quote: "I've struggled with focus my entire adult life. This quiz nailed my 'Scattered Starter' profile perfectly. The protocol actually works." }, { name: "Michael R.", role: "Software Engineer", quote: "Finally found something that explains my distraction patterns without just saying 'try harder'. Highly recommend." }],
    anxiety: [{ name: "James L.", role: "Teacher", quote: "I didn't realize my anxiety was physical until I took the Neuro-Calm assessment. The breathing protocols changed everything." }, { name: "Elena D.", role: "Artist", quote: "Validation. That's what I felt. Finally understanding WHY I feel on edge was the first step to fixing it." }],
    sleep: [{ name: "Robert T.", role: "Executive", quote: "I thought I just had 'bad sleep'. Turns out I had a cortisol rhythm issue. Fixed it in 2 weeks." }, { name: "Anita P.", role: "Nurse", quote: "Shift work destroyed my sleep. The Circadian Reset protocol from the quiz results saved my career." }]
  };
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center text-[#1a3c34] mb-3 sm:mb-4">Success Stories</h2>
        <p className="text-center text-[#5c7a70] text-sm sm:text-base md:text-lg mb-8 sm:mb-10 md:mb-12">Read stories from people who faced the same problem as you.</p>
        <div className="flex justify-center gap-2 sm:gap-3 md:gap-4 mb-8 sm:mb-10 md:mb-12 flex-wrap px-2">
          {['focus', 'anxiety', 'sleep'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-[#1a3c34] text-white shadow-lg' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{tab === 'focus' ? 'Focus & ADHD' : tab}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {testimonials[activeTab].map((t, i) => (
            <div key={i} className="bg-[#eff2ef] rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-transparent hover:border-[#1a3c34]/10 transition-all">
              <div className="flex items-center mb-3 sm:mb-4"><div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1a3c34] rounded-full flex items-center justify-center text-white font-bold mr-2 sm:mr-3 text-sm sm:text-base">{t.name.charAt(0)}</div><div><p className="font-bold text-[#1a3c34] text-xs sm:text-sm">{t.name}</p><p className="text-[10px] sm:text-xs text-[#5c7a70]">{t.role}</p></div></div>
              <p className="text-[#1a3c34] text-sm sm:text-base md:text-lg italic leading-relaxed">"{t.quote}"</p>
              <div className="mt-3 sm:mt-4 flex text-yellow-400"><Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" /><Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" /><Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" /><Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" /><Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" /></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Pricing = () => {
  return (
    <section id="pricing" className="bg-[#1a3c34] py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <RevealOnScroll>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-6 sm:mb-8">Invest in your infrastructure.</h2>
          <div className="bg-white/10 border border-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-2xl mx-auto mb-10 sm:mb-12 md:mb-16 text-center backdrop-blur-sm">
            <ShieldCheck className="w-10 h-10 sm:w-12 sm:h-12 text-[#8fb89c] mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">30-Day Money-Back Guarantee</h3>
            <p className="text-gray-300 text-xs sm:text-sm">Complete the first 5 modules. If your focus doesn't improve, we'll refund 100%—no questions asked.</p>
          </div>
        </RevealOnScroll>
        <div className="max-w-4xl mx-auto mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-[10px] sm:text-xs text-center opacity-80">
           <p className="text-white">Best for: One specific problem</p>
           <p className="text-[#4a7c59] font-bold bg-white px-2 py-1 rounded-full">Best for: Total Transformation</p>
           <p className="text-white">Best for: Ongoing maintenance</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <RevealOnScroll className="bg-[#2a5c4f] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-white/5 flex flex-col relative overflow-hidden">
             <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Single Course</h3>
             <div className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">$147</div>
             <p className="text-gray-300 text-xs sm:text-sm mb-6 sm:mb-8 flex-grow">Perfect for solving one specific problem immediately (e.g. Focus or Sleep).</p>
             <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-xs sm:text-sm text-gray-200">
               <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#8fb89c]"/> Lifetime Access</li>
               <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#8fb89c]"/> 4-Week Protocol</li>
               <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#8fb89c]"/> Basic Community Access</li>
             </ul>
             <button className="w-full py-2.5 sm:py-3 rounded-full bg-[#1a3c34] text-white font-medium hover:bg-[#132e27] transition-colors border border-white/10 text-sm sm:text-base">Select Course</button>
          </RevealOnScroll>
          <RevealOnScroll delay={100} className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-transparent flex flex-col relative overflow-hidden transform md:-translate-y-4 shadow-2xl">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#4a7c59] text-white text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-b-lg">MOST POPULAR</div>
             <h3 className="text-lg sm:text-xl font-semibold text-[#1a3c34] mb-2">Accelerator Bundle</h3>
             <div className="text-3xl sm:text-4xl font-bold text-[#1a3c34] mb-1">$497</div>
             <div className="text-[10px] sm:text-xs text-[#4a7c59] mb-4 sm:mb-6 font-medium">or $175/mo x 3</div>
             <p className="text-[#5c7a70] text-xs sm:text-sm mb-6 sm:mb-8 flex-grow">For those serious about total cognitive restructuring.</p>
             <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-xs sm:text-sm text-[#5c7a70]">
               <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#4a7c59]"/> 3 Courses of Choice</li>
               <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#4a7c59]"/> 3 Deep Dive Reports</li>
               <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#4a7c59]"/> 1 Consultation Session</li>
               <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#4a7c59]"/> Priority Support</li>
             </ul>
             <button className="w-full py-2.5 sm:py-3 rounded-full bg-[#1a3c34] text-white font-medium hover:bg-[#2a5c4f] transition-colors shadow-lg shadow-[#1a3c34]/20 text-sm sm:text-base">Start Accelerator</button>
          </RevealOnScroll>
          <RevealOnScroll delay={200} className="bg-[#2a5c4f] rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 border border-white/5 flex flex-col relative overflow-hidden">
             <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Brain Health Monthly</h3>
             <div className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">$47<span className="text-base sm:text-lg font-normal text-gray-400">/mo</span></div>
             <p className="text-gray-300 text-xs sm:text-sm mb-6 sm:mb-8 flex-grow">The gym membership for your brain.</p>
             <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 text-xs sm:text-sm text-gray-200">
               <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#8fb89c]"/> 1 New Course / Month</li>
               <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#8fb89c]"/> Unlimited Quiz Retakes</li>
               <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#8fb89c]"/> Score Tracking Dashboard</li>
               <li className="flex items-center"><Check className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-[#8fb89c]"/> Monthly Expert Q&A</li>
             </ul>
             <button className="w-full py-2.5 sm:py-3 rounded-full bg-[#1a3c34] text-white font-medium hover:bg-[#132e27] transition-colors border border-white/10 text-sm sm:text-base">Join Membership</button>
          </RevealOnScroll>
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

const Footer = () => {
  return (
    <footer className="bg-[#1a3c34] text-[10px] sm:text-xs text-[#8fb89c] py-12 sm:py-16 md:py-20 px-4 sm:px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8">
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
          <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Courses</h4>
          <ul className="space-y-2">
            <li className="hover:text-white cursor-pointer transition-colors">Deep Work & Cognitive Control</li>
            <li className="hover:text-white cursor-pointer transition-colors">Vagus Nerve Reset</li>
            <li className="hover:text-white cursor-pointer transition-colors">Brain Longevity Blueprint</li>
            <li className="hover:text-white cursor-pointer transition-colors">Anxiety Protocols</li>
            <li className="hover:text-white cursor-pointer transition-colors text-[#4a7c59]">View all courses →</li>
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
             <li className="hover:text-white cursor-pointer transition-colors">Privacy Policy</li>
             <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
             <li className="hover:text-white cursor-pointer transition-colors">Affiliate Program</li>
           </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-10 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-[#2a5c4f] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2 text-white font-semibold">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-[#4a7c59]" />
            <span className="text-sm sm:text-base">CogCare</span>
        </div>
        <p className="text-[10px] sm:text-xs md:text-sm text-center md:text-left">© 2026 CogCare Inc. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default App;