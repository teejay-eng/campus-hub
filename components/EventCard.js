import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin } from "lucide-react";
import Button from "@/components/ui/Button";

function formatEventDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function EventCard({ event, href, showView = true }) {
  const imageSrc =
    event.image ||
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80";

  const content = (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-44 w-full bg-slate-200">
        <Image src={imageSrc} alt={event.title} fill className="object-cover" sizes="400px" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-slate-900">{event.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{event.description}</p>
        <ul className="mt-4 space-y-1 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            {formatEventDate(event.date)}
          </li>
          <li className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            {event.time}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            {event.venue}
          </li>
        </ul>
        {showView && href && (
          <div className="mt-4">
            <Link href={href}>
              <Button size="sm" className="w-full sm:w-auto">
                View Event
              </Button>
            </Link>
          </div>
        )}
      </div>
    </article>
  );

  return content;
}
