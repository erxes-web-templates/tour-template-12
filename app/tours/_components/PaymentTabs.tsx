"use client"

import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  MessageSquare,
  ShoppingCart,
  AlertCircle,
  Calendar,
  Users,
  ShieldCheck,
  TrendingUp
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import DynamicForm from "@/components/common/DynamicForm"
import { TOUR_GROUP_DETAIL_QUERY, INQUIRY_FORM } from "@/graphql/queries"
import { FORM_SUBMISSION } from "@/graphql/mutations"
import { cn } from "@/lib/utils"

interface PaymentTabsProps {
  tourId: string
  tour: {
    name: string
    content: string
    cost: number
    startDate?: string
    duration?: number
    groupSize?: number
  }
}

export default function PaymentTabs({ tourId, tour }: PaymentTabsProps) {
  const [submitted, setSubmitted] = useState(false)
  const [selectedTourDate, setSelectedTourDate] = useState<string>("")
  const [numberOfPeople, setNumberOfPeople] = useState<string>("1")
  const [showError, setShowError] = useState(false)

  const { data: groupToursQuery } = useQuery(TOUR_GROUP_DETAIL_QUERY, {
    variables: {
      status: "website",
      groupCode: tourId || "",
    },
    skip: !tourId,
  })

  const { data: formData } = useQuery(INQUIRY_FORM, {
    variables: {
      type: "lead",
      searchValue: "inquiry",
    },
    skip: !tourId,
  })

  const [submitForm] = useMutation(FORM_SUBMISSION, {
    onCompleted: (data) => {
      setSubmitted(true)
    },
  })

  const groupTourItems = groupToursQuery?.bmToursGroupDetail?.items || []
  const inquiryForm = formData?.forms[0] || {}

  const selectedTour = selectedTourDate
    ? groupTourItems.find((item: any) => item._id === selectedTourDate)
    : null

  const isBookingAvailable = !!tour.startDate
  const hasMultipleDates = groupTourItems.length > 0
  const maxGroupSize = tour.groupSize || 10
  const peopleOptions = Array.from({ length: maxGroupSize }, (_, i) => i + 1)

  // Validation logic
  const isDateSelected = !hasMultipleDates || selectedTourDate !== ""

  const buildBookingUrl = (tourIdParam: string) => {
    const params = new URLSearchParams({
      tourId: tourIdParam,
      people: numberOfPeople,
    })
    if (selectedTourDate) {
      params.set("selectedDate", selectedTourDate)
    }
    return `/booking?${params.toString()}`
  }

  return (
    <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-xl rounded-[32px] overflow-hidden">
      <CardContent className="p-0">
        <Tabs defaultValue="book" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-16 p-1.5 bg-gray-100/50 rounded-none border-b border-gray-100">
            <TabsTrigger 
              value="book" 
              className="rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300 flex items-center gap-2.5 font-bold text-gray-600 data-[state=active]:text-emerald-600"
            >
              <ShoppingCart className="h-4 w-4" />
              Захиалах
            </TabsTrigger>
            <TabsTrigger 
              value="inquire" 
              className="rounded-2xl data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-300 flex items-center gap-2.5 font-bold text-gray-600 data-[state=active]:text-emerald-600"
            >
              <MessageSquare className="h-4 w-4" />
              Лавлагаа авах
            </TabsTrigger>
          </TabsList>

          <TabsContent value="book" className="p-6 md:p-8 mt-0 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="space-y-6">
              {!isBookingAvailable ? (
                <Alert variant="destructive" className="border-none bg-red-50 rounded-2xl">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-600 font-medium">
                    Уучлаарай, энэ аялал одоогоор захиалга авах боломжгүй байна.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {hasMultipleDates && (
                      <div className="space-y-2.5">
                        <label className={cn(
                          "text-[13px] font-bold uppercase tracking-widest flex items-center gap-2 ml-1 transition-colors",
                          showError && !selectedTourDate ? "text-red-500" : "text-gray-400"
                        )}>
                          <Calendar size={14} className={cn(showError && !selectedTourDate ? "text-red-500" : "text-emerald-500")} /> 
                          Аяллын огноо <span className="text-red-500">*</span>
                        </label>
                        <Select 
                          value={selectedTourDate} 
                          onValueChange={(val) => {
                            setSelectedTourDate(val)
                            setShowError(false)
                          }}
                        >
                          <SelectTrigger className={cn(
                            "w-full h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:ring-emerald-500/20 transition-all font-medium",
                            showError && !selectedTourDate && "border-red-500 bg-red-50/50 ring-1 ring-red-500"
                          )}>
                            <SelectValue placeholder="Огноо сонгох" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                            {groupTourItems.map((item: any) => (
                              <SelectItem key={item._id} value={item._id} className="py-3">
                                {new Date(item.startDate).toLocaleDateString("mn-MN", {
                                  month: "long", day: "numeric", year: "numeric",
                                })}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {showError && !selectedTourDate && (
                          <p className="text-[11px] text-red-500 font-bold ml-2 animate-in fade-in slide-in-from-top-1">
                            Үргэлжлүүлэхийн тулд огноог сонгоно уу
                          </p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2.5">
                      <label className="text-[13px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                        <Users size={14} className="text-emerald-500" /> Хүний тоо
                      </label>
                      <Select value={numberOfPeople} onValueChange={setNumberOfPeople}>
                        <SelectTrigger className="w-full h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:ring-emerald-500/20 transition-all font-medium">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                          {peopleOptions.map((num) => (
                            <SelectItem key={num} value={num.toString()} className="py-2.5">
                              {num} {num === 1 ? "Хүн" : "Хүн"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Pricing Section */}
                  <div className="bg-emerald-50/30 rounded-[24px] p-6 border border-emerald-100/50 space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                        <span>Нэг хүний зардал</span>
                        <span className="text-gray-900 font-bold">
                          ₮{(selectedTour?.cost || tour.cost).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium text-gray-500">
                        <span>Сонгосон хүний тоо</span>
                        <span className="text-gray-900 font-bold">× {numberOfPeople}</span>
                      </div>
                      
                      <div className="pt-4 mt-2 border-t border-emerald-100/50 flex justify-between items-end">
                        <div className="space-y-1">
                          <span className="text-xs font-black text-emerald-600/60 uppercase tracking-widest">Нийт төлбөр</span>
                          <p className="text-3xl font-black text-gray-900 tracking-tight">
                            ₮{((selectedTour?.cost || tour.cost) * parseInt(numberOfPeople)).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 pb-1 text-xs font-bold text-emerald-600 bg-emerald-100/50 px-3 py-1.5 rounded-full">
                          <TrendingUp size={12} /> Хамгийн хямд
                        </div>
                      </div>
                    </div>
                  </div>

                  <Link 
                    href={isDateSelected ? buildBookingUrl(selectedTour?._id || tourId) : "#"} 
                    className={cn("block group", !isDateSelected && "cursor-not-allowed")}
                    onClick={(e) => {
                      if (!isDateSelected) {
                        e.preventDefault()
                        setShowError(true)
                      }
                    }}
                  >
                    <Button 
                      className={cn(
                        "w-full h-16 text-lg font-black rounded-2xl transition-all duration-300 group-active:scale-[0.98] shadow-xl",
                        isDateSelected 
                          ? "bg-gray-900 hover:bg-emerald-600 text-white shadow-gray-200 hover:shadow-emerald-200" 
                          : "bg-gray-200 text-gray-400 shadow-none pointer-events-none"
                      )} 
                      size="lg"
                    >
                      <ShoppingCart className={cn("mr-3 h-5 w-5 transition-transform", isDateSelected && "group-hover:-rotate-12")} />
                      {isDateSelected ? "Захиалга баталгаажуулах" : "Огноогоо сонгоно уу"}
                    </Button>
                  </Link>
                  
                  <div className="flex items-center justify-center gap-6 py-2">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                      <ShieldCheck size={14} className="text-emerald-500" /> Аюулгүй төлбөр
                    </div>
                    <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                      <AlertCircle size={14} className="text-emerald-500" /> Шууд баталгаажна
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="inquire" className="p-6 md:p-8 mt-0 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="space-y-6">
              <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-2xl">
                <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                   Мэдээлэл тодруулах
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  Таны сонгосон <span className="text-emerald-600 font-bold">{tour.name}</span> {tour.duration && `(${tour.duration} хоног)`} аяллын талаар бид танд дэлгэрэнгүй мэдээлэл өгөх болно.
                </p>
              </div>
              <div className="px-1">
                <DynamicForm
                  formData={inquiryForm}
                  submitForm={submitForm}
                  submitted={submitted}
                  tourName={tour.name}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}