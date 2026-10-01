"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import Loading from "@/components/ui/Loading";
import FormField, { inputClass } from "@/components/admin/FormField";

export default function StudentProfilePage() {
  const [student, setStudent] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch("/api/student/me")
      .then((r) => r.json())
      .then((data) => {
        setStudent(data.student);
        setForm({
          fullName: data.student.fullName,
          age: String(data.student.age),
          email: data.student.email,
          school: data.student.school,
          faculty: data.student.faculty,
          course: data.student.course,
          profileImage: data.student.profileImage || "",
        });
      });
  }, []);

  if (!student || !form) return <Loading />;

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const res = await fetch("/api/student/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    if (!res.ok) {
      setMessage({ type: "error", text: updated.error || "Update failed" });
    } else {
      setStudent(updated);
      setMessage({ type: "success", text: "Profile updated successfully." });
    }
    setSaving(false);
  }

  const avatar =
    student.profileImage ||
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80";

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">My Profile</h1>
      <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row">
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-lg">
          <Image src={avatar} alt={student.fullName} fill className="object-cover" sizes="128px" />
        </div>
        <dl className="grid flex-1 gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-slate-500">Student ID</dt>
            <dd className="font-semibold">{student.studentId}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Year of Admission</dt>
            <dd className="font-semibold">{student.yearOfAdmission}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Hostel</dt>
            <dd className="font-semibold">{student.hostel?.name || "Not assigned"}</dd>
          </div>
        </dl>
      </div>

      {message && (
        <div className="mt-4">
          <Alert type={message.type}>{message.text}</Alert>
        </div>
      )}

      <form onSubmit={handleSave} className="mt-8 grid gap-4 rounded-xl border bg-white p-6 sm:grid-cols-2">
        <FormField label="Full name">
          <input className={inputClass} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </FormField>
        <FormField label="Age">
          <input type="number" className={inputClass} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
        </FormField>
        <FormField label="Email">
          <input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </FormField>
        <FormField label="Profile image URL">
          <input className={inputClass} value={form.profileImage} onChange={(e) => setForm({ ...form, profileImage: e.target.value })} />
        </FormField>
        <FormField label="School">
          <input className={inputClass} value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} />
        </FormField>
        <FormField label="Faculty">
          <input className={inputClass} value={form.faculty} onChange={(e) => setForm({ ...form, faculty: e.target.value })} />
        </FormField>
        <FormField label="Course">
          <input className={inputClass} value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} />
        </FormField>
        <div className="sm:col-span-2">
          <Button type="submit" loading={saving}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
