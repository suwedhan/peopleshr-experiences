"use client";

import Link from "next/link";
import { formatHours, formatMoney, type Currency, type Result } from "@/lib/calculator";
import { track } from "@/lib/analytics";

const verdictCopy: Record<Result["verdict"], { title: string; body: string }> = {
  strong: {
    title: "A strong case for automating",
    body: "The time you’d save is worth several times the cost of the software.",
  },
  worthwhile: {
    title: "Worth exploring",
    body: "The time you’d save more than covers the cost of the software.",
  },
  modest: {
    title: "A modest saving for now",
    body: "At your current size, the time saved may not cover the software yet. Tidying up your processes could be a better first step.",
  },
};

type Props = {
  result: Result;
  currency: Currency;
  employees: number;
};

export function ResultsPanel({ result, currency, employees }: Props) {
  const maxHours = Math.max(...result.processes.map((p) => p.currentHours), 1);
  const verdict = verdictCopy[result.verdict];

  return (
    <div className="rounded-2xl bg-ink p-6 text-white md:p-8">
      <h2 className="text-lg font-semibold text-white/80">Your estimate</h2>

      <p className="mt-4">
        <span className="block font-display text-4xl font-bold tabular-nums text-saffron md:text-5xl">
          {formatMoney(result.currentCostPerYearLkr, currency)}
        </span>
        <span className="mt-2 block text-white/80">
          a year spent on manual HR admin
        </span>
      </p>

      <p className="mt-4 text-white/90">
        That’s <strong className="tabular-nums">{formatHours(result.currentHoursPerMonth)} hours</strong>{" "}
        a month, or about{" "}
        <strong className="tabular-nums">
          {result.fullTimeEquivalent.toFixed(1)} full-time
          {result.fullTimeEquivalent >= 1.05 ? " people" : " person"}
        </strong>
        .
      </p>

      {/* Breakdown: current hours vs with PeoplesHR, per process */}
      <h3 className="mt-8 font-sans text-base font-semibold">Where the time goes each month</h3>
      <dl className="mt-3 space-y-4">
        {result.processes.map((p) => (
          <div key={p.id}>
            <div className="flex justify-between gap-4 text-sm">
              <dt>{p.label}</dt>
              <dd className="tabular-nums text-white/80">
                {formatHours(p.currentHours)} h → {formatHours(p.futureHours)} h
              </dd>
            </div>
            {/* Saffron = hours now, white = hours left with PeoplesHR */}
            <div className="relative mt-1.5 h-2 rounded-full bg-white/15" aria-hidden="true">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-saffron transition-[width] duration-300"
                style={{ width: `${(p.currentHours / maxHours) * 100}%` }}
              />
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-white transition-[width] duration-300"
                style={{ width: `${(p.futureHours / maxHours) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </dl>
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/80">
        <span className="flex items-center gap-2">
          <span className="h-2 w-4 rounded-full bg-saffron" aria-hidden="true" /> Hours now
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2 w-4 rounded-full bg-white" aria-hidden="true" /> With PeoplesHR
        </span>
      </p>

      {/* The honest verdict: saving compared with the (illustrative) software cost */}
      <div className="mt-8 rounded-xl bg-white/10 p-5" aria-live="polite">
        <h3 className="font-sans text-lg font-semibold">{verdict.title}</h3>
        <p className="mt-1 text-white/85">{verdict.body}</p>
        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-white/70">Time you could save</dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums">
              {formatHours(result.hoursSavedPerYear)} h a year
            </dd>
          </div>
          <div>
            <dt className="text-white/70">Value of that time</dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums">
              {formatMoney(result.savingPerYearLkr, currency)}
            </dd>
          </div>
          <div>
            <dt className="text-white/70">Estimated PeoplesHR cost</dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums">
              {formatMoney(result.softwareCostPerYearLkr, currency)}
            </dd>
          </div>
          <div>
            <dt className="text-white/70">Net benefit</dt>
            <dd className="mt-0.5 text-lg font-semibold tabular-nums">
              {formatMoney(result.netBenefitPerYearLkr, currency)}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <a
          href="#email-breakdown"
          onClick={() => track("calculator_cta", { cta: "email_breakdown" })}
          className="rounded-lg bg-saffron px-5 py-3 text-center font-semibold text-ink transition-colors hover:bg-white"
        >
          Email me this breakdown
        </a>
        <Link
          href={`/plan-finder?employees=${employees}`}
          onClick={() => track("calculator_cta", { cta: "plan_finder" })}
          className="rounded-lg border border-white/30 px-5 py-3 text-center font-semibold text-white transition-colors hover:border-white"
        >
          Find the right plan for {employees} employees
        </Link>
      </div>
    </div>
  );
}
