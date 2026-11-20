import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI ATLAS — The Complete Artificial Intelligence Platform",
  description:
    "Explore AI. Understand Intelligence. Build the Future. Comprehensive independent platform for AI education, tool discovery, model benchmarks, prompt engineering, and interactive research.",
  keywords: [
    "Artificial Intelligence",
    "Machine Learning",
    "LLM",
    "Deep Learning",
    "AI Tools Directory",
    "Prompt Engineering",
    "AI Agents",
    "Ollama",
    "Local AI",
    "Neural Networks",
  ],
  authors: [{ name: "AI ATLAS Research Consortium" }],
  openGraph: {
    title: "AI ATLAS — Explore AI. Understand Intelligence. Build the Future.",
    description:
      "The complete platform for understanding, discovering, learning and building Artificial Intelligence.",
    type: "website",
    locale: "en_US",
    siteName: "AI ATLAS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-atlas-bg text-foreground flex flex-col antialiased selection:bg-atlas-blue/30 selection:text-white bg-grid-pattern">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
