// Onboarding form. Field structure taken directly from the Google Form the
// team is already sending. Saves back onto clients/{uid}. Flips
// onboardingComplete once the required fields are filled.
import React, { useEffect, useMemo, useState } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { usePortalAuth } from "../portalAuth";
import { Card } from "./uiBits";

const SERVICES = ["Roofing", "HVAC", "Plumbing", "Pest control", "Landscaping / lawn care", "Pool service", "Electrical", "General contracting", "Other"];
const PROPERTY_TYPES = ["Single-family only", "Single-family + condos/townhomes", "All residential (incl. multi-family)"];
const OWNERSHIP = ["Owner-occupied only", "Include investor purchases", "Investor only"];
const MOVE_IN_WINDOWS = ["0–30 days", "0–60 days", "0–90 days (default)", "0–6 months", "Custom (specify in next field)"];
const CTAS = ["Call", "Text", "Scan QR to landing page"];
const LANDING_OPTIONS = ["I have one — I'll provide the URL", "I need you to provide one", "No landing page needed"];
const TONE_OPTIONS = ["Bold / promotional", "Friendly / neighborly", "Premium / clean", "Let us recommend"];

// Field definitions grouped by section — order matches the Google Form.
const SECTIONS = [
  {
    title: "Business basics",
    fields: [
      { name: "legalName", label: "Legal business name", required: true },
      { name: "dbaName", label: "DBA / brand name (if different)" },
      { name: "contactName", label: "Primary contact name", required: true },
      { name: "phone", label: "Phone number", required: true },
      { name: "email", label: "Email", required: true, type: "email" },
      { name: "website", label: "Business website" },
      { name: "address", label: "Business mailing address", type: "textarea" },
      { name: "yearsInBusiness", label: "Years in business", type: "number" },
      { name: "licenseNumber", label: "License number(s) and issuing state" },
    ],
  },
  {
    title: "Service offering",
    fields: [
      { name: "servicesOffered", label: "Services you offer", type: "multi", options: SERVICES },
      { name: "campaignService", label: "Which service should THIS campaign promote?", required: true },
      { name: "avgTicket", label: "Average ticket size for that service" },
      { name: "offersFinancing", label: "Financing? (who's the partner if yes)", type: "textarea" },
    ],
  },
  {
    title: "Target audience filters",
    fields: [
      { name: "minHomeValue", label: "Minimum home value filter", type: "number" },
      { name: "propertyTypes", label: "Property types to target", type: "select", options: PROPERTY_TYPES },
      { name: "ownership", label: "Owner-occupied vs. investor purchases", type: "select", options: OWNERSHIP },
      { name: "moveInWindow", label: "How far back on new homeowners (first drop)?", type: "select", options: MOVE_IN_WINDOWS },
      { name: "customMoveInWindow", label: "Custom move-in window (if selected above)" },
    ],
  },
  {
    title: "Offer & creative",
    fields: [
      { name: "offer", label: "What's the offer/promotion on the flyer?", type: "textarea", required: true },
      { name: "offerExpiration", label: "Offer expiration / how long should it run?" },
      { name: "disclaimers", label: "Any disclaimers required by law/licensing?", type: "textarea" },
      { name: "primaryCta", label: "Primary CTA on the flyer", type: "multi", options: CTAS },
      { name: "displayPhone", label: "Phone number to display on flyer", required: true },
      { name: "landingPageOption", label: "Landing page", type: "select", options: LANDING_OPTIONS },
      { name: "landingPage", label: "Landing page URL (if you have one)" },
      { name: "brandColors", label: "Brand colors + fonts", type: "textarea" },
      { name: "reviewsLink", label: "Reviews / testimonials link" },
      { name: "googleReviewStats", label: "Google review rating + count" },
      { name: "trustBadges", label: "Trust badges to include" },
    ],
  },
  {
    title: "Design preferences",
    fields: [
      { name: "tone", label: "Tone preference", type: "select", options: TONE_OPTIONS },
      { name: "likedDesigns", label: "Competitors' flyers or designs you like?", type: "textarea" },
      { name: "dontInclude", label: "Anything we should NOT include or say?", type: "textarea" },
    ],
  },
  {
    title: "Operations",
    fields: [
      { name: "inboundHandler", label: "Who fields inbound calls/texts/leads?" },
      { name: "hoursDisplay", label: "Hours of operation to display on flyer", type: "textarea" },
    ],
  },
];

