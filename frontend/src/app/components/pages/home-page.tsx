import { useState } from "react";
import { Product } from "../models";
import { loadAppData } from "../loadAppData";
import { ArrowLeftRight, BarChart2, Bell, ClipboardList, Gift, Menu, Package, Receipt, Search, Store, Tag, User } from "lucide-react";
import { StatusBar } from "./phone-frame";
import { AppMode } from "../types";
import { CATEGORIES, SCHEMES } from "../mock-data";
import { useAppData } from "../useAppData";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export function HomeScreen(){

  const [drawer, setDrawer] = useState(false);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const mode = useSelector((state:RootState)=>state.mode);

  // const traderId = useSelector((state:RootState)=>state.trader.traderId);

  const { traderId } = useParams();

  const {traders,products} = useAppData();
  const navigate = useNavigate();
  const trader = traderId ? traders.find(t => t.id === traderId) : null ;
  const visibleProducts = mode === "retail" ? products : products.filter(p => p.traderId === traderId);
  const filtered = visibleProducts.filter(p => (category === "All" || p.category === category) && (!search || p.name.toLowerCase().includes(search.toLowerCase())));
  const isRetail = mode === "retail";
  const accentBg = isRetail ? "bg-[#F59E0B]" : "bg-[#1B4FD8]";
  const navItems = [
    { label: "Orders", icon: <ClipboardList size={20} />, action: ()=>navigate("/orders-list") },
    { label: "Transactions", icon: <Receipt size={20} />, action: ()=>navigate("/transactions") },
    { label: "Inventory", icon: <Package size={20} />, action: ()=>navigate("/view-inventory") },
    { label: "Switch", icon: <ArrowLeftRight size={20} />, action: ()=>navigate("/business-select") },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF] relative">
      {drawer && (
        <div className="absolute inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
          <div className="relative w-[280px] bg-white h-full flex flex-col shadow-2xl z-50">
            <div className={`px-5 pt-14 pb-7 ${isRetail ? "bg-gradient-to-b from-[#F59E0B] to-[#d97706]" : "bg-gradient-to-b from-[#1B4FD8] to-[#1e40af]"}`}>
              <div className="w-14 h-14 bg-white/15 rounded-full flex items-center justify-center mb-3"><User size={28} className="text-white" /></div>
              <p className="text-white font-extrabold text-sm">{isRetail ? "Retail Mode" : trader?.name}</p>
              <p className="text-white/70 text-xs mt-0.5 font-medium">{isRetail ? "General Store" : trader?.company}</p>
            </div>
            <div className="flex-1 py-3">
              {[{ label: "Home", icon: <Store size={17} />, action: () => setDrawer(false) }, { label: "Profile Dashboard", icon: <User size={17} />, action: () => { setDrawer(false); navigate("profile-dashboard"); } }, { label: "Sales Report", icon: <BarChart2 size={17} />, action: () => { setDrawer(false); navigate("sales-report"); } }, { label: "Schemes & Offers", icon: <Tag size={17} />, action: () => setDrawer(false) }].map(item => (
                <button key={item.label} onClick={item.action} className="w-full flex items-center gap-4 px-5 py-3.5 text-gray-600 hover:bg-gray-50 font-semibold text-sm">{item.icon}{item.label}</button>
              ))}
            </div>
            <button onClick={()=>navigate("business-select")} className="flex items-center gap-3 px-5 py-4 border-t border-gray-100 text-red-400 text-sm font-bold"><ArrowLeftRight size={15} />Switch Business</button>
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
