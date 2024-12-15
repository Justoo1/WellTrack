"use client"

import { EventValues } from '@/lib/validation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { PenBoxIcon, Trash2Icon } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { deleteEvent } from '@/lib/actions/events.actions'
import EventAdd from './AddEvent'

interface Props {
    events: EventValues[]
}

const AllEvents = ({ events }: Props) => {
    const [searchTerm, setSearchTerm] = useState('')
    const { toast } = useToast()

  const filteredRecords = events.filter(record =>{

      const monthName = record.start.toLocaleString('default', { month: 'long' }).toLowerCase(); // Full month name
      const monthNumber = (record.start.getMonth() + 1).toString(); // Numeric month (1-12)
      return (
            record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.status.toLowerCase().includes(searchTerm.toLowerCase()) || 
            monthName.includes(searchTerm.toLowerCase()) || // Match full month name
            monthNumber.includes(searchTerm.toLowerCase()) // Match month number
      )
  })
  

  const handleDelete =  async (id: string | undefined) => {
    if (!id) return
    const deleted = await deleteEvent(id)
    if (deleted.success) {
        toast({
            title: 'Deleted',
            description: "Successfully deleted event",
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
        <CardTitle>Events</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Search by title or status or type"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Start At</TableHead>
              <TableHead>End At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.type}</TableCell>
                <TableCell>{record.title}</TableCell>
                <TableCell>{record.location}</TableCell>
                <TableCell>{formatDateTime(record.start).dateOnly}</TableCell>
                <TableCell>{formatDateTime(record.end).dateOnly}</TableCell>
                <TableCell>
                    <Popover>
                        <PopoverTrigger asChild className='text-green-600'>
                            <Button asChild size='icon' className='bg-transparent hover:bg-green-600 cursor-pointer'>
                                <PenBoxIcon className="size-6 text-green-600 hover:text-white" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[30rem] flex justify-center items-center fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-md shadow-lg p-4 overflow-auto">
                            <EventAdd  event={record} update userId={record.userId} />
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

export default AllEvents