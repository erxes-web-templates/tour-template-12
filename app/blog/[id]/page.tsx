import Image from "next/image";
import { isBuildMode } from "../../../lib/buildMode";
import BlogPostPageClient from "../../_client/BlogPostPage";
import { fetchCmsPost } from "../../../lib/fetchCms";
import { getFileUrl } from "../../../lib/utils";

type PageProps = {
  params: { id: string };
};

export default async function PostDetailPage({ params }: PageProps) {
  if (isBuildMode()) {
    return <BlogPostPageClient initialPostId={params.id} />;
  }

  const post = await fetchCmsPost({ id: params.id });

  if (!post) {
    return <div className="container mx-auto p-4">Post not found.</div>;
  }

  return (
    <div className="container mx-auto p-4 mt-20">
      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-4">
          {post.title}
        </h1>

        <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
          <span>
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="gap-4">
        <div>
          {post.thumbnail && (
            <Image
              src={getFileUrl(post.thumbnail.url)}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-64 object-cover"
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </div>
  );
}