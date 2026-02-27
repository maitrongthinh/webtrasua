"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DecorOrnaments from "@/components/layout/DecorOrnaments";
import aboutData from "@/data/about.json";

type AboutStat = {
  value: string;
  label: string;
  desc: string;
};

type AboutData = {
  title: string;
  subtitle: string;
  content1: string;
  content2: string;
  image: string;
  stats: AboutStat[];
};

const data = aboutData as AboutData;

export default function AboutPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip pt-24">
      <Navbar />
      <DecorOrnaments mode="home" />

      <section className="px-4 py-8 md:px-8 md:py-12">
        <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="surface-card rounded-[30px] p-6 shadow-xl md:p-8"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">{data.title}</p>
            <h1 className="text-3xl font-black leading-tight text-foreground md:text-5xl">{data.subtitle}</h1>
            <p className="mt-5 text-base leading-7 text-foreground/75 md:text-lg">{data.content1}</p>
            <p className="mt-4 text-base leading-7 text-foreground/75 md:text-lg">{data.content2}</p>

            <div className="mt-7 rounded-2xl bg-black px-4 py-4 text-sm font-medium leading-6 text-white/90">
              Naším najväčším cieľom je vaša spokojnosť. Dbáme na každý detail – od lístka voňavého čaju až po poslednú
              čiastočku lahodnej peny.
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="surface-card relative min-h-[320px] overflow-hidden rounded-[30px] p-3 shadow-xl"
          >
            <Image src={data.image} alt="O nás" fill className="rounded-[20px] object-cover" />
          </motion.div>
        </div>

        <div className="mx-auto mt-8 grid w-full max-w-7xl gap-4 md:grid-cols-3">
          {data.stats.map((stat, index) => (
            <motion.article
              key={`${stat.label}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="surface-card rounded-3xl p-5 shadow-md"
            >
              <p className="text-3xl font-black text-primary">{stat.value}</p>
              <h3 className="mt-2 text-lg font-black">{stat.label}</h3>
              <p className="mt-2 text-sm leading-6 text-foreground/70">{stat.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
