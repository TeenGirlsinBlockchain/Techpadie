import type { Metadata } from "next";
import { Inter, Lexend, Caveat, Kalam } from "next/font/google";
import { Toaster } from 'react-hot-toast';

import "@/app/_styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

const kalam = Kalam({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-kalam",
});

export const metadata: Metadata = {
  title: "Techpadie - Learn Blockchain & Earn",
  description:
    "A multilingual gamified learning platform for blockchain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${lexend.variable} ${caveat.variable} ${kalam.variable} antialiased bg-white text-[#0F172A]`}
      >
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}