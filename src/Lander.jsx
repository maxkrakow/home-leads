import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp, doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

const CALENDLY = 'https://calendly.com/lended/untapped-homes';

// Google Ads gtag
const GTAG_ID = 'AW-17995555560';
const LEAD_CONVERSION_SEND_TO = 'AW-17995555560/AvR-CPTE7Z0cEOjF-YRD';
function loadGtag() {
  if (document.querySelector(`script[src*="${GTAG_ID}"]`)) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GTAG_ID}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', GTAG_ID);
}
function trackLeadConversion() {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('event', 'conversion', {
    send_to: LEAD_CONVERSION_SEND_TO,
    value: 1.0,
    currency: 'USD',
  });
}

const questions = [
  {
    id: 'contact',
    question: 'Tell us about you — we\'ll build your custom campaign plan.',
    type: 'contact',
  },
  {
    id: 'service_type',
    question: 'What type of service do you provide?',
    type: 'select',
    options: [
      { label: 'HVAC (Heating, Cooling, Air)', value: 'hvac' },
      { label: 'Plumbing', value: 'plumbing' },
      { label: 'Electrical', value: 'electrical' },
      { label: 'Landscaping / Lawn Care', value: 'landscaping' },
      { label: 'Pest Control', value: 'pest-control' },
      { label: 'Roofing', value: 'roofing' },
      { label: 'Painting', value: 'painting' },
      { label: 'Cleaning / Janitorial', value: 'cleaning' },
      { label: 'Other Home Service', value: 'other' },
    ],
  },
  {
    id: 'company_size',
    question: 'How big is your team?',
    type: 'select',
    options: [
      { label: 'Just me', value: 'solo' },
      { label: '2-5 employees', value: '2-5' },
      { label: '6-15 employees', value: '6-15' },
      { label: '16-50 employees', value: '16-50' },
      { label: '50+ employees', value: '50+' },
    ],
  },
  {
    id: 'current_marketing',
    question: 'How do you currently get new customers?',
    type: 'select',
    options: [
      { label: 'Word of mouth / referrals only', value: 'referrals' },
      { label: 'Google Ads / SEO', value: 'google' },
      { label: 'Social media (Facebook, Instagram, etc.)', value: 'social' },
      { label: 'Door knocking / flyers', value: 'door-knocking' },
      { label: 'Multiple channels but want more', value: 'multiple' },
    ],
  },
  {
    id: 'monthly_budget',
    question: 'What\'s your monthly marketing budget?',
    type: 'select',
    options: [
      { label: 'Under $1,000/mo', value: 'under-1k' },
      { label: '$1,000 - $2,500/mo', value: '1k-2.5k' },
      { label: '$2,500 - $5,000/mo', value: '2.5k-5k' },
      { label: '$5,000+/mo', value: '5k+' },
      { label: 'Not sure yet — just exploring', value: 'exploring' },
    ],
  },
  {
    id: 'service_area',
    question: 'What area do you service?',
    type: 'text',
    placeholder: 'e.g. Austin, TX metro / Dallas-Fort Worth / Maricopa County, AZ',
  },
  {
    id: 'timeline',
    question: 'How soon do you want to start?',
    type: 'select',
    options: [
      { label: 'Immediately — I need leads now', value: 'asap' },
      { label: 'Within the next 2-4 weeks', value: '2-4wks' },
      { label: 'Next month or two', value: '1-2mo' },
      { label: 'Just learning about it for now', value: 'exploring' },
    ],
  },
];

