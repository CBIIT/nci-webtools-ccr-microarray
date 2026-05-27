// Adapted from: rat-commons/html/footer.html (NCI Big Footer pattern)
// Responsive patterns from: github.com/huuaho/SolidBento Footer component
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./Footer.module.css";

function parseVersionAndDate(versionString: string | undefined) {
  if (!versionString || versionString === "local")
    return { version: "dev", date: new Date().toISOString().split("T")[0] };

  const versionMatch = versionString.match(/(\d+\.\d+\.\d+)(_dev)?/);
  const version = versionMatch ? versionMatch[1] + (versionMatch[2] || "") : versionString;

  const dateMatch = versionString.match(/(\d{8})/)?.[1];
  const date = dateMatch
    ? `${dateMatch.slice(0, 4)}-${dateMatch.slice(4, 6)}-${dateMatch.slice(6, 8)}`
    : new Date().toISOString().split("T")[0];

  return { version, date };
}

export default function Footer() {
  const { version, date } = parseVersionAndDate(process.env.NEXT_PUBLIC_APP_VERSION);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer}>
      {/* Primary Section */}
      <div className={styles.usaFooterPrimarySection}>
        {/* Mobile: collapsible accordion (full-width, outside container) */}
        <div className={styles.mobileNav}>
          <details className={styles.usaFooterPrimaryContentCollapsible}>
            <summary>About</summary>
            <ul>
              <li className={styles.usaFooterSecondaryLink}>
                <Link href="/about">About MAAPster</Link>
              </li>
              <li className={styles.usaFooterSecondaryLink}>
                <a href="mailto:NCIMicroArrayWebAdmin@mail.nih.gov">Contact Us</a>
              </li>
            </ul>
            <div className={styles.versionInfo}>
              <div>Version: {version}</div>
              <div>Last Updated: {date}</div>
            </div>
          </details>
          <details className={styles.usaFooterPrimaryContentCollapsible}>
            <summary>Resources</summary>
            <ul>
              <li className={styles.usaFooterSecondaryLink}>
                <a href="https://ccr.cancer.gov/" target="_blank" rel="noopener noreferrer">
                  Center for Cancer Research
                </a>
              </li>
            </ul>
          </details>
          <details className={styles.usaFooterPrimaryContentCollapsible}>
            <summary>Policies</summary>
            <ul>
              <li className={styles.usaFooterSecondaryLink}>
                <a href="https://www.cancer.gov/policies/accessibility" target="_blank" rel="noopener noreferrer">Accessibility</a>
              </li>
              <li className={styles.usaFooterSecondaryLink}>
                <a href="https://www.cancer.gov/policies/foia" target="_blank" rel="noopener noreferrer">FOIA</a>
              </li>
              <li className={styles.usaFooterSecondaryLink}>
                <a href="https://www.cancer.gov/policies/privacy-security" target="_blank" rel="noopener noreferrer">Privacy &amp; Security</a>
              </li>
              <li className={styles.usaFooterSecondaryLink}>
                <a href="https://www.cancer.gov/policies/disclaimer" target="_blank" rel="noopener noreferrer">Disclaimers</a>
              </li>
              <li className={styles.usaFooterSecondaryLink}>
                <a href="https://www.hhs.gov/vulnerability-disclosure-policy/index.html" target="_blank" rel="noopener noreferrer">Vulnerability Disclosure</a>
              </li>
            </ul>
          </details>
        </div>

        {/* Desktop: grid columns (inside container) */}
        <div className="app-container">
        {/* Desktop: grid columns */}
        <div className={styles.desktopNav}>
          <div>
            <span className={styles.usaFooterNciListHeader}>About</span>
            <ul>
              <li className={styles.usaFooterSecondaryLink}>
                <Link href="/about">About MAAPster</Link>
              </li>
              <li className={styles.usaFooterSecondaryLink}>
                <a href="mailto:NCIMicroArrayWebAdmin@mail.nih.gov">Contact Us</a>
              </li>
            </ul>
            <div className={styles.versionInfo}>
              <div>Version: {version}</div>
              <div>Last Updated: {date}</div>
            </div>
          </div>
          <div>
            <span className={styles.usaFooterNciListHeader}>Resources</span>
            <ul>
              <li className={styles.usaFooterSecondaryLink}>
                <a href="https://ccr.cancer.gov/" target="_blank" rel="noopener noreferrer">
                  Center for Cancer Research
                </a>
              </li>
            </ul>
          </div>
          <div>
            <span className={styles.usaFooterNciListHeader}>Policies</span>
            <ul>
              <li className={styles.usaFooterSecondaryLink}>
                <a href="https://www.cancer.gov/policies/accessibility" target="_blank" rel="noopener noreferrer">Accessibility</a>
              </li>
              <li className={styles.usaFooterSecondaryLink}>
                <a href="https://www.cancer.gov/policies/foia" target="_blank" rel="noopener noreferrer">FOIA</a>
              </li>
              <li className={styles.usaFooterSecondaryLink}>
                <a href="https://www.cancer.gov/policies/privacy-security" target="_blank" rel="noopener noreferrer">Privacy &amp; Security</a>
              </li>
              <li className={styles.usaFooterSecondaryLink}>
                <a href="https://www.cancer.gov/policies/disclaimer" target="_blank" rel="noopener noreferrer">Disclaimers</a>
              </li>
              <li className={styles.usaFooterSecondaryLink}>
                <a href="https://www.hhs.gov/vulnerability-disclosure-policy/index.html" target="_blank" rel="noopener noreferrer">Vulnerability Disclosure</a>
              </li>
            </ul>
          </div>
        </div>
        </div>
      </div>

      {/* Secondary Section */}
      <div className={styles.usaFooterSecondarySection}>
        <div className="app-container">
        <div className={styles.usaFooterSecondarySectionRow}>
          <div>
            <a
              href="https://www.cancer.gov"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              <span className={styles.logoAgencyName}>National Cancer Institute</span>
              <span className={styles.logoParentOrganization}>at the National Institutes of Health</span>
            </a>
          </div>
          <div className={styles.usaFooterSecondarySectionRight}>
            <div className={styles.usaFooterContactHeading}>Contact Us</div>
            <div className={styles.usaFooterContactInfo}>
              <a href="https://livehelp.cancer.gov/app/chat/chat_landing" target="_blank" rel="noopener noreferrer">Live Chat</a>
              <a href="tel:1-800-4-CANCER">1-800-4-CANCER</a>
              <a href="mailto:NCIinfo@nih.gov">NCIinfo@nih.gov</a>
            </div>
          </div>
        </div>

        <div className={styles.usaFooterSecondarySectionRow}>
          <div>
            <div className={styles.usaFooterSocialHeading}>Follow us</div>
            <div className={styles.usaFooterSocialLinks}>
              <a className={styles.usaSocialLink} href="https://www.facebook.com/cancer.gov" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" role="img" aria-labelledby="facebook-title"><title id="facebook-title">Facebook</title><rect fill="none" height="24" width="24"/><path d="M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-2 c-0.55,0-1,0.45-1,1v2h3v3h-3v6.95C18.05,21.45,22,17.19,22,12z"/></svg>
              </a>
              <a className={styles.usaSocialLink} href="https://twitter.com/thenci" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" role="img" aria-labelledby="x-title"><title id="x-title">X</title><path d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10zm5.2-15.6L13.3 11l4.3 6.2h-3.1L11.6 13 8 17.2h-.9l4.1-4.8-4.1-6h3.1l2.7 3.9 3.4-3.9h.9zm-5.6 5.4.4.6 2.8 4h1.4l-3.5-5-.4-.6-2.6-3.7H8.3l3.3 4.7z"/></svg>
              </a>
              <a className={styles.usaSocialLink} href="https://www.instagram.com/nationalcancerinstitute/" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" role="img" aria-labelledby="instagram-title"><title id="instagram-title">Instagram</title><path d="M12,10a2,2,0,1,0,2,2A2,2,0,0,0,12,10Z"/><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm6,12.69A3.32,3.32,0,0,1,14.69,18H9.31A3.32,3.32,0,0,1,6,14.69V9.31A3.32,3.32,0,0,1,9.31,6h5.38A3.32,3.32,0,0,1,18,9.31Z"/><path d="M16.94,9.31a2.25,2.25,0,0,0-2.25-2.25H9.31A2.25,2.25,0,0,0,7.06,9.31v5.38a2.25,2.25,0,0,0,2.25,2.25h5.38a2.25,2.25,0,0,0,2.25-2.25h0ZM12,15.09A3.09,3.09,0,1,1,15.09,12,3.09,3.09,0,0,1,12,15.09Zm3.77-5.75a.79.79,0,0,1-.55.23.83.83,0,0,1-.55-.23.78.78,0,0,1,0-1.11A.82.82,0,0,1,15.22,8a.78.78,0,0,1,.55,1.33Z"/></svg>
              </a>
              <a className={styles.usaSocialLink} href="https://www.youtube.com/NCIgov" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" role="img" aria-labelledby="youtube-title"><title id="youtube-title">YouTube</title><path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm5.75,12.91A1.49,1.49,0,0,1,16.69,16a34.65,34.65,0,0,1-4.69.26A34.65,34.65,0,0,1,7.31,16a1.49,1.49,0,0,1-1.06-1.06A15.88,15.88,0,0,1,6,12a15.88,15.88,0,0,1,.25-2.91A1.49,1.49,0,0,1,7.31,8,34.65,34.65,0,0,1,12,7.77,34.65,34.65,0,0,1,16.69,8a1.49,1.49,0,0,1,1.06,1.06A15.88,15.88,0,0,1,18,12,15.88,15.88,0,0,1,17.75,14.91Z"/><polygon points="10.77 13.78 13.91 12 10.77 10.22 10.77 13.78"/></svg>
              </a>
              <a className={styles.usaSocialLink} href="https://www.linkedin.com/company/nationalcancerinstitute/" target="_blank" rel="noopener noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" role="img" aria-labelledby="linkedin-title"><title id="linkedin-title">LinkedIn</title><path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M8.912001,17.584H6.584v-7.472h2.328001V17.584z M7.744,9.104C6.992,9.104,6.4,8.488,6.4,7.76c0-0.752,0.592-1.344,1.344-1.344c0.728,0,1.343999,0.592,1.343999,1.344 C9.087999,8.488,8.472,9.104,7.744,9.104z M17.6,17.584h-2.328v-3.64c0-0.856-0.024001-1.967999-1.216001-1.967999 s-1.392,0.927999-1.392,1.912v3.696H10.36v-7.472h2.224v1.008h0.024c0.464-0.752,1.296-1.216001,2.199999-1.192 c2.352001,0,2.792,1.552001,2.792,3.544001C17.6,13.472,17.6,17.584,17.6,17.584z"/></svg>
              </a>
            </div>
          </div>
          <div className={styles.usaFooterSecondarySectionRight}>
            <div className={styles.usaFooterAddress}>
              <a href="https://www.hhs.gov/" target="_blank" rel="noopener noreferrer">U.S. Department of Health and Human Services</a>
              <a href="https://www.nih.gov/" target="_blank" rel="noopener noreferrer">National Institutes of Health</a>
              <a href="https://www.cancer.gov/" target="_blank" rel="noopener noreferrer">National Cancer Institute</a>
              <a href="https://usa.gov/" target="_blank" rel="noopener noreferrer">USA.gov</a>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Back to Top */}
      <div className={`${styles.usaFooterReturnToTop} ${!showBackToTop ? styles.usaFooterReturnToTopHidden : ""}`}>
        <a href="#" onClick={scrollToTop} aria-label="Back to Top">
          <span>Back to</span>
          <span>Top</span>
        </a>
      </div>
    </footer>
  );
}
