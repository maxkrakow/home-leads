import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqEFzSx4sNGzflwqNFlhcAVuUhuH58-zc",
  authDomain: "home-leads-6bbae.firebaseapp.com",
  projectId: "home-leads-6bbae",
  storageBucket: "home-leads-6bbae.firebasestorage.app",
  messagingSenderId: "349548889412",
  appId: "1:349548889412:web:627958d615e196962b8311",
  measurementId: "G-VWGQ7PPZ3X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db }; 