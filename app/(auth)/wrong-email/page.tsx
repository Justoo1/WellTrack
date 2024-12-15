"use client"

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

const WrongEmailUsed = () => {
    const router = useRouter()
    const handleClick = () => {
        router.replace("/sign-in")
    }
  return (
    <div className='min-h-screen flex flex-col w-full bg-[#0D0D0D] justify-center items-center max-w-7xl mx-auto space-y-5'>
        <h1 className='text-center text-2xl text-white'>Wrong Email Used, Please use your organization mail.</h1>
        <Button className='text-blue-50 text-2xl p-4 py-6 animate-pulse' onClick={handleClick}>
            Go to Sign In Page
        </Button>
    </div>
  )
}

export default WrongEmailUsed