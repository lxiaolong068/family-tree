import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "How to Make a Family Tree | Professional Online Family Tree Maker",
  description: "Learn how to make a beautiful family tree with our free online tool. Step-by-step guide, templates & easy visualization. Start preserving your family history today!",
  keywords: "how to make a family tree, family tree maker, family tree templates, ancestry chart, genealogy tool",
  openGraph: {
    title: "How to Make a Family Tree | Professional Online Family Tree Maker",
    description: "Learn how to make a beautiful family tree with our free online tool. Step-by-step guide, templates & easy visualization.",
    url: "https://www.family-tree.cc",
    siteName: "Family Tree Maker | How to Make a Family Tree",
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
        className={`${inter.variable} ${robotoMono.variable} antialiased flex flex-col min-h-screen`}
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
