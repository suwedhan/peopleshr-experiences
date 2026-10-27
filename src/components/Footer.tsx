import Link from "next/link";
import { mainNav } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[2fr_1fr]">
        <div>
          <p className="font-display text-xl font-bold">
            Peoples<span className="text-saffron">HR</span>
          </p>
          <p className="mt-3 max-w-md text-white/80">
            HR and payroll software for growing businesses across multiple
            markets.
          </p>
        </div>

        <nav aria-label="Footer">
          <ul className="space-y-2">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/90 hover:text-white hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#book-demo" className="text-white/90 hover:text-white hover:underline">
                Book a demo
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/15">
        <p className="mx-auto max-w-6xl px-5 py-5 text-sm text-white/70">
          Prototype built for the PeoplesHR Web Experience Engineer assessment.
          Plans, prices and figures shown are illustrative.
        </p>
      </div>
    </footer>
  );
}
