"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client";
import { useAtom } from "jotai";
import { TOUR_DETAIL_QUERY } from "@/graphql/queries";
import orderMutations from "@/graphql/order/mutations";
import orderQueries from "@/graphql/order/queries";
import paymentMutations from "@/graphql/payment/mutations";
import paymentQueries from "@/graphql/payment/queries";
import PageLoader from "@/components/common/PageLoader";
import { useAuthContext } from "@/lib/AuthContext";
import { useFindOrCreateCustomer } from "@/hooks/useFindOrCreateCustomer";
import { toast } from "sonner";
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
} from "@/store/bookingStore";

// Components
import { BookingProgressSteps } from "./_components/BookingProgressSteps";
import { LoginPrompt } from "./_components/LoginPrompt";
import { TourDetailsSidebar } from "./_components/TourDetailsSidebar";
import { PriceSummary } from "./_components/PriceSummary";
import { TravelerInfoStep } from "./_components/TravelerInfoStep";
import { PaymentStep } from "./_components/PaymentStep";

const BookingPage = () => {
  const searchParams = useSearchParams();
  const tourId = searchParams.get("tourId");
  const existingOrderId = searchParams.get("orderId");
  const numberOfPeople = parseInt(searchParams.get("people") || "1");
  const selectedDate = searchParams.get("selectedDate");

  // Use Jotai atoms for persistent state
  const [currentStep, setCurrentStep] = useAtom(currentStepAtom);
  const [travelers, setTravelers] = useAtom(travelersAtom);
  const [paymentType, setPaymentType] = useAtom(paymentTypeAtom);
  const [note, setNote] = useAtom(noteAtom);
  const [paymentData, setPaymentData] = useAtom(paymentDataAtom);
  const [orderId, setOrderId] = useAtom(orderIdAtom);
  const [invoiceId, setInvoiceId] = useAtom(invoiceIdAtom);
  const [validationErrors, setValidationErrors] = useAtom(validationErrorsAtom);

  // Transient state (not persisted)
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Get current user from AuthContext
  const { user: currentUser, loading: userLoading } = useAuthContext();
  const { handleFindOrCreateCustomer, loading: customerLoading } =
    useFindOrCreateCustomer();

  // Fetch orders if we need to find an existing order
  const { data: ordersData, loading: ordersLoading } = useQuery(
    orderQueries.bmOrders,
    {
      variables: { customerId: currentUser?.erxesCustomerId },
      skip: !existingOrderId || !currentUser?.erxesCustomerId,
      fetchPolicy: "network-only",
    },
  );

  // Find the specific order from the list
  const existingOrder = React.useMemo(() => {
    if (!existingOrderId || !ordersData?.bmOrders?.list) return null;
    return ordersData.bmOrders.list.find(
      (order: any) => order._id === existingOrderId,
    );
  }, [existingOrderId, ordersData]);

  // Determine which tourId to use (from URL or from existing order)
  const effectiveTourId = tourId || existingOrder?.tourId;

  const { data, loading, error } = useQuery(TOUR_DETAIL_QUERY, {
    variables: { id: effectiveTourId },
    skip: !effectiveTourId,
  });

  // Fetch payment methods to get selected payment _id
  const { data: paymentsData } = useQuery(paymentQueries.payments, {
    fetchPolicy: "cache-and-network",
  });

  const [invoiceCreate] = useMutation(paymentMutations.invoiceCreate);
  const [transactionsAdd] = useMutation(paymentMutations.transactionsAdd);

  const [bmOrderAdd] = useMutation(orderMutations.bmOrderAdd, {
    onCompleted: async (orderData) => {
      const createdOrderId = orderData?.bmOrderAdd?._id;
      const orderAmount = orderData?.bmOrderAdd?.amount;

      if (!createdOrderId) {
        toast.error("Order created but ID not found");
        setIsSubmitting(false);
        return;
      }

      setOrderId(createdOrderId);

      const selectedPayment = paymentsData?.payments?.find(
        (p: any) => p.kind === paymentType,
      );

      if (!selectedPayment) {
        toast.error("Selected payment method not found");
        setIsSubmitting(false);
        return;
      }

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
        });

        const invoiceData = invoiceResponse.data?.invoiceCreate;
        const createdInvoiceId = invoiceData?._id;
        const transaction = invoiceData?.transactions?.[0];

        if (!createdInvoiceId) {
          toast.error("Invoice created but ID not found");
          setIsSubmitting(false);
          return;
        }

        setInvoiceId(createdInvoiceId);

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
            });

            const transactionData =
              transactionResponse.data?.paymentTransactionsAdd;
            const paymentResponse = transactionData?.response;

            setPaymentData({
              paymentKind:
                transactionData?.paymentKind ||
                transaction.paymentKind ||
                paymentType,
              invoice:
                paymentResponse?.invoice || transaction.response?.invoice || "",
              socialDeeplink:
                paymentResponse?.socialDeeplink ||
                transaction.response?.socialDeeplink ||
                "",
            });

            toast.success("Захиалга амжилттай үүслээ!");
            setCurrentStep(2);
            setIsSubmitting(false);
          } catch (transactionError: any) {
            console.error("Transaction error:", transactionError);
            toast.error(
              "Нэхэмжлэх үүссэн боловч гүйлгээнд алдаа гарлаа: " +
                transactionError.message,
            );
            setCurrentStep(2);
            setIsSubmitting(false);
          }
        } else {
          setPaymentData({
            paymentKind: paymentType,
            invoice: "",
            socialDeeplink: "",
          });

          toast.success("Захиалга үүслээ!");
          setCurrentStep(2);
          setIsSubmitting(false);
        }
      } catch (error: any) {
        toast.error("Алдаа гарлаа: " + error.message);
        setIsSubmitting(false);
      }
    },
    onError: (error) => {
      toast.error("Захиалга үүсгэхэд алдаа гарлаа: " + error.message);
      setIsSubmitting(false);
    },
  });

  const tour = data?.bmTourDetail;

  useEffect(() => {
    if (orderId && invoiceId && currentStep !== 2 && !existingOrderId) {
      setCurrentStep(2);
    }
  }, [orderId, invoiceId, currentStep, existingOrderId, setCurrentStep]);

  const lastTourIdRef = React.useRef<string | null>(null);
  const lastExistingOrderIdRef = React.useRef<string | null>(null);

  useEffect(() => {
    const tourIdChanged = tourId !== lastTourIdRef.current;
    const orderIdChanged = existingOrderId !== lastExistingOrderIdRef.current;

    if (tourIdChanged || orderIdChanged) {
      if (existingOrderId) {
        setOrderId(null);
        setInvoiceId(null);
        setPaymentData(null);
        setCurrentStep(1);
      } else {
        setOrderId(null);
        setInvoiceId(null);
        setPaymentData(null);
        if (currentStep === 2) {
          setCurrentStep(1);
        }
      }
      lastTourIdRef.current = tourId;
      lastExistingOrderIdRef.current = existingOrderId;
    }
  }, [tourId, existingOrderId]);

  const handlePayExistingOrder = React.useCallback(async () => {
    if (!existingOrder || !paymentType) {
      toast.error("Order or payment method not found");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedPayment = paymentsData?.payments?.find(
        (p: any) => p.kind === paymentType,
      );

      if (!selectedPayment) {
        toast.error("Selected payment method not found");
        setIsSubmitting(false);
        return;
      }

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
      });

      const invoiceData = invoiceResponse.data?.invoiceCreate;
      const createdInvoiceId = invoiceData?._id;
      const transaction = invoiceData?.transactions?.[0];

      if (!createdInvoiceId) {
        toast.error("Invoice creation failed");
        setIsSubmitting(false);
        return;
      }

      setInvoiceId(createdInvoiceId);

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
          });

          const transactionData =
            transactionResponse.data?.paymentTransactionsAdd;
          const paymentResponse = transactionData?.response;

          setPaymentData({
            paymentKind:
              transactionData?.paymentKind || transaction.paymentKind,
            invoice: paymentResponse?.invoice || transaction.response.invoice,
            socialDeeplink:
              paymentResponse?.socialDeeplink ||
              transaction.response.socialDeeplink,
          });

          toast.success("Нэхэмжлэх үүслээ!");
        } catch (transactionError: any) {
          toast.error("Алдаа: " + transactionError.message);
        }
      } else {
        toast.success("Нэхэмжлэх үүслээ!");
      }

      setIsSubmitting(false);
    } catch (error: any) {
      toast.error("Алдаа: " + error.message);
      setIsSubmitting(false);
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
  ]);

  useEffect(() => {
    if (existingOrder && existingOrderId && orderId !== existingOrder._id) {
      setOrderId(existingOrder._id);
      if (existingOrder.type) {
        setPaymentType(existingOrder.type);
      }
      setCurrentStep(2);
    }
  }, [
    existingOrder,
    existingOrderId,
    orderId,
    setOrderId,
    setPaymentType,
    setCurrentStep,
  ]);

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
      handlePayExistingOrder();
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
  ]);

  useEffect(() => {
    if (currentUser && travelers.length === 0 && !existingOrderId) {
      const initialTravelers: TravelerData[] = Array.from(
        { length: numberOfPeople },
        (_, index) => {
          if (index === 0) {
            return {
              firstName: currentUser.firstName || "",
              lastName: currentUser.lastName || "",
              email: currentUser.email || "",
              gender: "",
              nationality: "",
            };
          }
          return {
            firstName: "",
            lastName: "",
            email: "",
            gender: "",
            nationality: "",
          };
        },
      );
      setTravelers(initialTravelers);
    }
  }, [currentUser, numberOfPeople, travelers.length]);

  useEffect(() => {
    if (effectiveTourId && !currentUser && !userLoading) {
      let currentUrl = `/booking?tourId=${effectiveTourId}&people=${numberOfPeople}`;
      if (selectedDate) currentUrl += `&selectedDate=${selectedDate}`;
      if (existingOrderId) currentUrl += `&orderId=${existingOrderId}`;
      localStorage.setItem("redirectAfterLogin", currentUrl);
    }
  }, [
    effectiveTourId,
    currentUser,
    userLoading,
    numberOfPeople,
    selectedDate,
    existingOrderId,
  ]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      effectiveTourId &&
      !existingOrderId &&
      !orderId
    ) {
      const bookingKey = `current-booking-params`;
      const currentParams = {
        tourId: effectiveTourId,
        numberOfPeople,
        selectedDate: selectedDate || "",
      };
      const storedParams = localStorage.getItem(bookingKey);

      if (storedParams) {
        const parsed = JSON.parse(storedParams);
        if (
          parsed.tourId !== effectiveTourId ||
          parsed.numberOfPeople !== numberOfPeople ||
          parsed.selectedDate !== (selectedDate || "")
        ) {
          clearBookingData();
          setTravelers([]);
          setPaymentType("");
          setNote("");
          setCurrentStep(1);
          setPaymentData(null);
          setOrderId(null);
          setInvoiceId(null);
          setValidationErrors({});
        }
      }
      localStorage.setItem(bookingKey, JSON.stringify(currentParams));
    }
  }, [effectiveTourId, numberOfPeople, selectedDate, existingOrderId, orderId]);

  if (!effectiveTourId) {
    return (
      <div className="min-h-screen bg-white-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2rem] p-10 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
            Аялал сонгоогүй байна
          </h1>
          <p className="text-slate-500 mt-4 font-light">
            Та эхлээд аялалаа сонгож захиалгаа үргэлжлүүлнэ үү.
          </p>
        </div>
      </div>
    );
  }

  if (userLoading || loading || (existingOrderId && ordersLoading)) {
    return <PageLoader />;
  }

  if (!currentUser) {
    return <LoginPrompt />;
  }

  if (error || !tour) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[2rem] p-10 text-center shadow-xl shadow-slate-200/50 border border-slate-100">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
            Аялал олдсонгүй
          </h1>
          <p className="text-slate-500 mt-4 font-light">
            Аяллын мэдээллийг ачаалахад алдаа гарлаа.
          </p>
        </div>
      </div>
    );
  }

  const effectiveNumberOfPeople =
    existingOrder?.numberOfPeople || numberOfPeople;
  const totalCost = existingOrder?.amount || tour.cost * numberOfPeople;

  const handleTravelerChange = (
    index: number,
    field: keyof TravelerData,
    value: string,
  ) => {
    const updated = [...travelers];
    updated[index] = { ...updated[index], [field]: value };
    setTravelers(updated);
  };

  const validateStep1 = () => {
    const errors: { [key: string]: boolean } = {};
    let hasErrors = false;
    let firstErrorMessage = "";

    if (!paymentType) {
      errors["paymentType"] = true;
      hasErrors = true;
      firstErrorMessage = "Төлбөрийн хэрэгсэл сонгоно уу";
    }

    for (let i = 0; i < travelers.length; i++) {
      const traveler = travelers[i];
      const label = i === 0 ? "Ахлагч" : `${i + 1}-р зорчигч`;

      if (!traveler.firstName) {
        errors[`${i}-firstName`] = true;
        hasErrors = true;
        if (!firstErrorMessage)
          firstErrorMessage = `${label}-ийн нэрийг оруулна уу`;
      }
      if (!traveler.lastName) {
        errors[`${i}-lastName`] = true;
        hasErrors = true;
        if (!firstErrorMessage)
          firstErrorMessage = `${label}-ийн овог оруулна уу`;
      }
      if (!traveler.email) {
        errors[`${i}-email`] = true;
        hasErrors = true;
        if (!firstErrorMessage)
          firstErrorMessage = `${label}-ийн и-мэйл оруулна уу`;
      }
      if (!traveler.gender) {
        errors[`${i}-gender`] = true;
        hasErrors = true;
        if (!firstErrorMessage)
          firstErrorMessage = `${label}-ийн хүйс сонгоно уу`;
      }
      if (!traveler.nationality) {
        errors[`${i}-nationality`] = true;
        hasErrors = true;
        if (!firstErrorMessage)
          firstErrorMessage = `${label}-ийн харьяалал сонгоно уу`;
      }
    }

    setValidationErrors(errors);
    if (hasErrors) {
      toast.error(firstErrorMessage);
      return false;
    }
    return true;
  };

  const handleSubmitBooking = async () => {
    if (!validateStep1()) return;
    setIsSubmitting(true);
    try {
      const leadCustomerId = currentUser?.erxesCustomerId;
      if (!leadCustomerId) {
        toast.error("Customer ID олдсонгүй.");
        setIsSubmitting(false);
        return;
      }
      const additionalCustomerIds: string[] = [];
      for (let i = 1; i < travelers.length; i++) {
        const customerId = await handleFindOrCreateCustomer(travelers[i]);
        if (customerId) additionalCustomerIds.push(customerId);
      }
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
      });
    } catch (error) {
      console.error("Booking error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Step Progress Container */}
        <div className="mb-12">
          <BookingProgressSteps currentStep={currentStep} />
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em]">
                Step {currentStep === 1 ? "01" : "02"}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter">
                {currentStep === 1 ? "Зорчигчийн мэдээлэл" : "Төлбөр төлөлт"}
              </h1>
              <p className="text-slate-500 font-light text-lg">
                {currentStep === 1
                  ? "Аяллын багт багтсан бүх зорчигчдын мэдээллийг үнэн зөв оруулна уу."
                  : "Захиалгаа баталгаажуулахын тулд төлбөрөө төлнө үү."}
              </p>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden transition-all duration-500">
              <div className="p-8 md:p-12">
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
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-28">
            <div className="group bg-white-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-slate-900/20 transition-transform duration-500 hover:scale-[1.02]">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-black/50 mb-6 flex items-center gap-2">
                <div className="w-4 h-[1px] bg-purple-500"></div> Захиалгын
                хураангуй
              </h3>
              <TourDetailsSidebar
                tour={tour}
                numberOfPeople={effectiveNumberOfPeople}
              />
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
              <PriceSummary
                costPerPerson={tour.cost}
                numberOfPeople={effectiveNumberOfPeople}
                totalCost={totalCost}
              />
            </div>

            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 flex items-start gap-4">
              <div className="bg-purple
              -500 p-2 rounded-lg text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h4 className="text-xs font-black text-purple-900 uppercase">
                  Санамж
                </h4>
                <p className="text-[11px] text-purple-700/80 mt-1 leading-relaxed">
                  Мэдээллээ дутуу оруулсан тохиолдолд захиалга баталгаажихгүй
                  болохыг анхаарна уу.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
