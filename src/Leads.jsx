import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const ACCESS_CODE = '54245';

export default function Leads() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('leads_authed') === '1');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    if (!authed) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError('');
      try {
        const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        if (cancelled) return;
        setLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error('Error loading leads:', err);
        if (!cancelled) setLoadError('Failed to load leads.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [authed]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code === ACCESS_CODE) {
      sessionStorage.setItem('leads_authed', '1');
      setAuthed(true);
      setError('');
    } else {
      setError('Incorrect code.');
    }
  };

  const formatDate = (ts) => {
    if (!ts) return '—';
    try {
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleString();
    } catch {
      return '—';
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white flex items-center justify-center px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm bg-white rounded-3xl shadow-xl border border-gray-100 p-8"
        >
          <div className="text-center mb-6">
            <a href="/" className="text-2xl font-extrabold text-gray-900 tracking-tight">
              Untapped<span className="text-emerald-600">Homes</span>
            </a>
            <h1 className="mt-6 text-xl font-bold text-gray-900">Enter Access Code</h1>
            <p className="mt-2 text-sm text-gray-500">This page is restricted.</p>
          </div>
          <input
            type="password"
            inputMode="numeric"
            autoFocus
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(''); }}
            placeholder="Access code"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-center tracking-widest"
          />
          {error && <p className="mt-3 text-sm text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="mt-5 w-full rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md shadow-emerald-200"
          >
            Continue
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <a href="/" className="text-xl font-extrabold text-gray-900 tracking-tight">
            Untapped<span className="text-emerald-600">Homes</span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
            </span>
            <button
              onClick={() => { sessionStorage.removeItem('leads_authed'); setAuthed(false); setCode(''); }}
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Lock
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="mt-1 text-sm text-gray-500">All submissions from your landing page.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-sm text-gray-500">Loading leads…</div>
          ) : loadError ? (
            <div className="p-12 text-center text-sm text-red-500">{loadError}</div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center text-sm text-gray-500">No leads yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Company Size</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Service Area</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Timeline</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Current Marketing</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">{lead.fullName || lead.name || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {lead.email ? (
                          <a href={`mailto:${lead.email}`} className="text-emerald-700 hover:underline">{lead.email}</a>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {lead.phone ? (
                          <a href={`tel:${lead.phone}`} className="text-emerald-700 hover:underline">{lead.phone}</a>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{lead.company || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{lead.company_size || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{lead.service_type || lead.serviceType || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{lead.service_area || lead.serviceArea || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{lead.monthly_budget || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{lead.timeline || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{lead.current_marketing || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{lead.source || '—'}</td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-xs font-medium">
                          {lead.status || 'new'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
