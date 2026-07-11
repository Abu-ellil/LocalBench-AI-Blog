import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "LocalBench AI — نماذج محلية · مختبرات · مقارنات",
  description:
    "نماذج LLM محلية، كروت شاشة استهلاك، prompts، كود، ومخرجات حقيقية من الفيديوهات.",
  openGraph: {
    title: "LocalBench AI",
    description: "نماذج محلية، كروت شاشة، prompts، كود، ومخرجات حقيقية من الفيديوهات.",
    siteName: "LocalBench AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&family=Oxanium:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <main style={{ minHeight: "100vh" }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
