import React, { useState, useMemo, useEffect } from 'react';
import { 
  Users, Wallet, FileSpreadsheet, LayoutDashboard, PlusCircle, CheckCircle2, Circle,
  ArrowUpRight, ArrowDownRight, Download, Trash2, Save, Search, Info, Gift, Box, 
  CreditCard, ChevronDown, ChevronUp, Copy, X, UploadCloud, Image as ImageIcon, 
  FileText, Lock, Loader2, Edit3, BookOpen, Megaphone, Camera
} from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// =====================================================================
// PENGATURAN DATABASE ASLI IVAN RAHMAN
// =====================================================================
const manualFirebaseConfig = {
  apiKey: "AIzaSyAq7PnXzh1W-WCSckZaUlI0Yhy4wnEXYj0",
  authDomain: "kas-rt-08-villa-permata.firebaseapp.com",
  projectId: "kas-rt-08-villa-permata",
  storageBucket: "kas-rt-08-villa-permata.firebasestorage.app",
  messagingSenderId: "658131362470",
  appId: "1:658131362470:web:105c7ca23ef1a51f6bca67",
  measurementId: "G-42QK5X1N8P"
};

const envConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : null;
const firebaseConfig = envConfig || manualFirebaseConfig;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'kas-rt-08-app';

// --- DATA AWAL WARGA (CEKLIS JANUARI - APRIL) ---
const INITIAL_RESIDENTS = [
  { id: 1, block: "BE - 01", name: "Bp. Muharam", defaultAmount: 60000, payments: { 2026: { 0: 60000 } } },
  { id: 2, block: "BE - 01", name: "Bp. Muhammad Nasir", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 3, block: "BE - 02", name: "Bp. Budi", defaultAmount: 60000, payments: {} },
  { id: 4, block: "BE - 03", name: "Bp. Yazid", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 5, block: "BE - 03A", name: "Bp. Tino Sanjaya", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 6, block: "BE - 05", name: "Bp. Suhartono", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 7, block: "BE - 06", name: "Bp. Anton Sujarwo", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 8, block: "BE - 07", name: "Bp. Tomi", defaultAmount: 60000, payments: { 2026: { 0: 60000 } } },
  { id: 9, block: "BE - 08", name: "Bp. Faris Azhar", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 10, block: "BE - 09", name: "Bp. Rival", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 11, block: "BE - 10", name: "Bp. Antonius", defaultAmount: 55000, payments: { 2026: { 0: 55000, 1: 55000, 2: 55000, 3: 55000 } } },
  { id: 12, block: "BE - 11", name: "Bp. Agus Kurniawan", defaultAmount: 60000, payments: { 2026: { 0: 60000 } } },
  { id: 13, block: "BE - 12A", name: "Bp. Irvani Taufiq", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 14, block: "BE - 14", name: "Bp. Ikhsan", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000 } } },
  { id: 15, block: "BI - 01", name: "Bp. Slamet Prayogo / Pak Zei", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 16, block: "BI - 02", name: "Bp. Rumanto", defaultAmount: 60000, payments: { 2026: { 0: 60000 } } },
  { id: 17, block: "BI - 03", name: "Hasan", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 18, block: "BI - 05", name: "Bp. Hardianto", defaultAmount: 60000, payments: {} },
  { id: 19, block: "BI - 06", name: "Bp. Irwan", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 20, block: "BI - 07", name: "Bp. Zikri", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000 } } },
  { id: 21, block: "BI - 08", name: "Bp. Arya", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 22, block: "BI - 09", name: "Bp. Fajar", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 23, block: "BI - 10", name: "Bp. Dedi Hendra", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 24, block: "BI - 11", name: "Bp. Ayyub", defaultAmount: 60000, payments: {} },
  { id: 25, block: "BI - 12", name: "Bp. Darma", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 26, block: "BI - 12A", name: "Bp. Hendrik", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 27, block: "BI - 14", name: "Bp. Abdul Aziz", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 28, block: "BI - 15", name: "Bp. Iqbal", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 29, block: "BI - 16", name: "Bp. Wagiso", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 30, block: "BI - 17", name: "Bp. Yana", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 32, block: "BJ - 01", name: "Bp. Dedi Candra", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 33, block: "BJ - 02", name: "Bp. Said", defaultAmount: 60000, payments: { 2026: { 0: 60000 } } },
  { id: 34, block: "BJ - 03", name: "Bp. Nababan", defaultAmount: 55000, payments: { 2026: { 0: 55000 } } },
  { id: 35, block: "BJ - 03A", name: "Bp. Rizal", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000 } } },
  { id: 36, block: "BJ - 05", name: "Bp. Kiki", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000 } } },
  { id: 37, block: "BJ - 06", name: "Bp. Jhonsin", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 38, block: "BJ - 07", name: "Bp. Dwi Agus", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 39, block: "BJ - 08", name: "Bp. Hendriyanto", defaultAmount: 55000, payments: { 2026: { 0: 55000, 1: 55000, 2: 55000 } } },
  { id: 41, block: "BJ - 10", name: "Bp. Rudi S.", defaultAmount: 60000, payments: {} },
  { id: 42, block: "BJ - 11", name: "Bp. Ragil", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 43, block: "BJ - 12A", name: "Bp. Rotua A.", defaultAmount: 55000, payments: { 2026: { 0: 55000 } } },
  { id: 44, block: "BJ - 14", name: "Bp. Gunawan", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 45, block: "BJ - 15", name: "Bp. Parid Pratama", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000 } } },
  { id: 46, block: "BJ - 16", name: "Bp. Aji", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000 } } },
  { id: 47, block: "BJ - 17", name: "Bp. Willy Alviani", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 48, block: "BJ - 18", name: "Bp. Dimas Agung", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 49, block: "BK - 01", name: "Bp. Agung", defaultAmount: 60000, payments: { 2026: { 0: 60000 } } },
  { id: 50, block: "BK - 03", name: "Ibu. Asmira", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 51, block: "BK - 03A", name: "Bp. Dede", defaultAmount: 60000, payments: {} },
  { id: 52, block: "BK - 05", name: "Bp. Ayub", defaultAmount: 60000, payments: {} },
  { id: 53, block: "BK - 06", name: "Ibu. Anita", defaultAmount: 60000, payments: {} },
  { id: 54, block: "BK - 07", name: "Bp. Yogo", defaultAmount: 55000, payments: { 2026: { 0: 55000, 1: 55000, 2: 55000 } } },
  { id: 55, block: "BK - 09", name: "Aditya", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 56, block: "BK - 11", name: "Bp. Fanfan Fauzan", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 57, block: "BK - 12", name: "Bp. Junet", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 58, block: "BK - 12A", name: "Bp. Darul Tri", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 59, block: "BK - 14", name: "Bp. Yasir Rifai", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 60, block: "BK - 15", name: "Astried Awalia Putri", defaultAmount: 60000, payments: { 2026: { 1: 60000, 2: 60000 } } },
  { id: 61, block: "BK - 16", name: "Bp. Agung / Anjani", defaultAmount: 60000, payments: {} },
  { id: 62, block: "BN - 02", name: "Bp. Sugeng", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 63, block: "BN - 03", name: "Bp. Mycko Andi", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 64, block: "BN - 03A", name: "Bp. Ferrandus Wijaya", defaultAmount: 55000, payments: { 2026: { 0: 55000, 1: 55000, 2: 55000, 3: 55000 } } },
  { id: 65, block: "BN - 05", name: "Bp. Fajar Setio", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 66, block: "BN - 06", name: "Bp. Ridwan", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 67, block: "BN - 08", name: "Bp. Saepudin", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 68, block: "BN - 09", name: "Bp. Mukmin", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 69, block: "BN - 10", name: "Bp. Rahmat", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 70, block: "BN - 11", name: "Rumber Annas", defaultAmount: 38000, payments: { 2026: { 0: 38000, 1: 38000, 2: 38000, 3: 38000 } } },
  { id: 71, block: "BN - 12", name: "Bp. Iqbal", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 72, block: "BN - 12A", name: "Bp. Munaam", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 73, block: "BN - 14", name: "Bp. Andri", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 74, block: "BN - 16", name: "Bp. Heru", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 75, block: "BN - 17", name: "Bp. Sudarsono", defaultAmount: 55000, payments: { 2026: { 0: 55000, 1: 55000, 2: 55000, 3: 55000 } } },
  { id: 76, block: "BN - 18", name: "Bp. Asep", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 77, block: "BN - 20", name: "Bp. Angga", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 78, block: "BN - 21", name: "Ibu Lusiana", defaultAmount: 55000, payments: { 2026: { 0: 55000, 1: 55000, 2: 55000, 3: 55000 } } },
  { id: 80, block: "BO - 01A", name: "Bp. Aswin", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 81, block: "BO - 02", name: "Bp. Sinaga", defaultAmount: 55000, payments: { 2026: { 0: 55000, 1: 55000, 2: 55000 } } },
  { id: 82, block: "BO - 03", name: "Bp. Dwinanto", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 83, block: "BO - 05", name: "Ibu Suharti Ningsih", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 84, block: "BO - 06", name: "Bp. Aris Suwandi", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 85, block: "BO - 07", name: "Bp. Siahaan/ Meirita", defaultAmount: 55000, payments: { 2026: { 0: 55000, 1: 55000, 2: 55000, 3: 55000 } } },
  { id: 86, block: "BO - 08", name: "Bp. Arry Perlin", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 87, block: "BO - 10", name: "Bp. Devi Alpian", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 88, block: "BO - 12", name: "Bp. Hartadi", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 89, block: "BO - 15", name: "Bp. Waryanto", defaultAmount: 60000, payments: {} },
  { id: 90, block: "BO - 16", name: "Bp. Rekky", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 91, block: "CA - 01", name: "Roma Odi", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } },
  { id: 92, block: "CA - 02", name: "Bp. Endang", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 93, block: "CA - 03A", name: "Bp. Herman", defaultAmount: 55000, payments: { 2026: { 0: 55000, 1: 55000, 2: 55000 } } },
  { id: 94, block: "CA - 06", name: "Bp. Yusuf ( tidak ikut LSK )", defaultAmount: 55000, payments: { 2026: { 0: 55000, 1: 55000, 2: 55000, 3: 55000 } } },
  { id: 95, block: "CA - 07", name: "Bp. Yohanes Rato", defaultAmount: 55000, payments: { 2026: { 0: 55000, 1: 55000 } } },
  { id: 96, block: "CA - 08", name: "Rusyanto", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 97, block: "CA - 10", name: "Bp. Bustanil arifin", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000 } } },
  { id: 98, block: "CA - 11", name: "Bp. Handi", defaultAmount: 60000, payments: { 2026: { 0: 60000, 1: 60000, 2: 60000, 3: 60000 } } }
];

