"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { mainNav } from "@/lib/site";
import { buttonStyles } from "./ButtonLink";

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative border-b border-line bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
        <Link
          href="/"
          onClick={closeMenu}
          className="font-display text-xl font-bold tracking-tight"
        >
          Peoples<span className="text-jade">HR</span>
        </Link>

        <button
          type="button"
          className="rounded-md border border-line px-3 py-2 text-sm font-semibold md:hidden"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}
        </button>

        <nav
          id="main-nav"
          aria-label="Main"
          className={`${menuOpen ? "flex" : "hidden"} absolute inset-x-0 top-full z-20 flex-col gap-1 border-b border-line bg-surface px-5 pb-5 md:static md:flex md:flex-row md:items-center md:gap-2 md:border-0 md:p-0`}
        >
          {mainNav.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                aria-current={active ? "page" : undefined}
                className={`rounded-md px-3 py-2 font-medium hover:bg-paper ${
                  active ? "text-jade" : "text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/#book-demo"
            onClick={closeMenu}
            className={`${buttonStyles.primary} mt-2 py-2 md:mt-0 md:ml-3`}
          >
            Book a demo
          </Link>
        </nav>
      </div>
    </header>
  );
}
