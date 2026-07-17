import { useEffect, useState } from "react";
import { Customer } from "../models";
import { StatusBar } from "./phone-frame";
import { ArrowLeft, Edit, Eye, FileText, MapPin, MoreVertical, Phone, Plus, Search, Store, Trash2, User, Users } from "lucide-react";
import { useAppData } from "../useAppData";
import { useAddCustomer, useDeleteCustomer, useUpdateCustomer } from "../../api/customers";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { setEditingCustomer, setSelectedCustomer } from "../../redux/slices/customerSlice";
import { RootState } from "../../redux/store";

export function ManageCustomersScreen(){

  const dispatch = useDispatch();
  const { customers } = useAppData();
  const deleteCustomer = useDeleteCustomer();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const filtered = customers.filter(c => !search || c.customerName.toLowerCase().includes(search.toLowerCase()) || c.shopName.toLowerCase().includes(search.toLowerCase()) || c.mobile.includes(search));


  const onBack =()=>{
    navigate('/business-select');
  }

  const onAddCustomer = ()=>{
    dispatch(setEditingCustomer(null));
    navigate('/add-customer');
  }

  const onEditCustomer =(customer:Customer)=>{
    dispatch(setEditingCustomer(customer));
    navigate(`/edit-customer/${customer.id}`);

  }

  const onViewCustomer = (customer:Customer)=> {
    dispatch(setSelectedCustomer(customer));
  }

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]" onClick={() => setOpenMenu(null)}>
      <StatusBar />
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
          <h1 className="text-base font-extrabold text-gray-800">Customers</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowSearch(!showSearch)} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><Search size={15} className="text-gray-600" /></button>
          <button onClick={onAddCustomer} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#1B4FD8]"><Plus size={15} className="text-white" /></button>
        </div>
      </div>
      {showSearch && (
        <div className="px-4 py-2 bg-white border-b border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
            <Search size={13} className="text-gray-400" />
            <input autoFocus className="flex-1 bg-transparent text-sm font-medium focus:outline-none" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2" style={{ scrollbarWidth: "none" }}>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{filtered.length} Customers</p>
        {filtered.map(c => (
          <div key={c.id} className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm relative" onClick={e => e.stopPropagation()}>
            <div className="w-11 h-11 bg-[#1B4FD8]/10 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-[#1B4FD8] font-extrabold text-base">{c.customerName.charAt(0)}</span></div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 text-sm truncate">{c.shopName}</p>
              <p className="text-gray-500 text-xs font-medium">{c.customerName}</p>
              <p className="text-gray-400 text-[11px] flex items-center gap-1 mt-0.5"><Phone size={9} />{c.mobile}</p>
            </div>
            <button onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === c.id ? null : c.id); }} className="w-8 h-8 flex items-center justify-center"><MoreVertical size={15} className="text-gray-300" /></button>
            {openMenu === c.id && (
              <div className="absolute right-4 top-12 bg-white border border-gray-100 rounded-2xl shadow-2xl z-30 overflow-hidden w-40">
                {[{ label: "View Details", icon: <Eye size={13} />, action: () => { onViewCustomer(c); setOpenMenu(null); } }, { label: "Edit", icon: <Edit size={13} />, action: () => { onEditCustomer(c); setOpenMenu(null); } }, { label: "Delete", icon: <Trash2 size={13} />, action: () => {deleteCustomer.mutate(c.id) ; setOpenMenu(null); }, danger: true }].map(item => (
                  <button key={item.label} onClick={item.action} className={`w-full flex items-center gap-3 px-4 py-3 text-sm border-b border-gray-50 last:border-0 font-medium ${(item as any).danger ? "text-red-500" : "text-gray-700"}`}>{item.icon}{item.label}</button>
                ))}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && <div className="flex flex-col items-center py-16 gap-3"><Users size={44} className="text-gray-200" /><p className="text-gray-400 text-sm font-medium">No customers found</p></div>}
      </div>
    </div>
  );
}

export function AddEditCustomerScreen(){


  const navigate = useNavigate();
  const addCustomer = useAddCustomer();
  const updateCustomer = useUpdateCustomer();
  const customer = useSelector((state:RootState)=>state.customer.editingCustomer);

  const [form, setForm] = useState({ shopName: customer?.shopName || "", customerName: customer?.customerName || "", gst: customer?.gst || "", address: customer?.address || "", mobile: customer?.mobile || "" });


  const onSaveNewCustomer = (payload:Omit<Customer,'id'>)=>{
    addCustomer.mutate(form);
    //addCustomer.mutate(payload);
    navigate('/manage-customers');
  }
  const onUpdateExistingCustomer = (custId:string,payload:Customer)=>{

    updateCustomer.mutate({id:custId,customer:payload});
    navigate('/manage-customers');

  }

  const onBack =()=>{
    navigate('/manage-customers');
  }

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <StatusBar />
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
        <h1 className="text-base font-extrabold text-gray-800">{customer ? "Edit Customer" : "Add Customer"}</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4" style={{ scrollbarWidth: "none" }}>
        {[{ label: "Retail Shop Name", key: "shopName", ph: "e.g. Sri Lakshmi Provisions", icon: <Store size={13} />, type: "text" }, { label: "Customer Name", key: "customerName", ph: "e.g. Ramesh Kumar", icon: <User size={13} />, type: "text" }, { label: "GST Number", key: "gst", ph: "e.g. 33AABCU9603R1ZX", icon: <FileText size={13} />, type: "text" }, { label: "Mobile Number", key: "mobile", ph: "e.g. 9876543210", icon: <Phone size={13} />, type: "tel" }, { label: "Address", key: "address", ph: "Full address with city & PIN", icon: <MapPin size={13} />, type: "textarea" }].map(f => (
          <div key={f.key}>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">{f.icon}{f.label}</label>
            {f.type === "textarea" ? <textarea className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20 resize-none" rows={3} placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} /> : <input type={f.type} className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/20" placeholder={f.ph} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} />}
          </div>
        ))}
        <button onClick={() => {
          const payload:Omit<Customer,'id'> = form;
          customer ? onUpdateExistingCustomer(customer.id,customer) : onSaveNewCustomer(payload) } } className="w-full bg-[#1B4FD8] text-white rounded-2xl py-3.5 font-bold text-sm mt-1" style={{ boxShadow: "0 8px 24px rgba(27,79,216,.3)" }}>{customer ? "Save Changes" : "Add Customer"}</button>
      </div>
    </div>
  );
}

