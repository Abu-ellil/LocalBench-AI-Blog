"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/videos", label: "ملاحظات المختبر" },
  { href: "/leaderboard", label: "لوحة المتصدرين" },
  { href: "/gpus", label: "دليل كروت الشاشة" },
  { href: "/setup", label: "إعداداتي" },
  { href: "/resources", label: "مصادر" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container site-nav-shell">
        <Link href="/" className="site-logo">
          <div className="site-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12h3l3-7 4 14 3-7h3l2 0" />
            </svg>
          </div>
          <div style={{ lineHeight: 1.15 }}>
            <div className="site-logo-text-1">LocalBench AI</div>
            <div className="site-logo-text-2">ذكاء اصطناعي · مختبرات · مقارنات</div>
          </div>
        </Link>

        <button
          type="button"
          className={`nav-menu-button ${menuOpen ? "nav-menu-button-open" : ""}`}
          aria-expanded={menuOpen}
          aria-label="فتح القائمة"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-menu ${menuOpen ? "nav-menu-open" : ""}`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nav-link ${pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)) ? "nav-link-active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://www.youtube.com/channel/UClnq0KE_pVQ27O3iT1ZriUg"
            target="_blank"
            rel="noopener"
            className="nav-youtube-link"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            يوتيوب
          </a>
        </nav>
      </div>
    </header>
  );
}
