import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "CCBR Microarray Analysis Workflow",
  description: "MicroArray Analysis for Affymetrix human and mouse data",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="d-flex flex-column min-vh-100">
        <Header />
        <main className="app-container flex-grow-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
