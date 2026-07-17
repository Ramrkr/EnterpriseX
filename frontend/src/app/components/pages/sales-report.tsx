import { useState } from "react";
import { StatusBar } from "./phone-frame";
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CATEGORY_DATA, PIE_COLORS, SALES_DATA } from "../mock-data";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export function SalesReportScreen() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <div className="bg-gradient-to-b from-[#1B4FD8] to-[#1e40af]">
        <StatusBar light />
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex items-center gap-3"><button onClick={()=>navigate("home")} className="w-9 h-9 flex items-center justify-center rounded-full bg-white/15"><ArrowLeft size={17} className="text-white" /></button><h1 className="text-base font-extrabold text-white">Sales Report</h1></div>
          <div className="flex gap-1 bg-white/10 p-1 rounded-xl">
            {(["weekly", "monthly"] as const).map(p => (<button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1 rounded-lg text-xs font-bold capitalize ${period === p ? "bg-white text-[#1B4FD8]" : "text-white/70"}`}>{p}</button>))}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        <div className="grid grid-cols-2 gap-3">
          {[{ label: "Total Revenue", value: "₹12.6L", change: "+18.3%", up: true }, { label: "Orders", value: "284", change: "+24 this month", up: true }, { label: "Avg Order Value", value: "₹4,436", change: "-2.1%", up: false }, { label: "New Customers", value: "8", change: "+3 this month", up: true }].map(kpi => (
            <div key={kpi.label} className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-50">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{kpi.label}</p>
              <p className="text-lg font-extrabold text-gray-800">{kpi.value}</p>
              <p className={`text-xs font-bold ${kpi.up ? "text-emerald-500" : "text-red-400"}`}>{kpi.change}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <p className="text-sm font-extrabold text-gray-800 mb-3">Sales Trend — 6 Months</p>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={SALES_DATA} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1B4FD8" stopOpacity={0.2} /><stop offset="95%" stopColor="#1B4FD8" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" /><XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 9 }} tickFormatter={v => `${(v / 100000).toFixed(0)}L`} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`₹${(v / 100000).toFixed(1)}L`, "Sales"]} />
              <Area type="monotone" dataKey="sales" stroke="#1B4FD8" strokeWidth={2.5} fill="url(#grad)" dot={{ fill: "#1B4FD8", strokeWidth: 0, r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
          <p className="text-sm font-extrabold text-gray-800 mb-3">Category Breakdown</p>
          <div className="flex items-center gap-2">
            <ResponsiveContainer width={110} height={110}><PieChart><Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={28} outerRadius={52} dataKey="value" strokeWidth={0}>{CATEGORY_DATA.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}</Pie></PieChart></ResponsiveContainer>
            <div className="flex flex-col gap-1.5 flex-1">
              {CATEGORY_DATA.map((d, i) => (<div key={d.name} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i] }} /><span className="text-xs text-gray-500 font-medium flex-1">{d.name}</span><span className="text-xs font-extrabold text-gray-700">{d.value}%</span></div>))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
