"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/components/ui/Button";

const slides = [
  {
    title: "Campus Life",
    description: "Experience vibrant student communities and clubs across campus.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80",
    href: "/#events",
    cta: "See Events",
  },
  {
    title: "Students Studying",
    description: "Collaborative learning spaces designed for academic excellence.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=80",
    href: "/login",
    cta: "Student Login",
  },
  {
    title: "University Events",
    description: "Workshops, career fairs, and cultural celebrations all year round.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80",
    href: "/#events",
    cta: "Explore Events",
  },
  {
    title: "Student Accommodation",
    description: "Safe, comfortable hostels with modern amenities near campus.",
    image: "https://images.unsplash.com/photo-1555854877-0813f5a43ba2?w=1200&q=80",
    href: "/login",
    cta: "View Hostels",
  },
  {
    title: "Learning Environment",
    description: "Access reading materials and track your academic progress online.",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80",
    href: "/login",
    cta: "Get Started",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);
  const slide = slides[index];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-[#0a1628] shadow-lg">
      <div className="relative aspect-[16/9] max-h-[420px] w-full md:aspect-[21/9]">
        {slides.map((s, i) => (
          <div
            key={s.title}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
          >
            <Image src={s.image} alt={s.title} fill className="object-cover opacity-60" priority={i === 0} sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/90 via-[#0a1628]/50 to-transparent" />
          </div>
        ))}
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 md:max-w-xl">
          <h3 className="text-2xl font-bold text-white sm:text-3xl">{slide.title}</h3>
          <p className="mt-2 text-sm text-slate-200 sm:text-base">{slide.description}</p>
          {slide.href && (
            <Link href={slide.href} className="mt-4 w-fit">
              <Button variant="gold" size="sm">
                {slide.cta}
              </Button>
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur hover:bg-white/30"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur hover:bg-white/30"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${i === index ? "w-8 bg-amber-500" : "w-2 bg-white/50"}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
