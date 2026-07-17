import { useState } from "react";
import { Order, PaymentModalState, PaymentRecord } from "../models";
import { AppMode, PaymentMethod } from "../types";
import { ArrowLeft, Banknote, BookCheck, CheckCircle, CreditCard, FileText, Receipt, Search, Smartphone } from "lucide-react";
import { fmt } from "../utility";
import { StatusBar } from "./phone-frame";
import { PaymentBadge } from "../badges";
import { useAppData } from "../useAppData";
import { useUpdatePayment } from "../../api/payments";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export function TransactionsScreen() {

    const { orders,payments } = useAppData();
    const navigate = useNavigate();

    const mode = useSelector((state:RootState)=>state.mode);
    const traderId = useSelector((state:RootState)=>state.trader.traderId);

    const updatePayments = useUpdatePayment();

  const [modal, setModal] = useState<PaymentModalState | null>(null);
  const [search, setSearch] = useState("");

  const deliveredOrders = orders.filter(o =>
    o.status === "delivered" &&
    (mode === "retail" ? o.mode === "retail" : o.mode === "wholesale" && o.traderId === traderId) &&
    (!search || o.shopName.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search))
  );

  const totalOutstanding = deliveredOrders.reduce((s, o) => {
    const p = payments[o.id];
    if (!p || p.status === "unpaid") return s + o.total;
    if (p.status === "partial") return s + (o.total - p.amountPaid);
    return s;
  }, 0);

  function confirmPayment() {
    if (!modal) return;
    const { orderId, total, step, method, amountPaid } = modal;
    if (step === "paid-method" && method) {
        updatePayments.mutate({id:orderId,paymentRecord:{ status: "paid", paymentMethod: method, amountPaid: total }});
        //onUpdatePayment(orderId, { status: "paid", paymentMethod: method, amountPaid: total });
        setModal(null); 
    }
    else if (step === "partial-amount" && amountPaid) {
        updatePayments.mutate({id:orderId,paymentRecord:{ status: "partial", amountPaid: Number(amountPaid) }});
        //onUpdatePayment(orderId, { status: "partial", amountPaid: Number(amountPaid) });
        setModal(null); }
    else if (step === "credit-done") {
        updatePayments.mutate({id:orderId,paymentRecord:{ status: "unpaid", amountPaid: 0, isCredit: true }});
        //onUpdatePayment(orderId, { status: "unpaid", amountPaid: 0, isCredit: true });
        setModal(null); }
  }

  const onBack =()=>{
    navigate('/home');
  }

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF] relative">
      {modal && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setModal(null)} />
          <div className="relative bg-white rounded-t-3xl px-5 pt-5 pb-8 shadow-2xl z-10">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            {modal.step === "choose" && (
              <>
                <p className="text-base font-extrabold text-gray-800 mb-4">Update Payment · {fmt(modal.total)}</p>
                {[{ label: "Mark as Paid", desc: "Full payment received", icon: <CheckCircle size={18} className="text-emerald-500" />, action: () => setModal(m => m ? { ...m, step: "paid-method" } : null) },
                  { label: "Partially Paid", desc: "Partial payment received", icon: <CreditCard size={18} className="text-amber-500" />, action: () => setModal(m => m ? { ...m, step: "partial-amount" } : null) },
                  { label: "Mark as Credit", desc: "Add to outstanding credit", icon: <FileText size={18} className="text-red-500" />, action: () => setModal(m => m ? { ...m, step: "credit-done" } : null) }].map(opt => (
                  <button key={opt.label} onClick={opt.action} className="w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-gray-50 border border-gray-100 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">{opt.icon}</div>
                    <div className="text-left"><p className="text-sm font-bold text-gray-800">{opt.label}</p><p className="text-xs text-gray-400">{opt.desc}</p></div>
                  </button>
                ))}
              </>
            )}
            {modal.step === "paid-method" && (
              <>
                <p className="text-base font-extrabold text-gray-800 mb-4">Select Payment Method</p>
                <div className="flex gap-3 mb-4">
                  {([{ value: "cash" as PaymentMethod, label: "Cash", icon: <Banknote size={20} /> }, { value: "gpay" as PaymentMethod, label: "GPay", icon: <Smartphone size={20} /> }, { value: "check" as PaymentMethod, label: "Cheque", icon: <BookCheck size={20} /> }] as { value: PaymentMethod; label: string; icon: React.ReactNode }[]).map(m => (
                    <button key={m.value} onClick={() => setModal(prev => prev ? { ...prev, method: m.value } : null)}
                      className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-2xl border-2 text-xs font-bold ${modal.method === m.value ? "border-[#1B4FD8] text-[#1B4FD8]" : "border-gray-200 text-gray-500"}`}
                      style={modal.method === m.value ? { background: "rgba(27,79,216,.05)" } : {}}>
                      {m.icon}{m.label}
                    </button>
                  ))}
                </div>
                <button onClick={confirmPayment} className="w-full bg-emerald-600 text-white rounded-2xl py-3 font-bold text-sm" style={{ boxShadow: "0 6px 20px rgba(16,185,129,.3)" }}>Confirm Payment</button>
              </>
            )}
            {modal.step === "partial-amount" && (
              <>
                <p className="text-base font-extrabold text-gray-800 mb-4">Partial Payment · Due {fmt(modal.total)}</p>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Amount Received (₹)</label>
                <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20 mb-2" placeholder="0" value={modal.amountPaid || ""} onChange={e => setModal(m => m ? { ...m, amountPaid: e.target.value } : null)} />
                {modal.amountPaid && <div className="flex justify-between px-1 mb-4"><span className="text-xs text-gray-400 font-medium">Balance due</span><span className="text-xs font-extrabold text-red-500">{fmt(modal.total - Number(modal.amountPaid))}</span></div>}
                <button onClick={confirmPayment} className="w-full bg-amber-500 text-white rounded-2xl py-3 font-bold text-sm">Confirm Partial Payment</button>
              </>
            )}
            {modal.step === "credit-done" && (
              <>
                <p className="text-base font-extrabold text-gray-800 mb-4">Mark as Credit</p>
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4">
                  <p className="text-sm font-bold text-red-700">Bill will be added to credit account</p>
                  <p className="text-xs text-red-500 font-medium mt-1">Balance of {fmt(modal.total)} will show as outstanding</p>
                </div>
                <button onClick={confirmPayment} className="w-full bg-red-500 text-white rounded-2xl py-3 font-bold text-sm">Confirm Credit</button>
              </>
            )}
          </div>
        </div>
      )}

      <StatusBar />
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
        <h1 className="text-base font-extrabold text-gray-800">Transactions</h1>
      </div>
      <div className="px-4 py-2 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <Search size={13} className="text-gray-400" />
          <input className="flex-1 bg-transparent text-sm font-medium focus:outline-none" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>
      {totalOutstanding > 0 && (
        <div className="mx-4 my-2 bg-red-50 border border-red-100 rounded-2xl px-4 py-3 flex justify-between items-center">
          <div><p className="text-xs font-bold text-red-700">Outstanding Balance</p><p className="text-[10px] text-red-400 font-medium">{deliveredOrders.filter(o => !payments[o.id] || payments[o.id].status !== "paid").length} invoices pending</p></div>
          <p className="text-lg font-extrabold text-red-600">{fmt(totalOutstanding)}</p>
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2" style={{ scrollbarWidth: "none" }}>
        {deliveredOrders.length === 0 && <div className="flex flex-col items-center py-16 gap-3"><Receipt size={44} className="text-gray-200" /><p className="text-gray-400 text-sm font-medium">No delivered orders yet</p></div>}
        {deliveredOrders.map(o => {
          const p = payments[o.id];
          const isPaid = p?.status === "paid";
          const isPartial = p?.status === "partial";
          return (
            <div key={o.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div><span className="text-[11px] font-extrabold text-[#1B4FD8] tracking-wider font-mono">{o.id}</span><p className="text-sm font-bold text-gray-800 mt-0.5">{o.shopName}</p><p className="text-xs text-gray-400 font-medium">{o.customerName} · {o.date}</p></div>
                <PaymentBadge rec={p} total={o.total} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-extrabold text-gray-800">{fmt(o.total)}</p>
                  {isPartial && <p className="text-xs text-amber-600 font-bold">Paid: {fmt(p.amountPaid)} · Due: {fmt(o.total - p.amountPaid)}</p>}
                  {p?.isCredit && !isPaid && <p className="text-xs text-red-500 font-bold flex items-center gap-1"><FileText size={10} />Credit Bill</p>}
                  {isPaid && p?.paymentMethod && <p className="text-xs text-emerald-600 font-bold capitalize">{p.paymentMethod === "gpay" ? "GPay" : p.paymentMethod}</p>}
                </div>
                {!isPaid && <button onClick={() => setModal({ orderId: o.id, total: o.total, step: "choose" })} className="bg-[#1B4FD8] text-white text-xs font-bold px-3 py-1.5 rounded-xl" style={{ boxShadow: "0 4px 12px rgba(27,79,216,.25)" }}>Update Payment</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
