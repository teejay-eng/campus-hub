"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import Modal, { ConfirmDialog } from "@/components/ui/Modal";
import FormField, { inputClass } from "@/components/admin/FormField";
import { gradeFromMarks } from "@/lib/grading";

const empty = {
  studentId: "",
  courseCode: "",
  courseName: "",
  semester: "1",
  academicYear: "",
  marks: "",
};

export default function AdminGradesPage() {
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentFilter, setStudentFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (studentFilter) params.set("studentId", studentFilter);
    if (yearFilter) params.set("academicYear", yearFilter);
    const [gRes, sRes] = await Promise.all([
      fetch(`/api/admin/grades?${params}`),
      fetch("/api/admin/students"),
    ]);
    setGrades(await gRes.json());
    setStudents(await sRes.json());
    setLoading(false);
  }, [studentFilter, yearFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const previewGrade = gradeFromMarks(form.marks);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    const url = editId ? `/api/admin/grades/${editId}` : "/api/admin/grades";
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
        <h1 className="text-2xl font-bold">Grades</h1>
        <Button
          onClick={() => {
            setEditId(null);
            setForm(empty);
            setModalOpen(true);
          }}
        >
          Add Grade
        </Button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <select className={inputClass} value={studentFilter} onChange={(e) => setStudentFilter(e.target.value)}>
          <option value="">All students</option>
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.fullName} ({s.studentId})
            </option>
          ))}
        </select>
        <input className={inputClass} placeholder="Filter academic year" value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} />
      </div>

      {loading ? (
        <Loading />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Semester</th>
                <th className="px-4 py-3">Year</th>
                <th className="px-4 py-3">Marks</th>
                <th className="px-4 py-3">Grade</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {grades.map((g) => (
                <tr key={g.id}>
                  <td className="px-4 py-3">{g.student?.fullName}</td>
                  <td className="px-4 py-3">{g.courseCode}</td>
                  <td className="px-4 py-3">{g.courseName}</td>
                  <td className="px-4 py-3">{g.semester}</td>
                  <td className="px-4 py-3">{g.academicYear}</td>
                  <td className="px-4 py-3">{g.marks}</td>
                  <td className="px-4 py-3 font-semibold">{g.grade}</td>
                  <td className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditId(g.id);
                        setForm({
                          studentId: g.studentId,
                          courseCode: g.courseCode,
                          courseName: g.courseName,
                          semester: String(g.semester),
                          academicYear: g.academicYear,
                          marks: String(g.marks),
                        });
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </Button>{" "}
                    <Button size="sm" variant="danger" onClick={() => setDeleteTarget(g)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Grade" : "Add Grade"}>
        <form onSubmit={handleSave} className="space-y-3">
          <FormField label="Student" required>
            <select required className={inputClass} value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fullName}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Course Code" required>
            <input required className={inputClass} value={form.courseCode} onChange={(e) => setForm({ ...form, courseCode: e.target.value })} />
          </FormField>
          <FormField label="Course Name" required>
            <input required className={inputClass} value={form.courseName} onChange={(e) => setForm({ ...form, courseName: e.target.value })} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Semester" required>
              <input type="number" min={1} max={2} required className={inputClass} value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} />
            </FormField>
            <FormField label="Academic Year" required>
              <input required placeholder="2024/2025" className={inputClass} value={form.academicYear} onChange={(e) => setForm({ ...form, academicYear: e.target.value })} />
            </FormField>
          </div>
          <FormField label="Marks" required>
            <input type="number" min={0} max={100} required className={inputClass} value={form.marks} onChange={(e) => setForm({ ...form, marks: e.target.value })} />
          </FormField>
          {previewGrade && (
            <p className="text-sm text-slate-600">
              Computed grade: <strong>{previewGrade}</strong>
            </p>
          )}
          <Button type="submit" loading={saving} className="w-full">
            Save
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Grade"
        message="Are you sure you want to delete this grade record?"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          setSaving(true);
          await fetch(`/api/admin/grades/${deleteTarget.id}`, { method: "DELETE" });
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
