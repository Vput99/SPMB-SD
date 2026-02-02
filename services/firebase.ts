import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// =========================================================================
// KONFIGURASI FIREBASE
// Konfigurasi ini sesuai dengan data project spmb-sd-3750c
// =========================================================================
const firebaseConfig = {
  apiKey: "AIzaSyAiTrff4q0QdwtDopP38sViv_CtS_6A_U0",
  authDomain: "spmb-sd-3750c.firebaseapp.com",
  projectId: "spmb-sd-3750c",
  storageBucket: "spmb-sd-3750c.firebasestorage.app",
  messagingSenderId: "446175364468",
  appId: "1:446175364468:web:ce1d183aa5eab9b17bd821"
};

let app;
let db: any;
let isConfigured = false;

try {
  app = initializeApp(firebaseConfig);
  // Inisialisasi Firestore
  db = getFirestore(app);
  isConfigured = true;
  console.log("Firebase initialized successfully with project: " + firebaseConfig.projectId);
} catch (error) {
  console.error("CRITICAL ERROR: Gagal menginisialisasi Firebase.", error);
  console.error("Kemungkinan penyebab: Versi library tidak kompatibel atau koneksi internet bermasalah.");
}

export { db, isConfigured };