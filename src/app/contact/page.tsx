"use client";

import { motion } from "framer-motion";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import siteConfig from "@/config/site.json";

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-24">
      <Navbar />

      <section className="px-4 py-8 md:px-8 md:py-12">
        <div className="mx-auto w-full max-w-7xl rounded-[34px] border border-white/70 bg-white/85 p-6 shadow-xl md:p-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Kontakt</p>
            <h1 className="text-3xl font-black text-foreground md:text-5xl">Spojte sa s nami</h1>
            <p className="mt-3 text-sm text-foreground/70 md:text-base">
              Všetky informácie o prevádzke a otváracích hodinách na jednom mieste.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-2">
            <motion.article
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-3xl border border-foreground/10 bg-[#fff9ef] p-5"
            >
              <h2 className="mb-4 text-xl font-black text-foreground">Údaje prevádzky</h2>
              <ul className="space-y-4 text-sm text-foreground/80 md:text-base">
                <li className="flex items-start gap-3">
                  <Phone className="mt-1 h-4 w-4 text-primary" />
                  <span>{siteConfig.contact.phone}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="mt-1 h-4 w-4 text-primary" />
                  <span>{siteConfig.contact.email}</span>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="mt-1 h-4 w-4 text-primary" />
                  <span>{siteConfig.contact.address}</span>
                </li>
                <li className="flex items-start gap-3">
                  <Clock3 className="mt-1 h-4 w-4 text-primary" />
                  <span>{siteConfig.hours?.join(" | ")}</span>
                </li>
              </ul>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-foreground/10 bg-[#1f1711] p-5 text-white"
            >
              <h2 className="mb-4 text-xl font-black">Poloha na mape</h2>
              {siteConfig.googleMapUrl ? (
                <div className="w-full h-[250px] md:h-[300px] rounded-2xl overflow-hidden border border-white/15 relative">
                  <iframe
                    src={siteConfig.googleMapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                </div>
              ) : (
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-[220px] items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-6 text-center text-sm font-bold text-white transition hover:bg-white/20"
                >
                  Otvoriť v aplikácii Google Maps
                </a>
              )}
            </motion.article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
