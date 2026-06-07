/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, FileText, Send, Building2, Printer } from 'lucide-react';
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
    details: '',
    city: '',
    neighborhood: ''
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
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [smtpSuccess, setSmtpSuccess] = useState<boolean | null>(null);
  const [smtpError, setSmtpError] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      return;
    }

    setIsSending(true);
    setSubmitError(null);
    setSmtpSuccess(null);
    setSmtpError(null);

    // Generate ticket receipt
    const code = 'PHZ-' + Math.floor(100000 + Math.random() * 900050);
    setTicketNumber(code);

    try {
      // Build fetch request to SMTP server API endpoint
      const response = await fetch('/api/send-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ticketNumber: code,
        }),
      });

      const resData = await response.json().catch(() => ({}));
      if (!response.ok) {
        setSmtpSuccess(false);
        setSmtpError(resData.error || resData.details || 'SMTP Error');
      } else {
        setSmtpSuccess(true);
      }
    } catch (err: any) {
      console.warn('Background SMTP send did not complete:', err);
      setSmtpSuccess(false);
      setSmtpError(err.message || 'Network error');
    } finally {
      setIsSending(false);
      setIsSubmitted(true); // Always proceed to the beautiful success screen!
    }
  };

  const getWhatsAppMessage = () => {
    const serviceLabel = 
      formData.serviceType === 'commercial' ? (language === 'ar' ? 'تنفيذ محلات تجارية' : 'Retail Retail Store') :
      formData.serviceType === 'office' ? (language === 'ar' ? 'تنفيذ مكاتب ومجمعات' : 'Office Fit-out') :
      formData.serviceType === 'booth' ? (language === 'ar' ? 'تنفيذ بوثات ومعارض' : 'Exhibition Booth') : formData.serviceType;

    const budgetLabel = 
      formData.budget === 'under50k' ? t.budgetUnder50k :
      formData.budget === '50k-150k' ? t.budget50k150k :
      formData.budget === '150k-500k' ? t.budget150k500k :
      formData.budget === 'over500k' ? t.budgetOver500k : formData.budget;

    const timelineLabel = 
      formData.timeline === 'urgent' ? (language === 'ar' ? 'عاجل' : 'Urgent') :
      formData.timeline === 'normal' ? (language === 'ar' ? 'طبيعي - من شهر إلى ٣ أشهر' : 'Normal') :
      formData.timeline === 'flexible' ? (language === 'ar' ? 'مرن - أكثر من ٣ أشهر' : 'Flexible') : formData.timeline;

    const tempCode = 'PHZ-' + Math.floor(100000 + Math.random() * 900050);

    return `السلام عليكم ورحمة الله وبركاته،
أود تقديم طلب مشروع جديد:
📌 *رقم التذكرة:* ${ticketNumber || tempCode}
👤 *اسم العميل:* ${formData.fullName}
🏢 *اسم الجهة/العلامة التجارية:* ${formData.companyName || 'لا يوجد'}
✉️ *البريد الإلكتروني:* ${formData.email}
📞 *رقم الجوال:* ${formData.phone}
🛠️ *نوع الخدمة:* ${serviceLabel}
📍 *المدينة:* ${formData.city || 'غير محدد'}
🏘️ *الحي:* ${formData.neighborhood || 'غير محدد'}
📐 *المساحة:* ${formData.areaSize} متر مربع
💰 *الميزانية التقريبية:* ${budgetLabel}
⏳ *الجدول الزمني للهندسة:* ${timelineLabel}
📝 *تفاصيل إضافية:*
${formData.details || 'لا يوجد'}

تم إرسال هذا الطلب المسبق عبر منصة فزين للمقاولات المعمارية.`;
  };

  const handleWhatsAppSubmitFallback = () => {
    const message = getWhatsAppMessage();
    const url = `https://wa.me/966538488654?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
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

                {/* City and Neighborhood Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-zinc-500 font-semibold">
                      {language === 'ar' ? 'المدينة *' : 'City *'}
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.city}
                      onChange={e => setFormData(keys => ({ ...keys, city: e.target.value }))}
                      className="py-3 px-4 rounded-xl text-sm bg-slate-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#10798e] focus:ring-1 focus:ring-[#10798e]/20 transition-all font-sans text-right"
                      placeholder={language === 'ar' ? 'البحث أو الكتابة... مثلاً الرياض' : 'e.g., Riyadh'}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-zinc-500 font-semibold">
                      {language === 'ar' ? 'الحي *' : 'Neighborhood *'}
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.neighborhood}
                      onChange={e => setFormData(keys => ({ ...keys, neighborhood: e.target.value }))}
                      className="py-3 px-4 rounded-xl text-sm bg-slate-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-[#10798e] focus:ring-1 focus:ring-[#10798e]/20 transition-all font-sans text-right"
                      placeholder={language === 'ar' ? 'مثال: حي حطين' : 'e.g., Al Malqa'}
                    />
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
                className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-xs sm:text-sm font-bold bg-[#10798e] hover:bg-[#0c5c6d] text-white shadow-xl focus:ring-2 focus:ring-[#10798e]/20 active:scale-[0.98] transition-all mt-4 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{isSending ? (language === 'ar' ? 'جاري إرسال الطلب...' : 'Sending request...') : t.quoteFormSubmit}</span>
                {isSending ? (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <Send className="h-4 w-4" />
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
                {language === 'ar' ? 'تم تقديم الطلب بنجاح!' : 'Request Submitted Successfully!'}
              </h2>
              <p className="text-zinc-650 text-xs sm:text-sm font-light max-w-md font-sans">
                {t.quoteFormSuccess}
              </p>
            </div>

            {/* Custom invoice receipt box */}
            <div id="print-area" className="bg-slate-50 border border-zinc-200 rounded-2xl p-6 flex flex-col gap-5 text-sm">
              <div className="flex justify-between items-center border-b border-zinc-150 pb-4">
                <div className="flex flex-col">
                  <span className="font-extrabold text-[#10798e] font-mono text-base tracking-wider text-right">PHZYN</span>
                  <span className="text-[10px] text-zinc-500">{new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')}</span>
                </div>
                <div className="flex flex-col items-end animate-pulse">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold">{language === 'ar' ? 'رقم الطلب' : 'Request Number'}</span>
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
                    {formData.serviceType === 'office' && (language === 'ar' ? 'مكاتب ومؤسسات' : 'Corporate')}
                    {formData.serviceType === 'booth' && (language === 'ar' ? 'بوثات ومعارض' : 'Exhibition')}
                  </span>
                </div>
                {formData.city && (
                  <div className="flex justify-between text-xs font-light">
                    <span className="text-zinc-500">{language === 'ar' ? 'المدينة' : 'City'}:</span>
                    <span className="font-semibold text-zinc-900">{formData.city}</span>
                  </div>
                )}
                {formData.neighborhood && (
                  <div className="flex justify-between text-xs font-light">
                    <span className="text-zinc-500">{language === 'ar' ? 'الحي' : 'Neighborhood'}:</span>
                    <span className="font-semibold text-zinc-900">{formData.neighborhood}</span>
                  </div>
                )}
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
                  {language === 'ar' ? 'قيد المراجعة الفنية والدراسة الهندسية المخصصة' : 'Under Custom Engineering Review'}
                </span>
              </div>

              {/* Real-time SMTP email sending feedback & diagnostics */}
              {smtpSuccess === true && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 rounded-xl text-xs flex items-center justify-start gap-2 font-sans text-right">
                  <span className="relative flex h-2 w-2">
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>
                    {language === 'ar' 
                      ? 'تم إرسال نسخة بريدية تلقائياً لـ phzyn@phzyn.sa بنجاح!' 
                      : 'Automated notification email dispatched successfully to phzyn@phzyn.sa!'
                    }
                  </span>
                </div>
              )}

              {smtpSuccess === false && (
                <div className="p-3.5 bg-amber-500/5 border border-amber-500/20 rounded-xl text-right flex flex-col gap-1.5 font-sans">
                  <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold justify-start">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-amber-500"></span>
                    </span>
                    {language === 'ar' ? 'ملاحظة فنية (بيئة مخدم الإيميلات):' : 'Technical System Notice (SMTP):'}
                  </div>
                  <p className="text-zinc-650 text-[11px] leading-relaxed font-light text-right">
                    {language === 'ar' 
                      ? `تعذر إرسال الإيميل التلقائي لـ phzyn@phzyn.sa. (السبب: ${smtpError || 'إعدادات غير مكتملة'}).`
                      : `Automated copy to phzyn@phzyn.sa failed. (Details: ${smtpError || 'missing configurations'}).`
                    }
                  </p>
                  <p className="text-[10px] text-zinc-500 leading-normal text-right">
                    {language === 'ar'
                      ? '💡 حل سريع: لتفعيل الإيميلات تلقائياً، يرجى ملء بيانات بيئة الإيميل في لوحة تحكم AI Studio (Settings > Secrets) بالمتغيرات التالية: SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT وثم النقر على (Restart Dev Server) كخطوة إجبارية لإعادة قراءة المتغيرات.'
                      : '💡 Fix: Go to AI Studio > Settings > Secrets, add SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT and click (Restart Dev Server) in the tool tray to apply newly configured secrets.'
                    }
                  </p>
                </div>
              )}
            </div>

            {/* Direct WhatsApp Submission Confirmation Section */}
            <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs sm:text-sm flex flex-col gap-4 text-right">
              <div className="flex items-center gap-2 text-emerald-800 font-bold justify-start">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                {language === 'ar' ? 'البدء الفوري والمعاينة الفنية للموقع' : 'Instant Request Activation & Site Inspection'}
              </div>
              <p className="text-zinc-650 text-xs font-light leading-relaxed">
                {language === 'ar' 
                  ? 'يرجى إرسال تفاصيل التذكرة والمخطط إلى مهندسينا عبر الواتساب بنقرة واحدة أدناه لتأكيد طلبك وبدء الدراسة الهندسية وتحديد موعد لرفع المقاسات فوراً:'
                  : 'Please send this compiled ticket to our engineers via WhatsApp in one click to activate your request and schedule a site measurement review:'
                }
              </p>
              <button
                type="button"
                onClick={handleWhatsAppSubmitFallback}
                className="w-full flex items-center justify-center gap-2.5 py-4 px-5 rounded-full text-xs sm:text-sm font-black bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg active:scale-[0.98] transition-all cursor-pointer font-sans"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.83.493 3.619 1.427 5.195L2 22l4.945-1.296a9.92 9.92 0 0 0 5.059 1.365h.005c5.524 0 10.004-4.48 10.004-10.005C22.013 6.48 17.528 2 12.004 2zm5.727 14.18c-.247.697-1.204 1.272-1.66 1.332-.455.06-1.02.13-2.994-.654-2.523-1.002-4.11-3.576-4.237-3.743-.127-.168-.93-1.237-.93-2.361 0-1.124.587-1.68.796-1.9.21-.22.456-.276.608-.276.152 0 .304.002.437.009.14.007.33-.053.518.397.194.464.664 1.62.72 1.73.056.11.093.24.019.39-.074.15-.11.24-.22.37-.11.13-.23.29-.33.39-.11.11-.226.23-.097.45.128.22.57.94 1.22 1.52.837.747 1.543.98 1.761 1.09.218.11.347.09.476-.06.13-.15.55-.64.7-.86.15-.22.3-.185.507-.11.206.075 1.31.618 1.53.73.22.11.367.168.42.26.055.093.055.534-.192 1.231z" />
                </svg>
                <span>{language === 'ar' ? 'إرسال تذكرة المشروع للواتساب' : 'Send Ticket Details to WhatsApp'}</span>
              </button>
            </div>

            {/* Print and Share button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-sans">
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-zinc-250 bg-slate-50 text-xs font-bold text-zinc-650 hover:bg-slate-100 hover:text-zinc-900 transition-all active:scale-95 cursor-pointer"
              >
                {language === 'ar' ? 'تعديل البيانات وإرسال طلب آخر' : 'Review & Edit Details'}
              </button>

              <button
                onClick={handlePrint}
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#10798e] hover:bg-[#0c5c6d] text-xs font-black text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#10798e]/20 cursor-pointer"
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