const caseStudies = [
  {
    tag: 'Landscaping',
    sector: 'Austin, TX',
    headline: '12 New Recurring Customers',
    desc: 'Picked up 12 new weekly lawn care clients in 60 days from new move-in mailers. Easiest close ever — they had no landscaper.',
    stats: [
      { value: '12', label: 'New Clients' },
      { value: '60', label: 'Days' },
      { value: '6x', label: 'ROI' },
    ],
  },
  {
    tag: 'HVAC',
    sector: 'Charlotte, NC',
    headline: '3x Close Rate vs. Google Ads',
    desc: 'New homeowners actually want to hear from you. Close rate on mailer leads is 3x what we were getting from paid ads.',
    stats: [
      { value: '3x', label: 'Close Rate' },
      { value: '28', label: 'Leads/Mo' },
      { value: '$180', label: 'Cost/Lead' },
    ],
  },
  {
    tag: 'Plumbing',
    sector: 'Tampa, FL',
    headline: 'Predictable Pipeline Every Month',
    desc: 'Went from hoping the phone would ring to a steady stream of new homeowner leads. Best marketing spend we\'ve ever made.',
    stats: [
      { value: '20+', label: 'Leads/Mo' },
      { value: '15x', label: 'ROI' },
      { value: '30 days', label: 'To Results' },
    ],
  },
  {
    tag: 'Pest Control',
    sector: 'Phoenix, AZ',
    headline: '40 New Customers in 90 Days',
    desc: 'New homeowners don\'t know the local pest situation. Preventative plans are an easy sell. Mailers basically sell themselves.',
    stats: [
      { value: '40', label: 'New Customers' },
      { value: '90', label: 'Days' },
      { value: '10x', label: 'ROI' },
    ],
  },
];

function genSessionId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function ArrowRightIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
    </svg>
  );
}

function ArrowLeftIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
    </svg>
  );
}

