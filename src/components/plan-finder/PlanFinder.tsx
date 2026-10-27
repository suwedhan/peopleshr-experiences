"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  QUESTIONS,
  recommend,
  teamSizeFromEmployees,
  type Answers,
  type QuestionId,
} from "@/lib/plans";
import { track } from "@/lib/analytics";
import { QuestionStep } from "./QuestionStep";
import { Recommendation } from "./Recommendation";

const RESULTS = QUESTIONS.length;

// If the visitor arrives from the cost calculator (?employees=150),
// pre-fill their team size so they don't answer the same thing twice.
function initialAnswers(employeesParam: string | null): Answers {
  const employees = Number(employeesParam);
  if (Number.isFinite(employees) && employees > 0) {
    return { teamSize: teamSizeFromEmployees(employees), employees, priorities: [] };
  }
  return { priorities: [] };
}

export function PlanFinder() {
  const searchParams = useSearchParams();
  const employeesParam = searchParams.get("employees");
  const [answers, setAnswers] = useState<Answers>(() => initialAnswers(employeesParam));
  const [step, setStep] = useState(0);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasInteracted = useRef(false);

  // Move focus to the new question (or the result) after each step, so
  // keyboard and screen reader users land in the right place.
  useEffect(() => {
    if (!hasInteracted.current) return;
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [step]);

  const recommendation = useMemo(
    () => (step === RESULTS ? recommend(answers) : null),
    [step, answers],
  );

  const question = QUESTIONS[step];
  const value = question ? answers[question.id] : undefined;
  const answered = Array.isArray(value) ? value.length > 0 : Boolean(value);

  function setAnswer(id: QuestionId, newValue: string | string[]) {
    if (!hasInteracted.current) track("plan_finder_started");
    hasInteracted.current = true;
    setAnswers((current) => ({
      ...current,
      [id]: newValue,
      // A manual team size choice replaces the exact headcount from the calculator
      ...(id === "teamSize" ? { employees: undefined } : {}),
    }));
  }

  function goTo(next: number) {
    hasInteracted.current = true;
    if (next === RESULTS) {
      const result = recommend(answers);
      track("plan_recommended", { plan: result.plan.id, addOns: result.addOns.length });
    }
    setStep(next);
  }

  if (recommendation) {
    return (
      <Recommendation
        recommendation={recommendation}
        answers={answers}
        headingRef={headingRef}
        onEdit={() => goTo(0)}
        onRestart={() => {
          setAnswers({ priorities: [] });
          goTo(0);
        }}
      />
    );
  }

  const prefilledNote =
    step === 0 && answers.employees
      ? `We’ve selected this from the ${answers.employees.toLocaleString("en-US")} employees you entered in the cost calculator.`
      : undefined;

  return (
    <div className="max-w-3xl rounded-2xl border border-line bg-surface p-6 md:p-10">
      <div className="mb-8">
        <p className="text-sm font-semibold text-ink-soft">
          Question {step + 1} of {QUESTIONS.length}
        </p>
        <div className="mt-2 h-1.5 rounded-full bg-paper" aria-hidden="true">
          <div
            className="h-1.5 rounded-full bg-jade transition-[width] duration-300"
            style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (answered) goTo(step + 1);
        }}
      >
        <QuestionStep
          key={question.id}
          question={question}
          value={value as string | string[] | undefined}
          onChange={(v) => setAnswer(question.id, v)}
          headingRef={headingRef}
          note={prefilledNote}
        />

        <div className="mt-8 flex items-center justify-between gap-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              className="rounded-lg px-4 py-3 font-semibold text-ink-soft hover:text-ink"
            >
              ← Back
            </button>
          ) : (
            <span />
          )}
          <button
            type="submit"
            disabled={!answered}
            className="rounded-lg bg-jade px-6 py-3 font-semibold text-white transition-colors hover:bg-jade-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {step === QUESTIONS.length - 1 ? "See my recommendation" : "Next"}
          </button>
        </div>
      </form>
    </div>
  );
}
