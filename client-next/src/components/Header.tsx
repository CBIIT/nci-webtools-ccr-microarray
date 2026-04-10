// Legacy: client/public/index.html (header section)
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";

export default function Header() {
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  function handleSearch() {
    if (!search.trim()) return;
    window.open(`https://www.google.com/search?q=site:maap.ccr.cancer.gov/ ${search}`, "_blank");
  }

  return (
    <header>
      {/* NCI Logo Bar */}
      <div className={styles.headerNci}>
        <div className="app-container d-flex align-items-center justify-content-between">
          <a href="https://ccr.cancer.gov/" target="_blank" rel="noopener noreferrer">
            <img src="/assets/img/nci-ccr-logo.png" alt="National Cancer Institute" />
          </a>
          <div className={styles.searchGroup}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search"
              aria-label="Site search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
            />
            <button className={styles.searchButton} onClick={handleSearch} aria-label="Submit search">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" style={{ position: "relative", top: "-1px" }}><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/></svg>
            </button>
          </div>
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
