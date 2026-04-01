import type { Metadata } from "next";
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
      <body>
        <nav className="navbar navbar-dark bg-dark px-3">
          <span className="navbar-brand">MAAPster</span>
        </nav>
        <main className="container-fluid py-3">{children}</main>
      </body>
    </html>
  );
}
