"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";
import DashboardCard from "@/components/DashboardCard";
import { GraduationCap } from "lucide-react";

export default function StudentGradesPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/student/grades")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold">My Grades</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <DashboardCard title="Average Marks" value={`${data.average}%`} icon={GraduationCap} />
        <DashboardCard title="Courses" value={data.courseCount} icon={GraduationCap} accent="navy" />
        <DashboardCard title="Courses Passed" value={data.passed} icon={GraduationCap} accent="emerald" />
      </div>
      <div className="mt-8 overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Course Code</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Semester</th>
              <th className="px-4 py-3">Marks</th>
              <th className="px-4 py-3">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.grades.map((g) => (
              <tr key={g.id}>
                <td className="px-4 py-3 font-medium">{g.courseCode}</td>
                <td className="px-4 py-3">{g.courseName}</td>
                <td className="px-4 py-3">{g.semester}</td>
                <td className="px-4 py-3">{g.marks}</td>
                <td className="px-4 py-3 font-bold text-blue-700">{g.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {data.grades.length === 0 && (
          <p className="p-8 text-center text-slate-500">No grades recorded yet.</p>
        )}
      </div>
    </div>
  );
}
