// Fake data that renders when a user signs in as the demo account.
// Everything here is placeholder — real metrics come from Firestore once the
// backend for delivery/QR/skip trace is wired up.

export const demoClient = {
  id: "demo-untappedhomes",
  legalName: "Sam's Home Services LLC",
  dbaName: "Sam's Home Services",
  contactName: "Sam Reynolds",
  phone: "5164553535",
  email: "demo@untappedhomes.com",
  website: "samshomeservices.example",
  address: "3501 SW Corporate Pkwy, Palm City, FL 34990",
  yearsInBusiness: 3,
  licenseNumber: "CCC1326474 Florida",
  servicesOffered: ["Roofing"],
  campaignService: "Roofing, Painting, Coating, Insulation",
  avgTicket: "$25,000",
  offersFinancing: "Yes",
  minHomeValue: 250000,
  propertyTypes: "Single-family only",
  ownership: "Owner-occupied only",
  moveInWindow: "0–90 days",
  offer: "20% same day discount",
  offerExpiration: "1 month",
  primaryCta: "Call",
  displayPhone: "Tracking 818",
  landingPage: "samshomeservices.example",
  brandColors: "#FF6F00 (orange), #EE640D, #F8F5F4, #000000",
  fonts: "DM Sans / Glacial Indifference",
  trustBadges: "License bonded insured",
  tone: "Premium / clean",
  hoursDisplay: "Mon–Sat 8a–7p",
  onboardingComplete: true,
  createdAt: new Date("2026-04-12"),
};

export const demoCampaigns = [
  {
    id: "camp-01",
    name: "Palm City Roofing — May Drop",
    status: "delivered",
    stage: "Delivered",
    dropDate: "2026-05-10",
    quantity: 1500,
    delivered: 1483,
    inTransit: 0,
    scans: 62,
    calls: 41,
    texts: 12,
    landingPageVisits: 118,
    responseRatePct: 4.5,
    zipCodes: ["34990", "34997", "34994"],
  },
  {
    id: "camp-02",
    name: "Stuart / Palm City — June Drop",
    status: "in_transit",
    stage: "In the mail",
    dropDate: "2026-06-24",
    quantity: 1800,
    delivered: 940,
    inTransit: 860,
    scans: 21,
    calls: 14,
    texts: 5,
    landingPageVisits: 47,
    responseRatePct: 3.1,
    zipCodes: ["34990", "34996", "33455"],
  },
  {
    id: "camp-03",
    name: "Roofing + Coating — July Drop",
    status: "design_review",
    stage: "Awaiting your proof approval",
    dropDate: "2026-07-15",
    quantity: 2000,
    delivered: 0,
    inTransit: 0,
    scans: 0,
    calls: 0,
    texts: 0,
    landingPageVisits: 0,
    responseRatePct: null,
    zipCodes: ["34990", "34996", "34997", "33455"],
  },
];

export const demoProofs = [
  {
    id: "proof-01",
    campaignId: "camp-03",
    version: "v1",
    status: "in_review",
    thumbUrl: "https://placehold.co/800x1000/FF6F00/ffffff?text=Roofing+Flyer+Proof+v1",
    fullUrl: "https://placehold.co/1600x2000/FF6F00/ffffff?text=Roofing+Flyer+Proof+v1",
    uploadedAt: new Date("2026-06-24T14:03:00"),
    notes: "Front side. Please confirm brand colors + phone number.",
  },
];

export const demoUploads = [
  {
    id: "up-01",
    kind: "logo",
    fileName: "Logo-green-2.png",
    fileUrl: "https://placehold.co/400x400/FF6F00/ffffff?text=LOGO",
    uploadedAt: new Date("2026-04-14"),
  },
  {
    id: "up-02",
    kind: "photo",
    fileName: "Truck-wrap-hero.jpg",
    fileUrl: "https://placehold.co/800x600/EE640D/ffffff?text=Truck+Photo",
    uploadedAt: new Date("2026-04-14"),
  },
  {
    id: "up-03",
    kind: "photo",
    fileName: "Recent-install.jpg",
    fileUrl: "https://placehold.co/800x600/0B0B0B/ffffff?text=Recent+Install",
    uploadedAt: new Date("2026-04-14"),
  },
];

export const demoSkipTrace = {
  entitlementStatus: "active",
  monthlyIncluded: 500,
  monthlyUsed: 187,
  lastPull: new Date("2026-06-20"),
};

export const demoInvoices = [
  {
    id: "in_demo_flyer_july",
    description: "Flyer charges — Roofing + Coating July Drop",
    status: "open",
    amountDue: 200000, // $2,000.00 in cents
    amountPaid: 0,
    hostedInvoiceUrl: "#",
    created: new Date("2026-07-04"),
    metadata: { campaignName: "Roofing + Coating — July Drop" },
  },
  {
    id: "in_demo_sub_june",
    description: "Untapped Homes — Direct Mail Subscription",
    status: "paid",
    amountDue: 49900,
    amountPaid: 49900,
    hostedInvoiceUrl: "#",
    created: new Date("2026-06-01"),
    metadata: {},
  },
];

export const demoPayment = {
  method: "card",
  brand: "Visa",
  last4: "4242",
  billingEmail: "demo@untappedhomes.com",
  nextInvoice: new Date("2026-07-01"),
  monthlyBase: 499,
  perFlyer: 1.0,
  currentPeriodFlyers: 1500,
  currentPeriodTotal: 1999,
};
