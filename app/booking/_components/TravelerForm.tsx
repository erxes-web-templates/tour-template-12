"use client"

import React, { useState } from "react"
import { useQuery, useMutation } from "@apollo/client"
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
import { mutations as customerMutations } from "@/graphql/customer"
import { mutations as kbMutations } from "@/graphql/kb"
import { useFindOrCreateCustomer } from "@/hooks/useFindOrCreateCustomer"

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
    erxesCustomerId?: string
  }
  customerId?: string 
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
  customerId,
  paymentType,
  setPaymentType,
  note,
  setNote,
  validationErrors = {},
}: TravelerFormProps) {
  const [open, setOpen] = useState(false)

  const hasError = (field: string) => {
    return validationErrors[`${index}-${field}`] === true
  }

  const { data: paymentsData, loading: paymentsLoading } = useQuery(
    paymentQueries.payments,
    {
      fetchPolicy: "cache-and-network",
    }
  )

  const payments = paymentsData?.payments || []

  // Mutations
  const [updateCustomer] = useMutation(customerMutations.editCustomer)
  const [saveBrowserInfo] = useMutation(kbMutations.saveBrowserInfo)
  
  // Hook to find or create customer (search first, then create if not found)
  const { handleFindOrCreateCustomer } = useFindOrCreateCustomer()

  // State to store found/created customer ID for non-lead travelers
  const [createdCustomerId, setCreatedCustomerId] = useState<string | null>(
    null
  )

  // Handle gender change for lead traveler
  const handleGenderChange = async (value: string) => {
    onChange(index, "gender", value)

    if (isLead && currentUser?.erxesCustomerId) {
      try {
        const sexValue = value === "male" ? 1 : value === "female" ? 2 : 0

        await updateCustomer({
          variables: {
            _id: currentUser.erxesCustomerId,
            sex: sexValue,
          },
        })
      } catch (error) {
        console.error("Failed to update customer gender:", error)
      }
    }
  }

  // Handle nationality change for all travelers
  const handleNationalityChange = async (nationalityName: string) => {
    onChange(index, "nationality", nationalityName)

    // Find the nationality object to get the code
    const selectedNationality = nationalities.find(
      (nat) => nat.Name === nationalityName
    )

    if (!selectedNationality) return

    try {
      // Get customer ID
      let targetCustomerId = isLead
        ? currentUser?.erxesCustomerId
        : customerId || createdCustomerId

      // If no customer ID exists for non-lead traveler, find or create customer
      // This will search by email first, then create if not found
      if (!isLead && !targetCustomerId && data.firstName && data.lastName && data.email) {
        targetCustomerId = await handleFindOrCreateCustomer({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          gender: data.gender,
        })

        if (targetCustomerId) {
          setCreatedCustomerId(targetCustomerId)
        }
      }

      // Save nationality to customer location
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
        })
      }
    } catch (error) {
      console.error("Failed to save nationality:", error)
    }
  }

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
              onValueChange={handleGenderChange}
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
                          key={nationality.Code}
                          value={nationality.Name}
                          onSelect={(currentValue) => {
                            const newValue =
                              currentValue === data.nationality.toLowerCase()
                                ? ""
                                : nationality.Name
                            handleNationalityChange(newValue)
                            setOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              data.nationality === nationality.Name
                                ? "opacity-100"
                                : "opacity-0"
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
