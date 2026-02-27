import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("⚠️ UPOZORNENIE: Chýbajú Supabase environment variables! Nastavte ich v Netlify.");
}

// Zabraňuje zlyhaniu build-u (SSG) ak na Netlify ešte nie sú nastavené premenné
export const supabase = createClient(
    supabaseUrl || "https://missing-url.supabase.co",
    supabaseAnonKey || "missing-key"
);
