'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserValues } from '@/lib/validation'
import { Trash2Icon } from 'lucide-react'
import { deleteUser, revalidateUserPath } from '@/lib/actions/users.action'
import { Button } from '../ui/button'
import { useToast } from '@/hooks/use-toast'

interface EmployeesProps {
    employees: UserValues[]
}

const Employees = ({employees}: EmployeesProps) => {
    const [searchTerm, setSearchTerm] = useState('')
    const { toast } = useToast()

  const filteredRecords = employees.filter(record =>
    record.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete =  async (id: string | undefined) => {
    if (!id) return
    const deleted = await deleteUser(id)
    if (deleted.success) {
      revalidateUserPath('/admin/employees')
    }else{
      toast({
        variant: 'destructive',
        title: 'Error',
        description: deleted.error,
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Employee</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee Name</TableHead>
              <TableHead>Total Contribution</TableHead>
              <TableHead>Total Months</TableHead>
              {/* <TableHead>Date</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.totalAmountContributed}</TableCell>
                <TableCell>{record.totalContributionMonths}</TableCell>
                <TableCell>
                 
                  <Button asChild size='icon' onClick={() => {
                    handleDelete(record.id)
                  }} className='bg-transparent hover:bg-red-600 cursor-pointer'>
                    <Trash2Icon className="size-10 text-red-600 hover:text-white" />
                  </Button>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default Employees