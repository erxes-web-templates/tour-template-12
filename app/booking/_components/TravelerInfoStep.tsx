import React from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import TravelerForm from "./TravelerForm"

interface TravelerData {
  firstName: string
  lastName: string
  email: string
  gender: string
  nationality: string
}

interface TravelerInfoStepProps {
  travelers: TravelerData[]
  onTravelerChange: (
    index: number,
    field: keyof TravelerData,
    value: string
  ) => void
  currentUser: any
  paymentType: string
  setPaymentType: (value: string) => void
  note: string
  setNote: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
  customerLoading: boolean
  validationErrors: { [key: string]: boolean }
}

export const TravelerInfoStep: React.FC<TravelerInfoStepProps> = ({
  travelers,
  onTravelerChange,
  currentUser,
  paymentType,
  setPaymentType,
  note,
  setNote,
  onSubmit,
  isSubmitting,
  customerLoading,
  validationErrors,
}) => {
  return (
    <>
      {travelers.map((traveler, index) => (
        <TravelerForm
          key={index}
          index={index}
          data={traveler}
          onChange={onTravelerChange}
          isLead={index === 0}
          currentUser={currentUser}
          paymentType={paymentType}
          setPaymentType={setPaymentType}
          note={note}
          setNote={setNote}
          validationErrors={validationErrors}
        />
      ))}

      <div className='flex justify-end gap-3'>
        <Button
          size='lg'
          onClick={onSubmit}
          disabled={isSubmitting || customerLoading}
        >
          {isSubmitting || customerLoading
            ? "Processing..."
            : "Continue to Payment"}
          <ArrowRight className='ml-2 h-4 w-4' />
        </Button>
      </div>
    </>
  )
}
