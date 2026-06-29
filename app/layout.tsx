import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

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
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-gray-900">{children}</body>
    </html>
  );
}
