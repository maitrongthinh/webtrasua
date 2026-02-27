import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

const TikTok = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.27 6.36 6.32 6.32 0 0 0 6.25-6.36V7.95a8.21 8.21 0 0 0 5 1.69Z" />
  </svg>
);
import siteConfig from "@/config/site.json";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-24 pb-8 overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="mx-auto grid w-full max-w-7xl gap-16 px-6 md:grid-cols-2 lg:grid-cols-12 md:px-8">

        {/* Brand Column */}
        <div className="space-y-6 lg:col-span-4">
          <Image
            src="/assets/brand-logo-beetea.png"
            alt="Beatea Logo"
            width={150}
            height={60}
            className="h-12 w-auto object-contain brightness-0 invert"
          />
          <p className="text-sm leading-relaxed text-white/50 max-w-sm">
            {siteConfig.slogan} <br /><br />
            Prémiový podnik s ponukou lahodných bubble tea, snackov a jedál. Príďte si vychutnať kvalitu na novej úrovni.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a
              href={siteConfig.socials.facebook}
              target="_blank"
              rel="noreferrer"
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-primary"
            >
              <Facebook className="h-4 w-4 transition-transform group-hover:scale-110" />
            </a>
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noreferrer"
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-primary"
            >
              <Instagram className="h-4 w-4 transition-transform group-hover:scale-110" />
            </a>
            <a
              href={siteConfig.socials.tiktok}
              target="_blank"
              rel="noreferrer"
              className="group flex h-10 w-10 items-center justify-center rounded-full bg-white/5 transition-all hover:bg-primary"
            >
              <TikTok className="h-4 w-4 transition-transform group-hover:scale-110" />
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="lg:col-span-2 lg:col-start-6">
          <p className="mb-6 text-xs font-bold uppercase tracking-widest text-primary">Navigácia</p>
          <ul className="space-y-4 text-sm font-medium text-white/60">
            <li>
              <Link href="/menu" className="transition-colors hover:text-white">
                Menu
              </Link>
            </li>
            <li>
              <Link href="/about" className="transition-colors hover:text-white">
                Náš príbeh
              </Link>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-white">
                Kontakt
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="lg:col-span-3">
          <p className="mb-6 text-xs font-bold uppercase tracking-widest text-primary">Kontakt</p>
          <ul className="space-y-4 text-sm font-medium text-white/60">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-white/40" />
              <span>{siteConfig.contact.phone}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-white/40" />
              <span>{siteConfig.contact.email}</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-white/40" />
              <span>{siteConfig.contact.address}</span>
            </li>
          </ul>
        </div>

        {/* Hours */}
        <div className="lg:col-span-3">
          <p className="mb-6 text-xs font-bold uppercase tracking-widest text-primary">Otváracie hodiny</p>
          <ul className="space-y-3 text-sm font-medium text-white/60">
            {siteConfig.hours?.map((hour) => (
              <li key={hour}>{hour}</li>
            ))}
          </ul>
        </div>
      </div>




      <div className="mx-auto mt-24 max-w-7xl px-6 md:px-8">
        <div className="flex flex-col items-center justify-between border-t border-white/10 pt-8 sm:flex-row text-xs font-medium text-white/30 uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} {siteConfig.brandName}. Všetky práva vyhradené.</p>
          <p className="mt-4 sm:mt-0">Made with 🖤 in Slovakia</p>
        </div>
      </div>
    </footer>
  );
}
