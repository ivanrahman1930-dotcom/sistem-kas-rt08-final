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
import { getFirestore, doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';

// =====================================================================
// PENGATURAN DATABASE (UNTUK HOSTING BARU)
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

// FIX PENYIMPANAN: Memastikan appId tidak pernah kosong
const appId = typeof __app_id !== 'undefined' && __app_id ? __app_id : 'kas-rt-08-app';

// --- DATA AWAL KOSONG ---
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
const INITIAL_TRANSACTIONS = [];
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const YEARS = [2024, 2025, 2026, 2027, 2028, 2029, 2030];

// =====================================================================
// KOMPONEN UTAMA APLIKASI KAS RT 08
// =====================================================================
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
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [agendas, setAgendas] = useState([]);
  const [assets, setAssets] = useState([]); 
  const [pengajianData, setPengajianData] = useState({ saldo: 0, info: '' });
  
  // State Rekening Bank
  const [bankAccounts, setBankAccounts] = useState([
    { id: 1, bankName: 'Bank Mandiri', accountNumber: '1170011106804', accountName: 'BENDAHARA RT 08' }
  ]);

  const [laporanWarga, setLaporanWarga] = useState([]);
  const [thrBaseAmount, setThrBaseAmount] = useState(50000);

  const [showQrisModal, setShowQrisModal] = useState(false);
  const [copied, setCopied] = useState(null);

  const currentYearAuto = new Date().getFullYear();
  const [searchIuran, setSearchIuran] = useState('');
  const [selectedYearIuran, setSelectedYearIuran] = useState(currentYearAuto);
  const [searchThr, setSearchThr] = useState('');
  const [selectedYearThr, setSelectedYearThr] = useState(currentYearAuto);
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
    if (!user) return; // FIX PENYIMPANAN: Mencegah eksekusi sebelum siap
    const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'appState', 'mainDataFinal');
    const unsub = onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) {
        setDoc(docRef, {
          residents: INITIAL_RESIDENTS,
          transactions: INITIAL_TRANSACTIONS,
          agendas: [],
          assets: [],
          saldoAwalTahun: 0,
          pengajianData: { saldo: 0, info: '' },
          bankAccounts: [{ id: 1, bankName: 'Bank Mandiri', accountNumber: '1170011106804', accountName: 'BENDAHARA RT 08' }],
          laporanWarga: [],
          thrBaseAmount: 50000
        }).catch((err) => console.error("Lokal mode aktif.", err));
      } else {
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
      }
      setDbLoading(false);
    }, (err) => { 
      console.error(err); 
      setDbLoading(false); 
    });
    return () => unsub();
  }, [user]); 

  const saveToDatabase = async (key, dataToSave) => {
    if (!user || userRole !== 'PENGURUS') return; // FIX PENYIMPANAN: Cek keamanan tambahan
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'appState', 'mainDataFinal');
      // FIX ARRAY MERGE BUG: Menggunakan updateDoc untuk replace data (bukan di-merge)
      await updateDoc(docRef, { [key]: dataToSave });
    } catch (err) { 
      // Fallback untuk berjaga-jaga jika document belum terbuat
      if (err.code === 'not-found') {
        await setDoc(docRef, { [key]: dataToSave }, { merge: true });
      } else {
        console.error("Database Error", err); 
      }
    }
  };

  const saveLaporanToDatabase = async (dataToSave) => {
    if (!user) return; // FIX PENYIMPANAN
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'appState', 'mainDataFinal');
      // FIX ARRAY MERGE BUG
      await updateDoc(docRef, { laporanWarga: dataToSave });
    } catch (err) { 
      // Fallback
      if (err.code === 'not-found') {
        await setDoc(docRef, { laporanWarga: dataToSave }, { merge: true });
      } else {
        console.error("Sinkronisasi cloud laporan ditunda.", err);
      }
    }
  };

  const formatRp = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
  };

  const laporanData = useMemo(() => {
    let laporan = [];
    let saldoBulanSebelumnya = saldoAwalTahun;
    for (let m = 0; m < 12; m++) {
      let totalIuranBulanIni = 0;
      residents.forEach(res => {
        const pay = res.payments[selectedYearLaporan] ? res.payments[selectedYearLaporan][m] : undefined;
        if (pay === 'LUNAS') totalIuranBulanIni += (res.defaultAmount * 12); 
        else if (typeof pay === 'number') totalIuranBulanIni += pay;
      });
      
      const transBulanIni = transactions.filter(t => {
        if (t.month !== m) return false;
        if (!t.date) return true;
        return t.date.includes(selectedYearLaporan.toString());
      });

      const penerimaanLain = transBulanIni.filter(t => t.type === 'in').reduce((sum, t) => sum + t.amount, 0);
      const totalPenerimaan = totalIuranBulanIni + penerimaanLain;
      const filterPengeluaran = (kategori) => transBulanIni.filter(t => t.type === 'out' && t.category === kategori).reduce((sum, t) => sum + t.amount, 0);
      
      const rutin = {
        keamanan: filterPengeluaran('Gaji Petugas Keamanan'),
        kebersihan: filterPengeluaran('Gaji Petugas Kebersihan'),
        kasRW: filterPengeluaran('Kas RW'),
        posyandu: filterPengeluaran('Iuran Posyandu'),
        lsk: filterPengeluaran('LSK'),
        adminBank: filterPengeluaran('Admin BANK'),
      };
      const totalRutin = Object.values(rutin).reduce((a, b) => a + b, 0);
      
      const tidakRutin = {
        thr: filterPengeluaran('THR'),
        perbaikan: filterPengeluaran('Perbaikan/Perawatan'),
        rapat: filterPengeluaran('Biaya Rapat/Pertemuan'),
        kegiatan: filterPengeluaran('Kegiatan 17 Agustus, Pengajian, dll'),
        sosial: filterPengeluaran('Dana Sosial'),
        gorong: filterPengeluaran('Gorol /jasa kebersihan'),
      };
      const totalTidakRutin = Object.values(tidakRutin).reduce((a, b) => a + b, 0);
      
      const surplusDefisit = totalPenerimaan - totalRutin - totalTidakRutin;
      const saldoAkhir = saldoBulanSebelumnya + surplusDefisit;
      
      laporan.push({
        monthName: MONTHS[m],
        saldoAwal: saldoBulanSebelumnya,
        penerimaan: { iuran: totalIuranBulanIni, lain: penerimaanLain, total: totalPenerimaan },
        rutin, totalRutin, tidakRutin, totalTidakRutin, surplusDefisit, saldoAkhir
      });
      saldoBulanSebelumnya = saldoAkhir;
    }
    return laporan;
  }, [residents, transactions, saldoAwalTahun, selectedYearLaporan]);

  if (dbLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-green-700">
        <Loader2 className="w-10 h-10 animate-spin mb-4" />
        <h2 className="font-bold">Menyiapkan Aplikasi RT 08...</h2>
      </div>
    );
  }

  // --- HALAMAN LOGIN ---
  if (userRole === 'GUEST') {
    return (
      <div className="min-h-screen bg-slate-50 font-sans flex justify-center">
        <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-2xl overflow-hidden flex flex-col items-center justify-center p-6">
          
          {/* BACKGROUND LOGO BLUR LOKAL */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
            <img src="/logo-bogor.png" alt="" className="w-[120%] max-w-none blur-md" />
          </div>

          <div className="relative mb-6 z-10">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30 transform scale-110"></div>
            <img 
              src="/foto-rt.jpeg" 
              alt="Foto Ketua RT" 
              className="w-40 h-40 object-cover rounded-full border-4 border-white shadow-xl relative z-10" 
              onError={(e) => { e.target.src = '/logo-bogor.png'; }} 
            />
          </div>
          
          <h1 className="text-2xl font-extrabold text-green-700 tracking-tight mb-1 text-center z-10">VILLA PERMATA MAS 1</h1>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-8 text-center z-10">Sistem Kas RT 08</p>
          
          <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4 z-10">
             <h2 className="text-sm font-bold text-slate-700 mb-4 text-center">Pilih Mode Akses:</h2>
             
             <button onClick={() => setUserRole('WARGA')} className="w-full py-3.5 bg-blue-50 text-blue-700 font-bold rounded-xl border border-blue-200 hover:bg-blue-100 transition flex items-center justify-center gap-3 shadow-sm">
                <Users className="w-5 h-5" /> Masuk Sebagai Warga (Hanya Lihat)
             </button>
             
             <button onClick={() => setShowPinModal(true)} className="w-full py-3.5 bg-green-50 text-green-700 font-bold rounded-xl border border-green-200 hover:bg-green-100 transition flex items-center justify-center gap-3 shadow-sm">
                <Lock className="w-5 h-5" /> Masuk Sebagai Pengurus (Kelola)
             </button>
          </div>

          {showPinModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm z-20">
              <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-xs relative animate-in fade-in zoom-in duration-200">
                <button onClick={() => {setShowPinModal(false); setPin(''); setPinError(false);}} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X className="w-5 h-5"/></button>
                <h3 className="font-bold text-slate-800 mb-4 text-center">PIN Pengurus</h3>
                <input type="password" maxLength={6} autoFocus value={pin} onChange={(e) => {setPin(e.target.value); setPinError(false);}} placeholder="******" className={`w-full text-center text-2xl tracking-[0.5em] font-bold p-3 border rounded-xl focus:ring-green-500 focus:border-green-500 mb-2 ${pinError ? 'border-red-500 text-red-600 bg-red-50' : 'border-slate-300'}`} />
                {pinError && <p className="text-xs text-red-500 text-center font-semibold mb-3">PIN Salah! Coba lagi.</p>}
                <button onClick={() => { if (pin === '123123') { setUserRole('PENGURUS'); setShowPinModal(false); setPinError(false); } else { setPinError(true); } }} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 mt-2 shadow-md">Lanjutkan</button>
              </div>
            </div>
          )}
          
          <div className="absolute bottom-6 left-0 right-0 text-center z-10">
             <p className="text-[10px] text-slate-400 font-bold tracking-widest">crafted by ivan rahman</p>
          </div>

        </div>
      </div>
    );
  }

  // --- KOMPONEN HALAMAN PENGAJIAN ---
  const PengajianView = () => {
    const [isEditingPengajian, setIsEditingPengajian] = useState(false);
    const [tempPengajian, setTempPengajian] = useState(0);
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [tempInfo, setTempInfo] = useState('');

    const handleSavePengajian = () => { const newData = { ...pengajianData, saldo: Number(tempPengajian) }; setPengajianData(newData); saveToDatabase('pengajianData', newData); setIsEditingPengajian(false); };
    const handleSaveInfo = () => { const newData = { ...pengajianData, info: tempInfo }; setPengajianData(newData); saveToDatabase('pengajianData', newData); setIsEditingInfo(false); };
    
    return (
      <div className="space-y-4 pb-12">
        <h2 className="text-lg font-bold text-emerald-800">Saldo Pengajian RT 08</h2>
        <div className="bg-emerald-50 p-6 rounded-2xl shadow-sm border border-emerald-100">
          <h3 className="text-xs font-bold text-emerald-600 mb-2 uppercase">Total Saldo</h3>
          {isEditingPengajian && userRole === 'PENGURUS' ? (
             <div className="flex items-center gap-2">
               <input type="number" value={tempPengajian} onChange={e => setTempPengajian(e.target.value)} className="w-full text-lg font-bold p-2 rounded-xl border border-emerald-200 text-emerald-800 focus:outline-none" autoFocus />
               <button onClick={handleSavePengajian} className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-xl"><Save className="w-5 h-5"/></button>
               <button onClick={() => setIsEditingPengajian(false)} className="bg-slate-300 hover:bg-slate-400 text-slate-700 p-2 rounded-xl"><X className="w-5 h-5"/></button>
             </div>
          ) : (
             <div className="text-3xl font-extrabold text-emerald-700 flex items-center justify-between">
               {formatRp(pengajianData.saldo)}
               {userRole === 'PENGURUS' && (
                 <button onClick={() => { setIsEditingPengajian(true); setTempPengajian(pengajianData.saldo); }} className="text-emerald-400 hover:text-emerald-600 p-2 bg-emerald-100 rounded-full"><Edit3 className="w-5 h-5" /></button>
               )}
             </div>
          )}
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
           <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase">Input Informasi Manual</h3>
           {isEditingInfo && userRole === 'PENGURUS' ? (
             <div className="space-y-2">
               <textarea value={tempInfo} onChange={e => setTempInfo(e.target.value)} className="w-full text-sm p-3 rounded-xl border border-slate-200 text-slate-800 focus:outline-none min-h-[100px]" placeholder="Ketik informasi manual di sini..." />
               <div className="flex gap-2">
                 <button onClick={() => setIsEditingInfo(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">Batal</button>
                 <button onClick={handleSaveInfo} className="flex-1 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold flex justify-center items-center gap-2"><Save className="w-4 h-4"/> Simpan</button>
               </div>
             </div>
           ) : (
             <div className="relative">
               <div className="text-sm text-slate-700 whitespace-pre-line min-h-[60px] p-3 bg-slate-50 rounded-xl border border-slate-100">
                  {pengajianData.info || <span className="text-slate-400 italic">Klik ikon pensil untuk tambah informasi...</span>}
               </div>
               {userRole === 'PENGURUS' && (
                 <button onClick={() => { setIsEditingInfo(true); setTempInfo(pengajianData.info || ''); }} className="absolute top-2 right-2 text-slate-400 hover:text-emerald-600 p-1"><Edit3 className="w-4 h-4" /></button>
               )}
             </div>
           )}
        </div>
      </div>
    );
  };

  // --- HALAMAN LAPOR WARGA ---
  const LaporWargaView = () => {
    const [form, setForm] = useState({ nama: '', nomor: '', foto: '', fotoName: '', laporan: '' });

    const handleFile = (e) => {
      const file = e.target.files[0];
      if(file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setForm({...form, foto: reader.result, fotoName: file.name});
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if(!form.nama || !form.nomor) return alert('Nama dan Nomor Rumah wajib diisi!');
      const newLapor = {
         id: Date.now(),
         ...form,
         date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      };
      const updated = [newLapor, ...laporanWarga];
      setLaporanWarga(updated);
      saveLaporanToDatabase(updated); 
      setForm({ nama: '', nomor: '', foto: '', fotoName: '', laporan: '' });
      alert("Laporan berhasil dikirim ke Pengurus RT 08!");
    };

    return (
      <div className="space-y-4 pb-12">
        <h2 className="text-lg font-bold text-red-800">Lapor Warga RT 08</h2>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-bold text-slate-700 mb-3">Buat Laporan Baru</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" placeholder="Nama Pelapor *" required value={form.nama} onChange={e => setForm({...form, nama: e.target.value})} className="w-full border border-slate-200 rounded-lg text-sm p-2.5 focus:ring-red-500" />
            <input type="text" placeholder="Nomor Rumah *" required value={form.nomor} onChange={e => setForm({...form, nomor: e.target.value})} className="w-full border border-slate-200 rounded-lg text-sm p-2.5 focus:ring-red-500" />
            <textarea placeholder="Isi Laporan / Pengaduan..." required value={form.laporan} onChange={e => setForm({...form, laporan: e.target.value})} rows="3" className="w-full border border-slate-200 rounded-lg text-sm p-2.5 focus:ring-red-500" />
            
            <div className="border border-dashed border-slate-300 rounded-lg p-3 text-center relative hover:bg-slate-50 transition">
              <input type="file" accept="image/jpeg, image/png" onChange={handleFile} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              {form.foto ? (
                <div className="flex flex-col items-center gap-1 text-green-600">
                  <img src={form.foto} className="h-20 object-contain rounded" alt="Preview" />
                  <span className="text-xs truncate w-full px-4">{form.fotoName}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1 text-slate-500">
                  <Camera className="w-5 h-5 text-slate-400" />
                  <span className="text-xs font-medium">Upload Foto (Opsional, JPG/PNG)</span>
                </div>
              )}
            </div>
            
            <button type="submit" className="w-full py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold flex justify-center gap-2 hover:bg-red-700">Kirim Laporan</button>
          </form>
        </div>

        <div className="space-y-3">
          <h3 className="font-bold text-slate-700 text-sm mt-4">Riwayat Pengaduan</h3>
          {laporanWarga.length === 0 ? (
             <p className="text-xs text-slate-400 text-center py-4 bg-white rounded-xl border border-slate-100">Belum ada laporan dari warga.</p>
          ) : laporanWarga.map((l) => (
             <div key={l.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 relative">
               {userRole === 'PENGURUS' && (
                 <button onClick={() => {
                   if(window.confirm('Hapus laporan ini?')){
                     const updated = laporanWarga.filter(item => item.id !== l.id);
                     setLaporanWarga(updated);
                     saveLaporanToDatabase(updated);
                   }
                 }} className="absolute top-2 right-2 text-slate-300 hover:text-red-500 bg-slate-50 p-1.5 rounded"><Trash2 className="w-4 h-4"/></button>
               )}
               <div className="text-[10px] text-slate-400 mb-1">{l.date}</div>
               <div className="font-bold text-sm text-slate-800">{l.nama} <span className="font-medium text-slate-500">({l.nomor})</span></div>
               <p className="text-xs text-slate-600 mt-1 whitespace-pre-line">{l.laporan}</p>
               {l.foto && (
                 <img src={l.foto} alt="Lampiran" className="mt-2 rounded-lg max-h-40 object-contain border border-slate-100" />
               )}
             </div>
          ))}
        </div>
      </div>
    );
  };

  // --- HALAMAN DASHBOARD (BERANDA) ---
  const DashboardView = () => {
    const dataBulanIni = laporanData[currentMonthIdx];
    const [isEditingSaldo, setIsEditingSaldo] = useState(false);
    const [tempSaldo, setTempSaldo] = useState(0);
    
    // Edit Rekening Bank State
    const [isEditingBank, setIsEditingBank] = useState(false);
    const [tempBanks, setTempBanks] = useState([]);

    const handleSaveSaldo = () => { const targetSaldo = Number(tempSaldo) || 0; const sumSurplus = dataBulanIni.saldoAkhir - saldoAwalTahun; const newSaldoAwalTahun = targetSaldo - sumSurplus; setSaldoAwalTahun(newSaldoAwalTahun); saveToDatabase('saldoAwalTahun', newSaldoAwalTahun); setIsEditingSaldo(false); };
    const handleCopy = (number, id) => { const textField = document.createElement('textarea'); textField.innerText = number; document.body.appendChild(textField); textField.select(); document.execCommand('copy'); textField.remove(); setCopied(id); setTimeout(() => setCopied(null), 2000); };

    // Handler Rekening Bank
    const startEditBank = () => { setTempBanks([...bankAccounts]); setIsEditingBank(true); };
    const handleAddBank = () => { setTempBanks([...tempBanks, { id: Date.now(), bankName: '', accountNumber: '', accountName: '' }]); };
    const handleRemoveBank = (id) => { setTempBanks(tempBanks.filter(b => b.id !== id)); };
    const handleBankChange = (id, field, value) => { setTempBanks(tempBanks.map(b => b.id === id ? { ...b, [field]: value } : b)); };
    const handleSaveBanks = () => { setBankAccounts(tempBanks); saveToDatabase('bankAccounts', tempBanks); setIsEditingBank(false); };

    return (
      <div className="space-y-4">
        <div className="bg-gradient-to-br from-green-600 to-emerald-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          {userRole === 'WARGA' && <div className="absolute top-0 right-0 bg-white/20 text-[10px] px-3 py-1 rounded-bl-xl font-bold">MODE: HANYA LIHAT</div>}
          <h2 className="text-sm font-medium text-green-100 mb-1">Saldo Akhir Kas RT 08 (Bulan {MONTHS[currentMonthIdx]})</h2>
          {isEditingSaldo && userRole === 'PENGURUS' ? (
            <div className="mb-4 bg-white/10 p-3 rounded-lg border border-green-400/30">
              <label className="text-xs text-green-100 block mb-1">Sesuaikan Saldo Kas Saat Ini (Rp):</label>
              <div className="flex items-center gap-2">
                <input type="number" value={tempSaldo} onChange={e => setTempSaldo(e.target.value)} className="text-slate-800 p-1.5 rounded w-full text-sm font-bold outline-none" autoFocus />
                <button onClick={handleSaveSaldo} className="bg-green-500 hover:bg-green-400 text-white p-1.5 rounded transition"><Save className="w-5 h-5"/></button>
                <button onClick={() => setIsEditingSaldo(false)} className="bg-red-500 hover:bg-red-400 text-white p-1.5 rounded transition"><X className="w-5 h-5"/></button>
              </div>
            </div>
          ) : (
            <div className="text-3xl font-bold mb-4 flex items-center gap-3">
              {formatRp(dataBulanIni.saldoAkhir)}
              {userRole === 'PENGURUS' && (
                <button onClick={() => { setIsEditingSaldo(true); setTempSaldo(dataBulanIni.saldoAkhir); }} className="text-green-200 hover:text-white p-1.5 bg-white/10 rounded-full transition" title="Edit Saldo"><Edit3 className="w-4 h-4" /></button>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 mt-6 border-t border-white/20 pt-4">
            <div>
              <div className="flex items-center text-green-100 text-xs mb-1"><ArrowUpRight className="w-4 h-4 mr-1" /> Pemasukan Bln Ini</div>
              <div className="font-semibold">{formatRp(dataBulanIni.penerimaan.total)}</div>
            </div>
            <div>
              <div className="flex items-center text-red-200 text-xs mb-1"><ArrowDownRight className="w-4 h-4 mr-1" /> Pengeluaran Bln Ini</div>
              <div className="font-semibold">{formatRp(dataBulanIni.totalRutin + dataBulanIni.totalTidakRutin)}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <button onClick={() => setActiveTab('iuran')} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition">
            <div className="bg-blue-100 p-2.5 rounded-full text-blue-600"><Users className="w-5 h-5" /></div>
            <span className="text-[11px] font-semibold text-slate-700">IURAN</span>
          </button>
          <button onClick={() => setActiveTab('kas')} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition">
            <div className="bg-orange-100 p-2.5 rounded-full text-orange-600"><Wallet className="w-5 h-5" /></div>
            <span className="text-[11px] font-semibold text-slate-700">Pengeluaran</span>
          </button>
          <button onClick={() => setActiveTab('thr')} className="bg-yellow-50 p-3 rounded-2xl shadow-sm border border-yellow-200 flex flex-col items-center justify-center gap-2 hover:bg-yellow-100 transition relative overflow-hidden">
            <div className="bg-yellow-100 p-2.5 rounded-full text-yellow-600"><Gift className="w-5 h-5" /></div>
            <span className="text-[11px] font-semibold text-yellow-800 text-center leading-tight">Iuran THR</span>
          </button>
          <button onClick={() => setActiveTab('pengajian')} className="bg-emerald-50 p-3 rounded-2xl shadow-sm border border-emerald-200 flex flex-col items-center justify-center gap-2 hover:bg-emerald-100 transition relative overflow-hidden">
            <div className="bg-emerald-100 p-2.5 rounded-full text-emerald-600"><BookOpen className="w-5 h-5" /></div>
            <span className="text-[11px] font-semibold text-emerald-800 text-center leading-tight uppercase">Pengajian</span>
          </button>
          <button onClick={() => setActiveTab('laporWarga')} className="bg-red-50 p-3 rounded-2xl shadow-sm border border-red-200 flex flex-col items-center justify-center gap-2 col-span-4 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 p-2.5 rounded-full text-red-600"><Megaphone className="w-5 h-5" /></div>
              <span className="text-[12px] font-semibold text-red-800 text-center leading-tight">Lapor Warga</span>
            </div>
          </button>
        </div>

        {/* --- INFO REKENING BANK --- */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 relative">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><CreditCard className="w-4 h-4 text-slate-600" /> Info Rekening & Pembayaran</h3>
            {userRole === 'PENGURUS' && !isEditingBank && (
              <button onClick={startEditBank} className="text-slate-400 hover:text-blue-500 p-1"><Edit3 className="w-4 h-4" /></button>
            )}
          </div>
          
          {isEditingBank ? (
            <div className="space-y-3">
              {tempBanks.map(account => (
                <div key={account.id} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 relative">
                  <button onClick={() => handleRemoveBank(account.id)} className="absolute top-2 right-2 text-slate-400 hover:text-red-500 bg-white rounded p-1 shadow-sm"><Trash2 className="w-4 h-4"/></button>
                  <input type="text" placeholder="Nama Bank (Cth: Mandiri)" value={account.bankName} onChange={e => handleBankChange(account.id, 'bankName', e.target.value)} className="w-full border border-slate-200 rounded-lg text-sm p-2 pr-8 focus:ring-blue-500" />
                  <input type="text" placeholder="Nomor Rekening" value={account.accountNumber} onChange={e => handleBankChange(account.id, 'accountNumber', e.target.value)} className="w-full border border-slate-200 rounded-lg text-sm p-2 focus:ring-blue-500" />
                  <input type="text" placeholder="Atas Nama" value={account.accountName} onChange={e => handleBankChange(account.id, 'accountName', e.target.value)} className="w-full border border-slate-200 rounded-lg text-sm p-2 focus:ring-blue-500" />
                </div>
              ))}
              <button onClick={handleAddBank} className="w-full py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl border border-blue-200 flex items-center justify-center gap-1 hover:bg-blue-100 transition"><PlusCircle className="w-4 h-4"/> Tambah Rekening</button>
              <div className="flex gap-2 pt-2">
                <button onClick={() => setIsEditingBank(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition">Batal</button> 
                <button onClick={handleSaveBanks} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-bold flex justify-center items-center gap-2 hover:bg-green-700 transition"><Save className="w-4 h-4"/> Simpan</button>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-4">
              <div onClick={() => setShowQrisModal(true)} className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-200 shrink-0 cursor-pointer hover:bg-blue-100 transition relative group shadow-sm overflow-hidden mt-1">
                 <img src="/qris.jpeg" alt="QR" className="w-full h-full object-cover p-1 mix-blend-multiply" onError={(e) => e.target.src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=1170011106804'} />
                 <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition flex items-center justify-center"><Search className="w-5 h-5 text-slate-700 bg-white rounded-full p-1 shadow-sm" /></div>
              </div>
              <div className="flex-1 space-y-3">
                {bankAccounts.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">Belum ada data rekening.</p>
                ) : (
                  bankAccounts.map(account => (
                    <div key={account.id} className="space-y-1 border-b border-slate-100 pb-2 last:border-0 last:pb-0">
                      <p className="text-[11px] text-slate-500 font-medium">{account.bankName}</p>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-800 tracking-wider text-sm">{account.accountNumber}</p>
                        <button onClick={() => handleCopy(account.accountNumber, account.id)} className={`p-1.5 rounded-md transition ${copied === account.id ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>{copied === account.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}</button>
                      </div>
                      <p className="text-[10px] text-slate-600 font-bold uppercase mt-0.5">A.N. {account.accountName}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- HALAMAN IURAN WARGA ---
  const IuranView = () => {
    const [rincian, setRincian] = useState({ pokok: 60000, kebersihan: 20000, keamanan: 18000, lsk: 7000, kasRt: 8000, kasRw: 1000, keagamaan: 5000, posyandu: 1000 });
    const [isEditingRincian, setIsEditingRincian] = useState(false);
    
    // State form warga
    const [showWargaForm, setShowWargaForm] = useState(false);
    const [wargaForm, setWargaForm] = useState({ id: null, name: '', block: '', defaultAmount: 62000 });

    useEffect(() => {
      if (!user) return; // FIX PENYIMPANAN
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'appState', 'rincianIuranFinal');
      const unsub = onSnapshot(docRef, (snap) => {
        if(snap.exists()) {
            const data = snap.data();
            setRincian({
                pokok: data.pokok || 60000,
                kebersihan: data.kebersihan || data.sampah || 20000,
                keamanan: data.keamanan || 18000,
                lsk: data.lsk || 7000,
                kasRt: data.kasRt || 8000,
                kasRw: data.kasRw || 1000,
                keagamaan: data.keagamaan || data.sosial || 5000,
                posyandu: data.posyandu || 1000
            });
        }
      }, (err) => console.error(err));
      return () => unsub();
    }, [user]); // FIX: Re-run when auth completes

    const saveRincian = async () => {
      if (!user || userRole !== 'PENGURUS') return; // FIX PENYIMPANAN
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'appState', 'rincianIuranFinal');
      try {
        // FIX ARRAY MERGE BUG: Kita hapus parameter merge: true agar file benar-benar diganti
        await setDoc(docRef, rincian);
      } catch (err) {
        console.error(err);
      }
      setIsEditingRincian(false);
    };

    const togglePaymentGrid = (residentId, m) => { 
      if (userRole !== 'PENGURUS') return; 
      const newResidents = residents.map(r => { 
        if (r.id === residentId) { 
          const newPayments = { ...r.payments }; 
          const yearPayments = { ...(newPayments[selectedYearIuran] || {}) };
          if (Object.values(yearPayments).includes('LUNAS')) { 
            for(let i=0; i<12; i++) yearPayments[i] = r.defaultAmount; 
          } 
          if (yearPayments[m]) delete yearPayments[m]; 
          else yearPayments[m] = r.defaultAmount; 
          newPayments[selectedYearIuran] = yearPayments;
          return { ...r, payments: newPayments }; 
        } 
        return r; 
      }); 
      setResidents(newResidents); 
      saveToDatabase('residents', newResidents); 
    };

    const handleSaveWarga = (e) => {
      e.preventDefault();
      if (userRole !== 'PENGURUS') return;
      let newResidents = [...residents];
      if (wargaForm.id) {
         newResidents = newResidents.map(r => r.id === wargaForm.id ? { ...r, name: wargaForm.name, block: wargaForm.block, defaultAmount: Number(wargaForm.defaultAmount) } : r);
      } else {
         newResidents.push({
            id: Date.now(),
            name: wargaForm.name,
            block: wargaForm.block,
            defaultAmount: Number(wargaForm.defaultAmount),
            payments: {}
         });
      }
      setResidents(newResidents);
      saveToDatabase('residents', newResidents);
      setShowWargaForm(false);
      setWargaForm({ id: null, name: '', block: '', defaultAmount: 62000 });
    };

    const handleDeleteWarga = (id) => {
       if(window.confirm('Hapus data warga ini?')){
          const newResidents = residents.filter(r => r.id !== id);
          setResidents(newResidents);
          saveToDatabase('residents', newResidents);
       }
    };

    const filteredWarga = residents.filter(r => r.name.toLowerCase().includes(searchIuran.toLowerCase()) || r.block.toLowerCase().includes(searchIuran.toLowerCase()) );

    return (
      <div className="h-[75vh] flex flex-col space-y-3">
        <div className="flex items-center justify-between shrink-0 mb-1">
          <div><h2 className="text-lg font-bold text-slate-800">Pencatatan Iuran</h2><p className="text-xs text-slate-500">Pilih tahun riwayat.</p></div>
          <div className="flex items-center gap-2">
            {userRole === 'PENGURUS' && (
              <button onClick={() => { setWargaForm({id: null, name: '', block: '', defaultAmount: 62000}); setShowWargaForm(true); }} className="bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-green-700"><PlusCircle className="w-3.5 h-3.5"/> Warga</button>
            )}
            <select value={selectedYearIuran} onChange={(e) => setSelectedYearIuran(Number(e.target.value))} className="bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg focus:ring-green-500 block p-2 shadow-sm"> {YEARS.map(y => <option key={y} value={y}>Tahun {y}</option>)} </select>
          </div>
        </div>
        
        {showWargaForm && userRole === 'PENGURUS' && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-green-200 shrink-0 mb-1 animate-in fade-in slide-in-from-top-2">
            <h3 className="font-bold text-slate-700 mb-3">{wargaForm.id ? 'Edit Data Warga' : 'Tambah Warga Baru'}</h3>
            <form onSubmit={handleSaveWarga} className="space-y-3">
              <input type="text" placeholder="Nama Warga..." required value={wargaForm.name} onChange={e => setWargaForm({...wargaForm, name: e.target.value.toUpperCase()})} className="w-full border border-slate-200 rounded-lg text-sm p-2" />
              <input type="text" placeholder="Blok / No Rumah..." required value={wargaForm.block} onChange={e => setWargaForm({...wargaForm, block: e.target.value.toUpperCase()})} className="w-full border border-slate-200 rounded-lg text-sm p-2" />
              <input type="number" placeholder="Iuran Pokok per Bulan..." required value={wargaForm.defaultAmount} onChange={e => setWargaForm({...wargaForm, defaultAmount: e.target.value})} className="w-full border border-slate-200 rounded-lg text-sm p-2" />
              <div className="flex gap-2 pt-1"><button type="button" onClick={() => {setShowWargaForm(false); setWargaForm({id:null, name:'', block:'', defaultAmount:62000});}} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">Batal</button> <button type="submit" className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-bold">Simpan Warga</button></div>
            </form>
          </div>
        )}
        
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 shrink-0">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xs font-bold text-blue-800 flex items-center gap-1">
              <Info className="w-4 h-4"/> Rincian Iuran Bulanan (Pokok: Rp {(rincian.pokok || 60000).toLocaleString('id-ID')})
            </h3>
            {userRole === 'PENGURUS' && !isEditingRincian && (
              <button onClick={() => setIsEditingRincian(true)} className="text-blue-500 hover:text-blue-700">
                <Edit3 className="w-3 h-3" />
              </button>
            )}
            {isEditingRincian && (
              <div className="flex gap-2">
                <button onClick={saveRincian} className="bg-blue-500 text-white p-1 rounded"><CheckCircle2 className="w-3 h-3"/></button>
                <button onClick={() => setIsEditingRincian(false)} className="bg-slate-300 text-slate-700 p-1 rounded"><X className="w-3 h-3"/></button>
              </div>
            )}
          </div>
          
          {isEditingRincian ? (
            <div className="grid grid-cols-2 gap-2 text-[10px] text-blue-800">
              <div className="flex items-center justify-between gap-1"><span>Pokok:</span><input type="number" value={rincian.pokok || 60000} onChange={e=>setRincian({...rincian, pokok: Number(e.target.value)})} className="w-16 p-0.5 rounded border focus:outline-none" /></div>
              <div className="flex items-center justify-between gap-1"><span>a. Kebersihan:</span><input type="number" value={rincian.kebersihan || 20000} onChange={e=>setRincian({...rincian, kebersihan: Number(e.target.value)})} className="w-16 p-0.5 rounded border focus:outline-none" /></div>
              <div className="flex items-center justify-between gap-1"><span>b. Keamanan:</span><input type="number" value={rincian.keamanan || 18000} onChange={e=>setRincian({...rincian, keamanan: Number(e.target.value)})} className="w-16 p-0.5 rounded border focus:outline-none" /></div>
              <div className="flex items-center justify-between gap-1"><span>c. LSK:</span><input type="number" value={rincian.lsk || 7000} onChange={e=>setRincian({...rincian, lsk: Number(e.target.value)})} className="w-16 p-0.5 rounded border focus:outline-none" /></div>
              <div className="flex items-center justify-between gap-1"><span>d. Kas Pengurus:</span><input type="number" value={rincian.kasRt || 8000} onChange={e=>setRincian({...rincian, kasRt: Number(e.target.value)})} className="w-16 p-0.5 rounded border focus:outline-none" /></div>
              <div className="flex items-center justify-between gap-1"><span>e. Kas RW:</span><input type="number" value={rincian.kasRw || 1000} onChange={e=>setRincian({...rincian, kasRw: Number(e.target.value)})} className="w-16 p-0.5 rounded border focus:outline-none" /></div>
              <div className="flex items-center justify-between gap-1"><span>f. Keagamaan:</span><input type="number" value={rincian.keagamaan || 5000} onChange={e=>setRincian({...rincian, keagamaan: Number(e.target.value)})} className="w-16 p-0.5 rounded border focus:outline-none" /></div>
              <div className="flex items-center justify-between gap-1"><span>g. Posyandu:</span><input type="number" value={rincian.posyandu || 1000} onChange={e=>setRincian({...rincian, posyandu: Number(e.target.value)})} className="w-16 p-0.5 rounded border focus:outline-none" /></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-blue-700">
              <p>a. Uang Kebersihan: Rp{(rincian.kebersihan || 20000).toLocaleString('id-ID')}</p>
              <p>b. Uang Keamanan: Rp{(rincian.keamanan || 18000).toLocaleString('id-ID')}</p>
              <p>c. LSK: Rp{(rincian.lsk || 7000).toLocaleString('id-ID')}</p>
              <p>d. Kas Pengurus: Rp{(rincian.kasRt || 8000).toLocaleString('id-ID')}</p>
              <p>e. Kas RW: Rp{(rincian.kasRw || 1000).toLocaleString('id-ID')}</p>
              <p>f. Dana Keagamaan: Rp{(rincian.keagamaan || 5000).toLocaleString('id-ID')}</p>
              <p>g. Posyandu: Rp{(rincian.posyandu || 1000).toLocaleString('id-ID')}</p>
            </div>
          )}
        </div>
        
        <div className="relative shrink-0">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Search className="w-4 h-4 text-slate-400" /></div>
          <input type="text" className="bg-white border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-green-500 block w-full pl-10 p-3" placeholder="Cari nama warga atau blok..." value={searchIuran} onChange={(e) => setSearchIuran(e.target.value)} />
        </div>
        <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden">
          <div className="overflow-auto flex-1">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600"><tr><th className="sticky top-0 left-0 bg-slate-100 p-3 z-30 shadow-sm whitespace-nowrap">Nama Warga</th>{MONTHS.map((m, i) => (<th key={i} className="sticky top-0 bg-slate-50 p-3 text-center min-w-[50px] font-semibold z-20 shadow-sm">{m.slice(0,3)}</th>))}</tr></thead>
              <tbody className="divide-y divide-slate-100">{filteredWarga.map((warga) => (
                <tr key={warga.id} className="hover:bg-slate-50 transition">
                  <td className="sticky left-0 bg-white p-3 z-10 shadow-sm flex flex-col whitespace-nowrap border-r border-slate-50">
                    <div className="flex justify-between items-start gap-3">
                      <span className="font-semibold text-slate-800">{warga.name}</span>
                      {userRole === 'PENGURUS' && (
                        <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition">
                          <button onClick={(e) => { e.stopPropagation(); setWargaForm({id: warga.id, name: warga.name, block: warga.block, defaultAmount: warga.defaultAmount}); setShowWargaForm(true); }} className="text-slate-400 hover:text-blue-500 p-0.5"><Edit3 className="w-3.5 h-3.5"/></button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteWarga(warga.id); }} className="text-slate-400 hover:text-red-500 p-0.5"><Trash2 className="w-3.5 h-3.5"/></button>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-0.5">{warga.block} • {formatRp(warga.defaultAmount)}</span>
                  </td>
                  {MONTHS.map((m, i) => { const paymentsYear = warga.payments[selectedYearIuran] || {}; const isPaid = paymentsYear[i] || Object.values(paymentsYear).includes('LUNAS'); return (<td key={i} className={`p-2 text-center border-l border-slate-50 ${userRole === 'PENGURUS' ? 'cursor-pointer hover:bg-slate-100' : 'cursor-default'}`} onClick={() => togglePaymentGrid(warga.id, i)}><div className="flex justify-center items-center h-full">{isPaid ? (<CheckCircle2 className="w-6 h-6 text-green-500 fill-green-100" />) : (<Circle className="w-6 h-6 text-slate-200 hover:text-green-300" />)}</div></td>);})}
                </tr>
              ))}</tbody>
              <tfoot className="bg-green-50 font-semibold relative z-20">
                <tr>
                  <td className="sticky bottom-0 left-0 bg-green-100 p-3 z-30 shadow-sm text-green-800 text-[11px] whitespace-nowrap">Total Terkumpul</td>
                  {MONTHS.map((_, i) => {
                    const totalMth = filteredWarga.reduce((sum, r) => {
                      const paymentsYear = r.payments[selectedYearIuran] || {};
                      const isLunas = Object.values(paymentsYear).includes('LUNAS');
                      const val = isLunas ? r.defaultAmount : (paymentsYear[i] || 0);
                      return sum + val;
                    }, 0);
                    return (
                      <td key={i} className="sticky bottom-0 z-20 bg-green-50 p-2 text-center border-l border-green-100 text-[10px] text-green-700 whitespace-nowrap shadow-sm">
                        {totalMth > 0 ? (totalMth / 1000).toLocaleString('id-ID') + 'K' : '-'}
                      </td>
                    );
                  })}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // --- HALAMAN THR ---
  const ThrView = () => {
    const [editingThrId, setEditingThrId] = useState(null);
    const [tempThrAmount, setTempThrAmount] = useState('');
    const [tempBaseThr, setTempBaseThr] = useState(thrBaseAmount);
    const [isEditingBaseThr, setIsEditingBaseThr] = useState(false);

    const handleSaveBaseThr = () => {
      if (!user || userRole !== 'PENGURUS') return; // FIX PENYIMPANAN
      setThrBaseAmount(tempBaseThr);
      saveToDatabase('thrBaseAmount', tempBaseThr);
      setIsEditingBaseThr(false);
    };

    const saveThr = (residentId) => { 
      if (!user || userRole !== 'PENGURUS') return; // FIX PENYIMPANAN
      const amount = Number(tempThrAmount);
      const newResidents = residents.map(r => { 
        if (r.id === residentId) { 
          const currentThr = r.thrPayments || {}; 
          return { ...r, thrPayments: { ...currentThr, [selectedYearThr]: amount } }; 
        } 
        return r; 
      }); 
      setResidents(newResidents); 
      saveToDatabase('residents', newResidents); 
      setEditingThrId(null);
    };

    const deleteThr = (residentId) => { 
      if (!user || userRole !== 'PENGURUS') return; // FIX PENYIMPANAN
      const newResidents = residents.map(r => { 
        if (r.id === residentId) { 
          const currentThr = { ...r.thrPayments }; 
          delete currentThr[selectedYearThr];
          return { ...r, thrPayments: currentThr }; 
        } 
        return r; 
      }); 
      setResidents(newResidents); 
      saveToDatabase('residents', newResidents); 
      setEditingThrId(null);
    };

    const filteredWarga = residents.filter(r => r.name.toLowerCase().includes(searchThr.toLowerCase()) || r.block.toLowerCase().includes(searchThr.toLowerCase()));
    
    const totalTerkumpul = filteredWarga.reduce((sum, r) => {
      const val = r.thrPayments?.[selectedYearThr];
      return sum + (typeof val === 'number' ? val : (val ? thrBaseAmount : 0));
    }, 0);

    return (
      <div className="h-[75vh] flex flex-col space-y-3">
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-yellow-800">Pencatatan Iuran THR</h2>
            {isEditingBaseThr && userRole === 'PENGURUS' ? (
              <div className="flex items-center gap-2 mt-1">
                <input type="number" autoFocus value={tempBaseThr} onChange={(e) => setTempBaseThr(Number(e.target.value))} className="w-24 p-1 text-xs font-bold text-slate-800 border border-yellow-400 rounded focus:outline-none" />
                <button onClick={handleSaveBaseThr} className="bg-yellow-500 text-white p-1 rounded"><CheckCircle2 className="w-3 h-3"/></button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-yellow-600">Rp {thrBaseAmount.toLocaleString('id-ID')} / Warga</p>
                {userRole === 'PENGURUS' && (
                  <button onClick={() => { setIsEditingBaseThr(true); setTempBaseThr(thrBaseAmount); }} className="text-yellow-500 hover:text-yellow-700">
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div> 
          <select value={selectedYearThr} onChange={(e) => setSelectedYearThr(Number(e.target.value))} className="bg-yellow-50 border border-yellow-300 text-yellow-800 text-sm font-semibold rounded-lg block p-2 shadow-sm"> {YEARS.map(y => <option key={y} value={y}>Tahun {y}</option>)} </select>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl border border-yellow-200 flex justify-between items-center shrink-0"><span className="text-sm font-bold text-yellow-800">Total Terkumpul:</span><span className="text-lg font-extrabold text-yellow-700">{formatRp(totalTerkumpul)}</span></div>
        <div className="relative shrink-0"><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"><Search className="w-4 h-4 text-slate-400" /></div><input type="text" className="bg-white border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-yellow-500 block w-full pl-10 p-3" placeholder="Cari nama warga atau blok..." value={searchThr} onChange={(e) => setSearchThr(e.target.value)} /></div>
        <div className="flex-1 min-h-0 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col relative overflow-hidden">
          <div className="overflow-auto flex-1">
            <div className="divide-y divide-slate-100">
              {filteredWarga.map((warga) => { 
                const thrVal = warga.thrPayments?.[selectedYearThr];
                const isPaid = !!thrVal;
                const paidAmount = typeof thrVal === 'number' ? thrVal : (thrVal ? thrBaseAmount : 0);
                
                return (
                  <div key={warga.id} className={`p-4 flex items-center justify-between transition ${isPaid ? 'bg-yellow-50/30' : 'hover:bg-slate-50'}`}> 
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{warga.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">Blok: {warga.block}</div>
                    </div> 
                    {editingThrId === warga.id && userRole === 'PENGURUS' ? (
                      <div className="flex items-center gap-1">
                        <input type="number" autoFocus value={tempThrAmount} onChange={(e) => setTempThrAmount(e.target.value)} className="w-20 p-1.5 text-xs font-bold text-slate-800 border border-yellow-400 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white" placeholder="Nominal" />
                        <button onClick={() => saveThr(warga.id)} className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded"><Save className="w-4 h-4"/></button>
                        <button onClick={() => deleteThr(warga.id)} className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded"><Trash2 className="w-4 h-4"/></button>
                        <button onClick={() => setEditingThrId(null)} className="bg-slate-300 hover:bg-slate-400 text-slate-700 p-1.5 rounded"><X className="w-4 h-4"/></button>
                      </div>
                    ) : (
                      <div className={`flex items-center gap-3 ${userRole === 'PENGURUS' ? 'cursor-pointer hover:opacity-80' : ''}`} onClick={() => { if (userRole === 'PENGURUS') { setEditingThrId(warga.id); setTempThrAmount(isPaid ? paidAmount : thrBaseAmount); } }}>
                        {isPaid ? (
                          <div className="text-right">
                            <span className="text-[10px] font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded inline-block mb-1">LUNAS</span>
                            <div className="text-xs font-bold text-slate-700">{formatRp(paidAmount)}</div>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">BELUM</span>
                        )} 
                        <div>{isPaid ? (<CheckCircle2 className="w-7 h-7 text-yellow-500 fill-yellow-100" />) : (<Circle className="w-7 h-7 text-slate-300" />)}</div> 
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // --- HALAMAN KAS OPERASIONAL ---
  const KasView = () => {
    const [selectedMth, setSelectedMth] = useState(currentMonthIdx);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [tType, setTType] = useState('out');
    const [tCategory, setTCategory] = useState('Gaji Petugas Keamanan');
    const [tAmount, setTAmount] = useState('');
    const [tDesc, setTDesc] = useState('');
    
    const currentTrans = transactions.filter(t => t.month === selectedMth);
    
    const handleSave = (e) => { 
      e.preventDefault(); 
      if (editingId) { 
        const updatedTransactions = transactions.map(t => t.id === editingId ? { ...t, type: tType, category: tCategory, amount: Number(tAmount), description: tDesc } : t); 
        setTransactions(updatedTransactions); 
        saveToDatabase('transactions', updatedTransactions); 
        setEditingId(null); 
      } else { 
        const today = new Date(); 
        const formattedDate = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }); 
        const newT = { id: Date.now(), date: formattedDate, month: selectedMth, type: tType, category: tCategory, amount: Number(tAmount), description: tDesc }; 
        const newTransactions = [...transactions, newT]; 
        setTransactions(newTransactions); 
        saveToDatabase('transactions', newTransactions); 
      } 
      setShowForm(false); 
      setTAmount(''); 
      setTDesc(''); 
    };
    const deleteTrans = (id) => { const newTransactions = transactions.filter(t => t.id !== id); setTransactions(newTransactions); saveToDatabase('transactions', newTransactions); };
    const categoriesOut = ['Gaji Petugas Keamanan', 'Gaji Petugas Kebersihan', 'Kas RW', 'Iuran Posyandu', 'LSK', 'Admin BANK', 'THR', 'Perbaikan/Perawatan', 'Biaya Rapat/Pertemuan', 'Kegiatan 17 Agustus, Pengajian, dll', 'Dana Sosial', 'Gorol /jasa kebersihan'];
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2"><h2 className="text-lg font-bold text-slate-800">Buku Kas Operasional</h2> <select className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg block p-2" value={selectedMth} onChange={(e) => setSelectedMth(Number(e.target.value))}> {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)} </select></div>
        {!showForm && userRole === 'PENGURUS' && (<button onClick={() => { setShowForm(true); setEditingId(null); setTAmount(''); setTDesc(''); setTType('out'); setTCategory('Gaji Petugas Keamanan'); }} className="w-full bg-slate-800 text-white p-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-slate-700 shadow-sm"><PlusCircle className="w-5 h-5" /> Catat Transaksi Baru</button>)}
        {showForm && userRole === 'PENGURUS' && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-top-2">
            <h3 className="font-bold text-slate-700 mb-4 border-b pb-2">{editingId ? 'Edit Transaksi' : 'Transaksi Baru'}</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setTType('out')} className={`py-2 text-sm font-medium rounded-lg border ${tType==='out' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-white border-slate-200'}`}>Pengeluaran</button>
                <button type="button" onClick={() => setTType('in')} className={`py-2 text-sm font-medium rounded-lg border ${tType==='in' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-white border-slate-200'}`}>Pemasukan Lain</button>
              </div>
              {tType === 'out' ? (<select value={tCategory} onChange={(e) => setTCategory(e.target.value)} className="w-full border-slate-200 rounded-lg text-sm p-3 bg-slate-50">{categoriesOut.map(c => <option key={c} value={c}>{c}</option>)}</select>) : (<input type="text" value={tCategory} onChange={(e) => setTCategory(e.target.value)} placeholder="Kategori Pemasukan" className="w-full border border-slate-200 rounded-lg text-sm p-3" required />)}
              <input type="number" placeholder="Nominal (Rp)" value={tAmount} onChange={(e) => setTAmount(e.target.value)} className="w-full border border-slate-200 rounded-lg text-sm p-3" required />
              <input type="text" placeholder="Keterangan Lengkap (Opsional)" value={tDesc} onChange={(e) => setTDesc(e.target.value)} className="w-full border border-slate-200 rounded-lg text-sm p-3" />
              <div className="flex gap-2 pt-2"><button type="button" onClick={() => { setShowForm(false); setEditingId(null); }} className="flex-1 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium">Batal</button> <button type="submit" className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"><Save className="w-4 h-4"/> Simpan</button></div>
            </form>
          </div>
        )}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 mt-4 overflow-hidden">
          <div className="p-3 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">Riwayat Bulan {MONTHS[selectedMth]}</div>
          <div className="divide-y divide-slate-100">
            {currentTrans.length === 0 ? (<div className="p-6 text-center text-slate-400 text-sm">Belum ada transaksi.</div>) : (
              currentTrans.map((t) => (<div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition"> <div className="flex-1"> <div className="flex items-center gap-2"> {t.type === 'in' ? <ArrowUpRight className="w-4 h-4 text-green-500" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />} <span className="font-semibold text-sm text-slate-800">{t.category}</span> </div> <div className="flex items-center gap-1 mt-1 ml-6 text-xs"> <span className="font-medium text-slate-500">{t.date || '-'}</span> {t.description && <span className="text-slate-400">• {t.description}</span>} </div> </div> <div className="text-right flex items-center gap-4"> <span className={`font-bold text-sm ${t.type === 'in' ? 'text-green-600' : 'text-slate-800'}`}>{t.type === 'out' ? '-' : '+'}{formatRp(t.amount)}</span> {userRole === 'PENGURUS' && (<div className="flex items-center gap-1"><button onClick={() => deleteTrans(t.id)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4" /></button></div>)} </div> </div>))
            )}
          </div>
        </div>
      </div>
    );
  };

  // --- HALAMAN LAPORAN TAHUNAN ---
  const LaporanView = () => {
    return (
      <div className="space-y-4 pb-12">
        <div className="flex items-center justify-between mb-4">
          <div><h2 className="text-lg font-bold text-slate-800">Laporan Kas RT 08</h2><p className="text-xs text-slate-500">Rekap Tahun {selectedYearLaporan} (Geser kanan)</p></div>
          <div className="flex items-center gap-2">
            <select value={selectedYearLaporan} onChange={(e) => setSelectedYearLaporan(Number(e.target.value))} className="bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg block p-2 shadow-sm"> {YEARS.map(y => <option key={y} value={y}>Tahun {y}</option>)} </select>
            <button className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200" title="Cetak Laporan"><Download className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600">
              <thead className="bg-slate-100 text-slate-700 uppercase"><tr><th className="sticky left-0 bg-slate-100 p-3 z-10 shadow-sm whitespace-nowrap min-w-[200px]">KETERANGAN</th>{MONTHS.map((m) => (<th key={m} className="px-3 py-3 border-b border-slate-200 text-right min-w-[90px]">{m}</th>))}</tr></thead>
              <tbody className="whitespace-nowrap">
                <tr className="bg-slate-50 font-bold border-b border-slate-200"><td className="sticky left-0 bg-slate-50 p-2 z-10 shadow-sm">(II) Penerimaan</td><td colSpan={12}></td></tr>
                <tr className="border-b border-slate-100"><td className="sticky left-0 bg-white p-2 pl-6 z-10 shadow-sm">1. Iuran Bulanan Warga</td>{laporanData.map((d, i) => <td key={i} className="px-3 py-2 text-right">{formatRp(d.penerimaan.iuran)}</td>)}</tr>
                <tr className="border-b border-slate-100"><td className="sticky left-0 bg-white p-2 pl-6 z-10 shadow-sm">2. Penerimaan Lain-lain</td>{laporanData.map((d, i) => <td key={i} className="px-3 py-2 text-right">{d.penerimaan.lain > 0 ? formatRp(d.penerimaan.lain) : '-'}</td>)}</tr>
                <tr className="border-b border-slate-200 bg-green-50 font-semibold text-green-800"><td className="sticky left-0 bg-green-50 p-2 text-right pr-4 z-10 shadow-sm">Jumlah (II)</td>{laporanData.map((d, i) => <td key={i} className="px-3 py-2 text-right">{formatRp(d.penerimaan.total)}</td>)}</tr>
                <tr className="bg-slate-50 font-bold border-b border-slate-200"><td className="sticky left-0 bg-slate-50 p-2 z-10 shadow-sm">(III) Pengeluaran Rutin</td><td colSpan={12}></td></tr>
                <tr className="border-b border-slate-100"><td className="sticky left-0 bg-white p-2 pl-6 z-10 shadow-sm">1. Gaji Petugas Keamanan</td>{laporanData.map((d, i) => <td key={i} className="px-3 py-2 text-right">{d.rutin.keamanan > 0 ? formatRp(d.rutin.keamanan) : '-'}</td>)}</tr>
                <tr className="border-b border-slate-100"><td className="sticky left-0 bg-white p-2 pl-6 z-10 shadow-sm">2. Gaji Petugas Kebersihan</td>{laporanData.map((d, i) => <td key={i} className="px-3 py-2 text-right">{d.rutin.kebersihan > 0 ? formatRp(d.rutin.kebersihan) : '-'}</td>)}</tr>
                <tr className="border-b border-slate-100"><td className="sticky left-0 bg-white p-2 pl-6 z-10 shadow-sm">3. Kas RW</td>{laporanData.map((d, i) => <td key={i} className="px-3 py-2 text-right">{d.rutin.kasRW > 0 ? formatRp(d.rutin.kasRW) : '-'}</td>)}</tr>
                <tr className="border-b border-slate-100"><td className="sticky left-0 bg-white p-2 pl-6 z-10 shadow-sm">4. Iuran Posyandu</td>{laporanData.map((d, i) => <td key={i} className="px-3 py-2 text-right">{d.rutin.posyandu > 0 ? formatRp(d.rutin.posyandu) : '-'}</td>)}</tr>
                <tr className="border-b border-slate-100"><td className="sticky left-0 bg-white p-2 pl-6 z-10 shadow-sm">5. LSK</td>{laporanData.map((d, i) => <td key={i} className="px-3 py-2 text-right">{d.rutin.lsk > 0 ? formatRp(d.rutin.lsk) : '-'}</td>)}</tr>
                <tr className="border-b border-slate-100"><td className="sticky left-0 bg-white p-2 pl-6 z-10 shadow-sm">6. Admin BANK</td>{laporanData.map((d, i) => <td key={i} className="px-3 py-2 text-right">{d.rutin.adminBank > 0 ? formatRp(d.rutin.adminBank) : '-'}</td>)}</tr>
                <tr className="border-b border-slate-200 bg-red-50 font-semibold text-red-700"><td className="sticky left-0 bg-red-50 p-2 text-right pr-4 z-10 shadow-sm">Jumlah (III)</td>{laporanData.map((d, i) => <td key={i} className="px-3 py-2 text-right">{formatRp(d.totalRutin)}</td>)}</tr>
                <tr className="bg-slate-50 font-bold border-b border-slate-200"><td className="sticky left-0 bg-slate-50 p-2 z-10 shadow-sm">(IV) Pengeluaran Tidak Rutin</td><td colSpan={12}></td></tr>
                <tr className="border-b border-slate-100"><td className="sticky left-0 bg-white p-2 pl-6 z-10 shadow-sm">1. THR (Keamanan & Kebersihan)</td>{laporanData.map((d, i) => <td key={i} className="px-3 py-2 text-right">{d.tidakRutin.thr > 0 ? formatRp(d.tidakRutin.thr) : '-'}</td>)}</tr>
                <tr className="border-b border-slate-100"><td className="sticky left-0 bg-white p-2 pl-6 z-10 shadow-sm">2. Perbaikan/Perawatan</td>{laporanData.map((d, i) => <td key={i} className="px-3 py-2 text-right">{d.tidakRutin.perbaikan > 0 ? formatRp(d.tidakRutin.perbaikan) : '-'}</td>)}</tr>
                <tr className="border-b border-slate-100"><td className="sticky left-0 bg-white p-2 pl-6 z-10 shadow-sm">3. Biaya Rapat / Pertemuan</td>{laporanData.map((d, i) => <td key={i} className="px-3 py-2 text-right">{d.tidakRutin.rapat > 0 ? formatRp(d.tidakRutin.rapat) : '-'}</td>)}</tr>
                <tr className="border-b border-slate-100"><td className="sticky left-0 bg-white p-2 pl-6 z-10 shadow-sm">4. Kegiatan 17 Ags, Pengajian</td>{laporanData.map((d, i) => <td key={i} className="px-3 py-2 text-right">{d.tidakRutin.kegiatan > 0 ? formatRp(d.tidakRutin.kegiatan) : '-'}</td>)}</tr>
                <tr className="border-b border-slate-100"><td className="sticky left-0 bg-white p-2 pl-6 z-10 shadow-sm">5. Dana Sosial</td>{laporanData.map((d, i) => <td key={i} className="px-3 py-2 text-right">{d.tidakRutin.sosial > 0 ? formatRp(d.tidakRutin.sosial) : '-'}</td>)}</tr>
                <tr className="border-b border-slate-100"><td className="sticky left-0 bg-white p-2 pl-6 z-10 shadow-sm">6. Gorol / Jasa Kebersihan</td>{laporanData.map((d, i) => <td key={i} className="px-3 py-2 text-right">{d.tidakRutin.gorong > 0 ? formatRp(d.tidakRutin.gorong) : '-'}</td>)}</tr>
                <tr className="border-b border-slate-200 bg-orange-50 font-semibold text-orange-700"><td className="sticky left-0 bg-orange-50 p-2 text-right pr-4 z-10 shadow-sm">Jumlah (IV)</td>{laporanData.map((d, i) => <td key={i} className="px-3 py-2 text-right">{d.totalTidakRutin > 0 ? formatRp(d.totalTidakRutin) : '-'}</td>)}</tr>
                <tr className="bg-slate-100 font-bold border-b border-slate-300"><td className="sticky left-0 bg-slate-100 p-3 z-10 shadow-sm uppercase">(V) (Defisit) / Surplus</td>{laporanData.map((d, i) => <td key={i} className={`px-3 py-3 text-right ${d.surplusDefisit < 0 ? 'text-red-600' : 'text-slate-700'}`}>{formatRp(d.surplusDefisit)}</td>)}</tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="pt-4 text-center">
            <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">© 2026 RT 08 - VILLA PERMATA MAS 1</p>
        </div>
      </div>
    );
  };

  // --- HALAMAN INFO & KEGIATAN ---
  const InfoView = () => {
    const [showAset, setShowAset] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [infoData, setInfoData] = useState({ title: '', desc: '', fileName: '', fileData: '', fileType: '' });
    const [showAsetForm, setShowAsetForm] = useState(false);
    const [assetForm, setAssetForm] = useState({ id: null, name: '', count: '' });
    
    const handleSaveInfo = (e) => { 
      e.preventDefault(); 
      const newAgenda = { id: Date.now(), title: infoData.title, desc: infoData.desc, fileName: infoData.fileName, fileData: infoData.fileData, fileType: infoData.fileType, date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) }; 
      const newAgendas = [newAgenda, ...agendas]; 
      setAgendas(newAgendas); 
      saveToDatabase('agendas', newAgendas); 
      setShowForm(false); 
      setInfoData({ title: '', desc: '', fileName: '', fileData: '', fileType: '' }); 
    };
    
    const handleSaveAsset = (e) => { e.preventDefault(); let newAssets = []; if (assetForm.id) { newAssets = assets.map(a => a.id === assetForm.id ? { ...a, name: assetForm.name, count: assetForm.count } : a); } else { newAssets = [...assets, { id: Date.now(), name: assetForm.name, count: assetForm.count }]; } setAssets(newAssets); saveToDatabase('assets', newAssets); setShowAsetForm(false); setAssetForm({ id: null, name: '', count: '' }); };
    const handleDeleteAsset = (id) => { const newAssets = assets.filter(a => a.id !== id); setAssets(newAssets); saveToDatabase('assets', newAssets); };
    
    const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
          setInfoData({ 
            ...infoData, 
            fileName: file.name,
            fileData: reader.result,
            fileType: file.type
          });
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="space-y-6 pb-12">
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-1">Informasi & Kegiatan RT 08</h2>
          {!showForm && userRole === 'PENGURUS' && (<button onClick={() => setShowForm(true)} className="w-full bg-blue-50 text-blue-600 border border-blue-200 p-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm mb-4"><PlusCircle className="w-5 h-5" /> Tulis Informasi Baru</button>)} 
          {showForm && userRole === 'PENGURUS' && (
            <div className="bg-white border border-blue-200 p-4 rounded-xl shadow-sm mb-4 animate-in fade-in slide-in-from-top-2">
              <form onSubmit={handleSaveInfo} className="space-y-3">
                <input type="text" placeholder="Judul..." required value={infoData.title} onChange={(e) => setInfoData({...infoData, title: e.target.value})} className="w-full border border-slate-200 rounded-lg text-sm p-2 focus:ring-blue-500" />
                <textarea placeholder="Keterangan..." required rows="3" value={infoData.desc} onChange={(e) => setInfoData({...infoData, desc: e.target.value})} className="w-full border border-slate-200 rounded-lg text-sm p-2" />
                
                <div className="border border-dashed border-slate-300 rounded-lg p-3 text-center relative hover:bg-slate-50 transition mt-2">
                  <input type="file" accept="image/jpeg, image/png, application/pdf" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  {infoData.fileData ? (
                    <div className="flex flex-col items-center justify-center gap-2 text-green-600">
                      {infoData.fileType?.includes('image') || infoData.fileName.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <img src={infoData.fileData} alt="Preview" className="h-24 object-contain rounded" />
                      ) : (
                        <FileText className="w-8 h-8 text-red-500" />
                      )}
                      <span className="text-xs font-medium truncate w-full px-4">{infoData.fileName}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 text-slate-500"><UploadCloud className="w-5 h-5 text-slate-400" /><span className="text-xs font-medium">Upload JPG / PDF</span></div>
                  )}
                </div>

                <div className="flex gap-2 pt-2"><button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">Batal</button> <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Posting</button></div>
              </form>
            </div>
          )}
          <div className="space-y-3">
            {agendas.map(agenda => (
              <div key={agenda.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-2 relative"> 
                {userRole === 'PENGURUS' && (<button onClick={() => { const newAgendas = agendas.filter(a => a.id !== agenda.id); setAgendas(newAgendas); saveToDatabase('agendas', newAgendas); }} className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>)} 
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded w-fit">{agenda.date}</span> 
                <h4 className="font-bold text-slate-800 pr-12">{agenda.title}</h4> 
                <p className="text-xs text-slate-600 whitespace-pre-line">{agenda.desc}</p> 
                
                {agenda.fileData ? (
                  <div className="mt-2 border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    {agenda.fileType?.includes('image') || agenda.fileName?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <img src={agenda.fileData} alt={agenda.fileName} className="w-full h-auto max-h-64 object-contain" />
                    ) : agenda.fileType?.includes('pdf') || agenda.fileName?.toLowerCase().endsWith('.pdf') ? (
                      <iframe src={agenda.fileData} className="w-full h-64 border-none" title={agenda.fileName} />
                    ) : (
                      <div className="flex items-center gap-2 p-2">
                        <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className="text-xs text-slate-600 font-medium truncate">{agenda.fileName}</span>
                      </div>
                    )}
                  </div>
                ) : agenda.fileName && (
                  <div className="flex items-center gap-2 mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg w-fit max-w-full">
                    {agenda.fileName.toLowerCase().endsWith('.pdf') ? <FileText className="w-4 h-4 text-red-500 shrink-0" /> : <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />}
                    <span className="text-xs text-slate-600 font-medium truncate">{agenda.fileName}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-1 mt-8">Inventaris Warga RT 08</h2>
          <button onClick={() => setShowAset(!showAset)} className="w-full bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center justify-between"> <div className="flex items-center gap-3"><div className="bg-green-100 p-2 rounded-lg"><Box className="w-5 h-5 text-green-600" /></div><span className="font-bold text-slate-700">Folder Aset Warga</span></div> {showAset ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />} </button>
          {showAset && (
            <div className="mt-3">
              {userRole === 'PENGURUS' && !showAsetForm && (<button onClick={() => setShowAsetForm(true)} className="w-full mb-3 bg-green-50 text-green-700 border border-green-200 p-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2"><PlusCircle className="w-4 h-4" /> Tambah Aset</button>)}
              {userRole === 'PENGURUS' && showAsetForm && (
                <div className="bg-white border border-green-200 p-4 rounded-xl shadow-sm mb-3">
                  <form onSubmit={handleSaveAsset} className="space-y-3">
                    <input type="text" placeholder="Nama Barang..." required value={assetForm.name} onChange={(e) => setAssetForm({...assetForm, name: e.target.value})} className="w-full border rounded-lg text-sm p-2" />
                    <input type="text" placeholder="Jumlah..." required value={assetForm.count} onChange={(e) => setAssetForm({...assetForm, count: e.target.value})} className="w-full border rounded-lg text-sm p-2" />
                    <div className="flex gap-2"><button type="button" onClick={() => setShowAsetForm(false)} className="flex-1 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">Batal</button> <button type="submit" className="flex-1 py-1.5 bg-green-600 text-white rounded-lg text-sm font-bold">Simpan</button></div>
                  </form>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3"> {assets.map((item) => (<div key={item.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm text-center flex flex-col justify-center items-center relative"> {userRole === 'PENGURUS' && (<div className="absolute top-1 right-1 flex gap-1"><button onClick={() => { setAssetForm(item); setShowAsetForm(true); }} className="p-1 text-slate-300 hover:text-blue-500"><Edit3 className="w-3.5 h-3.5" /></button><button onClick={() => handleDeleteAsset(item.id)} className="p-1 text-slate-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button></div>)} <div className="font-bold text-slate-700 text-sm mt-2">{item.name}</div> <div className="text-xs text-green-600 font-bold mt-1 bg-green-50 px-2 py-0.5 rounded-full inline-block">{item.count}</div> </div>))} </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex justify-center">
      <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-2xl overflow-hidden flex flex-col">
        {/* BACKGROUND LOGO BLUR LOKAL */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
          <img src="/logo-bogor.png" alt="" className="w-[150%] max-w-none blur-sm" />
        </div>
        
        <div className="bg-white px-6 py-4 shadow-sm z-10 flex items-center justify-between">
          <div className="flex items-center">
            <img src="/logo-bogor.png" alt="Logo Bogor" className="w-10 h-10 object-contain mr-3" onError={(e) => e.target.style.display='none'} />
            <div>
              <h1 className="text-xl font-extrabold text-green-700 tracking-tight">VILLA PERMATA MAS 1</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5 tracking-widest">Sistem Kas RT 08</p>
            </div>
          </div>
          <div className="flex flex-col items-center ml-2 cursor-pointer" onClick={() => setUserRole('GUEST')} title="Logout">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 border border-green-200 shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <span className={`text-[7px] mt-1 font-bold px-1.5 py-0.5 rounded-full border tracking-widest ${userRole === 'PENGURUS' ? 'bg-green-600 text-white border-green-700' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
              {userRole}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 pb-24 z-10">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'iuran' && <IuranView />}
          {activeTab === 'thr' && <ThrView />}
          {activeTab === 'kas' && <KasView />}
          {activeTab === 'laporan' && <LaporanView />}
          {activeTab === 'info' && <InfoView />}
          {activeTab === 'pengajian' && <PengajianView />}
          {activeTab === 'laporWarga' && <LaporWargaView />}
        </div>

        {showQrisModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-xs relative flex flex-col items-center">
              <button onClick={() => setShowQrisModal(false)} className="absolute top-4 right-4 p-1.5 bg-slate-100 text-slate-500 hover:text-slate-800 rounded-full transition z-10"><X className="w-5 h-5" /></button>
              <h3 className="font-extrabold text-blue-800 mb-1 mt-2 text-xl tracking-tight">QRIS PEMBAYARAN</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 text-center">
                A.N. {bankAccounts.length > 0 ? bankAccounts[0].accountName : 'BENDAHARA'}
              </p>
              <div className="w-64 h-64 bg-blue-50 border-2 border-blue-200 rounded-2xl flex items-center justify-center p-2 mb-6 shadow-inner relative overflow-hidden">
                 <img src="/qris.jpeg" alt="QRIS Scan" className="w-full h-full object-contain rounded-xl mix-blend-multiply" onError={(e) => e.target.src=`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${bankAccounts.length > 0 ? bankAccounts[0].accountNumber : '0000000000'}`} />
                 <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 shadow-lg animate-[scan_2s_linear_infinite]"></div>
              </div>
              <p className="text-[11px] text-center text-slate-500 px-4">Scan kode QR di atas untuk pembayaran via m-banking atau e-wallet.</p>
            </div>
          </div>
        )}
        <style>{`@keyframes scan { 0% { top: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }`}</style>
        
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-3 flex justify-between items-center z-20">
          <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center flex-1 gap-1 ${activeTab === 'dashboard' ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'}`}><LayoutDashboard className="w-5 h-5" /><span className="text-[9px] font-medium">Beranda</span></button>
          <button onClick={() => setActiveTab('iuran')} className={`flex flex-col items-center flex-1 gap-1 ${activeTab === 'iuran' ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'}`}><Users className="w-5 h-5" /><span className="text-[9px] font-medium">Iuran</span></button>
          <button onClick={() => setActiveTab('kas')} className={`flex flex-col items-center flex-1 gap-1 ${activeTab === 'kas' ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'}`}><Wallet className="w-5 h-5" /><span className="text-[9px] font-medium">Transaksi</span></button>
          <button onClick={() => setActiveTab('laporan')} className={`flex flex-col items-center flex-1 gap-1 ${activeTab === 'laporan' ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'}`}><FileSpreadsheet className="w-5 h-5" /><span className="text-[9px] font-medium">Laporan</span></button>
          <button onClick={() => setActiveTab('info')} className={`flex flex-col items-center flex-1 gap-1 ${activeTab === 'info' ? 'text-green-600' : 'text-slate-400 hover:text-slate-600'}`}><Info className="w-5 h-5" /><span className="text-[9px] font-medium">Info</span></button>
        </div>
      </div>
    </div>
  );
}