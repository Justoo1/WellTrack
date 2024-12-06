import React from 'react'
import { Card } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import UserAnalysis, { UserAnalysisProps } from '../admin/User-analysis'

const UsercardDetail = ({userData }: UserAnalysisProps) => {
    const currentMonthContributions = userData.contributions.filter(contribution => contribution.month.getMonth() === new Date().getMonth() && contribution.month.getFullYear() === new Date().getFullYear())[0];
    
    const initials = userData.name.split(' ').map(name => name.charAt(0).toUpperCase()).join('');
  return (
    <main className="flex-grow overflow-auto">
        <div className="mx-auto max-w-7xl p-4 space-y-6">
          <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="h-24 w-24 rounded-lg bg-zinc-800 uppercase flex justify-center items-center">
                <span className="text-white text-3xl border-2 border-red-500 rounded-full p-3">{initials}</span>
                </div>
                <div className="space-y-1">
                  <h1 className="text-xl font-bold text-white uppercase">{userData.name}</h1>
                  <div className="grid gap-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400">CURRENTMONTH:</span>
                      <span className="text-emerald-500 uppercase">{currentMonthContributions ?  "Paid": "Pending"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400">TOTAL MONTH:</span>
                      <span className="text-emerald-500">{userData.totalContributionMonths}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400">TOTAL AMOUNT:</span>
                      <span className="text-emerald-500">¢{userData.totalAmountContributed}.00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment History Table */}
              <Card className="bg-zinc-800/50 p-4">
                <div className="max-h-[300px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-zinc-700">
                        <TableHead className="text-zinc-400 text-xs">MONTH</TableHead>
                        <TableHead className="text-zinc-400 text-xs">STATUS</TableHead>
                        <TableHead className="text-zinc-400 text-xs">AMOUNT</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userData.contributions.map((contribution, index) => {
                        const month = new Date(contribution.month).toLocaleString('default', { month: 'long' })
                        return (
                            <TableRow key={index} className="border-zinc-700">
                          <TableCell className="text-white text-xs py-2 uppercase">{month}</TableCell>
                          <TableCell className="text-emerald-500 text-xs py-2">{contribution.status}</TableCell>
                          <TableCell className="text-white text-xs py-2">{contribution.amount}</TableCell>
                            </TableRow>
                        )
                        })}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </div>

            {/* Right Column */}
           <UserAnalysis userData={userData} className='flex col-span-1 bg-transparent text-white  w-full' />
          </div>
        </div>
      </main>
  )
}

export default UsercardDetail