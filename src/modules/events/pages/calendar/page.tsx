"use client"

import { useState } from "react"
import { EventCalendar } from "@/modules/events/components/event-calendar"
import { MOCK_EVENTS } from "@/mocks/calendar";
import type { CalendarEvent } from "@/types/calendar"
import { Content } from '@/layout/components/content';

export default function CalendarPage() {
    const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS)

    const handleEventAdd = (event: CalendarEvent) => {
        setEvents([...events, event])
    }

    const handleEventUpdate = (updatedEvent: CalendarEvent) => {
        setEvents(
            events.map((event) =>
                event.id === updatedEvent.id ? updatedEvent : event
            )
        )
    }

    const handleEventDelete = (eventId: string) => {
        setEvents(events.filter((event) => event.id !== eventId))
    }

    return (
        <div className="container-fluid">
            <Content className="block space-y-6 py-5">
                <EventCalendar
                    events={events}
                    onEventAdd={handleEventAdd}
                    onEventUpdate={handleEventUpdate}
                    onEventDelete={handleEventDelete}
                />
            </Content>
        </div>
    )
}
