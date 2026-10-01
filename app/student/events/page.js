"use client";

import { useEffect, useState } from "react";
import EventCard from "@/components/EventCard";
import Loading from "@/components/ui/Loading";
import Modal from "@/components/ui/Modal";

export default function StudentEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch("/api/events")
      .then((r) => r.json())
      .then(setEvents)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold">Upcoming Events</h1>
        <Loading label="Loading events..." />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Upcoming Events</h1>
      {events.length === 0 && (
        <p className="mt-4 text-slate-500">No upcoming events at the moment.</p>
      )}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event.id} onClick={() => setSelected(event)} className="cursor-pointer">
            <EventCard event={event} showView={false} />
          </div>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.title || "Event"}>
        {selected && (
          <div className="space-y-2 text-sm text-slate-700">
            <p>{selected.description}</p>
            <p>
              <strong>Date:</strong> {new Date(selected.date).toLocaleDateString()}
            </p>
            <p>
              <strong>Time:</strong> {selected.time}
            </p>
            <p>
              <strong>Venue:</strong> {selected.venue}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
