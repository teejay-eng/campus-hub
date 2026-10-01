"use client";

export default function DashboardCard({ title, value, subtitle, icon: Icon, accent = "blue" }) {
  const accents = {
    blue: "from-blue-600 to-blue-800",
    navy: "from-[#0a1628] to-[#1e3a5f]",
    gold: "from-amber-500 to-amber-700",
    emerald: "from-emerald-500 to-emerald-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {Icon && (
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br text-white ${accents[accent]}`}
          >
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </div>
  );
}