const REQUIRED_FIELDS = SECTIONS.flatMap((s) => s.fields.filter((f) => f.required).map((f) => f.name));

export default function Onboarding({ view }) {
  const { client } = view;
  const { isDemo, setClient } = usePortalAuth();
  const [form, setForm] = useState(() => ({ ...client }));
  const [saving, setSaving] = useState(false);
  const [savedNote, setSavedNote] = useState(null);

  useEffect(() => {
    setForm({ ...client });
  }, [client]);

  const missing = useMemo(() => REQUIRED_FIELDS.filter((f) => !stringy(form[f])), [form]);

  const updateField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
  const toggleMulti = (name, value) => {
    setForm((prev) => {
      const current = Array.isArray(prev[name]) ? prev[name] : [];
      return {
        ...prev,
        [name]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      };
    });
  };

  const save = async () => {
    if (isDemo) {
      setSavedNote("Saved (demo mode — not written to Firestore).");
      setTimeout(() => setSavedNote(null), 3000);
      return;
    }
    if (!client?.id) return;
    setSaving(true);
    try {
      const patch = { ...form, updatedAt: serverTimestamp() };
      if (missing.length === 0) patch.onboardingComplete = true;
      await setDoc(doc(db, "clients", client.id), patch, { merge: true });
      setClient((c) => ({ ...(c || {}), ...patch }));
      setSavedNote("Saved.");
      setTimeout(() => setSavedNote(null), 2500);
    } catch (err) {
      console.error(err);
      alert("Could not save: " + (err.message || err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Onboarding</h1>
          <p className="text-sm text-gray-500 mt-1">
            The more we know upfront, the better your flyer performs. Auto-saves whenever you click Save.
          </p>
        </div>
        <div className="text-xs text-gray-500">
          {missing.length === 0
            ? <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold"><span className="h-2 w-2 rounded-full bg-emerald-500" /> All required fields complete</span>
            : `${missing.length} required field${missing.length === 1 ? "" : "s"} left`}
        </div>
      </div>

      {SECTIONS.map((section) => (
        <Card key={section.title} title={section.title}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.fields.map((f) => (
              <Field key={f.name} f={f} value={form[f.name]} onChange={updateField} onToggleMulti={toggleMulti} />
            ))}
          </div>
        </Card>
      ))}

      <div className="sticky bottom-4 flex justify-end">
        <div className="rounded-full bg-white shadow-lg border border-gray-200 px-4 py-2 flex items-center gap-3">
          {savedNote && <span className="text-xs text-emerald-700 font-medium">{savedNote}</span>}
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-emerald-600 text-white text-sm font-semibold px-5 py-2 hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ f, value, onChange, onToggleMulti }) {
  const labelCls = "block text-xs font-medium text-gray-700 mb-1";
  const inputCls = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none";
  const spanFull = f.type === "textarea" || f.type === "multi" ? "md:col-span-2" : "";

  return (
    <div className={spanFull}>
      <label className={labelCls}>
        {f.label} {f.required && <span className="text-red-500">*</span>}
      </label>
      {f.type === "textarea" && (
        <textarea rows={2} className={inputCls} value={value || ""} onChange={(e) => onChange(f.name, e.target.value)} />
      )}
      {f.type === "select" && (
        <select className={inputCls} value={value || ""} onChange={(e) => onChange(f.name, e.target.value)}>
          <option value="">Choose…</option>
          {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}
      {f.type === "multi" && (
        <div className="flex flex-wrap gap-2">
          {f.options.map((o) => {
            const active = Array.isArray(value) ? value.includes(o) : false;
            return (
              <button
                type="button"
                key={o}
                onClick={() => onToggleMulti(f.name, o)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${active ? "bg-emerald-600 text-white border-emerald-600" : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"}`}
              >
                {o}
              </button>
            );
          })}
        </div>
      )}
      {!f.type || f.type === "email" || f.type === "number" ? (
        <input
          type={f.type || "text"}
          className={inputCls}
          value={value || ""}
          onChange={(e) => onChange(f.name, e.target.value)}
        />
      ) : null}
    </div>
  );
}

function stringy(v) {
  if (Array.isArray(v)) return v.length > 0;
  if (v === 0) return true;
  return Boolean(v);
}
