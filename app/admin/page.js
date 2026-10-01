"use client";

import { useEffect, useState } from "react";
import DashboardCard from "@/components/DashboardCard";
import Loading from "@/components/ui/Loading";
import { BookOpen, Building2, Calendar, Users } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setStats(data);
      })
      .catch(() => setError("Failed to load dashboard"));
  }, []);

  if (!stats && !error) return <Loading label="Loading dashboard..." />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
      <p className="mt-1 text-slate-600">Overview of Compass Hub campus data.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <DashboardCard title="Total Students" value={stats.students} icon={Users} accent="blue" />
        <DashboardCard title="Total Hostels" value={stats.hostels} icon={Building2} accent="navy" />
        <DashboardCard
          title="Available Hostel Spaces"
          value={stats.availableSpaces}
          icon={Building2}
          accent="emerald"
        />
        <DashboardCard
          title="Upcoming Events"
          value={stats.upcomingEvents}
          icon={Calendar}
          accent="gold"
        />
        <DashboardCard
          title="Reading Materials"
          value={stats.materials}
          icon={BookOpen}
          accent="blue"
        />
      </div>
    </div>
  );
}
