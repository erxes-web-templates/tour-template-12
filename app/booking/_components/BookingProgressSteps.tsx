import React from "react"
import { ArrowRight } from "lucide-react"

interface BookingProgressStepsProps {
  currentStep: number
}

export const BookingProgressSteps: React.FC<BookingProgressStepsProps> = ({
  currentStep,
}) => {
  return (
    <div className='mb-8'>
      <div className='flex items-center justify-center space-x-4'>
        <div
          className={`flex items-center ${
            currentStep >= 1 ? "text-emerald-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? "bg-emerald-600 text-white" : "bg-gray-200"
            }`}
          >
            1
          </div>
          <span className='ml-2 font-medium'>Traveler Info</span>
        </div>
        <ArrowRight className='text-gray-400' />
        <div
          className={`flex items-center ${
            currentStep >= 2 ? "text-emerald-600" : "text-gray-400"
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? "bg-emerald-600 text-white" : "bg-gray-200"
            }`}
          >
            2
          </div>
          <span className='ml-2 font-medium'>Payment</span>
        </div>
      </div>
    </div>
  )
}
