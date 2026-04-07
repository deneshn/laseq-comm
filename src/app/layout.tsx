import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "LaseQ Comm — Distributed Acoustic Sensing",
  description:
    "LaseQ Comm pioneers distributed acoustic sensing technology, turning fiber optic cables into intelligent sensing networks for critical infrastructure.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#020b18] text-slate-200">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
