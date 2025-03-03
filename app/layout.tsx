import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZapChatBR",
  description: "Automatizando suas necessidades.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="bg-gray-800 p-4">
          <div className="container mx-auto flex justify-between">
            <Link href="/" className="text-white font-bold text-lg">ZapChatBR</Link>
            <Link href="/login" className="text-blue-300 hover:text-blue-500">Login</Link>
            <Link href="/dashboard" className="text-blue-300 hover:text-blue-500">Dashboard</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
