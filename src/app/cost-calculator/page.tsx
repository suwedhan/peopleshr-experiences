import type { Metadata } from "next";
import { CostCalculator } from "@/components/cost-calculator/CostCalculator";
import { JsonLd } from "@/components/JsonLd";
import { ASSUMPTIONS, PROCESSES } from "@/lib/calculator";
import { siteConfig } from "@/lib/site";

const title = "HR admin cost calculator: what manual payroll and attendance cost you";
const description =
  "Estimate the hours and money your business spends on manual payroll, attendance, leave and employee records, and whether automating them is worth it. Free, no sign-up.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/cost-calculator" },
  openGraph: { title, description, url: "/cost-calculator" },
};

// Shown on the page and in FAQPage structured data, so search engines and
// AI assistants can quote direct answers.
const faqs = [
  {
    question: "How much time does manual payroll and HR admin take?",
    answer:
      "In our model, a business that handles payroll, attendance, leave and employee records mostly by hand spends around 70 minutes of HR time per employee each month. For 150 employees, that is roughly 175 hours a month, or about one full-time person.",
  },
  {
    question: "How accurate is this estimate?",
    answer:
      "It is a starting point, not a quote. It uses typical time per employee for each task, adjusted for how automated your current process is. Your real figures depend on your pay structures, shift patterns and number of locations. A PeoplesHR specialist can refine it with you.",
  },
  {
    question: "Does saving HR admin time mean reducing staff?",
    answer:
      "Usually not. Most businesses move the time saved to work that was being squeezed out, like hiring, onboarding and employee engagement. The cost figures show the value of that time, not a cash cut.",
  },
  {
    question: "Why does the calculator sometimes say the saving is modest?",
    answer:
      "For small teams, the time saved may not yet cover the cost of HR software. In that case, tidying up your existing processes can be a better first step, and automation makes more sense as you grow.",
  },
];

export default function CostCalculatorPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "HR admin cost calculator",
          url: `${siteConfig.url}/cost-calculator`,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Any",
          description,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          publisher: { "@type": "Organization", name: siteConfig.name },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />

      <section className="mx-auto max-w-6xl px-5 pt-12 pb-10 md:pt-16">
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
          What is manual HR admin costing your business?
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-soft">
          Estimate the hours and money spent on payroll, attendance, leave and
          employee records, and whether automating them is worth it. Takes about
          a minute. No sign-up needed.
        </p>
      </section>

      <div className="mx-auto max-w-6xl px-5">
        <CostCalculator />
      </div>

      <section aria-labelledby="method-heading" className="mx-auto mt-24 max-w-3xl px-5">
        <h2 id="method-heading" className="text-3xl font-bold tracking-tight">
          How we calculate this
        </h2>
        <p className="mt-4 text-ink-soft">
          Every figure comes from the assumptions below. Change your answers above
          and the estimate updates instantly.
        </p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              HR admin minutes per employee per month, by task and current method
            </caption>
            <thead>
              <tr className="border-b border-ink/30">
                <th scope="col" className="py-3 pr-4 font-semibold">Task</th>
                <th scope="col" className="py-3 pr-4 font-semibold">Mostly manual</th>
                <th scope="col" className="py-3 pr-4 font-semibold">Partly automated</th>
                <th scope="col" className="py-3 font-semibold">Fully automated</th>
              </tr>
            </thead>
            <tbody>
              {PROCESSES.map((p) => (
                <tr key={p.id} className="border-b border-line">
                  <th scope="row" className="py-3 pr-4 font-medium">{p.label}</th>
                  <td className="py-3 pr-4 tabular-nums">{p.minutes.manual} min</td>
                  <td className="py-3 pr-4 tabular-nums">{p.minutes.partial} min</td>
                  <td className="py-3 tabular-nums">{p.minutes.automated} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="mt-6 list-disc space-y-2 pl-5 text-ink-soft">
          <li>
            HR time is valued at monthly salary plus {ASSUMPTIONS.employerOnCost * 100}% employer
            EPF and ETF, over {ASSUMPTIONS.hoursPerMonth} working hours a month.
          </li>
          <li>
            Each payroll error takes about {ASSUMPTIONS.hoursPerErrorFix} hours to investigate,
            correct and explain. With automated payroll, errors fall to around{" "}
            {ASSUMPTIONS.automatedErrorRate * 100}% of payslips.
          </li>
          <li>
            “With PeoplesHR” assumes every task is fully automated. PeoplesHR cost is an
            illustrative LKR {ASSUMPTIONS.softwareCostPerEmployeeLkr} per employee per month
            (minimum LKR {ASSUMPTIONS.softwareMinimumMonthlyLkr.toLocaleString("en-US")}).
          </li>
          <li>USD figures use an illustrative rate of LKR {ASSUMPTIONS.lkrPerUsd} to USD 1.</li>
        </ul>
      </section>

      <section aria-labelledby="faq-heading" className="mx-auto mt-20 max-w-3xl px-5">
        <h2 id="faq-heading" className="text-3xl font-bold tracking-tight">
          Common questions
        </h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {faqs.map((faq) => (
            <details key={faq.question} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                <h3 className="font-sans text-lg">{faq.question}</h3>
                <span aria-hidden="true" className="text-2xl text-jade transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-ink-soft">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
