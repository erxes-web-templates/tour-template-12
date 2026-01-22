"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section } from "../../../types/sections";
import { getFileUrl, templateUrl, isBuildMode } from "@/lib/utils";

type CarouselLinkType = "product" | "productCategory" | "external";

type CarouselConfigItem = {
  id?: string;
  title?: string;
  description?: string;
  image?: string;
  link?: {
    type?: CarouselLinkType;
    value?: string;
  };
  url?: string;
};

// ... (resolveImageUrl болон resolveLink функцууд хэвээрээ үлдэнэ)
const resolveImageUrl = (key?: string | null) => {
  if (!key) return undefined;
  if (key.startsWith("http://") || key.startsWith("https://")) return key;
  if (key.startsWith("/")) return key;
  try { return getFileUrl(key); } catch { return key; }
};

const resolveLink = (item: CarouselConfigItem): { href: string; isExternal: boolean } | null => {
  const linkType = item.link?.type ?? ("external" as CarouselLinkType);
  const value = item.link?.value ?? item.url ?? "";
  if (!value) return null;
  if (linkType === "external") return { href: value, isExternal: true };
  const isBuilder = isBuildMode();
  if (linkType === "product") return {
    href: isBuilder ? templateUrl(`/product&productId=${value}`) : `/products/${value}`,
    isExternal: false,
  };
  if (linkType === "productCategory") return {
    href: isBuilder ? `${templateUrl("/products")}&categoryId=${value}` : `/products?categoryId=${value}`,
    isExternal: false,
  };
  return null;
};

const CarouselSection = ({ section }: { section: Section }) => {
  const items: CarouselConfigItem[] = useMemo(() => section.config?.items ?? [], [section.config?.items]);

  if (!items.length) return null;

  return (
    <section className="relative group select-none">
      <Carousel className="w-full h-[600px] md:h-[800px]">
        <CarouselContent className="ml-0 h-full">
          {items.map((item) => {
            const imageUrl = resolveImageUrl(item.image);
            const link = resolveLink(item);

            return (
              <CarouselItem key={item.id ?? item.title ?? Math.random()} className="pl-0 basis-full h-full relative overflow-hidden">
                {/* Image Layer */}
                <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.title ?? ""}
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-500">No image</div>
                  )}
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141824]/90 via-[#141824]/40 to-transparent" />
                </div>

                {/* Content Layer */}
                <div className="absolute inset-0 flex items-center justify-start container mx-auto px-8 md:px-16">
                  <div className="max-w-2xl space-y-6">
                    <div className="space-y-2 animate-in slide-in-from-bottom-4 duration-700">
                      <div className="h-1.5 w-12 bg-[#692d91] rounded-full mb-4" />
                      <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-none">
                        {item.title ?? "Untitled"}
                      </h2>
                      {item.description && (
                        <p className="text-lg md:text-xl text-white/80 font-medium max-w-lg leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {link && (
                      <div className="pt-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <Link
                          href={link.href}
                          target={link.isExternal ? "_blank" : undefined}
                          className="inline-flex items-center justify-center bg-[#692d91] hover:bg-yellow-400 text-white hover:text-black px-10 py-4 rounded-[20px] text-lg font-black uppercase italic transition-all shadow-2xl hover:shadow-yellow-200/50 active:scale-95"
                        >
                          Learn more
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Navigation Buttons - Styled to match your UI */}
        <div className="absolute bottom-10 right-10 flex gap-3 z-20">
          <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-2xl bg-white/10 hover:bg-[#692d91] border-none text-white backdrop-blur-md transition-all active:scale-90" />
          <CarouselNext className="static translate-y-0 h-14 w-14 rounded-2xl bg-white/10 hover:bg-[#692d91] border-none text-white backdrop-blur-md transition-all active:scale-90" />
        </div>

        {/* Slide Indicator Line (Optional decorative element) */}
        <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#692d91] to-yellow-400 z-30 animate-progress w-full opacity-50" />
      </Carousel>
    </section>
  );
};

export default CarouselSection;