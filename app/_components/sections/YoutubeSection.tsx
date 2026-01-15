import { Section } from "@/types/sections"
import React from "react"

const YoutubeSection = ({ section }: { section: Section }) => {
  const embedUrl = section.config.videoUrl.replace("watch?v=", "embed/")
  return (
    <section className='relative py-8 sm:py-6 md:py-12 px-4 bg-gray-100'>
      <div className='max-w-7xl mx-auto'>
        {/* Section Header */}
        <div className='text-center mb-8 sm:mb-10 md:mb-12'>
          <div className='flex items-center justify-center gap-2 mb-2 sm:mb-4'>
            <span className='text-emerald-400 uppercase tracking-wider text-xs sm:text-sm font-medium'>
              {section.config.subtitle || "Video of our trip"}
            </span>
          </div>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2 sm:mb-4'>
            {section.config.title || "Enjoy your trip with us"}
          </h2>
        </div>

        {/* Video Container */}
        <div className='relative aspect-video w-full max-w-5xl mx-auto rounded-lg sm:rounded-xl overflow-hidden shadow-lg sm:shadow-xl'>
          <div className='absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-transparent pointer-events-none' />
          <iframe
            className='w-full h-full'
            src={embedUrl}
            title='YouTube video player'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        </div>
      </div>
    </section>
  )
}

export default YoutubeSection
