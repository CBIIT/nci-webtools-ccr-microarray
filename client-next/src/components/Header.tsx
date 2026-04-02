// Legacy: client/public/index.html (header section)
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();

  return (
    <header>
      {/* NCI Logo Bar */}
      <div className={styles.headerNci}>
        <div className="app-container">
          <a href="https://ccr.cancer.gov/" target="_blank" rel="noopener noreferrer">
            <img src="/assets/img/nci-ccr-logo.png" alt="National Cancer Institute" />
          </a>
        </div>
      </div>

      {/* App Banner */}
      <div className={styles.headerBanner}>
        <div className="app-container">
          <span className={styles.info}>
            <span className={styles.infoHighlight}>M</span>icro
            <span className={styles.infoHighlight}>A</span>rray{" "}
            <span className={styles.infoHighlight}>A</span>nalysis{" "}
            <span className={styles.infoHighlight}>P</span>ipeline
            {" "}(<span className={styles.infoHighlight}>MAAP</span>ster)
          </span>
          <span className={styles.infoAffix}>For Affymetrix human and mouse data</span>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className={styles.headerNav}>
        <div className="app-container">
          <ul className={styles.navList}>
            <li className={`${styles.navItem} ${pathname === "/" || pathname === "/about" ? styles.navItemActive : ""}`}>
              <Link href="/about">ABOUT</Link>
            </li>
            <li className={`${styles.navItem} ${pathname === "/analysis" || pathname.startsWith("/GSE") ? styles.navItemActive : ""}`}>
              <Link href="/analysis">ANALYSIS</Link>
            </li>
            <li className={`${styles.navItem} ${pathname === "/help" ? styles.navItemActive : ""}`}>
              <Link href="/help">HELP</Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
