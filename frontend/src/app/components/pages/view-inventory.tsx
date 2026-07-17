import { useState } from "react";
import { ArrowLeft, ChevronDown, Download, Edit, Eye, MoreVertical, Package, Search } from "lucide-react";
import { StatusBar } from "./phone-frame";
import { loadAppData } from "../loadAppData";
import { useAppData } from "../useAppData";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export function ViewInventoryScreen() {
  const [traderFilter, setTraderFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [traderDrop, setTraderDrop] = useState(false);

  const { traders ,products } = useAppData();
  const navigate = useNavigate();
  const traderId = useSelector((state:RootState)=>state.trader.traderId);

  const filtered = products.filter(p => {
    const matchTrader = traderFilter === "all" || p.traderId === traderFilter || (traderFilter === "retail" && p.traderId === null);
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    return matchTrader && matchSearch;
  });

  const onBack =() =>{
    traderId ? navigate(`/home/${traderId}`) : navigate('/home');
  }

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
              {traderFilter === "all" ? "All Traders" : traderFilter === "retail" ? "Retail" : traders.find(t => t.id === traderFilter)?.name?.split(" ")[0]}
            </span>
            <ChevronDown size={12} className="text-gray-400 flex-shrink-0 ml-1" />
          </button>
          {traderDrop && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl z-30 overflow-hidden">
              {[{ id: "all", label: "All Traders" }, { id: "retail", label: "Retail (General)" }, ...traders.map(t => ({ id: t.id, label: t.name }))].map(opt => (
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
