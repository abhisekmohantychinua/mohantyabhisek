import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import GSAPInit from "@/components/shared/gsap-init";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <header>
          <Navbar />
        </header>
        <main>{children}</main>
        <Footer />
        <GSAPInit />
        <Toaster position="bottom-right" richColors />
      </body>
      <GoogleAnalytics gaId="G-1Q5WZHE67B" />
    </html>
  );
}
