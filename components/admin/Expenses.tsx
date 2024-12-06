"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { ExpenseValue } from '@/lib/validation'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { PenBoxIcon, Trash2Icon } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import AddExpensesPage from './AddExpenses'
import { deleteExpense } from '@/lib/actions/expenses'

interface ExpensesProps {
    expenses: ExpenseValue[]
}

const Expenses = ({expenses}: ExpensesProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const { toast } = useToast()

  const filteredRecords = expenses.filter(record =>{

      const monthName = record.date.toLocaleString('default', { month: 'long' }).toLowerCase(); // Full month name
      const monthNumber = (record.date.getMonth() + 1).toString(); // Numeric month (1-12)
      return (
            record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.status.toLowerCase().includes(searchTerm.toLowerCase()) || 
            monthName.includes(searchTerm.toLowerCase()) || // Match full month name
            monthNumber.includes(searchTerm.toLowerCase()) // Match month number
      )
  })
  

  const handleDelete =  async (id: number | undefined) => {
    if (!id) return
    const deleted = await deleteExpense(id)
    if (deleted.success) {
    //   revalidateUserPath('/admin/expenses')
    toast({
        title: 'Deleted',
        description: "Successfully deleted expense",
      })
    }else{
      toast({
        variant: 'destructive',
        title: 'Error',
        description: deleted.error,
      })
    }
  }

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
        <div className="mx-auto max-w-7xl lg:p-8 bg-white rounded-md shadow-sm">
        <Card className="w-full">
      <CardHeader>
        <CardTitle>Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Search by type or status or month"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Descriptions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.type}</TableCell>
                <TableCell>{record.amount}</TableCell>
                <TableCell>{formatDateTime(record.date).dateOnly}</TableCell>
                <TableCell>{record.description}</TableCell>
                <TableCell>
                    <Popover>
                        <PopoverTrigger asChild className='text-green-600'>
                            <Button asChild size='icon' className='bg-transparent hover:bg-green-600 cursor-pointer'>
                                <PenBoxIcon className="size-6 text-green-600 hover:text-white" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-96 flex justify-center items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-md shadow-lg p-4 overflow-auto">
                            <AddExpensesPage employees={[{ id: record.user!.id!, name: record.user!.name }]} expense={record} hideRemoveButton hideAddButton update expenseId={record.id} />
                        </PopoverContent>
                    </Popover>
                  <Button asChild size='icon' onClick={() => {
                    handleDelete(record.id)
                  }} className='bg-transparent hover:bg-red-600 cursor-pointer'>
                    <Trash2Icon className="size-6 text-red-600 hover:text-white" />
                  </Button>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
        </div>
    </main>
  )
}

export default Expenses