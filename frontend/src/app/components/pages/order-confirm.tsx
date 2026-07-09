import { CheckCircle, Download } from "lucide-react";
import { Order } from "../models";
import { StatusBar } from "./phone-frame";
import { fmt } from "../utility";

export function OrderConfirmScreen({ order, onHome }: { order: Order; onHome: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <StatusBar />
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col items-center py-8 gap-3">
          <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center" style={{ boxShadow: "0 12px 40px rgba(16,185,129,.35)" }}><CheckCircle size={40} className="text-white" /></div>
          <h2 className="text-xl font-extrabold text-gray-800">Order Placed!</h2>
          <p className="text-gray-400 text-sm font-medium text-center">Your order has been placed successfully.</p>
          <span className="font-extrabold text-sm px-4 py-1.5 rounded-full font-mono" style={{ background: "rgba(27,79,216,.1)", color: "#1B4FD8" }}>{order.id}</span>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 mb-3">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Customer</p>
          <p className="text-sm font-extrabold text-gray-800">{order.shopName}</p>
          <p className="text-xs text-gray-400 font-medium">{order.customerName}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden mb-3">
          <div className="flex items-center px-4 py-2 bg-gray-50 border-b border-gray-100">
            <p className="flex-1 text-[9px] font-bold text-gray-400 uppercase">Item</p>
            <p className="w-16 text-[9px] font-bold text-gray-400 uppercase text-center">Unit</p>
            <p className="w-14 text-[9px] font-bold text-gray-400 uppercase text-right">Rate</p>
            <p className="w-16 text-[9px] font-bold text-gray-400 uppercase text-right">Total</p>
          </div>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center px-4 py-2.5 border-b border-gray-50 last:border-0">
              <div className="flex-1 min-w-0 pr-2"><p className="text-xs font-bold text-gray-700 truncate">{item.product.name}</p></div>
              <p className="w-16 text-[10px] font-bold text-gray-500 text-center">{item.quantity} {item.product.metric}</p>
              <p className="w-14 text-[10px] font-bold text-gray-600 text-right">₹{item.price}</p>
              <p className="w-16 text-xs font-extrabold text-gray-800 text-right">{fmt(item.quantity * item.price)}</p>
            </div>
          ))}
          <div className="flex justify-between px-4 py-3 border-t border-gray-100" style={{ background: "rgba(27,79,216,.04)" }}>
            <p className="text-sm font-extrabold text-gray-800">Grand Total</p>
            <p className="text-base font-extrabold text-[#1B4FD8]">{fmt(order.total)}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 mt-auto pt-2">
          <button className="w-full flex items-center justify-center gap-2 border-2 border-[#1B4FD8]/25 text-[#1B4FD8] rounded-2xl py-3 font-bold text-sm"><Download size={15} />Download Invoice</button>
          <button onClick={onHome} className="w-full bg-[#1B4FD8] text-white rounded-2xl py-3.5 font-extrabold text-sm" style={{ boxShadow: "0 8px 24px rgba(27,79,216,.35)" }}>Back to Home</button>
        </div>
      </div>
    </div>
  );
}
