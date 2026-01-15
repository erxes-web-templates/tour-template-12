import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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
    <Card className='sticky top-4'>
      <CardHeader>
        <CardTitle>Price Summary</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-3'>
          <div className='flex justify-between'>
            <span className='text-sm text-gray-600'>Cost per Person</span>
            <span className='font-medium'>${costPerPerson.toLocaleString()}</span>
          </div>
          <div className='flex justify-between'>
            <span className='text-sm text-gray-600'>Number of People</span>
            <span className='font-medium'>×{numberOfPeople}</span>
          </div>
          <Separator />
          <div className='flex justify-between items-center'>
            <span className='font-semibold text-lg'>Total</span>
            <span className='text-2xl font-bold text-emerald-600'>
              ${totalCost.toLocaleString()}
            </span>
          </div>
        </div>

        <div className='bg-emerald-50 rounded-lg p-4 mt-4'>
          <p className='text-xs text-emerald-800'>
            ✓ Secure payment processing
            <br />
            ✓ Instant booking confirmation
            <br />✓ 24/7 customer support
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
