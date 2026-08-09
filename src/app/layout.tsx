import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/context/cart-context";
import { GuestCartMerger } from "@/components/cart/guest-cart-merger";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Storefront — Modern E-Commerce",
  description: "Curated products for modern living. Shop electronics, clothing, home goods, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <CartProvider>
          <GuestCartMerger />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
