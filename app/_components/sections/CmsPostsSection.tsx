import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { GET_CMS_POSTS } from "../../../graphql/queries";
import { getFileUrl, templateUrl } from "@/lib/utils";
import { Section } from "../../../types/sections";
import { useParams } from "next/navigation";
import { CmsPost } from "../../../types/cms";

const CmsPostsSection = ({ section }: { section: Section }) => {
  const params = useParams();

  const { data } = useQuery(GET_CMS_POSTS, {
    variables: {
      perPage: section.config.perPage,
      page: 1,
      clientPortalId: params.id,
      categoryId: section.config.categoryId,
    },
  });

  const posts = data?.cmsPosts || [];

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{section.config.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: CmsPost) => (
            <Card key={post._id}>
              <CardHeader>
                {post.thumbnail && <Image src={getFileUrl(post.thumbnail.url)} alt={post.title} width={300} height={300} className="rounded-t-lg" />}
              </CardHeader>
              <CardContent>
                <CardTitle className="mb-2">{post.title}</CardTitle>
                <CardDescription>
                  <p dangerouslySetInnerHTML={{ __html: post.content }} />
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Link href={templateUrl(`/post&postId=${post._id}&slug=${post.slug}`)}>
                  {" "}
                  <Button>Read more</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className=" text-center mt-6 ">
          <Link className="underline" href={templateUrl("/blogs")}>
            Show All blogs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CmsPostsSection;