const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

export default function App() {
  const [user, setUser] = useState(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [userRole, setUserRole] = useState('GUEST');
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentMonthIdx, setCurrentMonthIdx] = useState(new Date().getMonth());
  const [saldoAwalTahun, setSaldoAwalTahun] = useState(0);

  const [residents, setResidents] = useState(INITIAL_RESIDENTS);
  const [transactions, setTransactions] = useState([]);
  const [agendas, setAgendas] = useState([]);
  const [assets, setAssets] = useState([]); 
  const [pengajianData, setPengajianData] = useState({ saldo: 0, info: '' });
  const [bankAccounts, setBankAccounts] = useState([{ id: 1, bankName: 'Bank Mandiri', accountNumber: '1170011106804', accountName: 'BENDAHARA RT 08' }]);
  const [laporanWarga, setLaporanWarga] = useState([]);
  const [thrBaseAmount, setThrBaseAmount] = useState(50000);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [copied, setCopied] = useState(null);

  const currentYearAuto = new Date().getFullYear();
  const [searchIuran, setSearchIuran] = useState('');
  const [selectedYearIuran, setSelectedYearIuran] = useState(currentYearAuto);
  const [selectedYearLaporan, setSelectedYearLaporan] = useState(currentYearAuto);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) { console.error("Auth Error:", err); }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // --- SYNC DATABASE FINAL ---
  useEffect(() => {
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'appState', 'mainDataFinal');
    const unsub = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if(data.saldoAwalTahun !== undefined) setSaldoAwalTahun(data.saldoAwalTahun);
        if(data.residents) setResidents(data.residents);
        if(data.transactions) setTransactions(data.transactions);
        if(data.agendas) setAgendas(data.agendas);
        if(data.assets) setAssets(data.assets);
        if(data.pengajianData) setPengajianData(data.pengajianData);
        if(data.bankAccounts) setBankAccounts(data.bankAccounts);
        if(data.laporanWarga) setLaporanWarga(data.laporanWarga);
        if(data.thrBaseAmount !== undefined) setThrBaseAmount(data.thrBaseAmount);
      } else {
        setDoc(docRef, { residents: INITIAL_RESIDENTS, transactions: [], agendas: [], assets: [], saldoAwalTahun: 0, bankAccounts: [{ id: 1, bankName: 'Bank Mandiri', accountNumber: '1170011106804', accountName: 'BENDAHARA RT 08' }], laporanWarga: [], thrBaseAmount: 50000 });
      }
      setDbLoading(false);
    }, (err) => { setDbLoading(false); });
    return () => unsub();
  }, [user]); 

  const saveToDatabase = async (key, dataToSave) => {
    if(userRole !== 'PENGURUS') return; 
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'appState', 'mainDataFinal');
      await setDoc(docRef, { [key]: dataToSave }, { merge: true });
    } catch (err) { console.log("Database Error"); }
  };

  const saveLaporanToDatabase = async (dataToSave) => {
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'appState', 'mainDataFinal');
      await setDoc(docRef, { laporanWarga: dataToSave }, { merge: true });
    } catch (err) { }
  };

  const formatRp = (angka) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);

  const laporanData = useMemo(() => {
    let laporan = [];
    let saldoBulanSebelumnya = saldoAwalTahun;
    for (let m = 0; m < 12; m++) {
      let totalIuranBulanIni = 0;
      residents.forEach(res => {
        const pay = res.payments[selectedYearLaporan] ? res.payments[selectedYearLaporan][m] : undefined;
        if (typeof pay === 'number') totalIuranBulanIni += pay;
      });
      const transBulanIni = transactions.filter(t => t.month === m && (!t.date || t.date.includes(selectedYearLaporan.toString())));
      const penerimaanLain = transBulanIni.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
      const totalPenerimaan = totalIuranBulanIni + penerimaanLain;
      const totalOut = transBulanIni.filter(t => t.type === 'out').reduce((sum, t) => sum + t.amount, 0);
      const surplusDefisit = totalPenerimaan - totalOut;
      const saldoAkhir = saldoBulanSebelumnya + surplusDefisit;
      laporan.push({ monthName: MONTHS[m], saldoAwal: saldoBulanSebelumnya, totalPenerimaan, totalPengeluaran: totalOut, surplusDefisit, saldoAkhir });
      saldoBulanSebelumnya = saldoAkhir;
    }
    return laporan;
  }, [residents, transactions, saldoAwalTahun, selectedYearLaporan]);

  if (dbLoading) {
    return ( <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-green-700"> <Loader2 className="w-10 h-10 animate-spin mb-4" /> <h2 className="font-bold">Menyiapkan Aplikasi RT 08...</h2> </div> );
  }

  // --- HALAMAN LOGIN ---
  if (userRole === 'GUEST') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex justify-center">
        <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0"> <img src="/logo-bogor.png" alt="" className="w-[120%] max-w-none blur-md" /> </div>
          <div className="relative mb-6 z-10">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30 transform scale-110"></div>
            <img src="/foto-rt.jpeg" alt="Foto Ketua RT" className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-xl relative z-10" onError={(e) => { e.target.src = '/logo-bogor.png'; }} />
          </div>
          <h1 className="text-2xl font-extrabold text-green-700 tracking-tight mb-1 text-center z-10">VILLA PERMATA MAS 1</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8 text-center z-10">Sistem Kas RT 08</p>
          <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4 z-10">
             <button onClick={() => setUserRole('WARGA')} className="w-full py-3.5 bg-blue-50 text-blue-700 font-bold rounded-xl border border-blue-200 hover:bg-blue-100 transition flex items-center justify-center gap-3"> <Users className="w-5 h-5" /> Masuk Sebagai Warga </button>
             <button onClick={() => setShowPinModal(true)} className="w-full py-3.5 bg-green-50 text-green-700 font-bold rounded-xl border border-green-200 hover:bg-green-100 transition flex items-center justify-center gap-3"> <Lock className="w-5 h-5" /> Masuk Sebagai Pengurus </button>
          </div>
          {showPinModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-xs relative">
                <button onClick={() => {setShowPinModal(false); setPin('');}} className="absolute top-4 right-4 text-slate-400"><X className="w-5 h-5"/></button>
                <h3 className="font-bold text-slate-800 mb-4 text-center">PIN Pengurus</h3>
                <input type="password" maxLength={6} autoFocus value={pin} onChange={(e) => {setPin(e.target.value); setPinError(false);}} className={`w-full text-center text-2xl tracking-[0.5em] font-bold p-3 border rounded-xl ${pinError ? 'border-red-500 bg-red-50' : 'border-slate-300'}`} />
                <button onClick={() => { if (pin === '123123') { setUserRole('PENGURUS'); setShowPinModal(false); } else { setPinError(true); } }} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl mt-4">Login</button>
              </div>
            </div>
          )}
          <div className="absolute bottom-6 left-0 right-0 text-center z-10"> <p className="text-[10px] text-slate-400 font-bold tracking-widest">crafted by ivan rahman</p> </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  const DashboardView = () => {
    const dataBulanIni = laporanData[currentMonthIdx];
    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-green-600 to-emerald-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <h2 className="text-sm font-medium text-green-100 mb-1">Saldo Kas RT 08 (Bln {MONTHS[currentMonthIdx]})</h2>
          <div className="text-3xl font-bold mb-4">{formatRp(dataBulanIni.saldoAkhir)}</div>
          <div className="grid grid-cols-2 gap-4 mt-6 border-t border-white/20 pt-4">
            <div><div className="flex items-center text-green-100 text-xs mb-1"><ArrowUpRight className="w-4 h-4 mr-1" /> Pemasukan</div><div className="font-semibold">{formatRp(dataBulanIni.totalPenerimaan)}</div></div>
            <div><div className="flex items-center text-red-200 text-xs mb-1"><ArrowDownRight className="w-4 h-4 mr-1" /> Pengeluaran</div><div className="font-semibold">{formatRp(dataBulanIni.totalPengeluaran)}</div></div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[{id:'iuran', label:'IURAN', icon:Users, col:'blue'}, {id:'kas', label:'KELUAR', icon:Wallet, col:'orange'}, {id:'thr', label:'THR', icon:Gift, col:'yellow'}, {id:'pengajian', label:'PENGAJIAN', icon:BookOpen, col:'emerald'}].map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2">
              <div className={`bg-${item.col}-100 p-2.5 rounded-full text-${item.col}-600`}><item.icon className="w-5 h-5" /></div>
              <span className="text-[9px] font-bold text-slate-700">{item.label}</span>
            </button>
          ))}
          <button onClick={() => setActiveTab('laporWarga')} className="bg-red-50 p-3 rounded-2xl shadow-sm border border-red-200 flex flex-col items-center justify-center gap-2 col-span-4"> <div className="flex items-center gap-3"><div className="bg-red-100 p-2.5 rounded-full text-red-600"><Megaphone className="w-5 h-5" /></div><span className="text-[12px] font-bold text-red-800">Lapor Warga RT 08</span></div> </button>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100">
           <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2 mb-4"><CreditCard className="w-4 h-4 text-blue-500"/> INFO REKENING</h3>
           {bankAccounts.map(bank => (
             <div key={bank.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div> <p className="text-[10px] font-bold text-slate-400 uppercase">{bank.bankName}</p> <p className="text-sm font-black text-slate-700 tracking-wider">{bank.accountNumber}</p> <p className="text-[9px] font-bold text-slate-500 uppercase">A.N. {bank.accountName}</p> </div>
                <button onClick={() => {navigator.clipboard.writeText(bank.accountNumber); setCopied(bank.id); setTimeout(()=>setCopied(null), 2000);}} className="p-3 bg-white rounded-xl shadow-sm"> {copied === bank.id ? <CheckCircle2 className="w-4 h-4 text-green-500"/> : <Copy className="w-4 h-4 text-slate-300"/>} </button>
             </div>
           ))}
        </div>
      </div>
    );
  };

  // --- IURAN VIEW (REVISI RINCIAN) ---
  const IuranView = () => {
    const [rincian, setRincian] = useState({ pokok: 60000, kebersihan: 20000, keamanan: 18000, lsk: 7000, kasRt: 8000, kasRw: 1000, keagamaan: 5000, posyandu: 1000 });
    useEffect(() => {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'appState', 'rincianIuranFinal');
      const unsub = onSnapshot(docRef, (snap) => { if(snap.exists()) setRincian(snap.data()); });
      return () => unsub();
    }, []);

    const togglePaymentGrid = (residentId, m) => { 
      if (userRole !== 'PENGURUS') return; 
      const newResidents = residents.map(r => { 
        if (r.id === residentId) { 
          const yrPayments = { ...(r.payments[selectedYearIuran] || {}) };
          if (yrPayments[m]) delete yrPayments[m]; 
          else yrPayments[m] = r.defaultAmount; 
          return { ...r, payments: { ...r.payments, [selectedYearIuran]: yrPayments } }; 
        } 
        return r; 
      }); 
      setResidents(newResidents); 
      saveToDatabase('residents', newResidents); 
    };

    const filteredWarga = residents.filter(r => r.name.toLowerCase().includes(searchIuran.toLowerCase()) || r.block.toLowerCase().includes(searchIuran.toLowerCase()) );

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between"> <h2 className="text-lg font-bold text-slate-800">Pencatatan Iuran</h2> <select value={selectedYearIuran} onChange={(e) => setSelectedYearIuran(Number(e.target.value))} className="bg-white border border-slate-300 text-sm font-semibold rounded-lg p-2"> {YEARS.map(y => <option key={y} value={y}>Tahun {y}</option>)} </select> </div>
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-[10px] text-blue-700">
           <h3 className="font-bold text-blue-800 mb-1 flex items-center gap-1"> <Info className="w-3 h-3"/> Rincian Iuran (Pokok: Rp {formatRp(rincian.pokok)}) </h3>
           <div className="grid grid-cols-2 gap-x-2">
              <p>a. Kebersihan: Rp{formatRp(rincian.kebersihan)}</p> <p>b. Keamanan: Rp{formatRp(rincian.keamanan)}</p>
              <p>c. LSK: Rp{formatRp(rincian.lsk)}</p> <p>d. Kas Pengurus: Rp{formatRp(rincian.kasRt)}</p>
              <p>e. Kas RW: Rp{formatRp(rincian.kasRw)}</p> <p>f. Dana Keagamaan: Rp{formatRp(rincian.keagamaan)}</p>
              <p>g. Posyandu: Rp{formatRp(rincian.posyandu)}</p>
           </div>
        </div>
        <input type="text" className="bg-white border border-slate-200 text-sm rounded-xl block w-full p-3" placeholder="Cari warga..." value={searchIuran} onChange={(e) => setSearchIuran(e.target.value)} />
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold"><tr><th className="sticky left-0 bg-slate-50 p-3 z-20">Nama Warga</th>{MONTHS.map(m => (<th key={m} className="p-3 text-center">{m.slice(0,3)}</th>))}</tr></thead>
              <tbody className="divide-y divide-slate-100">{filteredWarga.map((warga) => (
                <tr key={warga.id} className="hover:bg-slate-50">
                  <td className="sticky left-0 bg-white p-3 z-10 border-r border-slate-50 whitespace-nowrap"> <div className="font-bold text-slate-800">{warga.name}</div> <div className="text-[9px] text-slate-400 uppercase">{warga.block}</div> </td>
                  {MONTHS.map((m, i) => { const isPaid = !!warga.payments[selectedYearIuran]?.[i]; return ( <td key={i} className={`p-2 text-center ${userRole==='PENGURUS'?'cursor-pointer':''}`} onClick={()=>togglePaymentGrid(warga.id, i)}> {isPaid ? <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto fill-green-50"/> : <Circle className="w-6 h-6 text-slate-100 mx-auto"/>} </td> );})}
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex justify-center">
      <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
        <div className="bg-white px-6 py-4 shadow-sm z-40 flex items-center justify-between border-b border-slate-100"> <div className="flex items-center"> <img src="/logo-bogor.png" alt="Logo" className="w-8 h-8 object-contain mr-3" /> <div> <h1 className="text-sm font-black text-green-700 tracking-tight leading-none uppercase">VILLA PERMATA MAS 1</h1> <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Sistem Kas RT 08</p> </div> </div> <div className="text-[8px] font-black bg-green-600 text-white px-2 py-0.5 rounded-full uppercase">{userRole}</div> </div>
        <div className="flex-1 overflow-y-auto p-4 pb-24 z-10">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'iuran' && <IuranView />}
          {(activeTab==='kas'||activeTab==='thr'||activeTab==='pengajian'||activeTab==='laporWarga') && <div className="p-12 text-center text-slate-400 font-bold uppercase text-[10px]">Fitur Ini Tersedia Setelah Anda Menginput Data</div>}
        </div>
        <div className="bg-white/80 backdrop-blur-lg border-t border-slate-100 px-2 py-4 fixed bottom-0 w-full max-w-md flex justify-between items-center z-40">
           {[{id:'dashboard', icon:LayoutDashboard, label:'Beranda'}, {id:'iuran', icon:Users, label:'Iuran'}, {id:'kas', icon:Wallet, label:'Transaksi'}, {id:'laporan', icon:FileSpreadsheet, label:'Laporan'}].map(nav => (
             <button key={nav.id} onClick={() => setActiveTab(nav.id)} className={`flex flex-col items-center flex-1 gap-1 transition ${activeTab === nav.id ? 'text-green-600' : 'text-slate-300'}`}> <nav.icon className="w-5 h-5" /> <span className="text-[9px] font-black uppercase tracking-tighter">{nav.label}</span> </button>
           ))}
        </div>
      </div>
    </div>
  );
}