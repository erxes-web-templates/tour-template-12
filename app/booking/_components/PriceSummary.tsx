import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShieldCheck, Zap, HeadphonesIcon, TrendingUp } from "lucide-react"

interface PriceSummaryProps {
  costPerPerson: number
  numberOfPeople: number
  totalCost: number
}

export const PriceSummary: React.FC<PriceSummaryProps> = ({
  costPerPerson,
  numberOfPeople,
  totalCost,
}) => {
  return (
    <Card className='sticky top-8 border-none shadow-[0_8px_30px_rgb(0,0,0,0.06)] bg-white/80 backdrop-blur-xl rounded-[32px] overflow-hidden'>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <CardTitle className="text-lg font-black tracking-tight uppercase text-gray-800">
            Төлбөрийн хураангуй
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className='space-y-6'>
        <div className='space-y-4'>
          {/* Row: Cost per Person */}
          <div className='flex justify-between items-center px-1'>
            <span className='text-sm font-bold text-gray-400 uppercase tracking-wider'>Нэг хүний</span>
            <span className='font-black text-gray-900'>₮{costPerPerson.toLocaleString()}</span>
          </div>

          {/* Row: Number of People */}
          <div className='flex justify-between items-center px-1'>
            <span className='text-sm font-bold text-gray-400 uppercase tracking-wider'>Хүний тоо</span>
            <span className='font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm'>
              × {numberOfPeople}
            </span>
          </div>

          <Separator className="bg-gray-100/60" />

          {/* Total Cost Section */}
          <div className='bg-gray-900 rounded-[24px] p-5 text-white shadow-xl shadow-gray-200 transition-transform hover:scale-[1.02] duration-300'>
            <div className='flex justify-between items-center mb-1'>
              <span className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400'>Нийт төлбөр</span>
              <div className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
            </div>
            <div className='flex justify-between items-end'>
              <span className='text-3xl font-black tracking-tighter'>
                ₮{totalCost.toLocaleString()}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 mb-1">VAT багтсан</span>
            </div>
          </div>
        </div>

        {/* Features Block */}
        <div className='bg-emerald-50/50 rounded-[24px] p-5 border border-emerald-100/50 space-y-3'>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-900/80">Аюулгүй төлбөр тооцоо</span>
          </div>
          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-900/80">Шууд баталгаажуулалт</span>
          </div>
          <div className="flex items-center gap-3">
            <HeadphonesIcon className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-900/80">24/7 Хэрэглэгчийн дэмжлэг</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}