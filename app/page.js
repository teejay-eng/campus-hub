import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import EventCard from "@/components/EventCard";
import ContactForm from "@/components/ContactForm";
import Button from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { BookOpen, Building2, CalendarDays, Mail, MapPin, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

async function getUpcomingEvents() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return await prisma.event.findMany({
      where: { date: { gte: today } },
      orderBy: { date: "asc" },
      take: 6,
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const events = await getUpcomingEvents();

  return (
    <>
      <Navbar />
      <section id="home" className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-600">
              Campass Hub
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-[#0a1628] sm:text-5xl">
              Navigate Your Campus. Shape Your Future.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Compass Hub is a centralized student platform that brings academic resources,
              accommodation, campus events, student information and essential campus services
              together in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login">
                <Button size="lg">Student Login</Button>
              </Link>
              <Link href="#events">
                <Button size="lg" variant="secondary">
                  Explore Events
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative hidden h-72 rounded-2xl bg-[#0a1628] shadow-xl lg:block">
            <div className="absolute inset-0 rounded-2xl bg-[url('https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80')] bg-cover bg-center opacity-70" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#0a1628] to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 text-sm text-slate-200">
              Your digital compass for campus life — from lectures to lodging.
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <HeroCarousel />
        </div>
      </section>

      <section id="about" className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-[#0a1628]">What is Compass Hub?</h2>
          <p className="mt-4 max-w-3xl text-slate-600">
            Compass Hub is a digital campus management platform that provides students with
            convenient access to academic resources, accommodation information, events, profiles
            and academic records.
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Academic Resources",
                text: "Students can access reading materials and academic records.",
                icon: BookOpen,
              },
              {
                title: "Campus Life",
                text: "Students can discover upcoming events and campus activities.",
                icon: CalendarDays,
              },
              {
                title: "Accommodation",
                text: "Students can view available hostels and accommodation information.",
                icon: Building2,
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
              >
                <card.icon className="h-8 w-8 text-blue-600" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="events" className="bg-slate-50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-[#0a1628]">Upcoming Events</h2>
          <p className="mt-2 text-slate-600">Stay connected with what&apos;s happening on campus.</p>
          {events.length === 0 ? (
            <p className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
              No upcoming events at the moment.
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} href={`/#events`} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="contact" className="bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-[#0a1628]">Contact Us</h2>
            <p className="mt-3 text-slate-600">Reach the Compass Hub team for support or inquiries.</p>
            <ul className="mt-8 space-y-4 text-slate-700">
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-600" />
                info@compasshub.edu
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-blue-600" />
                +254 700 123 456
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                100 University Avenue, Campus City, CC 10001
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
