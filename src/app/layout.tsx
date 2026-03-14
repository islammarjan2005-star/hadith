import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "Quran Player - Listen to the Holy Quran",
  description: "A Spotify-style Quran listening experience with multiple reciters",
  manifest: "/hadith/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Quran Player",
  },
  openGraph: {
    title: "Quran Player",
    description: "Listen to the Holy Quran with your favorite reciters",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#121212",
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
