import { ArrowLeft, ClipboardList, CreditCard, DollarSign, FileText, Package, TrendingUp, User } from "lucide-react";
import { StatusBar } from "./phone-frame";

export function ProfileDashboardScreen({ onBack }: { onBack: () => void }) {
  const stats = [
    { label: "Active Orders", value: "12", icon: <ClipboardList size={19} />, color: "#1B4FD8" }, { label: "Credit Limit", value: "₹5L", icon: <CreditCard size={19} />, color: "#7C3AED" },
    { label: "Total Invoiced", value: "₹24.8L", icon: <FileText size={19} />, color: "#059669" }, { label: "Weekly Sales", value: "₹3.2L", icon: <TrendingUp size={19} />, color: "#F59E0B" },
    { label: "Monthly Sales", value: "₹12.6L", icon: <DollarSign size={19} />, color: "#EF4444" }, { label: "Total Orders", value: "284", icon: <Package size={19} />, color: "#06B6D4" },
  ];
  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <div className="bg-gradient-to-b from-[#1B4FD8] to-[#1e40af]">
        <StatusBar light />
        <div className="flex items-center gap-3 px-4 pb-4"><button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15"><ArrowLeft size={17} className="text-white" /></button><h1 className="text-base font-extrabold text-white">Profile Dashboard</h1></div>
        <div className="flex flex-col items-center pb-6 pt-1 gap-2">
          <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center"><User size={30} className="text-white" /></div>
          <p className="text-white font-extrabold text-base">Rajesh Distributor</p>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /><p className="text-blue-200/80 text-xs font-medium">Nestlé India Ltd. · Active</p></div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        <div className="grid grid-cols-2 gap-3">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2.5" style={{ background: `${s.color}15` }}><span style={{ color: s.color }}>{s.icon}</span></div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{s.label}</p>
              <p className="text-xl font-extrabold text-gray-800">{s.value}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <div className="flex justify-between items-center mb-3"><p className="text-sm font-extrabold text-gray-800">Monthly Target</p><span className="text-xs font-bold text-[#1B4FD8]">84%</span></div>
          <div className="w-full bg-gray-100 rounded-full h-2 mb-2"><div className="h-2 rounded-full bg-gradient-to-r from-[#1B4FD8] to-[#60a5fa]" style={{ width: "84%" }} /></div>
          <div className="flex justify-between"><span className="text-[11px] text-gray-400 font-medium">₹12.6L achieved</span><span className="text-[11px] text-gray-400 font-medium">Target: ₹15L</span></div>
        </div>
      </div>
    </div>
  );
}
