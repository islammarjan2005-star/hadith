import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "Noor — Illuminate Your Recitation",
  description: "A beautiful Quran listening and reading experience with multiple reciters, verse-by-verse audio, and daily inspiration",
  manifest: "/hadith/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Noor",
  },
  openGraph: {
    title: "Noor — Quran",
    description: "Listen to and read the Holy Quran with your favorite reciters",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0e2e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
