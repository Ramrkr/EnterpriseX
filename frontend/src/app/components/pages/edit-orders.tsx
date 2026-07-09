import { useState } from "react";
import { CartItem, Order, Product } from "../models";
import { StatusBar } from "./phone-frame";
import { ArrowLeft, Minus, Plus, Search, X } from "lucide-react";
import { fmt } from "../utility";

export function EditOrderScreen({ order, products, onBack, onSave }: {
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
