import { useRef, useState } from "react";
import { Order } from "../models";
import { AppMode } from "../types";
import { StatusBar } from "./phone-frame";
import { ArrowLeft, Check, ClipboardList, Download, Edit, Eye, MoreVertical, Plus, Search, Trash2, X } from "lucide-react";
import { StatusBadge } from "../badges";
import { fmt } from "../utility";

export function OrdersListScreen({ orders, mode, traderId, onBack, onAdd, onView, onEdit, onDelete, onUpdateStatus }: {
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
