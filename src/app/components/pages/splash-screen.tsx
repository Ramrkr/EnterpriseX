import { Store } from "lucide-react";
import { useEffect } from "react";

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => { const t = setTimeout(onComplete, 2400); return () => clearTimeout(t); }, [onComplete]);
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-[#1B4FD8] to-[#0f2d8a] relative overflow-hidden">
      <div className="absolute w-64 h-64 rounded-full border border-white/5" />
      <div className="absolute w-96 h-96 rounded-full border border-white/5" />
      <div className="flex flex-col items-center gap-5">
        <div className="w-24 h-24 bg-white rounded-[28px] flex items-center justify-center" style={{ boxShadow: "0 20px 60px rgba(0,0,0,.3)" }}>
          <Store size={46} className="text-[#1B4FD8]" strokeWidth={1.5} />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">TradeHub</h1>
          <p className="text-blue-200/80 text-sm mt-1 font-medium">Wholesale & Retail Management</p>
        </div>
      </div>
      <div className="absolute bottom-20 flex flex-col items-center gap-3">
        <div className="w-7 h-7 rounded-full border-[3px] border-white/25 border-t-white animate-spin" />
        <p className="text-white/40 text-xs font-medium">Loading...</p>
      </div>
    </div>
  );
}
