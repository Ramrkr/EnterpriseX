import { useState } from "react";
import { Product } from "../models";
import { Metric } from "../types";
import { loadAppData } from "../loadAppData";
import { StatusBar } from "./phone-frame";
import { ArrowLeft, ChevronDown, Hash, Layers, Package, Tag } from "lucide-react";
import { useAppData } from "../useAppData";
import { useAddProduct } from "../../api/products";
import { useNavigate } from "react-router";

export const METRIC_OPTIONS: { value: Metric; label: string }[] = [
  { value: "piece", label: "Piece" }, { value: "box", label: "Box" },
  { value: "kg", label: "Kg" }, { value: "litre", label: "Litre" }, { value: "packet", label: "Packet" },
];

export function AddProductScreen() {

  const [form, setForm] = useState({ traderId: "" as string | null, company: "", name: "", sku: "", category: "", description: "", metric: "piece" as Metric, unitsPerBox: "", landingPrice: "", mrp: "", stock: "" });
  const [traderDrop, setTraderDrop] = useState(false);
  const { traders } = useAppData();
  const addProduct = useAddProduct();

  const navigate = useNavigate();

  const traderLabel = form.traderId === null ? "Retail (All)" : form.traderId ? traders.find(t => t.id === form.traderId)?.name || "" : "";

  function handleSave(){
    if (!form.name || !form.sku || !form.mrp || !form.stock) return;
    const payload : Omit<Product,'id'> = {traderId: form.traderId,
      company: form.company, name: form.name, sku: form.sku, category: form.category, description: form.description,
      metric: form.metric, unitsPerBox: form.metric === "box" && form.unitsPerBox ? Number(form.unitsPerBox) : undefined,
      landingPrice: Number(form.landingPrice), mrp: Number(form.mrp), stock: Number(form.stock)}
    addProduct.mutate(payload);
    navigate('/manage-inventory');
  }

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <StatusBar />
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100">
        <button onClick={()=>navigate("/manage-inventory")} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
        <h1 className="text-base font-extrabold text-gray-800">Add Product</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
        {/* Trader */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Trader Account</label>
          <div className="relative">
            <button onClick={() => setTraderDrop(!traderDrop)} className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm">
              <span className={traderLabel ? "text-gray-800 font-semibold" : "text-gray-400"}>{traderLabel || "Select trader or retail..."}</span>
              <ChevronDown size={15} className="text-gray-400" />
            </button>
            {traderDrop && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-2xl z-30 overflow-hidden">
                <button onClick={() => { setForm(p => ({ ...p, traderId: null })); setTraderDrop(false); }} className="w-full flex flex-col items-start px-4 py-3 border-b border-gray-50 hover:bg-amber-50">
                  <span className="text-sm font-bold text-amber-600">Retail (All)</span>
                  <span className="text-xs text-gray-400">Visible to all retail operations</span>
                </button>
                {traders.map(t => (
                  <button key={t.id} onClick={() => { setForm(p => ({ ...p, traderId: t.id })); setTraderDrop(false); }} className="w-full flex flex-col items-start px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50">
                    <span className="text-sm font-bold text-gray-800">{t.name}</span>
                    <span className="text-xs text-gray-400">{t.company}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        {[
          { label: "Company", key: "company", ph: "e.g. Nestlé India", icon: <Layers size={13} /> },
          { label: "Product Name", key: "name", ph: "e.g. Maggi Noodles 70g", icon: <Package size={13} /> },
          { label: "SKU", key: "sku", ph: "e.g. NES-MAG-70", icon: <Hash size={13} /> },
          { label: "Category", key: "category", ph: "e.g. Instant Food", icon: <Tag size={13} /> },
        ].map(f => (
          <div key={f.key}>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">{f.icon}{f.label}</label>
            <input className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20" placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
          </div>
        ))}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Description</label>
          <textarea className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20 resize-none" rows={2} placeholder="Brief product description..." value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
        </div>
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Quantity Metric</label>
          <div className="flex gap-2 flex-wrap">
            {METRIC_OPTIONS.map(m => (
              <button key={m.value} onClick={() => setForm(p => ({ ...p, metric: m.value }))}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${form.metric === m.value ? "bg-[#1B4FD8] text-white border-[#1B4FD8]" : "bg-white text-gray-500 border-gray-200"}`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>
        {form.metric === "box" && (
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Units per Box</label>
            <input type="number" className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none" placeholder="e.g. 12" value={form.unitsPerBox} onChange={e => setForm(p => ({ ...p, unitsPerBox: e.target.value }))} />
          </div>
        )}
        <div className="grid grid-cols-3 gap-3">
          {[{ label: "Landing ₹", key: "landingPrice", ph: "Cost" }, { label: "MRP/Unit ₹", key: "mrp", ph: "Price" }, { label: "Stock", key: "stock", ph: "Qty" }].map(f => (
            <div key={f.key}>
              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">{f.label}</label>
              <input type="number" className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20" placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
            </div>
          ))}
        </div>
        {form.landingPrice && form.mrp && Number(form.mrp) > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
            <p className="text-xs text-emerald-600 font-bold">Margin: {Math.round(((Number(form.mrp) - Number(form.landingPrice)) / Number(form.mrp)) * 100)}% · Profit: ₹{(Number(form.mrp) - Number(form.landingPrice)).toFixed(2)}/unit</p>
          </div>
        )}
        <button onClick={handleSave} className="w-full bg-[#1B4FD8] text-white rounded-2xl py-3.5 font-bold text-sm mt-1" style={{ boxShadow: "0 8px 24px rgba(27,79,216,.3)" }}>Add Product</button>
      </div>
    </div>
  );
}
