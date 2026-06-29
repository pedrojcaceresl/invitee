import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "./globals.css";

const sora = Sora({ variable: "--font-sora", subsets: ["latin"], display: "swap" });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Invitee — Creá tu invitación y lista de regalos",
  description:
    "Creá en minutos una tarjeta de invitación y lista de regalos compartible con un solo link. Sin login.",
  openGraph: {
    title: "Invitee",
    description: "Invitaciones y listas de regalos en segundos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${sora.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-paper text-ink font-sans">{children}</body>
    </html>
  );
}
