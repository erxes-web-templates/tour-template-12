import React from "react"
import { Section } from "../../../types/sections"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { getFileUrl, templateUrl } from "@/lib/utils"
import { toHtml } from "../../../lib/html"
import { isBuildMode } from "../../../lib/buildMode"
import { ArrowRight, Sparkles } from "lucide-react"

const HeroSection = ({ section }: { section: Section }) => {
  const isBuilder = isBuildMode()
  const ctaHref = section.config.primaryCtaUrl
    ? isBuilder
      ? templateUrl(section.config.primaryCtaUrl)
      : section.config.primaryCtaUrl
    : "#"

  return (
    /* mt-20 эсвэл mt-24 нь Navbar-аас доош зай авна. 
       h-[calc(100vh-100px)] нь дэлгэцийн өндрөөс Navbar-ын зайг хасч тооцно.
    */
    <section className='relative h-[750px] mt-24 px-4 mb-16'>
      <div className="relative w-full h-full overflow-hidden rounded-[40px] shadow-2xl">
        {/* Background Image */}
        {section.config.image && (
          <div className="absolute inset-0">
            <Image
              src={getFileUrl(section.config.image.url) || section.config.image.initUrl}
              alt='Hero Background'
              fill
              className='object-cover'
              sizes='100vw'
              priority
            />
            {/* Dark Gradient Overlay - Текст илүү сайн уншигдахад тусална */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          </div>
        )}
        
        {/* Content Container - Зүүн тийш шахсан (items-start) */}
        <div className='relative z-10 container mx-auto h-full px-8 md:px-16 flex flex-col justify-center items-start'>
          
          {/* Top Badge - Нил ягаан өнгөтэй */}
          <div className="flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2.5 rounded-full">
            <div className="w-5 h-5 rounded-full bg-[#692d91] flex items-center justify-center">
               <Sparkles size={12} className="text-white fill-current" />
            </div>
            <span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
              Explore the unseen mongolia
            </span>
          </div>

          {/* Huge Title - Зураг дээрх шиг хүчирхэг стиль */}
          <h1 className='text-[70px] md:text-[110px] font-black italic uppercase leading-[0.85] text-white tracking-tighter mb-6'>
            {section.config.title}
          </h1>
          
          {/* Description */}
          <div
            className='text-white/90 text-lg md:text-xl font-medium mb-12 max-w-xl leading-relaxed italic drop-shadow-sm'
            dangerouslySetInnerHTML={toHtml(section.config.description)}
          ></div>
          
          {/* Action Buttons - Нил ягаан стиль */}
          <div className="flex flex-wrap gap-5">
            {section.config.primaryCtaUrl && (
              <Link href={ctaHref}>
                <Button 
                  size='lg' 
                  className="bg-[#692d91] hover:bg-yellow-400 text-white hover:text-black font-black uppercase px-10 py-8 rounded-2xl flex items-center gap-3 text-lg transition-all duration-300 group shadow-xl shadow-purple-900/20"
                >
                  {section.config.primaryCta}
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            )}

            {/* Аялал үзэх - Дагалдах товчлуур */}
            <Button 
              variant="outline"
              size='lg' 
              className="bg-white/10 backdrop-blur-md border-white/30 text-white hover:bg-white hover:text-black font-black uppercase px-10 py-8 rounded-2xl text-lg transition-all"
            >
              Аялал үзэх
            </Button>
          </div>

          {/* Scroll Down Indicator */}
          <div className="absolute bottom-12 left-16 hidden md:flex flex-col items-center gap-3">
              <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em] [writing-mode:vertical-lr]">Scroll</span>
              <div className="w-[1px] h-16 bg-gradient-to-b from-white/60 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection