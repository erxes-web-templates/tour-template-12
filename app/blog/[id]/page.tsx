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
      <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
      <p>{post.createdAt}</p>
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
