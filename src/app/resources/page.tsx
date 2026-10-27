import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ResourceExplorer } from "@/components/resources/ResourceExplorer";
import { ARTICLES } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

const title = "HR and payroll guides for growing businesses";
const description =
  "Practical guides on payroll, EPF and ETF, attendance, leave and choosing HR software, with free templates and tools from PeoplesHR.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/resources" },
  openGraph: { title, description, url: "/resources" },
};

// Most recently updated first
const articles = [...ARTICLES].sort((a, b) => b.updated.localeCompare(a.updated));

export default function ResourcesPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: title,
          description,
          url: `${siteConfig.url}/resources`,
          mainEntity: {
            "@type": "ItemList",
            itemListElement: articles.map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${siteConfig.url}/resources/${a.slug}`,
              name: a.title,
            })),
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "HR guides", item: `${siteConfig.url}/resources` },
          ],
        }}
      />

      <section className="mx-auto max-w-6xl px-5 pt-12 pb-10 md:pt-16">
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
          HR and payroll guides for growing businesses
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-soft">
          Clear answers on payroll, EPF and ETF, attendance, leave and choosing
          HR software. Each guide ends with a free tool or template so you can
          put it into practice.
        </p>
      </section>

      <section aria-label="All guides" className="mx-auto max-w-6xl px-5">
        <ResourceExplorer
          articles={articles.map(({ slug, title, description, topic, readingMinutes, quickAnswer }) => ({
            slug,
            title,
            description,
            topic,
            readingMinutes,
            quickAnswer,
          }))}
        />
      </section>

      <section aria-labelledby="tools-heading" className="mx-auto mt-20 max-w-6xl px-5">
        <h2 id="tools-heading" className="text-3xl font-bold tracking-tight">
          Prefer to work it out for your business?
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Link
            href="/cost-calculator"
            className="group rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-jade"
          >
            <span className="block font-display text-xl font-bold group-hover:text-jade">HR admin cost calculator</span>
            <span className="mt-2 block text-ink-soft">
              Estimate the hours and money spent on manual payroll, attendance and leave.
            </span>
          </Link>
          <Link
            href="/plan-finder"
            className="group rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-jade"
          >
            <span className="block font-display text-xl font-bold group-hover:text-jade">Plan finder</span>
            <span className="mt-2 block text-ink-soft">
              Answer six questions and get a recommended HR software plan.
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
