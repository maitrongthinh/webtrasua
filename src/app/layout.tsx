import type { Metadata } from "next";
import { Montserrat, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const headingFont = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-heading",
});

const bodyFont = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Beatea | Premium Bubble Tea",
  description: "Exkluzívny zážitok z bubble tea a prémiových snackov pre slovenský trh.",
  openGraph: {
    title: "Beatea | Premium Bubble Tea",
    description: "Exkluzívny zážitok z bubble tea a prémiových snackov pre slovenský trh.",
    url: "https://beatea.sk",
    siteName: "Beatea",
    images: [
      {
        url: "/assets/meta-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Beatea Premium Bubble Tea",
      },
    ],
    locale: "sk_SK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Beatea | Premium Bubble Tea",
    description: "Exkluzívny zážitok z bubble tea a prémiových snackov pre slovenský trh.",
    images: ["/assets/meta-cover.jpg"],
  },
  icons: {
    icon: "/assets/logo.png",
    shortcut: "/assets/logo.png",
    apple: "/assets/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" suppressHydrationWarning>
      <body className={`${headingFont.variable} ${bodyFont.variable} antialiased`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
