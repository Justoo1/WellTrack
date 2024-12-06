'use client'

import { useState } from 'react'
import { Calendar, momentLocalizer, Event as CalendarEvent } from 'react-big-calendar'
import moment from 'moment'
import { Card } from '@/components/ui/card'

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment)

// Define the Event interface
interface Event extends CalendarEvent {
  id: number;
  type: string;
  title: string;
  start: Date;
  end: Date;
  description: string | null;
  location: string | null;
}

interface EventsProps {
  events: Event[]
}

const Events = ({events}: EventsProps) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event)
  }

  // Get upcoming events (next 3 events)
  const upcomingEvents = events
    .filter(event => event.start > new Date())
    .sort((a, b) => a.start.getTime() - b.start.getTime())
    .slice(0, 3)

  return (
      <main className="mx-auto max-w-7xl space-y-6">
          {/* Upcoming Events */}
          <Card className="bg-zinc-800/50 p-4">
            <h2 className="text-lg font-semibold text-white mb-3">Upcoming Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="bg-zinc-700 p-3">
                  <h3 className="text-sm font-semibold text-white">{event.title}</h3>
                  <p className="text-xs text-zinc-300">{moment(event.start).format('MMMM D, YYYY')}</p>
                </Card>
              ))}
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[1fr,400px]">
            {/* Calendar */}
            <Card className="bg-green-800/50 p-4">
              <Calendar<Event>
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                onSelectEvent={handleSelectEvent}
                className="text-red-500 bg-slate-700"
                views={['month', 'week', 'day', 'agenda']} 
                timeslots={1}
                defaultView="month"
                
              />
            </Card>

            {/* Event Details */}
            <Card className="bg-zinc-800/50 p-4">
              <h2 className="text-lg font-semibold text-white mb-3">Event Details</h2>
              {selectedEvent ? (
                <div className="space-y-2">
                  <h3 className="text-md font-semibold text-white">{selectedEvent.title}</h3>
                  <p className="text-sm text-zinc-300">
                    <strong>Date:</strong> {moment(selectedEvent.start).format('MMMM D, YYYY')}
                  </p>
                  <p className="text-sm text-zinc-300">
                    <strong>Time:</strong> {moment(selectedEvent.start).format('h:mm A')} - {moment(selectedEvent.end).format('h:mm A')}
                  </p>
                  <p className="text-sm text-zinc-300">
                    <strong>Location:</strong> {selectedEvent.location}
                  </p>
                  <p className="text-sm text-zinc-300">{selectedEvent.description}</p>
                </div>
              ) : (
                <p className="text-sm text-zinc-400">Select an event to view details</p>
              )}
            </Card>
          </div>

      </main>
  )
}

export default Events;
