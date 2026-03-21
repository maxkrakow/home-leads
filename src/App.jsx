import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CALENDLY = 'https://calendly.com/lended/untapped-homes';

// ─── Icons ───

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
    </svg>
  );
}

function ArrowRightIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
    </svg>
  );
}

function XIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
    </svg>
  );
}

function ChevronDownIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
    </svg>
  );
}

// ─── Header ───

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm' : 'bg-transparent'}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <a href="#" className="text-xl font-extrabold text-gray-900 tracking-tight">
          Untapped<span className="text-emerald-600">Homes</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">How It Works</a>
          <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Pricing</a>
          <a href="#results" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">Results</a>
          <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">FAQ</a>
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/20"
          >
            Get Started
          </a>
        </nav>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-gray-600">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            }
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <a href="#how-it-works" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 py-2">How It Works</a>
          <a href="#pricing" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 py-2">Pricing</a>
          <a href="#results" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 py-2">Results</a>
          <a href="#faq" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 py-2">FAQ</a>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="block rounded-full bg-emerald-600 px-5 py-3 text-center text-sm font-semibold text-white">Get Started</a>
        </div>
      )}
    </header>
  );
}

// ─── Hero ───

function Hero() {
  const stats = [
    { value: '50K+', label: 'Mailers Sent Monthly' },
    { value: '5-8x', label: 'Higher Conversion vs. Cold Leads' },
    { value: '14 Days', label: 'From Signup to First Campaign' },
  ];

  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32 bg-gradient-to-b from-emerald-50/50 to-white">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-teal-100/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 mb-8">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium text-emerald-700">New movers direct mail for home service businesses</span>
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Reach Homeowners{' '}
            <span className="text-gradient">The Week They Move In.</span>
          </motion.h1>

          <motion.p
            className="mt-6 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            We scrape deed records to find fresh move-ins in your service area, then send{' '}
            <span className="text-gray-900 font-semibold">targeted direct mail campaigns</span>{' '}
            on your behalf — before they pick a competitor.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-base font-semibold text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
            >
              Start Getting New Customers
              <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-8 py-4 text-base font-medium text-gray-700 hover:bg-gray-50 transition-all"
            >
              See How It Works
            </a>
          </motion.div>
        </div>

        <motion.div
          className="mt-20 grid grid-cols-3 gap-4 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center px-4 py-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600">{stat.value}</div>
              <div className="mt-1 text-xs sm:text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Pain Points ───

function PainPoints() {
  const pains = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Missing the Window',
      description: 'New homeowners choose their service providers in the first 30 days. If you\'re not in front of them immediately, someone else is.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Wasting Money on Broad Ads',
      description: 'Running Google or Facebook ads to your whole zip code means paying to reach people who already have a plumber, HVAC tech, or landscaper.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
      title: 'Competing for Loyal Customers',
      description: 'Established homeowners already have their go-to providers. You\'re fighting an uphill battle trying to win them over from years of loyalty.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Sound Familiar?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Most home service businesses waste money marketing to people who don't need them.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {pains.map((pain, i) => (
            <motion.div
              key={pain.title}
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 mb-5">
                {pain.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{pain.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{pain.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ───

function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'We Scrape Deed Records',
      description: 'Our system monitors public deed transfers across your service area — we know who just bought a home within days of closing.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
      ),
    },
    {
      num: '02',
      title: 'We Build Your New Mover List',
      description: 'Fresh move-ins are filtered by your service area, home value, and property type. Every name on your list just moved and needs providers.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
        </svg>
      ),
    },
    {
      num: '03',
      title: 'We Design & Mail For You',
      description: 'Professional, branded mailers go out automatically — introducing your business to every new homeowner in your area, week after week.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
      ),
    },
    {
      num: '04',
      title: 'New Customers Call You',
      description: 'New homeowners who need your exact service see your mailer and reach out. No competition, no loyalty to overcome — just a new homeowner who needs help.',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 mb-6">
            <span className="text-sm font-medium text-emerald-700">How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Be the First Call for Every New Homeowner
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            We handle the data, design, printing, and mailing. You just pick up the phone when new customers call.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="bg-white rounded-2xl p-8 lg:p-10 border border-gray-200 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                  {step.icon}
                </div>
                <div>
                  <span className="text-xs font-semibold text-emerald-600">{step.num}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why New Movers ───

function WhyNewMovers() {
  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 mb-6">
            <span className="text-sm font-medium text-emerald-700">Why New Movers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            The Highest-Intent Customers You'll Ever Find
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              stat: '80%',
              title: 'Choose Providers in 30 Days',
              description: 'New homeowners select their HVAC, plumber, electrician, and landscaper within the first month. If you\'re not there, someone else is.',
            },
            {
              stat: '0',
              title: 'Existing Loyalty to Overcome',
              description: 'Unlike established homeowners, new movers don\'t have a "guy" yet. They\'re actively looking and ready to commit.',
            },
            {
              stat: '3-5x',
              title: 'Higher Close Rate',
              description: 'New mover leads convert at 3-5x the rate of cold outreach because they have an immediate, real need for your services.',
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-4xl font-extrabold text-emerald-600 mb-3">{item.stat}</div>
              <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Comparison ───

function Comparison() {
  const withoutItems = [
    'Running broad ads to people who already have providers',
    'Paying for clicks from tire-kickers and price shoppers',
    'Door knocking neighborhoods hoping someone needs you',
    'Posting on social media and praying for leads',
    'Waiting for word-of-mouth referrals to trickle in',
  ];

  const withItems = [
    'Reaching homeowners the week they move in',
    'Professional mailers arrive before competitors even know they exist',
    'Every lead is a new homeowner actively looking for providers',
    'Fully automated — we handle data, design, print, and mail',
    'Consistent pipeline of new customers every single month',
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Stop Hoping. Start Growing.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div
            className="rounded-2xl p-8 bg-white border border-gray-200 shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 mb-6">
              <span className="text-xs font-semibold text-red-600">Without Untapped Homes</span>
            </div>
            <ul className="space-y-4">
              {withoutItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <XIcon className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="rounded-2xl p-8 bg-white border-2 border-emerald-200 shadow-lg shadow-emerald-50"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 mb-6">
              <span className="text-xs font-semibold text-emerald-700">With Untapped Homes</span>
            </div>
            <ul className="space-y-4">
              {withItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckIcon className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ───

function Pricing() {
  const features = [
    'Deed record scraping across your service area',
    'New mover list built and updated weekly',
    'Professional, branded mailer design',
    'Printing, postage, and fulfillment included',
    'Automated weekly mail drops',
    'Dedicated tracking phone number',
    'Monthly reporting on sends, responses, and ROI',
    'No long-term contracts — cancel anytime',
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 mb-6">
            <span className="text-sm font-medium text-emerald-700">Simple Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            One Plan. No Surprises.
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Everything you need to get your business in front of every new homeowner in your area.
          </p>
        </div>

        <motion.div
          className="max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="relative rounded-2xl bg-white border-2 border-emerald-300 shadow-lg shadow-emerald-100/50 ring-1 ring-emerald-100 p-8 lg:p-10">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-1 text-xs font-semibold text-white">
                All-Inclusive
              </span>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-lg font-bold text-gray-900">New Mover Direct Mail</h3>
              <div className="mt-4 flex items-baseline justify-center gap-1">
                <span className="text-5xl font-extrabold text-gray-900">$499</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <div className="mt-2 flex items-center justify-center gap-1">
                <span className="text-lg font-bold text-emerald-600">+ $1</span>
                <span className="text-sm text-gray-500">per flyer sent</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckIcon className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="mb-6 py-3 px-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                <span className="text-gray-700 font-medium">Example:</span> 1,500 flyers/mo = $499 + $1,500 = <span className="text-emerald-700 font-semibold">$1,999/mo</span>
              </p>
            </div>

            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-full bg-emerald-600 py-4 text-center text-sm font-semibold text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200"
            >
              Get Started Today
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Results ───

function Results() {
  const testimonials = [
    {
      quote: 'We picked up 12 new recurring lawn care customers in our first 2 months. These are people who just moved in and had no landscaper — easiest close ever.',
      name: 'Ryan M.',
      role: 'Landscaping Company, Austin TX',
    },
    {
      quote: 'New homeowners actually want to hear from you. Our close rate on these leads is 3x what we get from Google Ads.',
      name: 'Lisa P.',
      role: 'HVAC Company, Charlotte NC',
    },
    {
      quote: 'We went from hoping the phone would ring to having a predictable stream of new customers every month. Best marketing spend we\'ve ever made.',
      name: 'James W.',
      role: 'Plumbing Company, Tampa FL',
    },
  ];

  const metrics = [
    { value: '4-8%', label: 'Typical Response Rate' },
    { value: '10-20x', label: 'Avg. ROI on Mailer Spend' },
    { value: '30 Days', label: 'To See First New Customers' },
  ];

  return (
    <section id="results" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 mb-6">
            <span className="text-sm font-medium text-emerald-700">Real Results</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            What Our Clients Are Seeing
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-sm text-gray-600 leading-relaxed mb-6">"{t.quote}"</p>
              <div>
                <p className="text-sm font-bold text-gray-900">{t.name}</p>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
          {metrics.map((m) => (
            <div key={m.label} className="text-center px-4 py-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
              <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{m.value}</div>
              <div className="mt-1 text-xs sm:text-sm text-gray-500">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Built For ───

function BuiltFor() {
  const personas = [
    { title: 'HVAC Companies', description: 'New homeowners need to learn their system, schedule maintenance, and find a tech they trust. Be the first one they call.' },
    { title: 'Plumbers', description: 'Every new home comes with unfamiliar plumbing. From inspections to emergencies — be their go-to from day one.' },
    { title: 'Landscapers', description: 'New yards need new care. Move-ins are looking for weekly mowing, seasonal cleanups, and irrigation setup immediately.' },
    { title: 'Pest Control', description: 'New homeowners don\'t know the local pest situation. Preventative pest plans are an easy sell to fresh move-ins.' },
    { title: 'Electricians', description: 'Smart home setup, panel upgrades, outlet additions — new homeowners have a long electrical to-do list.' },
    { title: 'Roofers & Painters', description: 'Fresh move-ins quickly spot what needs fixing. Position yourself before they start Googling.' },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Built for Home Service Businesses
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            If new homeowners need your service, we put you in front of them before anyone else.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {personas.map((p, i) => (
            <motion.div
              key={p.title}
              className="rounded-2xl p-6 border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-1">{p.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ───

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="text-sm font-semibold text-gray-900">{q}</span>
        <ChevronDownIcon className={`h-5 w-5 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-5' : 'max-h-0'}`}>
        <p className="text-sm text-gray-500 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

function FAQ() {
  const faqs = [
    {
      q: 'What kind of businesses is this for?',
      a: 'Any home service business that benefits from reaching new homeowners — HVAC, plumbing, electrical, landscaping, pest control, roofing, painting, cleaning, pool service, and more.',
    },
    {
      q: 'How do you know who just moved in?',
      a: 'We scrape publicly available deed transfer records from county assessor databases. When a home changes ownership, we pick it up within days and add the new homeowner to your mailing list.',
    },
    {
      q: 'How quickly can I start?',
      a: 'Most clients are live within 14 days. We spend the first week setting up your service area, designing your mailer, and building your initial new mover list.',
    },
    {
      q: 'Why is direct mail better than digital ads for new movers?',
      a: 'New homeowners are overwhelmed with digital noise. A physical mailer arriving at their new home stands out. Plus, you reach them whether or not they\'re searching online — many new movers don\'t Google for services until they have an emergency.',
    },
    {
      q: 'Are the leads exclusive to me?',
      a: 'Yes. We only work with one provider per service category per area. If you\'re the HVAC company in your zip codes, no other HVAC company gets those same new movers from us.',
    },
    {
      q: 'What do the mailers look like?',
      a: 'Professional, branded postcards or letters customized with your logo, offer, and contact info. We design everything — you just approve it. Each piece is optimized for response rates based on our testing data.',
    },
    {
      q: 'How many flyers should I send per month?',
      a: 'It depends on your service area. A typical market generates 500-2,000 new movers per month. We\'ll help you determine the right volume during onboarding based on your coverage area.',
    },
    {
      q: 'Is there a contract?',
      a: 'No long-term contracts. Month-to-month, cancel anytime. We recommend at least 90 days to see compounding results from repeat mail drops.',
    },
  ];

  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ───

function CTA() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 px-8 py-16 lg:px-16 lg:py-20 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Be the First Call for Every New Homeowner
          </h2>
          <p className="mt-4 text-lg text-emerald-100 max-w-2xl mx-auto">
            New homeowners are moving into your service area every week. Make sure they know your name before anyone else's.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={CALENDLY}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-emerald-700 hover:bg-emerald-50 transition-all"
            >
              Book a Free Strategy Call
              <ArrowRightIcon className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            {[
              { step: '1', label: 'Book a call' },
              { step: '2', label: 'We set up your campaign' },
              { step: '3', label: 'New customers start calling' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-8 h-8 rounded-full bg-white/20 text-white text-sm font-bold flex items-center justify-center mx-auto mb-2">
                  {s.step}
                </div>
                <p className="text-sm text-emerald-100">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <a href="#" className="text-lg font-extrabold text-gray-900 tracking-tight">
            Untapped<span className="text-emerald-600">Homes</span>
          </a>
          <div className="flex items-center gap-6">
            <a href="#how-it-works" className="text-sm text-gray-500 hover:text-gray-700">How It Works</a>
            <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-700">Pricing</a>
            <a href="#faq" className="text-sm text-gray-500 hover:text-gray-700">FAQ</a>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Untapped Homes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// ─── App ───

export default function App() {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Header />
      <Hero />
      <PainPoints />
      <HowItWorks />
      <WhyNewMovers />
      <Comparison />
      <Pricing />
      <Results />
      <BuiltFor />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
