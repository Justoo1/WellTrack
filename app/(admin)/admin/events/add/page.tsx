import EventAdd from '@/components/admin/AddEvent'
import QuickActions from '@/components/admin/QuickActions'
import { fetchUser } from '@/lib/actions/users.action'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

const AddEventPage = async () => {
    const { userId } = await auth()
    if(!userId) {
        redirect('/sign-in')
    }
    const data = await fetchUser(userId)
    if(!data.success ) {
        redirect('/sign-in')
    }

  return (
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
      <div className="mx-auto max-w-7xl lg:p-8 bg-white rounded-md shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Event</h2>
        <EventAdd userId={data.user!.id} />
      </div>
      <QuickActions />
    </main>
  )
}

export default AddEventPage