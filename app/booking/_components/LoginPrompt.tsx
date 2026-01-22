"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogIn, AlertCircle, ArrowRight, UserPlus } from "lucide-react"
import Link from "next/link"

export const LoginPrompt: React.FC = () => {
  return (
    <div className='min-h-[80vh] flex items-center justify-center bg-gray-50/50 px-4 py-12'>
      <div className='w-full max-w-xl mx-auto'>
        {/* Арын чимэглэл (Background blob) */}
        <div className="absolute -z-10 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -top-10 -left-10" />
        <div className="absolute -z-10 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -bottom-10 -right-10" />

        <Card className="border-none shadow-2xl shadow-gray-200/50 rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-sm">
          <CardContent className='p-8 md:p-12'>
            <div className='text-center space-y-8'>
              
              {/* Icon хэсэг */}
              <div className='flex justify-center'>
                <div className='relative'>
                  <div className='absolute inset-0 bg-purple-400 rounded-3xl blur-xl opacity-30 animate-pulse' />
                  <div className='relative bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-3xl shadow-lg'>
                    <LogIn className='h-10 w-10 text-white' />
                  </div>
                </div>
              </div>

              {/* Текст хэсэг */}
              <div className="space-y-3">
                <h2 className='text-3xl font-black text-gray-900 tracking-tight'>
                  Welcome Back!
                </h2>
                <p className='text-gray-500 text-lg leading-relaxed'>
                  Please log in to your account to continue your journey and secure your booking.
                </p>
              </div>

              {/* Мэдэгдэл хэсэг */}
              <Alert className="bg-amber-50 border-amber-100 rounded-2xl py-4">
                <AlertCircle className='h-5 w-5 text-amber-600' />
                <AlertDescription className="text-amber-800 font-medium ml-2">
                  Don't have an account? No worries, registration is free and takes only a minute!
                </AlertDescription>
              </Alert>

              {/* Товчлуурнууд */}
              <div className='flex flex-col sm:flex-row gap-4 justify-center pt-4'>
                <Link href='/auth/login' className="w-full sm:w-auto">
                  <Button size='lg' className='w-full sm:px-10 h-14 rounded-2xl gap-2 text-base font-bold shadow-xl shadow-purple-200 bg-purple-600 hover:bg-purple-700 transition-all active:scale-95'>
                    <LogIn className='h-5 w-5' />
                    Login Now
                  </Button>
                </Link>
                
                <Link href='/auth/register' className="w-full sm:w-auto">
                  <Button size='lg' variant='outline' className='w-full sm:px-10 h-14 rounded-2xl gap-2 text-base font-bold border-2 hover:bg-gray-50 transition-all active:scale-95'>
                    <UserPlus className='h-5 w-5' />
                    Register
                  </Button>
                </Link>
              </div>

              {/* Footer санамж */}
              <div className="pt-6 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2 text-gray-400">
                  <ArrowRight className="h-4 w-4" />
                  <p className='text-sm font-medium'>
                    You'll be redirected back to the booking page
                  </p>
                </div>
              </div>
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}