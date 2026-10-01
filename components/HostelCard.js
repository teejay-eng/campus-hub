import { MapPin, Users } from "lucide-react";
import { getHostelAvailability } from "@/lib/hostel-status";
import Button from "@/components/ui/Button";

const toneClasses = {
  success: "bg-emerald-100 text-emerald-800",
  warning: "bg-amber-100 text-amber-900",
  danger: "bg-red-100 text-red-800",
};

export default function HostelCard({ hostel, onRequest, showRequest = false }) {
  const availability = getHostelAvailability(hostel.availableSpaces, hostel.capacity);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{hostel.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-600">
            <MapPin className="h-4 w-4 shrink-0 text-blue-600" />
            {hostel.location}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${toneClasses[availability.tone]}`}
        >
          {availability.label}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-600 line-clamp-3">{hostel.description}</p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
        <span className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          {hostel.availableSpaces} / {hostel.capacity} spaces
        </span>
        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium uppercase">
          {hostel.gender}
        </span>
      </div>
      {showRequest && onRequest && (
        <Button
          className="mt-4 w-full sm:w-auto"
          variant="secondary"
          size="sm"
          onClick={() => onRequest(hostel)}
          disabled={hostel.availableSpaces <= 0}
        >
          Accommodation Request
        </Button>
      )}
    </article>
  );
}
