"use client";

import { useEffect, useState } from "react";
import DashboardCard from "@/components/DashboardCard";
import Loading from "@/components/ui/Loading";
import { Calendar, GraduationCap, Home, User } from "lucide-react";

export default function StudentDashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/student/me")
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data?.student) return <Loading label="Loading your dashboard..." />;

  const { student, stats } = data;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Welcome, {student.fullName}</h1>
      <p className="text-slate-600">Your Compass Hub student dashboard.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Student Name" value={student.fullName} icon={User} accent="navy" />
        <DashboardCard title="Student ID" value={student.studentId} icon={User} accent="blue" />
        <DashboardCard
          title="Current Hostel"
          value={student.hostel?.name || "Not assigned"}
          icon={Home}
          accent="emerald"
        />
        <DashboardCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon={Calendar}
          accent="gold"
        />
        <DashboardCard
          title="Academic Average"
          value={stats.average ? `${stats.average}%` : "—"}
          subtitle={`${stats.passed}/${stats.courseCount} courses passed`}
          icon={GraduationCap}
          accent="blue"
        />
      </div>
    </div>
  );
}
