import { Section } from "@/types/sections"
import React from "react"
import { Youtube, PlayCircle } from "lucide-react"

const YoutubeSection = ({ section }: { section: Section }) => {
  // Youtube URL-ийг embed формат руу хөрвүүлэх
  const embedUrl = section.config.videoUrl.replace("watch?v=", "embed/")

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Чимэглэлийн эффектүүд */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-60 -translate-x-1/2" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 space-y-4">
          <div className="flex items-center gap-2 px-4 py-1 bg-purple-100 text-[#692d91] rounded-full text-xs font-black uppercase tracking-widest">
            <Youtube size={14} className="text-red-600" /> {section.config.subtitle || "Бидний аялал"}
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-gray-900 text-center leading-tight">
            {section.config.title || "Бидэнтэй хамт аялаарай!!!!!"}
          </h2>
          
          <div className="w-20 h-1.5 bg-[#692d91] rounded-full" />
        </div>

        {/* Video Container - Илүү бөөрөнхий, сүүдэртэй дизайн */}
        <div className="relative max-w-5xl mx-auto group">
          
          {/* Видеоны арын чимэглэл - Нил ягаан хүрээ */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#692d91]/20 to-yellow-400/10 rounded-[50px] blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
          
          <div className="relative aspect-video w-full rounded-[40px] overflow-hidden shadow-2xl border-[8px] border-white bg-slate-100">
            {/* Play Icon Overlay (Нүдэнд харагдахуйц эффект) */}
            <div className="absolute inset-0 bg-black/5 pointer-events-none group-hover:bg-transparent transition-all duration-500" />
            
            <iframe
              className="w-full h-full"
              src={embedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Баруун доод буланд байрлах жижиг икон */}
          <div className="absolute -bottom-6 -right-6 bg-yellow-400 p-5 rounded-[30px] shadow-2xl hidden md:block transform rotate-12">
            <PlayCircle size={32} className="text-[#692d91]" />
          </div>
        </div>

      </div>
    </section>
  )
}

export default YoutubeSection