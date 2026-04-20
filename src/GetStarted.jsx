import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CALENDLY = 'https://calendly.com/max-untappedhomes/30min?month=2026-04&date=2026-04-13';

const SERVICE_TYPES = [
  'HVAC',
  'Plumbing',
  'Electrical',
  'Landscaping',
  'Pest Control',
  'Roofing',
  'Painting',
  'Pool Services',
  'Cleaning / Janitorial',
  'Garage Doors',
  'Fencing',
  'Tree Service',
  'Flooring',
  'General Contracting',
  'Other',
];

export default function GetStarted() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    serviceArea: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      setError('Please fill out all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...form,
        createdAt: serverTimestamp(),
        source: 'landing_page',
        status: 'new',
      });
      window.location.href = CALENDLY;
    } catch (err) {
      console.error('Error saving lead:', err);
      setError('Something went wrong. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-teal-100/30 blur-3xl" />
      </div>

      <motion.div
        className="relative w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-8 pt-10 pb-2 text-center">
            <a href="/" className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Untapped<span className="text-emerald-600">Homes</span>
            </a>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">Get Started</h1>
            <p className="mt-2 text-sm text-gray-500">
              Tell us about your business and we'll set up your first campaign.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                placeholder="John Smith"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="john@company.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                placeholder="(555) 123-4567"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Company Name
              </label>
              <input
                type="text"
                value={form.company}
                onChange={update('company')}
                placeholder="Smith's HVAC"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Service Type
              </label>
              <select
                value={form.serviceType}
                onChange={update('serviceType')}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="">Select your service</option>
                {SERVICE_TYPES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Service Area
              </label>
              <input
                type="text"
                value={form.serviceArea}
                onChange={update('serviceArea')}
                placeholder="e.g. Austin, TX metro area"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-emerald-600 py-4 text-sm font-bold text-white hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md shadow-emerald-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Continue & Book Your Call'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              After submitting, you'll be redirected to book your free strategy call.
            </p>
          </form>
        </div>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-gray-400 hover:text-gray-600 transition">
            &larr; Back to home
          </a>
        </div>
      </motion.div>
    </div>
  );
}
