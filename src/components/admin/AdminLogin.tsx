"use client";

import { useState } from "react";
import Image from "next/image";
import { LockKeyhole } from "lucide-react";
import { signIn } from "@/lib/supabaseAuth";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // We hardcode the email so the user only has to type the password, 
  // keeping the experience identical to the old system.
  const masterEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@beatea.sk";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const result = await signIn(masterEmail, password);
      if (!result.success) {
        setError(result.error);
        return;
      }
      // Auth state change will trigger parent to show dashboard
    } catch {
      setError("Prihlásenie zlyhalo. Skúste znova.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main suppressHydrationWarning className="flex min-h-screen items-center justify-center bg-[#fff8ee] px-4 py-10">
      <section suppressHydrationWarning className="w-full max-w-md rounded-[28px] border border-white/70 bg-white/95 p-6 shadow-xl md:p-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-foreground/10 bg-white">
            <Image src="/assets/logo.png" alt="Bee Tea logo" fill className="object-cover" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">Privátny vstup</p>
            <h1 className="text-2xl font-black text-foreground">Admin panel</h1>
          </div>
        </div>

        <p className="mb-5 text-sm text-foreground/70">
          Tento panel je zabezpečený Supabase autentifikáciou. Prihláste sa pomocou vášho admin účtu.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-4">

          <label className="grid gap-1 text-sm font-semibold text-foreground/70">
            Heslo
            <input
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-xl border border-foreground/15 bg-white px-4 py-3 outline-none focus:border-primary"
              placeholder="Zadajte admin heslo"
            />
          </label>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white hover:bg-black/85 disabled:opacity-60"
          >
            <LockKeyhole className="h-4 w-4" />
            {pending ? "Prihlasujem..." : "Prihlásiť"}
          </button>
        </form>
      </section>
    </main>
  );
}
