"use client"

import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { getFileUrl } from "@/lib/utils"

interface ImageSwiperProps {
  images: string[]
  dayNumber: number
}

export default function ImageSwiper({ images, dayNumber }: ImageSwiperProps) {
  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="relative">
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((image: string, index: number) => (
            <CarouselItem key={index}>
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={getFileUrl(image)}
                  alt={`Day ${dayNumber} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </>
        )}
      </Carousel>
    </div>
  )
}
