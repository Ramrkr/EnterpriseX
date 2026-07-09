import { useState } from "react";
import { CartItem, Customer, Product } from "../models";
import { AppMode } from "../types";
import { StatusBar } from "./phone-frame";
import { ArrowLeft, Minus, Package, Plus, Search, ShoppingCart, X } from "lucide-react";
import { fmt } from "../utility";

export function AddOrderScreen({ customers, cart, products, mode, traderId, onBack, onUpdateCart, onViewCart }: {
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
