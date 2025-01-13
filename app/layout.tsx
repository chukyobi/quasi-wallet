"use client"; 

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Preloader from "../components/Preloader"; 

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const startLoading = () => setLoading(true);
    const stopLoading = () => setLoading(false);

    startLoading(); 
    setTimeout(stopLoading, 2000); 

    return () => stopLoading();
  }, [pathname]); 

  return (
    <html lang="en">
      <body className="flex flex-col bg-gradient-to-r from-black via-gray-900 to-black min-h-screen font-[var(--font-geist-sans)]">
        <SessionProvider>
          {loading && <Preloader />} {/* Show preloader when loading */}
          <main className="flex-grow">
            {!loading && children} {/* Show children when not loading */}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
