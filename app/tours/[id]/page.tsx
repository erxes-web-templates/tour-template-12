"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { fetchBmToursGroupDetail } from "../../../lib/fetchTours"
import { getFileUrl } from "../../../lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../../components/ui/accordion"
import PaymentTabs from "../_components/PaymentTabs"
import { Calendar, Tag, Info, MapPin, Globe, ShieldCheck } from "lucide-react"
import ImageSwiper from "../_components/ImageSwiper"

export default function TourDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const [tour, setTour] = useState<any>(null)
  const [displayTour, setDisplayTour] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>("")

  useEffect(() => {
    paramsPromise.then(p => {
      setId(p.id)
      loadTour(p.id)
    })
  }, [])

  const loadTour = async (tourId: string) => {
    const groupDetail = await fetchBmToursGroupDetail(tourId)
    const initialTour = groupDetail && Array.isArray(groupDetail) && groupDetail.length > 0 ? groupDetail[0] : null
    setTour(initialTour)
    setDisplayTour(initialTour)
    setLoading(false)
  }

  // PaymentTabs-аас огноо солигдох үед дуудагдах функц
  const handleDateChange = (selectedDateTour: any) => {
    setDisplayTour((prev: any) => ({
      ...prev,
      startDate: selectedDateTour.startDate,
      cost: selectedDateTour.cost,
    }));
  }

  if (loading) return <div className="py-32 text-center font-bold">Уншиж байна...</div>
  if (!tour) return <div className="py-32 text-center font-bold uppercase italic">Tour not found</div>

  const defaultDay = tour.itinerary?.groupDays?.[0] ? `day-${tour.itinerary.groupDays[0].day}` : undefined

  return (
    <div className='bg-white min-h-screen'>
      {/* 1. HERO ХЭСЭГ - Динамик утгууд */}
      <div className="container mx-auto px-4 pt-32 space-y-6">
        {tour.imageThumbnail && (
          <div className='relative w-full h-[400px] md:h-[600px] overflow-hidden rounded-[40px] shadow-2xl group'>
            <Image
              src={getFileUrl(tour.imageThumbnail)}
              alt={tour.name}
              fill
              priority
              className='object-cover transition-transform duration-1000 group-hover:scale-105'
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-10 left-6 md:left-12 space-y-4">
              <h1 className="text-4xl md:text-7xl font-black italic uppercase text-white tracking-tighter max-w-4xl leading-[0.9]">
                {tour.name}
              </h1>
            </div>
          </div>
        )}

        <div className='flex gap-4 overflow-x-auto pb-6 scrollbar-hide px-2'>
          {tour.images?.map((image: string, index: number) => (
            <div key={index} className='relative flex-shrink-0 w-[280px] h-[180px] group cursor-pointer'>
              <Image src={getFileUrl(image)} alt={tour.name} fill className='rounded-[24px] object-cover shadow-lg group-hover:border-purple-500 transition-all border-2 border-transparent' />
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className='grid lg:grid-cols-12 gap-12 items-start'>
          
          <div className='lg:col-span-8 space-y-16'>
            {/* Quick Stats - Огноо сонгоход энд өөрчлөгдөнө */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                { icon: Calendar, label: "Start Date", val: new Date(displayTour.startDate).toLocaleDateString(), color: "bg-blue-50 text-blue-600" },
                { icon: Tag, label: "Base Cost", val: `₮${displayTour.cost.toLocaleString()}`, color: "bg-emerald-50 text-emerald-600" },
                { icon: Info, label: "Ref Number", val: tour.refNumber, color: "bg-purple-50 text-purple-600" }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100 hover:bg-white hover:shadow-xl transition-all group">
                  <div className={`w-10 h-10 ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <stat.icon size={20} />
                  </div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">{stat.label}</p>
                  <p className="text-sm font-black italic text-slate-900">{stat.val}</p>
                </div>
              ))}
            </div>

            {/* ITINERARY */}
            <div className='space-y-8'>
              <div className="flex items-center gap-4">
                <div className="w-2 h-10 bg-purple-600 rounded-full" />
                <h2 className='text-3xl font-black italic uppercase tracking-tighter text-slate-900'>Itinerary</h2>
              </div>
              <Accordion type="single" collapsible defaultValue={defaultDay} className="w-full space-y-6">
                {tour.itinerary?.groupDays?.map((day: any, index: number) => (
                  <AccordionItem key={index} value={`day-${day.day}`} className="border-none rounded-[32px] bg-slate-50/50 px-4 data-[state=open]:bg-white data-[state=open]:shadow-2xl border border-transparent data-[state=open]:border-slate-100">
                    <AccordionTrigger className="hover:no-underline py-6 px-4 group">
                      <div className="flex items-center text-left gap-6">
                        <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex flex-col items-center justify-center group-data-[state=open]:bg-purple-600 group-data-[state=open]:text-white">
                          <span className="text-[8px] font-black uppercase opacity-60">Day</span>
                          <span className="text-xl font-black italic leading-none">{day.day}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                           <span className="text-slate-900 font-black uppercase text-sm group-data-[state=open]:text-purple-600">
                             {day.elements?.map((el: any) => el.element?.name).filter(Boolean).join(" • ") || "Daily Exploration"}
                           </span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-8 pt-2">
                      <div className="flex flex-col lg:flex-row gap-8 border-t border-slate-100 pt-6">
                        <div className="flex-1" dangerouslySetInnerHTML={{ __html: day.content }} />
                        {day.images?.length > 0 && (
                          <div className='lg:w-80 shrink-0'>
                            <ImageSwiper images={day.images} dayNumber={day.day} />
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            <div className="space-y-6 pb-20">
              <div className="flex items-center gap-4"><div className="w-2 h-10 bg-purple-600 rounded-full" /><h2 className='text-3xl font-black italic uppercase tracking-tighter text-slate-900'>Description</h2></div>
              <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100">
                <div className="text-slate-600 leading-relaxed font-medium" dangerouslySetInnerHTML={{ __html: tour.content }} />
              </div>
            </div>
          </div>

          <div className='lg:col-span-4'>
            <div className='lg:sticky lg:top-32'>
              <div className="relative p-1 bg-gradient-to-b from-purple-100 to-transparent rounded-[42px]">
                {/* ЭНД handleDateChange-ийг дамжуулж байна */}
                <PaymentTabs tourId={id} tour={tour} onDateChange={handleDateChange} />
              </div>
              <div className="mt-6 px-6 py-4 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4">
                  <ShieldCheck className="text-emerald-500" size={24} />
                  <p className="text-[10px] font-black uppercase">Аюулгүй байдал хангагдсан</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}