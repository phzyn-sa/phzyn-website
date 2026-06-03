/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Mail, MapPin, ArrowUp, Smartphone, Instagram, Linkedin } from 'lucide-react';
import { Logo } from './Logo';
import { Page, Language } from '../types';
import { Translations } from '../data';

const XIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.95 1.2 2.27 2.04 3.73 2.41V10.6c-1.44-.06-2.87-.54-4.07-1.37a7.2 7.2 0 0 1-2.53-3.11c-.04.42-.04.85-.04 1.27v10.02c.07 1.28-.27 2.56-1 3.61a7.48 7.48 0 0 1-4.73 3.49c-1.42.31-2.92.19-4.27-.34A7.41 7.41 0 0 1 .49 20.25a7.51 7.51 0 0 1-.22-5.74A7.42 7.42 0 0 1 4.54 9.8c1.3-.39 2.7-.27 3.92.34v4.09c-.83-.4-1.78-.49-2.67-.24a3.39 3.39 0 0 0-2.31 2.3 3.35 3.35 0 0 0 2 3.86c.92.42 2 .42 2.91 0a3.37 3.37 0 0 0 2.05-3.09V0h.084z" />
  </svg>
);

interface FooterProps {
  language: Language;
  setActivePage: (page: Page) => void;
}

export function Footer({ language, setActivePage }: FooterProps) {
  const t = Translations[language];

  const handleNavClick = (page: Page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white border-t border-zinc-200 pt-16 pb-8 px-4 md:px-8 max-w-7xl mx-auto rounded-t-3xl mt-12 overflow-hidden relative shadow-sm">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-[#10798e]/40 to-transparent" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-12">
        {/* Brand overview */}
        <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-start gap-4">
          <Logo light={false} showSubtitle={false} className="scale-95 origin-center md:origin-right" />
        </div>

        {/* Social accounts */}
        <div className="md:col-span-3 flex flex-col items-center md:items-start gap-4 mt-2">
          <span className="text-xs font-bold tracking-widest text-[#10798e] uppercase border-b border-[#10798e]/30 pb-1.5 w-max text-center">
            {t.footerLinks}
          </span>
          <div className="flex flex-col items-center md:items-start gap-3.5">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/phzyn_co/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-zinc-600 hover:text-[#10798e] transition-all text-xs sm:text-sm"
              id="footer-ig"
            >
              <Instagram className="h-4 w-4 text-[#10798e]" />
              <span>{language === 'ar' ? 'إنستغرام' : 'Instagram'}</span>
            </a>

            {/* TikTok */}
            <a
              href="https://www.tiktok.com/@phzyn_co"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-zinc-600 hover:text-[#10798e] transition-all text-xs sm:text-sm"
              id="footer-tiktok"
            >
              <TikTokIcon className="h-4 w-4 text-[#10798e]" />
              <span>{language === 'ar' ? 'تيك توك' : 'TikTok'}</span>
            </a>

            {/* X */}
            <a
              href="https://x.com/Phzyn_co"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-zinc-600 hover:text-[#10798e] transition-all text-xs sm:text-sm"
              id="footer-x"
            >
              <XIcon className="h-4 w-4 text-[#10798e]" />
              <span>{language === 'ar' ? 'منصة إكس' : 'X Platform'}</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/phzyn/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-zinc-600 hover:text-[#10798e] transition-all text-xs sm:text-sm"
              id="footer-linkedin"
            >
              <Linkedin className="h-4 w-4 text-[#10798e]" />
              <span>{language === 'ar' ? 'لينكد إن' : 'LinkedIn'}</span>
            </a>
          </div>
        </div>

        {/* Contact info */}
        <div className="md:col-span-4 flex flex-col items-center md:items-start gap-4 mt-2">
          <span className="text-xs font-bold tracking-widest text-[#10798e] uppercase border-b border-[#10798e]/30 pb-1.5 w-max text-center">
            {t.footerContact}
          </span>
          <div className="flex flex-col items-center md:items-start gap-3.5 w-full">
            
            {/* Phone */}
            <a
              href="tel:+966538488654"
              className="flex items-center gap-2.5 text-zinc-600 hover:text-[#10798e] transition-all text-xs sm:text-sm"
              id="footer-phone"
            >
              <Smartphone className="h-4 w-4 text-[#10798e]" />
              <span className="font-mono" dir="ltr">+966538488654</span>
            </a>

            {/* Email */}
            <a
              href="mailto:info@phzyn.sa"
              className="flex items-center gap-2.5 text-zinc-600 hover:text-[#10798e] transition-all text-xs sm:text-sm"
              id="footer-email"
            >
              <Mail className="h-4 w-4 text-[#10798e]" />
              <span className="font-mono">info@phzyn.sa</span>
            </a>

            {/* Location */}
            <div className="flex items-start gap-2.5 text-zinc-600 text-xs sm:text-sm text-center md:text-start" id="footer-location">
              <MapPin className="h-4 w-4 text-[#10798e] flex-shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                {language === 'ar' 
                  ? 'المملكة العربية السعودية - الرياض - حي الياسمين - طريق الملك عبد العزيز'
                  : 'King Abdulaziz Road, Al Yasmin, Riyadh, Saudi Arabia'}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Under-Footer Copyright */}
      <div className="border-t border-zinc-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
        <span className="text-zinc-500 text-[10px] sm:text-xs">
          {t.footerRights}
        </span>

        {/* Scroll back to top button */}
        <button
          onClick={scrollToTop}
          className="p-2 sm:p-2.5 rounded-full bg-slate-50 border border-zinc-200 text-zinc-600 hover:text-[#10798e] hover:border-[#10798e]/40 transition-all shadow-sm active:scale-95 flex items-center gap-1.5 text-xs font-semibold"
          aria-label="Scroll back top"
        >
          <span>{language === 'ar' ? 'أعلى الصفحة' : 'Scroll Top'}</span>
          <ArrowUp className="h-3.5 w-3.5" />
        </button>
      </div>
    </footer>
  );
}
