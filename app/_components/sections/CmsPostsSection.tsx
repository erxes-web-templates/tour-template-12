"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_CMS_POSTS } from "../../../graphql/queries";
import { getFileUrl, templateUrl } from "@/lib/utils";
import { isBuildMode } from "../../../lib/buildMode";
import { toHtml } from "../../../lib/html";
import { Section } from "../../../types/sections";
import { useParams } from "next/navigation";
import { CmsPost } from "../../../types/cms";
import { ArrowUpRight } from "lucide-react";

const CmsPostsSection = ({ section }: { section: Section }) => {
  const params = useParams();

  const { data } = useQuery(GET_CMS_POSTS, {
    variables: {
      perPage: section.config.perPage,
      page: 1,
      clientPortalId: params.id || process.env.ERXES_CP_ID,
      categoryIds: section.config.categoryId ? [section.config.categoryId] : undefined,
    },
  });

  const posts = data?.cmsPosts || [];
  const isBuilder = isBuildMode();

  return (
    <section className="py-24 bg-white border-t border-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Minimalist Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-gray-100 pb-8 gap-4">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#692d91]/60">
              Insights & News
            </span>
            <h2 className="text-3xl md:text-4xl font-light tracking-tight text-gray-900">
              {section.config.title}
            </h2>
          </div>
          
          <Link
            href={isBuilder ? templateUrl("/blogs") : "/blog"}
            className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#692d91] transition-colors"
          >
            View all articles
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* Posts Grid - Minimal layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {posts.map((post: CmsPost) => (
            <Card key={post._id} className="group border-none shadow-none bg-transparent flex flex-col h-full ring-0">
              {/* Image - Low roundness, No shadow */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm mb-6 bg-gray-50">
                {post.thumbnail ? (
                  <Image
                    src={getFileUrl(post.thumbnail.url)}
                    alt={post.title}
                    fill
                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs uppercase tracking-widest">
                    No image
                  </div>
                )}
              </div>

              <CardContent className="p-0 flex-grow">
                {/* Meta info */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#692d91]">
                    Editorial
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-200" />
                  <span className="text-[10px] text-gray-400 font-medium">
                    New Post
                  </span>
                </div>

                <Link 
                  href={isBuilder ? templateUrl(`/post&postId=${post._id}`) : `/blog/${post._id}`}
                  className="block group-hover:opacity-70 transition-opacity"
                >
                  <h3 className="text-xl font-medium leading-tight text-gray-900 mb-3 tracking-tight">
                    {post.title}
                  </h3>
                </Link>

                <div 
                  className="text-gray-500 text-sm leading-relaxed line-clamp-2 font-light"
                  dangerouslySetInnerHTML={toHtml(post.expert)} 
                />
              </CardContent>

              <CardFooter className="p-0 pt-6 mt-auto">
                <Link
                  href={isBuilder ? templateUrl(`/post&postId=${post._id}`) : `/blog/${post._id}`}
                  className="text-xs font-bold uppercase tracking-widest text-gray-900 flex items-center gap-2 border-b border-gray-900/10 pb-1 group-hover:border-[#692d91] transition-all"
                >
                  Read Article
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CmsPostsSection;