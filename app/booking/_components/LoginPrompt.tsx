import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LogIn, AlertCircle } from "lucide-react"
import Link from "next/link"

export const LoginPrompt: React.FC = () => {
  return (
    <div className='container mx-auto p-4 md:p-6 lg:p-8'>
      <div className='max-w-2xl mx-auto'>
        <Card>
          <CardContent className='pt-6'>
            <div className='text-center space-y-4'>
              <div className='flex justify-center'>
                <div className='bg-emerald-100 p-4 rounded-full'>
                  <LogIn className='h-12 w-12 text-emerald-600' />
                </div>
              </div>
              <h2 className='text-2xl font-bold'>Login Required</h2>
              <p className='text-gray-600'>
                Please log in to your account to continue with your booking.
              </p>
              <Alert>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  You need to be logged in to book a tour. Don't have an
                  account? You can register for free!
                </AlertDescription>
              </Alert>
              <div className='flex gap-3 justify-center pt-4'>
                <Link href='/auth/login'>
                  <Button size='lg' className='gap-2'>
                    <LogIn className='h-4 w-4' />
                    Login
                  </Button>
                </Link>
                <Link href='/auth/register'>
                  <Button size='lg' variant='outline'>
                    Register
                  </Button>
                </Link>
              </div>
              <p className='text-xs text-gray-500'>
                You'll be redirected back to this page after logging in.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
