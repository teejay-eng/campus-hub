"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import Modal, { ConfirmDialog } from "@/components/ui/Modal";
import HostelCard from "@/components/HostelCard";
import FormField, { inputClass } from "@/components/admin/FormField";

const empty = {
  name: "",
  location: "",
  capacity: "",
  availableSpaces: "",
  gender: "MIXED",
  description: "",
};

export default function AdminHostelsPage() {
  const [hostels, setHostels] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = q ? `?q=${encodeURIComponent(q)}` : "";
    const res = await fetch(`/api/admin/hostels${params}`);
    setHostels(await res.json());
    setLoading(false);
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setEditId(null);
    setForm(empty);
    setModalOpen(true);
  }

  function openEdit(h) {
    setEditId(h.id);
    setForm({
      name: h.name,
      location: h.location,
      capacity: String(h.capacity),
      availableSpaces: String(h.availableSpaces),
      gender: h.gender,
      description: h.description,
    });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const url = editId ? `/api/admin/hostels/${editId}` : "/api/admin/hostels";
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
    await fetch(`/api/admin/hostels/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    setSaving(false);
    load();
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Hostels</h1>
        <Button onClick={openAdd}>Add Hostel</Button>
      </div>
      <input
        className={`${inputClass} mt-4 max-w-md`}
        placeholder="Search name or location..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {loading ? (
        <Loading />
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {hostels.map((h) => (
            <div key={h.id} className="relative">
              <HostelCard hostel={h} />
              <div className="mt-2 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => openEdit(h)}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => setDeleteTarget(h)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Hostel" : "Add Hostel"}>
        <form onSubmit={handleSave} className="space-y-3">
          {["name", "location"].map((field) => (
            <FormField key={field} label={field === "name" ? "Name" : "Location"} required>
              <input required className={inputClass} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
            </FormField>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Capacity" required>
              <input type="number" required className={inputClass} value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} />
            </FormField>
            <FormField label="Available Spaces" required>
              <input type="number" required className={inputClass} value={form.availableSpaces} onChange={(e) => setForm({ ...form, availableSpaces: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Gender" required>
            <select className={inputClass} value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="MIXED">Mixed</option>
            </select>
          </FormField>
          <FormField label="Description" required>
            <textarea required rows={3} className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FormField>
          <Button type="submit" loading={saving} className="w-full">
            Save
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Hostel"
        message="Are you sure you want to delete this hostel?"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={saving}
        confirmLabel="Delete"
      />
    </div>
  );
}
