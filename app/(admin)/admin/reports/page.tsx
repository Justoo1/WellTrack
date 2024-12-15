'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { getFinancialSummary } from '@/lib/actions/report.actions'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { LoaderIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import QuickActions from '@/components/admin/QuickActions'
import ExcelJS from 'exceljs'

interface FinancialSummary {
  contributions: { year: number; month: number; _sum: { amount: number } }[];
  expenses: { date: Date; _sum: { amount: number } }[];
  events: { type: string; year: number; month: number; _count: { id: number } }[];
  totalContribution: number;
  totalExpenses: number;
}

export default function Reports() {
  const [reportType, setReportType] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [financialData, setFinancialData] = useState<FinancialSummary | null>(null)

  useEffect(() => {
    async function fetchFinancialData() {
      if (startDate && endDate) {
        const data = await getFinancialSummary(startDate, endDate)
        console.log("data", data)
        setFinancialData(data)
      }
    }
    fetchFinancialData()
  }, [startDate, endDate])

  const generateReport = async () => {
    if (!financialData || !startDate || !endDate) return;
  
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
  
    // Create a map of all months in the date range
    const monthMap = new Map();
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const key = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
      monthMap.set(key, {
        Date: `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
        'Total Contributions': 0,
        'Total Expenses': 0,
        'Net Amount': 0,
        Events: 0,
      });
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  
    // Fill in financial data
    financialData.contributions.forEach((contribution) => {
      const key = `${contribution.year}-${contribution.month}`;
      if (monthMap.has(key)) {
        const monthData = monthMap.get(key);
        monthData['Total Contributions'] += contribution._sum.amount;
        monthData['Net Amount'] += contribution._sum.amount;
      }
    });
  
    financialData.expenses.forEach((expense) => {
      const key = `${expense.date.getFullYear()}-${expense.date.getMonth() + 1}`;
      if (monthMap.has(key)) {
        const monthData = monthMap.get(key);
        monthData['Total Expenses'] += expense._sum.amount;
        monthData['Net Amount'] -= expense._sum.amount;
      }
    });
  
    financialData.events.forEach((event) => {
      const key = `${event.year}-${event.month}`;
      if (monthMap.has(key)) {
        const monthData = monthMap.get(key);
        monthData.Events += event._count.id;
      }
    });
  
    const summaryData = Array.from(monthMap.values());
  
    const overallSummary = [
      { Summary: 'Overall Amount Contributed', Value: financialData.totalContribution },
      { Summary: 'Overall Expenses', Value: financialData.totalExpenses },
      { Summary: 'Total Contribution Remaining', Value: financialData.totalContribution - financialData.totalExpenses },
      { Summary: 'Total Events', Value: financialData.events.reduce((sum, event) => sum + event._count.id, 0) },
    ];
  
    // Create an Excel workbook
    const workbook = new ExcelJS.Workbook();
  
    // Monthly Summary Sheet
    const monthlySummarySheet = workbook.addWorksheet('Monthly Summary');
    monthlySummarySheet.columns = Object.keys(summaryData[0]).map((key) => ({ header: key, key }));
    summaryData.forEach((data) => monthlySummarySheet.addRow(data));
  
    // Overall Summary Sheet
    const overallSummarySheet = workbook.addWorksheet('Overall Summary');
    overallSummarySheet.columns = Object.keys(overallSummary[0]).map((key) => ({ header: key, key }));
    overallSummary.forEach((data) => overallSummarySheet.addRow(data));
  
    // Export the workbook to a file
    const fileName = `financial_summary_report_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}.xlsx`;
    await workbook.xlsx.writeFile(fileName);
  
    console.log(`Report generated: ${fileName}`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

  // Prepare data for the shadcn chart
  const chartData = financialData ? [
    { 
      category: 'Contributions', 
      amount: financialData.totalContribution,
      fill: 'var(--chart-2)'
    },
    { 
      category: 'Expenses', 
      amount: financialData.totalExpenses,
      fill: 'var(--chart-1)'
    }
  ] : [];

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Generate Financial Summary Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">Report Type</label>
              <Select name="reportType" value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="financial_summary">Financial Summary</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
              <DatePicker
                selected={startDate}
                onSelect={setStartDate}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <DatePicker
                selected={endDate}
                onSelect={setEndDate}
                className="w-full"
              />
            </div>
            <Button 
              onClick={generateReport} 
              disabled={!reportType || !startDate || !endDate || !financialData} 
              className="w-full"
            >
              <LoaderIcon className={cn("mr-2 h-4 w-4 animate-spin", financialData && "hidden")} />
              Generate and Export Report
            </Button>
          </div>
          {financialData && (
            <div className="mt-8 flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold mb-4">Financial Overview</h3>
              <ChartContainer 
                config={{
                  contributions: {
                    label: "Contributions",
                    color: "hsl(var(--chart-2))",
                  },
                  expenses: {
                    label: "Expenses",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px] w-full"
              >
                <BarChart data={chartData}>
                  <XAxis 
                    dataKey="category" 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => formatCurrency(value)} 
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar 
                    dataKey="amount" 
                    fill="var(--color)" 
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ChartContainer>
              <div className="mt-4 text-sm">
                <p>Total Contributions: {formatCurrency(financialData.totalContribution)}</p>
                <p>Total Expenses: {formatCurrency(financialData.totalExpenses)}</p>
                <p>Net Amount: {formatCurrency(financialData.totalContribution - financialData.totalExpenses)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <QuickActions />
    </main>
  )
}