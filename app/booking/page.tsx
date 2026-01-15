"use client"

import React, { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useQuery, useMutation } from "@apollo/client"
import { useAtom } from "jotai"
import { TOUR_DETAIL_QUERY } from "@/graphql/queries"
import orderMutations from "@/graphql/order/mutations"
import paymentMutations from "@/graphql/payment/mutations"
import paymentQueries from "@/graphql/payment/queries"
import PageLoader from "@/components/common/PageLoader"
import { useAuthContext } from "@/lib/AuthContext"
import { useFindOrCreateCustomer } from "@/hooks/useFindOrCreateCustomer"
import { toast } from "sonner"
import {
  travelersAtom,
  paymentTypeAtom,
  noteAtom,
  currentStepAtom,
  paymentDataAtom,
  orderIdAtom,
  invoiceIdAtom,
  validationErrorsAtom,
  type TravelerData,
} from "@/store/bookingStore"

// Components
import { BookingProgressSteps } from "./_components/BookingProgressSteps"
import { LoginPrompt } from "./_components/LoginPrompt"
import { TourDetailsSidebar } from "./_components/TourDetailsSidebar"
import { PriceSummary } from "./_components/PriceSummary"
import { TravelerInfoStep } from "./_components/TravelerInfoStep"
import { PaymentStep } from "./_components/PaymentStep"

