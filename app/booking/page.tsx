"use client"

import React, { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useQuery, useMutation } from "@apollo/client"
import { useAtom } from "jotai"
import { TOUR_DETAIL_QUERY } from "@/graphql/queries"
import orderMutations from "@/graphql/order/mutations"
import orderQueries from "@/graphql/order/queries"
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
  clearBookingData,
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
  const existingOrderId = searchParams.get("orderId")
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

  // Fetch orders if we need to find an existing order
  const { data: ordersData, loading: ordersLoading } = useQuery(
    orderQueries.bmOrders,
    {
      variables: { customerId: currentUser?.erxesCustomerId },
      skip: !existingOrderId || !currentUser?.erxesCustomerId,
      fetchPolicy: "network-only",
    }
  )

  // Find the specific order from the list
  const existingOrder = React.useMemo(() => {
    if (!existingOrderId || !ordersData?.bmOrders?.list) return null
    return ordersData.bmOrders.list.find((order: any) => order._id === existingOrderId)
  }, [existingOrderId, ordersData])

  // Determine which tourId to use (from URL or from existing order)
  const effectiveTourId = tourId || existingOrder?.tourId

  const { data, loading, error } = useQuery(TOUR_DETAIL_QUERY, {
    variables: { id: effectiveTourId },
    skip: !effectiveTourId,
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
                  socialDeeplink: transaction.response.socialDeeplink || "",
                  checksum: transaction.response.checksum || "",
                  invoice: transaction.response.invoice || "",
                  transactionId: transaction.response.transactionId || "",
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
                transactionData?.paymentKind || transaction.paymentKind || paymentType,
              invoice: paymentResponse?.invoice || transaction.response?.invoice || "",
              socialDeeplink:
                paymentResponse?.socialDeeplink ||
                transaction.response?.socialDeeplink || "",
            })

            toast.success(
              "Booking, invoice and transaction created successfully!"
            )
            setCurrentStep(2)
            setIsSubmitting(false)
          } catch (transactionError: any) {
            console.error("Transaction error:", transactionError)
            toast.error(
              "Invoice created but transaction update failed: " +
                transactionError.message
            )
            // Still proceed to payment step even if transaction update fails
            setCurrentStep(2)
            setIsSubmitting(false)
          }
        } else {
          // If no transaction response, set basic payment data and proceed
          // Store basic payment data
          setPaymentData({
            paymentKind: paymentType,
            invoice: "",
            socialDeeplink: "",
          })
          
          toast.success("Booking and invoice created successfully!")
          setCurrentStep(2)
          setIsSubmitting(false)
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

  // Ensure we're on step 2 if we have orderId and invoiceId (payment ready)
  useEffect(() => {
    if (orderId && invoiceId && currentStep !== 2 && !existingOrderId) {
      setCurrentStep(2)
    }
  }, [orderId, invoiceId, currentStep, existingOrderId, setCurrentStep])

  // Track the last processed URL parameters to detect changes
  const lastTourIdRef = React.useRef<string | null>(null)
  const lastExistingOrderIdRef = React.useRef<string | null>(null)

  // Clear previous order data when URL parameters change (tourId or existingOrderId)
  // This ensures fresh booking doesn't show old payment data
  useEffect(() => {
    const tourIdChanged = tourId !== lastTourIdRef.current
    const orderIdChanged = existingOrderId !== lastExistingOrderIdRef.current

    if (tourIdChanged || orderIdChanged) {
      // URL parameters changed - clear all previous booking data
      if (existingOrderId) {
        // Paying for existing order - clear but keep ref
        setOrderId(null)
        setInvoiceId(null)
        setPaymentData(null)
        setCurrentStep(1)
      } else {
        // Fresh booking - clear everything
        setOrderId(null)
        setInvoiceId(null)
        setPaymentData(null)
        if (currentStep === 2) {
          setCurrentStep(1)
        }
      }

      // Update refs
      lastTourIdRef.current = tourId
      lastExistingOrderIdRef.current = existingOrderId
    }
    // Only run when URL parameters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tourId, existingOrderId])

  // Create invoice for existing order
  const handlePayExistingOrder = React.useCallback(async () => {
    if (!existingOrder || !paymentType) {
      toast.error("Order or payment method not found")
      return
    }

    setIsSubmitting(true)

    try {
      // Find selected payment _id from payments list
      const selectedPayment = paymentsData?.payments?.find(
        (p: any) => p.kind === paymentType
      )

      if (!selectedPayment) {
        toast.error("Selected payment method not found")
        setIsSubmitting(false)
        return
      }

      // Create invoice for existing order
      const invoiceResponse = await invoiceCreate({
        variables: {
          amount: existingOrder.amount,
          email: currentUser?.email,
          description: `Payment for order ${existingOrder._id}`,
          customerId: currentUser?.erxesCustomerId,
          customerType: "customer",
          contentTypeId: existingOrder._id,
          paymentIds: [selectedPayment._id],
        },
      })

      const invoiceData = invoiceResponse.data?.invoiceCreate
      const createdInvoiceId = invoiceData?._id
      const transaction = invoiceData?.transactions?.[0]

      if (!createdInvoiceId) {
        toast.error("Invoice creation failed")
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
              amount: existingOrder.amount,
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

          toast.success("Invoice created successfully!")
        } catch (transactionError: any) {
          toast.error(
            "Invoice created but transaction update failed: " +
              transactionError.message
          )
        }
      } else {
        toast.success("Invoice created successfully!")
      }

      setIsSubmitting(false)
    } catch (error: any) {
      toast.error("Failed to create invoice: " + error.message)
      setIsSubmitting(false)
    }
  }, [
    existingOrder,
    paymentType,
    paymentsData,
    currentUser,
    invoiceCreate,
    transactionsAdd,
    setInvoiceId,
    setPaymentData,
    setIsSubmitting,
  ])

  // If existing order is loaded, set it up for payment
  useEffect(() => {
    if (existingOrder && existingOrderId && orderId !== existingOrder._id) {
      setOrderId(existingOrder._id)
      if (existingOrder.type) {
        setPaymentType(existingOrder.type)
      }
      // Skip to payment step
      setCurrentStep(2)
    }
  }, [existingOrder, existingOrderId, orderId, setOrderId, setPaymentType, setCurrentStep])

  // Auto-create invoice when existing order is ready and we're on payment step
  useEffect(() => {
    if (
      existingOrder &&
      existingOrderId &&
      orderId === existingOrder._id &&
      currentStep === 2 &&
      !paymentData &&
      !invoiceId &&
      !isSubmitting &&
      paymentsData?.payments
    ) {
      handlePayExistingOrder()
    }
  }, [
    existingOrder,
    existingOrderId,
    orderId,
    currentStep,
    paymentData,
    invoiceId,
    isSubmitting,
    paymentsData,
    handlePayExistingOrder,
  ])

  // Initialize travelers with current user data for lead traveler
  useEffect(() => {
    if (currentUser && travelers.length === 0 && !existingOrderId) {
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
    if (effectiveTourId && !currentUser && !userLoading) {
      let currentUrl = `/booking?tourId=${effectiveTourId}&people=${numberOfPeople}`
      if (selectedDate) currentUrl += `&selectedDate=${selectedDate}`
      if (existingOrderId) currentUrl += `&orderId=${existingOrderId}`
      localStorage.setItem("redirectAfterLogin", currentUrl)
    }
  }, [effectiveTourId, currentUser, userLoading, numberOfPeople, selectedDate, existingOrderId])

  // Clear booking data when starting a new booking (different tour or parameters)
  // Skip this if we're paying for an existing order OR if we have an active orderId (processing)
  useEffect(() => {
    if (typeof window !== "undefined" && effectiveTourId && !existingOrderId && !orderId) {
      const bookingKey = `current-booking-params`
      const currentParams = {
        tourId: effectiveTourId,
        numberOfPeople,
        selectedDate: selectedDate || "",
      }
      const storedParams = localStorage.getItem(bookingKey)

      if (storedParams) {
        const parsed = JSON.parse(storedParams)
        // Check if any parameter has changed
        if (
          parsed.tourId !== effectiveTourId ||
          parsed.numberOfPeople !== numberOfPeople ||
          parsed.selectedDate !== (selectedDate || "")
        ) {
          // Parameters changed - clear old booking data
          clearBookingData()
          setTravelers([])
          setPaymentType("")
          setNote("")
          setCurrentStep(1)
          setPaymentData(null)
          setOrderId(null)
          setInvoiceId(null)
          setValidationErrors({})
        }
      }

      // Store current parameters
      localStorage.setItem(bookingKey, JSON.stringify(currentParams))
    }
  }, [effectiveTourId, numberOfPeople, selectedDate, existingOrderId, orderId])

  if (!effectiveTourId) {
    return (
      <div className='container mx-auto p-4 py-12 text-center'>
        <h1 className='text-2xl font-bold text-gray-800'>No Tour Selected</h1>
        <p className='text-gray-500 mt-2'>
          Please select a tour to proceed with booking.
        </p>
      </div>
    )
  }

  if (userLoading || loading || (existingOrderId && ordersLoading)) {
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

  // Use existing order data if available, otherwise calculate
  const effectiveNumberOfPeople = existingOrder?.numberOfPeople || numberOfPeople
  const totalCost = existingOrder?.amount || (tour.cost * numberOfPeople)

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
            tourId: effectiveTourId,
            customerId: leadCustomerId,
            amount: totalCost,
            numberOfPeople: effectiveNumberOfPeople,
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
            <TourDetailsSidebar tour={tour} numberOfPeople={effectiveNumberOfPeople} />
            <PriceSummary
              costPerPerson={tour.cost}
              numberOfPeople={effectiveNumberOfPeople}
              totalCost={totalCost}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingPage
