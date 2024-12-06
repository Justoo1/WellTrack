import AllEvents from '@/components/admin/Events'
import QuickActions from '@/components/admin/QuickActions'
import { fetchAllEvents } from '@/lib/actions/events.actions'

const EventsPage = async () => {
    const data = await fetchAllEvents()

    if (!data.success) {
        return <div>Error: {data.error}</div>
    }
    else if (!data.events) {
        return <div>No users found</div>
    }

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
      <AllEvents events={data.events!} />
      <QuickActions />
    </main>
  )
}

export default EventsPage;