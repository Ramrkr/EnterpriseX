import { Archive, ArrowLeft, ChevronDown, Plus, RotateCcw } from "lucide-react";
import { StatusBar } from "./phone-frame";
import { loadAppData } from "../loadAppData";
import { useAppData } from "../useAppData";
import { useNavigate } from "react-router";

export function ManageInventoryScreen() {
  
  const {traders,products} = useAppData();
  const navigate = useNavigate();
  const options = [
    { label: "Add Product", desc: "Add a new product to the shared pool", icon: <Plus size={22} className="text-[#1B4FD8]" />, bg: "rgba(27,79,216,.08)", action: ()=>navigate("/add-product") },
    { label: "Restock Goods", desc: "Add stock to existing products", icon: <RotateCcw size={22} className="text-emerald-600" />, bg: "rgba(16,185,129,.08)", action: ()=>navigate("/restock-goods") },
    { label: "View Inventory", desc: "Browse and manage all stock", icon: <Archive size={22} className="text-[#F59E0B]" />, bg: "rgba(245,158,11,.08)", action: ()=>navigate("/view-inventory") },
  ];

  let totalNoOfUnits = 0;
  products.forEach(p=> {
    totalNoOfUnits+=p.stock
  });
    console.log(totalNoOfUnits);

  
  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <StatusBar />
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
        <button onClick={()=>navigate("/business-select")} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
        <h1 className="text-base font-extrabold text-gray-800">Manage Inventory</h1>
      </div>
      <div className="flex-1 px-5 py-5 flex flex-col gap-4">
        <div className="bg-[#1B4FD8] rounded-2xl p-5 mb-1" style={{ boxShadow: "0 12px 32px rgba(27,79,216,.25)" }}>
          <p className="text-blue-200/70 text-[10px] font-bold uppercase tracking-widest mb-1">Shared Pool</p>
          <p className="text-white font-extrabold text-base leading-snug">Centralized inventory for all wholesale & retail</p>
          <div className="flex gap-5 mt-3">
            <div><p className="text-white font-extrabold text-lg">{products.length}</p><p className="text-blue-200/70 text-xs font-medium">Products</p></div>
            <div className="w-px bg-white/15" />
            <div><p className="text-white font-extrabold text-lg">{traders.length}</p><p className="text-blue-200/70 text-xs font-medium">Traders</p></div>
            <div className="w-px bg-white/15" />
            <div><p className="text-white font-extrabold text-lg">{totalNoOfUnits}</p><p className="text-blue-200/70 text-xs font-medium">Units in Stock</p></div>
          </div>
        </div>
        {options.map(o => (
          <button key={o.label} onClick={o.action} className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100 w-full text-left">
            <div className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center" style={{ background: o.bg }}>{o.icon}</div>
            <div className="flex-1"><p className="text-sm font-extrabold text-gray-800">{o.label}</p><p className="text-xs text-gray-400 font-medium mt-0.5">{o.desc}</p></div>
            <ChevronDown size={15} className="text-gray-300 -rotate-90" />
          </button>
        ))}
      </div>
    </div>
  );
}