import Link from "next/link";
import { Compass } from "lucide-react";

export default function Logo({ href = "/", className = "" }) {
  return (
    <Link href={href} className={`flex items-center gap-2 ${className}`}>
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-[#0a1628] text-white shadow-md">
        <Compass className="h-6 w-6" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-bold tracking-tight text-[#0a1628]">
          COMPASS <span className="text-blue-600">HUB</span>
        </span>
        <span className="hidden text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:block">
          Navigate Your Campus
        </span>
      </span>
    </Link>
  );
}
