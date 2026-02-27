"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Coffee,
  Edit,
  Info,
  LogOut,
  Plus,
  Save,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import {
  getMenuItems,
  getCategories,
  saveMenuItem,
  deleteMenuItem,
  uploadImage,
  getUploadedImages,
  deleteUploadedImage,
} from "@/lib/supabaseServices";
import type { MenuItem } from "@/lib/supabaseServices";
import { signOut } from "@/lib/supabaseAuth";
import siteConfigData from "@/config/site.json";
import aboutDataJson from "@/data/about.json";

type SiteConfig = {
  brandName: string;
  slogan: string;
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  socials: {
    facebook: string;
    instagram: string;
    tiktok: string;
  };
  hours: string[];
  googleMapUrl?: string;
};

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

type FlashMessage = {
  type: "success" | "error";
  text: string;
};

type TabType = "products" | "settings" | "about";

function formatPrice(price: number) {
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(price);
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("products");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(siteConfigData as SiteConfig);
  const [aboutData, setAboutData] = useState<AboutData>(aboutDataJson as AboutData);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState<FlashMessage | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageLibrary, setShowImageLibrary] = useState(false);
  const [libraryImages, setLibraryImages] = useState<{ name: string; url: string }[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [itemData, categoryData] = await Promise.all([
          getMenuItems(),
          getCategories(),
        ]);

        if (!mounted) return;
        setItems(itemData);
        setCategories(categoryData);
      } catch (error) {
        console.error(error);
        if (mounted) {
          setFlash({ type: "error", text: "Nepodarilo sa načítať dáta admin panela." });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!flash) return;
    const timer = setTimeout(() => setFlash(null), 3200);
    return () => clearTimeout(timer);
  }, [flash]);

  const categoryOptions = useMemo(() => {
    const fromItems = items.map((item) => item.category);
    return Array.from(new Set([...categories, ...fromItems])).sort((a, b) => a.localeCompare(b, "sk"));
  }, [categories, items]);

  function openNewItemForm() {
    setEditItem({
      id: 0,
      name: "",
      category: categoryOptions[0] || "Mliečny čaj",
      price: 4.9,
      image: "/assets/access-verified/drink-brown-sugar-daddy.png",
      description: "",
      story: "",
    });
  }

  async function refreshItems() {
    try {
      const [itemData, categoryData] = await Promise.all([getMenuItems(), getCategories()]);
      setItems(itemData);
      setCategories(categoryData);
    } catch (error) {
      console.error(error);
      setFlash({ type: "error", text: "Nepodarilo sa obnoviť zoznam produktov." });
    }
  }

  async function handleSaveItem(event: React.FormEvent) {
    event.preventDefault();
    if (!editItem) return;

    try {
      const result = await saveMenuItem(editItem);
      if (!result.success) {
        setFlash({ type: "error", text: result.error || "Nepodarilo sa uložiť položku." });
        return;
      }
      await refreshItems();
      setEditItem(null);
      setFlash({ type: "success", text: "Položka bola uložená." });
    } catch (error) {
      console.error(error);
      setFlash({ type: "error", text: "Nepodarilo sa uložiť položku." });
    }
  }

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !editItem) return;

    // Optional client-side validation
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setFlash({ type: "error", text: "Obrázok je príliš veľký. Maximálna veľkosť je 5MB." });
      return;
    }

    setIsUploading(true);
    try {
      const result = await uploadImage(file);
      if (result.success && result.url) {
        setEditItem({ ...editItem, image: result.url });
        setFlash({ type: "success", text: "Obrázok bol úspešne nahratý." });
      } else {
        setFlash({ type: "error", text: result.error || "Nepodarilo sa nahrať obrázok." });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setFlash({ type: "error", text: "Nastala chyba pri nahrávaní obrázka." });
    } finally {
      setIsUploading(false);
      // Reset input value so the same file can be uploaded again if needed
      event.target.value = "";
    }
  }

  async function handleDeleteItem(id: number) {
    const shouldDelete = confirm("Naozaj chcete zmazať túto položku?");
    if (!shouldDelete) return;

    try {
      const result = await deleteMenuItem(id);
      if (!result.success) {
        setFlash({ type: "error", text: result.error || "Nepodarilo sa zmazať položku." });
        return;
      }
      await refreshItems();
      setFlash({ type: "success", text: "Položka bola zmazaná." });
    } catch (error) {
      console.error(error);
      setFlash({ type: "error", text: "Nepodarilo sa zmazať položku." });
    }
  }

  async function loadLibraryImages() {
    try {
      const images = await getUploadedImages();
      setLibraryImages(images);
    } catch (err) {
      setFlash({ type: "error", text: "Nepodarilo sa načítať galériu obrázkov." });
    }
  }

  async function handleDeleteLibraryImage(fileName: string) {
    if (!confirm("Naozaj chcete zmazať tento obrázok z úložiska?")) return;

    try {
      const result = await deleteUploadedImage(fileName);
      if (result.success) {
        setFlash({ type: "success", text: "Obrázok bol zmazaný." });
        loadLibraryImages(); // Refresh
      } else {
        setFlash({ type: "error", text: result.error || "Nepodarilo sa zmazať obrázok." });
      }
    } catch (err) {
      setFlash({ type: "error", text: "Nastala chyba pri mazaní." });
    }
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      console.error(error);
    }
    // Auth state change will handle redirect
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-lg font-bold text-primary">Načítavam admin...</p>
      </div>
    );
  }

  return (
    <main suppressHydrationWarning className="min-h-screen bg-[#fff8ee] px-4 pb-10 pt-6 md:px-8 md:pb-14 md:pt-8">
      <section suppressHydrationWarning className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 rounded-3xl border border-white/70 bg-white/90 p-5 shadow-md md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Bezpečný admin panel</p>
            <h1 className="mt-1 text-2xl font-black text-foreground">Správa obsahu webu</h1>
            <p className="mt-2 text-sm text-foreground/70">
              Prihlásený cez Supabase • Dáta ukladané do databázy
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-xl border border-foreground/15 bg-white px-4 py-2 text-sm font-bold text-foreground hover:bg-foreground/5"
            >
              Otvoriť web
            </Link>
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-bold text-white hover:bg-black/85 disabled:opacity-60"
            >
              <LogOut className="h-4 w-4" />
              {isSigningOut ? "Odhlašujem..." : "Odhlásiť"}
            </button>
          </div>
        </div>

        <div className="flex w-full flex-col gap-6 lg:flex-row">
          <aside className="space-y-2 lg:w-72">
            <button
              onClick={() => setActiveTab("products")}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${activeTab === "products"
                ? "bg-primary text-primary-foreground"
                : "border border-white/70 bg-white/90 hover:bg-white"
                }`}
            >
              <Coffee className="h-4 w-4" />
              Produkty
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${activeTab === "settings"
                ? "bg-primary text-primary-foreground"
                : "border border-white/70 bg-white/90 hover:bg-white"
                }`}
            >
              <Settings className="h-4 w-4" />
              Nastavenia
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${activeTab === "about"
                ? "bg-primary text-primary-foreground"
                : "border border-white/70 bg-white/90 hover:bg-white"
                }`}
            >
              <Info className="h-4 w-4" />
              O nás
            </button>
          </aside>

          <div className="min-h-[620px] flex-1 rounded-[34px] border border-white/70 bg-white/90 p-5 shadow-xl md:p-7">
            {flash && (
              <div
                className={`mb-6 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold ${flash.type === "success"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : "border-red-200 bg-red-50 text-red-700"
                  }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                {flash.text}
              </div>
            )}

            {/* ═══════════ PRODUCTS TAB ═══════════ */}
            {activeTab === "products" && (
              <div>
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-2xl font-black text-foreground">Produkty ({items.length})</h2>
                  <button
                    onClick={openNewItemForm}
                    className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2 text-sm font-bold text-white hover:bg-black/85"
                  >
                    <Plus className="h-4 w-4" />
                    Pridať položku
                  </button>
                </div>

                <div className="space-y-3">
                  {items.map((item) => (
                    <article
                      key={item.id}
                      className="flex flex-col justify-between gap-4 rounded-2xl border border-foreground/10 bg-[#fffbf4] p-4 md:flex-row md:items-center"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-xl border border-white bg-white">
                          <Image
                            src={item.image || "/assets/access-verified/drink-brown-sugar-daddy.png"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-base font-black text-foreground">{item.name}</h3>
                          <p className="text-xs font-semibold uppercase tracking-wide text-primary">{item.category}</p>
                          <p className="text-sm text-foreground/70">{formatPrice(item.price)}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditItem(item)}
                          className="inline-flex items-center gap-2 rounded-lg border border-foreground/15 px-3 py-2 text-xs font-bold hover:bg-white"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          Upraviť
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Zmazať
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════ SETTINGS TAB ═══════════ */}
            {activeTab === "settings" && (
              <div className="grid max-w-3xl gap-4">
                <h2 className="text-2xl font-black text-foreground">Nastavenia značky</h2>
                <p className="text-sm text-foreground/50">
                  Tieto nastavenia sú uložené lokálne v konfigurácii webu. Zmeny sa prejavia po novom nasadení.
                </p>

                <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                  Názov značky
                  <input
                    value={siteConfig.brandName}
                    onChange={(event) =>
                      setSiteConfig({ ...siteConfig, brandName: event.target.value })
                    }
                    className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                  />
                </label>

                <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                  Slogan
                  <input
                    value={siteConfig.slogan}
                    onChange={(event) =>
                      setSiteConfig({ ...siteConfig, slogan: event.target.value })
                    }
                    className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                  />
                </label>

                <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                  Telefón
                  <input
                    value={siteConfig.contact.phone}
                    onChange={(event) =>
                      setSiteConfig({
                        ...siteConfig,
                        contact: { ...siteConfig.contact, phone: event.target.value },
                      })
                    }
                    className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                  />
                </label>

                <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                  Email
                  <input
                    value={siteConfig.contact.email}
                    onChange={(event) =>
                      setSiteConfig({
                        ...siteConfig,
                        contact: { ...siteConfig.contact, email: event.target.value },
                      })
                    }
                    className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                  />
                </label>

                <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                  Adresa (voliteľne)
                  <input
                    value={siteConfig.contact.address}
                    onChange={(event) =>
                      setSiteConfig({
                        ...siteConfig,
                        contact: { ...siteConfig.contact, address: event.target.value },
                      })
                    }
                    className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                  />
                </label>

                <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                  Google Map Embed URL
                  <input
                    value={siteConfig.googleMapUrl || ""}
                    onChange={(event) =>
                      setSiteConfig({ ...siteConfig, googleMapUrl: event.target.value })
                    }
                    placeholder="https://www.google.com/maps/embed?pb=..."
                    className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                  />
                </label>

                <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                  Otváracie hodiny (jedna linka = jeden deň)
                  <textarea
                    rows={3}
                    value={siteConfig.hours.join("\n")}
                    onChange={(event) =>
                      setSiteConfig({
                        ...siteConfig,
                        hours: event.target.value.split("\n").filter((h) => h.trim() !== ""),
                      })
                    }
                    placeholder={"Pondelok - Piatok: 10:00 - 21:00\nSobota - Nedeľa: 11:00 - 22:00"}
                    className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary whitespace-pre-wrap"
                  />
                </label>

                <h3 className="mt-4 text-lg font-black text-foreground">Sociálne siete (voliteľne)</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                    Instagram URL
                    <input
                      value={siteConfig.socials.instagram}
                      onChange={(event) =>
                        setSiteConfig({
                          ...siteConfig,
                          socials: { ...siteConfig.socials, instagram: event.target.value },
                        })
                      }
                      className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                    Facebook URL
                    <input
                      value={siteConfig.socials.facebook}
                      onChange={(event) =>
                        setSiteConfig({
                          ...siteConfig,
                          socials: { ...siteConfig.socials, facebook: event.target.value },
                        })
                      }
                      className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                    />
                  </label>
                  <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                    TikTok URL
                    <input
                      value={siteConfig.socials.tiktok}
                      onChange={(event) =>
                        setSiteConfig({
                          ...siteConfig,
                          socials: { ...siteConfig.socials, tiktok: event.target.value },
                        })
                      }
                      className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* ═══════════ ABOUT TAB ═══════════ */}
            {activeTab === "about" && (
              <div className="grid max-w-3xl gap-4">
                <h2 className="text-2xl font-black text-foreground">Obsah stránky O nás</h2>
                <p className="text-sm text-foreground/50">
                  Tieto údaje sú uložené lokálne v JSON konfiguráciách. Zmeny sa prejavia po novom nasadení.
                </p>

                <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                  Nadpis
                  <input
                    value={aboutData.title}
                    onChange={(event) => setAboutData({ ...aboutData, title: event.target.value })}
                    className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                  />
                </label>

                <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                  Podnadpis
                  <input
                    value={aboutData.subtitle}
                    onChange={(event) => setAboutData({ ...aboutData, subtitle: event.target.value })}
                    className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                  />
                </label>

                <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                  Odsek 1
                  <textarea
                    rows={4}
                    value={aboutData.content1}
                    onChange={(event) => setAboutData({ ...aboutData, content1: event.target.value })}
                    className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                  />
                </label>

                <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                  Odsek 2
                  <textarea
                    rows={4}
                    value={aboutData.content2}
                    onChange={(event) => setAboutData({ ...aboutData, content2: event.target.value })}
                    className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                  />
                </label>

                <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                  URL obrázka
                  <input
                    value={aboutData.image}
                    onChange={(event) => setAboutData({ ...aboutData, image: event.target.value })}
                    className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════ EDIT MODAL ═══════════ */}
      <AnimatePresence>
        {editItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/55 backdrop-blur-sm"
              onClick={() => setEditItem(null)}
              aria-label="Zatvoriť"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              className="relative z-10 max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[30px] border border-white/60 bg-white p-5 shadow-2xl md:p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-2xl font-black text-foreground">
                  {editItem.id ? "Upraviť položku" : "Nová položka"}
                </h3>
                <button
                  onClick={() => setEditItem(null)}
                  className="rounded-full border border-foreground/15 p-2 text-foreground/70 transition hover:bg-foreground/5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveItem} className="grid gap-4">
                <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                  Názov
                  <input
                    required
                    value={editItem.name}
                    onChange={(event) => setEditItem({ ...editItem, name: event.target.value })}
                    className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                    Kategória
                    <input
                      list="category-options"
                      value={editItem.category}
                      onChange={(event) => setEditItem({ ...editItem, category: event.target.value })}
                      className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                    />
                    <datalist id="category-options">
                      {categoryOptions.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </label>

                  <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                    Cena (EUR)
                    <input
                      type="number"
                      required
                      min={0}
                      step={0.1}
                      value={editItem.price}
                      onChange={(event) =>
                        setEditItem({
                          ...editItem,
                          price: Number(event.target.value || 0),
                        })
                      }
                      className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                    />
                  </label>
                </div>

                <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                  Krátky popis
                  <textarea
                    rows={2}
                    value={editItem.description}
                    onChange={(event) => setEditItem({ ...editItem, description: event.target.value })}
                    className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                  />
                </label>

                <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                  Príbeh produktu
                  <textarea
                    rows={4}
                    value={editItem.story || ""}
                    onChange={(event) => setEditItem({ ...editItem, story: event.target.value })}
                    className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                  />
                </label>

                <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                  URL obrázka
                  <input
                    value={editItem.image}
                    onChange={(event) => setEditItem({ ...editItem, image: event.target.value })}
                    className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
                    placeholder="/assets/access-verified/drink-name.png"
                  />
                </label>

                <label className="grid gap-1 text-sm font-semibold text-foreground/70">
                  Alebo nahrať/vybrať obrázok zo Supabase úložiska
                  <div className="relative flex items-center justify-between rounded-xl border border-foreground/15 bg-white px-4 py-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowImageLibrary(true);
                        loadLibraryImages();
                      }}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <span className="text-sm font-medium text-foreground/70">
                      Kliknite pre zobrazenie Galérie obrázkov
                    </span>
                    <span className="rounded-lg bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                      Otvoriť galériu
                    </span>
                  </div>
                </label>

                {editItem.image && (
                  <div className="flex items-center gap-4 rounded-xl border border-foreground/10 bg-[#fffaf2] p-3">
                    <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-white bg-white">
                      <Image
                        src={editItem.image || "/assets/access-verified/drink-brown-sugar-daddy.png"}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs text-foreground/50">Aktuálny obrázok</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
                >
                  <Save className="h-4 w-4" />
                  Uložiť položku
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════ IMAGE LIBRARY MODAL ═══════════ */}
      <AnimatePresence>
        {showImageLibrary && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 md:p-6">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowImageLibrary(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              className="relative z-10 flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-[30px] border border-white/60 bg-[#fff8ee] shadow-2xl"
            >
              <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
                <h3 className="text-xl font-black text-foreground">Vybrať z galérie ({libraryImages.length})</h3>
                <button
                  onClick={() => setShowImageLibrary(false)}
                  className="rounded-full border border-foreground/15 p-2 text-foreground/70 transition hover:bg-foreground/5"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {/* Upload New Button section */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
                  <div>
                    <h4 className="font-bold text-primary">Nahrať nový obrázok</h4>
                    <p className="text-xs text-foreground/60">Priamo z vášho počítača do Supabase</p>
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        if (file.size > 5 * 1024 * 1024) {
                          setFlash({ type: "error", text: "Obrázok je príliš veľký. Maximálna veľkosť je 5MB." });
                          return;
                        }
                        setIsUploading(true);
                        const result = await uploadImage(file);
                        setIsUploading(false);

                        if (result.success && result.url) {
                          if (editItem) {
                            setEditItem({ ...editItem, image: result.url });
                          }
                          setFlash({ type: "success", text: "Obrázok bol úspešne nahratý." });
                          loadLibraryImages();
                        } else {
                          setFlash({ type: "error", text: result.error || "Chyba nahrávania." });
                        }
                        e.target.value = "";
                      }}
                      disabled={isUploading}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                    <span className={`inline-flex w-full cursor-pointer items-center justify-center rounded-xl px-5 py-2.5 text-sm font-bold shadow-sm transition ${isUploading ? 'bg-primary/50 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}>
                      {isUploading ? "Nahrávanie..." : "Vybrať súbor z PC"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {libraryImages.map((img) => (
                    <div key={img.name} className="group relative flex aspect-square flex-col overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-sm transition-shadow hover:shadow-md">
                      <div className="relative flex-1 bg-gray-100">
                        <Image src={img.url} alt={img.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                      </div>
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                        <button
                          onClick={() => {
                            if (editItem) {
                              setEditItem({ ...editItem, image: img.url });
                            }
                            setShowImageLibrary(false);
                          }}
                          className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-black shadow-sm hover:bg-gray-100"
                        >
                          Vybrať toto
                        </button>
                        <button
                          onClick={() => handleDeleteLibraryImage(img.name)}
                          className="rounded-xl border border-red-500 bg-red-500/20 px-4 py-2 text-sm font-bold text-white hover:bg-red-500/40"
                        >
                          Zmazať zo servera
                        </button>
                      </div>
                    </div>
                  ))}
                  {libraryImages.length === 0 && !isUploading && (
                    <p className="col-span-full py-10 text-center text-sm font-bold text-foreground/50">Galéria je prázdna.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
