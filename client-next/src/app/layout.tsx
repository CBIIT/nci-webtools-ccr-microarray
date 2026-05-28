import type { Metadata } from "next";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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
      {GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="gtag-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');`}
          </Script>
        </>
      )}
      <body className="d-flex flex-column min-vh-100">
        <Providers>
          <Header />
          <main className="app-container flex-grow-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
