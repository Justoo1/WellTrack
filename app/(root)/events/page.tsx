import Events from "@/components/shared/Events";
import { fetchAllEvents } from "@/lib/actions/events.actions";

const EventsPage = async () => {
  const events = await fetchAllEvents()

  if (events.error) {
    return (
      <div>
        <p>{events.error}</p>
      </div>
    )
  }else if (!events.events) {
    return (
      <div>
        <p>No events found</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Main Content */}
      <Events events={events.events}/>
    </div>
  )
}

export default EventsPage;
