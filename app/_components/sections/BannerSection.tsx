"use client";

import Link from "next/link";
import Image from "next/image";
import { Section } from "../../../types/sections";
import { getFileUrl } from "@/lib/utils";
import { templateUrl } from "@/lib/utils";
import { isBuildMode } from "../../../lib/buildMode";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

type LinkType = "product" | "productCategory" | "productTag" | "external";

const getHrefForLink = (link?: { type?: LinkType; value?: string }) => {
  if (!link?.type || !link.value) return null;
  const isBuilder = isBuildMode();

  switch (link.type) {
    case "product":
      return isBuilder ? templateUrl(`/product&productId=${link.value}`) : `/products/${link.value}`;
    case "productCategory":
      return isBuilder ? `${templateUrl("/products")}&categoryId=${link.value}` : `/products?categoryId=${link.value}`;
    case "productTag":
      return isBuilder ? `${templateUrl("/products")}&tag=${link.value}` : `/products?tag=${link.value}`;
    case "external":
    default:
      return link.value;
  }
};

const BannerSection = ({ section }: { section: Section }) => {
  const title = section.config?.title ?? "Banner";
  const description = section.config?.description ?? "";
  const imageKey: string | undefined = section.config?.image;
  const link = section.config?.link ?? {
    type: section.config?.linkType,
    value: section.config?.linkValue ?? section.config?.url,
  };

  let imageUrl: string | undefined;
  if (imageKey) {
    try { imageUrl = getFileUrl(imageKey); } catch { imageUrl = imageKey; }
  }

  const href = getHrefForLink(link);

  const content = (
    <div className="relative min-h-[400px] overflow-hidden rounded-[40px] bg-slate-900 group shadow-2xl">
      {/* Background Image with Hover Zoom */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={title || "Banner image"}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          priority
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
          Banner image missing
        </div>
      )}

      {/* Modern Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-center items-start gap-4 p-10 md:p-16 text-white max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="h-1 w-10 bg-yellow-400 rounded-full" />
          <p className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">
            Онцлох санал
          </p>
        </div>

        <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
          {title}
        </h2>

        {description && (
          <p className="text-lg md:text-xl text-white/80 font-medium leading-relaxed italic opacity-90">
            {description}
          </p>
        )}

        {href && (
          <div className="pt-6">
            <div className="inline-flex items-center justify-center bg-white text-black px-8 py-4 rounded-2xl font-black uppercase italic text-sm transition-all group-hover:bg-[#692d91] group-hover:text-white group-hover:shadow-xl group-hover:shadow-purple-500/20">
              Дэлгэрэнгүй үзэх
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        )}
      </div>

      {/* Decorative Corner Element */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#692d91]/20 backdrop-blur-3xl rounded-tl-[100px] z-0" />
    </div>
  );

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-7xl px-6">
        <Card className="border-0 bg-transparent shadow-none overflow-visible">
          {href ? (
            <Link href={href} className="block transition-transform duration-300 active:scale-[0.98]">
              {content}
            </Link>
          ) : (
            <div className="relative">
              {content}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest text-slate-300 whitespace-nowrap">
                Banner editor-т холбоос нэмнэ үү
              </div>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
};

export default BannerSection;