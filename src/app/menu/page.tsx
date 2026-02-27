"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, Info, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DrinkStoryModal from "@/components/modals/DrinkStoryModal";
import DecorOrnaments from "@/components/layout/DecorOrnaments";
import { getMenuItems, getCategories } from "@/lib/supabaseServices";
import type { MenuItem } from "@/lib/supabaseServices";

const ALL_CATEGORY_LABEL = "Všetko";

function formatPrice(price: number) {
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(price);
}

export default function MenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORY_LABEL);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [itemData, categoryData] = await Promise.all([getMenuItems(), getCategories()]);
        if (!mounted) return;
        setItems(itemData);
        setCategories(categoryData);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCategory = activeCategory === ALL_CATEGORY_LABEL || item.category === activeCategory;
      const matchSearch = `${item.name} ${item.description}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
      return matchCategory && matchSearch;
    });
  }, [activeCategory, items, searchQuery]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="animate-pulse text-lg font-bold text-primary">Načítavam menu...</p>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-x-clip pt-24">
      <Navbar />
      <DecorOrnaments mode="menu" />

      <section className="px-4 pb-12 pt-6 md:px-8 md:pt-10">
        <div className="surface-card mx-auto w-full max-w-7xl rounded-[36px] p-5 shadow-xl md:p-8">
          <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Ponuka podniku
              </p>
              <h1 className="text-3xl font-black text-foreground md:text-5xl">Nápoje, snacky a jedlá</h1>
              <p className="mt-3 text-sm text-foreground/70 md:text-base">
                Všetky položky sú pravidelne aktualizované podľa sezóny a dostupnosti našich surovín.
              </p>
            </div>

            <div className="relative w-full md:max-w-sm">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/35" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Hľadať názov alebo popis..."
                className="w-full rounded-2xl border border-foreground/10 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-primary"
              />
            </div>
          </div>

          <div className="mb-5 flex flex-wrap items-center gap-2">
            <div className="rounded-full bg-black px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
              {filteredItems.length} výsledkov
            </div>
            <div className="rounded-full bg-black/5 px-4 py-1.5 text-xs font-semibold text-foreground/70">
              Smart filter podľa názvu, kategórie a popisu
            </div>
          </div>

          <div className="mb-8 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setActiveCategory(ALL_CATEGORY_LABEL)}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${activeCategory === ALL_CATEGORY_LABEL
                ? "bg-primary text-primary-foreground"
                : "bg-foreground/5 hover:bg-foreground/10"
                }`}
            >
              {ALL_CATEGORY_LABEL}
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition ${activeCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground/5 hover:bg-foreground/10"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item, index) => (
                <motion.article
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  transition={{ duration: 0.35, delay: index * 0.02 }}
                  className="surface-card group overflow-hidden rounded-3xl p-4 shadow-md relative"
                >
                  {/* Bestseller/Recommend Psychological Badges */}
                  {(index === 0 || item.id % 5 === 0) && (
                    <div className="absolute -right-12 top-6 z-10 rotate-45 bg-red-500 px-12 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
                      Bestseller
                    </div>
                  )}
                  {(index === 2) && (
                    <div className="absolute left-3 top-3 z-10 rounded-full bg-amber-400 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-black shadow-sm">
                      Odporúčame
                    </div>
                  )}

                  <div className="relative mb-4 h-56 overflow-hidden rounded-2xl bg-accent p-2">
                    <Image
                      src={item.image || "/assets/access-verified/drink-brown-sugar-daddy.png"}
                      alt={item.name}
                      fill
                      className="object-contain transition duration-500 group-hover:scale-[1.03]"
                      onError={(e) => {
                        e.currentTarget.srcset = "/assets/access-verified/drink-brown-sugar-daddy.png";
                      }}
                    />
                  </div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-primary">{item.category}</p>
                  <h3 className="line-clamp-2 text-xl font-black text-foreground">{item.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-foreground/70">{item.description}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm font-extrabold text-foreground">{formatPrice(item.price)}</p>
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="inline-flex items-center gap-1 rounded-xl bg-black px-3 py-2 text-xs font-bold text-white transition hover:bg-black/85"
                    >
                      Detail
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>

          {filteredItems.length === 0 && (
            <div className="rounded-2xl border border-dashed border-foreground/20 bg-white p-10 text-center">
              <p className="text-base font-semibold text-foreground/70">Nenašli sa žiadne položky pre zvolený filter.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory(ALL_CATEGORY_LABEL);
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90 transition"
              >
                Zrušiť filter
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
      <DrinkStoryModal drink={selectedItem} onClose={() => setSelectedItem(null)} />
    </main>
  );
}
