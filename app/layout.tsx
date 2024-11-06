"use client";  // Mark as Client Component

//import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

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

// export const metadata: Metadata = {
//   title: "quasi wallet",
//   description: "secure your seed phrases",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col bg-gradient-to-r from-black via-gray-900 to-black min-h-screen font-[var(--font-geist-sans)]">
        <SessionProvider>
          <main className="flex-grow">
            {children}
          </main>
        </SessionProvider>
      </body>
    </html>
  );
}
