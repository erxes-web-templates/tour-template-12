import { Button } from "@/components/ui/button";
import React from "react";
import { Section } from "../../../types/sections";
import { templateUrl } from "@/lib/utils";
import { toHtml } from "../../../lib/html";
import { isBuildMode } from "../../../lib/buildMode";
import Link from "next/link";

const TextSection = ({ section }: { section: Section }) => {
  const isBuilder = isBuildMode();
  const ctaHref = section.config.primaryCtaUrl
    ? isBuilder
      ? templateUrl(section.config.primaryCtaUrl)
      : section.config.primaryCtaUrl
    : "#";

  return (
    <section id="text-section" className="py-24 bg-white relative overflow-hidden">
      {/* Чимэглэлийн зориулалттай арын бүдгэрүүлсэн дугуй дүрс */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-50 z-0" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Гарчиг хэсэг */}
          <div className="mb-12 space-y-4">
            <div className="w-12 h-1.5 bg-[#692d91] rounded-full mx-auto md:mx-0" />
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-gray-900 leading-tight text-center md:text-left">
              {section.config.title}
            </h2>
          </div>

          {/* Агуулга хэсэг */}
          <div className="flex flex-wrap items-center">
            <div className="w-full">
              <div
                className="text-lg md:text-xl text-gray-600 leading-loose font-medium mb-10 
                           prose prose-purple max-w-none 
                           prose-p:mb-6 prose-strong:font-black"
                dangerouslySetInnerHTML={toHtml(section.config.description)}
              />
              
              {/* CTA Button */}
              {section.config.primaryCtaUrl && (
                <div className="flex justify-center md:justify-start">
                  <Link href={ctaHref}>
                    <Button className="bg-[#692d91] hover:bg-yellow-400 hover:text-gray-900 text-white 
                                     px-10 py-7 rounded-[22px] text-lg font-black uppercase italic 
                                     transition-all duration-300 shadow-xl hover:shadow-purple-200">
                      {section.config.primaryCta}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TextSection;