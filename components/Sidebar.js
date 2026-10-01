"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "@/components/Logo";
import { NavIcon } from "@/components/nav-icons";

export default function Sidebar({ items, title }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <>
      <div className="border-b border-slate-200 px-4 py-5">
        <Logo href={items[0]?.href || "/"} />
        <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {item.icon && <NavIcon name={item.icon} className="h-4 w-4 shrink-0" />}
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-3">
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <Logo href={items[0]?.href} />
        <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-72 flex-col bg-white shadow-xl">
            <button
              type="button"
              className="absolute right-3 top-4 rounded p-1"
              onClick={() => setMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            {nav}
          </aside>
        </div>
      )}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white lg:flex">
        {nav}
      </aside>
    </>
  );
}
