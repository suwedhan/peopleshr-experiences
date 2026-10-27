"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ASSUMPTIONS,
  DEFAULT_INPUTS,
  ERROR_OPTIONS,
  METHOD_OPTIONS,
  PROCESSES,
  calculate,
  formatHours,
  formatMoney,
  fromCurrency,
  toCurrency,
  type Currency,
  type ErrorFrequency,
  type Method,
  type ProcessId,
} from "@/lib/calculator";
import { track } from "@/lib/analytics";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import { ResultsPanel } from "./ResultsPanel";

const MIN_EMPLOYEES = 5;
const MAX_EMPLOYEES = 2000;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/* A group of radio buttons styled as selectable pills. Real radios keep it
   keyboard and screen reader accessible. */
function PillGroup<T extends string>({
  name,
  legend,
  hint,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  hint?: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="font-semibold">{legend}</legend>
      {hint && <p className="mt-0.5 text-sm text-ink-soft">{hint}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.value} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="peer sr-only"
            />
            <span className="inline-block rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium transition-colors peer-checked:border-jade peer-checked:bg-jade peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-jade-dark hover:border-ink/40">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CostCalculator() {
  const [currency, setCurrency] = useState<Currency>("LKR");
  // Text inputs keep the raw string so people can type freely;
  // the calculation uses a cleaned-up number.
  const [employeesText, setEmployeesText] = useState(String(DEFAULT_INPUTS.employees));
  const [salaryText, setSalaryText] = useState(String(DEFAULT_INPUTS.monthlySalaryLkr));
  const [methods, setMethods] = useState(DEFAULT_INPUTS.methods);
  const [errorFrequency, setErrorFrequency] = useState<ErrorFrequency>(DEFAULT_INPUTS.errorFrequency);

  // On mobile the results sit below the form, so a small bar keeps the
  // headline figure visible until the results panel scrolls into view.
  const resultsRef = useRef<HTMLDivElement>(null);
  const [resultsVisible, setResultsVisible] = useState(false);
  useEffect(() => {
    const el = resultsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setResultsVisible(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const started = useRef(false);
  const markStarted = () => {
    if (!started.current) {
      started.current = true;
      track("calculator_started");
    }
  };

  const employees = clamp(parseInt(employeesText, 10) || MIN_EMPLOYEES, MIN_EMPLOYEES, MAX_EMPLOYEES);
  const salaryLkr = Math.max(fromCurrency(Number(salaryText) || 0, currency), 0);

  const result = useMemo(
    () => calculate({ employees, monthlySalaryLkr: salaryLkr, methods, errorFrequency }),
    [employees, salaryLkr, methods, errorFrequency],
  );

  function switchCurrency(next: Currency) {
    if (next === currency) return;
    // Convert the salary the visitor typed into the new currency
    const converted = toCurrency(fromCurrency(Number(salaryText) || 0, currency), next);
    setSalaryText(String(Math.round(converted)));
    setCurrency(next);
  }

  function setMethod(id: ProcessId, method: Method) {
    markStarted();
    setMethods((current) => ({ ...current, [id]: method }));
  }

  const inputClass = "h-12 rounded-lg border border-line bg-surface px-4 text-base tabular-nums";

  return (
    <>
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_minmax(0,28rem)]">
        <form
          className="space-y-10 rounded-2xl border border-line bg-surface p-6 md:p-8"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Your business"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Your business</h2>
            <div role="group" aria-label="Currency" className="flex rounded-lg border border-line p-1">
              {(["LKR", "USD"] as Currency[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={currency === c}
                  onClick={() => switchCurrency(c)}
                  className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
                    currency === c ? "bg-ink text-white" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Team size: slider and number box stay in sync */}
          <div>
            <label htmlFor="employees" className="font-semibold">
              How many employees do you pay?
            </label>
            <div className="mt-3 flex items-center gap-4">
              <input
                type="range"
                min={MIN_EMPLOYEES}
                max={MAX_EMPLOYEES}
                step={5}
                value={employees}
                aria-label="Number of employees"
                onChange={(e) => {
                  markStarted();
                  setEmployeesText(e.target.value);
                }}
                className="min-w-0 flex-1 accent-jade"
              />
              <input
                id="employees"
                type="number"
                inputMode="numeric"
                min={MIN_EMPLOYEES}
                max={MAX_EMPLOYEES}
                value={employeesText}
                onChange={(e) => {
                  markStarted();
                  setEmployeesText(e.target.value);
                }}
                onBlur={() => setEmployeesText(String(employees))}
                className={`${inputClass} w-28 shrink-0`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="salary" className="font-semibold">
              Average monthly salary of your HR and payroll staff
            </label>
            <p id="salary-hint" className="mt-0.5 text-sm text-ink-soft">
              Before deductions. We add {ASSUMPTIONS.employerOnCost * 100}% for employer EPF and ETF.
            </p>
            <div className="relative mt-3 max-w-xs">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-ink-soft">
                {currency}
              </span>
              <input
                id="salary"
                type="number"
                inputMode="numeric"
                min={0}
                step={currency === "LKR" ? 5000 : 50}
                value={salaryText}
                aria-describedby="salary-hint"
                onChange={(e) => {
                  markStarted();
                  setSalaryText(e.target.value);
                }}
                className={`${inputClass} w-full pl-16`}
              />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="font-sans text-lg font-semibold">How do you handle these today?</h3>
              <p className="mt-0.5 text-sm text-ink-soft">
                Mostly manual means paper, email or spreadsheets.
              </p>
            </div>
            {PROCESSES.map((process) => (
              <PillGroup
                key={process.id}
                name={`method-${process.id}`}
                legend={process.label}
                hint={process.description}
                options={METHOD_OPTIONS}
                value={methods[process.id]}
                onChange={(method) => setMethod(process.id, method)}
              />
            ))}
          </div>

          <PillGroup
            name="errors"
            legend="How often do payslips need correcting after payroll runs?"
            options={ERROR_OPTIONS}
            value={errorFrequency}
            onChange={(value) => {
              markStarted();
              setErrorFrequency(value);
            }}
          />
        </form>

        <div id="results" ref={resultsRef} className="scroll-mt-6 lg:sticky lg:top-6">
          <ResultsPanel result={result} currency={currency} employees={employees} />
        </div>
      </div>

      <a
        href="#results"
        className={`fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 bg-ink px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] text-white transition-transform lg:hidden ${
          resultsVisible ? "translate-y-full" : "translate-y-0"
        }`}
        aria-hidden={resultsVisible}
        tabIndex={resultsVisible ? -1 : 0}
      >
        <span>
          <span className="block font-display text-xl font-bold tabular-nums text-saffron">
            {formatMoney(result.currentCostPerYearLkr, currency)}
          </span>
          <span className="text-sm text-white/80">a year on manual HR admin</span>
        </span>
        <span className="font-semibold underline underline-offset-4">See breakdown</span>
      </a>

      <section id="email-breakdown" className="mx-auto mt-16 max-w-3xl scroll-mt-8">
        <LeadCaptureForm
          source="cost-calculator"
          title="Get this breakdown by email"
          description="We’ll send your figures and the assumptions behind them, ready to share with your finance team or manager."
          submitLabel="Email my breakdown"
          successTitle="Breakdown on its way"
          successMessage="Check your inbox in the next few minutes. If you’d like to talk it through, reply to that email and a PeoplesHR specialist will help."
          context={{
            employees,
            currency,
            annualCost: formatMoney(result.currentCostPerYearLkr, currency),
            hoursSavedPerYear: formatHours(result.hoursSavedPerYear),
            verdict: result.verdict,
            ...Object.fromEntries(Object.entries(methods).map(([k, v]) => [`method_${k}`, v])),
          }}
        />
      </section>
    </>
  );
}
