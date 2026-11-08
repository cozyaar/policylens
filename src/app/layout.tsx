import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PolicyLens — Insurance, Rated Honestly",
  description:
    "An independent policy intelligence system that reads insurance documents, explains risks in plain language, scores policies transparently, and helps you make smarter insurance decisions.",
  keywords: ["health insurance", "policy comparison", "insurance score", "policy analysis", "PolicyLens"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
