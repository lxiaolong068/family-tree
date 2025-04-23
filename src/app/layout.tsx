import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "How to Make a Family Tree | Professional Online Family Tree Maker",
  description: "Learn how to make a beautiful family tree with our free online tool. Step-by-step guide, templates & easy visualization. Start preserving your family history today!",
  keywords: "how to make a family tree, family tree maker, family tree templates, ancestry chart, genealogy tool",
  openGraph: {
    title: "How to Make a Family Tree | Professional Online Family Tree Maker",
    description: "Learn how to make a beautiful family tree with our free online tool. Step-by-step guide, templates & easy visualization.",
    url: "https://your-domain.com",
    siteName: "Family Tree Maker",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How to Make a Family Tree | Professional Online Family Tree Maker",
    description: "Learn how to make a beautiful family tree with our free online tool. Step-by-step guide & templates.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
