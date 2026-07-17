import { useState } from "react";
import { api } from "../utility";
import { StatusBar } from "./phone-frame";
import { AlertCircle, ArrowLeft, User } from "lucide-react";
import { API } from "../../api/service";
import { useNavigate } from "react-router";

export function RegisterScreen() {
  const [form, setForm] = useState({ name: "", password: "", confirm: "" });
  const [err, setErr] = useState("");
  const [msg,setMsg] = useState("");

  const navigate = useNavigate();

  async function handleRegister()
  {
    try
    {
      const response = await API.post('/register/new-user',{username:form.name,password:form.password});
      if(response.status === 200)
      {
        setMsg(response.data?.message);
        navigate('/login');
        // onRegister();
      }
    }catch(err:any)
    {
      console.log(err);
      setErr(err);
      
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <StatusBar />
      <div className="flex items-center gap-3 px-4 py-3">
        <button onClick={()=>navigate('/login')} className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm"><ArrowLeft size={17} className="text-gray-700" /></button>
        <h1 className="text-lg font-extrabold text-gray-800">Create Account</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-2 flex flex-col gap-5">
        <div className="flex flex-col items-center gap-2 py-4">
          <div className="w-20 h-20 bg-[#1B4FD8]/10 rounded-full flex items-center justify-center"><User size={36} className="text-[#1B4FD8]" /></div>
          <p className="text-sm text-gray-400 font-medium">Join TradeHub today</p>
        </div>
        {err && <div className="flex items-center gap-2 bg-red-50 text-red-600 text-xs px-3 py-2.5 rounded-xl font-medium"><AlertCircle size={13} />{err}</div>}
        {[{ label: "Full Name", key: "name", ph: "e.g. Rajesh Kumar", type: "text" },
          { label: "Password", key: "password", ph: "Create a strong password", type: "password" },
          { label: "Confirm Password", key: "confirm", ph: "Re-enter your password", type: "password" }].map(f => (
          <div key={f.key}>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">{f.label}</label>
            <input type={f.type} className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20"
              placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />
          </div>
        ))}
        <button onClick={() => {
          if (!form.name || !form.password || !form.confirm) { setErr("All fields are required"); return; }
          if (form.password !== form.confirm) { setErr("Passwords do not match"); return; }
          handleRegister();
        }} className="w-full bg-[#1B4FD8] text-white rounded-2xl py-3.5 font-bold text-sm" style={{ boxShadow: "0 8px 24px rgba(27,79,216,.35)" }}>
          Create Account
        </button>
        <div className="text-center pb-4">
          <span className="text-sm text-gray-400">Already have an account? </span>
          <button onClick={()=>navigate('/login')} className="text-sm text-[#1B4FD8] font-bold">Sign In</button>
        </div>
      </div>
    </div>
  );
}