export function ViewCustomerScreen() {

    const navigate = useNavigate();
    const customer = useSelector((state:RootState)=>state.customer.selectedCustomer);

    const onBack = ()=>
    {
      navigate('/manage-customers');
    }

  return (
    <div className="flex flex-col h-full bg-[#F0F4FF]">
      <StatusBar />
      <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-100">
        <button onClick={onBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50"><ArrowLeft size={17} className="text-gray-700" /></button>
        <h1 className="text-base font-extrabold text-gray-800">Customer Details</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3" style={{ scrollbarWidth: "none" }}>
        <div className="flex flex-col items-center py-6 gap-2">
          <div className="w-20 h-20 bg-[#1B4FD8] rounded-full flex items-center justify-center" style={{ boxShadow: "0 12px 32px rgba(27,79,216,.3)" }}><span className="text-white text-3xl font-extrabold">{customer?.customerName.charAt(0)}</span></div>
          <h2 className="text-base font-extrabold text-gray-800">{customer?.shopName}</h2>
          <p className="text-gray-400 text-sm font-medium">{customer?.customerName}</p>
        </div>
        {[{ label: "Shop Name", value: customer?.shopName, icon: <Store size={14} className="text-[#1B4FD8]" /> }, { label: "Customer Name", value: customer?.customerName, icon: <User size={14} className="text-[#1B4FD8]" /> }, { label: "GST Number", value: customer?.gst, icon: <FileText size={14} className="text-[#1B4FD8]" /> }, { label: "Mobile", value: customer?.mobile, icon: <Phone size={14} className="text-[#1B4FD8]" /> }, { label: "Address", value: customer?.address, icon: <MapPin size={14} className="text-[#1B4FD8]" /> }].map(f => (
          <div key={f.label} className="bg-white rounded-2xl p-4 flex items-start gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 flex-shrink-0" style={{ background: "rgba(27,79,216,.08)" }}>{f.icon}</div>
            <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">{f.label}</p><p className="text-sm font-bold text-gray-800">{f.value}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}
