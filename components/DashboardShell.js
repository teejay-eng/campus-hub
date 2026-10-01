"use client";

import Sidebar from "@/components/Sidebar";
import { navByKey } from "@/lib/navigation";

export default function DashboardShell({ title, navKey, children }) {
  const navItems = navByKey[navKey] || [];

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 lg:flex-row">
      <Sidebar items={navItems} title={title} />
      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
