import { useState } from "react";
import { Product } from "../models";
import { StatusBar } from "./phone-frame";
import { ArrowLeft, ChevronDown, Package } from "lucide-react";
import { loadAppData } from "../loadAppData";

export function RestockGoodsScreen({ onBack, onSave }: {
   onBack: () => void; onSave: (productId: string, qty: number) => void;
}) {

  const { traders,products } = loadAppData();
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
              <span className={traderFilter ? "text-gray-800 font-semibold" : "text-gray-400"}>{traderFilter ? traders.find(t => t.id === traderFilter)?.name : "All Traders"}</span>
              <ChevronDown size={15} className="text-gray-400" />
            </button>
            {traderDrop && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-2xl z-30 overflow-hidden">
                <button onClick={() => { setTraderFilter(""); setTraderDrop(false); }} className="w-full text-left px-4 py-3 border-b border-gray-50 text-sm font-medium text-gray-500">All Traders</button>
                {traders.map(t => (
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
