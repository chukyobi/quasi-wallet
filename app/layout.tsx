import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navigation from "../components/Navigation";

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

export const metadata: Metadata = {
  title: "quasi wallet",
  description: "secure your seed phrases",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
      
        <Navigation /> 

        {/* Main Content */}
        <main className="flex-grow ">
          {children}
        </main>

       
      </body>
    </html>
  );
}
