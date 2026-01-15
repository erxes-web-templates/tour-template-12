"use client"

import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Calendar,
  Users,
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import DynamicForm from "@/components/common/DynamicForm"
import { TOUR_GROUP_DETAIL_QUERY, INQUIRY_FORM } from "@/graphql/queries"
import { FORM_SUBMISSION } from "@/graphql/mutations"

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
      console.log(data)
      setSubmitted(true)
    },
  })

  const groupTourItems = groupToursQuery?.bmToursGroupDetail?.items || []
  const inquiryForm = formData?.forms[0] || {}

  // Get selected tour details
  const selectedTour = selectedTourDate
    ? groupTourItems.find((item: any) => item._id === selectedTourDate)
    : null

  // Check if booking is available
  const isBookingAvailable = !!tour.startDate
  const hasMultipleDates = groupTourItems.length > 0

  // Get max group size from tour data or default to 10
  const maxGroupSize = tour.groupSize || 10

  // Generate array of numbers from 1 to maxGroupSize
  const peopleOptions = Array.from({ length: maxGroupSize }, (_, i) => i + 1)

  // Helper function to calculate end date
  const calculateEndDate = (startDate: string, duration?: number) => {
    if (!duration) return null
    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(end.getDate() + duration)
    return end
  }

  // Build booking URL with parameters
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
    <Card>
      <CardHeader>
        <CardTitle>Take Action</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='inquire' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='inquire' className='flex items-center gap-2'>
              <MessageSquare className='h-4 w-4' />
              Inquiry Form
            </TabsTrigger>
            <TabsTrigger value='book' className='flex items-center gap-2'>
              <ShoppingCart className='h-4 w-4' />
              Book Tour
            </TabsTrigger>
          </TabsList>

          <TabsContent value='inquire' className='mt-6'>
            <div>
              <h3 className='text-lg font-semibold mb-2'>Send an Inquiry</h3>
              <p className='text-sm text-gray-500 mb-6'>
                Selected tour: {tour.name}
                {tour.duration && ` (${tour.duration} days)`}
              </p>
              <DynamicForm
                formData={inquiryForm}
                submitForm={submitForm}
                submitted={submitted}
                tourName={tour.name}
              />
            </div>
          </TabsContent>

          <TabsContent value='book' className='mt-6'>
            <div className='space-y-4'>
              {!isBookingAvailable ? (
                <Alert variant='destructive'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertDescription>
                    This tour is currently not available for booking. Please
                    check back later or contact us for more information.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className='space-y-4'>
                    <div className='grid md:grid-cols-2 gap-4'>
                      {hasMultipleDates && (
                        <div>
                          <label className='text-sm font-medium mb-2 block'>
                            Select Tour Date
                          </label>
                          <Select
                            value={selectedTourDate}
                            onValueChange={setSelectedTourDate}
                          >
                            <SelectTrigger className='w-full'>
                              <SelectValue placeholder='Choose a departure date' />
                            </SelectTrigger>
                            <SelectContent>
                              {groupTourItems.map((item: any) => (
                                <SelectItem key={item._id} value={item._id}>
                                  <div className='flex items-center justify-between w-full gap-4'>
                                    <span>
                                      {new Date(
                                        item.startDate
                                      ).toLocaleDateString("en-US", {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </span>
                                    {item.viewCount !== undefined && (
                                      <span className='text-xs text-gray-500'>
                                        {item.viewCount} slots
                                      </span>
                                    )}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div>
                        <label className='text-sm font-medium mb-2 block'>
                          Number of People
                          {tour.groupSize && (
                            <span className='text-xs text-gray-500 ml-2'>
                              (Max: {tour.groupSize})
                            </span>
                          )}
                        </label>
                        <Select
                          value={numberOfPeople}
                          onValueChange={setNumberOfPeople}
                        >
                          <SelectTrigger className='w-full'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {peopleOptions.map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? "Person" : "People"}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {selectedTour && hasMultipleDates && (
                      <div className='rounded-lg p-6 space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                          <div className='bg-white/70 rounded-lg p-3'>
                            <div className='flex items-center gap-2 mb-1'>
                              <Calendar className='h-4 w-4 text-emerald-600' />
                              <p className='text-xs text-gray-500'>
                                Departure Date
                              </p>
                            </div>
                            <p className='font-semibold'>
                              {new Date(
                                selectedTour.startDate
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                          </div>

                          <div className='bg-white/70 rounded-lg p-3'>
                            <div className='flex items-center gap-2 mb-1'>
                              <Users className='h-4 w-4 text-emerald-600' />
                              <p className='text-xs text-gray-500'>
                                Available Slots
                              </p>
                            </div>
                            <p className='font-semibold'>
                              {selectedTour.viewCount !== undefined
                                ? `${selectedTour.viewCount} slots`
                                : "Contact us"}
                            </p>
                          </div>
                        </div>

                        <div className='border-t border-emerald-200 pt-4'>
                          <div className='space-y-3 mb-4'>
                            <div className='flex justify-between items-center'>
                              <span className='text-sm text-gray-600'>
                                Cost per Person
                              </span>
                              <span className='font-semibold'>
                                ${selectedTour.cost.toLocaleString()}
                              </span>
                            </div>
                            <div className='flex justify-between items-center'>
                              <span className='text-sm text-gray-600'>
                                Number of People
                              </span>
                              <span className='font-semibold'>
                                ×{numberOfPeople}
                              </span>
                            </div>
                            <div className='flex justify-between items-center pt-2 border-t'>
                              <span className='font-semibold'>Total Cost</span>
                              <span className='text-2xl font-bold text-emerald-600'>
                                $
                                {(
                                  selectedTour.cost * parseInt(numberOfPeople)
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <Link
                            href={buildBookingUrl(selectedTour._id)}
                            className='block'
                          >
                            <Button className='w-full' size='lg'>
                              <ShoppingCart className='mr-2 h-4 w-4' />
                              Proceed to Booking
                            </Button>
                          </Link>

                          <p className='text-xs text-gray-500 text-center mt-3'>
                            Secure booking process • Instant confirmation
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Show default booking if no multiple dates or no date selected */}
                    {(!hasMultipleDates ||
                      (!selectedTourDate && hasMultipleDates)) && (
                      <div className='rounded-lg p-6 space-y-4'>
                        <div className='grid grid-cols-2 gap-4'>
                          <div className='bg-white/70 rounded-lg p-3'>
                            <div className='flex items-center gap-2 mb-1'>
                              <Calendar className='h-4 w-4 text-emerald-600' />
                              <p className='text-xs text-gray-500'>
                                Departure Date
                              </p>
                            </div>
                            <p className='font-semibold'>
                              {new Date(tour.startDate!).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </p>
                          </div>

                          <div className='bg-white/70 rounded-lg p-3'>
                            <div className='flex items-center gap-2 mb-1'>
                              <Calendar className='h-4 w-4 text-emerald-600' />
                              <p className='text-xs text-gray-500'>
                                {tour.duration ? "End Date" : "Duration"}
                              </p>
                            </div>
                            <p className='font-semibold'>
                              {tour.duration
                                ? calculateEndDate(
                                    tour.startDate!,
                                    tour.duration
                                  )
                                  ? calculateEndDate(
                                      tour.startDate!,
                                      tour.duration
                                    )!.toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    })
                                  : `${tour.duration} days`
                                : "Contact us"}
                            </p>
                          </div>
                        </div>

                        <div className='border-t border-emerald-200 pt-4'>
                          <div className='space-y-3 mb-4'>
                            <div className='flex justify-between items-center'>
                              <span className='text-sm text-gray-600'>
                                Cost per Person
                              </span>
                              <span className='font-semibold'>
                                ${tour.cost.toLocaleString()}
                              </span>
                            </div>
                            <div className='flex justify-between items-center'>
                              <span className='text-sm text-gray-600'>
                                Number of People
                              </span>
                              <span className='font-semibold'>
                                ×{numberOfPeople}
                              </span>
                            </div>
                            <div className='flex justify-between items-center pt-2 border-t'>
                              <span className='font-semibold'>Total Cost</span>
                              <span className='text-2xl font-bold text-emerald-600'>
                                $
                                {(
                                  tour.cost * parseInt(numberOfPeople)
                                ).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <Link
                            href={buildBookingUrl(tourId)}
                            className='block'
                          >
                            <Button className='w-full' size='lg'>
                              <ShoppingCart className='mr-2 h-4 w-4' />
                              Proceed to Booking
                            </Button>
                          </Link>

                          <p className='text-xs text-gray-500 text-center mt-3'>
                            Secure booking process • Instant confirmation
                          </p>
                        </div>

                        {hasMultipleDates && !selectedTourDate && (
                          <p className='text-xs text-center text-gray-500'>
                            💡 Select a specific date above for more options
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
