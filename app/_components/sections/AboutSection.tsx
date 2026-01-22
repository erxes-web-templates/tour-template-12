"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import { Section } from "../../../types/sections";
import { getFileUrl, templateUrl } from "@/lib/utils";
import { toHtml } from "../../../lib/html";
import { isBuildMode } from "../../../lib/buildMode";
import Link from "next/link";
import { Sparkles, ShieldCheck, Heart, Globe } from "lucide-react";

const AboutSection = ({ section }: { section: Section }) => {
  const isImageLeft = section.config.imagePosition === "left";
  const isBuilder = isBuildMode();
  
  const ctaHref = section.config.primaryCtaUrl
    ? isBuilder
      ? templateUrl(section.config.primaryCtaUrl)
      : section.config.primaryCtaUrl
    : "#";

  const stats = [
    { label: "Аялагчид", value: "10,000+", icon: <Heart className="text-red-500" /> },
    { label: "Жил ажилласан", value: "14", icon: <Sparkles className="text-yellow-500" /> },
    { label: "Чиглэлүүд", value: "45", icon: <Globe className="text-blue-500" /> },
    { label: "Баталгаа", value: "100%", icon: <ShieldCheck className="text-green-500" /> },
  ];

  return (
    /* mt-10 нэмж өгснөөр өмнөх section-оос зай авна. relative z-0 нь цэстэй давхарлахаас сэргийлнэ */
    <section id="about" className="min-h-screen bg-white pb-20 relative z-0 mt-10">
      

      {/* Content Section - Контент болон зургийн хэсэг */}
      <div className="max-w-7xl mx-auto px-6 py-32 flex flex-col md:flex-row items-center gap-20">
        
        {/* IMAGE SIDE */}
        <div className={`md:w-1/2 relative ${!isImageLeft ? "md:order-last" : ""}`}>
          <div className="aspect-square bg-[#692d91] rounded-[60px] overflow-hidden transform rotate-3 relative shadow-2xl">
            {section.config.image && (
              <Image
                src={getFileUrl(section.config.image.url) || section.config.image.initUrl}
                alt="About"
                fill
                className="w-full h-full object-cover -rotate-3 hover:scale-110 transition-transform duration-1000"
              />
            )}
          </div>
          {/* Floating Badge */}
          <div className="absolute -bottom-10 -right-6 bg-yellow-400 p-8 rounded-[40px] shadow-2xl hidden lg:block transform -rotate-6 z-10">
            <p className="text-3xl font-black italic tracking-tighter leading-none text-gray-900">
              Мэдрэмж <br/> бүхнээс илүү
            </p>
          </div>
        </div>

        {/* TEXT SIDE */}
        <div className="md:w-1/2 space-y-8">
          <div className="inline-block px-4 py-1 bg-purple-100 text-[#692d91] rounded-full text-xs font-black uppercase tracking-widest">
            Бидний тухай
          </div>
          <h3 className="text-4xl font-black text-gray-900 italic tracking-tighter uppercase leading-tight">
            Бидний <span className="text-[#692d91]">үүрэг хариуцлага</span>
          </h3>
          
          <div 
            className="prose prose-lg text-gray-600 font-medium leading-loose max-w-none
              prose-p:mb-4 prose-li:list-disc prose-li:text-purple-600"
            dangerouslySetInnerHTML={toHtml(section.config.description)}
          />

          {section.config.primaryCta && (
            <div className="pt-6">
              <Link href={ctaHref}>
                <Button className="bg-[#692d91] hover:bg-yellow-400 hover:text-gray-900 text-white px-10 py-8 rounded-[24px] text-lg font-black uppercase italic transition-all shadow-xl hover:shadow-yellow-200">
                  {section.config.primaryCta}
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default AboutSection;