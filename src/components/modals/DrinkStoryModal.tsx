"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  story?: string;
};

interface ItemStoryModalProps {
  drink: MenuItem | null;
  onClose: () => void;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(price);
}

export default function DrinkStoryModal({ drink, onClose }: ItemStoryModalProps) {
  return (
    <AnimatePresence>
      {drink && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Zatvoriť"
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 grid max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[30px] border border-white/60 bg-white md:grid-cols-2"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="relative min-h-[260px] bg-[#fff3e1] p-4">
              <Image src={drink.image} alt={drink.name} fill className="object-contain" />
            </div>

            <div className="overflow-y-auto p-5 md:p-7">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">{drink.category}</p>
              <h3 className="mt-2 text-2xl font-black text-foreground md:text-3xl">{drink.name}</h3>
              <p className="mt-3 text-sm leading-6 text-foreground/75">{drink.description}</p>

              <div className="mt-5 rounded-2xl bg-[#fff8ee] p-4 text-sm leading-6 text-foreground/80">
                {drink.story && drink.story.trim().length > 0
                  ? drink.story
                  : "Táto položka bude čoskoro doplnená o podrobnejší príbeh a odporúčanie."}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-foreground/10 pt-4">
                <span className="text-sm font-semibold text-foreground/70">Orientačná cena</span>
                <span className="text-xl font-black text-primary">{formatPrice(drink.price)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
