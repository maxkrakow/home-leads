import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBqEFzSx4sNGzflwqNFlhcAVuUhuH58-zc",
  authDomain: "home-leads-6bbae.firebaseapp.com",
  projectId: "home-leads-6bbae",
  storageBucket: "home-leads-6bbae.firebasestorage.app",
  messagingSenderId: "349548889412",
  appId: "1:349548889412:web:627958d615e196962b8311",
  measurementId: "G-VWGQ7PPZ3X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Emails that can access /admin. Add more as we sign more Untapped Homes staff.
const ADMIN_EMAILS = new Set([
  "max@untappedhomes.com",
  "max@lended.ai",
  "maxkrakow@gmail.com",
]);

// Special demo account — signing in with this email shows the dashboard with
// fake campaign/QR/delivery metrics so we can preview the layout without real
// event data. Anyone can log in as the demo user (it's a placeholder).
const DEMO_EMAIL = "demo@untappedhomes.com";
const DEMO_CLIENT_ID = "demo-untappedhomes";

export { auth, db, storage, ADMIN_EMAILS, DEMO_EMAIL, DEMO_CLIENT_ID };
