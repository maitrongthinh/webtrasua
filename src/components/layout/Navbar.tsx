"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const navLinks = [
  { name: "Menu", href: "/menu" },
  { name: "Náš príbeh", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 pt-4 px-4 transition-all duration-300">
      <div
        className={`mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between rounded-full px-6 md:px-8 transition-all duration-500 ${scrolled ? "glass-dark shadow-2xl" : "bg-transparent"
          }`}
      >
        {/* Left: Desktop Links */}
        <div className="hidden flex-1 items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[13px] font-bold uppercase tracking-[0.15em] transition-colors ${pathname === link.href
                ? "text-primary"
                : (scrolled ? "text-white hover:text-primary" : "text-foreground hover:text-primary")
                }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Center: Brand Logo */}
        <Link href="/" className="flex items-center justify-center flex-1" onClick={() => setIsOpen(false)}>
          <Image
            src="/assets/logo.png"
            alt="Beatea Logo"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover shadow-sm transition-transform hover:scale-105"
            priority
          />
        </Link>

        {/* Right: CTA & Contacts */}
        <div className="hidden flex-1 items-center justify-end gap-6 md:flex">
          <Link
            href="/contact"
            className={`text-[13px] font-bold uppercase tracking-[0.15em] transition-colors ${pathname === "/contact"
              ? "text-primary"
              : (scrolled ? "text-white hover:text-primary" : "text-foreground hover:text-primary")
              }`}
          >
            Kontakt
          </Link>
          <Link
            href="/menu"
            className={`rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 ${scrolled ? "bg-primary text-white" : "bg-foreground text-white"
              }`}
          >
            Objednať
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`flex-1 flex justify-end md:hidden z-50 relative ${isOpen ? "text-foreground" : scrolled ? "text-white" : "text-foreground"}`}
          aria-label="Toggle menu"
        >
          {isOpen ? <X strokeWidth={2.5} className="h-6 w-6" /> : <Menu strokeWidth={2.5} className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 top-0 -z-10 flex h-screen w-full flex-col bg-background px-6 pt-32 pb-12 md:hidden"
          >
            <div className="flex h-full flex-col justify-between">
              <div className="flex flex-col gap-8">
                {[...navLinks, { name: "Kontakt", href: "/contact" }].map((link, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    key={link.href}
                  >
                    <Link
                      href={link.href}
                      className={`block text-5xl font-black uppercase tracking-tighter ${pathname === link.href ? "text-primary" : "text-foreground hover:text-primary transition-colors"
                        }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-auto border-t border-black/10 pt-8"
              >
                <Link
                  href="/menu"
                  className="btn-primary w-full text-[15px] tracking-widest text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Objednať teraz
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
