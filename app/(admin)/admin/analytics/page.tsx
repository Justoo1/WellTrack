import Analytics from '@/components/admin/Analytics'
import { IncomeVsExpense } from '@/lib/actions/contribution'
import React from 'react'

const AnalyticsPage = async () => {
  const data = await IncomeVsExpense()
  if (data.error) return <div>{data.error}</div>  

  return (
    <Analytics incomeVsExpenses={data.incomeVsExpenses} monthlyContributions={data.monthlyContributions} />
  )
}

export default AnalyticsPage