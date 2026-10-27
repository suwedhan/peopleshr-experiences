import type { Metadata } from "next";
import { Suspense } from "react";
import { JsonLd } from "@/components/JsonLd";
import { PlanFinder } from "@/components/plan-finder/PlanFinder";
import { MODULES, PLANS, ADD_ON_PRICE_LKR, type ModuleId } from "@/lib/plans";

const title = "HR software plan finder: which PeoplesHR plan fits your business?";
const description =
  "Answer six quick questions about your team, locations and priorities to get a recommended PeoplesHR plan, the modules you need and where to start. Free, no sign-up.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/plan-finder" },
  openGraph: { title, description, url: "/plan-finder" },
};

const faqs = [
  {
    question: "How do I choose the right HR software plan?",
    answer:
      "Start with your team size, how many countries you pay people in and the two or three HR problems you most need to fix. Choose the smallest plan that covers those, and add modules as you grow rather than paying for features you won’t use yet.",
  },
  {
    question: "What is the difference between PeoplesHR Essentials and Professional?",
    answer:
      "Essentials covers employee records, leave and a self-service app. Professional adds payroll, attendance and shift tracking, expense claims and HR reporting, so time data flows straight into each pay run.",
  },
  {
    question: "When do I need PeoplesHR Enterprise?",
    answer:
      "Enterprise suits organisations with more than 1,000 employees, those paying people in four or more countries, or those that need most of the optional modules together.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Yes. You can add modules or move to a bigger plan as your business grows, and your data stays in the same system.",
  },
];

const allModules = Object.keys(MODULES) as ModuleId[];

function cell(planIncluded: ModuleId[], planAddOns: ModuleId[], id: ModuleId) {
  if (planIncluded.includes(id)) return { text: "Included", className: "font-semibold text-jade" };
  if (planAddOns.includes(id)) return { text: "Add-on", className: "text-ink" };
  return { text: "—", className: "text-ink-soft" };
}

export default function PlanFinderPage() {
  return (
    <>
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

      <section className="mx-auto max-w-5xl px-5 pt-12 pb-10 md:pt-16">
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
          Find the HR software plan that fits your business
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-soft">
          Six quick questions about your team and priorities. You’ll get a
          recommended plan, the reasons behind it and practical advice on where
          to start.
        </p>
      </section>

      <div className="mx-auto max-w-5xl px-5">
        {/* useSearchParams needs a Suspense boundary so the rest of the page can be pre-rendered */}
        <Suspense
          fallback={
            <div className="max-w-3xl rounded-2xl border border-line bg-surface p-10 text-ink-soft">
              Loading questions…
            </div>
          }
        >
          <PlanFinder />
        </Suspense>
      </div>

      <section aria-labelledby="compare-heading" className="mx-auto mt-24 max-w-5xl px-5">
        <h2 id="compare-heading" className="text-3xl font-bold tracking-tight">
          Compare PeoplesHR plans
        </h2>
        <p className="mt-3 max-w-2xl text-ink-soft">
          Prefer to compare for yourself? Here’s what each plan includes. Prices are illustrative,
          per employee per month. Add-ons are LKR {ADD_ON_PRICE_LKR} per employee per month.
        </p>

        <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <caption className="sr-only">Modules included in each PeoplesHR plan</caption>
            <thead>
              <tr className="border-b border-line align-bottom">
                <th scope="col" className="p-4 font-semibold">Module</th>
                {PLANS.map((plan) => (
                  <th key={plan.id} scope="col" className="p-4">
                    <span className="block font-display text-lg font-bold">{plan.name}</span>
                    <span className="block font-normal text-ink-soft">
                      {plan.priceLkr ? `LKR ${plan.priceLkr}` : "Custom pricing"}
                    </span>
                    <span className="block font-normal text-ink-soft">{plan.bestFor}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allModules.map((id) => (
                <tr key={id} className="border-b border-line last:border-0">
                  <th scope="row" className="p-4 font-medium">
                    {MODULES[id].name}
                  </th>
                  {PLANS.map((plan) => {
                    const c = cell(plan.included, plan.addOns, id);
                    return (
                      <td key={plan.id} className={`p-4 ${c.className}`}>
                        {c.text}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
