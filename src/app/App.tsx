import { useState, useEffect, useRef } from "react";
import {
  Search, Menu, X, Plus, ShoppingCart, Package,
  Users, BarChart2, ArrowLeft, MoreVertical, Eye, Edit, Trash2, Download,
  CheckCircle, Bell, Truck, DollarSign, TrendingUp,
  Minus, Check, Phone, MapPin, FileText, User, LogOut,
  Tag, Gift, Store, ClipboardList, AlertCircle, ChevronDown,
  Receipt, ArrowLeftRight, RotateCcw, Hash, Layers,
  Banknote, Smartphone, BookCheck, CreditCard, Archive
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { CartItem, Customer, Order, PaymentRecord, Product, Trader } from "./components/models";
import { AppMode, PaymentMethod, Screen } from "./components/types";
import { api, fmt } from "./components/utility";
import { PhoneFrame, StatusBar } from "./components/pages/phone-frame";
import { ManageInventoryScreen } from "./components/pages/manage-inventory";
import { AddProductScreen } from "./components/pages/add-product";
import { SplashScreen } from "./components/pages/splash-screen";
import { LoginScreen } from "./components/pages/login";
import { BusinessSelectScreen } from "./components/pages/business-selection";

// ======================== TYPES ========================

// type Screen =
//   | "splash" | "login" | "register" | "business-select"
//   | "manage-customers" | "add-customer" | "edit-customer" | "view-customer"
//   | "manage-inventory" | "add-product" | "restock-goods" | "view-inventory"
//   | "home" | "profile-dashboard" | "sales-report"
//   | "orders-list" | "view-order" | "edit-order" | "add-order" | "cart" | "order-confirm"
//   | "transactions";

// type AppMode = "wholesale" | "retail";
// type PaymentStatus = "paid" | "unpaid" | "partial";
// type PaymentMethod = "cash" | "gpay" | "check";
// type Metric = "piece" | "box" | "kg" | "litre" | "packet";

// interface Product {
//   id: string;
//   traderId: string | null;
//   company: string;
//   name: string;
//   sku: string;
//   category: string;
//   description: string;
//   metric: Metric;
//   unitsPerBox?: number;
//   landingPrice: number;
//   mrp: number;
//   stock: number;
// }
// interface Customer {
//   id: string; shopName: string; customerName: string;
//   gst: string; address: string; mobile: string;
// }
// interface CartItem { product: Product; quantity: number; price: number; }
// interface Order {
//   id: string;
//   mode: AppMode;
//   traderId?: string;
//   customerId: string; customerName: string; shopName: string;
//   status: "pending" | "packed" | "delivered";
//   items: CartItem[]; total: number; date: string;
// }
// interface PaymentRecord {
//   status: PaymentStatus;
//   paymentMethod?: PaymentMethod;
//   amountPaid: number;
//   isCredit?: boolean;
// }

// interface Trader{
//   id:string,
//   name:string,
//   company:string
// }

// ======================== MOCK DATA ========================

const TRADER_ACCOUNTS = [
  { id: "t1", name: "Nestlé India Ltd.", company: "FMCG" },
  { id: "t2", name: "ITC Distributor", company: "Tobacco & FMCG" },
  { id: "t3", name: "HUL Wholesale", company: "Home & Personal Care" },
  { id: "t4", name: "Britannia Foods", company: "Biscuits & Bakery" },
];

const INITIAL_PRODUCTS: Product[] = [
  { id: "p1", traderId: "t1", company: "Nestlé India", name: "Maggi Noodles 70g", sku: "NES-MAG-70", category: "Instant Food", description: "Classic masala flavour instant noodles", metric: "packet", landingPrice: 11, mrp: 14, stock: 480 },
  { id: "p2", traderId: "t1", company: "Nestlé India", name: "KitKat 4 Finger 40g", sku: "NES-KIT-40", category: "Chocolates", description: "Crispy wafer chocolate bar", metric: "piece", landingPrice: 24, mrp: 30, stock: 240 },
  { id: "p3", traderId: "t1", company: "Nestlé India", name: "Munch 21g", sku: "NES-MUN-21", category: "Chocolates", description: "Crunchy choco bar", metric: "piece", landingPrice: 8, mrp: 10, stock: 600 },
  { id: "p4", traderId: "t1", company: "Nestlé India", name: "Milkmaid 400g", sku: "NES-MLK-400", category: "Dairy", description: "Sweetened condensed milk", metric: "piece", landingPrice: 78, mrp: 95, stock: 96 },
  { id: "p5", traderId: "t1", company: "Nestlé India", name: "Nescafé Classic 50g", sku: "NES-CAF-50", category: "Beverages", description: "Premium instant coffee", metric: "piece", landingPrice: 98, mrp: 120, stock: 72 },
  { id: "p6", traderId: "t1", company: "Nestlé India", name: "Nestea Iced Tea 1L", sku: "NES-TEA-1L", category: "Beverages", description: "Refreshing iced tea", metric: "packet", landingPrice: 36, mrp: 45, stock: 144 },
  { id: "p7", traderId: "t4", company: "Britannia", name: "Good Day Butter 150g", sku: "BRI-GDB-150", category: "Biscuits", description: "Rich butter cookies", metric: "packet", landingPrice: 24, mrp: 30, stock: 360 },
  { id: "p8", traderId: "t4", company: "Britannia", name: "Hide & Seek Bourbon 100g", sku: "BRI-HSB-100", category: "Biscuits", description: "Chocolate cream sandwich biscuits", metric: "packet", landingPrice: 19, mrp: 25, stock: 420 },
  { id: "p9", traderId: "t3", company: "HUL", name: "Rin Detergent 1kg", sku: "HUL-RIN-1K", category: "Laundry", description: "Power whitening detergent powder", metric: "kg", landingPrice: 68, mrp: 85, stock: 180 },
  { id: "p10", traderId: "t3", company: "HUL", name: "Surf Excel Easy Wash 1kg", sku: "HUL-SXL-1K", category: "Laundry", description: "Powerful stain removal", metric: "kg", landingPrice: 88, mrp: 110, stock: 130 },
  { id: "p11", traderId: "t3", company: "HUL", name: "Lux Soap 150g", sku: "HUL-LUX-150", category: "Personal Care", description: "Skin nourishing beauty soap", metric: "piece", landingPrice: 32, mrp: 40, stock: 300 },
  { id: "p12", traderId: "t3", company: "HUL", name: "Dove Shampoo 180ml", sku: "HUL-DOV-180", category: "Personal Care", description: "Moisturising shampoo", metric: "piece", landingPrice: 150, mrp: 185, stock: 88 },
  { id: "p13", traderId: null, company: "Generic", name: "Tata Salt 1kg", sku: "RET-SAL-1K", category: "Grocery", description: "Iodised table salt", metric: "kg", landingPrice: 20, mrp: 24, stock: 500 },
  { id: "p14", traderId: null, company: "Generic", name: "Fortune Sunflower Oil 1L", sku: "RET-OIL-1L", category: "Grocery", description: "Refined sunflower oil", metric: "litre", landingPrice: 110, mrp: 130, stock: 200 },
];

const INITIAL_CUSTOMERS: Customer[] = [
  { id: "c1", shopName: "Sri Lakshmi Provisions", customerName: "Ramesh Kumar", gst: "33AABCU9603R1ZX", address: "12, Gandhi St, Chennai - 600001", mobile: "9876543210" },
  { id: "c2", shopName: "Anand General Stores", customerName: "Anand Patel", gst: "24BBBCS0124R2ZX", address: "45, MG Road, Ahmedabad - 380001", mobile: "9845678901" },
  { id: "c3", shopName: "Meenakshi Supermart", customerName: "Vijay Sharma", gst: "29DDDCS0124R3ZX", address: "78, Brigade Rd, Bengaluru - 560001", mobile: "9823456789" },
  { id: "c4", shopName: "Kumar Brothers", customerName: "Suresh Kumar", gst: "06CCCCS0124R4ZX", address: "23, Nehru Nagar, Delhi - 110001", mobile: "9812345678" },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-001", mode: "wholesale", traderId: "t1",
    customerId: "c1", customerName: "Ramesh Kumar", shopName: "Sri Lakshmi Provisions",
    status: "delivered",
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 50, price: 14 },
      { product: INITIAL_PRODUCTS[6], quantity: 30, price: 30 },
    ],
    total: 1600, date: "2024-01-15",
  },
  {
    id: "ORD-002", mode: "wholesale", traderId: "t1",
    customerId: "c2", customerName: "Anand Patel", shopName: "Anand General Stores",
    status: "packed",
    items: [
      { product: INITIAL_PRODUCTS[4], quantity: 24, price: 120 },
      { product: INITIAL_PRODUCTS[10], quantity: 48, price: 40 },
    ],
    total: 4800, date: "2024-01-18",
  },
  {
    id: "ORD-003", mode: "wholesale", traderId: "t1",
    customerId: "c3", customerName: "Vijay Sharma", shopName: "Meenakshi Supermart",
    status: "delivered",
    items: [
      { product: INITIAL_PRODUCTS[8], quantity: 20, price: 85 },
      { product: INITIAL_PRODUCTS[9], quantity: 20, price: 110 },
    ],
    total: 3900, date: "2024-01-20",
  },
];

const INITIAL_PAYMENTS: Record<string, PaymentRecord> = {
  "ORD-001": { status: "partial", amountPaid: 1000 },
  "ORD-003": { status: "unpaid", amountPaid: 0 },
};

const SCHEMES = [
  { id: 1, title: "Nestlé Festive Offer", desc: "Buy 100 pkts Maggi, get 10 free", gradient: "from-[#1B4FD8] to-[#1e40af]", tag: "Limited" },
  { id: 2, title: "Summer Beverage Deal", desc: "15% off on all Nescafé products", gradient: "from-[#F59E0B] to-[#d97706]", tag: "Hot Deal" },
  { id: 3, title: "Bulk Purchase Bonus", desc: "Extra 2% margin on orders above ₹50k", gradient: "from-emerald-600 to-teal-700", tag: "Premium" },
];

