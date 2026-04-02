import type { Metadata } from "next";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAAPster - MicroArray Analysis Platform",
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
        <nav className="navbar navbar-dark bg-dark">
          <div className="app-container w-100">
            <span className="navbar-brand">MAAPster</span>
          </div>
        </nav>
        <main className="app-container py-3 flex-grow-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
