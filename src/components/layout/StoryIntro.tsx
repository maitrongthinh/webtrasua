"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import homeData from "@/data/home.json";

export default function StoryIntro() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const img1Y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const img2Y = useTransform(scrollYProgress, [0, 1], [0, 80]);

  const { badge, titleHtml, description, points, images, button } = homeData.storyIntro;

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-gradient-to-b from-accent-strong via-background to-background px-6 py-24 md:px-8 md:py-32 lg:py-48">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-24">

        {/* Left Typography Block */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <div className="mb-6 inline-block border-b-2 border-primary pb-1">
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-primary">
              {badge}
            </p>
          </div>

          <h2
            className="text-4xl font-black uppercase leading-[0.9] tracking-tighter text-foreground md:text-6xl lg:text-7xl"
            dangerouslySetInnerHTML={{ __html: titleHtml }}
          />

          <p className="mt-8 text-sm font-medium leading-relaxed text-foreground/60 md:text-base max-w-lg">
            {description}
          </p>

          <div className="mt-10 grid gap-4 border-l-2 border-foreground/10 pl-6">
            {points.map((point, index) => (
              <motion.div
                key={point}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="text-sm font-bold uppercase tracking-wider text-foreground"
              >
                {point}
              </motion.div>
            ))}
          </div>

          <Link
            href={button.link}
            className="mt-12 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:text-primary group"
          >
            {button.text}
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </motion.div>

        {/* Right Parallax Image Composition */}
        <div className="relative h-[500px] w-full lg:h-[700px]">
          {/* Main Large Image */}
          <motion.div
            style={{ y: img1Y }}
            className="absolute right-0 top-10 h-[400px] w-[80%] overflow-hidden rounded-[40px] lg:h-[550px]"
          >
            <div className="absolute inset-0 bg-accent-strong">
              <Image
                src={images.main}
                alt="Bubble Tea Aesthetic"
                fill
                className="object-cover transition-transform duration-1000 hover:scale-105"
              />
            </div>
          </motion.div>

          {/* Overlapping Floating Image Block */}
          <motion.div
            style={{ y: img2Y }}
            className="absolute bottom-0 left-0 z-20 h-[280px] w-[240px] overflow-hidden rounded-[32px] border-8 border-background bg-surface shadow-2xl lg:h-[350px] lg:w-[280px]"
          >
            <div className="flex h-full w-full items-center justify-center bg-primary/10 p-6">
              <Image
                src={images.floating}
                alt="Detailed Drink"
                width={200}
                height={300}
                className="h-auto w-full object-contain drop-shadow-xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
