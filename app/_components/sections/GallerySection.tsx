"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
// Mousewheel модулийг нэмж импортлох
import { Autoplay, EffectCoverflow, Navigation, Mousewheel } from "swiper/modules";
import CustomImage from "@/components/common/CustomImage";
import { Section } from "../../../types/sections";
import { getFileUrl } from "@/lib/utils";
// DialogHeader, DialogTitle, DialogDescription-ийг нэмж импортлов
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Camera, Maximize2, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/mousewheel"; // Mousewheel CSS нэмэх

const GallerySection = ({ section }: { section: Section }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setIsDialogOpen(true);
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        
        {/* Header - Гарчиг хэсэг */}
        <div className="flex flex-col items-center mb-16 space-y-4">
          <div className="flex items-center gap-2 px-4 py-1 bg-purple-100 text-[#692d91] rounded-full text-xs font-black uppercase tracking-widest">
            <Camera size={14} /> Гэрэл зургийн цомог
          </div>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-gray-900 text-center">
            {section.config.title}
          </h2>
          <div className="w-20 h-1.5 bg-[#692d91] rounded-full" />
        </div>

        {/* Swiper Gallery */}
        <div className="relative px-4 md:px-12">
          <Swiper
            effect={"coverflow"}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            loop={false}
            mousewheel={{
              forceToAxis: true,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 150,
              modifier: 2,
              slideShadows: false,
            }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            modules={[EffectCoverflow, Autoplay, Navigation, Mousewheel]}
            className="w-full !py-12"
          >
            {section.config.images.map((image: any, index: number) => (
              <SwiperSlide key={index} className="!w-[300px] md:!w-[400px]">
                {({ isActive }) => (
                  <div 
                    className={`group relative transition-all duration-500 cursor-pointer ${
                      isActive ? "scale-100" : "scale-85 opacity-80"
                    }`}
                    onClick={() => handleImageClick(image.url)}
                  >
                    <div className="relative aspect-[4/5] w-full rounded-[40px] overflow-hidden shadow-2xl">
                      <CustomImage 
                        src={getFileUrl(image.url)} 
                        alt="gallery image" 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      
                      <div className="absolute inset-0 bg-[#692d91]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="bg-white/90 p-4 rounded-full">
                          <Maximize2 className="text-[#692d91] h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#692d91] hover:bg-[#692d91] hover:text-white shadow-xl transition-all">
            <ChevronLeft size={24} />
          </button>
          <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 h-14 w-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[#692d91] hover:bg-[#692d91] hover:text-white shadow-xl transition-all">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {/* max-w-3xl болгож багасгасан, mt-24-өөр цэсний доор байрлуулсан */}
          <DialogContent className="max-w-5xl w-[90vw] border-none bg-transparent shadow-none p-0 focus:outline-none top-[55%] translate-y-[-50%]">
            <DialogHeader>
              <DialogTitle className="sr-only">Гэрэл зураг</DialogTitle>
              <DialogDescription className="sr-only">Галлерей үзэх</DialogDescription>
            </DialogHeader>

            {selectedImage && (
              <div className="relative aspect-video w-full rounded-[30px] overflow-hidden shadow-2xl border-4 border-white/20">
                <CustomImage src={getFileUrl(selectedImage)} alt="full view" fill className="object-cover" />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default GallerySection;