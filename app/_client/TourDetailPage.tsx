"use client";

import { useQuery } from "@apollo/client";
import { useSearchParams } from "next/navigation";
import { TOUR_DETAIL_QUERY, TOURS_GROUP_QUERY } from "../../graphql/queries";
import usePage from "../../lib/usePage";
import Image from "next/image";
import { getFileUrl, templateUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ImageSwiper from "../tours/_components/ImageSwiper";
type TourDetailPageProps = {
  initialTourId?: string;
};

export default function TourDetailPage({ initialTourId }: TourDetailPageProps) {
  const searchParams = useSearchParams();

  const pageName = searchParams.get("pageName"); //pageName = about, tours, contact etc

  const PageContent = usePage(pageName);

  const tourId = searchParams.get("tourId") ?? initialTourId;

  const { data } = useQuery(TOUR_DETAIL_QUERY, {
    variables: {
      id: tourId,
    },
  });

  const { data: groupToursData } = useQuery(TOURS_GROUP_QUERY, {
    variables: {
      status: "website",
    },
  });

  const tour = data?.bmTourDetail || {};
  const groupTours = groupToursData?.bmToursGroup?.list || [];

  return (
    <div className="container mx-auto p-4">
      {tour.imageThumbnail && (
        <div className="relative w-full h-[500px]">
          <Image
            src={getFileUrl(tour.imageThumbnail)}
            alt={tour.name}
            fill
            className="rounded-md "
          />
        </div>
      )}
      <div className="flex gap-3 my-3">
        {tour.images &&
          tour.images.map((image: any, index: number) => (
            <div key={index} className="relative w-[300px] h-[200px]">
              <Image
                src={getFileUrl(image)}
                alt={tour.name}
                fill
                className="rounded-md "
              />
            </div>
          ))}
      </div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">{tour.name}</h1>
        <div className="flex gap-3 justify-end">
          <Link href={templateUrl("/inquiry")}>Inquire now</Link>
          <Link href={templateUrl("/booking")}>Book tour</Link>
        </div>
      </div>

      {tour?.itinerary?.groupDays && (
        <div className='mb-12'>
          <h2 className='text-2xl font-semibold mb-6'>Itinerary</h2>

          <div className='space-y-6'>
            {tour.itinerary.groupDays.map((day: any, index: number) => (
              <div key={index} className='border-b pb-6 last:border-b-0'>
                <div className='flex flex-col lg:flex-row gap-6'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-3 mb-3'>
                      <h3 className='text-lg font-semibold'>
                        Day {day.day}
                      </h3>
                      {day.elements && day.elements.length > 0 && (
                        <span className='text-sm text-gray-500'>
                          {day.elements
                            .map((el: any) => el.element?.name)
                            .filter(Boolean)
                            .join(", ")}
                        </span>
                      )}
                    </div>

                    {day.content && (
                      <div
                        className='text-gray-700 leading-relaxed'
                        dangerouslySetInnerHTML={{
                          __html: day.content,
                        }}
                      />
                    )}

                    {day.elementsQuick && day.elementsQuick.length > 0 && (
                      <div className='flex flex-wrap gap-2 mt-3'>
                        {day.elementsQuick.map((el: any) => (
                          <span
                            key={el.orderOfDay}
                            className='text-xs bg-green-500 text-white py-1 px-2 rounded'
                          >
                            {el?.element?.name || ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {day.images && day.images.length > 0 && (
                    <div className='lg:w-80 flex-shrink-0'>
                      <ImageSwiper
                        images={day.images}
                        dayNumber={day.day}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <p>
            <strong>Reference Number:</strong> {tour.refNumber}
          </p>
          <p>
            <strong>Status:</strong> {tour.status}
          </p>
          <p>
            <strong>Start Date:</strong>{" "}
            {new Date(tour.startDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Cost:</strong> ${tour?.cost?.toLocaleString()}
          </p>{" "}
          {tour.itinerary && Array.isArray(tour.itinerary) && (
            <div className="itineraries">
              <div className="space-y-4">
                {tour.itinerary.map((itinerary: any, index: number) => (
                  <div key={index}>
                    <h3 className="font-semibold mb-2">{itinerary.name}</h3>
                    <p className="text-gray-700">{itinerary.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold mb-2">Available Dates</h2>
            <ul className="list-disc pl-5">
              {groupTours.map((groupTour: any) => (
                <li key={groupTour.items[0]._id}>
                  <Link
                    href={`${templateUrl("/tours")}?tourId=${
                      groupTour.items[0]._id
                    }`}
                  >
                    {new Date(
                      groupTour.items[0].startDate
                    ).toLocaleDateString()}{" "}
                    - {groupTour.items[0].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p>{tour.content}</p>
        </div>
      </div>
      <div>
        <PageContent />
      </div>
    </div>
  );
}
