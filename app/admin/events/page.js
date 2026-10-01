"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import Modal, { ConfirmDialog } from "@/components/ui/Modal";
import EventCard from "@/components/EventCard";
import FormField, { inputClass } from "@/components/admin/FormField";

const empty = {
  title: "",
  description: "",
  date: "",
  time: "",
  venue: "",
  image: "",
};

function formatDateInput(date) {
  return new Date(date).toISOString().slice(0, 10);
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = dateFilter ? `?date=${dateFilter}` : "";
    const res = await fetch(`/api/admin/events${params}`);
    setEvents(await res.json());
    setLoading(false);
  }, [dateFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const upcoming = events.filter((e) => new Date(e.date) >= today);

  function openAdd() {
    setEditId(null);
    setForm(empty);
    setModalOpen(true);
  }

  function openEdit(event) {
    setEditId(event.id);
    setForm({
      title: event.title,
      description: event.description,
      date: formatDateInput(event.date),
      time: event.time,
      venue: event.venue,
      image: event.image || "",
    });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const url = editId ? `/api/admin/events/${editId}` : "/api/admin/events";
    const method = editId ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setModalOpen(false);
    load();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setSaving(true);
    await fetch(`/api/admin/events/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    setSaving(false);
    load();
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Events</h1>
        <Button onClick={openAdd}>Add Event</Button>
      </div>
      <FormField label="Filter by date">
        <input type="date" className={`${inputClass} max-w-xs mt-1`} value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} />
      </FormField>

      <h2 className="mt-8 text-lg font-semibold">Upcoming Events</h2>
      {loading ? (
        <Loading />
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((event) => (
            <div key={event.id}>
              <EventCard event={event} showView={false} />
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => openEdit(event)}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => setDeleteTarget(event)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
          {upcoming.length === 0 && <p className="text-slate-500">No upcoming events.</p>}
        </div>
      )}

      <h2 className="mt-10 text-lg font-semibold">All Events</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Venue</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {events.map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-3">{e.title}</td>
                <td className="px-4 py-3">{formatDateInput(e.date)}</td>
                <td className="px-4 py-3">{e.venue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Event" : "Add Event"}>
        <form onSubmit={handleSave} className="space-y-3">
          <FormField label="Event name" required>
            <input required className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </FormField>
          <FormField label="Description" required>
            <textarea required rows={3} className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Date" required>
              <input type="date" required className={inputClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </FormField>
            <FormField label="Time" required>
              <input required className={inputClass} placeholder="10:00 AM" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Venue" required>
            <input required className={inputClass} value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
          </FormField>
          <FormField label="Image URL">
            <input className={inputClass} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </FormField>
          <Button type="submit" loading={saving} className="w-full">
            Save
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Event"
        message="Are you sure you want to delete this event?"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={saving}
        confirmLabel="Delete"
      />
    </div>
  );
}
