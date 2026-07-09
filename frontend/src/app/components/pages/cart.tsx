import { useState } from "react";
import { CartItem, Customer, Order } from "../models";
import { AppMode } from "../types";
import { StatusBar } from "./phone-frame";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { fmt } from "../utility";

export function CartScreen({ cart, customerId, customers, mode, traderId, onBack, onConfirm }: {
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