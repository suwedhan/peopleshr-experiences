"use client";

import Link from "next/link";
import type { Ref } from "react";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { formatMoney } from "@/lib/calculator";
import { MODULES, ADD_ON_PRICE_LKR, type Answers, type Recommendation as Rec } from "@/lib/plans";
import { track } from "@/lib/analytics";

type Props = {
  recommendation: Rec;
  answers: Answers;
  headingRef: Ref<HTMLHeadingElement>;
  onEdit: () => void;
  onRestart: () => void;
};

// The next step depends on how ready the visitor is to buy.
const nextStep = {
  soon: {
    title: "Book a demo built around your answers",
    description: "A specialist will show you this plan set up for a business like yours, and give you an exact quote.",
    submitLabel: "Book my demo",
    successTitle: "Demo requested",
    successMessage: "A PeoplesHR specialist will email you within one business day with times. They’ll already have your answers.",
  },
  later: {
    title: "Get a tailored demo or a quote",
    description: "We’ll walk you through this plan and help you plan a rollout that fits your timeline.",
    submitLabel: "Request a demo",
    successTitle: "Request received",
    successMessage: "A PeoplesHR specialist will email you within one business day to plan a time that suits you.",
  },
  researching: {
    title: "Email me this recommendation",
    description: "Keep a copy of your plan, the reasoning behind it and where to start, to share with your team.",
    submitLabel: "Email my recommendation",
    successTitle: "Recommendation sent",
    successMessage: "Check your inbox in a few minutes. No sales calls unless you ask for one.",
  },
};

export function Recommendation({ recommendation, answers, headingRef, onEdit, onRestart }: Props) {
  const { plan, neededModules, addOns, reasons, focusAreas, alternative, monthlyCostLkr, employeesUsed } =
    recommendation;
  const step = nextStep[answers.timeline ?? "researching"];

  // Show modules the visitor asked for first, so the match is obvious
  const included = [...plan.included].sort(
    (a, b) => Number(neededModules.includes(b)) - Number(neededModules.includes(a)),
  );

  return (
    <div className="space-y-10">
      <div className="rounded-2xl bg-ink p-6 text-white md:p-10">
        <p className="text-white/80">We recommend</p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mt-1 font-display text-4xl font-bold tracking-tight text-saffron md:text-5xl"
        >
          PeoplesHR {plan.name}
          {addOns.length > 0 && <span className="text-white"> + {addOns.length} add-on{addOns.length > 1 ? "s" : ""}</span>}
        </h2>
        <p className="mt-3 text-lg text-white/90">{plan.tagline}</p>

        <p className="mt-6 text-white/90">
          {monthlyCostLkr === null ? (
            <>Enterprise is priced to your organisation. A specialist will prepare a quote.</>
          ) : (
            <>
              Around <strong className="tabular-nums text-white">{formatMoney(monthlyCostLkr, "LKR")}</strong> a month
              for {employeesUsed.toLocaleString("en-US")} employees
              <span className="text-white/70"> (illustrative)</span>
            </>
          )}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#next-step"
            onClick={() => track("plan_finder_cta", { cta: "next_step", plan: plan.id })}
            className="rounded-lg bg-saffron px-5 py-3 font-semibold text-ink transition-colors hover:bg-white"
          >
            {step.submitLabel}
          </a>
          <button
            type="button"
            onClick={onEdit}
            className="rounded-lg border border-white/30 px-5 py-3 font-semibold transition-colors hover:border-white"
          >
            Change my answers
          </button>
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-2">
        <section aria-labelledby="why-heading">
          <h3 id="why-heading" className="text-xl font-bold">Why this plan</h3>
          <ul className="mt-4 space-y-3">
            {reasons.map((reason) => (
              <li key={reason} className="border-l-4 border-jade pl-4 text-ink-soft">
                {reason}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="start-heading">
          <h3 id="start-heading" className="text-xl font-bold">Where to start</h3>
          <p className="mt-1 text-sm text-ink-soft">Useful whichever software you choose.</p>
          <ol className="mt-4 space-y-3">
            {focusAreas.map((area, i) => (
              <li key={area} className="flex gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-saffron-tint text-sm font-bold">
                  {i + 1}
                </span>
                <span className="text-ink-soft">{area}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section aria-labelledby="included-heading">
        <h3 id="included-heading" className="text-xl font-bold">What’s included</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {included.map((id) => {
            const matched = neededModules.includes(id);
            return (
              <li
                key={id}
                className={`rounded-xl border p-4 ${matched ? "border-jade bg-jade-tint" : "border-line bg-surface"}`}
              >
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-semibold">{MODULES[id].name}</span>
                  {matched && (
                    <span className="rounded-full bg-jade px-2.5 py-0.5 text-xs font-semibold text-white">
                      Matches your needs
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-sm text-ink-soft">{MODULES[id].description}</span>
              </li>
            );
          })}
          {addOns.map((id) => (
            <li key={id} className="rounded-xl border border-dashed border-jade bg-surface p-4">
              <span className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold">{MODULES[id].name}</span>
                <span className="rounded-full bg-saffron-tint px-2.5 py-0.5 text-xs font-semibold">
                  Add-on · LKR {ADD_ON_PRICE_LKR}/employee
                </span>
              </span>
              <span className="mt-1 block text-sm text-ink-soft">{MODULES[id].description}</span>
            </li>
          ))}
        </ul>
      </section>

      {alternative && (
        <section aria-labelledby="alt-heading" className="rounded-xl border border-line bg-surface p-5">
          <h3 id="alt-heading" className="font-sans text-lg font-semibold">
            Also worth considering: {alternative.plan.name}
          </h3>
          <p className="mt-1 text-ink-soft">{alternative.reason}</p>
        </section>
      )}

      <section id="next-step" className="scroll-mt-8">
        <LeadCaptureForm
          source="plan-finder"
          title={step.title}
          description={step.description}
          submitLabel={step.submitLabel}
          successTitle={step.successTitle}
          successMessage={step.successMessage}
          context={{
            recommendedPlan: plan.id,
            addOns: addOns.join(", "),
            teamSize: answers.teamSize ?? "",
            employees: employeesUsed,
            countries: answers.countries ?? "",
            workforce: answers.workforce ?? "",
            priorities: answers.priorities.join(", "),
            currentSetup: answers.currentSetup ?? "",
            timeline: answers.timeline ?? "",
          }}
        />
        <p className="mt-6 text-ink-soft">
          Not ready yet?{" "}
          <Link href="/cost-calculator" className="font-semibold text-jade underline underline-offset-4">
            Estimate what manual HR admin costs you
          </Link>{" "}
          or{" "}
          <Link href="/resources" className="font-semibold text-jade underline underline-offset-4">
            read our HR guides
          </Link>
          .{" "}
          <button type="button" onClick={onRestart} className="font-semibold text-jade underline underline-offset-4">
            Start again
          </button>
        </p>
      </section>
    </div>
  );
}
