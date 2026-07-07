export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-gray-950 flex items-center justify-center p-4"
         style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="relative rounded-[3rem] overflow-hidden"
           style={{ width: 390, height: 844, boxShadow: "0 0 0 1px #444,0 50px 100px rgba(0,0,0,.7),inset 0 0 0 2px #222", background: "#0a0a0a" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[34px] bg-black rounded-b-[20px] z-50" />
        <div className="absolute inset-0 rounded-[3rem] overflow-hidden bg-[#F0F4FF]">{children}</div>
        <div className="absolute left-[-3px] top-32 w-[3px] h-9 bg-gray-600 rounded-l-sm" />
        <div className="absolute left-[-3px] top-44 w-[3px] h-12 bg-gray-600 rounded-l-sm" />
        <div className="absolute right-[-3px] top-40 w-[3px] h-16 bg-gray-600 rounded-r-sm" />
      </div>
    </div>
  );
}

export function StatusBar({ light = false }: { light?: boolean }) {
  return (
    <div className={`flex justify-between items-center px-6 pt-11 pb-1 text-[11px] font-semibold ${light ? "text-white/80" : "text-gray-600"}`}>
      <span>9:41</span>
      <div className="flex gap-1.5 items-center">
        <svg className="w-3.5 h-2.5" viewBox="0 0 16 12" fill="currentColor">
          <rect x="0" y="5" width="3" height="7" rx="0.5" /><rect x="4.5" y="3" width="3" height="9" rx="0.5" />
          <rect x="9" y="1" width="3" height="11" rx="0.5" /><rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.3" />
        </svg>
        <svg className="w-3.5 h-2.5" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 1.5C5.2 1.5 2.8 2.8 1.2 4.8L0 3.4C2 1.3 4.9 0 8 0s6 1.3 8 3.4L14.8 4.8C13.2 2.8 10.8 1.5 8 1.5z" />
          <path d="M8 5c-1.7 0-3.2.9-4.1 2.2L2.4 5.8C3.9 3.9 5.8 2.8 8 2.8s4.1 1.1 5.6 3L12.1 7.2C11.2 5.9 9.7 5 8 5z" />
          <circle cx="8" cy="10" r="2" />
        </svg>
        <div className="w-6 h-3 rounded-[3px] border border-current relative">
          <div className="absolute left-0.5 top-0.5 bottom-0.5 w-[16px] bg-current rounded-[2px]" />
        </div>
      </div>
    </div>
  );
}