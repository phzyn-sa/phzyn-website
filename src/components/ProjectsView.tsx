/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Maximize2, Calendar, User, Check, X, ArrowLeft, ArrowRight, CornerDownLeft, Play, Layers } from 'lucide-react';
import { Page, Language, Project } from '../types';
import { ProjectsData, Translations } from '../data';
import { YoutubePlayer } from './YoutubePlayer';

interface ProjectsViewProps {
  language: Language;
  setActivePage: (page: Page) => void;
  selectedProject: Project | null;
  setSelectedProject: (proj: Project | null) => void;
  setPreselectedService: (service: 'commercial' | 'office' | 'booth' | 'other' | null) => void;
}

export function ProjectsView({ 
  language, 
  setActivePage, 
  selectedProject, 
  setSelectedProject,
  setPreselectedService
}: ProjectsViewProps) {
  const t = Translations[language];
  const [activeFilter, setActiveFilter] = useState<'all' | 'commercial' | 'office' | 'booth'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(ProjectsData);

  // Apply filters and searches
  useEffect(() => {
    let result = ProjectsData;
    
    // Category filter
    if (activeFilter !== 'all') {
      result = result.filter(p => p.category === activeFilter);
    }

    // Keyword search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.titleAr.toLowerCase().includes(q) ||
        p.titleEn.toLowerCase().includes(q) ||
        p.clientAr.toLowerCase().includes(q) ||
        p.clientEn.toLowerCase().includes(q) ||
        p.locationAr.toLowerCase().includes(q) ||
        p.locationEn.toLowerCase().includes(q)
      );
    }

    setFilteredProjects(result);
  }, [activeFilter, searchQuery]);

  const handleRequestSimilar = (category: string) => {
    // Map project category to request service types
    let mapped: 'commercial' | 'office' | 'booth' | 'other' = 'other';
    if (category === 'commercial') mapped = 'commercial';
    else if (category === 'office') mapped = 'office';
    else if (category === 'booth') mapped = 'booth';

    setPreselectedService(mapped);
    setSelectedProject(null);
    setActivePage('quote');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen text-zinc-900 bg-transparent pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full relative z-10">
      
      {/* Page Header */}
      <div className="flex flex-col items-center text-center gap-4 mb-16">
        <div className="px-3.5 py-1 rounded-full border border-[#10798e]/20 bg-[#10798e]/5 text-[#10798e] text-xs font-bold leading-none tracking-widest uppercase">
          {language === 'ar' ? 'سجل الإبداع المعماري' : 'Architectural Portfolio'}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 font-sans">
          {language === 'ar' ? 'مشاريع منجزة على ارض الواقع' : 'Masterpieces & Delivered Contracts'}
        </h1>
        <p className="text-zinc-650 text-sm sm:text-base max-w-2xl font-light">
          {language === 'ar' 
            ? 'تصفح تشكيلة واسعة من معارض التجزئة، المقرات الذكية، والبوثات الإبداعية التي قمنا بإنشائها وتصنيع خشبياتها في مصانعنا وتسليمها كلياً.'
            : 'Explore a diverse selection of premium retail spaces, hyper-functional workplaces, and exhibition booths built and delivered across Saudi Arabia.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-5 bg-white border border-zinc-200 rounded-2xl p-4 mb-12 shadow-sm">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {([
            { id: 'all', label: t.filterAll },
            { id: 'commercial', label: t.filterCommercial },
            { id: 'office', label: t.filterOffice },
            { id: 'booth', label: t.filterBooth }
          ] as const).map((filter) => {
            const isActive = activeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-[#10798e] text-white shadow-lg shadow-[#10798e]/20'
                    : 'bg-slate-50 text-zinc-600 hover:text-[#10798e] hover:bg-zinc-100'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-80">
          <div className={`absolute top-1/2 -translate-y-1/2 text-zinc-400 ${language === 'ar' ? 'left-3' : 'right-3'}`}>
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder={language === 'ar' ? 'ابحث عن مشروع، عميل أو مدينة...' : 'Search for a project, store, client...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-2.5 rounded-xl text-xs sm:text-sm bg-slate-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#10798e] focus:ring-1 focus:ring-[#10798e]/25 transition-all ${
              language === 'ar' ? 'pl-10 pr-4' : 'pr-10 pl-4'
            }`}
          />
        </div>

      </div>

      {/* Empty Search State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-20 bg-white border border-zinc-200 rounded-2xl shadow-sm">
          <p className="text-zinc-500 text-sm">
            {language === 'ar' 
              ? 'لم نعثر على أي نتائج مطابقة لبحثك. جرب استخدام كلمات مفتاحية أخرى.'
              : 'No matching projects found. Try looking for other terms.'}
          </p>
        </div>
      )}

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((proj) => (
          <motion.div
            key={proj.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(proj)}
            className="group cursor-pointer flex flex-col rounded-2xl border border-zinc-200 bg-white hover:border-[#10798e]/45 hover:shadow-2xl shadow-sm transition-all duration-300 overflow-hidden"
          >
            {/* Project Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-black">
              {/* Autoplay muted video directly without fake image placeholder */}
              {proj.youtubeId ? (
                <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-black">
                  <YoutubePlayer
                    youtubeId={proj.youtubeId}
                    title={proj.titleAr}
                    className="w-full h-full opacity-95 transition-opacity"
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

              {/* Absolute overlay elements: gradient + touch block */}
              <div className="absolute inset-0 bg-[#000000]/25 z-25 cursor-pointer" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent opacity-80 z-20 pointer-events-none" />

              <div className="absolute bottom-4 right-4 bg-[#10798e] text-white text-[10px] font-black px-3 py-1.5 rounded-lg border border-white/10 shadow-md z-30">
                {proj.category === 'commercial' && (language === 'ar' ? 'محلات تجارية' : 'Retail')}
                {proj.category === 'office' && (language === 'ar' ? 'مكاتب ومقرات عمل' : 'Corporate')}
                {proj.category === 'booth' && (language === 'ar' ? 'بوثات ومعارض' : 'Exhibition')}
              </div>
            </div>

            {/* Information Card Body */}
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
                <span className="text-[#10798e] font-semibold text-xs transition-colors flex items-center gap-1 p-1 hover:bg-[#10798e]/5 rounded-lg">
                  <span>{language === 'ar' ? 'التفاصيل' : 'Specs'}</span>
                  {language === 'ar' ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 3. DETAILED MODAL OVERLAY */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            {/* Modal Body Container */}
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white border border-zinc-250 rounded-3xl overflow-hidden shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Corner Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-slate-50 border border-zinc-200 text-zinc-550 hover:bg-slate-100 hover:text-zinc-950 transition-all active:scale-95"
                aria-label="Close details"
              >
                <X className="h-5 w-5" />
              </button>

               <div className="grid grid-cols-1 md:grid-cols-2">
                
                {/* Visual Thumbnail */}
                <div className="relative w-full aspect-[9/16] md:aspect-auto md:h-full md:min-h-[500px] bg-zinc-950 flex items-center justify-center overflow-hidden p-0 md:p-6 border-b border-zinc-150 md:border-b-0 md:border-r border-zinc-200">
                  {selectedProject.youtubeId ? (
                    <YoutubePlayer
                      youtubeId={selectedProject.youtubeId}
                      title={selectedProject.titleAr}
                      className="w-full h-full rounded-none md:rounded-2xl shadow-none md:shadow-2xl z-10"
                      style={{ aspectRatio: '9/16' }}
                      autoplay={true}
                      mute={true}
                      loop={true}
                      controls={false}
                      coverImage="https://www.krea.ai/api/img?f=webp&i=https%3A%2F%2Fapp-uploads.krea.ai%2Fpublic%2F5b7ad27d-3d78-4ebb-aa63-68a1426dabca.png&s=1024"
                    />
                  ) : (
                    <>
                      <img
                        src={selectedProject.mainImage}
                        alt={selectedProject.titleAr}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/20 via-transparent to-transparent z-10 pointer-events-none" />
                    </>
                  )}
                </div>

                {/* Mobile-Only Compact Info Layout */}
                <div className="md:hidden flex flex-col gap-5 p-5 bg-white">
                  {/* Compact Grid of the 4 requested indicators */}
                  <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-zinc-200">
                    
                    {/* Client */}
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-[#10798e] mt-0.5 whitespace-nowrap shrink-0" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">
                          {language === 'ar' ? 'العميل' : 'Client'}
                        </span>
                        <span className="text-xs font-semibold text-zinc-800 truncate">
                          {language === 'ar' ? selectedProject.clientAr : selectedProject.clientEn}
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-[#10798e] mt-0.5 whitespace-nowrap shrink-0" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">
                          {language === 'ar' ? 'الموقع' : 'Location'}
                        </span>
                        <span className="text-xs font-semibold text-zinc-800 truncate">
                          {language === 'ar' ? selectedProject.locationAr : selectedProject.locationEn}
                        </span>
                      </div>
                    </div>

                    {/* Area */}
                    <div className="flex items-start gap-2">
                      <Maximize2 className="h-4 w-4 text-zinc-400 mt-0.5 whitespace-nowrap shrink-0" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">
                          {language === 'ar' ? 'المساحة' : 'Area'}
                        </span>
                        <span className="text-xs font-semibold text-zinc-800 truncate">
                          {selectedProject.area}
                        </span>
                      </div>
                    </div>

                    {/* Project Category */}
                    <div className="flex items-start gap-2">
                      <Layers className="h-4 w-4 text-[#10798e] mt-0.5 whitespace-nowrap shrink-0" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">
                          {language === 'ar' ? 'نوع المشروع' : 'Project Type'}
                        </span>
                        <span className="text-xs font-semibold text-zinc-800 truncate">
                          {selectedProject.category === 'commercial' && (language === 'ar' ? 'محلات تجارية' : 'Retail')}
                          {selectedProject.category === 'office' && (language === 'ar' ? 'مكاتب ومقرات عمل' : 'Corporate')}
                          {selectedProject.category === 'booth' && (language === 'ar' ? 'بوثات ومعارض' : 'Exhibition')}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleRequestSimilar(selectedProject.category)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-xs font-black bg-[#10798e] hover:bg-[#0c5c6d] text-white shadow-md shadow-[#10798e]/20 active:scale-95 transition-all duration-300"
                  >
                    <span>{language === 'ar' ? 'اطلب تنفيذ مشروع مشابه' : 'Request Similar Project'}</span>
                    {language === 'ar' ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                  </button>
                </div>

                {/* Desktop-Only Structured Text details */}
                <div className="hidden md:flex p-6 md:p-8 flex-col justify-between max-h-[85vh] overflow-y-auto">
                  <div className="flex flex-col gap-6">
                    {/* Category Header */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-1 text-[10px] font-extrabold tracking-wider rounded-lg bg-[#10798e]/10 text-[#10798e] border border-[#10798e]/20 uppercase">
                        {selectedProject.category === 'commercial' && (language === 'ar' ? 'محلات تجارية' : 'Retail')}
                        {selectedProject.category === 'office' && (language === 'ar' ? 'مكاتب ومقرات عمل' : 'Corporate')}
                        {selectedProject.category === 'booth' && (language === 'ar' ? 'بوثات ومعارض' : 'Exhibition')}
                      </span>
                    </div>

                    {/* Project Title */}
                    <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 leading-tight">
                      {language === 'ar' ? selectedProject.titleAr : selectedProject.titleEn}
                    </h2>

                    <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed font-light">
                      {language === 'ar' ? selectedProject.descriptionAr : selectedProject.descriptionEn}
                    </p>

                    {/* Metadata Grid (Client, Location, Type, Size) */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-zinc-200">
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-[#10798e] mt-0.5 whitespace-nowrap shrink-0" />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase">{t.projectClient}</span>
                          <span className="text-xs font-semibold text-zinc-800 truncate">
                            {language === 'ar' ? selectedProject.clientAr : selectedProject.clientEn}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-[#10798e] mt-0.5 whitespace-nowrap shrink-0" />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase">{t.projectLocation}</span>
                          <span className="text-xs font-semibold text-zinc-800 truncate">
                            {language === 'ar' ? selectedProject.locationAr : selectedProject.locationEn}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Layers className="h-4 w-4 text-[#10798e] mt-0.5 whitespace-nowrap shrink-0" />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase">
                            {language === 'ar' ? 'نوع المشروع' : 'Project Type'}
                          </span>
                          <span className="text-xs font-semibold text-zinc-800 truncate">
                            {selectedProject.category === 'commercial' && (language === 'ar' ? 'محلات تجارية' : 'Retail')}
                            {selectedProject.category === 'office' && (language === 'ar' ? 'مكاتب ومقرات عمل' : 'Corporate')}
                            {selectedProject.category === 'booth' && (language === 'ar' ? 'بوثات ومعارض' : 'Exhibition')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Maximize2 className="h-4 w-4 text-zinc-400 mt-0.5 whitespace-nowrap shrink-0" />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase">{t.projectArea}</span>
                          <span className="text-xs font-semibold text-zinc-800 truncate">
                            {selectedProject.area}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit study target */}
                  <div className="flex flex-col gap-2 pt-6 border-t border-zinc-150 mt-8">
                    <button
                      onClick={() => handleRequestSimilar(selectedProject.category)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold bg-[#10798e] hover:bg-[#0c5c6d] text-white shadow-md shadow-[#10798e]/20 active:scale-95 transition-all duration-300"
                    >
                      <span>{language === 'ar' ? 'اطلب تنفيذ مشروع مشابه' : 'Request Similar Project'}</span>
                      {language === 'ar' ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
