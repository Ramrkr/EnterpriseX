import { ArrowLeft, Download } from "lucide-react";
import { PaymentBadge, StatusBadge } from "../badges";
import { Order, PaymentRecord } from "../models";
import { StatusBar } from "./phone-frame";
import { fmt } from "../utility";

export function ViewOrderScreen({ order, payment, onBack }: { order: Order; payment?: PaymentRecord; onBack: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <StatusBar />
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
        <h1 className="text-base font-extrabold text-gray-800">Order Details</h1>
        <button className="ml-auto flex items-center gap-1 text-[#1B4FD8] text-xs font-bold"><Download size={14} />Invoice</button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        <div className="bg-[#1B4FD8] rounded-2xl p-4" style={{ boxShadow: "0 8px 24px rgba(27,79,216,.2)" }}>
          <div className="flex justify-between items-start">
            <div><p className="text-blue-200/70 text-[10px] font-bold uppercase tracking-widest">Order ID</p><p className="text-white font-extrabold text-base font-mono">{order.id}</p><p className="text-blue-200/70 text-xs font-medium mt-0.5">{order.date}</p></div>
            <StatusBadge status={order.status} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Customer</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1B4FD8]/10 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-[#1B4FD8] font-extrabold">{order.customerName.charAt(0)}</span></div>
            <div><p className="text-sm font-bold text-gray-800">{order.shopName}</p><p className="text-xs text-gray-400 font-medium">{order.customerName}</p></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="px-4 pt-4 pb-2"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Items</p></div>
          <div className="flex items-center px-4 py-2 bg-gray-50 border-y border-gray-100">
            <p className="flex-1 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Item</p>
            <p className="w-16 text-[9px] font-bold text-gray-400 uppercase text-center">Unit</p>
            <p className="w-14 text-[9px] font-bold text-gray-400 uppercase text-right">Rate</p>
            <p className="w-16 text-[9px] font-bold text-gray-400 uppercase text-right">Total</p>
          </div>
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center px-4 py-3 border-b border-gray-50 last:border-0">
              <div className="flex-1 min-w-0 pr-2"><p className="text-xs font-bold text-gray-800 truncate">{item.product.name}</p><p className="text-[10px] text-gray-400 font-medium">{item.product.category}</p></div>
              <p className="w-16 text-xs font-bold text-gray-600 text-center">{item.quantity} {item.product.metric}</p>
              <p className="w-14 text-xs font-bold text-gray-600 text-right">₹{item.price}</p>
              <p className="w-16 text-xs font-extrabold text-gray-800 text-right">{fmt(item.quantity * item.price)}</p>
            </div>
          ))}
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100" style={{ background: "rgba(27,79,216,.04)" }}>
            <p className="text-sm font-extrabold text-gray-800">Grand Total</p>
            <p className="text-base font-extrabold text-[#1B4FD8]">{fmt(order.total)}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Payment Status</p>
          <div className="flex items-center justify-between">
            <PaymentBadge rec={payment} total={order.total} />
            <div className="text-right">
              {payment?.paymentMethod && <p className="text-xs font-bold text-gray-500 capitalize">{payment.paymentMethod === "gpay" ? "GPay" : payment.paymentMethod}</p>}
              {payment?.status === "partial" && <p className="text-xs font-bold text-red-500">Balance: {fmt(order.total - payment.amountPaid)}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
