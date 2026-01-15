import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

// Traveler data type
export interface TravelerData {
  firstName: string
  lastName: string
  email: string
  gender: string
  nationality: string
}

// Payment data type
export interface PaymentData {
  paymentKind: string
  invoice?: string
  socialDeeplink?: string
}

// Atoms with localStorage persistence
export const travelersAtom = atomWithStorage<TravelerData[]>(
  "booking-travelers",
  []
)

export const paymentTypeAtom = atomWithStorage<string>(
  "booking-payment-type",
  ""
)

export const noteAtom = atomWithStorage<string>("booking-note", "")

export const currentStepAtom = atomWithStorage<number>("booking-step", 1)

export const paymentDataAtom = atomWithStorage<PaymentData | null>(
  "booking-payment-data",
  null
)

export const orderIdAtom = atomWithStorage<string | null>(
  "booking-order-id",
  null
)

export const invoiceIdAtom = atomWithStorage<string | null>(
  "booking-invoice-id",
  null
)

export const validationErrorsAtom = atom<{ [key: string]: boolean }>({})

// Helper function to clear booking data
export const clearBookingData = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("booking-travelers")
    localStorage.removeItem("booking-payment-type")
    localStorage.removeItem("booking-note")
    localStorage.removeItem("booking-step")
    localStorage.removeItem("booking-payment-data")
    localStorage.removeItem("booking-order-id")
    localStorage.removeItem("booking-invoice-id")
  }
}
