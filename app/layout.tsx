import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import CustomCursor from "@/components/CustomCursor";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Nozris | The Standard in Digital Asset Protection",
  description: "Military-grade software licensing and protection for Web, Mobile, Games, and Enterprise Desktop applications.",
  metadataBase: new URL('https://nozris.com'),
};

import LayoutContent from "@/components/LayoutContent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-black text-white antialiased cursor-none">
        <CustomCursor />
        {/* Navbar and Footer are globally applied EXCEPT for client dashboard which has its own layout */}
        <LayoutContent>{children}</LayoutContent>
      </body>
    </html>
  );
}
