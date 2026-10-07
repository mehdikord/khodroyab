import type { Metadata } from "next";
import { Vazirmatn, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomDock } from "@/components/layout/MobileBottomDock";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "خودرو یاب — KHODROYAB | انتخاب مطمئن خودروهای وارداتی در مناطق آزاد",
  description:
    "شرکت تخصصی فروش و واردات خودروهای خارجی در مناطق آزاد تجاری. شفافیت قیمت، خرید امن، کارشناسی فنی و ظاهری، تنوع برندهای معتبر جهانی و پشتیبانی ۲۴ ساعته.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="min-h-screen bg-[#07090C] font-sans text-[#F5F5F5] antialiased selection:bg-[#FF6A00]/30 selection:text-[#F5F5F5] overflow-x-hidden">
        <Navbar />
        <main className="relative min-h-screen overflow-x-hidden">{children}</main>
        <Footer />
        <MobileBottomDock />
      </body>
    </html>
  );
}