const CATEGORIES = ["All", "Instant Food", "Chocolates", "Dairy", "Beverages", "Biscuits", "Laundry", "Personal Care", "Grocery"];
const SALES_DATA = [
  { month: "Aug", sales: 820000 }, { month: "Sep", sales: 950000 },
  { month: "Oct", sales: 1100000 }, { month: "Nov", sales: 890000 },
  { month: "Dec", sales: 1350000 }, { month: "Jan", sales: 1260000 },
];
const CATEGORY_DATA = [
  { name: "FMCG", value: 35 }, { name: "Beverages", value: 22 },
  { name: "Biscuits", value: 18 }, { name: "Dairy", value: 15 }, { name: "Others", value: 10 },
];
const PIE_COLORS = ["#1B4FD8", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"];

// ======================== UTILITIES ========================

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// async function api<T>(path: string, options?: RequestInit): Promise<T> {
//   const response = await fetch(`${API_BASE}${path}`, {
//     headers: { "Content-Type": "application/json" },
//     ...options,
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error(errorText || `Request failed with status ${response.status}`);
//   }

//   if (response.status === 204) {
//     return undefined as T;
//   }

//   return response.json() as Promise<T>;
// }

// function fmt(n: number) {
//   return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
// }

function StatusBadge({ status }: { status: Order["status"] }) {
  const cfg = {
    pending: { label: "Pending", cls: "bg-amber-100 text-amber-700" },
    packed: { label: "Packed", cls: "bg-blue-100 text-blue-700" },
    delivered: { label: "Delivered", cls: "bg-emerald-100 text-emerald-700" },
  }[status];
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.cls}`}>{cfg.label}</span>;
}

function PaymentBadge({ rec, total }: { rec?: PaymentRecord; total: number }) {
  if (!rec || rec.status === "unpaid") return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Unpaid</span>;
  if (rec.status === "paid") return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Paid</span>;
  const bal = total - rec.amountPaid;
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">Partial · ₹{bal} due</span>;
}

// ======================== PHONE FRAME ========================

// function PhoneFrame({ children }: { children: React.ReactNode }) {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-gray-950 flex items-center justify-center p-4"
//          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
//       <div className="relative rounded-[3rem] overflow-hidden"
//            style={{ width: 390, height: 844, boxShadow: "0 0 0 1px #444,0 50px 100px rgba(0,0,0,.7),inset 0 0 0 2px #222", background: "#0a0a0a" }}>
//         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-b-[20px] z-50" />
//         <div className="absolute inset-0 rounded-[3rem] overflow-hidden bg-[#F0F4FF]">{children}</div>
//         <div className="absolute left-[-3px] top-32 w-[3px] h-9 bg-gray-600 rounded-l-sm" />
//         <div className="absolute left-[-3px] top-44 w-[3px] h-12 bg-gray-600 rounded-l-sm" />
//         <div className="absolute right-[-3px] top-40 w-[3px] h-16 bg-gray-600 rounded-r-sm" />
//       </div>
//     </div>
//   );
// }

// function StatusBar({ light = false }: { light?: boolean }) {
//   return (
//     <div className={`flex justify-between items-center px-6 pt-11 pb-1 text-[11px] font-semibold ${light ? "text-white/80" : "text-gray-600"}`}>
//       <span>9:41</span>
//       <div className="flex gap-1.5 items-center">
//         <svg className="w-3.5 h-2.5" viewBox="0 0 16 12" fill="currentColor">
//           <rect x="0" y="5" width="3" height="7" rx="0.5" /><rect x="4.5" y="3" width="3" height="9" rx="0.5" />
//           <rect x="9" y="1" width="3" height="11" rx="0.5" /><rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.3" />
//         </svg>
//         <svg className="w-3.5 h-2.5" viewBox="0 0 16 12" fill="currentColor">
//           <path d="M8 1.5C5.2 1.5 2.8 2.8 1.2 4.8L0 3.4C2 1.3 4.9 0 8 0s6 1.3 8 3.4L14.8 4.8C13.2 2.8 10.8 1.5 8 1.5z" />
//           <path d="M8 5c-1.7 0-3.2.9-4.1 2.2L2.4 5.8C3.9 3.9 5.8 2.8 8 2.8s4.1 1.1 5.6 3L12.1 7.2C11.2 5.9 9.7 5 8 5z" />
//           <circle cx="8" cy="10" r="2" />
//         </svg>
//         <div className="w-6 h-3 rounded-[3px] border border-current relative">
//           <div className="absolute left-0.5 top-0.5 bottom-0.5 w-[16px] bg-current rounded-[2px]" />
//         </div>
//       </div>
//     </div>
//   );
// }

// // ======================== SPLASH ========================

// function SplashScreen({ onComplete }: { onComplete: () => void }) {
//   useEffect(() => { const t = setTimeout(onComplete, 2400); return () => clearTimeout(t); }, [onComplete]);
//   return (
//     <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-[#1B4FD8] to-[#0f2d8a] relative overflow-hidden">
//       <div className="absolute w-64 h-64 rounded-full border border-white/5" />
//       <div className="absolute w-96 h-96 rounded-full border border-white/5" />
//       <div className="flex flex-col items-center gap-5">
//         <div className="w-24 h-24 bg-white rounded-[28px] flex items-center justify-center" style={{ boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
//           <Store size={46} className="text-[#1B4FD8]" strokeWidth={1.5} />
//         </div>
//         <div className="text-center">
//           <h1 className="text-3xl font-extrabold text-white tracking-tight">TradeHub</h1>
//           <p className="text-blue-200/80 text-sm mt-1 font-medium">Wholesale & Retail Management</p>
//         </div>
//       </div>
//       <div className="absolute bottom-20 flex flex-col items-center gap-3">
//         <div className="w-7 h-7 rounded-full border-[3px] border-white/25 border-t-white animate-spin" />
//         <p className="text-white/40 text-xs font-medium">Loading...</p>
//       </div>
//     </div>
//   );
// }

// // ======================== LOGIN ========================

// function LoginScreen({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
//   const [u, setU] = useState("");
//   const [p, setP] = useState("");
//   const [err, setErr] = useState("");

//   async function handleLogin()
//   {
//     try{
//       console.log({username:u,password:p});
      
//         const res = await api<{token:string}>('/log-in',
//           {
//             method:'POST',
//             body:JSON.stringify({username:u,password:p})
//           }
//         );
//         console.log(res);
//         localStorage.setItem('token',res.token);
//         console.log(localStorage.getItem('token'));
//         onLogin();
//     }
    
//     catch(error:any)
//     {
//       setErr(error.message);
//     }
//   }

//   return (
//     <div className="flex flex-col h-full bg-[#F0F4FF]">
//       <div className="bg-gradient-to-b from-[#1B4FD8] to-[#2258e0] px-6 flex flex-col items-center">
//         <StatusBar light />
//         <div className="flex flex-col items-center gap-3 pb-10 pt-5">
//           <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
//             <Store size={30} className="text-[#1B4FD8]" strokeWidth={1.5} />
//           </div>
//           <div className="text-center">
//             <h1 className="text-2xl font-extrabold text-white">TradeHub</h1>
//             <p className="text-blue-200/70 text-xs font-medium">Wholesale & Retail Management</p>
//           </div>
//         </div>
//       </div>
//       <div className="flex-1 -mt-6 bg-white rounded-t-3xl px-6 pt-7 pb-6 flex flex-col gap-5 overflow-y-auto">
//         <div>
//           <h2 className="text-xl font-extrabold text-gray-800">Welcome back</h2>
//           <p className="text-gray-400 text-sm mt-0.5">Sign in to your account</p>
//         </div>
//         {err && <div className="flex items-center gap-2 bg-red-50 text-red-600 text-xs px-3 py-2.5 rounded-xl font-medium"><AlertCircle size={13} />{err}</div>}
//         {[{ label: "Username", val: u, set: setU, type: "text", ph: "Enter your username" },
//           { label: "Password", val: p, set: setP, type: "password", ph: "Enter your password" }].map(f => (
//           <div key={f.label}>
//             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">{f.label}</label>
//             <input type={f.type} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20" placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} />
//           </div>
//         ))}
//         <button onClick={() => { if (!u || !p) { setErr("Please fill in all fields"); return; } handleLogin(); }}
//           className="w-full bg-[#1B4FD8] text-white rounded-2xl py-3.5 font-bold text-sm" style={{ boxShadow: "0 8px 24px rgba(27,79,216,.35)" }}>
//           Sign In
//         </button>
//         <div className="text-center">
//           <span className="text-sm text-gray-400">New here? </span>
//           <button onClick={onRegister} className="text-sm text-[#1B4FD8] font-bold">Create account</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ======================== REGISTER ========================

// function RegisterScreen({ onBack, onRegister }: { onBack: () => void; onRegister: () => void }) {
//   const [form, setForm] = useState({ name: "", password: "", confirm: "" });
//   const [err, setErr] = useState("");
//   const [msg,setMsg] = useState("");

//   async function handleRegister()
//   {
//     try{
//       console.log(form);
      
//       const res = await api<{success:string,message:string}>('/register/new-user',
//       {
//         method:'POST',
//         body:JSON.stringify({username:form.name,password:form.password})
//       }
//     );
//     if(res.success)
//     {
//       console.log(res);
//       setMsg(res.message);
//       onRegister();
//     }
//   }
//   catch(error:any)
//   {
//     setErr(error);
//   }
//   }

//   return (
//     <div className="flex flex-col h-full bg-[#F0F4FF]">
//       <StatusBar />
//       <div className="flex items-center gap-3 px-4 py-3">
//         <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm"><ArrowLeft size={17} className="text-gray-700" /></button>
//         <h1 className="text-lg font-extrabold text-gray-800">Create Account</h1>
//       </div>
//       <div className="flex-1 overflow-y-auto px-6 py-2 flex flex-col gap-5">
//         <div className="flex flex-col items-center gap-2 py-4">
//           <div className="w-20 h-20 bg-[#1B4FD8]/10 rounded-full flex items-center justify-center"><User size={36} className="text-[#1B4FD8]" /></div>
//           <p className="text-sm text-gray-400 font-medium">Join TradeHub today</p>
//         </div>
//         {err && <div className="flex items-center gap-2 bg-red-50 text-red-600 text-xs px-3 py-2.5 rounded-xl font-medium"><AlertCircle size={13} />{err}</div>}
//         {[{ label: "Full Name", key: "name", ph: "e.g. Rajesh Kumar", type: "text" },
//           { label: "Password", key: "password", ph: "Create a strong password", type: "password" },
//           { label: "Confirm Password", key: "confirm", ph: "Re-enter your password", type: "password" }].map(f => (
//           <div key={f.key}>
//             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">{f.label}</label>
//             <input type={f.type} className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20"
//               placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
//           </div>
//         ))}
//         <button onClick={() => {
//           if (!form.name || !form.password || !form.confirm) { setErr("All fields are required"); return; }
//           if (form.password !== form.confirm) { setErr("Passwords do not match"); return; }
//           handleRegister();
//         }} className="w-full bg-[#1B4FD8] text-white rounded-2xl py-3.5 font-bold text-sm" style={{ boxShadow: "0 8px 24px rgba(27,79,216,.35)" }}>
//           Create Account
//         </button>
//         <div className="text-center pb-4">
//           <span className="text-sm text-gray-400">Already have an account? </span>
//           <button onClick={onBack} className="text-sm text-[#1B4FD8] font-bold">Sign In</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ======================== BUSINESS SELECT ========================

// function BusinessSelectScreen({ onWholesale, onRetail, onManageCustomers, onManageInventory }: {
//   onWholesale: (id: string) => void; onRetail: () => void;
//   onManageCustomers: () => void; onManageInventory: () => void;
// }) {
//   const [selectedTrader, setSelectedTrader] = useState("");
//   const [dropdown, setDropdown] = useState(false);
//   return (
//     <div className="flex flex-col h-full bg-[#F0F4FF]">
//       <StatusBar />
//       <div className="px-5 py-3 flex justify-between items-center">
//         <div>
//           <h1 className="text-lg font-extrabold text-gray-800">Select Business</h1>
//           <p className="text-gray-400 text-xs font-medium">Choose your mode to continue</p>
//         </div>
//         <div className="w-10 h-10 bg-[#1B4FD8] rounded-full flex items-center justify-center"><User size={17} className="text-white" /></div>
//       </div>
//       <div className="flex-1 overflow-y-auto px-5 py-1 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
//         {/* Wholesale */}
//         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="bg-gradient-to-br from-[#1B4FD8] to-[#1e40af] p-5">
//             <div className="flex items-center gap-3">
//               <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center"><Truck size={22} className="text-white" strokeWidth={1.5} /></div>
//               <div><h2 className="text-white font-extrabold text-base">Wholesale</h2><p className="text-blue-200/80 text-xs font-medium">Dealer & Distributor Management</p></div>
//             </div>
//           </div>
//           <div className="p-4 flex flex-col gap-3">
//             <div>
//               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Trader Account</label>
//               <div className="relative">
//                 <button onClick={() => setDropdown(!dropdown)} className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm">
//                   <span className={selectedTrader ? "text-gray-800 font-semibold" : "text-gray-400"}>
//                     {selectedTrader ? TRADER_ACCOUNTS.find(t => t.id === selectedTrader)?.name : "Choose trader account..."}
//                   </span>
//                   <ChevronDown size={15} className={`text-gray-400 transition-transform ${dropdown ? "rotate-180" : ""}`} />
//                 </button>
//                 {dropdown && (
//                   <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-2xl z-30 overflow-hidden">
//                     {TRADER_ACCOUNTS.map(t => (
//                       <button key={t.id} onClick={() => { setSelectedTrader(t.id); setDropdown(false); }}
//                         className={`w-full flex flex-col items-start px-4 py-3 border-b border-gray-50 last:border-0 ${selectedTrader === t.id ? "bg-[#1B4FD8]/5" : "hover:bg-gray-50"}`}>
//                         <span className="text-sm font-bold text-gray-800">{t.name}</span>
//                         <span className="text-xs text-gray-400">{t.company}</span>
//                       </button>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//             <button onClick={() => selectedTrader && onWholesale(selectedTrader)}
//               className={`w-full py-3 rounded-xl text-sm font-bold ${selectedTrader ? "bg-[#1B4FD8] text-white" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
//               style={selectedTrader ? { boxShadow: "0 6px 20px rgba(27,79,216,.3)" } : {}}>
//               Enter Trader Account
//             </button>
//             <button onClick={onManageCustomers} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-[#1B4FD8]/20 text-[#1B4FD8] text-sm font-bold">
//               <Users size={14} />Manage Customers
//             </button>
//           </div>
//         </div>
//         {/* Retail */}
//         <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="bg-gradient-to-br from-[#F59E0B] to-[#d97706] p-5">
//             <div className="flex items-center gap-3">
//               <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center"><Store size={22} className="text-white" strokeWidth={1.5} /></div>
//               <div><h2 className="text-white font-extrabold text-base">Retail</h2><p className="text-amber-100/80 text-xs font-medium">Direct Consumer Sales</p></div>
//             </div>
//           </div>
//           <div className="p-4">
//             <p className="text-gray-400 text-sm mb-3 font-medium">All products at retail prices for direct walk-in customers.</p>
//             <button onClick={onRetail} className="w-full bg-[#F59E0B] text-white py-3 rounded-xl text-sm font-bold" style={{ boxShadow: "0 6px 20px rgba(245,158,11,.3)" }}>Enter Retail Mode</button>
//           </div>
//         </div>
//         {/* Manage Inventory */}
//         <button onClick={onManageInventory} className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100">
//           <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "rgba(27,79,216,.08)" }}><Archive size={20} className="text-[#1B4FD8]" /></div>
//           <div className="flex-1 text-left"><p className="text-sm font-extrabold text-gray-800">Manage Inventory</p><p className="text-xs text-gray-400 font-medium">Add products, restock & view stock</p></div>
//           <ChevronDown size={15} className="text-gray-300 -rotate-90" />
//         </button>
//       </div>
//     </div>
//   );
// }

// ======================== MANAGE INVENTORY HUB ========================

// function ManageInventoryScreen({ onBack, onAdd, onRestock, onView }: {
//   onBack: () => void; onAdd: () => void; onRestock: () => void; onView: () => void;
// }) {
//   const options = [
//     { label: "Add Product", desc: "Add a new product to the shared pool", icon: <Plus size={22} className="text-[#1B4FD8]" />, bg: "rgba(27,79,216,.08)", action: onAdd },
//     { label: "Restock Goods", desc: "Add stock to existing products", icon: <RotateCcw size={22} className="text-emerald-600" />, bg: "rgba(16,185,129,.08)", action: onRestock },
//     { label: "View Inventory", desc: "Browse and manage all stock", icon: <Archive size={22} className="text-[#F59E0B]" />, bg: "rgba(245,158,11,.08)", action: onView },
//   ];
//   return (
//     <div className="flex flex-col h-full bg-[#F0F4FF]">
//       <StatusBar />
//       <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
//         <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
//         <h1 className="text-base font-extrabold text-gray-800">Manage Inventory</h1>
//       </div>
//       <div className="flex-1 px-5 py-5 flex flex-col gap-4">
//         <div className="bg-[#1B4FD8] rounded-2xl p-5 mb-1" style={{ boxShadow: "0 12px 32px rgba(27,79,216,.25)" }}>
//           <p className="text-blue-200/70 text-[10px] font-bold uppercase tracking-widest mb-1">Shared Pool</p>
//           <p className="text-white font-extrabold text-base leading-snug">Centralized inventory for all wholesale & retail</p>
//           <div className="flex gap-5 mt-3">
//             <div><p className="text-white font-extrabold text-lg">14</p><p className="text-blue-200/70 text-xs font-medium">Products</p></div>
//             <div className="w-px bg-white/15" />
//             <div><p className="text-white font-extrabold text-lg">4</p><p className="text-blue-200/70 text-xs font-medium">Traders</p></div>
//             <div className="w-px bg-white/15" />
//             <div><p className="text-white font-extrabold text-lg">3,608</p><p className="text-blue-200/70 text-xs font-medium">Units</p></div>
//           </div>
//         </div>
//         {options.map(o => (
//           <button key={o.label} onClick={o.action} className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100 w-full text-left">
//             <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center" style={{ background: o.bg }}>{o.icon}</div>
//             <div className="flex-1"><p className="text-sm font-extrabold text-gray-800">{o.label}</p><p className="text-xs text-gray-400 font-medium mt-0.5">{o.desc}</p></div>
//             <ChevronDown size={15} className="text-gray-300 -rotate-90" />
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

// ======================== ADD PRODUCT ========================

// const METRIC_OPTIONS: { value: Metric; label: string }[] = [
//   { value: "piece", label: "Piece" }, { value: "box", label: "Box" },
//   { value: "kg", label: "Kg" }, { value: "litre", label: "Litre" }, { value: "packet", label: "Packet" },
// ];

// function AddProductScreen({ onBack, onSave }: { onBack: () => void; onSave: (p: Omit<Product, "id">) => void }) {
//   const [form, setForm] = useState({ traderId: "" as string | null, company: "", name: "", sku: "", category: "", description: "", metric: "piece" as Metric, unitsPerBox: "", landingPrice: "", mrp: "", stock: "" });
//   const [traderDrop, setTraderDrop] = useState(false);
//   const traderLabel = form.traderId === null ? "Retail (All)" : form.traderId ? TRADER_ACCOUNTS.find(t => t.id === form.traderId)?.name || "" : "";

//   function handleSave() {
//     if (!form.name || !form.sku || !form.mrp || !form.stock) return;
//     onSave({ traderId: form.traderId, company: form.company, name: form.name, sku: form.sku, category: form.category, description: form.description, metric: form.metric, unitsPerBox: form.metric === "box" && form.unitsPerBox ? Number(form.unitsPerBox) : undefined, landingPrice: Number(form.landingPrice), mrp: Number(form.mrp), stock: Number(form.stock) });
//   }

//   return (
//     <div className="flex flex-col h-full bg-[#F0F4FF]">
//       <StatusBar />
//       <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
//         <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
//         <h1 className="text-base font-extrabold text-gray-800">Add Product</h1>
//       </div>
//       <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
//         {/* Trader */}
//         <div>
//           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Trader Account</label>
//           <div className="relative">
//             <button onClick={() => setTraderDrop(!traderDrop)} className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm">
//               <span className={traderLabel ? "text-gray-800 font-semibold" : "text-gray-400"}>{traderLabel || "Select trader or retail..."}</span>
//               <ChevronDown size={15} className="text-gray-400" />
//             </button>
//             {traderDrop && (
//               <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-2xl z-30 overflow-hidden">
//                 <button onClick={() => { setForm(p => ({ ...p, traderId: null })); setTraderDrop(false); }} className="w-full flex flex-col items-start px-4 py-3 border-b border-gray-50 hover:bg-amber-50">
//                   <span className="text-sm font-bold text-amber-600">Retail (All)</span>
//                   <span className="text-xs text-gray-400">Visible to all retail operations</span>
//                 </button>
//                 {TRADER_ACCOUNTS.map(t => (
//                   <button key={t.id} onClick={() => { setForm(p => ({ ...p, traderId: t.id })); setTraderDrop(false); }} className="w-full flex flex-col items-start px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50">
//                     <span className="text-sm font-bold text-gray-800">{t.name}</span>
//                     <span className="text-xs text-gray-400">{t.company}</span>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//         {[
//           { label: "Company", key: "company", ph: "e.g. Nestlé India", icon: <Layers size={13} /> },
//           { label: "Product Name", key: "name", ph: "e.g. Maggi Noodles 70g", icon: <Package size={13} /> },
//           { label: "SKU", key: "sku", ph: "e.g. NES-MAG-70", icon: <Hash size={13} /> },
//           { label: "Category", key: "category", ph: "e.g. Instant Food", icon: <Tag size={13} /> },
//         ].map(f => (
//           <div key={f.key}>
//             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">{f.icon}{f.label}</label>
//             <input className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20" placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
//           </div>
//         ))}
//         <div>
//           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Description</label>
//           <textarea className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20 resize-none" rows={2} placeholder="Brief product description..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
//         </div>
//         <div>
//           <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Quantity Metric</label>
//           <div className="flex gap-2 flex-wrap">
//             {METRIC_OPTIONS.map(m => (
//               <button key={m.value} onClick={() => setForm(p => ({ ...p, metric: m.value }))}
//                 className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${form.metric === m.value ? "bg-[#1B4FD8] text-white border-[#1B4FD8]" : "bg-white text-gray-500 border-gray-200"}`}>
//                 {m.label}
//               </button>
//             ))}
//           </div>
//         </div>
//         {form.metric === "box" && (
//           <div>
//             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Units per Box</label>
//             <input type="number" className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" placeholder="e.g. 12" value={form.unitsPerBox} onChange={e => setForm(p => ({ ...p, unitsPerBox: e.target.value }))} />
//           </div>
//         )}
//         <div className="grid grid-cols-3 gap-3">
//           {[{ label: "Landing ₹", key: "landingPrice", ph: "Cost" }, { label: "MRP/Unit ₹", key: "mrp", ph: "Price" }, { label: "Stock", key: "stock", ph: "Qty" }].map(f => (
//             <div key={f.key}>
//               <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">{f.label}</label>
//               <input type="number" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20" placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
//             </div>
//           ))}
//         </div>
//         {form.landingPrice && form.mrp && Number(form.mrp) > 0 && (
//           <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
//             <p className="text-xs text-emerald-600 font-bold">Margin: {Math.round(((Number(form.mrp) - Number(form.landingPrice)) / Number(form.mrp)) * 100)}% · Profit: ₹{(Number(form.mrp) - Number(form.landingPrice)).toFixed(2)}/unit</p>
//           </div>
//         )}
//         <button onClick={handleSave} className="w-full bg-[#1B4FD8] text-white rounded-2xl py-3.5 font-bold text-sm mt-1" style={{ boxShadow: "0 8px 24px rgba(27,79,216,.3)" }}>Add Product</button>
//       </div>
//     </div>
//   );
// }

// ======================== RESTOCK GOODS ========================

function RestockGoodsScreen({ products, onBack, onSave }: {
  products: Product[]; onBack: () => void; onSave: (productId: string, qty: number) => void;
}) {
  const [traderFilter, setTraderFilter] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ qty: "", batch: "", date: new Date().toISOString().slice(0, 10), description: "" });
  const [traderDrop, setTraderDrop] = useState(false);
  const [productDrop, setProductDrop] = useState(false);
  const filteredProds = products.filter(p => !traderFilter || p.traderId === traderFilter);

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <StatusBar />
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
        <h1 className="text-base font-extrabold text-gray-800">Restock Goods</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Trader Account</label>
          <div className="relative">
            <button onClick={() => setTraderDrop(!traderDrop)} className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm">
              <span className={traderFilter ? "text-gray-800 font-semibold" : "text-gray-400"}>{traderFilter ? TRADER_ACCOUNTS.find(t => t.id === traderFilter)?.name : "All Traders"}</span>
              <ChevronDown size={15} className="text-gray-400" />
            </button>
            {traderDrop && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-2xl z-30 overflow-hidden">
                <button onClick={() => { setTraderFilter(""); setTraderDrop(false); }} className="w-full text-left px-4 py-3 border-b border-gray-50 text-sm font-medium text-gray-500">All Traders</button>
                {TRADER_ACCOUNTS.map(t => (
                  <button key={t.id} onClick={() => { setTraderFilter(t.id); setTraderDrop(false); setSelectedProduct(null); }} className="w-full flex flex-col items-start px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <span className="text-sm font-bold text-gray-800">{t.name}</span>
                    <span className="text-xs text-gray-400">{t.company}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Product</label>
          <div className="relative">
            <button onClick={() => setProductDrop(!productDrop)} className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm">
              <span className={selectedProduct ? "text-gray-800 font-semibold" : "text-gray-400"}>{selectedProduct ? selectedProduct.name : "Select product..."}</span>
              <ChevronDown size={15} className="text-gray-400" />
            </button>
            {productDrop && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-2xl z-30 overflow-hidden max-h-44 overflow-y-auto">
                {filteredProds.map(p => (
                  <button key={p.id} onClick={() => { setSelectedProduct(p); setProductDrop(false); }} className="w-full flex flex-col items-start px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <span className="text-sm font-bold text-gray-800">{p.name}</span>
                    <span className="text-xs text-gray-400">{p.company} · Stock: {p.stock} {p.metric}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {selectedProduct && (
          <div className="rounded-2xl p-3 flex items-center gap-3" style={{ background: "rgba(27,79,216,.06)" }}>
            <Package size={18} className="text-[#1B4FD8]" />
            <div><p className="text-xs font-bold text-[#1B4FD8]">{selectedProduct.name}</p><p className="text-[10px] text-gray-400 font-medium">Current stock: {selectedProduct.stock} {selectedProduct.metric}</p></div>
          </div>
        )}
        {[{ label: "Description / Notes", key: "description", ph: "Additional notes...", type: "text" }, { label: "Batch Number", key: "batch", ph: "e.g. BATCH-2024-01", type: "text" }, { label: "Date", key: "date", ph: "", type: "date" }, { label: "Restock Quantity", key: "qty", ph: "e.g. 100", type: "number" }].map(f => (
          <div key={f.key}>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">{f.label}</label>
            <input type={f.type} className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20" placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
          </div>
        ))}
        <button onClick={() => { if (selectedProduct && form.qty) { onSave(selectedProduct.id, Number(form.qty)); } }}
          className="w-full bg-emerald-600 text-white rounded-2xl py-3.5 font-bold text-sm mt-1" style={{ boxShadow: "0 8px 24px rgba(16,185,129,.3)" }}>
          Confirm Restock
        </button>
      </div>
    </div>
  );
}

// ======================== VIEW INVENTORY ========================

function ViewInventoryScreen({ products, onBack }: { products: Product[]; onBack: () => void }) {
  const [traderFilter, setTraderFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [traderDrop, setTraderDrop] = useState(false);

  const filtered = products.filter(p => {
    const matchTrader = traderFilter === "all" || p.traderId === traderFilter || (traderFilter === "retail" && p.traderId === null);
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    return matchTrader && matchSearch;
  });

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]" onClick={() => setOpenMenu(null)}>
      <StatusBar />
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
          <h1 className="text-base font-extrabold text-gray-800">View Inventory</h1>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#1B4FD8]" style={{ background: "rgba(27,79,216,.1)" }}>
          <Download size={12} />Export
        </button>
      </div>
      <div className="bg-white border-b border-gray-100 px-4 py-2 flex gap-2">
        <div className="relative flex-1">
          <button onClick={() => setTraderDrop(!traderDrop)} className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs">
            <span className="font-semibold text-gray-700 truncate">
              {traderFilter === "all" ? "All Traders" : traderFilter === "retail" ? "Retail" : TRADER_ACCOUNTS.find(t => t.id === traderFilter)?.name?.split(" ")[0]}
            </span>
            <ChevronDown size={12} className="text-gray-400 flex-shrink-0 ml-1" />
          </button>
          {traderDrop && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl z-30 overflow-hidden">
              {[{ id: "all", label: "All Traders" }, { id: "retail", label: "Retail (General)" }, ...TRADER_ACCOUNTS.map(t => ({ id: t.id, label: t.name }))].map(opt => (
                <button key={opt.id} onClick={() => { setTraderFilter(opt.id); setTraderDrop(false); }}
                  className={`w-full text-left px-3 py-2.5 text-xs font-medium border-b border-gray-50 last:border-0 ${traderFilter === opt.id ? "bg-[#1B4FD8]/5 text-[#1B4FD8] font-bold" : "text-gray-700"}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 flex-1">
          <Search size={12} className="text-gray-400" />
          <input className="flex-1 bg-transparent text-xs font-medium focus:outline-none" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2" style={{ scrollbarWidth: "none" }}>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{filtered.length} products</p>
        {filtered.map(p => {
          const low = p.stock < 100;
          return (
            <div key={p.id} className="bg-white rounded-2xl p-3.5 flex items-center gap-3 shadow-sm relative" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-10 bg-[#1B4FD8]/5 rounded-xl flex items-center justify-center flex-shrink-0"><Package size={17} className="text-[#1B4FD8]/40" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">{p.name}</p>
                <p className="text-[10px] text-gray-400 font-medium">{p.company} · {p.sku}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] font-bold text-gray-500">₹{p.mrp}/{p.metric}</span>
                  {p.traderId === null && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600">Retail</span>}
                </div>
              </div>
              <div className="text-right mr-1">
                <p className={`text-sm font-extrabold ${low ? "text-amber-500" : "text-emerald-500"}`}>{p.stock}</p>
                <p className="text-[9px] text-gray-400 font-medium">{low ? "Low" : "In stock"}</p>
              </div>
              <button onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === p.id ? null : p.id); }} className="w-7 h-7 flex items-center justify-center">
                <MoreVertical size={14} className="text-gray-300" />
              </button>
              {openMenu === p.id && (
                <div className="absolute right-4 top-10 bg-white border border-gray-100 rounded-2xl shadow-2xl z-30 overflow-hidden w-36">
                  <button onClick={() => setOpenMenu(null)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-gray-700 border-b border-gray-50"><Eye size={12} />View Details</button>
                  <button onClick={() => setOpenMenu(null)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium text-gray-700"><Edit size={12} />Edit</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ======================== MANAGE CUSTOMERS ========================

function ManageCustomersScreen({ customers, onBack, onAdd, onView, onEdit, onDelete }: {
  customers: Customer[]; onBack: () => void; onAdd: () => void;
  onView: (c: Customer) => void; onEdit: (c: Customer) => void; onDelete: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const filtered = customers.filter(c => !search || c.customerName.toLowerCase().includes(search.toLowerCase()) || c.shopName.toLowerCase().includes(search.toLowerCase()) || c.mobile.includes(search));
  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]" onClick={() => setOpenMenu(null)}>
      <StatusBar />
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
          <h1 className="text-base font-extrabold text-gray-800">Customers</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowSearch(!showSearch)} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><Search size={15} className="text-gray-600" /></button>
          <button onClick={onAdd} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1B4FD8]"><Plus size={15} className="text-white" /></button>
        </div>
      </div>
      {showSearch && (
        <div className="px-4 py-2 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
            <Search size={13} className="text-gray-400" />
            <input autoFocus className="flex-1 bg-transparent text-sm font-medium focus:outline-none" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2" style={{ scrollbarWidth: "none" }}>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{filtered.length} Customers</p>
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm relative" onClick={e => e.stopPropagation()}>
            <div className="w-11 h-11 bg-[#1B4FD8]/10 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-[#1B4FD8] font-extrabold text-base">{c.customerName.charAt(0)}</span></div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 text-sm truncate">{c.shopName}</p>
              <p className="text-gray-500 text-xs font-medium">{c.customerName}</p>
              <p className="text-gray-400 text-[11px] flex items-center gap-1 mt-0.5"><Phone size={9} />{c.mobile}</p>
            </div>
            <button onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === c.id ? null : c.id); }} className="w-8 h-8 flex items-center justify-center"><MoreVertical size={15} className="text-gray-300" /></button>
            {openMenu === c.id && (
              <div className="absolute right-4 top-12 bg-white border border-gray-100 rounded-2xl shadow-2xl z-30 overflow-hidden w-40">
                {[{ label: "View Details", icon: <Eye size={13} />, action: () => { onView(c); setOpenMenu(null); } }, { label: "Edit", icon: <Edit size={13} />, action: () => { onEdit(c); setOpenMenu(null); } }, { label: "Delete", icon: <Trash2 size={13} />, action: () => { onDelete(c.id); setOpenMenu(null); }, danger: true }].map(item => (
                  <button key={item.label} onClick={item.action} className={`w-full flex items-center gap-3 px-4 py-3 text-sm border-b border-gray-50 last:border-0 font-medium ${(item as any).danger ? "text-red-500" : "text-gray-700"}`}>{item.icon}{item.label}</button>
                ))}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="flex flex-col items-center py-16 gap-3"><Users size={44} className="text-gray-200" /><p className="text-gray-400 text-sm font-medium">No customers found</p></div>}
      </div>
    </div>
  );
}

function AddEditCustomerScreen({ customer, onBack, onSave }: { customer?: Customer; onBack: () => void; onSave: (c: Omit<Customer, "id">) => void }) {
  const [form, setForm] = useState({ shopName: customer?.shopName || "", customerName: customer?.customerName || "", gst: customer?.gst || "", address: customer?.address || "", mobile: customer?.mobile || "" });
  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <StatusBar />
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
        <h1 className="text-base font-extrabold text-gray-800">{customer ? "Edit Customer" : "Add Customer"}</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
        {[{ label: "Retail Shop Name", key: "shopName", ph: "e.g. Sri Lakshmi Provisions", icon: <Store size={13} />, type: "text" }, { label: "Customer Name", key: "customerName", ph: "e.g. Ramesh Kumar", icon: <User size={13} />, type: "text" }, { label: "GST Number", key: "gst", ph: "e.g. 33AABCU9603R1ZX", icon: <FileText size={13} />, type: "text" }, { label: "Mobile Number", key: "mobile", ph: "e.g. 9876543210", icon: <Phone size={13} />, type: "tel" }, { label: "Address", key: "address", ph: "Full address with city & PIN", icon: <MapPin size={13} />, type: "textarea" }].map(f => (
          <div key={f.key}>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">{f.icon}{f.label}</label>
            {f.type === "textarea" ? <textarea className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20 resize-none" rows={3} placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} /> : <input type={f.type} className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20" placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />}
          </div>
        ))}
        <button onClick={() => onSave(form)} className="w-full bg-[#1B4FD8] text-white rounded-2xl py-3.5 font-bold text-sm mt-1" style={{ boxShadow: "0 8px 24px rgba(27,79,216,.3)" }}>{customer ? "Save Changes" : "Add Customer"}</button>
      </div>
    </div>
  );
}

function ViewCustomerScreen({ customer, onBack }: { customer: Customer; onBack: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <StatusBar />
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
        <h1 className="text-base font-extrabold text-gray-800">Customer Details</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col items-center py-6 gap-2">
          <div className="w-20 h-20 bg-[#1B4FD8] rounded-full flex items-center justify-center" style={{ boxShadow: "0 12px 32px rgba(27,79,216,.3)" }}><span className="text-white text-3xl font-extrabold">{customer.customerName.charAt(0)}</span></div>
          <h2 className="text-base font-extrabold text-gray-800">{customer.shopName}</h2>
          <p className="text-gray-400 text-sm font-medium">{customer.customerName}</p>
        </div>
        {[{ label: "Shop Name", value: customer.shopName, icon: <Store size={14} className="text-[#1B4FD8]" /> }, { label: "Customer Name", value: customer.customerName, icon: <User size={14} className="text-[#1B4FD8]" /> }, { label: "GST Number", value: customer.gst, icon: <FileText size={14} className="text-[#1B4FD8]" /> }, { label: "Mobile", value: customer.mobile, icon: <Phone size={14} className="text-[#1B4FD8]" /> }, { label: "Address", value: customer.address, icon: <MapPin size={14} className="text-[#1B4FD8]" /> }].map(f => (
          <div key={f.label} className="bg-white rounded-2xl p-4 flex items-start gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0" style={{ background: "rgba(27,79,216,.08)" }}>{f.icon}</div>
            <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{f.label}</p><p className="text-sm font-bold text-gray-800">{f.value}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ======================== HOME SCREEN ========================

function HomeScreen({ mode, traderId, products, onOrders, onTransactions, onInventory, onSwitch, onSalesReport, onProfile }: {
  mode: AppMode; traderId: string; products: Product[];
  onOrders: () => void; onTransactions: () => void; onInventory: () => void;
  onSwitch: () => void; onSalesReport: () => void; onProfile: () => void;
}) {
  const [drawer, setDrawer] = useState(false);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const trader = TRADER_ACCOUNTS.find(t => t.id === traderId);
  const visibleProducts = mode === "retail" ? products : products.filter(p => p.traderId === traderId);
  const filtered = visibleProducts.filter(p => (category === "All" || p.category === category) && (!search || p.name.toLowerCase().includes(search.toLowerCase())));
  const isRetail = mode === "retail";
  const accentBg = isRetail ? "bg-[#F59E0B]" : "bg-[#1B4FD8]";
  const navItems = [
    { label: "Orders", icon: <ClipboardList size={20} />, action: onOrders },
    { label: "Transactions", icon: <Receipt size={20} />, action: onTransactions },
    { label: "Inventory", icon: <Package size={20} />, action: onInventory },
    { label: "Switch", icon: <ArrowLeftRight size={20} />, action: onSwitch },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF] relative">
      {drawer && (
        <div className="absolute inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
          <div className="relative w-[280px] bg-white h-full flex flex-col shadow-2xl z-50">
            <div className={`px-5 pt-14 pb-7 ${isRetail ? "bg-gradient-to-b from-[#F59E0B] to-[#d97706]" : "bg-gradient-to-b from-[#1B4FD8] to-[#1e40af]"}`}>
              <div className="w-14 h-14 bg-white/15 rounded-full flex items-center justify-center mb-3"><User size={28} className="text-white" /></div>
              <p className="text-white font-extrabold text-sm">Rajesh Distributor</p>
              <p className="text-white/70 text-xs mt-0.5 font-medium">{isRetail ? "Retail Mode" : trader?.name}</p>
            </div>
            <div className="flex-1 py-3">
              {[{ label: "Home", icon: <Store size={17} />, action: () => setDrawer(false) }, { label: "Profile Dashboard", icon: <User size={17} />, action: () => { setDrawer(false); onProfile(); } }, { label: "Sales Report", icon: <BarChart2 size={17} />, action: () => { setDrawer(false); onSalesReport(); } }, { label: "Schemes & Offers", icon: <Tag size={17} />, action: () => setDrawer(false) }].map(item => (
                <button key={item.label} onClick={item.action} className="w-full flex items-center gap-4 px-5 py-3.5 text-gray-600 hover:bg-gray-50 font-semibold text-sm">{item.icon}{item.label}</button>
              ))}
            </div>
            <button onClick={onSwitch} className="flex items-center gap-3 px-5 py-4 border-t border-gray-100 text-red-400 text-sm font-bold"><ArrowLeftRight size={15} />Switch Business</button>
          </div>
        </div>
      )}

      <div className={`${isRetail ? "" : "bg-white"} shadow-sm`} style={isRetail ? { background: "#F59E0B" } : {}}>
        <StatusBar light={isRetail} />
        <div className="flex items-center justify-between px-4 pb-3">
          <button onClick={() => setDrawer(true)} className={`w-9 h-9 flex items-center justify-center rounded-full ${isRetail ? "bg-white/20" : "bg-gray-50"}`}>
            <Menu size={17} className={isRetail ? "text-white" : "text-gray-700"} />
          </button>
          <div className="text-center">
            <p className={`text-[10px] font-bold uppercase tracking-widest ${isRetail ? "text-white/70" : "text-gray-400"}`}>{isRetail ? "Retail Mode" : "Trader Account"}</p>
            <p className={`text-sm font-extrabold truncate max-w-[160px] ${isRetail ? "text-white" : "text-gray-800"}`}>{isRetail ? "General Store" : trader?.name}</p>
          </div>
          <button className={`w-9 h-9 flex items-center justify-center rounded-full ${isRetail ? "bg-white/20" : "bg-gray-50"}`}>
            <Bell size={16} className={isRetail ? "text-white" : "text-gray-500"} />
          </button>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-3 py-2.5">
            <Search size={13} className="text-gray-400" />
            <input className="flex-1 bg-transparent text-sm font-medium focus:outline-none" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-20" style={{ scrollbarWidth: "none" }}>
        <div className="px-4 py-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Schemes & Offers</p>
          <div className="flex gap-3 overflow-x-auto pb-1 snap-x" style={{ scrollbarWidth: "none" }}>
            {SCHEMES.map(s => (
              <div key={s.id} className={`flex-shrink-0 w-[230px] bg-gradient-to-br ${s.gradient} rounded-2xl p-4 snap-start`}>
                <div className="flex justify-between items-start mb-2.5"><span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{s.tag}</span><Gift size={18} className="text-white/50" /></div>
                <p className="text-white font-extrabold text-sm leading-snug">{s.title}</p>
                <p className="text-white/70 text-xs mt-1 font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 mb-3">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${category === c ? `${accentBg} text-white` : "bg-white text-gray-500 border border-gray-200"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="px-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{filtered.length} products</p>
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-50">
                <div className="w-full h-16 rounded-xl flex items-center justify-center mb-2.5" style={{ background: isRetail ? "rgba(245,158,11,.06)" : "rgba(27,79,216,.04)" }}>
                  <Package size={24} className={isRetail ? "text-[#F59E0B]/40" : "text-[#1B4FD8]/30"} />
                </div>
                <p className="text-xs font-bold text-gray-800 leading-snug">{p.name}</p>
                <p className="text-[10px] text-gray-400 font-medium mt-0.5">{p.category}</p>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className={`text-sm font-extrabold ${isRetail ? "text-[#F59E0B]" : "text-[#1B4FD8]"}`}>₹{p.mrp}</span>
                  <span className="text-[10px] text-gray-400">/{p.metric}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-around px-1 py-2 pb-6">
        {navItems.map(item => (
          <button key={item.label} onClick={item.action}
            className={`flex flex-col items-center gap-1 min-w-[72px] transition-colors ${item.label === "Switch" ? "text-red-400" : "text-gray-400"}`}>
            {item.icon}<span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ======================== TRANSACTIONS ========================

interface PaymentModalState {
  orderId: string; total: number;
  step: "choose" | "paid-method" | "partial-amount" | "credit-done";
  method?: PaymentMethod; amountPaid?: string;
}

function TransactionsScreen({ orders, payments, mode, traderId, onBack, onUpdatePayment }: {
  orders: Order[]; payments: Record<string, PaymentRecord>;
  mode: AppMode; traderId: string; onBack: () => void;
  onUpdatePayment: (orderId: string, rec: PaymentRecord) => void;
}) {
  const [modal, setModal] = useState<PaymentModalState | null>(null);
  const [search, setSearch] = useState("");

  const deliveredOrders = orders.filter(o =>
    o.status === "delivered" &&
    (mode === "retail" ? o.mode === "retail" : o.mode === "wholesale" && o.traderId === traderId) &&
    (!search || o.shopName.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search))
  );

  const totalOutstanding = deliveredOrders.reduce((s, o) => {
    const p = payments[o.id];
    if (!p || p.status === "unpaid") return s + o.total;
    if (p.status === "partial") return s + (o.total - p.amountPaid);
    return s;
  }, 0);

  function confirmPayment() {
    if (!modal) return;
    const { orderId, total, step, method, amountPaid } = modal;
    if (step === "paid-method" && method) { onUpdatePayment(orderId, { status: "paid", paymentMethod: method, amountPaid: total }); setModal(null); }
    else if (step === "partial-amount" && amountPaid) { onUpdatePayment(orderId, { status: "partial", amountPaid: Number(amountPaid) }); setModal(null); }
    else if (step === "credit-done") { onUpdatePayment(orderId, { status: "unpaid", amountPaid: 0, isCredit: true }); setModal(null); }
  }

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF] relative">
      {modal && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-t-3xl px-5 pt-5 pb-8 shadow-2xl z-10">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            {modal.step === "choose" && (
              <>
                <p className="text-base font-extrabold text-gray-800 mb-4">Update Payment · {fmt(modal.total)}</p>
                {[{ label: "Mark as Paid", desc: "Full payment received", icon: <CheckCircle size={18} className="text-emerald-500" />, action: () => setModal(m => m ? { ...m, step: "paid-method" } : null) },
                  { label: "Partially Paid", desc: "Partial payment received", icon: <CreditCard size={18} className="text-amber-500" />, action: () => setModal(m => m ? { ...m, step: "partial-amount" } : null) },
                  { label: "Mark as Credit", desc: "Add to outstanding credit", icon: <FileText size={18} className="text-red-500" />, action: () => setModal(m => m ? { ...m, step: "credit-done" } : null) }].map(opt => (
                  <button key={opt.label} onClick={opt.action} className="w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-gray-50 border border-gray-100 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">{opt.icon}</div>
                    <div className="text-left"><p className="text-sm font-bold text-gray-800">{opt.label}</p><p className="text-xs text-gray-400">{opt.desc}</p></div>
                  </button>
                ))}
              </>
            )}
            {modal.step === "paid-method" && (
              <>
                <p className="text-base font-extrabold text-gray-800 mb-4">Select Payment Method</p>
                <div className="flex gap-3 mb-4">
                  {([{ value: "cash" as PaymentMethod, label: "Cash", icon: <Banknote size={20} /> }, { value: "gpay" as PaymentMethod, label: "GPay", icon: <Smartphone size={20} /> }, { value: "check" as PaymentMethod, label: "Cheque", icon: <BookCheck size={20} /> }] as { value: PaymentMethod; label: string; icon: React.ReactNode }[]).map(m => (
                    <button key={m.value} onClick={() => setModal(prev => prev ? { ...prev, method: m.value } : null)}
                      className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-2xl border-2 text-xs font-bold ${modal.method === m.value ? "border-[#1B4FD8] text-[#1B4FD8]" : "border-gray-200 text-gray-500"}`}
                      style={modal.method === m.value ? { background: "rgba(27,79,216,.05)" } : {}}>
                      {m.icon}{m.label}
                    </button>
                  ))}
                </div>
                <button onClick={confirmPayment} className="w-full bg-emerald-600 text-white rounded-2xl py-3 font-bold text-sm" style={{ boxShadow: "0 6px 20px rgba(16,185,129,.3)" }}>Confirm Payment</button>
              </>
            )}
            {modal.step === "partial-amount" && (
              <>
                <p className="text-base font-extrabold text-gray-800 mb-4">Partial Payment · Due {fmt(modal.total)}</p>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Amount Received (₹)</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20 mb-2" placeholder="0" value={modal.amountPaid || ""} onChange={e => setModal(m => m ? { ...m, amountPaid: e.target.value } : null)} />
                {modal.amountPaid && <div className="flex justify-between px-1 mb-4"><span className="text-xs text-gray-400 font-medium">Balance due</span><span className="text-xs font-extrabold text-red-500">{fmt(modal.total - Number(modal.amountPaid))}</span></div>}
                <button onClick={confirmPayment} className="w-full bg-amber-500 text-white rounded-2xl py-3 font-bold text-sm">Confirm Partial Payment</button>
              </>
            )}
            {modal.step === "credit-done" && (
              <>
                <p className="text-base font-extrabold text-gray-800 mb-4">Mark as Credit</p>
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4">
                  <p className="text-sm font-bold text-red-700">Bill will be added to credit account</p>
                  <p className="text-xs text-red-500 font-medium mt-1">Balance of {fmt(modal.total)} will show as outstanding</p>
                </div>
                <button onClick={confirmPayment} className="w-full bg-red-500 text-white rounded-2xl py-3 font-bold text-sm">Confirm Credit</button>
              </>
            )}
          </div>
        </div>
      )}

      <StatusBar />
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
        <h1 className="text-base font-extrabold text-gray-800">Transactions</h1>
      </div>
      <div className="px-4 py-2 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <Search size={13} className="text-gray-400" />
          <input className="flex-1 bg-transparent text-sm font-medium focus:outline-none" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      {totalOutstanding > 0 && (
        <div className="mx-4 my-2 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 flex justify-between items-center">
          <div><p className="text-xs font-bold text-red-700">Outstanding Balance</p><p className="text-[10px] text-red-400 font-medium">{deliveredOrders.filter(o => !payments[o.id] || payments[o.id].status !== "paid").length} invoices pending</p></div>
          <p className="text-lg font-extrabold text-red-600">{fmt(totalOutstanding)}</p>
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2" style={{ scrollbarWidth: "none" }}>
        {deliveredOrders.length === 0 && <div className="flex flex-col items-center py-16 gap-3"><Receipt size={44} className="text-gray-200" /><p className="text-gray-400 text-sm font-medium">No delivered orders yet</p></div>}
        {deliveredOrders.map(o => {
          const p = payments[o.id];
          const isPaid = p?.status === "paid";
          const isPartial = p?.status === "partial";
          return (
            <div key={o.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div><span className="text-[11px] font-extrabold text-[#1B4FD8] tracking-wider font-mono">{o.id}</span><p className="text-sm font-bold text-gray-800 mt-0.5">{o.shopName}</p><p className="text-xs text-gray-400 font-medium">{o.customerName} · {o.date}</p></div>
                <PaymentBadge rec={p} total={o.total} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-extrabold text-gray-800">{fmt(o.total)}</p>
                  {isPartial && <p className="text-xs text-amber-600 font-bold">Paid: {fmt(p.amountPaid)} · Due: {fmt(o.total - p.amountPaid)}</p>}
                  {p?.isCredit && !isPaid && <p className="text-xs text-red-500 font-bold flex items-center gap-1"><FileText size={10} />Credit Bill</p>}
                  {isPaid && p?.paymentMethod && <p className="text-xs text-emerald-600 font-bold capitalize">{p.paymentMethod === "gpay" ? "GPay" : p.paymentMethod}</p>}
                </div>
                {!isPaid && <button onClick={() => setModal({ orderId: o.id, total: o.total, step: "choose" })} className="bg-[#1B4FD8] text-white text-xs font-bold px-3 py-1.5 rounded-xl" style={{ boxShadow: "0 4px 12px rgba(27,79,216,.25)" }}>Update Payment</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ======================== ORDERS LIST ========================

function OrdersListScreen({ orders, mode, traderId, onBack, onAdd, onView, onEdit, onDelete, onUpdateStatus }: {
  orders: Order[]; mode: AppMode; traderId: string; onBack: () => void; onAdd: () => void;
  onView: (o: Order) => void; onEdit: (o: Order) => void;
  onDelete: (id: string) => void; onUpdateStatus: (id: string, s: Order["status"]) => void;
}) {
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectMode, setSelectMode] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filtered = orders.filter(o =>
    o.mode === mode && (mode === "wholesale" ? o.traderId === traderId : true) &&
    (!search || o.id.toLowerCase().includes(search.toLowerCase()) || o.shopName.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase()))
  );

  function startLong(id: string) { timerRef.current = setTimeout(() => { setSelectMode(true); setSelected(new Set([id])); }, 650); }
  function endLong() { if (timerRef.current) clearTimeout(timerRef.current); }
  function toggleSelect(id: string) { setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }); }
  function applyStatus(s: Order["status"]) { selected.forEach(id => onUpdateStatus(id, s)); setSelected(new Set()); setSelectMode(false); }

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]" onClick={() => setOpenMenu(null)}>
      <StatusBar />
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
          <h1 className="text-base font-extrabold text-gray-800">Manage Orders</h1>
        </div>
        <button onClick={onAdd} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1B4FD8]"><Plus size={15} className="text-white" /></button>
      </div>
      <div className="px-4 py-2 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <Search size={13} className="text-gray-400" />
          <input className="flex-1 bg-transparent text-sm font-medium focus:outline-none" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      {selectMode && selected.size > 0 && (
        <div className="bg-[#1B4FD8] px-4 py-2.5 flex items-center justify-between">
          <span className="text-white text-sm font-bold">{selected.size} selected</span>
          <div className="flex gap-2 items-center">
            <button onClick={() => applyStatus("packed")} className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg font-bold">Mark Packed</button>
            <button onClick={() => applyStatus("delivered")} className="bg-white text-[#1B4FD8] text-xs px-3 py-1.5 rounded-lg font-bold">Delivered</button>
            <button onClick={() => { setSelectMode(false); setSelected(new Set()); }}><X size={15} className="text-white" /></button>
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2" style={{ scrollbarWidth: "none" }}>
        {filtered.map(o => (
          <div key={o.id}
            className={`bg-white rounded-2xl p-4 flex items-start gap-3 shadow-sm relative ${selected.has(o.id) ? "ring-2 ring-[#1B4FD8]" : ""}`}
            onMouseDown={() => startLong(o.id)} onMouseUp={endLong}
            onTouchStart={() => startLong(o.id)} onTouchEnd={endLong}
            onClick={e => { e.stopPropagation(); if (selectMode) toggleSelect(o.id); }}>
            {selectMode && (
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${selected.has(o.id) ? "bg-[#1B4FD8] border-[#1B4FD8]" : "border-gray-200"}`}>
                {selected.has(o.id) && <Check size={10} className="text-white" />}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1"><span className="text-[11px] font-extrabold text-[#1B4FD8] tracking-wider font-mono">{o.id}</span><StatusBadge status={o.status} /></div>
              <p className="text-sm font-bold text-gray-800 truncate">{o.shopName}</p>
              <p className="text-xs text-gray-400 font-medium">{o.customerName}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px] text-gray-400 font-medium">{o.items.length} item{o.items.length !== 1 ? "s" : ""} · {o.date}</p>
                <p className="text-sm font-extrabold text-gray-800">{fmt(o.total)}</p>
              </div>
            </div>
            {!selectMode && <button onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === o.id ? null : o.id); }} className="w-8 h-8 flex items-center justify-center"><MoreVertical size={15} className="text-gray-300" /></button>}
            {openMenu === o.id && (
              <div className="absolute right-4 top-12 bg-white border border-gray-100 rounded-2xl shadow-2xl z-30 overflow-hidden w-44">
                {[{ label: "View Details", icon: <Eye size={13} />, action: () => { onView(o); setOpenMenu(null); } }, { label: "Edit Order", icon: <Edit size={13} />, action: () => { onEdit(o); setOpenMenu(null); } }, { label: "Download Invoice", icon: <Download size={13} />, action: () => setOpenMenu(null) }, { label: "Delete", icon: <Trash2 size={13} />, action: () => { onDelete(o.id); setOpenMenu(null); }, danger: true }].map(item => (
                  <button key={item.label} onClick={item.action} className={`w-full flex items-center gap-3 px-4 py-3 text-sm border-b border-gray-50 last:border-0 font-medium ${(item as any).danger ? "text-red-500" : "text-gray-700"}`}>{item.icon}{item.label}</button>
                ))}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="flex flex-col items-center py-16 gap-3"><ClipboardList size={44} className="text-gray-200" /><p className="text-gray-400 text-sm font-medium">No orders found</p></div>}
        <p className="text-center text-[10px] text-gray-300 font-medium pt-2">Long press to select multiple</p>
      </div>
    </div>
  );
}

// ======================== VIEW ORDER ========================

function ViewOrderScreen({ order, payment, onBack }: { order: Order; payment?: PaymentRecord; onBack: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <StatusBar />
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
        <h1 className="text-base font-extrabold text-gray-800">Order Details</h1>
        <button className="ml-auto flex items-center gap-1 text-[#1B4FD8] text-xs font-bold"><Download size={14} />Invoice</button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        <div className="bg-[#1B4FD8] rounded-2xl p-4" style={{ boxShadow: "0 8px 24px rgba(27,79,216,.2)" }}>
          <div className="flex justify-between items-start">
            <div><p className="text-blue-200/70 text-[10px] font-bold uppercase tracking-widest">Order ID</p><p className="text-white font-extrabold text-base font-mono">{order.id}</p><p className="text-blue-200/70 text-xs font-medium mt-0.5">{order.date}</p></div>
            <StatusBadge status={order.status} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Customer</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1B4FD8]/10 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-[#1B4FD8] font-extrabold">{order.customerName.charAt(0)}</span></div>
            <div><p className="text-sm font-bold text-gray-800">{order.shopName}</p><p className="text-xs text-gray-400 font-medium">{order.customerName}</p></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="px-4 pt-4 pb-2"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Items</p></div>
          <div className="flex items-center px-4 py-2 bg-gray-50 border-y border-gray-100">
            <p className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Item</p>
            <p className="w-16 text-[9px] font-bold text-gray-400 uppercase text-center">Unit</p>
            <p className="w-14 text-[9px] font-bold text-gray-400 uppercase text-right">Rate</p>
            <p className="w-16 text-[9px] font-bold text-gray-400 uppercase text-right">Total</p>
          </div>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center px-4 py-3 border-b border-gray-50 last:border-0">
              <div className="flex-1 min-w-0 pr-2"><p className="text-xs font-bold text-gray-800 truncate">{item.product.name}</p><p className="text-[10px] text-gray-400 font-medium">{item.product.category}</p></div>
              <p className="w-16 text-xs font-bold text-gray-600 text-center">{item.quantity} {item.product.metric}</p>
              <p className="w-14 text-xs font-bold text-gray-600 text-right">₹{item.price}</p>
              <p className="w-16 text-xs font-extrabold text-gray-800 text-right">{fmt(item.quantity * item.price)}</p>
            </div>
          ))}
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100" style={{ background: "rgba(27,79,216,.04)" }}>
            <p className="text-sm font-extrabold text-gray-800">Grand Total</p>
            <p className="text-base font-extrabold text-[#1B4FD8]">{fmt(order.total)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Status</p>
          <div className="flex items-center justify-between">
            <PaymentBadge rec={payment} total={order.total} />
            <div className="text-right">
              {payment?.paymentMethod && <p className="text-xs font-bold text-gray-500 capitalize">{payment.paymentMethod === "gpay" ? "GPay" : payment.paymentMethod}</p>}
              {payment?.status === "partial" && <p className="text-xs font-bold text-red-500">Balance: {fmt(order.total - payment.amountPaid)}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================== EDIT ORDER ========================

function EditOrderScreen({ order, products, onBack, onSave }: {
  order: Order; products: Product[]; onBack: () => void; onSave: (updated: Order) => void;
}) {
  const [items, setItems] = useState<CartItem[]>([...order.items]);
  const [productSearch, setProductSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const filteredProds = productSearch ? products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())) : [];

  function updateQty(idx: number, delta: number) { setItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it)); }
  function removeItem(idx: number) { setItems(prev => prev.filter((_, i) => i !== idx)); }
  function addProduct(p: Product) {
    setItems(prev => { const ex = prev.find(it => it.product.id === p.id); if (ex) return prev.map(it => it.product.id === p.id ? { ...it, quantity: it.quantity + 1 } : it); return [...prev, { product: p, quantity: 1, price: p.mrp }]; });
    setProductSearch(""); setShowSearch(false);
  }
  const total = items.reduce((s, i) => s + i.quantity * i.price, 0);

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <StatusBar />
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
        <h1 className="text-base font-extrabold text-gray-800">Edit · {order.id}</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        <div className="rounded-2xl p-4" style={{ background: "rgba(27,79,216,.06)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "rgba(27,79,216,.6)" }}>Customer (non-editable)</p>
          <p className="text-sm font-bold text-gray-800">{order.shopName}</p>
          <p className="text-xs text-gray-500 font-medium">{order.customerName}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Items</p>
            <button onClick={() => setShowSearch(!showSearch)} className="flex items-center gap-1 text-[#1B4FD8] text-xs font-bold"><Plus size={12} />Add Item</button>
          </div>
          {showSearch && (
            <div className="px-3 py-2 border-b border-gray-50">
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <Search size={12} className="text-gray-400" />
                <input autoFocus className="flex-1 bg-transparent text-xs font-medium focus:outline-none" placeholder="Search product to add..." value={productSearch} onChange={e => setProductSearch(e.target.value)} />
              </div>
              {filteredProds.length > 0 && (
                <div className="mt-1 max-h-28 overflow-y-auto">
                  {filteredProds.map(p => (
                    <button key={p.id} onClick={() => addProduct(p)} className="w-full flex items-center justify-between px-2 py-2 hover:bg-gray-50 rounded-lg">
                      <span className="text-xs font-medium text-gray-700">{p.name}</span>
                      <span className="text-[10px] text-[#1B4FD8] font-bold">₹{p.mrp}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-100">
            <p className="flex-1 text-[9px] font-bold text-gray-400 uppercase">Item</p>
            <p className="w-20 text-[9px] font-bold text-gray-400 uppercase text-center">Qty</p>
            <p className="w-16 text-[9px] font-bold text-gray-400 uppercase text-right">Total</p>
            <div className="w-6" />
          </div>
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center px-4 py-2.5 border-b border-gray-50 last:border-0">
              <div className="flex-1 min-w-0 pr-2"><p className="text-xs font-bold text-gray-800 truncate">{item.product.name}</p><p className="text-[10px] text-gray-400 font-medium">₹{item.price}/{item.product.metric}</p></div>
              <div className="w-20 flex items-center gap-1 justify-center">
                <button onClick={() => updateQty(idx, -1)} className="w-5 h-5 flex items-center justify-center rounded bg-gray-100"><Minus size={8} /></button>
                <span className="text-xs font-extrabold text-gray-800 w-5 text-center">{item.quantity}</span>
                <button onClick={() => updateQty(idx, 1)} className="w-5 h-5 flex items-center justify-center rounded bg-[#1B4FD8]"><Plus size={8} className="text-white" /></button>
              </div>
              <p className="w-16 text-xs font-extrabold text-gray-800 text-right">{fmt(item.quantity * item.price)}</p>
              <button onClick={() => removeItem(idx)} className="w-6 flex items-center justify-center ml-1"><X size={12} className="text-gray-300" /></button>
            </div>
          ))}
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100" style={{ background: "rgba(27,79,216,.04)" }}>
            <p className="text-sm font-extrabold text-gray-800">Grand Total</p>
            <p className="text-base font-extrabold text-[#1B4FD8]">{fmt(total)}</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <button onClick={() => onSave({ ...order, items, total })} className="w-full bg-[#1B4FD8] text-white rounded-2xl py-3.5 font-bold text-sm" style={{ boxShadow: "0 8px 24px rgba(27,79,216,.3)" }}>Save Changes</button>
      </div>
    </div>
  );
}

// ======================== ADD ORDER ========================

function AddOrderScreen({ customers, cart, products, mode, traderId, onBack, onUpdateCart, onViewCart }: {
  customers: Customer[]; cart: CartItem[]; products: Product[];
  mode: AppMode; traderId: string;
  onBack: () => void; onUpdateCart: (items: CartItem[]) => void; onViewCart: (cid: string) => void;
}) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [custSearch, setCustSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [showCustList, setShowCustList] = useState(false);
  const [localCart, setLocalCart] = useState<CartItem[]>([...cart]);
  const visibleProducts = mode === "retail" ? products : products.filter(p => p.traderId === traderId);
  const filteredCusts = customers.filter(c => c.shopName.toLowerCase().includes(custSearch.toLowerCase()) || c.customerName.toLowerCase().includes(custSearch.toLowerCase()));
  const filteredProds = visibleProducts.filter(p => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()));

  function getQty(pid: string) { return localCart.find(i => i.product.id === pid)?.quantity || 0; }
  function updateQty(product: Product, delta: number) {
    setLocalCart(prev => { const ex = prev.find(i => i.product.id === product.id); if (!ex && delta > 0) return [...prev, { product, quantity: delta, price: product.mrp }]; return prev.map(i => i.product.id === product.id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0); });
  }
  function handleViewCart() { if (!selectedCustomer) return; onUpdateCart(localCart); onViewCart(selectedCustomer.id); }
  const totalItems = localCart.reduce((s, i) => s + i.quantity, 0);
  const totalVal = localCart.reduce((s, i) => s + i.quantity * i.price, 0);

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <StatusBar />
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
          <h1 className="text-base font-extrabold text-gray-800">New Order</h1>
        </div>
        <button onClick={handleViewCart} disabled={localCart.length === 0} className="relative">
          <div className={`w-9 h-9 flex items-center justify-center rounded-full ${localCart.length > 0 ? "bg-[#1B4FD8]" : "bg-gray-200"}`}><ShoppingCart size={15} className={localCart.length > 0 ? "text-white" : "text-gray-400"} /></div>
          {totalItems > 0 && <div className="absolute -top-1 -right-1 bg-[#F59E0B] text-white rounded-full flex items-center justify-center font-bold" style={{ width: 18, height: 18, fontSize: 9 }}>{totalItems}</div>}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        <div className="px-4 py-3 bg-white border-b border-gray-100">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Customer / Shop</label>
          <div className="relative">
            <input className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20" placeholder="Search shop or customer..."
              value={selectedCustomer ? `${selectedCustomer.shopName} — ${selectedCustomer.customerName}` : custSearch}
              onChange={e => { setCustSearch(e.target.value); setSelectedCustomer(null); setShowCustList(true); }} onFocus={() => setShowCustList(true)} />
            {selectedCustomer && <button className="absolute right-3 top-1/2 -translate-y-1/2" onClick={() => { setSelectedCustomer(null); setCustSearch(""); }}><X size={14} className="text-gray-400" /></button>}
            {showCustList && !selectedCustomer && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-2xl z-30 max-h-36 overflow-y-auto">
                {filteredCusts.map(c => (
                  <button key={c.id} onClick={() => { setSelectedCustomer(c); setCustSearch(""); setShowCustList(false); }} className="w-full flex flex-col items-start px-4 py-2.5 border-b border-gray-50 last:border-0">
                    <span className="text-sm font-bold text-gray-800">{c.shopName}</span>
                    <span className="text-xs text-gray-400 font-medium">{c.customerName}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {selectedCustomer && (
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              {[{ label: "GST", value: selectedCustomer.gst }, { label: "Mobile", value: selectedCustomer.mobile }].map(f => (
                <div key={f.label} className="bg-gray-50 rounded-xl px-3 py-2"><p className="text-[10px] text-gray-400 font-bold">{f.label}</p><p className="text-xs font-bold text-gray-700 truncate">{f.value}</p></div>
              ))}
              <div className="col-span-2 bg-gray-50 rounded-xl px-3 py-2"><p className="text-[10px] text-gray-400 font-bold">Address</p><p className="text-xs font-bold text-gray-700">{selectedCustomer.address}</p></div>
            </div>
          )}
        </div>
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-3 py-2.5 mb-3">
            <Search size={13} className="text-gray-400" />
            <input className="flex-1 bg-transparent text-sm font-medium focus:outline-none" placeholder="Search products..." value={productSearch} onChange={e => setProductSearch(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            {filteredProds.map(p => {
              const qty = getQty(p.id);
              return (
                <div key={p.id} className="bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm border border-gray-50">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(27,79,216,.05)" }}><Package size={17} className="text-[#1B4FD8]/35" /></div>
                  <div className="flex-1 min-w-0"><p className="text-xs font-bold text-gray-800 leading-snug">{p.name}</p><p className="text-[10px] text-gray-400 font-medium">{p.category} · ₹{p.mrp}/{p.metric}</p></div>
                  <div className="flex items-center gap-1.5">
                    {qty > 0 ? (
                      <div className="flex items-center gap-1.5 rounded-xl px-2 py-1" style={{ background: "rgba(27,79,216,.07)" }}>
                        <button onClick={() => updateQty(p, -1)} className="w-6 h-6 flex items-center justify-center rounded-lg bg-white shadow-sm"><Minus size={9} className="text-[#1B4FD8]" /></button>
                        <span className="text-sm font-extrabold text-[#1B4FD8] w-5 text-center">{qty}</span>
                        <button onClick={() => updateQty(p, 1)} className="w-6 h-6 flex items-center justify-center rounded-lg bg-[#1B4FD8]"><Plus size={9} className="text-white" /></button>
                      </div>
                    ) : (
                      <button onClick={() => updateQty(p, 1)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#1B4FD8]"><Plus size={13} className="text-white" /></button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {localCart.length > 0 && (
        <div className="px-4 py-3 bg-white border-t border-gray-100">
          <button onClick={handleViewCart} className="w-full bg-[#1B4FD8] text-white rounded-2xl py-3.5 font-bold text-sm flex items-center justify-center gap-2" style={{ boxShadow: "0 8px 24px rgba(27,79,216,.3)" }}>
            <ShoppingCart size={15} />View Cart · {localCart.length} items · {fmt(totalVal)}
          </button>
        </div>
      )}
    </div>
  );
}

// ======================== CART ========================

function CartScreen({ cart, customerId, customers, mode, traderId, onBack, onConfirm }: {
  cart: CartItem[]; customerId: string; customers: Customer[];
  mode: AppMode; traderId: string; onBack: () => void;
  onConfirm: (o: Omit<Order, "id" | "date">) => void;
}) {
  const customer = customers.find(c => c.id === customerId)!;
  const [items, setItems] = useState<CartItem[]>([...cart]);

  function updPrice(idx: number, price: number) { setItems(prev => prev.map((it, i) => i === idx ? { ...it, price } : it)); }
  function updQty(idx: number, qty: number) { setItems(prev => prev.map((it, i) => i === idx ? { ...it, quantity: Math.max(1, qty) } : it)); }
  const total = items.reduce((s, i) => s + i.quantity * i.price, 0);

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <StatusBar />
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
        <h1 className="text-base font-extrabold text-gray-800">Cart</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        {/* Customer — display only, not editable */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Customer Details</p>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-[#1B4FD8]/10 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-[#1B4FD8] font-extrabold">{customer.customerName.charAt(0)}</span></div>
            <div><p className="text-sm font-bold text-gray-800">{customer.shopName}</p><p className="text-xs text-gray-500 font-medium">{customer.customerName}</p></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[{ label: "GST", value: customer.gst }, { label: "Mobile", value: customer.mobile }].map(f => (
              <div key={f.label} className="bg-gray-50 rounded-xl px-3 py-2"><p className="text-[9px] text-gray-400 font-bold uppercase">{f.label}</p><p className="text-xs font-bold text-gray-700 truncate">{f.value}</p></div>
            ))}
            <div className="col-span-2 bg-gray-50 rounded-xl px-3 py-2"><p className="text-[9px] text-gray-400 font-bold uppercase">Address</p><p className="text-xs font-bold text-gray-700">{customer.address}</p></div>
          </div>
        </div>
        {/* Items — table format: Item | Unit | ₹/unit | Total */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Items</p></div>
          <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-100">
            <p className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Item</p>
            <p className="w-16 text-[9px] font-bold text-gray-400 uppercase text-center">Unit</p>
            <p className="w-14 text-[9px] font-bold text-gray-400 uppercase text-right">₹/unit</p>
            <p className="w-16 text-[9px] font-bold text-gray-400 uppercase text-right">Total</p>
          </div>
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center px-4 py-3 border-b border-gray-50 last:border-0">
              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs font-bold text-gray-800 truncate">{item.product.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <button onClick={() => updQty(idx, item.quantity - 1)} className="w-4 h-4 flex items-center justify-center rounded bg-gray-100"><Minus size={7} /></button>
                  <span className="text-[10px] font-extrabold text-gray-700 mx-0.5">{item.quantity}</span>
                  <button onClick={() => updQty(idx, item.quantity + 1)} className="w-4 h-4 flex items-center justify-center rounded bg-gray-200"><Plus size={7} /></button>
                </div>
              </div>
              <p className="w-16 text-xs font-bold text-gray-600 text-center">{item.quantity} {item.product.metric}</p>
              <div className="w-14 flex justify-end">
                <input type="number" className="w-12 border rounded-lg px-1.5 py-0.5 text-xs font-extrabold text-right focus:outline-none" style={{ background: "rgba(27,79,216,.05)", borderColor: "rgba(27,79,216,.15)", color: "#1B4FD8" }} value={item.price} onChange={e => updPrice(idx, Number(e.target.value))} />
              </div>
              <p className="w-16 text-xs font-extrabold text-gray-800 text-right">{fmt(item.quantity * item.price)}</p>
            </div>
          ))}
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100" style={{ background: "rgba(27,79,216,.04)" }}>
            <p className="text-sm font-extrabold text-gray-800">Grand Total</p>
            <p className="text-base font-extrabold text-[#1B4FD8]">{fmt(total)}</p>
          </div>
        </div>
        <div className="bg-[#1B4FD8] rounded-2xl p-4" style={{ boxShadow: "0 12px 32px rgba(27,79,216,.25)" }}>
          <div className="flex justify-between items-center">
            <div><p className="text-blue-200/70 text-xs font-bold uppercase tracking-widest">Total Amount</p><p className="text-white text-2xl font-extrabold">{fmt(total)}</p></div>
            <div className="text-right"><p className="text-blue-200/70 text-xs font-medium">{items.length} products</p><p className="text-white text-sm font-bold">{items.reduce((s, i) => s + i.quantity, 0)} units</p></div>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <button onClick={() => onConfirm({ mode, traderId: mode === "wholesale" ? traderId : undefined, customerId: customer.id, customerName: customer.customerName, shopName: customer.shopName, status: "pending", items, total })}
          className="w-full bg-[#1B4FD8] text-white rounded-2xl py-3.5 font-extrabold text-sm" style={{ boxShadow: "0 8px 24px rgba(27,79,216,.35)" }}>
          Confirm Order
        </button>
      </div>
    </div>
  );
}

// ======================== ORDER CONFIRM ========================

function OrderConfirmScreen({ order, onHome }: { order: Order; onHome: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col items-center py-8 gap-3">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center" style={{ boxShadow: "0 12px 40px rgba(16,185,129,.35)" }}><CheckCircle size={40} className="text-white" /></div>
          <h2 className="text-xl font-extrabold text-gray-800">Order Placed!</h2>
          <p className="text-gray-400 text-sm font-medium text-center">Your order has been placed successfully.</p>
          <span className="font-extrabold text-sm px-4 py-1.5 rounded-full font-mono" style={{ background: "rgba(27,79,216,.1)", color: "#1B4FD8" }}>{order.id}</span>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 mb-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Customer</p>
          <p className="text-sm font-extrabold text-gray-800">{order.shopName}</p>
          <p className="text-xs text-gray-400 font-medium">{order.customerName}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden mb-3">
          <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-100">
            <p className="flex-1 text-[9px] font-bold text-gray-400 uppercase">Item</p>
            <p className="w-16 text-[9px] font-bold text-gray-400 uppercase text-center">Unit</p>
            <p className="w-14 text-[9px] font-bold text-gray-400 uppercase text-right">Rate</p>
            <p className="w-16 text-[9px] font-bold text-gray-400 uppercase text-right">Total</p>
          </div>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center px-4 py-2.5 border-b border-gray-50 last:border-0">
              <div className="flex-1 min-w-0 pr-2"><p className="text-xs font-bold text-gray-700 truncate">{item.product.name}</p></div>
              <p className="w-16 text-[10px] font-bold text-gray-500 text-center">{item.quantity} {item.product.metric}</p>
              <p className="w-14 text-[10px] font-bold text-gray-600 text-right">₹{item.price}</p>
              <p className="w-16 text-xs font-extrabold text-gray-800 text-right">{fmt(item.quantity * item.price)}</p>
            </div>
          ))}
          <div className="flex justify-between px-4 py-3 border-t border-gray-100" style={{ background: "rgba(27,79,216,.04)" }}>
            <p className="text-sm font-extrabold text-gray-800">Grand Total</p>
            <p className="text-base font-extrabold text-[#1B4FD8]">{fmt(order.total)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-auto pt-2">
          <button className="w-full flex items-center justify-center gap-2 border-2 border-[#1B4FD8]/25 text-[#1B4FD8] rounded-2xl py-3 font-bold text-sm"><Download size={15} />Download Invoice</button>
          <button onClick={onHome} className="w-full bg-[#1B4FD8] text-white rounded-2xl py-3.5 font-extrabold text-sm" style={{ boxShadow: "0 8px 24px rgba(27,79,216,.35)" }}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}

// ======================== PROFILE DASHBOARD ========================

function ProfileDashboardScreen({ onBack }: { onBack: () => void }) {
  const stats = [
    { label: "Active Orders", value: "12", icon: <ClipboardList size={19} />, color: "#1B4FD8" }, { label: "Credit Limit", value: "₹5L", icon: <CreditCard size={19} />, color: "#7C3AED" },
    { label: "Total Invoiced", value: "₹24.8L", icon: <FileText size={19} />, color: "#059669" }, { label: "Weekly Sales", value: "₹3.2L", icon: <TrendingUp size={19} />, color: "#F59E0B" },
    { label: "Monthly Sales", value: "₹12.6L", icon: <DollarSign size={19} />, color: "#EF4444" }, { label: "Total Orders", value: "284", icon: <Package size={19} />, color: "#06B6D4" },
  ];
  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <div className="bg-gradient-to-b from-[#1B4FD8] to-[#1e40af]">
        <StatusBar light />
        <div className="flex items-center gap-3 px-4 pb-4"><button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15"><ArrowLeft size={17} className="text-white" /></button><h1 className="text-base font-extrabold text-white">Profile Dashboard</h1></div>
        <div className="flex flex-col items-center pb-6 pt-1 gap-2">
          <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center"><User size={30} className="text-white" /></div>
          <p className="text-white font-extrabold text-base">Rajesh Distributor</p>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /><p className="text-blue-200/80 text-xs font-medium">Nestlé India Ltd. · Active</p></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        <div className="grid grid-cols-2 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5" style={{ background: `${s.color}15` }}><span style={{ color: s.color }}>{s.icon}</span></div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{s.label}</p>
              <p className="text-xl font-extrabold text-gray-800">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <div className="flex justify-between items-center mb-3"><p className="text-sm font-extrabold text-gray-800">Monthly Target</p><span className="text-xs font-bold text-[#1B4FD8]">84%</span></div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2"><div className="h-2 rounded-full bg-gradient-to-r from-[#1B4FD8] to-[#60a5fa]" style={{ width: "84%" }} /></div>
          <div className="flex justify-between"><span className="text-[11px] text-gray-400 font-medium">₹12.6L achieved</span><span className="text-[11px] text-gray-400 font-medium">Target: ₹15L</span></div>
        </div>
      </div>
    </div>
  );
}

// ======================== SALES REPORT ========================

function SalesReportScreen({ onBack }: { onBack: () => void }) {
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");
  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <div className="bg-gradient-to-b from-[#1B4FD8] to-[#1e40af]">
        <StatusBar light />
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex items-center gap-3"><button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15"><ArrowLeft size={17} className="text-white" /></button><h1 className="text-base font-extrabold text-white">Sales Report</h1></div>
          <div className="flex gap-1 bg-white/10 p-1 rounded-xl">
            {(["weekly", "monthly"] as const).map(p => (<button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1 rounded-lg text-xs font-bold capitalize ${period === p ? "bg-white text-[#1B4FD8]" : "text-white/70"}`}>{p}</button>))}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        <div className="grid grid-cols-2 gap-3">
          {[{ label: "Total Revenue", value: "₹12.6L", change: "+18.3%", up: true }, { label: "Orders", value: "284", change: "+24 this month", up: true }, { label: "Avg Order Value", value: "₹4,436", change: "-2.1%", up: false }, { label: "New Customers", value: "8", change: "+3 this month", up: true }].map(kpi => (
            <div key={kpi.label} className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-50">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className="text-lg font-extrabold text-gray-800">{kpi.value}</p>
              <p className={`text-xs font-bold ${kpi.up ? "text-emerald-500" : "text-red-400"}`}>{kpi.change}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <p className="text-sm font-extrabold text-gray-800 mb-3">Sales Trend — 6 Months</p>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={SALES_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1B4FD8" stopOpacity={0.2} /><stop offset="95%" stopColor="#1B4FD8" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 9 }} tickFormatter={v => `${(v / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`₹${(v / 100000).toFixed(1)}L`, "Sales"]} />
              <Area type="monotone" dataKey="sales" stroke="#1B4FD8" strokeWidth={2.5} fill="url(#grad)" dot={{ fill: "#1B4FD8", strokeWidth: 0, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <p className="text-sm font-extrabold text-gray-800 mb-3">Category Breakdown</p>
          <div className="flex items-center gap-2">
            <ResponsiveContainer width={110} height={110}><PieChart><Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={28} outerRadius={52} dataKey="value" strokeWidth={0}>{CATEGORY_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}</Pie></PieChart></ResponsiveContainer>
            <div className="flex flex-col gap-1.5 flex-1">
              {CATEGORY_DATA.map((d, i) => (<div key={d.name} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} /><span className="text-xs text-gray-500 font-medium flex-1">{d.name}</span><span className="text-xs font-extrabold text-gray-700">{d.value}%</span></div>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ======================== MAIN APP ========================

export default function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [mode, setMode] = useState<AppMode>("wholesale");
  const [traderId, setTraderId] = useState("");
  const [traders,setTraders] = useState<Trader[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<Record<string, PaymentRecord>>({});
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartCustomerId, setCartCustomerId] = useState("");
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // useEffect(() => {
  //   async function loadData() {
  //     try {
  //       const [tradersData, productsData, customersData, ordersData, paymentsData] = await Promise.all([
  //         api<Trader[]>('/traders'),
  //         api<Product[]>('/products'),
  //         api<Customer[]>('/customers'),
  //         api<Order[]>('/orders'),
  //         api<Record<string, PaymentRecord>>('/payments'),
  //       ]);

  //       setTraders(tradersData || []);
  //       setProducts(productsData || []);
  //       setCustomers(customersData || []);
  //       setOrders(ordersData || []);
  //       setPayments(paymentsData || {});
  //     } catch (error) {
  //       console.error('Failed to load app data', error);
  //     }
  //   }

  //   loadData();
  // }, []);

  function go(s: Screen) { setScreen(s); }

  async function addCustomer(data: Omit<Customer, "id">) {
    const created = await api<Customer>('/customers', { method: 'POST', body: JSON.stringify(data) });
    setCustomers(p => [...p, created]);
    go("manage-customers");
  }

  async function updateCustomer(data: Omit<Customer, "id">) {
    const updated = await api<Customer>(`/customers/${editingCustomer?.id}`, { method: 'PUT', body: JSON.stringify(data) });
    setCustomers(p => p.map(c => c.id === updated.id ? updated : c));
    go("manage-customers");
  }

  async function addProduct(data: Omit<Product, "id">) {
    const created = await api<Product>('/products', { method: 'POST', body: JSON.stringify(data) });
    setProducts(p => [...p, created]);
    go("manage-inventory");
  }

  async function restockProduct(productId: string, qty: number) {
    const updated = await api<Product>(`/products/${productId}/restock`, { method: 'PUT', body: JSON.stringify({ qty }) });
    setProducts(p => p.map(prod => prod.id === productId ? updated : prod));
    go("manage-inventory");
  }

  async function placeOrder(data: Omit<Order, "id" | "date">) {
    const order = await api<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify({ ...data, date: new Date().toISOString().slice(0, 10), payment: { status: 'unpaid', amountPaid: 0 } }),
    });
    setOrders(p => [...p, order]);
    setCurrentOrder(order);
    setCart([]);
    go("order-confirm");
  }

  async function saveEditedOrder(updated: Order) {
    const persisted = await api<Order>(`/orders/${updated.id}`, { method: 'PUT', body: JSON.stringify(updated) });
    setOrders(p => p.map(o => o.id === persisted.id ? persisted : o));
    go("orders-list");
  }

  const content = (() => {
    switch (screen) {
      case "splash": return <SplashScreen onComplete={() => go("login")} />;
      case "login": return <LoginScreen onLogin={() => go("business-select")} onRegister={() => go("register")} />;
      case "register": return <RegisterScreen onBack={() => go("login")} onRegister={() => go("login")} />;
      case "business-select": return (
        <BusinessSelectScreen
          onWholesale={id => { setMode("wholesale"); setTraderId(id); go("home"); }}
          onRetail={() => { setMode("retail"); setTraderId(""); go("home"); }}
          onManageCustomers={() => go("manage-customers")}
          onManageInventory={() => go("manage-inventory")}
        />
      );
      case "manage-inventory": return <ManageInventoryScreen onBack={() => go("business-select")} onAdd={() => go("add-product")} onRestock={() => go("restock-goods")} onView={() => go("view-inventory")} />;
      case "add-product": return <AddProductScreen onBack={() => go("manage-inventory")} onSave={addProduct} />;
      case "restock-goods": return <RestockGoodsScreen products={products} onBack={() => go("manage-inventory")} onSave={restockProduct} />;
      case "view-inventory": return <ViewInventoryScreen products={products} onBack={() => go(screen === "view-inventory" && traderId ? "home" : "manage-inventory")} />;
      case "manage-customers": return (
        <ManageCustomersScreen customers={customers} onBack={() => go("business-select")}
          onAdd={() => { setEditingCustomer(null); go("add-customer"); }}
          onView={c => { setSelectedCustomer(c); go("view-customer"); }}
          onEdit={c => { setEditingCustomer(c); go("edit-customer"); }}
          onDelete={async id => {
            await api(`/customers/${id}`, { method: 'DELETE' });
            setCustomers(p => p.filter(c => c.id !== id));
          }} />
      );
      case "add-customer": return <AddEditCustomerScreen onBack={() => go("manage-customers")} onSave={addCustomer} />;
      case "edit-customer": return <AddEditCustomerScreen customer={editingCustomer || undefined} onBack={() => go("manage-customers")} onSave={updateCustomer} />;
      case "view-customer": return <ViewCustomerScreen customer={selectedCustomer!} onBack={() => go("manage-customers")} />;
      case "home": return (
        <HomeScreen mode={mode} traderId={traderId} products={products}
          onOrders={() => go("orders-list")} onTransactions={() => go("transactions")}
          onInventory={() => go("view-inventory")} onSwitch={() => go("business-select")}
          onSalesReport={() => go("sales-report")} onProfile={() => go("profile-dashboard")} />
      );
      case "profile-dashboard": return <ProfileDashboardScreen onBack={() => go("home")} />;
      case "sales-report": return <SalesReportScreen onBack={() => go("home")} />;
      case "transactions": return <TransactionsScreen orders={orders} payments={payments} mode={mode} traderId={traderId} onBack={() => go("home")} onUpdatePayment={async (id, rec) => {
        const persisted = await api<Record<string, PaymentRecord>>(`/payments/${id}`, { method: 'PUT', body: JSON.stringify(rec) });
        setPayments(p => ({ ...p, [id]: rec }));
      }} />;
      case "orders-list": return (
        <OrdersListScreen orders={orders} mode={mode} traderId={traderId} onBack={() => go("home")}
          onAdd={() => { setCart([]); go("add-order"); }}
          onView={o => { setViewingOrder(o); go("view-order"); }}
          onEdit={o => { setEditingOrder(o); go("edit-order"); }}
          onDelete={async id => {
            await api(`/orders/${id}`, { method: 'DELETE' });
            setOrders(p => p.filter(o => o.id !== id));
          }}
          onUpdateStatus={async (id, s) => {
            const updated = await api<Order>(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: s }) });
            setOrders(p => p.map(o => o.id === id ? updated : o));
          }} />
      );
      case "view-order": return viewingOrder ? <ViewOrderScreen order={viewingOrder} payment={payments[viewingOrder.id]} onBack={() => go("orders-list")} /> : null;
      case "edit-order": return editingOrder ? <EditOrderScreen order={editingOrder} products={mode === "retail" ? products : products.filter(p => p.traderId === traderId)} onBack={() => go("orders-list")} onSave={saveEditedOrder} /> : null;
      case "add-order": return <AddOrderScreen customers={customers} cart={cart} products={products} mode={mode} traderId={traderId} onBack={() => go("orders-list")} onUpdateCart={setCart} onViewCart={cid => { setCartCustomerId(cid); go("cart"); }} />;
      case "cart": return <CartScreen cart={cart} customerId={cartCustomerId} customers={customers} mode={mode} traderId={traderId} onBack={() => go("add-order")} onConfirm={placeOrder} />;
      case "order-confirm": return currentOrder ? <OrderConfirmScreen order={currentOrder} onHome={() => go("home")} /> : null;
      default: return null;
    }
  })();

  return <PhoneFrame>{content}</PhoneFrame>;
}
