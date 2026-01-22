"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Hash, MapPin, ShieldCheck } from "lucide-react";

interface TourDetailsSidebarProps {
  tour: {
    name: string;
    content: string;
    refNumber: string;
    startDate: string;
    status: string;
  };
  numberOfPeople: number;
}

export const TourDetailsSidebar: React.FC<TourDetailsSidebarProps> = ({
  tour,
  numberOfPeople,
}) => {
  return (
    <div className="space-y-8">
      {/* Tour Header & Title */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
          <MapPin className="w-3 h-3" />
          <span className="text-[10px] font-black uppercase tracking-widest">Баталгаажсан аялал</span>
        </div>
        
        <h2 className="text-2xl font-black text-white leading-tight tracking-tighter">
          {tour.name}
        </h2>
        
        <div className="flex gap-1">
          <div className="h-1 w-12 bg-blue-600 rounded-full" />
          <div className="h-1 w-4 bg-white/20 rounded-full" />
          <div className="h-1 w-2 bg-white/10 rounded-full" />
        </div>
      </div>

      {/* Info List */}
      <div className="space-y-3">
        {/* Reference */}
        <div className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white-800 rounded-xl text-slate-400 group-hover:text-blue-400 transition-colors">
              <Hash className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Лавлах дугаар</p>
              <p className="font-bold text-sm text-slate-200">{tour.refNumber}</p>
            </div>
          </div>
        </div>

        {/* Departure Date */}
        <div className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-slate-800 rounded-xl text-slate-400 group-hover:text-emerald-400 transition-colors">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Аялах огноо</p>
              <p className="font-bold text-sm text-slate-200">
                {new Date(tour.startDate).toLocaleDateString("mn-MN", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* People Count */}
        <div className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-slate-800 rounded-xl text-slate-400 group-hover:text-orange-400 transition-colors">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Зорчигчийн тоо</p>
              <p className="font-bold text-sm text-slate-200">{numberOfPeople} зорчигч</p>
            </div>
          </div>
          <Badge className="bg-white/10 text-white border-none rounded-lg px-2 text-[10px]">x{numberOfPeople}</Badge>
        </div>
      </div>

      {/* Verification Footer */}
      <div className="pt-4 mt-4 border-t border-white/5">
        <div className="flex items-center gap-3 text-slate-500">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <p className="text-[11px] font-medium leading-relaxed">
            Таны сонгосон аялал баталгаажсан бөгөөд суудлын тоо хязгаартай.
          </p>
        </div>
      </div>
    </div>
  );
};