export default function Lander() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', company: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const [sessionId] = useState(() => genSessionId());
  const [trackedSteps] = useState(() => new Set());
  const leadDocIdRef = useRef(null);

  useEffect(() => { loadGtag(); }, []);

  const totalSteps = questions.length;

  const trackStep = useCallback((stepId) => {
    if (trackedSteps.has(stepId)) return;
    trackedSteps.add(stepId);
    const ref = doc(db, 'funnel_sessions', sessionId);
    if (trackedSteps.size === 1) {
      setDoc(ref, {
        startedAt: serverTimestamp(),
        source: 'lander',
        steps: [stepId],
        lastStep: stepId,
        completed: false,
      }).catch(() => {});
    } else {
      updateDoc(ref, {
        steps: arrayUnion(stepId),
        lastStep: stepId,
      }).catch(() => {});
    }
  }, [sessionId, trackedSteps]);

  useEffect(() => {
    trackStep('page_visit');
  }, [trackStep]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((s) => s - 1);
      setValidationErrors({});
    }
  }, [currentStep]);

  const handleSelect = useCallback((questionId, value) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);

    trackStep(questionId);
    if (leadDocIdRef.current) {
      updateDoc(doc(db, 'leads', leadDocIdRef.current), { [questionId]: value }).catch(() => {});
    }

    const nextStep = currentStep + 1;
    if (nextStep < questions.length) {
      setTimeout(() => {
        setDirection(1);
        setCurrentStep((s) => s + 1);
      }, 300);
    } else {
      updateDoc(doc(db, 'funnel_sessions', sessionId), {
        completed: true,
        completedAt: serverTimestamp(),
      }).catch(() => {});
      setTimeout(() => setSubmitted(true), 300);
    }
  }, [answers, currentStep, trackStep, sessionId]);

  const handleTextSubmit = useCallback((questionId, value) => {
    if (!value.trim()) return;
    handleSelect(questionId, value.trim());
  }, [handleSelect]);

  const handleContactSubmit = useCallback((e) => {
    e.preventDefault();
    const errors = {};
    if (!contactForm.name.trim()) errors.name = 'Name is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactForm.email)) errors.email = 'Please enter a valid email';
    const digits = contactForm.phone.replace(/\D/g, '');
    if (digits.length < 10) errors.phone = 'Please enter a valid phone number';

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    trackStep('contact');

    setDirection(1);
    setCurrentStep(currentStep + 1);

    const phone = digits.startsWith('1') ? `+${digits}` : `+1${digits}`;
    const fullName = contactForm.name.trim();
    const firstName = fullName.split(/\s+/)[0];

    addDoc(collection(db, 'leads'), {
      name: firstName,
      fullName,
      email: contactForm.email.trim(),
      phone,
      company: contactForm.company.trim(),
      source: 'lander',
      createdAt: serverTimestamp(),
      status: 'new',
    }).then((docRef) => {
      leadDocIdRef.current = docRef.id;
      trackLeadConversion();
    }).catch((err) => {
      console.error('Error saving lead:', err);
    });
  }, [contactForm, currentStep, trackStep]);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <motion.div
          className="text-center px-4 pt-10 pb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">You're All Set!</h2>
          <p className="text-gray-500 max-w-lg mx-auto">
            Based on your answers, new mover mail looks like a great fit for your business. Pick a time below and we'll build your custom campaign.
          </p>
        </motion.div>
        <div className="flex-1 px-4 pb-8">
          <div className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm">
            <iframe
              src={`${CALENDLY}?name=${encodeURIComponent(contactForm.name)}&email=${encodeURIComponent(contactForm.email)}`}
              className="w-full border-0"
              style={{ height: '660px', minWidth: '320px' }}
              title="Book a call"
            />
          </div>
        </div>
        <LanderFooter />
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky header with progress */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-8 py-4">
          <a href="/" className="text-xl font-extrabold text-gray-900 tracking-tight">
            Untapped<span className="text-emerald-600">Homes</span>
          </a>
        </div>
        <div className="h-1 bg-gray-100">
          <motion.div
            className="h-full bg-emerald-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </header>

      {/* Hero text */}
      <div className="text-center px-4 pt-8 pb-4">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">
          Get In Front of{' '}
          <span className="text-emerald-600">Every New Homeowner</span>
        </h1>
        <p className="text-gray-500 text-base max-w-2xl mx-auto">
          Answer a few quick questions and we'll show you how many new movers are in your area.
        </p>
      </div>

      {/* Main content: form + case studies */}
      <div className="flex-1 px-4 pt-4 pb-8">
        <div className="max-w-6xl mx-auto flex gap-8 items-start">
          {/* Case studies - left side */}
          <div className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0 pt-4">
            {caseStudies.slice(0, 2).map((study) => (
              <CaseStudyCard key={study.headline} study={study} />
            ))}
          </div>

          {/* Form area - center */}
          <div className="flex-1 max-w-xl mx-auto">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentQuestion.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
                  {currentQuestion.question}
                </p>

                {currentQuestion.type === 'select' && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((opt, i) => {
                      const letter = String.fromCharCode(65 + i);
                      const isSelected = answers[currentQuestion.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleSelect(currentQuestion.id, opt.value)}
                          className={`w-full flex items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50 text-gray-900'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
                          }`}
                        >
                          <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                            isSelected ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                            {letter}
                          </span>
                          <span className="text-sm sm:text-base font-medium">{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {currentQuestion.type === 'text' && (
                  <TextInput
                    placeholder={currentQuestion.placeholder}
                    onSubmit={(val) => handleTextSubmit(currentQuestion.id, val)}
                  />
                )}

                {currentQuestion.type === 'contact' && (
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => { setContactForm(f => ({ ...f, name: e.target.value })); setValidationErrors(v => ({ ...v, name: '' })); }}
                        placeholder="Full name"
                        autoFocus
                        className={`w-full rounded-xl border bg-white px-5 py-4 text-gray-900 text-lg placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                          validationErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500'
                        }`}
                      />
                      {validationErrors.name && <p className="mt-1 text-sm text-red-500">{validationErrors.name}</p>}
                    </div>
                    <div>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => { setContactForm(f => ({ ...f, email: e.target.value })); setValidationErrors(v => ({ ...v, email: '' })); }}
                        placeholder="you@company.com"
                        className={`w-full rounded-xl border bg-white px-5 py-4 text-gray-900 text-lg placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                          validationErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500'
                        }`}
                      />
                      {validationErrors.email && <p className="mt-1 text-sm text-red-500">{validationErrors.email}</p>}
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => { setContactForm(f => ({ ...f, phone: e.target.value })); setValidationErrors(v => ({ ...v, phone: '' })); }}
                        placeholder="(555) 123-4567"
                        className={`w-full rounded-xl border bg-white px-5 py-4 text-gray-900 text-lg placeholder-gray-400 focus:outline-none focus:ring-1 transition-all ${
                          validationErrors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-200 focus:border-emerald-500 focus:ring-emerald-500'
                        }`}
                      />
                      {validationErrors.phone && <p className="mt-1 text-sm text-red-500">{validationErrors.phone}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        value={contactForm.company}
                        onChange={(e) => setContactForm(f => ({ ...f, company: e.target.value }))}
                        placeholder="Company name (optional)"
                        className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 text-gray-900 text-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-emerald-600 px-6 py-4 text-base font-semibold text-white hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                    >
                      Get My Campaign Plan
                      <ArrowRightIcon className="h-5 w-5" />
                    </button>
                  </form>
                )}
              </motion.div>
            </AnimatePresence>

            {currentStep > 0 && (
              <button
                onClick={goBack}
                className="mt-6 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back
              </button>
            )}
          </div>

          {/* Case studies - right side */}
          <div className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0 pt-4">
            {caseStudies.slice(2).map((study) => (
              <CaseStudyCard key={study.headline} study={study} />
            ))}
          </div>
        </div>

        {/* Case studies on mobile */}
        <div className="lg:hidden mt-8">
          <p className="text-sm font-semibold text-gray-500 mb-3 text-center">Real Results</p>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {caseStudies.map((study) => (
              <div key={study.headline} className="min-w-[280px] snap-start">
                <CaseStudyCard study={study} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="border-t border-gray-200 bg-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-lg font-bold text-gray-900 mb-8">How It Works</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Apply', desc: 'Tell us about your business and service area' },
              { step: '02', title: 'Strategy Call', desc: 'We build your custom new mover campaign' },
              { step: '03', title: 'Mailers Go Out', desc: 'Professional mailers hit every new move-in' },
              { step: '04', title: 'Phone Rings', desc: 'New homeowners call you for service' },
            ].map((item, i) => (
              <div key={item.step} className="text-center">
                <div className={`w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  {item.step}
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Trusted by <span className="font-semibold text-gray-900">200+ home service businesses</span> across the country
            </p>
          </div>
        </div>
      </div>

      <LanderFooter />
    </div>
  );
}

function TextInput({ placeholder, onSubmit }) {
  const [value, setValue] = useState('');
  return (
    <div className="space-y-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus
        onKeyDown={(e) => { if (e.key === 'Enter') onSubmit(value); }}
        className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 text-gray-900 text-lg placeholder-gray-400 focus:outline-none focus:ring-1 focus:border-emerald-500 focus:ring-emerald-500 transition-all"
      />
      <button
        onClick={() => onSubmit(value)}
        className="w-full rounded-xl bg-emerald-600 px-6 py-4 text-base font-semibold text-white hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
      >
        Continue
        <ArrowRightIcon className="h-5 w-5" />
      </button>
    </div>
  );
}

function CaseStudyCard({ study }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">{study.tag}</span>
          {study.sector && <span className="text-xs text-gray-400">{study.sector}</span>}
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">{study.headline}</h3>
        <p className="text-xs text-gray-500 leading-relaxed">{study.desc}</p>
      </div>
      <div className="grid grid-cols-3 border-t border-gray-100 bg-gray-50/50">
        {study.stats.map((stat) => (
          <div key={stat.label} className="p-2.5 text-center border-r last:border-r-0 border-gray-100">
            <div className="text-sm font-bold text-emerald-600">{stat.value}</div>
            <div className="text-[10px] text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LanderFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white py-6 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs text-gray-400">
          &copy; {new Date().getFullYear()} Untapped Homes. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
