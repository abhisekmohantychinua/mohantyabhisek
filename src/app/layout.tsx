import "./globals.css";

import { GoogleTagManager } from "@next/third-parties/google";
import type { JSX } from "react";
import { Toaster } from "sonner";

import Cta from "@/components/shared/cta";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID as string;
if (!GTM_ID) {
  throw new Error("Google TagManager ID not provided.");
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body className="antialiased">
        <header>
          <Navbar />
        </header>
        <main>
          {children}
          <Cta />
        </main>
        <Footer />
        <Toaster position="bottom-right" richColors />
      </body>
      <GoogleTagManager gtmId={GTM_ID} />
    </html>
  );
}
