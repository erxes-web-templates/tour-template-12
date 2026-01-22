"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { CPDetail, MenuItem } from "../../types/cms";
import { GET_CMS_MENU_LIST } from "../../graphql/queries";
import { templateUrl, getFileUrl } from "@/lib/utils";
import { 
  Facebook, Twitter, Instagram, Youtube, 
  Linkedin, Send, Phone, Mail, MapPin, MessageCircle 
} from "lucide-react";

export default function Footer({ cpDetail }: { cpDetail: CPDetail }) {
  // Админаас тохируулсан Footer цэсийг татах
  const { data } = useQuery(GET_CMS_MENU_LIST, {
    variables: {
      clientPortalId: cpDetail?._id,
      kind: "footer",
    },
    skip: !cpDetail?._id,
  });

  const menus = data?.cmsMenuList || [];

  return (
    <footer className="relative bg-[#2d124a] text-white pt-24 pb-10 overflow-hidden">
      {/* Дээд талын налуу хэлбэр (Slope effect) */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
        <svg
          className="relative block w-full h-[60px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M1200 120L0 16.48V0h1200v120z"
            className="fill-[#f7f5ef]"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Хурдан холбоосууд - Чиглэлүүд маягаар харуулав */}
        <div className="mb-16">
          <h2 className="text-2xl font-black mb-8 italic uppercase tracking-tighter">
            {cpDetail?.name} <span className="text-yellow-500">Аялал</span>
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm opacity-90 border-b border-white/10 pb-12">
            {menus.length > 0 ? (
              menus.map((menu: MenuItem) => (
                <Link 
                  key={menu._id} 
                  href={templateUrl(menu.url || "/")}
                  className="flex items-center gap-2 hover:text-yellow-400 transition-colors uppercase font-bold tracking-wider text-[11px]"
                >
                  {menu.label} <span className="w-1 h-1 bg-yellow-500 rounded-full opacity-50"></span>
                </Link>
              ))
            ) : (
              <p className="text-[11px] opacity-50 uppercase tracking-widest">Цэс олдсонгүй</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* LOGO & Description */}
          <div className="lg:col-span-1">
            <Link href={templateUrl("/")} className="flex items-center gap-2 text-2xl font-black mb-6 tracking-tighter italic">
              <div className="bg-white text-[#692d91] rounded-xl w-10 h-10 flex items-center justify-center text-xl shadow-lg uppercase">
                {cpDetail?.name?.charAt(0) || "M"}
              </div>
              {cpDetail?.name?.toUpperCase()}
            </Link>
            <p className="text-sm italic mb-8 opacity-70 leading-relaxed line-clamp-4">
              {cpDetail?.description || "Эх орныхоо үзэсгэлэнг хамтдаа нээе"}
            </p>
            
            {/* Сошиал линкүүд - Динамикаар шалгаж харуулна */}
            <p className="text-[10px] opacity-50 mb-4 uppercase font-black tracking-[0.2em]">Биднийг дагах</p>
            <div className="flex flex-wrap gap-3">
              {cpDetail?.externalLinks?.facebook && (
                <a href={cpDetail.externalLinks.facebook} target="_blank" className="p-2.5 border border-white/10 rounded-xl hover:bg-white hover:text-[#692d91] transition-all"><Facebook size={18} /></a>
              )}
              {cpDetail?.externalLinks?.instagram && (
                <a href={cpDetail.externalLinks.instagram} target="_blank" className="p-2.5 border border-white/10 rounded-xl hover:bg-white hover:text-[#692d91] transition-all"><Instagram size={18} /></a>
              )}
              {cpDetail?.externalLinks?.youtube && (
                <a href={cpDetail.externalLinks.youtube} target="_blank" className="p-2.5 border border-white/10 rounded-xl hover:bg-white hover:text-[#692d91] transition-all"><Youtube size={18} /></a>
              )}
              {cpDetail?.externalLinks?.twitter && (
                <a href={cpDetail.externalLinks.twitter} target="_blank" className="p-2.5 border border-white/10 rounded-xl hover:bg-white hover:text-[#692d91] transition-all"><Twitter size={18} /></a>
              )}
              {cpDetail?.externalLinks?.whatsapp && (
                <a href={cpDetail.externalLinks.whatsapp} target="_blank" className="p-2.5 border border-white/10 rounded-xl hover:bg-white hover:text-[#692d91] transition-all"><MessageCircle size={18} /></a>
              )}
            </div>
          </div>

          {/* Холбоо барих мэдээлэл - 1 */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-8 text-yellow-500">Утас & Имэйл</h4>
            <ul className="space-y-5 text-sm font-medium">
              {cpDetail?.externalLinks?.phones?.map((phone, idx) => (
                <li key={idx} className="flex items-center gap-4 opacity-70 hover:opacity-100 hover:text-yellow-400 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><Phone size={14} /></div>
                  {phone}
                </li>
              ))}
              {cpDetail?.externalLinks?.emails?.map((email, idx) => (
                <li key={idx} className="flex items-center gap-4 opacity-70 hover:opacity-100 hover:text-yellow-400 transition-all">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><Mail size={14} /></div>
                  {email}
                </li>
              ))}
            </ul>
          </div>

          {/* Хаяг байршил */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-8 text-yellow-500">Байршил</h4>
            <div className="flex gap-4 opacity-70 leading-relaxed text-sm">
              <div className="min-w-[32px] h-8 rounded-lg bg-white/5 flex items-center justify-center mt-1"><MapPin size={14} /></div>
              <p>{cpDetail?.externalLinks?.address || "Хаяг тодорхойгүй"}</p>
            </div>
          </div>

          {/* Newsletter / Мэдээлэл хүлээн авах */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-widest mb-8 text-yellow-500">Мэдээлэл авах</h4>
            <p className="text-xs opacity-60 mb-6 leading-relaxed">Шинэ аялал болон хөнгөлөлтийн мэдээллийг цаг алдалгүй аваарай.</p>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Имэйл хаяг..." 
                  className="bg-transparent border-b border-white/20 text-xs py-2 outline-none w-full focus:border-yellow-500 transition-colors" 
                />
                <button className="p-2 hover:text-yellow-400 transition-transform hover:translate-x-1">
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Доод зохиогчийн эрх хэсэг */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] opacity-40 font-medium tracking-wider text-center md:text-left">
            {cpDetail?.copyright || `© ${new Date().getFullYear()} ${cpDetail?.name}. Бүх эрх хуулиар хамгаалагдсан.`}
          </p>
          
          <div className="flex items-center gap-6">
            <div className="flex gap-3">
               <span className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold">MN</span>
               <span className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-bold">MNT ₮</span>
            </div>
            <div className="text-[10px] opacity-40 flex gap-4 uppercase font-bold tracking-tighter">
              <span className="hover:text-white cursor-pointer transition-colors">Нууцлал</span>
              <span className="hover:text-white cursor-pointer transition-colors">Нөхцөл</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}