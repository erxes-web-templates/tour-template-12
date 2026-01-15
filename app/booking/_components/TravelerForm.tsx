"use client"

import React, { useState } from "react"
import { useQuery } from "@apollo/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { User, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { nationalities } from "@/lib/utils"
import paymentQueries from "@/graphql/payment/queries"

interface TravelerData {
  firstName: string
  lastName: string
  email: string
  gender: string
  nationality: string
}

interface TravelerFormProps {
  index: number
  data: TravelerData
  onChange: (index: number, field: keyof TravelerData, value: string) => void
  isLead?: boolean
  currentUser?: {
    firstName?: string
    lastName?: string
    email?: string
  }
  paymentType?: string
  setPaymentType?: (value: string) => void
  note?: string
  setNote?: (value: string) => void
  validationErrors?: { [key: string]: boolean }
}

export default function TravelerForm({
  index,
  data,
  onChange,
  isLead = false,
  currentUser,
  paymentType,
  setPaymentType,
  note,
  setNote,
  validationErrors = {},
}: TravelerFormProps) {
  const [open, setOpen] = useState(false)

  // Helper function to check if field has error
  const hasError = (field: string) => {
    return validationErrors[`${index}-${field}`] === true
  }

  // Fetch payment methods
  const { data: paymentsData, loading: paymentsLoading } = useQuery(
    paymentQueries.payments,
    {
      fetchPolicy: "cache-and-network",
    }
  )

  const payments = paymentsData?.payments || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <User className='h-5 w-5' />
          {isLead ? "Lead Traveler (You)" : `Traveler ${index + 1}`}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor={`firstName-${index}`}>
              First Name <span className='text-red-500'>*</span>
            </Label>
            <Input
              id={`firstName-${index}`}
              value={data.firstName}
              onChange={(e) => onChange(index, "firstName", e.target.value)}
              placeholder='John'
              required
              disabled={isLead}
              className={cn(
                hasError("firstName") &&
                  "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor={`lastName-${index}`}>
              Last Name <span className='text-red-500'>*</span>
            </Label>
            <Input
              id={`lastName-${index}`}
              value={data.lastName}
              onChange={(e) => onChange(index, "lastName", e.target.value)}
              placeholder='Doe'
              required
              disabled={isLead}
              className={cn(
                hasError("lastName") &&
                  "border-red-500 focus-visible:ring-red-500"
              )}
            />
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor={`email-${index}`}>
            Email <span className='text-red-500'>*</span>
          </Label>
          <Input
            id={`email-${index}`}
            type='email'
            value={data.email}
            onChange={(e) => onChange(index, "email", e.target.value)}
            placeholder='john.doe@example.com'
            required
            disabled={isLead}
            className={cn(
              hasError("email") && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {!isLead && (
            <p className='text-xs text-gray-500'>
              We'll check if this email exists in our system
            </p>
          )}
        </div>

        <div className='grid md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor={`gender-${index}`}>
              Gender <span className='text-red-500'>*</span>
            </Label>
            <Select
              value={data.gender}
              onValueChange={(value) => onChange(index, "gender", value)}
            >
              <SelectTrigger
                className={cn(hasError("gender") && "border-red-500")}
              >
                <SelectValue placeholder='Select gender' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='male'>Male</SelectItem>
                <SelectItem value='female'>Female</SelectItem>
                <SelectItem value='other'>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label htmlFor={`nationality-${index}`}>
              Nationality <span className='text-red-500'>*</span>
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  role='combobox'
                  aria-expanded={open}
                  className={cn(
                    "w-full justify-between",
                    hasError("nationality") && "border-red-500"
                  )}
                >
                  {data.nationality || "Select nationality..."}
                  <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-full p-0' align='start'>
                <Command>
                  <CommandInput placeholder='Search nationality...' />
                  <CommandList>
                    <CommandEmpty>No nationality found.</CommandEmpty>
                    <CommandGroup>
                      {nationalities.map((nationality) => (
                        <CommandItem
                          key={nationality}
                          value={nationality}
                          onSelect={(currentValue) => {
                            onChange(
                              index,
                              "nationality",
                              currentValue === data.nationality.toLowerCase()
                                ? ""
                                : nationality
                            )
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              data.nationality === nationality
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {nationality}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Payment Type and Note - Only for lead traveler */}
        {isLead && paymentType !== undefined && setPaymentType && (
          <>
            <Separator className='my-6' />

            <div className='space-y-4'>
              <h3 className='font-semibold text-lg'>
                Payment & Additional Information
              </h3>

              <div className='space-y-2'>
                <Label htmlFor='paymentType'>
                  Payment Type <span className='text-red-500'>*</span>
                </Label>
                <Select
                  value={paymentType}
                  onValueChange={setPaymentType}
                  disabled={paymentsLoading}
                >
                  <SelectTrigger
                    className={cn(
                      validationErrors["paymentType"] && "border-red-500"
                    )}
                  >
                    <SelectValue
                      placeholder={
                        paymentsLoading
                          ? "Loading payment methods..."
                          : "Select payment method"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {payments.length === 0 && !paymentsLoading ? (
                      <SelectItem value='default' disabled>
                        No payment methods available
                      </SelectItem>
                    ) : (
                      payments
                        .filter((payment: any) => payment.status === "active")
                        .map((payment: any) => (
                          <SelectItem key={payment._id} value={payment.kind}>
                            {payment.name}
                          </SelectItem>
                        ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {note !== undefined && setNote && (
                <div className='space-y-2'>
                  <Label htmlFor='note'>
                    Additional Information (Optional)
                  </Label>
                  <Textarea
                    id='note'
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder='Any special requests or additional information...'
                    rows={4}
                  />
                  <p className='text-xs text-gray-500'>
                    You can add dietary requirements, accessibility needs, or
                    any other special requests here.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
