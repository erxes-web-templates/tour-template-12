import Image from "next/image"
import Link from "next/link"
import { MapPin } from "lucide-react"
import { isBuildMode } from "../../../lib/buildMode"
import TourDetailPageClient from "../../_client/TourDetailPage"
import { fetchBmTourDetail, fetchBmToursGroup } from "../../../lib/fetchTours"
import { getFileUrl } from "../../../lib/utils"
import PaymentTabs from "../_components/PaymentTabs"
import ImageSwiper from "../_components/ImageSwiper"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function TourDetailPage(props: PageProps) {
  const params = await props.params
  const { id } = params

  if (isBuildMode()) {
    return <TourDetailPageClient initialTourId={id} />
  }

  const tour = await fetchBmTourDetail(id)
  const groupTours = await fetchBmToursGroup(1, 100)

  if (!tour) {
    return (
      <div className='container mx-auto p-4 py-12 text-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Tour not found</h1>
        <p className='text-gray-500 mt-2'>
          The tour you're looking for doesn't exist or has been removed.
        </p>
      </div>
    )
  }

  const tourId = tour.groupCode ?? tour._id

  return (
    <div className='container mx-auto p-4'>
      {tour.imageThumbnail && (
        <div className='relative w-full h-[500px]'>
          <Image
            src={getFileUrl(tour.imageThumbnail)}
            alt={tour.name}
            fill
            className='rounded-md'
          />
        </div>
      )}
      <div className='flex gap-3 my-3'>
        {tour.images &&
          tour.images.map((image: string, index: number) => (
            <div key={index} className='relative w-[300px] h-[200px]'>
              <Image
                src={getFileUrl(image)}
                alt={tour.name}
                fill
                className='rounded-md'
              />
            </div>
          ))}
      </div>

      <div className='mb-8'>
        <PaymentTabs tourId={tourId} tour={tour} />
      </div>

      {tour?.itinerary?.groupDays && (
        <div className='mb-12'>
          <h2 className='text-2xl font-light mb-8 text-green-500'>
            ITINERARY
          </h2>

          <div className='relative'>
            <div className='absolute left-[18px] top-0 bottom-0 w-[1px] bg-neutral-200' />

            <div className='space-y-8'>
              {tour.itinerary.groupDays.map((day: any, index: number) => (
                <div key={index} className='relative'>
                  <div className='flex items-start'>
                    <div className='relative z-50 flex-shrink-0 mr-6'>
                      <div className='bg-gray-50 border-[0.5px] border-green-500 rounded-full p-2 shadow-md'>
                        <MapPin className='h-5 w-5 text-black' />
                      </div>
                    </div>

                    <div className='flex-1'>
                      <p className='text-sm text-gray-600 uppercase tracking-wide font-light mb-2'>
                        {day.elements && day.elements.length > 0
                          ? day.elements
                              .map((el: any) => el.element?.name)
                              .filter(Boolean)
                              .join(", ")
                          : "LOCATION"}
                      </p>

                      <h3 className='text-xl font-serif mb-4'>
                        Day {day.day}
                      </h3>

                      <div>
                        <div className='flex flex-col lg:flex-row gap-6'>
                          <div>
                            {day.content && (
                              <div className='flex-1'>
                                <div
                                  className='text-gray-700 leading-relaxed font-extralight prose prose-sm max-w-none'
                                  dangerouslySetInnerHTML={{
                                    __html: day.content,
                                  }}
                                />
                              </div>
                            )}
                            {day.elementsQuick &&
                              day.elementsQuick.length > 0 && (
                                <div className='flex gap-4 mt-3'>
                                  {day?.elementsQuick?.map((el: any) => (
                                    <div
                                      key={el.orderOfDay}
                                      className='flex gap-2'
                                    >
                                      <span className='text-xs bg-green-500 font-light py-1 px-2 rounded-sm text-white'>
                                        {el?.element?.name
                                          ? el.element.name
                                          : ""}
                                      </span>
                                    </div>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className='grid md:grid-cols-2 gap-4'>
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
            <strong>Cost:</strong> ${tour.cost.toLocaleString()}
          </p>

          {tour.itinerary && Array.isArray(tour.itinerary) && (
            <div className='itineraries'>
              <div className='space-y-4'>
                {tour.itinerary.map((itinerary: any, index: number) => (
                  <div key={index}>
                    <h3 className='font-semibold mb-2'>{itinerary.name}</h3>
                    <p className='text-gray-700'>{itinerary.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <h2 className='text-xl font-semibold mb-2'>Available Dates</h2>
            <ul className='list-disc pl-5'>
              {groupTours?.map((groupTour: any) => (
                <li key={groupTour.items[0]._id}>
                  <Link href={`/tours/${groupTour.items[0]._id}`}>
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
          <h2 className='text-xl font-semibold mb-2'>Description</h2>
          <p>{tour.content}</p>
        </div>
      </div>
    </div>
  )
}
