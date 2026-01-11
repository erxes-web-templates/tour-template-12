import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import { useQuery } from "@apollo/client";
import { TOURS_GROUP_QUERY, TOURS_QUERY } from "../../../graphql/queries";
import {
  getFileUrl,
  templateUrl,
  // templateUrlWithSlug,
} from "@/lib/utils";
import { toHtml } from "@/lib/html";
import { Section } from "../../../types/sections";
import { BmTour } from "../../../types/tours";
import Image from "next/image";
import dayjs from "dayjs";

const ToursSection = ({ section }: { section: Section }) => {
  const { data } = useQuery(TOURS_GROUP_QUERY, {
    variables: {
      perPage: section?.config?.limit || 6,
      page: 1,
      status: "website",
    },
  });

  const tours = data?.bmToursGroup?.list || [];

  console.log(tours);

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">
          {section?.config?.title || "Featured tours"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour: BmTour) => (
            <Card key={tour.items[0]._id}>
              <CardHeader>
                {tour.items[0].imageThumbnail && (
                  <div className="relative w-full h-[200px]">
                    <Image
                      src={getFileUrl(tour.items[0].imageThumbnail)}
                      alt={tour.items[0].name}
                      fill
                      className="rounded-md h-[200px]"
                    />
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <CardTitle>{tour.items[0].name}</CardTitle>
                <CardDescription>
                  <p
                    dangerouslySetInnerHTML={toHtml(tour.items[0].content)}
                  />
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <span className="text-lg font-bold">{tour.items[0].cost}</span>
                <span className="text-lg font-bold">
                  {dayjs(tour.items[0].startDate).format("YYYY-MM-DD")}
                </span>
                <Link href={templateUrl(`/tour&tourId=${tour.items[0]._id}`)}>
                  {" "}
                  <Button>{`Book Now`}</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className=" text-center mt-6 ">
          <Link className="underline" href={templateUrl("/tours")}>
            Show All tours
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ToursSection;
