"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import siteConfig from "@/config/site.json";
import homeData from "@/data/home.json";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-background via-accent to-accent-strong pt-24 md:pt-32">
      {/* Decorative Warm Blobs */}
      <div className="absolute left-1/4 top-1/3 -z-10 h-[500px] w-[500px] rounded-full bg-primary/8 blur-[140px]" />
      <div className="absolute right-0 bottom-0 -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px]" />

      <div className="mx-auto flex h-full min-h-[calc(100vh-120px)] w-full max-w-7xl flex-col-reverse items-center justify-center gap-12 px-6 lg:flex-row lg:gap-20">

        {/* Left: Typography */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 rounded-full border border-primary/20 bg-primary/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary backdrop-blur-md"
          >
            🧋 {homeData.hero.badge}
          </motion.div>

          <h1 className="text-impact font-black text-foreground relative">
            {siteConfig.brandName}
            <span className="text-primary">.</span>
          </h1>

          <h2 className="mt-2 text-xl font-black uppercase tracking-widest text-foreground/30 md:text-3xl">
            {siteConfig.slogan}
          </h2>

          <p className="mt-8 max-w-xl text-sm font-medium leading-relaxed text-foreground/60 md:text-base">
            {homeData.hero.description}
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href={homeData.hero.buttons.primary.link}
              className="btn-primary group relative text-[13px] tracking-widest overflow-visible"
            >
              {/* Subtle pulsing background glow behind the button */}
              <span className="absolute -inset-1 rounded-full bg-primary opacity-40 blur-md transition-all duration-1000 group-hover:opacity-75 group-hover:duration-200 animate-pulse" />
              <span className="relative flex items-center gap-2">
                {homeData.hero.buttons.primary.text}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
            </Link>
            <Link href={homeData.hero.buttons.secondary.link} className="btn-outline group text-[13px] tracking-widest bg-transparent">
              {homeData.hero.buttons.secondary.text}
            </Link>
          </div>
        </motion.div>

        {/* Right: Single Hero Product Image */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, type: "spring", bounce: 0.35 }}
          className="relative flex flex-1 items-center justify-center"
        >
          {/* Glow ring behind product */}
          <div className="absolute h-[320px] w-[320px] rounded-full bg-gradient-to-br from-primary/25 via-primary/10 to-accent-strong blur-3xl md:h-[500px] md:w-[500px]" />

          {/* Floating Decor Items */}
          <motion.div
            animate={{ y: [-15, 15, -15], rotate: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="absolute -top-10 right-10 md:top-10 md:-right-10 z-20 h-24 w-24 md:h-32 md:w-32 drop-shadow-xl"
          >
            <Image src="/assets/decor/ice.png" alt="Ice Cube" fill className="object-contain" priority />
          </motion.div>

          <motion.div
            animate={{ y: [10, -10, 10], rotate: [5, -15, 5] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 -left-5 md:bottom-20 md:-left-20 z-20 h-20 w-20 md:h-28 md:w-28 drop-shadow-xl"
          >
            <Image src="/assets/decor/strawberry.png" alt="Strawberry" fill className="object-contain" priority />
          </motion.div>

          <motion.div
            animate={{ y: [-10, 10, -10], rotate: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/2 -right-5 md:top-1/3 md:-right-24 z-20 h-16 w-16 md:h-24 md:w-24 drop-shadow-xl"
          >
            <Image src="/assets/decor/leaf.png" alt="Tea Leaf" fill className="object-contain" priority />
          </motion.div>

          <div className="relative h-[350px] w-[280px] md:h-[550px] md:w-[420px]">
            <Image
              src={homeData.hero.images.center}
              alt="Beatea Signature Drink"
              fill
              className="object-contain drop-shadow-2xl animate-float-slow"
              priority
              sizes="(max-width: 768px) 280px, 420px"
            />
          </div>
        </motion.div>
      </div>

      {/* Decorative bottom wave */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}
