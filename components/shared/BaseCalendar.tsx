import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventClickArg, EventHoveringArg, EventInput } from '@fullcalendar/core'
import { Card } from '@/components/ui/card'

interface BaseCalendarProps {
  events: EventInput[]
  onEventClick?: (clickInfo: EventClickArg) => void
  editable: boolean
  selectable: boolean
  onMouseEnter?: (arg: EventHoveringArg) => void
  onMouseLeave?: (arg: EventHoveringArg) => void
}

const BaseCalendar: React.FC<BaseCalendarProps> = ({ events, onEventClick, editable, selectable, onMouseEnter, onMouseLeave }) => {
  return (
    <Card className="bg-zinc-800/50 p-4 text-white">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        initialView="dayGridMonth"
        editable={editable}
        selectable={selectable}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        events={events!.map((event) => ({
            id: event.id,
            title: event.title,
            start: event.start ?? new Date(), // Replace null with a default date
            end: event.end ?? new Date(),
          }))}
        eventClick={onEventClick}
        eventColor='green'
        height="auto"
        contentHeight="auto"
        eventMouseEnter={onMouseEnter}
        eventMouseLeave={onMouseLeave}
      />
    </Card>
  )
}

export default BaseCalendar

