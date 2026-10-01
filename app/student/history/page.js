"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import { isPassing } from "@/lib/grading";

export default function StudentHistoryPage() {
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    fetch("/api/student/grades")
      .then((r) => r.json())
      .then((d) => setGrades(d.grades || []));
  }, []);

  if (!grades) return <Loading />;

  const grouped = grades.reduce((acc, g) => {
    const key = `${g.academicYear}-S${g.semester}`;
    if (!acc[key]) {
      acc[key] = { academicYear: g.academicYear, semester: g.semester, items: [] };
    }
    acc[key].items.push(g);
    return acc;
  }, {});

  const groups = Object.values(grouped).sort((a, b) => {
    if (a.academicYear === b.academicYear) return b.semester - a.semester;
    return b.academicYear.localeCompare(a.academicYear);
  });

  const average =
    grades.length > 0
      ? Math.round(grades.reduce((s, g) => s + g.marks, 0) / grades.length)
      : 0;
  const passed = grades.filter((g) => isPassing(g.marks)).length;

  return (
    <div>
      <h1 className="text-2xl font-bold">Academic History</h1>
      <div className="mt-6 rounded-xl border bg-blue-50 p-5 text-sm">
        <h2 className="font-semibold text-[#0a1628]">Summary</h2>
        <p className="mt-2 text-slate-700">
          Total courses: {grades.length} · Average: {average}% · Passed: {passed}
        </p>
      </div>
      <div className="mt-8 space-y-8">
        {groups.length === 0 ? (
          <p className="text-slate-500">No academic history available.</p>
        ) : (
          groups.map((group) => (
            <section key={`${group.academicYear}-${group.semester}`}>
              <h3 className="text-lg font-semibold text-slate-900">
                {group.academicYear} — Semester {group.semester}
              </h3>
              <div className="mt-3 overflow-x-auto rounded-lg border bg-white">
                <table className="min-w-full text-sm">
                  <thead className="bg-slate-50 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-2">Course</th>
                      <th className="px-4 py-2">Marks</th>
                      <th className="px-4 py-2">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {group.items.map((g) => (
                      <tr key={g.id}>
                        <td className="px-4 py-2">
                          {g.courseCode} — {g.courseName}
                        </td>
                        <td className="px-4 py-2">{g.marks}</td>
                        <td className="px-4 py-2">{g.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}
