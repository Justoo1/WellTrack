'use client'

import React from 'react'
import { Card } from '../ui/card'
import Image from 'next/image'
import { UserAnalysisProps } from '../admin/User-analysis'
import { Manrope } from 'next/font/google'
import { cn } from '@/lib/utils'

const manrope = Manrope({ 
    subsets: ["latin"], 
    weight: ["200","300", "400", "500", "600", "700"]
  })

const UserCard = ({ userData }: UserAnalysisProps ) => {
    const currentMonthContributions = userData.contributions.filter(contribution => contribution.month.getMonth() === new Date().getMonth() && contribution.month.getFullYear() === new Date().getFullYear())[0];
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    
  return (
    <Card className={cn("relative aspect-[1.6/1] bg-transparent border-none overflow-hidden")}>
        <Image
            src="/assets/images/debit-card.png"
            alt="Card Background"
            fill
            className="object-cover"
        />
        <div className="z-10">
            <div className="absolute right-2 top-2 md:right-14 lg:right-5 xl:right-14 md:top-8 lg:top-3 xl:top-8 z-20">
                <div className="flex items-center justify-center gap-2 text-gray-50">
                    <div className="flex flex-col uppercase">
                        <h1 className='text-4xl font-bold tracking-[0.18em]'>DAWF</h1>
                        <p className='text-sm tracking-normal md:tracking-wide'>Devops Africa LTD <br /> Welfare Found</p>
                    </div>
                    <Image
                        src="/assets/images/logo.png"
                        alt="DAWF Logo"
                        width={400}
                        height={400}
                        className="object-contain size-20 md:size-24 lg:size-20 xl:size-24"
                    />
                </div>
            </div>
        <div className={cn("absolute z-40 bottom-2 left-3 right-2 md:bottom-20 lg:bottom-6 xl:bottom-10 md:left-16 lg:left-8 xl:left-10 md:right-16 lg:right-8 xl:right-16", manrope.className)}>
            <h2 className="mb-4 text-2xl font-bold tracking-wider text-white text-shadow uppercase">
            {userData.name}
            </h2>
            <div className="flex justify-between text-sm">
            <div>
                <span className="text-zinc-400">CURRENT MONTH: </span>
                <span className="text-emerald-500">{currentMonth}</span>
            </div>
            <div>
                <span className="text-zinc-400">DUES OWED: </span>
                <span className="text-emerald-500">
                    {currentMonthContributions ? "paid": "Pending"}
                </span>
            </div>
            </div>
        </div>
        </div>
    </Card>
  )
}

export default UserCard