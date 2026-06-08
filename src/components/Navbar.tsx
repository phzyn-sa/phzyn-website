/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Compass, Briefcase, FileText } from 'lucide-react';
import { Logo } from './Logo';
import { Page, Language, Project } from '../types';
import { Translations } from '../data';

interface NavbarProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedProject?: Project | null;
}

export function Navbar({ activePage, setActivePage, language, selectedProject }: NavbarProps) {
  const t = Translations[language];

  // Exactly 2 mid-links (Home & Projects), the Logo is on one side, and the Quote Button is on the other.
  const navItems = [
    { id: 'home' as Page, label: t.navHome, icon: Compass },
    { id: 'projects' as Page, label: t.navProjects, icon: Briefcase }
  ];

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-2 sm:px-4 max-w-7xl mx-auto">
      {/* Floating Compact Glassmorphism Container containing exactly our 4 items directly */}
      <div className="mx-auto w-full md:w-[95%] rounded-full border border-zinc-200 bg-white/70 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300">
        <div className="flex h-14 items-center justify-between px-2.5 xs:px-3 sm:px-6 gap-1 xs:gap-1.5 sm:gap-2">
          
          {/* 1. Logo */}
          <div 
            onClick={() => setActivePage('home')} 
            className="cursor-pointer flex items-center transform active:scale-95 transition-transform shrink-0 w-[55px] xs:w-[65px] sm:w-[130px]"
          >
            <Logo showSubtitle={false} light={false} className="[&_svg]:w-full [&_svg]:h-auto transition-all" />
          </div>

          {/* 2 & 3. Navigation Links (Home & Projects) - Direct and inline on both mobile and desktop */}
          <nav className="flex items-center gap-0.5 xs:gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`relative px-1.5 xs:px-2.5 sm:px-4 py-1.5 text-[10px] xs:text-xs sm:text-sm font-bold transition-all duration-300 rounded-full flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 ${
                    isActive 
                      ? 'text-[#10798e] bg-[#10798e]/10' 
                      : 'text-zinc-650 hover:text-[#10798e] hover:bg-zinc-100'
                  }`}
                >
                  <Icon className={`h-3 w-3 xs:h-3.5 xs:w-3.5 ${isActive ? 'text-[#10798e]' : 'text-zinc-500'} shrink-0`} />
                  <span className="text-[10px] xs:text-xs tracking-tight whitespace-nowrap">
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicatorInline"
                      className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#10798e] rounded-full"
                      style={{
                        boxShadow: '0 0 8px rgba(16, 121, 142, 0.4)'
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* 4. CTA Quote Button - Direct and clearly visible inside the bar on all devices */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => {
                const w = window as any;
                w.dataLayer = w.dataLayer || [];
                const eventData: any = {
                  event: 'quote_cta_click',
                  button_text: language === 'ar' ? 'احصل على عرض سعر' : 'Get a Quote',
                  page_path: window.location.pathname,
                  section: 'header_or_project_cta'
                };
                if (activePage === 'projects' && selectedProject) {
                  eventData.project_title = language === 'ar' ? selectedProject.titleAr : selectedProject.titleEn;
                  eventData.project_type = selectedProject.category;
                  eventData.location = language === 'ar' ? selectedProject.locationAr : selectedProject.locationEn;
                  eventData.area_size = selectedProject.area;
                }
                w.dataLayer.push(eventData);
                setActivePage('quote');
              }}
              className={`group relative overflow-hidden px-1.5 xs:px-2.5 sm:px-5 py-2 rounded-full text-[10px] xs:text-xs font-bold transition-all duration-300 active:scale-95 flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 ${
                activePage === 'quote'
                  ? 'bg-[#10798e]/20 text-[#10798e] border border-[#10798e]/40 shadow-lg'
                  : 'bg-[#10798e] hover:bg-[#0c5c6d] text-white shadow-md shadow-[#10798e]/20'
              }`}
            >
              <FileText className="h-3.5 w-3.5 shrink-0" />
              <span className="text-[10px] xs:text-[11px] sm:text-xs tracking-tight whitespace-nowrap font-bold">
                {language === 'ar' ? (
                  <>
                    <span className="hidden sm:inline">احصل على عرض سعر</span>
                    <span className="inline sm:hidden">عرض سعر</span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">Get a Quote</span>
                    <span className="inline sm:hidden">Quote</span>
                  </>
                )}
              </span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

