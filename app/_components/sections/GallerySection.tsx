"use client";

import React, { useState } from "react";
import CustomImage from "@/components/common/CustomImage";
import { Section } from "../../../types/sections";
import { getFileUrl } from "@/lib/utils";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Maximize2 } from "lucide-react";

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
        
        {/* Header - Бусад section-той ижил гарчиг */}
        <div className="flex flex-col items-center mb-16 space-y-4">
          <div className="flex items-center gap-2 px-4 py-1 bg-purple-100 text-[#692d91] rounded-full text-xs font-black uppercase tracking-widest">
            <Camera size={14} /> Гэрэл зургийн цомог
          </div>
          <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-gray-900 text-center">
            {section.config.title}
          </h2>
          {section.config.description && (
            <p className="text-center text-gray-500 font-medium max-w-2xl mx-auto italic">
              {section.config.description}
            </p>
          )}
          <div className="w-20 h-1.5 bg-[#692d91] rounded-full" />
        </div>

        {/* Carousel Gallery */}
        <Carousel 
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="-ml-4">
            {section.config.images.map((image: any, index: number) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="group relative" onClick={() => handleImageClick(image.url)}>
                  <Card className="overflow-hidden cursor-pointer border-none rounded-[40px] shadow-xl transition-all duration-500 group-hover:shadow-purple-200">
                    <CardContent className="p-0">
                      <div className="relative aspect-[4/5] w-full">
                        <CustomImage 
                          src={getFileUrl(image.url)} 
                          alt="gallery image" 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[#692d91]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                          <div className="bg-white/90 p-4 rounded-full scale-50 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
                            <Maximize2 className="text-[#692d91] h-6 w-6" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation Controls */}
          <div className="flex justify-center mt-12 gap-4">
            <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-2xl bg-white border-slate-100 hover:bg-[#692d91] hover:text-white shadow-lg transition-all" />
            <CarouselNext className="static translate-y-0 h-14 w-14 rounded-2xl bg-white border-slate-100 hover:bg-[#692d91] hover:text-white shadow-lg transition-all" />
          </div>
        </Carousel>

        {/* Full Image Modal */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          {selectedImage && (
            <DialogContent className="max-w-[95vw] md:max-w-5xl border-none bg-transparent shadow-none p-0 overflow-hidden outline-none">
              <div className="relative aspect-video w-full rounded-[40px] overflow-hidden shadow-2xl">
                <CustomImage 
                  src={getFileUrl(selectedImage)} 
                  alt="selected gallery" 
                  fill 
                  className="object-cover" 
                />
              </div>
            </DialogContent>
          )}
        </Dialog>
      </div>
    </section>
  );
};

export default GallerySection;