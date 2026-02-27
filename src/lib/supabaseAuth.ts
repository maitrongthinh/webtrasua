import { supabase } from "./supabase";

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { success: false as const, error: error.message };
    }

    return { success: true as const, user: data.user };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        return { success: false as const, error: error.message };
    }
    return { success: true as const };
}

export async function getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) {
        return null;
    }
    return data.session;
}

export function onAuthStateChange(callback: (isAuthenticated: boolean) => void) {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        callback(!!session);
    });
    return data.subscription;
}
