"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminLogin from "@/components/admin/AdminLogin";
import { getSession, onAuthStateChange } from "@/lib/supabaseAuth";

export default function PortalClientWrapper({ slug }: { slug: string }) {
    const router = useRouter();
    const expectedSlug = process.env.NEXT_PUBLIC_ADMIN_PORTAL_SLUG || "portal-vstup-x9m2k7q4";

    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        if (slug !== expectedSlug) {
            return;
        }

        getSession().then((session) => {
            setIsAuthenticated(!!session);
        });

        const subscription = onAuthStateChange((authed) => {
            setIsAuthenticated(authed);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [slug, expectedSlug]);

    if (slug !== expectedSlug) {
        notFound();
    }

    if (isAuthenticated === null) {
        return (
            <div suppressHydrationWarning className="flex min-h-screen items-center justify-center bg-[#fff8ee]">
                <p className="animate-pulse text-lg font-bold text-primary">Načítavam...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AdminLogin />;
    }

    return <AdminDashboard />;
}
