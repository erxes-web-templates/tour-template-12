import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Users, MapPin, DollarSign } from "lucide-react"

interface TourDetailsSidebarProps {
  tour: {
    name: string
    content: string
    refNumber: string
    startDate: string
    status: string
  }
  numberOfPeople: number
}

export const TourDetailsSidebar: React.FC<TourDetailsSidebarProps> = ({
  tour,
  numberOfPeople,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tour Details</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div>
          <h3 className='text-xl font-semibold mb-2'>{tour.name}</h3>
          <p className='text-gray-600 text-sm'>{tour.content}</p>
        </div>

        <Separator />

        <div className='grid grid-cols-2 gap-4'>
          <div className='flex items-start gap-3'>
            <MapPin className='h-5 w-5 text-emerald-600 mt-0.5' />
            <div>
              <p className='text-sm text-gray-500'>Reference Number</p>
              <p className='font-medium'>{tour.refNumber}</p>
            </div>
          </div>

          <div className='flex items-start gap-3'>
            <Calendar className='h-5 w-5 text-emerald-600 mt-0.5' />
            <div>
              <p className='text-sm text-gray-500'>Departure Date</p>
              <p className='font-medium'>
                {new Date(tour.startDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          <div className='flex items-start gap-3'>
            <Users className='h-5 w-5 text-emerald-600 mt-0.5' />
            <div>
              <p className='text-sm text-gray-500'>Number of People</p>
              <p className='font-medium'>{numberOfPeople} People</p>
            </div>
          </div>

          <div className='flex items-start gap-3'>
            <DollarSign className='h-5 w-5 text-emerald-600 mt-0.5' />
            <div>
              <p className='text-sm text-gray-500'>Status</p>
              <Badge variant='secondary' className='capitalize'>
                {tour.status}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
