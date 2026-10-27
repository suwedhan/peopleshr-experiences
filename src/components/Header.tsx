"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav } from "@/lib/site";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => setMenuOpen(false);

  // Stronger shadow once the page scrolls, so the floating bar stands out
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the mobile menu is open: Escape closes it (and returns focus to
  // the button), and tapping anywhere outside the header closes it.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  const linkClass = (href: string) =>
    `rounded-full px-4 py-2 font-medium transition-colors hover:bg-paper ${
      pathname.startsWith(href) ? "text-jade" : "text-ink"
    }`;

  return (
    <header className="sticky top-0 z-40 bg-linear-to-b from-paper via-paper/70 to-transparent px-3 pt-3 pb-2 md:px-5 md:pt-4">
      <div ref={headerRef} className="relative mx-auto max-w-6xl">
        {/* The floating, rounded bar */}
        <div
          className={`flex items-center justify-between gap-4 rounded-full border border-line/70 bg-surface/85 py-2 pr-2 pl-5 backdrop-blur-md transition-shadow duration-300 ${
            scrolled || menuOpen
              ? "shadow-[0_8px_30px_rgba(16,42,51,0.12)]"
              : "shadow-[0_2px_10px_rgba(16,42,51,0.06)]"
          }`}
        >
          <Link href="/" onClick={closeMenu} className="font-display text-xl font-bold tracking-tight">
            Peoples<span className="text-jade">HR</span>
          </Link>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                className={linkClass(item.href)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#book-demo"
              className="ml-2 rounded-full bg-jade px-5 py-2.5 font-semibold text-white transition-colors hover:bg-jade-dark"
            >
              Request a demo
            </Link>
          </nav>

          {/* Mobile hamburger button: the three lines animate into an X */}
          <button
            ref={menuButtonRef}
            type="button"
            className="flex size-11 items-center justify-center rounded-full transition-colors hover:bg-paper md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span aria-hidden="true" className="relative block h-3.5 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 rounded-full bg-ink transition-all duration-300 ${
                  menuOpen ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute top-1.5 left-0 block h-0.5 w-5 rounded-full bg-ink transition-opacity duration-200 ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 rounded-full bg-ink transition-all duration-300 ${
                  menuOpen ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>

        {/* Mobile dropdown: a rounded card floating under the bar */}
        <nav
          id="mobile-nav"
          aria-label="Main"
          className={`absolute inset-x-0 top-full mt-2 origin-top rounded-3xl border border-line/70 bg-surface p-3 shadow-[0_12px_40px_rgba(16,42,51,0.16)] transition duration-200 md:hidden ${
            menuOpen ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
          }`}
        >
          <ul className="flex flex-col">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  aria-current={pathname.startsWith(item.href) ? "page" : undefined}
                  className={`block ${linkClass(item.href)} py-3 text-lg`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#book-demo"
            onClick={closeMenu}
            className="mt-2 block rounded-full bg-jade px-5 py-3 text-center font-semibold text-white transition-colors hover:bg-jade-dark"
          >
            Request a demo
          </Link>
        </nav>
      </div>
    </header>
  );
}
