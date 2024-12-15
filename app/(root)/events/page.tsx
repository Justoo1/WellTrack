import Events from "@/components/shared/Events";
import { fetchAllEventsForCalendar } from "@/lib/actions/events.actions";

const EventsPage = async () => {
  const data = await fetchAllEventsForCalendar()

  if (data.error) {
    return (
      <div>
        <p>{data.error}</p>
      </div>
    )
  }else if (!data.events) {
    return (
      <div>
        <p>No events found</p>
      </div>
    )
  }


  return (
    <div className="flex flex-col">
      {/* Main Content */}
      <Events events={data.events}/>
    </div>
  )
}

export default EventsPage;
