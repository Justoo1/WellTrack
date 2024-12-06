'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/ui/date-picker"
import { getFinancialSummary } from '@/lib/actions/report.actions'
import { ChartContainer } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import ExcelJS from 'exceljs';
import { ChartConfiguration } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { LoaderIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import QuickActions from '@/components/admin/QuickActions'

/* eslint-disable */

interface FinancialSummary {
  contributions: { year: number; month: Date; _sum: { amount: number } }[];
  expenses: { date: Date; _sum: { amount: number } }[];
  events: { type: string; year: number; month: number; _count: { id: number } }[];
  totalContribution: number;
  totalExpenses: number;
}

const COLORS = ['hsl(var(--chart-2))', 'hsl(var(--chart-1))'];

export default function Reports() {
  const [reportType, setReportType] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [financialData, setFinancialData] = useState<FinancialSummary | null>(null)

  useEffect(() => {
    async function fetchFinancialData() {
      if (startDate && endDate) {
        const data = await getFinancialSummary(startDate, endDate)
        setFinancialData(data)
      }
    }
    fetchFinancialData()
  }, [startDate, endDate])

  // const generateReport = () => {
  //   if (!financialData || !startDate || !endDate) return

  //   const monthNames = [
  //     'January', 'February', 'March', 'April', 'May', 'June',
  //     'July', 'August', 'September', 'October', 'November', 'December'
  //   ]

  //   // Create a map of all months in the date range
  //   const monthMap = new Map()
  //   let currentDate = new Date(startDate)
  //   while (currentDate <= endDate) {
  //     const key = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`
  //     monthMap.set(key, {
  //       Date: `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
  //       'Total Contributions': 0,
  //       'Total Expenses': 0,
  //       'Net Amount': 0,
  //       'Events': 0
  //     })
  //     currentDate.setMonth(currentDate.getMonth() + 1)
  //   }

  //   // Fill in the contribution data
  //   financialData.contributions.forEach(contribution => {
  //     const key = `${contribution.year}-${contribution.month.getMonth() + 1}`
  //     if (monthMap.has(key)) {
  //       const monthData = monthMap.get(key)
  //       monthData['Total Contributions'] += contribution._sum.amount
  //       monthData['Net Amount'] += contribution._sum.amount
  //     }
  //   })

  //   // Fill in the expense data
  //   financialData.expenses.forEach(expense => {
  //     const key = `${expense.date.getFullYear()}-${expense.date.getMonth() + 1}`
  //     if (monthMap.has(key)) {
  //       const monthData = monthMap.get(key)
  //       monthData['Total Expenses'] += expense._sum.amount
  //       monthData['Net Amount'] -= expense._sum.amount
  //     }
  //   })

  //   // Fill in the event data
  //   financialData.events.forEach(event => {
  //     const key = `${event.year}-${event.month}`
  //     if (monthMap.has(key)) {
  //       const monthData = monthMap.get(key)
  //       monthData['Events'] += event._count.id
  //     }
  //   })

  //   const summaryData = Array.from(monthMap.values())

  //   const overallSummary = [
  //     { 'Summary': 'Overall Amount Contributed', 'Value': financialData.totalContribution },
  //     { 'Summary': 'Overall Expenses', 'Value': financialData.totalExpenses },
  //     { 'Summary': 'Total Contribution Remaining', 'Value': financialData.totalContribution - financialData.totalExpenses },
  //     { 'Summary': 'Total Events', 'Value': financialData.events.reduce((sum, event) => sum + event._count.id, 0) }
  //   ]

  //   const wb = XLSX.utils.book_new()
    
  //   // Monthly Summary Sheet
  //   const ws = XLSX.utils.json_to_sheet(summaryData)
  //   XLSX.utils.book_append_sheet(wb, ws, "Monthly Summary")

  //   // Overall Summary Sheet with embedded pie chart
  //   const overallWs = XLSX.utils.json_to_sheet(overallSummary)
  //   XLSX.utils.book_append_sheet(wb, overallWs, "Overall Summary")

  //   // Add pie chart to Overall Summary sheet
  //   const pieChartData = [
  //     ['Category', 'Amount'],
  //     ['Total Contributions', financialData.totalContribution],
  //     ['Total Expenses', financialData.totalExpenses]
  //   ]
  //   XLSX.utils.sheet_add_aoa(overallWs, pieChartData, { origin: 'A7' })

  //   const pieChartOptions = {
  //     type: 'pie',
  //     series: [
  //       {
  //         name: 'Financial Overview',
  //         categories: 'Overall Summary!$A$8:$A$9',
  //         values: 'Overall Summary!$B$8:$B$9'
  //       }
  //     ],
  //     title: { name: 'Total Contributions vs Total Expenses' },
  //     plotarea: { layout: 'vertical' },
  //     legend: { position: 'right', layout: 'vertical' },
  //     dataLabels: { showValue: true, showPercent: true, showCategory: true }
  //   }
  //   if (!overallWs['!charts']) overallWs['!charts'] = []
  //   overallWs['!charts'].push({ type: 'pie', chartOptions: pieChartOptions, position: { from: { col: 4, row: 6 } } })

  //   XLSX.writeFile(wb, `financial_summary_report_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}.xlsx`)
  // }

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
      const key = `${contribution.year}-${contribution.month.getMonth() + 1}`;
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
  
    // Generate a pie chart using chartjs-node-canvas
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width: 800, height: 600 });
    const chartConfig: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: ['Total Contributions', 'Total Expenses'],
        datasets: [
          {
            data: [financialData.totalContribution, financialData.totalExpenses],
            backgroundColor: ['#36A2EB', '#FF6384'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: 'Total Contributions vs Total Expenses' },
        },
      },
    };
  
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const chartBuffer = await chartJSNodeCanvas.renderToBuffer(chartConfig);
  
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
  
    // Embed the chart image into the Overall Summary sheet
    const imageId = workbook.addImage({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      buffer: Buffer.from(chartBuffer),
      extension: 'png',
    });
  
    overallSummarySheet.addImage(imageId, {
      tl: { col: 0, row: overallSummary.length + 2 },
      ext: { width: 500, height: 300 },
    });
  
    // Export the workbook to a file
    const fileName = `financial_summary_report_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}.xlsx`;
    await workbook.xlsx.writeFile(fileName);
  
    console.log(`Report generated: ${fileName}`);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
  }

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
                // id="startDate"
                selected={startDate}
                onSelect={setStartDate}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <DatePicker
                // id="endDate"
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
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Contributions', value: financialData.totalContribution },
                        { name: 'Expenses', value: financialData.totalExpenses },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
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