const BookingPage = () => {
  const searchParams = useSearchParams()
  const tourId = searchParams.get("tourId")
  const numberOfPeople = parseInt(searchParams.get("people") || "1")
  const selectedDate = searchParams.get("selectedDate")

  // Use Jotai atoms for persistent state
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom)
  const [travelers, setTravelers] = useAtom(travelersAtom)
  const [paymentType, setPaymentType] = useAtom(paymentTypeAtom)
  const [note, setNote] = useAtom(noteAtom)
  const [paymentData, setPaymentData] = useAtom(paymentDataAtom)
  const [orderId, setOrderId] = useAtom(orderIdAtom)
  const [invoiceId, setInvoiceId] = useAtom(invoiceIdAtom)
  const [validationErrors, setValidationErrors] = useAtom(validationErrorsAtom)

  // Transient state (not persisted)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Get current user from AuthContext
  const { user: currentUser, loading: userLoading } = useAuthContext()
  const { handleFindOrCreateCustomer, loading: customerLoading } =
    useFindOrCreateCustomer()

  const { data, loading, error } = useQuery(TOUR_DETAIL_QUERY, {
    variables: { id: tourId },
    skip: !tourId,
  })

  // Fetch payment methods to get selected payment _id
  const { data: paymentsData } = useQuery(paymentQueries.payments, {
    fetchPolicy: "cache-and-network",
  })

  const [invoiceCreate] = useMutation(paymentMutations.invoiceCreate)
  const [transactionsAdd] = useMutation(paymentMutations.transactionsAdd)

  const [bmOrderAdd] = useMutation(orderMutations.bmOrderAdd, {
    onCompleted: async (orderData) => {
      const createdOrderId = orderData?.bmOrderAdd?._id
      const orderAmount = orderData?.bmOrderAdd?.amount

      if (!createdOrderId) {
        toast.error("Order created but ID not found")
        setIsSubmitting(false)
        return
      }

      // Store order ID
      setOrderId(createdOrderId)

      // Find selected payment _id from payments list
      const selectedPayment = paymentsData?.payments?.find(
        (p: any) => p.kind === paymentType
      )

      if (!selectedPayment) {
        toast.error("Selected payment method not found")
        setIsSubmitting(false)
        return
      }

      // Create invoice
      try {
        const invoiceResponse = await invoiceCreate({
          variables: {
            amount: orderAmount,
            email: currentUser?.email,
            description: `Booking payment for order ${createdOrderId}`,
            customerId: currentUser?.erxesCustomerId,
            customerType: "customer",
            contentTypeId: createdOrderId,
            paymentIds: [selectedPayment._id],
          },
        })

        const invoiceData = invoiceResponse.data?.invoiceCreate
        const createdInvoiceId = invoiceData?._id
        const transaction = invoiceData?.transactions?.[0]

        if (!createdInvoiceId) {
          toast.error("Invoice created but ID not found")
          setIsSubmitting(false)
          return
        }

        // Store invoice ID
        setInvoiceId(createdInvoiceId)

        // Update transaction with additional details if transaction exists
        if (transaction?._id && transaction?.response) {
          try {
            const transactionResponse = await transactionsAdd({
              variables: {
                invoiceId: createdInvoiceId,
                paymentId: selectedPayment._id,
                amount: orderAmount,
                details: {
                  socialDeeplink: transaction.response.socialDeeplink,
                  checksum: transaction.response.checksum,
                  invoice: transaction.response.invoice,
                  transactionId: transaction.response.transactionId,
                },
              },
            })

            // Get payment data from transactionsAdd response
            const transactionData =
              transactionResponse.data?.paymentTransactionsAdd
            const paymentResponse = transactionData?.response

            // Store payment data for PaymentStep
            setPaymentData({
              paymentKind:
                transactionData?.paymentKind || transaction.paymentKind,
              invoice: paymentResponse?.invoice || transaction.response.invoice,
              socialDeeplink:
                paymentResponse?.socialDeeplink ||
                transaction.response.socialDeeplink,
            })

            toast.success(
              "Booking, invoice and transaction created successfully!"
            )
            setCurrentStep(2)
          } catch (transactionError: any) {
            toast.error(
              "Invoice created but transaction update failed: " +
                transactionError.message
            )
            setIsSubmitting(false)
          }
        } else {
          // If no transaction response, just proceed to next step
          toast.success("Booking and invoice created successfully!")
          setCurrentStep(2)
        }
      } catch (error: any) {
        toast.error("Booking created but invoice failed: " + error.message)
        setIsSubmitting(false)
      }
    },
    onError: (error) => {
      toast.error("Failed to create booking: " + error.message)
      setIsSubmitting(false)
    },
  })

  const tour = data?.bmTourDetail

  // Initialize travelers with current user data for lead traveler
  useEffect(() => {
    if (currentUser && travelers.length === 0) {
      const initialTravelers: TravelerData[] = Array.from(
        { length: numberOfPeople },
        (_, index) => {
          if (index === 0) {
            // Lead traveler - use current user data
            return {
              firstName: currentUser.firstName || "",
              lastName: currentUser.lastName || "",
              email: currentUser.email || "",
              gender: "",
              nationality: "",
            }
          }
          // Additional travelers - empty
          return {
            firstName: "",
            lastName: "",
            email: "",
            gender: "",
            nationality: "",
          }
        }
      )
      setTravelers(initialTravelers)
    }
  }, [currentUser, numberOfPeople, travelers.length])

  // Store redirect URL for after login
  useEffect(() => {
    if (tourId && !currentUser && !userLoading) {
      const currentUrl = `/booking?tourId=${tourId}&people=${numberOfPeople}${
        selectedDate ? `&selectedDate=${selectedDate}` : ""
      }`
      localStorage.setItem("redirectAfterLogin", currentUrl)
    }
  }, [tourId, currentUser, userLoading, numberOfPeople, selectedDate])

  if (!tourId) {
    return (
      <div className='container mx-auto p-4 py-12 text-center'>
        <h1 className='text-2xl font-bold text-gray-800'>No Tour Selected</h1>
        <p className='text-gray-500 mt-2'>
          Please select a tour to proceed with booking.
        </p>
      </div>
    )
  }

  if (userLoading || loading) {
    return <PageLoader />
  }

  // Show login prompt if user is not authenticated
  if (!currentUser) {
    return <LoginPrompt />
  }

  if (error || !tour) {
    return (
      <div className='container mx-auto p-4 py-12 text-center'>
        <h1 className='text-2xl font-bold text-gray-800'>Tour Not Found</h1>
        <p className='text-gray-500 mt-2'>
          Unable to load tour details. Please try again.
        </p>
      </div>
    )
  }

  const totalCost = tour.cost * numberOfPeople

  const handleTravelerChange = (
    index: number,
    field: keyof TravelerData,
    value: string
  ) => {
    const updated = [...travelers]
    updated[index] = { ...updated[index], [field]: value }
    setTravelers(updated)
  }

  const validateStep1 = () => {
    const errors: { [key: string]: boolean } = {}
    let hasErrors = false
    let firstErrorMessage = ""

    // Validate payment type
    if (!paymentType) {
      errors["paymentType"] = true
      hasErrors = true
      firstErrorMessage = "Please select a payment method"
    }

    // Validate travelers
    for (let i = 0; i < travelers.length; i++) {
      const traveler = travelers[i]

      if (!traveler.firstName) {
        errors[`${i}-firstName`] = true
        hasErrors = true
        if (!firstErrorMessage) {
          firstErrorMessage = `Please enter first name for ${
            i === 0 ? "lead traveler" : `traveler ${i + 1}`
          }`
        }
      }

      if (!traveler.lastName) {
        errors[`${i}-lastName`] = true
        hasErrors = true
        if (!firstErrorMessage) {
          firstErrorMessage = `Please enter last name for ${
            i === 0 ? "lead traveler" : `traveler ${i + 1}`
          }`
        }
      }

      if (!traveler.email) {
        errors[`${i}-email`] = true
        hasErrors = true
        if (!firstErrorMessage) {
          firstErrorMessage = `Please enter email for ${
            i === 0 ? "lead traveler" : `traveler ${i + 1}`
          }`
        }
      }

      if (!traveler.gender) {
        errors[`${i}-gender`] = true
        hasErrors = true
        if (!firstErrorMessage) {
          firstErrorMessage = `Please select gender for ${
            i === 0 ? "lead traveler" : `traveler ${i + 1}`
          }`
        }
      }

      if (!traveler.nationality) {
        errors[`${i}-nationality`] = true
        hasErrors = true
        if (!firstErrorMessage) {
          firstErrorMessage = `Please select nationality for ${
            i === 0 ? "lead traveler" : `traveler ${i + 1}`
          }`
        }
      }
    }

    setValidationErrors(errors)

    if (hasErrors) {
      toast.error(firstErrorMessage)
      return false
    }

    return true
  }

  const handleSubmitBooking = async () => {
    if (!validateStep1()) return

    setIsSubmitting(true)

    try {
      // Use current user's customer ID directly
      const leadCustomerId = currentUser?.erxesCustomerId

      if (!leadCustomerId) {
        toast.error("Customer ID not found. Please contact support.")
        setIsSubmitting(false)
        return
      }

      // Find or create customers for additional travelers (skip lead traveler at index 0)
      const additionalCustomerIds: string[] = []

      for (let i = 1; i < travelers.length; i++) {
        const traveler = travelers[i]
        const customerId = await handleFindOrCreateCustomer(traveler)
        if (customerId) {
          additionalCustomerIds.push(customerId)
        }
      }

      // Create order
      await bmOrderAdd({
        variables: {
          order: {
            tourId: tourId,
            customerId: leadCustomerId,
            amount: totalCost,
            numberOfPeople: numberOfPeople,
            type: paymentType,
            note: note || undefined,
            status: "pending",
            additionalCustomers:
              additionalCustomerIds.length > 0
                ? additionalCustomerIds
                : undefined,
          },
        },
      })
    } catch (error) {
      console.error("Error creating booking:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className='container mx-auto p-4 md:p-6 lg:p-8'>
      <div className='max-w-4xl mx-auto'>
        <BookingProgressSteps currentStep={currentStep} />

        <h1 className='text-3xl font-bold mb-2'>
          {currentStep === 1 ? "Traveler Information" : "Payment"}
        </h1>
        <p className='text-gray-600 mb-8'>
          {currentStep === 1
            ? "Please provide information for all travelers"
            : "Complete your payment"}
        </p>

        <div className='grid md:grid-cols-3 gap-6'>
          {/* Main Content */}
          <div className='md:col-span-2 space-y-6'>
            {currentStep === 1 ? (
              <TravelerInfoStep
                travelers={travelers}
                onTravelerChange={handleTravelerChange}
                currentUser={currentUser}
                paymentType={paymentType}
                setPaymentType={setPaymentType}
                note={note}
                setNote={setNote}
                onSubmit={handleSubmitBooking}
                isSubmitting={isSubmitting}
                customerLoading={customerLoading}
                validationErrors={validationErrors}
              />
            ) : (
              <PaymentStep
                onBack={() => setCurrentStep(1)}
                paymentData={paymentData}
                loading={isSubmitting}
                orderId={orderId}
                invoiceId={invoiceId}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className='md:col-span-1 space-y-6'>
            <TourDetailsSidebar tour={tour} numberOfPeople={numberOfPeople} />
            <PriceSummary
              costPerPerson={tour.cost}
              numberOfPeople={numberOfPeople}
              totalCost={totalCost}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
