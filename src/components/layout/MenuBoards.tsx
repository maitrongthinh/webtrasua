"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import homeData from "@/data/home.json";

export default function MenuBoards() {
  const { badge, title, description, categories } = homeData.menuBoards;

  return (
    <section className="px-6 pb-32 pt-16 md:px-8 bg-gradient-to-b from-accent to-background">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-[11px] font-black uppercase tracking-[0.25em] text-primary">{badge}</p>
            <h2 className="text-4xl font-black uppercase tracking-tighter text-foreground md:text-6xl">{title}</h2>
          </div>
          <p className="max-w-xs text-sm font-medium leading-relaxed text-foreground/60">
            {description}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link key={category.id} href="/menu">
              <motion.article
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                className={`group relative overflow-hidden rounded-3xl ${category.bgClass} px-8 pb-12 pt-10 transition-transform hover:-translate-y-2`}
              >
                <div className="relative z-10">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-foreground">{category.title}</h3>
                  <p className="mt-2 text-xs font-bold uppercase tracking-widest text-foreground/50">{category.subtitle}</p>
                </div>

                <div className="absolute right-6 top-6 h-10 w-10 flex items-center justify-center rounded-full bg-white/50 backdrop-blur-sm transition-transform group-hover:scale-110 group-hover:bg-primary group-hover:text-white text-foreground">
                  <ArrowUpRight className="h-5 w-5" />
                </div>

                <div className="relative mt-12 h-[280px] w-full transform transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-3">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
