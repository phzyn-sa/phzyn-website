/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Page, Language, Project } from './types';
import { Navbar } from './components/Navbar';
import { HomeView } from './components/HomeView';
import { ProjectsView } from './components/ProjectsView';
import { QuoteView } from './components/QuoteView';
import { Footer } from './components/Footer';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('home');
  const [language, setLanguage] = useState<Language>('ar');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Connects selected project CTAs directly as preselected forms on the Quote page
  const [preselectedService, setPreselectedService] = useState<'commercial' | 'office' | 'booth' | 'other' | null>(null);

  // Synchronise directionality on mount
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-zinc-900 selection:bg-[#10798e]/20 overflow-x-hidden antialiased relative">
      
      {/* Background Atmosphere */}
      <div className="absolute inset-x-0 top-0 bottom-0 opacity-[0.06] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[10%] -right-20 w-96 h-96 bg-[#10798e] rounded-full blur-[120px] md:blur-[140px]" />
        <div className="absolute top-[60%] -left-20 w-96 h-96 bg-cyan-400 rounded-full blur-[100px] md:blur-[130px]" />
        <div className="absolute bottom-[10%] right-[30%] w-80 h-80 bg-teal-400 rounded-full blur-[120px] opacity-40 animate-pulse" />
      </div>

      {/* 1. Glassmorphism Navigation Hub */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        language={language} 
        setLanguage={setLanguage} 
        selectedProject={selectedProject}
      />

      {/* 2. Page View Containers backed by beautiful transitions */}
      <main className="flex-grow z-10 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full"
          >
            {activePage === 'home' && (
              <HomeView 
                setActivePage={setActivePage} 
                language={language} 
                setSelectedProject={setSelectedProject}
              />
            )}

            {activePage === 'projects' && (
              <ProjectsView 
                language={language} 
                setActivePage={setActivePage} 
                selectedProject={selectedProject}
                setSelectedProject={setSelectedProject}
                setPreselectedService={setPreselectedService}
              />
            )}

            {activePage === 'quote' && (
              <QuoteView 
                language={language} 
                preselectedService={preselectedService}
                setPreselectedService={setPreselectedService}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. High-End Footer */}
      <Footer 
        language={language} 
        setActivePage={setActivePage} 
      />

      {/* 4. Glassmorphic Sticky WhatsApp Chat Badge */}
      <a
        href="https://wa.me/966538488654"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact on WhatsApp"
        id="whatsapp-sticky-badge"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-white/15 bg-zinc-900/70 backdrop-blur-xl shadow-xl text-white hover:bg-zinc-900/90 hover:text-emerald-400 transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] group cursor-pointer"
      >
        {/* Pulsing online marker */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>

        {/* Crisp White WhatsApp Icon */}
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 fill-white transition-transform duration-300 group-hover:scale-110"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.83.493 3.619 1.427 5.195L2 22l4.945-1.296a9.92 9.92 0 0 0 5.059 1.365h.005c5.524 0 10.004-4.48 10.004-10.005C22.013 6.48 17.528 2 12.004 2zm5.727 14.18c-.247.697-1.204 1.272-1.66 1.332-.455.06-1.02.13-2.994-.654-2.523-1.002-4.11-3.576-4.237-3.743-.127-.168-.93-1.237-.93-2.361 0-1.124.587-1.68.796-1.9.21-.22.456-.276.608-.276.152 0 .304.002.437.009.14.007.33-.053.518.397.194.464.664 1.62.72 1.73.056.11.093.24.019.39-.074.15-.11.24-.22.37-.11.13-.23.29-.33.39-.11.11-.226.23-.097.45.128.22.57.94 1.22 1.52.837.747 1.543.98 1.761 1.09.218.11.347.09.476-.06.13-.15.55-.64.7-.86.15-.22.3-.185.507-.11.206.075 1.31.618 1.53.73.22.11.367.168.42.26.055.093.055.534-.192 1.231z" />
        </svg>

        {/* Text */}
        <span className="text-xs font-bold font-sans tracking-wide">
          {language === 'ar' ? '24 ساعة' : '24 Hours'}
        </span>
      </a>
      
    </div>
  );
}
