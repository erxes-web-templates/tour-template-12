import Image from "next/image"
import Link from "next/link"
import { isBuildMode } from "../../../lib/buildMode"
import TourDetailPageClient from "../../_client/TourDetailPage"
import { fetchBmToursGroupDetail } from "../../../lib/fetchTours"
import { getFileUrl } from "../../../lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion"
import PaymentTabs from "../_components/PaymentTabs"
import { Calendar, Tag, ShieldCheck, Info, MapPin } from "lucide-react"
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

  const groupDetail = await fetchBmToursGroupDetail(id)
  const tour = groupDetail && Array.isArray(groupDetail) && groupDetail.length > 0
    ? groupDetail[0]
    : null

  if (!tour) {
    return (
      <div className='container mx-auto p-4 py-32 text-center'>
        <h1 className='text-2xl font-bold text-gray-800 uppercase italic'>Tour not found</h1>
        <p className='text-gray-500 mt-2 font-medium'>Уучлаарай, аялал олдсонгүй.</p>
      </div>
    )
  }

  const tourId = id

  return (
    <div className='container mx-auto p-4 mt-32 relative z-0 space-y-10'>
      
      {/* 1. ГАЛЕРЕЙ ХЭСЭГ */}
      <div className="space-y-4">
        {tour.imageThumbnail && (
          <div className='relative w-full h-[500px]'>
            <Image
              src={getFileUrl(tour.imageThumbnail)}
              alt={tour.name}
              fill
              priority
              className='rounded-[32px] object-cover shadow-xl'
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-[32px]" />
            <h1 className="absolute bottom-8 left-8 text-3xl md:text-5xl font-black italic uppercase text-white tracking-tighter max-w-3xl">
              {tour.name}
            </h1>
          </div>
        )}
        <div className='flex gap-3 overflow-x-auto pb-4 scrollbar-hide'>
          {tour.images &&
            tour.images.map((image: string, index: number) => (
              <div key={index} className='relative flex-shrink-0 w-[320px] h-[210px]'>
                <Image
                  src={getFileUrl(image)}
                  alt={tour.name}
                  fill
                  className='rounded-[24px] object-cover shadow-md hover:scale-[1.02] transition-transform'
                />
              </div>
            ))}
        </div>
      </div>

      {/* 2. ҮНДСЭН ГРИД (Зүүн талд мэдээлэл, Баруун талд төлбөрийн хэсэг) */}
      <div className='grid lg:grid-cols-12 gap-10 items-start'>
        
        {/* ЗҮҮН ТАЛ - Мэдээллүүд (8 багана) */}
        <div className='lg:col-span-8 space-y-10'>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-5 rounded-[24px] border border-slate-100 flex flex-col items-center text-center">
              <Calendar size={20} className="text-[#692d91] mb-2" />
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Start Date</p>
              <p className="text-xs font-black italic">{new Date(tour.startDate).toLocaleDateString()}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-[24px] border border-slate-100 flex flex-col items-center text-center">
              <Tag size={20} className="text-[#692d91] mb-2" />
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Cost</p>
              <p className="text-xs font-black italic">${tour.cost.toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-[24px] border border-slate-100 flex flex-col items-center text-center">
              <ShieldCheck size={20} className="text-[#692d91] mb-2" />
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Status</p>
              <p className="text-xs font-black italic uppercase">{tour.status}</p>
            </div>
            <div className="bg-slate-50 p-5 rounded-[24px] border border-slate-100 flex flex-col items-center text-center">
              <Info size={20} className="text-[#692d91] mb-2" />
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Ref No</p>
              <p className="text-xs font-black italic">{tour.refNumber}</p>
            </div>
          </div>

          {/* ITINERARY */}
          <div className='space-y-6'>
            <h2 className='text-2xl font-black italic uppercase tracking-tight border-l-4 border-[#692d91] pl-4 text-[#692d91]'>
              ITINERARY
            </h2>
            {tour?.itinerary?.groupDays && tour.itinerary.groupDays.length > 0 ? (
              <Accordion type="single" collapsible className="w-full space-y-4">
                {tour.itinerary.groupDays.map((day: any, index: number) => (
                  <AccordionItem 
                    key={index} 
                    value={`day-${day.day}`} 
                    className="border rounded-[24px] px-2 bg-white shadow-sm border-slate-100 overflow-hidden"
                  >
                    <AccordionTrigger className="hover:no-underline py-4 px-4 group">
                      <div className="flex items-center text-left gap-4">
                        <div className="bg-[#692d91]/10 rounded-full p-2 group-hover:bg-[#692d91] transition-colors">
                          <MapPin size={18} className="text-[#692d91] group-hover:text-white" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[#692d91] font-black italic text-sm">DAY {day.day}</span>
                          <span className="text-slate-800 font-bold uppercase text-xs tracking-wide">
                            {day.elements && day.elements.length > 0
                              ? day.elements.map((el: any) => el.element?.name).filter(Boolean).join(", ")
                              : "LOCATION"}
                          </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-6 pt-2">
                      <div className="flex flex-col lg:flex-row gap-6 border-t border-slate-50 pt-4">
                        <div className="flex-1 space-y-4">
                          {day.content && (
                            <div 
                              className="text-slate-600 leading-relaxed font-normal prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: day.content }}
                            />
                          )}
                          {day.elementsQuick && day.elementsQuick.length > 0 && (
                            <div className='flex flex-wrap gap-2 mt-2'>
                              {day.elementsQuick.map((el: any, idx: number) => (
                                <span key={idx} className='text-[10px] bg-slate-100 text-slate-500 font-bold py-1 px-3 rounded-full uppercase'>
                                  {el?.element?.name || ""}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {day.images && day.images.length > 0 && (
                          <div className='lg:w-72 flex-shrink-0'>
                            <ImageSwiper images={day.images} dayNumber={day.day} />
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <p className="text-sm text-slate-400 italic bg-slate-50 p-6 rounded-[24px]">
                Аяллын хөтөлбөр одоогоор ороогүй байна.
              </p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-4 pb-20">
            <h2 className='text-xl font-black italic uppercase tracking-tight border-l-4 border-[#692d91] pl-4'>Description</h2>
            <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
              <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-line text-sm" 
                 dangerouslySetInnerHTML={{ __html: tour.content }} />
            </div>
          </div>
        </div>

        {/* БАРУУН ТАЛ - PAYMENT TABS (STICKY CARD - 4 багана) */}
        <div className='lg:col-span-4'>
          <div className='lg:sticky lg:top-32 space-y-4'>
             <PaymentTabs tourId={tourId} tour={tour} />
          </div>
        </div>

      </div>
    </div>
  )
}