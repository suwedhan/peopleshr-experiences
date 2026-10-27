import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "HR tools and guides for growing businesses | PeoplesHR" },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

// Each experience starts from a question a visitor might actually have.
const experiences = [
  {
    question: "Is manual HR admin costing us more than we think?",
    summary:
      "Estimate the hours and money your team loses to manual payroll, attendance and leave work, and what you could save.",
    href: "/cost-calculator",
    action: "Calculate your cost",
  },
  {
    question: "Which HR software package fits our business?",
    summary:
      "Answer a few questions about your team and priorities. Get a recommended plan and the modules that matter to you.",
    href: "/plan-finder",
    action: "Find your plan",
  },
  {
    question: "How do we get payroll, leave and compliance right?",
    summary:
      "Practical guides that answer common HR and payroll questions, with templates and next steps.",
    href: "/resources",
    action: "Browse HR guides",
  },
];

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.name,
          url: siteConfig.url,
          description: siteConfig.description,
        }}
      />

      <section className="mx-auto max-w-6xl px-5 pt-16 pb-12 md:pt-24">
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl">
          Answers for the HR questions that come before buying software
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft md:text-xl">
          Free tools and guides from PeoplesHR for growing businesses. Use any
          of them without signing up.
        </p>
      </section>

      <section aria-labelledby="tools-heading" className="mx-auto max-w-6xl px-5">
        <h2 id="tools-heading" className="sr-only">
          Tools and guides
        </h2>
        <ul className="border-t border-line">
          {experiences.map((item) => (
            <li key={item.href} className="border-b border-line">
              <Link
                href={item.href}
                className="group grid gap-3 py-8 md:grid-cols-[3fr_2fr] md:gap-12 md:py-10"
              >
                <span className="font-display text-2xl font-bold leading-tight tracking-tight group-hover:text-jade md:text-4xl">
                  {item.question}
                </span>
                <span className="flex flex-col gap-3">
                  <span className="text-ink-soft">{item.summary}</span>
                  <span className="font-semibold text-jade underline-offset-4 group-hover:underline">
                    {item.action}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section id="book-demo" className="mx-auto max-w-3xl scroll-mt-8 px-5 pt-24">
        <LeadCaptureForm
          source="home"
          title="Talk to a PeoplesHR specialist"
          description="Tell us a little about your team and we’ll set up a 30-minute demo focused on what you need."
          submitLabel="Request a demo"
          successTitle="Demo requested"
          successMessage="Thanks. A PeoplesHR specialist will email you within one business day to pick a time."
          askTeamSize
        />
      </section>
    </>
  );
}
