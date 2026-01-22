import Link from "next/link"
import Image from "next/image"
import { isBuildMode } from "../../lib/buildMode"
import ToursPageClient from "../_client/ToursPage"
import { fetchBmToursGroup } from "../../lib/fetchTours"
import { Card, CardContent, CardFooter } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { getFileUrl } from "../../lib/utils"
import type { TourGroup } from "../../types/tours"
import { toHtml } from "@/lib/html"
import { MapPin, Clock, Users, ArrowRight } from "lucide-react"

export default async function ToursPage() {
  if (isBuildMode()) {
    return <ToursPageClient />
  }

const groups: TourGroup[] = await fetchBmToursGroup(1, 20)

  return (
    <div className="container mx-auto py-20 px-4 mt-10">
      <div className='grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3'>
        {groups.map((group: TourGroup) => {
                    const tour = group.items?.[0]
          if (!tour) return null

          return (

          <Card key={tour._id} className='group overflow-hidden rounded-[40px] border-none shadow-lg hover:shadow-2xl transition-all duration-500 bg-white flex flex-col'>
            
            <div className="relative aspect-[4/3] overflow-hidden">
              {tour.imageThumbnail && (
                <Image
                  src={getFileUrl(tour.imageThumbnail)}
                  alt={tour.name}
                  fill
                  className='object-cover transition-transform duration-700 group-hover:scale-110'
                />
              )}
              {/* ҮНИЙН ХЭСЭГ: Энд төгрөгийн тэмдэг нэмэв */}
              <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md px-5 py-2 rounded-2xl shadow-xl">
                <span className="text-[#692d91] font-black text-xl">{tour.cost}₮</span>
              </div>
            </div>

            <CardContent className="p-8 flex-1 space-y-5">
              <div className="flex items-center gap-2 text-[#692d91] text-[11px] font-black uppercase tracking-[0.2em] opacity-60">
                <MapPin size={14} /> MONGOLIA
              </div>
              
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-[#141824] line-clamp-2 leading-[1.1] min-h-[2.2em]">
                {tour.name}
              </h3>

              <div className="flex items-center justify-between py-4 border-y border-slate-50">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase text-slate-500">
                  <Clock size={16} className="text-yellow-500" /> 6 DAYS
                </div>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase text-slate-500">
                  <Users size={16} className="text-yellow-500" /> {tour.groupSize || "20"} PEOPLE
                </div>
              </div>
            </CardContent>

            <CardFooter className='p-8 pt-0'>
              <Link href={`/tours/${tour.groupCode || tour._id}`} className="w-full">
                <Button className="w-full h-14 bg-[#692d91] hover:bg-yellow-400 text-white hover:text-black rounded-2xl font-black uppercase italic text-xs transition-all duration-300 group/btn shadow-xl shadow-purple-900/10">
                  Захиалах
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
          )
      })}
      </div>
    </div>
  )
}