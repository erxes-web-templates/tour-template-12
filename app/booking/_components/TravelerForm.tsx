"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  User,
  Check,
  ChevronsUpDown,
  CreditCard,
  MessageSquareQuote,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { nationalities } from "@/lib/utils";
import paymentQueries from "@/graphql/payment/queries";
import { mutations as customerMutations } from "@/graphql/customer";
import { mutations as kbMutations } from "@/graphql/kb";
import { useFindOrCreateCustomer } from "@/hooks/useFindOrCreateCustomer";

interface TravelerData {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  nationality: string;
}

interface TravelerFormProps {
  index: number;
  data: TravelerData;
  onChange: (index: number, field: keyof TravelerData, value: string) => void;
  isLead?: boolean;
  currentUser?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    erxesCustomerId?: string;
  };
  customerId?: string;
  paymentType?: string;
  setPaymentType?: (value: string) => void;
  note?: string;
  setNote?: (value: string) => void;
  validationErrors?: { [key: string]: boolean };
}

export default function TravelerForm({
  index,
  data,
  onChange,
  isLead = false,
  currentUser,
  customerId,
  paymentType,
  setPaymentType,
  note,
  setNote,
  validationErrors = {},
}: TravelerFormProps) {
  const [open, setOpen] = useState(false);

  const hasError = (field: string) => {
    return validationErrors[`${index}-${field}`] === true;
  };

  const { data: paymentsData, loading: paymentsLoading } = useQuery(
    paymentQueries.payments,
    { fetchPolicy: "cache-and-network" },
  );

  const payments = paymentsData?.payments || [];
  const [updateCustomer] = useMutation(customerMutations.editCustomer);
  const [saveBrowserInfo] = useMutation(kbMutations.saveBrowserInfo);
  const { handleFindOrCreateCustomer } = useFindOrCreateCustomer();
  const [createdCustomerId, setCreatedCustomerId] = useState<string | null>(
    null,
  );

  const handleGenderChange = async (value: string) => {
    onChange(index, "gender", value);
    if (isLead && currentUser?.erxesCustomerId) {
      try {
        const sexValue = value === "male" ? 1 : value === "female" ? 2 : 0;
        await updateCustomer({
          variables: { _id: currentUser.erxesCustomerId, sex: sexValue },
        });
      } catch (error) {
        console.error("Failed to update customer gender:", error);
      }
    }
  };

  const handleNationalityChange = async (nationalityName: string) => {
    onChange(index, "nationality", nationalityName);
    const selectedNationality = nationalities.find(
      (nat) => nat.Name === nationalityName,
    );
    if (!selectedNationality) return;

    try {
      let targetCustomerId = isLead
        ? currentUser?.erxesCustomerId
        : customerId || createdCustomerId;
      if (
        !isLead &&
        !targetCustomerId &&
        data.firstName &&
        data.lastName &&
        data.email
      ) {
        targetCustomerId = await handleFindOrCreateCustomer({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          gender: data.gender,
        });
        if (targetCustomerId) setCreatedCustomerId(targetCustomerId);
      }

      if (targetCustomerId) {
        await saveBrowserInfo({
          variables: {
            customerId: targetCustomerId,
            browserInfo: {
              country: selectedNationality.Name,
              countryCode: selectedNationality.Code,
              userAgent: navigator.userAgent,
            },
          },
        });
      }
    } catch (error) {
      console.error("Failed to save nationality:", error);
    }
  };

  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-full bg-[#0F172A] flex items-center justify-center text-white shadow-lg shadow-slate-200">
          <User size={22} />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight text-[#0F172A]">
            {isLead ? "Lead Traveler" : `Traveler ${index + 1}`}
          </h3>
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">
            {isLead ? "Primary Contact Information" : "Passenger Details"}
          </p>
        </div>
      </div>

      <CardContent className="p-0 space-y-12">
        {/* Input Grid - Full Width Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
          <div className="space-y-2.5">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
              First Name *
            </Label>
            <Input
              value={data.firstName}
              onChange={(e) => onChange(index, "firstName", e.target.value)}
              placeholder="Enter first name"
              disabled={isLead}
              className={cn(
                "h-14 bg-slate-50/80 border-none rounded-xl text-base font-medium focus-visible:ring-2 focus-visible:ring-slate-200 transition-all",
                hasError("firstName") && "bg-red-50 ring-2 ring-red-100",
              )}
            />
          </div>

          <div className="space-y-2.5">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Last Name *
            </Label>
            <Input
              value={data.lastName}
              onChange={(e) => onChange(index, "lastName", e.target.value)}
              placeholder="Enter last name"
              disabled={isLead}
              className={cn(
                "h-14 bg-slate-50/80 border-none rounded-xl text-base font-medium focus-visible:ring-2 focus-visible:ring-slate-200 transition-all",
                hasError("lastName") && "bg-red-50 ring-2 ring-red-100",
              )}
            />
          </div>

          <div className="space-y-2.5">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Email Address *
            </Label>
            <Input
              type="email"
              value={data.email}
              onChange={(e) => onChange(index, "email", e.target.value)}
              placeholder="example@mail.com"
              disabled={isLead}
              className={cn(
                "h-14 bg-slate-50/80 border-none rounded-xl text-base font-medium focus-visible:ring-2 focus-visible:ring-slate-200 transition-all",
                hasError("email") && "bg-red-50 ring-2 ring-red-100",
              )}
            />
          </div>

          <div className="space-y-2.5">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Gender *
            </Label>
            <Select value={data.gender} onValueChange={handleGenderChange}>
              <SelectTrigger
                className={cn(
                  "h-14 bg-slate-50/80 border-none rounded-xl text-base font-medium",
                  hasError("gender") && "bg-red-50 ring-2 ring-red-100",
                )}
              >
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2.5 lg:col-span-1">
            <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Nationality *
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-14 justify-between bg-slate-50/80 border-none rounded-xl hover:bg-slate-100 font-medium text-base",
                    hasError("nationality") && "bg-red-50 ring-2 ring-red-100",
                  )}
                >
                  {data.nationality || "Select country"}
                  <ChevronsUpDown className="ml-2 h-5 w-5 shrink-0 opacity-40" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[320px] p-0 shadow-2xl border-none rounded-2xl overflow-hidden"
                align="start"
              >
                <Command>
                  <CommandInput
                    placeholder="Search nationality..."
                    className="h-12 border-none focus:ring-0"
                  />
                  <CommandList className="max-h-[300px]">
                    <CommandEmpty>No nationality found.</CommandEmpty>
                    <CommandGroup>
                      {nationalities.map((nationality) => (
                        <CommandItem
                          key={nationality.Code}
                          value={nationality.Name}
                          onSelect={(currentValue) => {
                            const newValue =
                              currentValue === data.nationality.toLowerCase()
                                ? ""
                                : nationality.Name;
                            handleNationalityChange(newValue);
                            setOpen(false);
                          }}
                          className="py-3 px-4 cursor-pointer"
                        >
                          <Check
                            className={cn(
                              "mr-3 h-4 w-4 text-emerald-500",
                              data.nationality === nationality.Name
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {nationality.Name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {isLead && (
          <div className="pt-10 space-y-12">
            <Separator className="bg-slate-100" />
            
            {/* Payment and Requests Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              {/* Payment Section */}
              {paymentType !== undefined && setPaymentType && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                      <CreditCard size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-[#0F172A]">
                        Payment Method
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        Secure transaction gateway
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
                      Select Provider
                    </Label>
                    <Select
                      value={paymentType}
                      onValueChange={setPaymentType}
                      disabled={paymentsLoading}
                    >
                      <SelectTrigger
                        className={cn(
                          "h-16 bg-slate-50/80 border-none rounded-2xl text-base font-semibold shadow-sm",
                          validationErrors["paymentType"] &&
                            "bg-red-50 ring-2 ring-red-100",
                        )}
                      >
                        <SelectValue
                          placeholder={
                            paymentsLoading
                              ? "Loading..."
                              : "Choose payment provider"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-slate-100">
                        {payments
                          .filter((p: any) => p.status === "active")
                          .map((payment: any) => (
                            <SelectItem
                              key={payment._id}
                              value={payment.kind}
                              className="py-4 px-4 font-medium"
                            >
                              {payment.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Special Requests Section */}
              {note !== undefined && setNote && (
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <MessageSquareQuote size={22} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black uppercase tracking-tight text-[#0F172A]">
                        Special Requests
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        Dietary or access needs
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2.5">
                     <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500 ml-1">
                      Your Message
                    </Label>
                    <Textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Notes on dietary requirements, accessibility, etc."
                      className="min-h-[140px] bg-slate-50/80 border-none rounded-2xl focus-visible:ring-2 focus-visible:ring-slate-200 resize-none p-6 text-base leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Button Area */}
            
          </div>
        )}
      </CardContent>
    </Card>
  );
}