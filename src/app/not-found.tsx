"use client";

import Link from "next/link";
import { Coffee, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
    return (
        <main className="relative min-h-screen overflow-x-clip bg-background font-sans">
            <Navbar />

            <section className="flex min-h-[85vh] flex-col items-center justify-center px-6 pt-32 text-center md:px-8">
                <div className="relative mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/20 opacity-75" />
                    <Coffee className="h-16 w-16" strokeWidth={1.5} />
                </div>

                <h1 className="mb-4 text-7xl font-black tracking-tighter text-foreground md:text-9xl">
                    4<span className="text-primary">0</span>4
                </h1>

                <h2 className="mb-6 text-2xl font-bold text-foreground md:text-4xl">
                    Oops! Túto šálku sme nenašli.
                </h2>

                <p className="mx-auto mb-10 max-w-md text-foreground/70 md:text-lg">
                    Stránka, ktorú hľadáte, buď neexistuje, alebo bola presunutá.
                    Ale nezúfajte, náš čaj je stále pripravený v menu!
                </p>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-center">
                    <Link
                        href="/menu"
                        className="btn-primary group inline-flex items-center justify-center gap-2 text-[15px] tracking-widest shadow-xl shadow-primary/25"
                    >
                        <span>Objaviť Menu</span>
                    </Link>
                    <Link
                        href="/"
                        className="btn-outline group inline-flex items-center justify-center gap-2 text-[15px] tracking-widest bg-transparent"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span>Späť Domov</span>
                    </Link>
                </div>
            </section>

            <Footer />
        </main>
    );
}
