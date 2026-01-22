"use client"

import React, { useEffect } from "react"
import { useSubscription, useMutation } from "@apollo/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Receipt, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import paymentSubscriptions from "@/graphql/payment/subscriptions"
import orderMutations from "@/graphql/order/mutations"

interface PaymentStepProps {
  onBack: () => void
  paymentData?: {
    paymentKind: string
    invoice?: string
    socialDeeplink?: string
  } | null
  loading?: boolean
  orderId?: string | null
  invoiceId?: string | null
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  onBack,
  paymentData,
  loading = false,
  orderId,
  invoiceId,
}) => {
  const [paymentCompleted, setPaymentCompleted] = React.useState(false)

  // Update order status mutation
  const [bmOrderEdit] = useMutation(orderMutations.bmOrderEdit, {
    onCompleted: () => {
      toast.success("Payment successful! Order updated.")
      setPaymentCompleted(true)
    },
    onError: (error) => {
      console.error("Failed to update order:", error)
      toast.error("Payment received but failed to update order")
    },
  })

  // Subscribe to transaction updates
  const { data: transactionData } = useSubscription(
    paymentSubscriptions.transaction,
    {
      variables: { invoiceId: invoiceId },
      skip: !invoiceId,
      onData: ({ data }) => {
        console.log("Transaction updated:", data)
        const transaction = data.data?.transactionUpdated

        // Check if payment is successful
        if (
          transaction?.status === "paid" || transaction?.status === "completed" || transaction?.status === "success"
        ) {
          // Update order status to paid
          if (orderId && !paymentCompleted) {
            bmOrderEdit({
              variables: {
                _id: orderId,
                order: {
                  status: "paid",
                },
              },
            })
          }
        }
      },
    }
  )

  const getPaymentUrl = () => {
    if (!paymentData) return null

    switch (paymentData.paymentKind) {
      case "golomt":
        return paymentData.invoice
          ? `https://ecommerce.golomtbank.com/payment/en/${paymentData.invoice}`
          : null
      case "qpayQuickqr":
        return `${process.env.ERXES_URL}/pl:payment/invoice/${invoiceId}`
      default:
        return null
    }
  }

  const paymentUrl = getPaymentUrl()

  return (
    <div className='space-y-6'>
    

      {paymentCompleted ? (
        <Card>
          <CardContent className='flex flex-col gap-4 justify-center items-center py-12'>
            <CheckCircle2 className='w-16 h-16 text-green-500' />
            <div className='text-center'>
              <p className='text-lg font-semibold text-gray-700'>
                Payment Successful!
              </p>
              <p className='text-sm text-gray-500'>
                Your booking has been confirmed
              </p>
            </div>
          </CardContent>
        </Card>
      ) : loading ? (
        <Card>
          <CardContent
            className='flex flex-col gap-4 justify-center items-center'
            style={{ height: 750 }}
          >
            <div className='text-center'>
              <p className='text-lg font-semibold text-gray-700'>
                Creating payment...
              </p>
              <p className='text-sm text-gray-500'>
                Please wait while we prepare your payment
              </p>
            </div>
          </CardContent>
        </Card>
      ) : paymentUrl ? (
        <Card>
          <CardContent className='p-0' style={{ height: 750 }}>
            <iframe
              src={paymentUrl}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: 16,
              }}
              title='Payment Gateway'
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-center py-12'>
              <p className='text-gray-600'>
                Payment URL not available. Please try again.
              </p>
              <Button className='mt-4' onClick={onBack} variant='outline'>
                <ArrowLeft className='mr-2 h-4 w-4' />
                Back to Traveler Info
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
