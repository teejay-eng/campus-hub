import Link from "next/link";
import Logo from "@/components/Logo";
import { Globe, Mail, MapPin, Phone, Share2 } from "lucide-react";

const socialIcons = [Share2, Globe, Mail];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#0a1628] text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo href="/" className="[&_span]:text-white [&_.text-blue-600]:text-amber-400" />
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Compass Hub connects students with campus services, accommodation, academic resources,
            and events in one modern portal.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white">Quick Links</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/#home" className="hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link href="/#about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/#events" className="hover:text-white">
                Events
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                Login
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Contact</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-amber-500" />
              info@compasshub.edu
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-amber-500" />
              +254700 123 456
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              100 University Avenue, Campus City, CC 10001
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white">Follow Us</h4>
          <div className="mt-4 flex gap-3">
            {socialIcons.map((Icon, i) => (
              <span
                key={i}
                className="flex h-10 w-10 cursor-default items-center justify-center rounded-lg bg-white/10 text-slate-300"
                aria-hidden
              >
                <Icon className="h-5 w-5" />
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-sm text-slate-500">
        © 2026 Compass Hub. All Rights Reserved.
      </div>
    </footer>
  );
}
