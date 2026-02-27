import PortalClientWrapper from "./PortalClientWrapper";

export function generateStaticParams() {
    const secretSlug = process.env.NEXT_PUBLIC_ADMIN_PORTAL_SLUG || "portal-vstup-x9m2k7q4";
    return [{ slug: secretSlug }];
}

export default async function PortalSlugPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    return <PortalClientWrapper slug={slug} />;
}
