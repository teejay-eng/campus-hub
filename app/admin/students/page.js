"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Loading from "@/components/ui/Loading";
import Modal, { ConfirmDialog } from "@/components/ui/Modal";
import FormField, { inputClass } from "@/components/admin/FormField";

const emptyForm = {
  fullName: "",
  studentId: "",
  email: "",
  age: "",
  school: "",
  faculty: "",
  course: "",
  yearOfAdmission: "",
  hostelId: "",
  password: "",
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [school, setSchool] = useState("");
  const [faculty, setFaculty] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (school) params.set("school", school);
    if (faculty) params.set("faculty", faculty);
    const [sRes, hRes] = await Promise.all([
      fetch(`/api/admin/students?${params}`),
      fetch("/api/admin/hostels"),
    ]);
    setStudents(await sRes.json());
    setHostels(await hRes.json());
    setLoading(false);
  }, [q, school, faculty]);

  useEffect(() => {
    load();
  }, [load]);

  function openAdd() {
    setEditId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(student) {
    setEditId(student.id);
    setForm({
      fullName: student.fullName,
      studentId: student.studentId,
      email: student.email,
      age: String(student.age),
      school: student.school,
      faculty: student.faculty,
      course: student.course,
      yearOfAdmission: String(student.yearOfAdmission),
      hostelId: student.hostelId || "",
      password: "",
    });
    setModalOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      if (editId) {
        const res = await fetch(`/api/admin/students/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
      } else {
        const res = await fetch("/api/admin/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setMessage({ type: "success", text: "Student added successfully." });
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setSaving(true);
    await fetch(`/api/admin/students/${deleteTarget.id}`, { method: "DELETE" });
    setDeleteTarget(null);
    setSaving(false);
    await load();
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Students</h1>
          <p className="text-sm text-slate-600">Manage student records and hostel assignments.</p>
        </div>
        <Button onClick={openAdd}>Add Student</Button>
      </div>

      {message && (
        <div className="mt-4">
          <Alert type={message.type}>{message.text}</Alert>
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <input
          placeholder="Search name, ID, email..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Filter school"
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          className={inputClass}
        />
        <input
          placeholder="Filter faculty"
          value={faculty}
          onChange={(e) => setFaculty(e.target.value)}
          className={inputClass}
        />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Student ID</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3 hidden md:table-cell">Email</th>
                <th className="px-4 py-3 hidden lg:table-cell">School</th>
                <th className="px-4 py-3 hidden lg:table-cell">Faculty</th>
                <th className="px-4 py-3 hidden xl:table-cell">Course</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3 hidden sm:table-cell">Hostel</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{s.studentId}</td>
                  <td className="px-4 py-3">{s.fullName}</td>
                  <td className="px-4 py-3 hidden md:table-cell">{s.email}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">{s.school}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">{s.faculty}</td>
                  <td className="px-4 py-3 hidden xl:table-cell">{s.course}</td>
                  <td className="px-4 py-3">{s.yearOfAdmission}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">{s.hostel?.name || "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <Button size="sm" variant="ghost" onClick={() => setViewStudent(s)}>
                        View
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => openEdit(s)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => setDeleteTarget(s)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {students.length === 0 && (
            <p className="p-8 text-center text-slate-500">No students found.</p>
          )}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? "Edit Student" : "Add Student"}
      >
        <form onSubmit={handleSave} className="grid gap-3 sm:grid-cols-2">
          <FormField label="Full Name" required>
            <input required className={inputClass} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
          </FormField>
          <FormField label="Student ID" required>
            <input required disabled={!!editId} className={inputClass} value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} />
          </FormField>
          <FormField label="Email" required>
            <input type="email" required className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </FormField>
          <FormField label="Age" required>
            <input type="number" required min={16} className={inputClass} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
          </FormField>
          <FormField label="School" required>
            <input required className={inputClass} value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} />
          </FormField>
          <FormField label="Faculty" required>
            <input required className={inputClass} value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} />
          </FormField>
          <FormField label="Course" required>
            <input required className={inputClass} value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
          </FormField>
          <FormField label="Year of Admission" required>
            <input type="number" required disabled={!!editId} className={inputClass} value={form.yearOfAdmission} onChange={(e) => setForm({ ...form, yearOfAdmission: e.target.value })} />
          </FormField>
          <FormField label="Hostel">
            <select className={inputClass} value={form.hostelId} onChange={(e) => setForm({ ...form, hostelId: e.target.value })}>
              <option value="">None</option>
              {hostels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.availableSpaces} free)
                </option>
              ))}
            </select>
          </FormField>
          {!editId && (
            <FormField label="Password" required>
              <input type="password" required minLength={6} className={inputClass} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </FormField>
          )}
          <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Save
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!viewStudent} onClose={() => setViewStudent(null)} title="Student Details">
        {viewStudent && (
          <dl className="space-y-2 text-sm">
            {[
              ["Student ID", viewStudent.studentId],
              ["Name", viewStudent.fullName],
              ["Email", viewStudent.email],
              ["School", viewStudent.school],
              ["Faculty", viewStudent.faculty],
              ["Course", viewStudent.course],
              ["Hostel", viewStudent.hostel?.name || "Not assigned"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b border-slate-100 py-2">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-medium text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        loading={saving}
        confirmLabel="Delete"
      />
    </div>
  );
}
