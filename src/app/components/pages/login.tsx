import { useState } from "react";
import { api } from "../utility";
import { StatusBar } from "./phone-frame";
import { AlertCircle, Store } from "lucide-react";

export function LoginScreen({ onLogin, onRegister }: { onLogin: () => void; onRegister: () => void }) {
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [err, setErr] = useState("");

  async function handleLogin()
  {
    try{
      console.log({username:u,password:p});
      
        const res = await api<{token:string}>('/log-in',
          {
            method:'POST',
            body:JSON.stringify({username:u,password:p})
          }
        );
        console.log(res);
        localStorage.setItem('token',res.token);
        console.log(localStorage.getItem('token'));
        onLogin();
    }
    
    catch(error:any)
    {
      setErr(error.message);
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <div className="bg-gradient-to-b from-[#1B4FD8] to-[#2258e0] px-6 flex flex-col items-center">
        <StatusBar light />
        <div className="flex flex-col items-center gap-3 pb-10 pt-5">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
            <Store size={30} className="text-[#1B4FD8]" strokeWidth={1.5} />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold text-white">TradeHub</h1>
            <p className="text-blue-200/70 text-xs font-medium">Wholesale & Retail Management</p>
          </div>
        </div>
      </div>
      <div className="flex-1 -mt-6 bg-white rounded-t-3xl px-6 pt-7 pb-6 flex flex-col gap-5 overflow-y-auto">
        <div>
          <h2 className="text-xl font-extrabold text-gray-800">Welcome back</h2>
          <p className="text-gray-400 text-sm mt-0.5">Sign in to your account</p>
        </div>
        {err && <div className="flex items-center gap-2 bg-red-50 text-red-600 text-xs px-3 py-2.5 rounded-xl font-medium"><AlertCircle size={13} />{err}</div>}
        {[{ label: "Username", val: u, set: setU, type: "text", ph: "Enter your username" },
          { label: "Password", val: p, set: setP, type: "password", ph: "Enter your password" }].map(f => (
          <div key={f.label}>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">{f.label}</label>
            <input type={f.type} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20" placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)} />
          </div>
        ))}
        <button onClick={() => { if (!u || !p) { setErr("Please fill in all fields"); return; } handleLogin(); }}
          className="w-full bg-[#1B4FD8] text-white rounded-2xl py-3.5 font-bold text-sm" style={{ boxShadow: "0 8px 24px rgba(27,79,216,.35)" }}>
          Sign In
        </button>
        <div className="text-center">
          <span className="text-sm text-gray-400">New here? </span>
          <button onClick={onRegister} className="text-sm text-[#1B4FD8] font-bold">Create account</button>
        </div>
      </div>
    </div>
  );
}
