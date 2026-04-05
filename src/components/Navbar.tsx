"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import type { BilingualText } from "@/lib/types";

interface NavLink {
  href: string;
  label: BilingualText;
}

const navLinks: NavLink[] = [
  { href: "/", label: { en: "Home", ta: "\u0BAE\u0BC1\u0B95\u0BAA\u0BCD\u0BAA\u0B95\u0BCD\u0B95\u0BAE\u0BCD" } },
  { href: "/guide", label: { en: "Govt 101", ta: "\u0B85\u0BB0\u0B9A\u0BC1 101" } },
  { href: "/departments", label: { en: "Departments", ta: "\u0BA4\u0BC1\u0BB1\u0BC8\u0B95\u0BB3\u0BCD" } },
  { href: "/budget", label: { en: "Budget", ta: "\u0BA8\u0BBF\u0BA4\u0BBF\u0BA8\u0BBF\u0BB2\u0BC8" } },
  { href: "/elections", label: { en: "Elections", ta: "\u0BA4\u0BC7\u0BB0\u0BCD\u0BA4\u0BB2\u0BCD\u0B95\u0BB3\u0BCD" } },
  { href: "/legislature", label: { en: "Legislature", ta: "\u0B9A\u0B9F\u0BCD\u0B9F\u0BAA\u0BCD\u0BAA\u0BC7\u0BB0\u0BB5\u0BC8" } },
  { href: "/districts", label: { en: "Districts", ta: "\u0BAE\u0BBE\u0BB5\u0B9F\u0BCD\u0B9F\u0B99\u0BCD\u0B95\u0BB3\u0BCD" } },
];

export function Navbar() {
  const { lang, toggleLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);

  const title: BilingualText = {
    en: "TN Gov Explorer",
    ta: "TN அரசு வழிகாட்டி",
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[#FFFBF0]/80 backdrop-blur-nav">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Title */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-2 rounded-sm gopuram-gradient" />
            <span className="text-lg font-bold text-[var(--color-text)] tracking-tight">
              {t(title)}
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] rounded-md
                  hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5
                  transition-colors duration-150"
              >
                {t(link.label)}
              </Link>
            ))}
          </div>

          {/* Right side: language toggle + mobile menu button */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)]
                px-3 py-1.5 text-sm font-medium transition-colors duration-150
                hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              aria-label="Toggle language"
            >
              <span className={lang === "en" ? "font-bold text-[var(--color-accent)]" : "text-[var(--color-text-secondary)]"}>
                EN
              </span>
              <span className="text-[var(--color-border)]">/</span>
              <span className={lang === "ta" ? "font-bold text-[var(--color-accent)]" : "text-[var(--color-text-secondary)]"}>
                {"\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD"}
              </span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-md text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[#FFFBF0]/95 backdrop-blur-nav">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-base font-medium text-[var(--color-text-secondary)] rounded-md
                  hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5
                  transition-colors duration-150"
              >
                {t(link.label)}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
