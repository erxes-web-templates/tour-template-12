"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@apollo/client";
import { ArrowRight } from "lucide-react";
import dayjs from "dayjs";

import { TOURS_GROUP_QUERY } from "../../../graphql/queries";
import { getFileUrl, templateUrl } from "@/lib/utils";
import { isBuildMode } from "../../../lib/buildMode";
import { Section } from "../../../types/sections";
import { TourGroup } from "../../../types/tours";

const ToursSection = ({ section }: { section: Section }) => {
  const isBuilder = isBuildMode();

  const { data, loading } = useQuery(TOURS_GROUP_QUERY, {
    variables: {
      perPage: section?.config?.limit || 6,
      page: 1,
      status: "website",
    },
  });

  const tours = data?.bmToursGroup?.list || [];

  if (loading) return <div className="py-24 text-center font-bold">Аяллууд ачаалж байна...</div>;

  return (
    <section id="featured-tours" className="bg-[#f7f5ef] py-24 scroll-mt-20 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-black  tracking-tighter mb-4 uppercase">
              {section?.config?.title?.split(" ")[0] || "Санал болгож буй"}{" "}
              <span className="text-[#692d91]">
                {section?.config?.title?.split(" ").slice(1).join(" ") || "аяллууд"}
              </span>
            </h2>
            <p className="text-gray-400 font-bold text-[11px] uppercase tracking-[0.3em]">
              Таны заавал үзэх ёстой байгалийн үзэсгэлэнт газрууд
            </p>
          </div>
          <div className="flex gap-2 text-slate-300 font-bold text-[10px] uppercase tracking-widest italic">
            <span>Гүйлгэж үзнэ үү</span> <ArrowRight size={14} />
          </div>
        </div>

        {/* Horizontal Scroll Container */}
        <div className="relative group">
          <div className="flex gap-8 overflow-x-auto pb-12 snap-x snap-mandatory touch-pan-x cursor-grab active:cursor-grabbing scroll-smooth custom-scrollbar">
            {tours.map((tour: TourGroup) => {
              const item = tour.items[0]; // Эхний аяллын мэдээллийг авах
              const tourId = item.groupCode;

              return (
                <div 
                  key={tourId} 
                  className="snap-center min-w-[320px] md:min-w-[400px] bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-purple-100/50 transition-all duration-700 border border-slate-50 group/card"
                >
                  {/* Image Section */}
                  <div className="relative h-80 overflow-hidden bg-gray-100">
                    {item.imageThumbnail ? (
                      <Image 
                        src={getFileUrl(item.imageThumbnail)} 
                        alt={item.name} 
                        fill
                        className="object-cover group-hover/card:scale-110 transition duration-1000 ease-in-out" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">Зураггүй</div>
                    )}
                    
                    {/* Үнэ */}
                    <div className="absolute top-6 left-6 bg-[#692d91] text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">
                      {item.cost ? `${item.cost.toLocaleString()}₮` : "Үнэ тодорхойгүй"}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8">
                    <div className="mb-8 h-28">
                      <p className="text-[10px] font-black text-[#692d91] uppercase tracking-[0.2em] mb-2">
                         📅 {dayjs(item.startDate).format("YYYY-MM-DD")}
                      </p>
                      <h3 className="font-black  text-2xl text-gray-900 tracking-tight line-clamp-2">
                        {item.name}
                      </h3>
                    </div>
                    
                    <Link 
                      href={
                        isBuilder
                          ? templateUrl(`/tour&tourId=${tourId}`)
                          : `/tours/${tourId}`
                      }
                      className="group/btn relative bg-slate-900 text-white w-full py-5 rounded-[20px] font-black text-[11px] uppercase tracking-[2px] text-center block overflow-hidden transition-all duration-300"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        Захиалах <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-[#692d91] translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300"></div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <Link
            className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-[#692d91] transition-colors"
            href={isBuilder ? templateUrl("/tours") : "/tours"}
          >
            Бүх аяллуудыг үзэх
          </Link>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
          margin-inline: 40px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e2e2;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #692d91;
        }
      `}</style>
    </section>
  );
};

export default ToursSection;