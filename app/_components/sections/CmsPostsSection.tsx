"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_CMS_POSTS } from "../../../graphql/queries";
import { getFileUrl, templateUrl } from "@/lib/utils";
import { isBuildMode } from "../../../lib/buildMode";
import { Section } from "../../../types/sections";
import { useParams } from "next/navigation";
import { CmsPost } from "../../../types/cms";
import { ArrowRight, Calendar, ArrowUpRight } from "lucide-react";

const CmsPostsSection = ({ section }: { section: Section }) => {
  const params = useParams();
  const isBuilder = isBuildMode();

  const { data } = useQuery(GET_CMS_POSTS, {
    variables: {
      perPage: section.config.perPage || 3, // 3 болгож өөрчлөвөл илүү том харагдана
      page: 1,
      clientPortalId: params.id || process.env.ERXES_CP_ID,
      categoryIds: section.config.categoryId ? [section.config.categoryId] : undefined,
    },
  });

  const posts = data?.cmsPosts || [];

  return (
    <section id="blog-section" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Minimalist Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-[2px] bg-purple-600" />
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-purple-600">
                {section.config.subtitle || "Бидний тухай"}
              </p>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 leading-tight">
              {section.config.title || "Аяллын тэмдэглэл"}
            </h2>
          </div>
          
          <Link
            href={isBuilder ? templateUrl("/blogs") : "/blog"}
            className="group inline-flex items-center gap-3 bg-slate-50 hover:bg-purple-600 hover:text-white px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-900 transition-all duration-300"
          >
            Бүх мэдээг үзэх
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Posts Grid - Larger 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post: CmsPost) => (
            <Link 
              key={post._id} 
              href={isBuilder ? templateUrl(`/post&postId=${post._id}`) : `/blog/${post._id}`}
              className="group flex flex-col space-y-6"
            >
              {/* Large Image Container */}
              <div className="relative aspect-[16/11] overflow-hidden rounded-[2.5rem] bg-slate-100 shadow-2xl shadow-slate-200/40">
                {post.thumbnail ? (
                  <Image
                    src={getFileUrl(post.thumbnail.url)}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-300 font-bold uppercase tracking-widest">No Image</div>
                )}
                
                {/* Minimalist Overlay Badge */}
                <div className="absolute top-6 left-6">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/20">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-900 uppercase">
                            <Calendar size={12} className="text-purple-600" />
                            {new Date(post.createdAt).toLocaleDateString("mn-MN")}
                        </div>
                    </div>
                </div>
              </div>

              {/* Content Below Image */}
              <div className="px-2 space-y-4">
                <h4 className="text-xl md:text-2xl font-black text-slate-900 leading-[1.2] tracking-tight group-hover:text-purple-600 transition-colors line-clamp-2">
                  {post.title}
                </h4>
                
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-purple-600 transition-all">
                  Дэлгэрэнгүй унших
                  <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CmsPostsSection;