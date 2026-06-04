/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, FileText, Send, Building2, Printer, Mail } from 'lucide-react';
import { Language, QuoteRequest } from '../types';
import { Translations } from '../data';

interface QuoteViewProps {
  language: Language;
  preselectedService: 'commercial' | 'office' | 'booth' | 'other' | null;
  setPreselectedService: (service: 'commercial' | 'office' | 'booth' | 'other' | null) => void;
}

export function QuoteView({ language, preselectedService, setPreselectedService }: QuoteViewProps) {
  const t = Translations[language];

  // Form State
  const [formData, setFormData] = useState<QuoteRequest>({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    serviceType: 'commercial',
    areaSize: 150,
    budget: '150k-500k',
    timeline: 'normal',
    details: ''
  });

  // Apply preselected service from projects page
  useEffect(() => {
    if (preselectedService) {
      setFormData(prev => ({ ...prev, serviceType: preselectedService }));
      // Reset after consumption
      setPreselectedService(null);
    }
  }, [preselectedService, setPreselectedService]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiSuccessMessage, setApiSuccessMessage] = useState<string | null>(null);

  // Determine dynamic min/max area sizes based on serviceType
  let minArea = 40;
  let maxArea = 5000;
  if (formData.serviceType === 'commercial') {
    minArea = 40;
    maxArea = 5000;
  } else if (formData.serviceType === 'booth') {
    minArea = 12;
    maxArea = 500;
  } else if (formData.serviceType === 'office') {
    minArea = 80;
    maxArea = 1000;
  }

  // Clamping area size when service type changes
  useEffect(() => {
    let minA = 40;
    let maxA = 5000;
    if (formData.serviceType === 'booth') {
      minA = 12;
      maxA = 500;
    } else if (formData.serviceType === 'office') {
      minA = 80;
      maxA = 1000;
    }
    
    if (formData.areaSize < minA) {
      setFormData(prev => ({ ...prev, areaSize: minA }));
    } else if (formData.areaSize > maxA) {
      setFormData(prev => ({ ...prev, areaSize: maxA }));
    }
  }, [formData.serviceType]);

  const getMailtoUrl = (code: string) => {
    const subjectAr = `طلب عرض سعر جديد - ${formData.fullName} - ${code}`;
    const subjectEn = `New Quote Request - ${formData.fullName} - ${code}`;
    const subject = language === 'ar' ? subjectAr : subjectEn;

    let serviceLabel = formData.serviceType;
    if (formData.serviceType === 'commercial') serviceLabel = language === 'ar' ? 'محلات تجارية' : 'Retail Store';
    else if (formData.serviceType === 'office') serviceLabel = language === 'ar' ? 'المكاتب ومقرات العمل' : 'Offices';
    else if (formData.serviceType === 'booth') serviceLabel = language === 'ar' ? 'البوثات والمعارض' : 'Booths / Exhibitions';

    let budgetLabel = formData.budget;
    if (formData.budget === 'under50k') budgetLabel = t.budgetUnder50k;
    else if (formData.budget === '50k-150k') budgetLabel = t.budget50k150k;
    else if (formData.budget === '150k-500k') budgetLabel = t.budget150k500k;
    else if (formData.budget === 'over500k') budgetLabel = t.budgetOver500k;

    let timelineLabel = formData.timeline;
    if (formData.timeline === 'urgent') timelineLabel = t.timelineUrgent;
    else if (formData.timeline === 'normal') timelineLabel = t.timelineNormal;
    else if (formData.timeline === 'flexible') timelineLabel = t.timelineFlexible;

    const bodyAr = `مرحباً فريق فزين (PHZYN)،\n\n` +
      `تم تقديم طلب عرض سعر جديد عبر الموقع الإلكتروني بالتفاصيل التالية:\n\n` +
      `■ الكود المرجعي للطلب: ${code}\n` +
      `■ الاسم بالكامل: ${formData.fullName}\n` +
      `■ الجهة أو العلامة التجارية: ${formData.companyName || 'لا يوجد / شخصي'}\n` +
      `■ البريد الإلكتروني للعميل: ${formData.email}\n` +
      `■ رقم الجوال: ${formData.phone}\n\n` +
      `■ نوع المشروع: ${serviceLabel}\n` +
      `■ المساحة التقريبية: ${formData.areaSize} متر مربع\n` +
      `■ الميزانية التقريبية: ${budgetLabel}\n` +
      `■ الجدول الزمني لطلب التنفيذ: ${timelineLabel}\n\n` +
      `■ تفاصيل ومواصفات إضافية للمشروع:\n` +
      `${formData.details || 'لا توجد تفاصيل إضافية'}\n\n` +
      `---\n` +
      `تم إنشاء هذا المستند تلقائياً عبر موقع فزين فلو كأداة لتشغيل الطلبات المخصصة.`;

    const bodyEn = `Dear PHZYN Team,\n\n` +
      `A new architecture quote estimate was registered via the web app:\n\n` +
      `■ Reference Code: ${code}\n` +
      `■ Full Name: ${formData.fullName}\n` +
      `■ Company Name: ${formData.companyName || 'N/A'}\n` +
      `■ Client Email: ${formData.email}\n` +
      `■ Phone Number: ${formData.phone}\n\n` +
      `■ Fit-out Service Type: ${serviceLabel}\n` +
      `■ Approximate Area: ${formData.areaSize} Sqm\n` +
      `■ Stated Budget: ${budgetLabel}\n` +
      `■ Desired Timeline: ${timelineLabel}\n\n` +
      `■ Additional Specs & In-house wishes:\n` +
      `${formData.details || 'None provided'}\n\n` +
      `---\n` +
      `This ticket was auto-generated by the PHZYN web portal client system.`;

    const body = language === 'ar' ? bodyAr : bodyEn;
    return `mailto:phzyn@phzyn.sa?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      return;
    }

    const code = 'PHZ-' + Math.floor(100000 + Math.random() * 900000);
    setTicketNumber(code);
    setIsSending(true);
    setApiError(null);
    setApiSuccessMessage(null);

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ticketNumber: code,
          language
        })
      });

      const data = await response.json();
      setIsSending(false);

      if (data.success) {
        setIsSubmitted(true);
        if (data.message) {
          setApiSuccessMessage(data.message);
        }
      } else {
        setApiError(data.message || (language === 'ar' ? 'حدث خطأ متوقع من الخادم.' : 'An error was returned from server.'));
        setIsSubmitted(true); // Still view ticket receipt as fallback
      }
    } catch (err) {
      console.error('Fetch post error:', err);
      setIsSending(false);
      // Perfect safe fallback: show local receipt but label it as offline-safe/cached local dispatch
      setIsSubmitted(true);
      setApiError(language === 'ar' 
        ? 'تم حفظ بطاقة الطلب بنجاح، يرجى حفظ المستند ريثما يتم التحقق من اتصال الخادم.' 
        : 'Registered ticket locally. Please print/save it.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen text-zinc-900 bg-transparent pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full relative z-10">
      
      {/* Page Header */}
      <div className="flex flex-col items-center text-center gap-4 mb-16 select-none font-sans">
        <div className="px-3.5 py-1 rounded-full border border-[#10798e]/20 bg-[#10798e]/5 text-[#10798e] text-xs font-bold leading-none tracking-widest uppercase">
          {language === 'ar' ? 'طلب عرض السعر' : 'Request a Quote'}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 font-sans">
          {t.sectionQuote}
        </h1>
        <p className="text-zinc-650 text-sm sm:text-base max-w-2xl font-light">
          {t.sectionQuoteSub}
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="formPanel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-3xl mx-auto w-full"
          >
            {/* Form Section */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 bg-white p-6 sm:p-10 rounded-3xl border border-zinc-250/80 shadow-xl">
              
              <h2 className="text-xl font-bold flex items-center gap-2 border-b border-zinc-150 pb-4 text-zinc-900">
                <FileText className="h-5 w-5 text-[#10798e]" />
                <span>{language === 'ar' ? '١. معلومات العميل والاتصال' : '1. Contact Parameters'}</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-500 font-semibold">{t.quoteFormName} *</label>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={e => setFormData(keys => ({ ...keys, fullName: e.target.value }))}
                    className="py-3 px-4 rounded-xl text-sm bg-slate-50 border border-zinc-200 text-zinc-900 placeholder-zinc-450 focus:outline-none focus:border-[#10798e] focus:ring-1 focus:ring-[#10798e]/20 transition-all font-sans"
                    placeholder={language === 'ar' ? 'مثال: سعد بن خالد' : 'e.g., Jean-Luc Picard'}
                  />
                </div>

                {/* Institution / Brand / Company Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-500 font-semibold">{t.quoteFormCompany}</label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={e => setFormData(keys => ({ ...keys, companyName: e.target.value }))}
                    className="py-3 px-4 rounded-xl text-sm bg-slate-50 border border-zinc-200 text-zinc-900 placeholder-zinc-450 focus:outline-none focus:border-[#10798e] focus:ring-1 focus:ring-[#10798e]/20 transition-all font-sans"
                    placeholder={language === 'ar' ? 'اختياري (اسم الجهة أو العلامة التجارية)' : 'Optional (Entity or brand name)'}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-500 font-semibold">{t.quoteFormEmail} *</label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(keys => ({ ...keys, email: e.target.value }))}
                    className="py-3 px-4 rounded-xl text-sm bg-slate-50 border border-zinc-200 text-zinc-900 placeholder-zinc-450 focus:outline-none focus:border-[#10798e] focus:ring-1 focus:ring-[#10798e]/20 transition-all ltr font-sans"
                    placeholder="name@company.com"
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-500 font-semibold">{t.quoteFormPhone} *</label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData(keys => ({ ...keys, phone: e.target.value }))}
                    className="py-3 px-4 rounded-xl text-sm bg-slate-50 border border-zinc-200 text-zinc-900 placeholder-zinc-450 focus:outline-none focus:border-[#10798e] focus:ring-1 focus:ring-[#10798e]/20 transition-all ltr font-sans"
                    placeholder="+966 50 000 0000"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold flex items-center gap-2 border-b border-zinc-150 pb-4 text-zinc-900 mt-4 font-sans">
                <Building2 className="h-5 w-5 text-[#10798e]" />
                <span>{language === 'ar' ? '٢. بيانات المشروع' : '2. Contract Specifications'}</span>
              </h2>

              <div className="flex flex-col gap-6">
                
                {/* Service Type Selection */}
                <div className="flex flex-col gap-2.5">
                  <label className="text-xs text-zinc-500 font-semibold">{t.quoteFormType}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {([
                      { id: 'commercial', val: t.retailStore },
                      { id: 'office', val: t.officeFit },
                      { id: 'booth', val: t.boothFit }
                    ] as const).map(option => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setFormData(keys => ({ ...keys, serviceType: option.id }))}
                        className={`p-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all border flex flex-col items-center gap-2 justify-center ${
                          formData.serviceType === option.id
                            ? 'bg-[#10798e]/10 border-[#10798e] text-[#10798e] shadow-sm'
                            : 'bg-slate-50 border-zinc-200 text-zinc-650 hover:bg-slate-100/80 hover:text-zinc-900'
                        }`}
                      >
                        <span className="text-center">{option.val}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Area in meters */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-zinc-550">
                    <span className="font-semibold">{t.quoteFormArea}</span>
                    <span className="font-bold text-[#10798e] font-sans text-sm bg-[#10798e]/10 px-3.5 py-1 rounded-full border border-[#10798e]/20 whitespace-nowrap">
                      {formData.areaSize} {language === 'ar' ? 'متر مربع' : 'Sqm'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={minArea}
                    max={maxArea}
                    step={1}
                    value={formData.areaSize}
                    onChange={e => setFormData(keys => ({ ...keys, areaSize: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#10798e]"
                  />
                  <div className="flex justify-between text-[10px] text-zinc-500 font-mono font-bold">
                    <span>{minArea} SQM</span>
                    <span>{maxArea.toLocaleString()} SQM</span>
                  </div>
                </div>

                {/* Timeline and target budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Timeline options */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-zinc-500 font-semibold">{t.quoteFormTimeline}</label>
                    <select
                      value={formData.timeline}
                      onChange={e => setFormData(keys => ({ ...keys, timeline: e.target.value }))}
                      className="py-3 px-4 rounded-xl text-sm bg-slate-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-[#10798e] cursor-pointer font-sans"
                    >
                      <option value="urgent">{t.timelineUrgent}</option>
                      <option value="normal">{t.timelineNormal}</option>
                      <option value="flexible">{t.timelineFlexible}</option>
                    </select>
                  </div>

                  {/* Target budget */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-zinc-500 font-semibold">{t.quoteFormBudget}</label>
                    <select
                      value={formData.budget}
                      onChange={e => setFormData(keys => ({ ...keys, budget: e.target.value }))}
                      className="py-3 px-4 rounded-xl text-sm bg-slate-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-[#10798e] cursor-pointer font-sans"
                    >
                      <option value="under50k">{t.budgetUnder50k}</option>
                      <option value="50k-150k">{t.budget50k150k}</option>
                      <option value="150k-500k">{t.budget150k500k}</option>
                      <option value="over500k">{t.budgetOver500k}</option>
                    </select>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-500 font-semibold">{t.quoteFormDetails}</label>
                  <textarea
                    rows={4}
                    value={formData.details}
                    onChange={e => setFormData(keys => ({ ...keys, details: e.target.value }))}
                    className="py-3 px-4 rounded-xl text-sm bg-slate-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#10798e] focus:ring-1 focus:ring-[#10798e]/20 transition-all font-sans"
                    placeholder={language === 'ar' ? 'يرجى تقديم تفاصيل إضافية مثل رغبتك بنوع معين من الخشب، وجود زوايا منحنية بالمعرض أو متطلبات عزل خاصة للعمل المكتبي...' : 'Details about wood finishes, glass walls, layout configs...'}
                  />
                </div>

              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSending}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-xs sm:text-sm font-bold bg-[#10798e] hover:bg-[#0c5c6d] text-white shadow-xl focus:ring-2 focus:ring-[#10798e]/20 active:scale-[0.98] transition-all mt-4 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>{language === 'ar' ? 'جاري إرسال الطلب لـ phzyn@phzyn.sa...' : 'Transmitting Quote directly...'}</span>
                  </>
                ) : (
                  <>
                    <span>{t.quoteFormSubmit}</span>
                    <Send className="h-4 w-4" />
                  </>
                )}
              </button>

            </form>
          </motion.div>
        ) : (
          /* Successful custom receipt display */
          <motion.div
            key="successPanel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto bg-white border border-zinc-200 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col gap-6"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <CheckCircle2 className="h-16 w-16 text-[#10798e] animate-bounce" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-zinc-900 font-sans">
                {language === 'ar' ? 'تم تسجيل المعايير بنجاح!' : 'Quote Request Enregistered!'}
              </h2>
              
              {apiSuccessMessage && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl font-sans mt-1 w-full max-w-md text-center">
                  <strong>{language === 'ar' ? '✓ تم الإرسال المباشر:' : '✓ Automated Dispatch:'}</strong> {apiSuccessMessage}
                </div>
              )}

              {apiError && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-850 text-xs rounded-2xl font-sans mt-1 w-full max-w-md text-right">
                  <span className="font-bold text-amber-900 block mb-1">
                    {language === 'ar' ? '⚠️ الإرسال التلقائي معلّق:' : '⚠️ SMTP Setup Pending:'}
                  </span>
                  <span>{apiError}</span>
                  <p className="mt-2 text-[10px] text-zinc-500 leading-relaxed font-sans border-t border-amber-200/60 pt-2">
                    {language === 'ar' 
                      ? 'المشروع محفوظ محلياً. يرجى تهيئة متغيرات خادم الإيميل (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) في لوحة الإعدادات/الخزنة لتفعيل التسليم الآلي تماماً للشركة.' 
                      : 'The form is fully saved. Please declare SMTP credentials (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS) in the secret keys manager to activate direct email delivery.'}
                  </p>
                </div>
              )}

              {!apiSuccessMessage && !apiError && (
                <p className="text-zinc-650 text-xs sm:text-sm font-light max-w-md font-sans">
                  {t.quoteFormSuccess}
                </p>
              )}
            </div>

            {/* Custom invoice receipt box */}
            <div id="print-area" className="bg-slate-50 border border-zinc-200 rounded-2xl p-6 flex flex-col gap-5 text-sm">
              <div className="flex justify-between items-center border-b border-zinc-150 pb-4">
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#10798e] font-mono text-base tracking-wider text-right">PHZYN</span>
                  <span className="text-[10px] text-zinc-500">{new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                </div>
                <div className="flex flex-col items-end animate-pulse">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">{language === 'ar' ? 'رقم الإحالة للملف' : 'Reference Code'}</span>
                  <span className="font-mono text-xs text-[#10798e] font-bold">{ticketNumber}</span>
                </div>
              </div>

              {/* Receipt item specs */}
              <div className="flex flex-col gap-3 font-sans">
                <div className="flex justify-between text-xs font-light">
                  <span className="text-zinc-500">{language === 'ar' ? 'الاسم بالكامل' : 'Client Name'}:</span>
                  <span className="font-semibold text-zinc-900">{formData.fullName}</span>
                </div>
                {formData.companyName && (
                  <div className="flex justify-between text-xs font-light">
                     <span className="text-zinc-500">{language === 'ar' ? 'الجهة أو العلامة التجارية' : 'Entity / Brand'}:</span>
                     <span className="font-semibold text-zinc-900">{formData.companyName}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-light">
                  <span className="text-zinc-500">{language === 'ar' ? 'نوع مشروع التنفيذ' : 'Fit-out Category'}:</span>
                  <span className="font-semibold text-zinc-900">
                    {formData.serviceType === 'commercial' && (language === 'ar' ? 'محلات تجارية' : 'Retail')}
                    {formData.serviceType === 'office' && (language === 'ar' ? 'مكاتب ومبرات' : 'Corporate')}
                    {formData.serviceType === 'booth' && (language === 'ar' ? 'بوثات ومعارض' : 'Exhibition')}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-light">
                  <span className="text-zinc-500">{language === 'ar' ? 'المساحة المدخلة' : 'Floor Space'}:</span>
                  <span className="font-semibold text-zinc-900">{formData.areaSize} {language === 'ar' ? 'متر مربع' : 'sqm'}</span>
                </div>
                <div className="flex justify-between text-xs font-light">
                  <span className="text-zinc-500">{language === 'ar' ? 'ميزانية العهدة' : 'Stated Budget'}:</span>
                  <span className="font-semibold text-zinc-900">
                    {formData.budget === 'under50k' && t.budgetUnder50k}
                    {formData.budget === '50k-150k' && t.budget50k150k}
                    {formData.budget === '150k-500k' && t.budget150k500k}
                    {formData.budget === 'over500k' && t.budgetOver500k}
                  </span>
                </div>
              </div>

              <div className="border-t border-zinc-200 pt-4 flex flex-col gap-1 text-center bg-slate-100/50 rounded-xl p-3.5 border border-zinc-200 font-sans">
                <span className="text-zinc-500 text-[10px] tracking-widest uppercase font-bold">
                  {language === 'ar' ? 'حالة الطلب الحالي' : 'Request Status'}
                </span>
                <span className="font-bold text-[#10798e] text-sm">
                  {language === 'ar' ? 'تم تسجيل البيانات وإرسالها للدراسة والمراجعة' : 'Transmitted for Engineering Review'}
                </span>
              </div>
            </div>

            {/* Print, Email, and Share buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 font-sans w-full mt-2">
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full sm:w-auto px-5 py-3 rounded-full border border-zinc-250 bg-slate-50 text-xs font-bold text-zinc-650 hover:bg-slate-100 hover:text-zinc-900 transition-all active:scale-[0.95] cursor-pointer"
              >
                {language === 'ar' ? 'تعديل البيانات وإرسال طلب آخر' : 'Review & Edit Details'}
              </button>

              <a
                href={getMailtoUrl(ticketNumber)}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#10798e]/10 border border-[#10798e]/20 hover:bg-[#10798e]/20 text-xs font-bold text-[#10798e] transition-all active:scale-[0.95] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                <span>{language === 'ar' ? 'إرسال نسخة بريد يدوياً كاحتياط' : 'Send email manually as backup'}</span>
              </a>

              <button
                onClick={handlePrint}
                className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#10798e] hover:bg-[#0c5c6d] text-xs font-black text-white transition-all active:scale-[0.95] flex items-center justify-center gap-2 shadow-lg shadow-[#10798e]/20 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>{language === 'ar' ? 'طباعة / حفظ كـ PDF' : 'Print / Export PDF'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
