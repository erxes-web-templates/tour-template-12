"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Hash, MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";

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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-600">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Баталгаажсан аялал</span>
        </div>
        
        <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tighter">
          {tour.name}
        </h2>
        
        <div className="flex gap-1">
          <div className="h-1.5 w-12 bg-purple-600 rounded-full" />
          <div className="h-1.5 w-4 bg-black-100 rounded-full" />
          <div className="h-1.5 w-2 bg-black-50 rounded-full" />
        </div>
      </div>

      {/* Info List */}
      <div className="space-y-3">
        {/* Reference */}
        <div className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100 transition-all hover:bg-white hover:shadow-md hover:shadow-slate-200/50">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white shadow-sm rounded-xl text-slate-400 text-purple-600 transition-colors border border-slate-50">
              <Hash className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Лавлах дугаар</p>
              <p className="font-bold text-sm text-slate-700">{tour.refNumber}</p>
            </div>
          </div>
        </div>

        {/* Departure Date */}
        <div className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100 transition-all hover:bg-white hover:shadow-md hover:shadow-slate-200/50">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white shadow-sm rounded-xl text-slate-400 text-purple-600 transition-colors border border-slate-50">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Аялах огноо</p>
              <p className="font-bold text-sm text-slate-700">
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
        <div className="group flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100 transition-all hover:bg-white hover:shadow-md hover:shadow-slate-200/50">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-white shadow-sm rounded-xl text-slate-400 text-orange-600 transition-colors border border-slate-50">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Зорчигчийн тоо</p>
              <p className="font-bold text-sm text-slate-700">{numberOfPeople} зорчигч</p>
            </div>
          </div>
          <Badge className="bg-slate-100 text-slate-600 border-none rounded-lg px-2 text-[10px] font-black">x{numberOfPeople}</Badge>
        </div>
      </div>

      {/* Verification Footer */}
      <div className="pt-5 mt-4 border-t border-slate-100">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/50 border border-purple-50">
          <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0" />
          <p className="text-[11px] font-medium text-purple-800 leading-relaxed">
            Таны сонгосон аялал системд <span className="font-black uppercase tracking-tighter">баталгаажсан</span> бөгөөд суудлын тоо хязгаартай байгааг анхаарна уу.
          </p>
        </div>
      </div>
    </div>
  );
};