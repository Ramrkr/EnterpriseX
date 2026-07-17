import { Order, PaymentRecord } from "./models";

export function StatusBadge({ status }: { status: Order["status"] }) {  
  const cfg = {
    pending: { label: "Pending", cls: "bg-amber-100 text-amber-700" },
    packed: { label: "Packed", cls: "bg-blue-100 text-blue-700" },
    delivered: { label: "Delivered", cls: "bg-emerald-100 text-emerald-700" },
  }[status];
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cfg.cls}`}>{cfg.label}</span>;
}

export function PaymentBadge({ rec, total }: { rec?: PaymentRecord; total: number }) {
  if (!rec || rec.status === "unpaid") return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Unpaid</span>;
  if (rec.status === "paid") return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Paid</span>;
  const bal = total - rec.amountPaid;
  return <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-600">Partial · ₹{bal} due</span>;
}