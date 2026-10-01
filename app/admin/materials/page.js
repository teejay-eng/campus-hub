"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import Modal, { ConfirmDialog } from "@/components/ui/Modal";
import FormField, { inputClass } from "@/components/admin/FormField";

const empty = { title: "", description: "", course: "", category: "", fileUrl: "" };

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState([]);
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
    const res = await fetch(`/api/admin/materials${params}`);
    setMaterials(await res.json());
    setLoading(false);
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const url = editId ? `/api/admin/materials/${editId}` : "/api/admin/materials";
    await fetch(url, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setModalOpen(false);
    load();
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Reading Materials</h1>
        <Button
          onClick={() => {
            setEditId(null);
            setForm(empty);
            setModalOpen(true);
          }}
        >
          Add Material
        </Button>
      </div>
      <input className={`${inputClass} mt-4 max-w-md`} placeholder="Search title or course..." value={q} onChange={(e) => setQ(e.target.value)} />
      {loading ? (
        <Loading />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {materials.map((m) => (
                <tr key={m.id}>
                  <td className="px-4 py-3">{m.title}</td>
                  <td className="px-4 py-3">{m.course}</td>
                  <td className="px-4 py-3">{m.category}</td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditId(m.id);
                        setForm(m);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>{" "}
                    <Button size="sm" variant="danger" onClick={() => setDeleteTarget(m)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Material" : "Add Material"}>
        <form onSubmit={handleSave} className="space-y-3">
          {Object.keys(empty).map((key) => (
            <FormField key={key} label={key === "fileUrl" ? "File URL" : key.charAt(0).toUpperCase() + key.slice(1)} required>
              {key === "description" ? (
                <textarea required rows={3} className={inputClass} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              ) : (
                <input required className={inputClass} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              )}
            </FormField>
          ))}
          <Button type="submit" loading={saving} className="w-full">
            Save
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Material"
        message="Are you sure you want to delete this reading material?"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          setSaving(true);
          await fetch(`/api/admin/materials/${deleteTarget.id}`, { method: "DELETE" });
          setDeleteTarget(null);
          setSaving(false);
          load();
        }}
        loading={saving}
        confirmLabel="Delete"
      />
    </div>
  );
}
