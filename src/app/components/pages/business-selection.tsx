import { useEffect, useState } from "react";
import { StatusBar } from "./phone-frame";
import { Archive, ChevronDown, Store, Truck, User, Users } from "lucide-react";
import { loadAppData } from "../loadAppData";
import { Trader } from "../models";

export function BusinessSelectScreen({ onWholesale, onRetail, onManageCustomers, onManageInventory }: {
  onWholesale: (id: string) => void; onRetail: () => void;
  onManageCustomers: () => void; onManageInventory: () => void;
}) {
  const [selectedTrader, setSelectedTrader] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const { traders } = loadAppData();  
  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <StatusBar />
      <div className="px-5 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-extrabold text-gray-800">Select Business</h1>
          <p className="text-gray-400 text-xs font-medium">Choose your mode to continue</p>
        </div>
        <div className="w-10 h-10 bg-[#1B4FD8] rounded-full flex items-center justify-center"><User size={17} className="text-white" /></div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-1 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        {/* Wholesale */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-y-auto">
          <div className="bg-gradient-to-br from-[#1B4FD8] to-[#1e40af] p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center"><Truck size={22} className="text-white" strokeWidth={1.5} /></div>
              <div><h2 className="text-white font-extrabold text-base">Wholesale</h2><p className="text-blue-200/80 text-xs font-medium">Dealer & Distributor Management</p></div>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Trader Account</label>
              <div className="relative">
                <button onClick={() => setDropdown(!dropdown)} className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm">
                  <span className={selectedTrader ? "text-gray-800 font-semibold" : "text-gray-400"}>
                    {selectedTrader ? traders.find(t => t.id === selectedTrader)?.name : "Choose trader account..."}
                  </span>
                  <ChevronDown size={15} className={`text-gray-400 transition-transform ${dropdown ? "rotate-180" : ""}`} />
                </button>
                {dropdown && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-auto">
                    {traders.map(t => (
                      <button key={`${t.name}-${t.id}`} onClick={() => { setSelectedTrader(t.id); setDropdown(false); }}
                        className={`w-full flex flex-col items-start px-4 py-3 border-b border-gray-50 last:border-0 ${selectedTrader === t.id ? "bg-[#1B4FD8]/5" : "hover:bg-gray-50"}`}>
                        <span className="text-sm font-bold text-gray-800">{t.name}</span>
                        <span className="text-xs text-gray-400">{t.company}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => selectedTrader && onWholesale(selectedTrader)}
              className={`w-full py-3 rounded-xl text-sm font-bold ${selectedTrader ? "bg-[#1B4FD8] text-white" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
              style={selectedTrader ? { boxShadow: "0 6px 20px rgba(27,79,216,.3)" } : {}}>
              Enter Trader Account
            </button>
            <button onClick={onManageCustomers} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-[#1B4FD8]/20 text-[#1B4FD8] text-sm font-bold">
              <Users size={14} />Manage Customers
            </button>
          </div>
        </div>
        {/* Retail */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-[#F59E0B] to-[#d97706] p-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/15 rounded-2xl flex items-center justify-center"><Store size={22} className="text-white" strokeWidth={1.5} /></div>
              <div><h2 className="text-white font-extrabold text-base">Retail</h2><p className="text-amber-100/80 text-xs font-medium">Direct Consumer Sales</p></div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-gray-400 text-sm mb-3 font-medium">All products at retail prices for direct walk-in customers.</p>
            <button onClick={onRetail} className="w-full bg-[#F59E0B] text-white py-3 rounded-xl text-sm font-bold" style={{ boxShadow: "0 6px 20px rgba(245,158,11,.3)" }}>Enter Retail Mode</button>
          </div>
        </div>
        {/* Manage Inventory */}
        <button onClick={onManageInventory} className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-gray-100">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: "rgba(27,79,216,.08)" }}><Archive size={20} className="text-[#1B4FD8]" /></div>
          <div className="flex-1 text-left"><p className="text-sm font-extrabold text-gray-800">Manage Inventory</p><p className="text-xs text-gray-400 font-medium">Add products, restock & view stock</p></div>
          <ChevronDown size={15} className="text-gray-300 -rotate-90" />
        </button>
      </div>
    </div>
  );
}