"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import homeData from "@/data/home.json";
import { getMenuItems } from "@/lib/supabaseServices";
import type { MenuItem } from "@/lib/supabaseServices";

export default function Highlights() {
  const { badge, title, button } = homeData.highlights;
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    let mounted = true;

    getMenuItems().then((items) => {
      if (mounted) {
        setFeaturedItems(items.slice(0, 5));
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (featuredItems.length === 0) {
    return null;
  }

  return (
    <section className="relative px-6 py-32 md:px-8 bg-gradient-to-b from-background to-accent">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-20 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-4 text-[11px] font-black uppercase tracking-[0.25em] text-primary"
            >
              {badge}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl font-black uppercase tracking-tighter text-foreground md:text-6xl max-w-lg leading-[0.9]"
            >
              {title}
            </motion.h2>
          </div>
          <Link
            href={button.link}
            className="group flex items-center gap-3 border-b-2 border-foreground pb-2 text-sm font-bold uppercase tracking-widest text-foreground transition-all hover:text-primary hover:border-primary"
          >
            {button.text}
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-5">
          {featuredItems.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative mb-6 h-72 w-full overflow-visible rounded-[32px] bg-accent-strong transition-colors duration-500 group-hover:bg-primary/15">
                <div className="absolute inset-0 z-10 scale-[1.15] transition-transform duration-700 cubic-bezier(0.25, 1, 0.5, 1) group-hover:scale-[1.25] group-hover:-translate-y-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Text Container */}
              <div className="px-2">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary/80">{item.category}</p>
                <h3 className="mb-3 text-xl font-black uppercase tracking-tight text-foreground">{item.name}</h3>
                <p className="line-clamp-3 text-xs font-medium leading-relaxed text-foreground/50">{item.description}</p>
              </div>

              {/* Add to cart hint */}
              <div className="absolute bottom-4 right-2 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 text-primary">
                <ArrowUpRight className="h-6 w-6" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
