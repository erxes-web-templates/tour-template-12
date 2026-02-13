import Link from "next/link";
import Image from "next/image";
import { isBuildMode } from "../../lib/buildMode";
import BlogPageClient from "../_client/BlogPage";
import { fetchCmsPosts } from "../../lib/fetchCms";
import data from "../../data/configs.json";
import { Button } from "../../components/ui/button";
import { getFileUrl } from "../../lib/utils";
import type { CmsPost } from "../../types/cms";
import { Calendar, ChevronRight, ChevronLeft } from "lucide-react";

export default async function BlogsPage() {
  if (isBuildMode()) {
    return <BlogPageClient />;
  }

  const posts = await fetchCmsPosts({
    perPage: 10,
    page: 1,
    clientPortalId: data.cpId,
  });

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
        
        {/* Буцах товч - Нүүр хуудасны блог хэсэг рүү үсэрнэ */}
        <div className="mb-8 flex justify-start">
          <Link 
            href="/#blog-section" 
            className="group inline-flex items-center gap-2 text-slate-500 hover:text-purple-600 transition-colors duration-200"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 group-hover:bg-purple-50 group-hover:border-purple-100 transition-all">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest">Нүүр хуудас руу буцах</span>
          </Link>
        </div>

        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-4 lowercase">
            Мэдээ, мэдээлэл
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl mx-auto">
            Аяллын зөвлөгөө, сонирхолтой мэдээ мэдээллийг эндээс уншаарай.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: CmsPost) => (
            <Link 
              key={post._id} 
              href={`/blog/${post._id}`}
              className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {post.thumbnail ? (
                  <Image
                    src={getFileUrl(post.thumbnail.url)}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Зураггүй</span>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 bg-white/90 backdrop-blur text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm text-slate-800">
                    Мэдээ
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-4 text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {new Date(post.createdAt).toLocaleDateString("mn-MN")}
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight tracking-tighter line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {post.title}
                </h3>
                
                <div 
                  className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-6 font-medium"
                  dangerouslySetInnerHTML={{ 
                    __html: post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' 
                  }} 
                />

                <div className="mt-auto pt-4 flex items-center text-purple-600 text-xs font-black uppercase tracking-widest">
                  Дэлгэрэнгүй унших
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}