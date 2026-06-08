/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Store, Briefcase, Layers, ArrowLeft, ArrowRight, MapPin, Maximize2, Calendar, Check, ExternalLink, Activity, Info, Play } from 'lucide-react';
import { Page, Language, Project } from '../types';
import { ServicesData, ProjectsData, MethodologySteps, Translations } from '../data';
import { saudiRegions } from './SaudiRegionsData';
import { YoutubePlayer } from './YoutubePlayer';
import imgCommercial from '../assets/images/regenerated_image_1779550936996.png';
import imgOffice from '../assets/images/regenerated_image_1779550938782.png';
import imgBooth from '../assets/images/regenerated_image_1779550940143.png';

interface HomeViewProps {
  setActivePage: (page: Page) => void;
  language: Language;
  setSelectedProject: (proj: Project | null) => void;
}

function AnimatedNumber({ value, duration = 2000, prefix = "", suffix = "" }: { value: number; duration?: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress * (2 - progress); // easeOutQuad
      setCount(Math.floor(easeProgress * value));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  const formatCount = (num: number) => {
    return num >= 1000 ? num.toLocaleString() : num;
  };

  return (
    <span>{prefix}{formatCount(count)}{suffix}</span>
  );
}

function getStepIcon(stepNumber: string) {
  switch (stepNumber) {
    case '01':
      return (
        <svg viewBox="0 0 100 100" className="w-[4.5rem] h-[4.5rem] text-[#10798e] stroke-[#10798e] fill-none" strokeWidth="1.5">
          <ellipse cx="50" cy="80" rx="30" ry="10" stroke="currentColor" strokeDasharray="3 3"/>
          <ellipse cx="50" cy="80" rx="18" ry="6" stroke="currentColor"/>
          <ellipse cx="50" cy="80" rx="6" ry="2" stroke="currentColor"/>
          <line x1="50" y1="80" x2="50" y2="25" stroke="currentColor"/>
          <path d="M50 25 C65 20, 60 38, 80 30 L80 50 C65 55, 65 40, 50 45 Z" stroke="currentColor" fill="currentColor" fillOpacity="0.1"/>
        </svg>
      );
    case '02':
      return (
        <svg viewBox="0 0 100 100" className="w-[4.5rem] h-[4.5rem] text-[#10798e] stroke-[#10798e] fill-none" strokeWidth="1.5">
          <rect x="55" y="55" width="8" height="15" stroke="currentColor" strokeDasharray="2 2" />
          <rect x="68" y="45" width="8" height="25" stroke="currentColor" strokeDasharray="2 2" />
          <rect x="81" y="35" width="8" height="35" stroke="currentColor" strokeDasharray="2 2" />
          <path d="M25 65 L45 65 M25 72 L35 72" stroke="currentColor" strokeLinecap="round"/>
          <circle cx="45" cy="40" r="18" stroke="currentColor" fill="currentColor" fillOpacity="0.05" />
          <line x1="58" y1="53" x2="72" y2="67" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M35 32 A 12 12 0 0 1 53 32" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
        </svg>
      );
    case '03':
      return (
        <svg viewBox="0 0 100 100" className="w-[4.5rem] h-[4.5rem] text-[#10798e] stroke-[#10798e] fill-none" strokeWidth="1.5">
          <rect x="42" y="25" width="45" height="45" rx="3" stroke="currentColor" />
          <line x1="42" y1="38" x2="87" y2="38" stroke="currentColor" />
          <line x1="57" y1="25" x2="57" y2="70" stroke="currentColor" />
          <line x1="72" y1="25" x2="72" y2="70" stroke="currentColor" />
          <line x1="47" y1="48" x2="52" y2="48" stroke="currentColor" />
          <line x1="47" y1="58" x2="52" y2="58" stroke="currentColor" />
          <rect x="15" y="40" width="28" height="42" rx="3" stroke="currentColor" fill="currentColor" fillOpacity="0.1"/>
          <rect x="19" y="44" width="20" height="8" stroke="currentColor" />
          <circle cx="22" cy="58" r="1.5" stroke="currentColor" fill="currentColor"/>
          <circle cx="29" cy="58" r="1.5" stroke="currentColor" fill="currentColor"/>
          <circle cx="36" cy="58" r="1.5" stroke="currentColor" fill="currentColor"/>
          <circle cx="22" cy="66" r="1.5" stroke="currentColor" fill="currentColor"/>
          <circle cx="29" cy="66" r="1.5" stroke="currentColor" fill="currentColor"/>
          <circle cx="36" cy="66" r="1.5" stroke="currentColor" fill="currentColor"/>
          <circle cx="22" cy="74" r="1.5" stroke="currentColor" fill="currentColor"/>
          <circle cx="29" cy="74" r="1.5" stroke="currentColor" fill="currentColor"/>
          <circle cx="36" cy="74" r="1.5" stroke="currentColor" fill="currentColor"/>
          <ellipse cx="68" cy="72" rx="14" ry="4" stroke="currentColor" fill="currentColor" fillOpacity="0.1" />
          <path d="M54 72 V82 A 14 4 0 0 0 82 82 V72" stroke="currentColor" />
          <ellipse cx="68" cy="77" rx="14" ry="4" stroke="currentColor" />
          <ellipse cx="68" cy="82" rx="14" ry="4" stroke="currentColor" />
        </svg>
      );
    case '04':
      return (
        <svg viewBox="0 0 100 100" className="w-[4.5rem] h-[4.5rem] text-[#10798e] stroke-[#10798e] fill-none" strokeWidth="1.5">
          <rect x="18" y="25" width="64" height="58" rx="4" stroke="currentColor" fill="currentColor" fillOpacity="0.05"/>
          <path d="M28 18 C28 25, 34 25, 34 18" stroke="currentColor"/>
          <path d="M48 18 C48 25, 54 25, 54 18" stroke="currentColor"/>
          <path d="M68 18 C68 25, 74 25, 74 18" stroke="currentColor"/>
          <line x1="18" y1="38" x2="82" y2="38" stroke="currentColor"/>
          <rect x="24" y="44" width="22" height="6" rx="2" stroke="currentColor" fill="currentColor" fillOpacity="0.2"/>
          <rect x="42" y="54" width="28" height="6" rx="2" stroke="currentColor" fill="currentColor" fillOpacity="0.2"/>
          <rect x="58" y="64" width="18" height="6" rx="2" stroke="currentColor" fill="currentColor" fillOpacity="0.2"/>
          <path d="M46 47 H 52 V 54" stroke="currentColor" strokeDasharray="2 2"/>
          <path d="M70 57 H 74 V 64" stroke="currentColor" strokeDasharray="2 2"/>
        </svg>
      );
    case '05':
      return (
        <svg viewBox="0 0 100 100" className="w-[4.5rem] h-[4.5rem] text-[#10798e] stroke-[#10798e] fill-none" strokeWidth="1.5">
          <rect x="42" y="55" width="28" height="30" stroke="currentColor" strokeDasharray="2 2" />
          <rect x="42" y="70" width="28" height="15" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1" />
          <line x1="42" y1="85" x2="42" y2="55" stroke="currentColor" />
          <line x1="56" y1="85" x2="56" y2="55" stroke="currentColor" />
          <line x1="70" y1="85" x2="70" y2="55" stroke="currentColor" />
          <line x1="42" y1="70" x2="70" y2="70" stroke="currentColor" />
          <line x1="42" y1="55" x2="70" y2="55" stroke="currentColor" />
          <line x1="28" y1="85" x2="28" y2="32" stroke="currentColor" />
          <path d="M28 85 L35 78 M28 71 L35 64 M28 57 L35 50 M28 43 L35 36" stroke="currentColor" strokeWidth="0.8"/>
          <path d="M28 78 L35 85 M28 64 L35 71 M28 50 L35 57 M28 36 L35 43" stroke="currentColor" strokeWidth="0.8"/>
          <line x1="35" y1="85" x2="35" y2="32" stroke="currentColor" />
          <line x1="28" y1="32" x2="35" y2="32" stroke="currentColor" />
          <line x1="12" y1="32" x2="76" y2="32" stroke="currentColor" />
          <rect x="15" y="32" width="10" height="8" stroke="currentColor" fill="currentColor" fillOpacity="0.2"/>
          <line x1="31.5" y1="32" x2="31.5" y2="24" stroke="currentColor" />
          <line x1="15" y1="32" x2="31.5" y2="24" stroke="currentColor" />
          <line x1="31.5" y1="24" x2="45" y2="32" stroke="currentColor" />
          <rect x="52" y="32" width="4" height="2" stroke="currentColor" fill="currentColor"/>
          <line x1="54" y1="34" x2="54" y2="48" stroke="currentColor"/>
          <path d="M52 48 C52 51, 56 51, 56 48" stroke="currentColor" strokeLinecap="round"/>
        </svg>
      );
    case '06':
      return (
        <svg viewBox="0 0 100 100" className="w-[4.5rem] h-[4.5rem] text-[#10798e] stroke-[#10798e] fill-none" strokeWidth="1.5">
          <rect x="25" y="24" width="50" height="60" rx="3" stroke="currentColor" fill="currentColor" fillOpacity="0.05"/>
          <path d="M40 24 V18 H60 V24 A 2 2 0 0 1 58 26 H42 A 2 2 0 0 1 40 24 Z" stroke="currentColor" fill="currentColor" fillOpacity="0.2"/>
          <circle cx="50" cy="21" r="1.5" stroke="currentColor" fill="currentColor"/>
          <line x1="35" y1="38" x2="65" y2="38" stroke="currentColor"/>
          <line x1="35" y1="48" x2="55" y2="48" stroke="currentColor"/>
          <line x1="35" y1="58" x2="48" y2="58" stroke="currentColor"/>
          <circle cx="68" cy="70" r="18" stroke="currentColor" fill="white" />
          <circle cx="68" cy="70" r="14" stroke="currentColor" strokeDasharray="2 2" />
          {/* Added fill="none" to prevent black solid background fill on checkmark */}
          <path d="M60 70 L65 75 L76 64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      );
    default:
      return null;
  }
}

export function HomeView({ setActivePage, language, setSelectedProject }: HomeViewProps) {
  const t = Translations[language];
  const featuredProjects = ProjectsData.slice(0, 6);
  const emitterRef = React.useRef<HTMLDivElement | null>(null);
  const sliderRef = React.useRef<HTMLDivElement | null>(null);
  const [activeServiceIndex, setActiveServiceIndex] = React.useState(0);

  const scrollToService = (index: number) => {
    if (sliderRef.current) {
      const targetChild = sliderRef.current.children[index] as HTMLElement;
      if (targetChild) {
        targetChild.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        setActiveServiceIndex(index);
      }
    }
  };

  const handleSliderScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = Math.abs(container.scrollLeft);
    const scrollWidth = container.scrollWidth - container.clientWidth;
    if (scrollWidth <= 0) return;
    
    // Divide the scroll space into 3 parts (0, 1, 2)
    const ratio = scrollLeft / scrollWidth;
    let nextIndex = 0;
    if (ratio > 0.8) {
      nextIndex = 2;
    } else if (ratio > 0.25) {
      nextIndex = 1;
    }
    setActiveServiceIndex(nextIndex);
  };

  const handleLeftClick = () => {
    const isRtl = language === 'ar';
    if (isRtl) {
      const nextIdx = Math.min(2, activeServiceIndex + 1);
      scrollToService(nextIdx);
    } else {
      const prevIdx = Math.max(0, activeServiceIndex - 1);
      scrollToService(prevIdx);
    }
  };

  const handleRightClick = () => {
    const isRtl = language === 'ar';
    if (isRtl) {
      const prevIdx = Math.max(0, activeServiceIndex - 1);
      scrollToService(prevIdx);
    } else {
      const nextIdx = Math.min(2, activeServiceIndex + 1);
      scrollToService(nextIdx);
    }
  };

  // Icon mapper helper
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Store':
        return <Store className="h-6 w-6 text-[#10798e]" />;
      case 'Briefcase':
        return <Briefcase className="h-6 w-6 text-[#10798e]" />;
      case 'Layers':
        return <Layers className="h-6 w-6 text-[#10798e]" />;
      default:
        return <Layers className="h-6 w-6 text-[#10798e]" />;
    }
  };

  const handleProjectClick = (proj: Project) => {
    setSelectedProject(proj);
    setActivePage('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col w-full text-zinc-900 bg-transparent">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-16 sm:pt-28 pb-16 px-0 sm:px-8 max-w-7xl mx-auto w-full border-b border-zinc-200/50">
        
        {/* Backdrop patterns & grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10798e04_1px,transparent_1px),linear-gradient(to_bottom,#10798e04_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60 select-none pointer-events-none" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#10798e]/5 blur-[120px] select-none pointer-events-none" />
        <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-cyan-400/5 blur-[100px] select-none pointer-events-none" />

        <div className="relative w-full z-20 mt-0 sm:mt-8">
          {/* Hero Dynamic Video with object-cover and ultra-soft radial gradient mask to blend completely with background */}
          <div 
            className="relative w-full aspect-[3/4] sm:aspect-video rounded-none sm:rounded-2xl md:rounded-3xl overflow-hidden bg-transparent"
            style={{
              maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 25%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0) 95%)',
              WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,1) 25%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0) 95%)',
            }}
          >
            <video
              src="https://app-uploads.krea.ai/public/9b1491ba-a18a-42ac-aabc-6ac5e9303997-video.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover pointer-events-none"
            />
            {/* Ambient vignette gradient inside video container matching design system */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/40 via-transparent to-transparent pointer-events-none" />
            
            {/* Precise hand emitter position marker based on the artisan's hand layout in the video */}
            <div 
              ref={emitterRef} 
              className="absolute left-[48%] top-[65%] w-2 h-2 pointer-events-none opacity-0" 
            />
          </div>

          {/* Minimalist overlay with text floating directly on top of the video (no glassmorphic background around text) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`absolute top-[40%] sm:top-1/2 -translate-y-1/2 z-30 max-w-[85%] sm:max-w-sm md:max-w-md flex flex-col gap-3 sm:gap-5 ${
              language === 'ar' 
                ? 'left-6 xs:left-8 sm:left-12 md:left-16 lg:left-24 text-right items-end' 
                : 'left-6 xs:left-8 sm:left-12 md:left-16 lg:left-24 text-left items-start'
            }`}
          >
            <h1 className="text-sm xs:text-base sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight leading-relaxed text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
              {language === 'ar' ? (
                <span className="block text-white">نصنع تجربة مميزة و مختلفة</span>
              ) : (
                <span className="block text-white">We Craft a Unique & Distinct Experience</span>
              )}
            </h1>

            {/* CTA Get Quote Button styled with pure glassmorphism effect directly below */}
            <div className="flex">
              <button
                onClick={() => {
                  setActivePage('quote');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3.5 rounded-full text-[10px] xs:text-xs sm:text-xs md:text-sm font-bold backdrop-blur-md bg-white/10 hover:bg-lime-400/15 border border-white/20 hover:border-lime-400/40 text-white hover:text-lime-300 shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300 transform hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-1.5 font-sans"
              >
                <span>{language === 'ar' ? 'احصل على عرض سعر' : 'Get a Quote'}</span>
              </button>
            </div>

            {/* Elegant Real-Time Experience Counters with Glassmorphism */}
            <div className={`mt-4 sm:mt-6 w-full grid grid-cols-3 gap-2 sm:gap-3.5 max-w-sm sm:max-w-md pt-4 border-t border-white/10 ${
              language === 'ar' ? 'text-right' : 'text-left'
            }`}>
              <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/5 backdrop-blur-md px-2 py-2 sm:px-3 sm:py-3 select-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-white/10 hover:bg-white/10 transition-all duration-300 text-center">
                <Store className="h-4 w-4 sm:h-5 sm:w-5 text-lime-400 mb-1 sm:mb-1.5" />
                <span className="text-sm xs:text-base sm:text-lg md:text-xl font-extrabold text-lime-400 font-mono tracking-tight flex items-center">
                  <AnimatedNumber value={150} prefix="+" duration={1200} />
                </span>
                <span className="text-[9px] xs:text-[10px] sm:text-xs text-zinc-300 font-medium whitespace-nowrap mt-0.5 font-sans">
                  {language === 'ar' ? 'محل تجاري' : 'Retail Shops'}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/5 backdrop-blur-md px-2 py-2 sm:px-3 sm:py-3 select-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-white/10 hover:bg-white/10 transition-all duration-300 text-center">
                <Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-lime-400 mb-1 sm:mb-1.5" />
                <span className="text-sm xs:text-base sm:text-lg md:text-xl font-extrabold text-lime-400 font-mono tracking-tight flex items-center">
                  <AnimatedNumber value={10000} prefix="+" duration={1200} />
                </span>
                <span className="text-[9px] xs:text-[10px] sm:text-xs text-zinc-300 font-medium whitespace-nowrap mt-0.5 font-sans">
                  {language === 'ar' ? 'متر مكتبي' : 'Office Sqm'}
                </span>
              </div>

              <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/5 backdrop-blur-md px-2 py-2 sm:px-3 sm:py-3 select-none shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] hover:border-white/10 hover:bg-white/10 transition-all duration-300 text-center">
                <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-lime-400 mb-1 sm:mb-1.5" />
                <span className="text-sm xs:text-base sm:text-lg md:text-xl font-extrabold text-lime-400 font-mono tracking-tight flex items-center">
                  <AnimatedNumber value={100} prefix="+" duration={1200} />
                </span>
                <span className="text-[9px] xs:text-[10px] sm:text-xs text-zinc-300 font-medium whitespace-nowrap mt-0.5 font-sans">
                  {language === 'ar' ? 'بوث' : 'Exhibition Booths'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. SERVICES SECTION (خدماتنا) */}
      <section id="services" className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full border-b border-zinc-200 bg-transparent">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-zinc-200 bg-white shadow-sm text-[#10798e] text-[11px] sm:text-xs font-extrabold uppercase mb-5 select-none tracking-widest font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10798e] shadow-[0_0_4px_rgba(16,121,142,0.4)]" />
            <span>{language === 'ar' ? 'خدماتنا' : 'Our Services'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10798e] shadow-[0_0_4px_rgba(16,121,142,0.4)]" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-4">
            {language === 'ar' ? 'حلول تنفيذية متكاملة' : 'Integrated Executive Solutions'}
          </h2>
          <p className="text-zinc-650 text-xs sm:text-sm md:text-base max-w-xl font-light">
            {language === 'ar' 
              ? 'نحوّل الأفكار إلى مساحات احترافية تعكس هوية علامتك التجارية' 
              : 'We turn ideas into professional spaces that reflect your brand identity'}
          </p>
          
          {/* Aesthetic central divider with glowing brand bead */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#10798e]/30" />
            <div className="w-2 h-2 rounded-full bg-[#10798e] shadow-[0_0_6px_rgba(16,121,142,0.5)]" />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#10798e]/30" />
          </div>
        </div>

        {/* Custom architectural service deck with gorgeous real images */}
        <div 
          ref={sliderRef}
          onScroll={handleSliderScroll}
          className="flex md:grid md:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory pb-8 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth"
        >
          {[
            {
              id: 'commercial',
              number: '01',
              titleAr: 'تنفيذ المحلات التجارية',
              titleEn: 'Retail Store Execution',
              descAr: 'تصميم وتنفيذ المحلات التجارية بمفهوم يبرز هوية العلامة ويحقق تجربة عميل استثنائية',
              descEn: 'Designing and executing retail shops with concepts that accentuate brand identity.',
              imageUrl: imgCommercial
            },
            {
              id: 'office',
              number: '02',
              titleAr: 'تنفيذ المكاتب',
              titleEn: 'Office Execution',
              descAr: 'مساحات عمل احترافية تجمع بين الراحة، الإنتاجية، والهوية المؤسسية',
              descEn: 'Professional workspaces combining ergonomics, productivity, and corporate identity.',
              imageUrl: imgOffice
            },
            {
              id: 'booth',
              number: '03',
              titleAr: 'تنفيذ البوثات',
              titleEn: 'Booth Execution',
              descAr: 'تصميم وتنفيذ البوثات والمعارض بأعلى معايير الجودة لتحقيق حضور قوي وفعال',
              descEn: 'Design and execution of exhibition stands and pavilions with the highest quality standards.',
              imageUrl: imgBooth
            }
          ].map((service) => (
            <div
              key={service.id}
              onClick={() => {
                setActivePage('quote');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group cursor-pointer relative flex flex-col h-[460px] md:h-full w-[85vw] sm:w-[380px] md:w-auto shrink-0 snap-center rounded-2xl border border-zinc-200/80 bg-white hover:border-[#10798e]/40 shadow-xl hover:shadow-[#10798e]/10 shadow-zinc-200/35 hover:-translate-y-1 transition-all duration-300 overflow-hidden p-6 sm:p-8"
            >
              {/* Card number & top right accent */}
              <div className="absolute top-6 right-6 flex flex-col items-end gap-1 select-none">
                <span className="text-xl sm:text-2xl font-mono text-[#10798e] font-bold tracking-widest">{service.number}</span>
                <div className="w-6 h-[1px] bg-[#10798e]/40" />
              </div>

              {/* Real architectural preview image */}
              <div className="relative w-full aspect-[1.4] my-6 overflow-hidden bg-white rounded-xl">
                <img
                  src={service.imageUrl}
                  alt={language === 'ar' ? service.titleAr : service.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Title & Description centered */}
              <div className="text-center flex flex-col gap-2 mt-auto">
                <h3 className="text-lg sm:text-xl font-extrabold text-[#0d5c6d] group-hover:text-[#10798e] transition-colors duration-300">
                  {language === 'ar' ? service.titleAr : service.titleEn}
                </h3>
                <p className="text-zinc-650 text-xs sm:text-xs leading-relaxed font-light tracking-wide px-2">
                  {language === 'ar' ? service.descAr : service.descEn}
                </p>
              </div>

              {/* Sleek architectural arrow in bottom left */}
              <div className="mt-8 flex justify-start">
                <div className="p-1.5 rounded-full border border-zinc-100 text-[#10798e] bg-slate-50 group-hover:bg-[#10798e] group-hover:text-white transition-all duration-300">
                  <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-1 sm:group-hover:-translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Glassmorphic Navigation Dots (Optimized for Mobile Browsing) */}
        <div className="flex flex-col items-center mt-8 md:hidden">
          {/* Controller board containing only bullet pagination */}
          <div className="flex items-center px-5 py-3 rounded-full border border-zinc-200 bg-white shadow-md">
            {/* Pagination Bullet Indicators */}
            <div className="flex items-center gap-2.5">
              {[0, 1, 2].map((idx) => {
                const isActive = activeServiceIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => scrollToService(idx)}
                    className={`relative h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      isActive 
                        ? 'w-6 bg-[#10798e] shadow-[0_0_8px_rgba(16,121,142,0.3)]' 
                        : 'w-2 bg-zinc-300 hover:bg-zinc-400'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. WORKS SECTION (أعمالنا) */}
      <section id="works" className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full border-b border-zinc-200 bg-slate-100/40">
        <div className="flex flex-col md:flex-row md:items-end justify-between items-center text-center md:text-start gap-6 mb-16">
          <div className="flex flex-col gap-3">
            <div className="px-3.5 py-1 rounded-full border border-[#10798e]/20 bg-[#10798e]/5 text-[#10798e] text-xs font-bold leading-none tracking-widest uppercase self-center md:self-start">
              {language === 'ar' ? 'أحدث أعمالنا' : 'Aesthetic Delivery'}
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 font-sans">
              {t.sectionWorks}
            </h2>
            <p className="text-zinc-650 text-sm sm:text-base max-w-xl font-light">
              {t.sectionWorksSub}
            </p>
          </div>
        </div>

        {/* 6 Projects Gallery (Glass cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => handleProjectClick(proj)}
              className="group cursor-pointer flex flex-col rounded-2xl border border-zinc-200/80 bg-white hover:border-[#10798e]/40 transition-all duration-300 overflow-hidden shadow-md hover:shadow-xl"
            >
              {/* Portfolio thumbnail */}
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                {/* Autoplay muted video directly without fake image placeholder */}
                {proj.youtubeId ? (
                  <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-black">
                    <YoutubePlayer
                      youtubeId={proj.youtubeId}
                      title={proj.titleAr}
                      className="w-full h-full opacity-90 transition-opacity"
                      style={{ transform: 'scale(2.38)', transformOrigin: 'center' }}
                      autoplay={true}
                      mute={true}
                      loop={true}
                      controls={false}
                    />
                  </div>
                ) : (
                  <img
                    src={proj.mainImage}
                    alt={proj.titleAr}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover z-10 transition-all duration-700 group-hover:scale-105"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-80 z-20 pointer-events-none" />
                
                {/* Category tag */}
                <div className="absolute bottom-4 right-4 bg-[#10798e] text-white text-[10px] font-black tracking-wider px-3 py-1.5 rounded-lg border border-white/10 z-30">
                  {proj.category === 'commercial' && (language === 'ar' ? 'محلات تجارية' : 'Retail')}
                  {proj.category === 'office' && (language === 'ar' ? 'مكاتب ومؤسسات' : 'Corporate')}
                  {proj.category === 'booth' && (language === 'ar' ? 'بوثات ومعارض' : 'Exhibition')}
                </div>
              </div>

              {/* Specifications Card Foot */}
              <div className="p-5 flex flex-col gap-3 justify-between flex-grow">
                <div className="flex flex-col gap-1.5">
                  <span className="text-zinc-500 text-xs font-semibold tracking-wider flex items-center gap-1">
                     <MapPin className="h-3 w-3 text-[#10798e]" />
                     <span>{language === 'ar' ? proj.locationAr : proj.locationEn}</span>
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-[#10798e] transition-colors leading-snug">
                    {language === 'ar' ? proj.titleAr : proj.titleEn}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-650 pt-3 border-t border-zinc-100 mt-auto">
                  <span className="flex items-center gap-1.5 font-light">
                    <Maximize2 className="h-3.5 w-3.5 text-zinc-400" />
                    <span>{proj.area}</span>
                  </span>
                  <span className="text-zinc-500 font-mono text-[10px] uppercase flex items-center gap-1 group-hover:text-[#10798e] transition-colors">
                    <span>DETAILS</span>
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prominent centered button to view all projects */}
        <div className="flex justify-center mt-12 pb-4">
          <button
            onClick={() => {
              setActivePage('projects');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group relative flex items-center justify-center gap-3 px-10 py-4 rounded-full text-sm font-bold text-white bg-[#10798e] hover:bg-[#0c5c6d] shadow-md hover:shadow-xl hover:shadow-[#10798e]/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <span>{t.btnAllProjects}</span>
            {language === 'ar' ? (
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </button>
        </div>
      </section>

      {/* Kingdom Map Coverage Section */}
      <section className="py-24 bg-zinc-50/50 border-b border-zinc-200/80 overflow-hidden relative">
        {/* Light aesthetic grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10798e04_1px,transparent_1px),linear-gradient(to_bottom,#10798e04_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-70" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Map Side */}
            <div className="lg:col-span-7 flex justify-center items-center relative">
              <div className="w-full max-w-[550px] aspect-[730/600] relative">
                <motion.svg
                  viewBox="0 0 730 600"
                  className="w-full h-full text-[#10798e]"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  {/* 13 Geographically Accurate Region Borders of Saudi Arabia */}
                  {saudiRegions.map((region) => (
                    <motion.path
                      key={region.id}
                      d={region.d}
                      fill="rgba(16, 121, 142, 0.02)"
                      stroke="#10798e"
                      strokeWidth="1.2"
                      className="select-none pointer-events-none"
                      animate={{ 
                        strokeOpacity: [0.3, 0.85, 0.3], 
                        strokeWidth: [1.0, 1.5, 1.0],
                        filter: [
                          "drop-shadow(0 0 3px rgba(16,121,142,0.1))",
                          "drop-shadow(0 0 9px rgba(16,121,142,0.45))",
                          "drop-shadow(0 0 3px rgba(16,121,142,0.1))"
                        ] 
                      }}
                      transition={{ 
                        duration: 3.2 + Math.random() * 1.6, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    />
                  ))}

                  {/* Pulsing Concentric Ripple Wave Background */}
                  <motion.ellipse
                    cx="410"
                    cy="350"
                    rx="80"
                    ry="35"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeOpacity="0.1"
                    className="select-none pointer-events-none"
                    animate={{ scale: [0.8, 1.5, 0.8], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  <motion.ellipse
                    cx="410"
                    cy="350"
                    rx="140"
                    ry="60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeOpacity="0.05"
                    className="select-none pointer-events-none"
                    animate={{ scale: [0.9, 1.3, 0.9], opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  />

                  {/* Glowing animated connection paths radiating from Riyadh */}
                  {[
                    { id: 'dammam', x: 555, y: 245 },
                    { id: 'jeddah', x: 155, y: 435 },
                    { id: 'makkah', x: 175, y: 450 },
                    { id: 'madinah', x: 235, y: 295 },
                    { id: 'tabuk', x: 125, y: 155 },
                    { id: 'hail', x: 310, y: 220 },
                    { id: 'abha', x: 240, y: 520 },
                  ].map((conn) => (
                    <g key={'line-' + conn.id} className="opacity-40">
                      <path
                        d={`M 410 350 Q ${(410 + conn.x) / 2} ${(350 + conn.y) / 2 - 40} ${conn.x} ${conn.y}`}
                        fill="none"
                        stroke="#10798e"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                      <motion.path
                        d={`M 410 350 Q ${(410 + conn.x) / 2} ${(350 + conn.y) / 2 - 40} ${conn.x} ${conn.y}`}
                        fill="none"
                        stroke="#10798e"
                        strokeWidth="1.5"
                        animate={{ strokeDashoffset: [0, -32] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        style={{ strokeDasharray: '8 8' }}
                      />
                    </g>
                  ))}

                  {/* City Pins Group */}
                  {[
                    { id: 'riyadh', nameAr: 'الرياض', nameEn: 'Riyadh', x: 410, y: 350 },
                    { id: 'dammam', nameAr: 'الدمام', nameEn: 'Dammam', x: 555, y: 245 },
                    { id: 'jeddah', nameAr: 'جدة', nameEn: 'Jeddah', x: 155, y: 435 },
                    { id: 'makkah', nameAr: 'مكة', nameEn: 'Makkah', x: 175, y: 450 },
                    { id: 'madinah', nameAr: 'المدينة', nameEn: 'Medina', x: 235, y: 295 },
                    { id: 'tabuk', nameAr: 'تبوك', nameEn: 'Tabuk', x: 125, y: 155 },
                    { id: 'hail', nameAr: 'حائل', nameEn: 'Hail', x: 310, y: 220 },
                    { id: 'abha', nameAr: 'أبها', nameEn: 'Abha', x: 240, y: 520 },
                  ].map((city) => (
                    <g key={city.id} className="cursor-pointer group/city">
                      {/* 1. Rippling Outer Pulse Wave Ellipse 1 */}
                      <motion.ellipse
                        cx={city.x}
                        cy={city.y + 7}
                        rx="16"
                        ry="5.5"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        fill="none"
                        initial={{ scale: 0.6, opacity: 0.8 }}
                        animate={{ scale: [0.8, 2.1, 0.8], opacity: [0.6, 0.05, 0.6] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: Math.random() * 2
                        }}
                      />

                      {/* 2. Rippling Inner Pulse Wave Ellipse 2 */}
                      <motion.ellipse
                        cx={city.x}
                        cy={city.y + 7}
                        rx="10"
                        ry="3.5"
                        stroke="currentColor"
                        strokeWidth="1"
                        fill="none"
                        initial={{ scale: 0.7, opacity: 0.9 }}
                        animate={{ scale: [0.9, 1.8, 0.9], opacity: [0.8, 0, 0.8] }}
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: Math.random() * 2
                        }}
                      />

                      {/* 3. Base Anchor Ellipse */}
                      <ellipse
                        cx={city.x}
                        cy={city.y + 7}
                        rx="4.5"
                        ry="1.8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                      />

                      {/* 4. Beautiful Custom Standard Vector Pin with floating motion */}
                      <motion.path
                        d={`M ${city.x} ${city.y} 
                           C ${city.x - 4} ${city.y - 4.5}, ${city.x - 7.5} ${city.y - 10}, ${city.x - 7.5} ${city.y - 14} 
                           A 7.5 7.5 0 1 1 ${city.x + 7.5} ${city.y - 14} 
                           C ${city.x + 7.5} ${city.y - 10}, ${city.x + 4} ${city.y - 4.5}, ${city.x} ${city.y} Z`}
                        fill="currentColor"
                        stroke="white"
                        strokeWidth="1"
                        className="drop-shadow-[0_4px_6px_rgba(16,121,142,0.3)]"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: Math.random() * 1.5
                        }}
                      />

                      {/* Inner white core dot of the map pin */}
                      <motion.circle
                        cx={city.x}
                        cy={city.y - 14}
                        r="2.5"
                        fill="white"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: Math.random() * 1.5
                        }}
                      />

                      {/* 5. Beautiful City Name Typography */}
                      <text
                        x={city.x}
                        y={city.y + 24}
                        textAnchor="middle"
                        className="font-sans text-[11px] font-extrabold fill-zinc-800 tracking-tight"
                      >
                        {language === 'ar' ? city.nameAr : city.nameEn}
                      </text>
                    </g>
                  ))}
                </motion.svg>
              </div>
            </div>

            {/* Sleek Vertical Divider Line (Hidden on Mobile) */}
            <div className="hidden lg:flex flex-col items-center justify-center col-span-1 h-72 relative">
              <div className="w-[1.2px] h-full bg-gradient-to-b from-transparent via-[#10798e]/40 to-transparent relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#10798e] shadow-[0_0_12px_#10798e] animate-pulse" />
              </div>
            </div>

            {/* Typography Content Side */}
            <div className="lg:col-span-4 flex flex-col items-center text-center gap-7 justify-center lg:items-start lg:text-start">
              {/* Dynamic MapPin Icon Header */}
              <div className="relative flex flex-col items-center justify-center">
                {/* Pulsing Concentric Ripple Wave Background */}
                <div className="absolute w-24 h-24 rounded-full bg-[#10798e]/5 border border-[#10798e]/10 animate-ping opacity-60 scale-75" />
                <div className="absolute w-16 h-16 rounded-full bg-[#10798e]/10 border border-[#10798e]/20 animate-pulse opacity-80" />
                <motion.div
                  className="w-12 h-12 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center text-[#10798e] relative z-10"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MapPin className="h-6 w-6 stroke-[2.2]" />
                </motion.div>
              </div>

              {/* Small Horizontal Deco Bar 1 */}
              <div className="flex items-center gap-2 w-full max-w-[280px]">
                <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#10798e]/35" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#10798e]" />
                <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[#10798e]/35" />
              </div>

              {/* Core Phrase */}
              <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 leading-[1.4] md:leading-[1.5] max-w-sm tracking-tight">
                {language === 'ar' ? (
                  <span>
                    ننفذ المشاريع <span className="text-[#10798e]">التجارية</span>
                    <br />
                    و <span className="text-[#10798e]">المكتبية</span> بكافة
                    <br />
                    مدن المملكة العربية السعودية
                  </span>
                ) : (
                  <span>
                    We execute <span className="text-[#10798e]">commercial</span>
                    <br />
                    and <span className="text-[#10798e]">office</span> projects in
                    <br />
                    all cities of Saudi Arabia
                  </span>
                )}
              </h3>

              {/* Small Horizontal Deco Bar 2 */}
              <div className="flex items-center gap-2 w-full max-w-[280px]">
                <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent to-[#10798e]/35" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#10798e]" />
                <div className="h-[1px] flex-grow bg-gradient-to-l from-transparent to-[#10798e]/35" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. METHODOLOGY SECTION (منهجية العمل) */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto w-full select-none">
        <div className="flex flex-col items-center text-center gap-4 mb-20">
          <div className="px-3.5 py-1 rounded-full border border-[#10798e]/20 bg-[#10798e]/5 text-[#10798e] text-xs font-bold leading-none tracking-widest uppercase">
            {language === 'ar' ? 'منهجية عملنا' : 'Execution Flow'}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 mb-2">
            {language === 'ar' ? 'منهجية العمل في فزين' : 'Our Work Methodology'}
          </h2>
          <p className="text-zinc-650 text-sm sm:text-base max-w-2xl font-light">
            {t.sectionMethodSub}
          </p>
        </div>

        {/* Desktop View rendering 6 beautiful vertical cards horizontally */}
        <div className="hidden lg:block relative w-full" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          {/* Symmetrical timeline link rail passing through middle-height of cards */}
          <div className="absolute top-[38%] left-12 right-12 h-[1px] bg-gradient-to-r from-transparent via-[#10798e]/20 to-transparent pointer-events-none z-0" />
          
          <div className="grid grid-cols-6 gap-4 relative z-10 w-full">
            {MethodologySteps.map((step, idx) => (
              <div 
                key={idx} 
                className="relative flex flex-col items-center p-5 rounded-2xl bg-white border border-zinc-200 hover:border-[#10798e]/50 hover:shadow-[0_12px_32px_rgba(16,121,142,0.06)] transition-all duration-500 hover:scale-[1.03] hover:-translate-y-1 text-center min-h-[22.5rem] justify-between group cursor-default"
              >
                {/* Step Circle Counter */}
                <div className="w-8 h-8 rounded-full border border-[#10798e] text-[#10798e] font-mono text-xs font-bold bg-slate-50 flex items-center justify-center shadow-sm z-10">
                  {step.step}
                </div>

                {/* Cyberpunk Line Art Icon */}
                <div className="my-4 flex items-center justify-center transition-transform duration-500 group-hover:scale-108 group-hover:rotate-1">
                  {getStepIcon(step.step)}
                </div>

                {/* Headline & Paragraph */}
                <div className="flex flex-col gap-1.5 mt-auto w-full">
                  <h3 className="text-sm font-bold text-zinc-900 group-hover:text-[#10798e] transition-colors duration-300">
                    {language === 'ar' ? step.titleAr : step.titleEn}
                  </h3>
                  <p className="text-[11px] text-zinc-650 leading-relaxed font-light">
                    {language === 'ar' ? step.descAr : step.descEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile View rendering elegant vertical timeline inside high-end frame */}
        <div className="block lg:hidden w-full max-w-md mx-auto relative">
          <div className="bg-white border border-zinc-200 rounded-3xl p-5 sm:p-7 flex flex-col gap-5 shadow-[0_12px_40px_rgba(0,0,0,0.03)]">
            
            {/* Header with decorative glow divider */}
            <div className="flex flex-col items-center gap-1.5 pb-3 border-b border-zinc-150">
              <h3 className="text-sm sm:text-base font-black text-zinc-900 tracking-wide">
                {language === 'ar' ? 'منهجية العمل' : 'Our Work Flow'}
              </h3>
              <div className="w-10 h-0.5 bg-gradient-to-r from-transparent via-[#10798e] to-transparent rounded-full" />
            </div>

            {/* Steps stream */}
            <div className="relative pl-1 px-1 flex flex-col gap-4">
              {/* Timeline Thread */}
              <div className="absolute left-[0.9rem] top-4 bottom-4 w-[1px] bg-gradient-to-b from-[#10798e]/40 via-[#10798e]/20 to-transparent pointer-events-none z-0" />

              {MethodologySteps.map((step, idx) => (
                <div key={idx} className="relative pl-9 flex flex-row items-center gap-3 w-full group">
                  {/* Circle number tag onto thread */}
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 text-[9px] rounded-full border border-[#10798e] bg-slate-100 text-[#10798e] font-mono font-black flex items-center justify-center shadow-sm z-10 transition-transform duration-300 group-hover:scale-105">
                    {step.step}
                  </div>

                  {/* Glassmorphic horizontal cell container */}
                  <div className="flex flex-row items-center gap-3 p-3 rounded-xl border border-zinc-200 bg-slate-50 hover:border-[#10798e]/20 transition-all duration-300 w-full">
                    {/* Small print blueprint style icon */}
                    <div className="w-11 h-11 shrink-0 flex items-center justify-center bg-[#10798e]/5 rounded-lg p-0.5">
                      <div className="scale-65 w-16 h-16 flex items-center justify-center">
                        {getStepIcon(step.step)}
                      </div>
                    </div>

                    {/* Copywriting translation */}
                    <div className={`flex flex-col w-full ${language === 'ar' ? 'text-right pr-0.5' : 'text-left pl-0.5'}`}>
                      <h4 className="text-xs font-bold text-zinc-900 group-hover:text-[#10798e] transition-colors duration-300 leading-snug">
                        {language === 'ar' ? step.titleAr : step.titleEn}
                      </h4>
                      <p className="text-[10px] text-zinc-650 leading-normal font-light mt-0.5">
                        {language === 'ar' ? step.descAr : step.descEn}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
