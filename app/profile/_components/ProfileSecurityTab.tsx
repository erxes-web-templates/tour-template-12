"use client";

import { FormEvent } from "react"; 
import { Lock, ShieldCheck, Sparkles, KeyRound } 
from "lucide-react";

type PasswordForm = { currentPassword: string; newPassword: string; confirmPassword: string; };

type ProfileSecurityTabProps = { form: PasswordForm; loading?: boolean; onChange: (field: keyof PasswordForm, value: string) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; };

const ProfileSecurityTab = ({ form, loading, onChange, onSubmit }: ProfileSecurityTabProps) => (

<div className="max-w-2xl"> {/* TITLE SECTION */} <div className="mb-10"> <h3 className="text-2xl font-black  tracking-tighter uppercase mb-2">  <span className="text-[#692d91]"></span> </h3> <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2"> <ShieldCheck size={14} className="text-[#692d91]" /> Нууц үг тогтмол шинэчлэх нь таны дансыг хамгаална </p> </div>

{/* FORM SECTION */}
<form className="space-y-8" onSubmit={onSubmit}>
  {/* Current Password */}
  <div className="relative group">
    <label 
      htmlFor="currentPassword" 
      className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block ml-1"
    >
      Одоогийн нууц үг
    </label>
    <div className="relative overflow-hidden rounded-[20px] bg-slate-50 group-focus-within:ring-2 group-focus-within:ring-[#692d91]/20 transition-all">
      <Lock 
        className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#692d91] transition-colors z-10" 
        size={18} 
      />
      <input
        id="currentPassword"
        type="password"
        className="w-full bg-transparent border-none py-4 pl-14 pr-6 text-sm font-bold placeholder:text-slate-200 outline-none"
        placeholder="••••••••"
        value={form.currentPassword}
        onChange={(event) => onChange("currentPassword", event.target.value)}
        required
      />
    </div>
  </div>

  {/* New Passwords Grid */}
  <div className="grid gap-6 md:grid-cols-2">
    {/* New Password */}
    <div className="relative group">
      <label 
        htmlFor="newPassword" 
        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block ml-1"
      >
        Шинэ нууц үг
      </label>
      <div className="relative overflow-hidden rounded-[20px] bg-slate-50 group-focus-within:ring-2 group-focus-within:ring-[#692d91]/20 transition-all">
        <KeyRound 
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#692d91] transition-colors z-10" 
          size={18} 
        />
        <input
          id="newPassword"
          type="password"
          minLength={8}
          className="w-full bg-transparent border-none py-4 pl-14 pr-6 text-sm font-bold placeholder:text-slate-200 outline-none"
          placeholder="8+ тэмдэгт"
          value={form.newPassword}
          onChange={(event) => onChange("newPassword", event.target.value)}
          required
        />
      </div>
    </div>

    {/* Confirm Password */}
    <div className="relative group">
      <label 
        htmlFor="confirmPassword" 
        className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 block ml-1"
      >
        Нууц үг давтах
      </label>
      <div className="relative overflow-hidden rounded-[20px] bg-slate-50 group-focus-within:ring-2 group-focus-within:ring-[#692d91]/20 transition-all">
        <KeyRound 
          className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#692d91] transition-colors z-10" 
          size={18} 
        />
        <input
          id="confirmPassword"
          type="password"
          minLength={8}
          className="w-full bg-transparent border-none py-4 pl-14 pr-6 text-sm font-bold placeholder:text-slate-200 outline-none"
          placeholder="Дахин оруулна уу"
          value={form.confirmPassword}
          onChange={(event) => onChange("confirmPassword", event.target.value)}
          required
        />
      </div>
    </div>
  </div>

  {/* Submit Button */}
  <div className="pt-4">
    <button
      type="submit"
      disabled={loading}
      className="group relative w-full md:w-auto bg-[#692d91] text-white px-10 py-4 rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#522370] transition-all shadow-xl shadow-purple-100/30 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-3 overflow-hidden"
    >
      <span className="relative z-10">
        {loading ? "Шинэчилж байна…" : "Нууц үг шинэчлэх"}
      </span>
      {!loading && <Sparkles size={14} className="relative z-10 group-hover:rotate-12 transition-transform" />}
      
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
    </button>
  </div>
</form>
</div> );

export default ProfileSecurityTab;