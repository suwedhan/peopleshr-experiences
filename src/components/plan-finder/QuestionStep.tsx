"use client";

import type { Ref } from "react";
import type { Question } from "@/lib/plans";

type Props = {
  question: Question;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
  headingRef: Ref<HTMLHeadingElement>;
  note?: string;
};

/* One question, rendered as a fieldset of large selectable cards.
   Real radio/checkbox inputs keep it keyboard and screen reader friendly. */
export function QuestionStep({ question, value, onChange, headingRef, note }: Props) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  const limitReached = question.multiple && selected.length >= (question.maxSelections ?? Infinity);

  function toggle(optionValue: string) {
    if (!question.multiple) return onChange(optionValue);
    onChange(
      selected.includes(optionValue)
        ? selected.filter((v) => v !== optionValue)
        : [...selected, optionValue],
    );
  }

  return (
    <fieldset>
      <legend className="w-full">
        <h2 ref={headingRef} tabIndex={-1} className="text-2xl font-bold tracking-tight md:text-3xl">
          {question.title}
        </h2>
      </legend>
      {question.hint && (
        <p className="mt-2 text-ink-soft">
          {question.hint}{" "}
          {question.multiple && (
            <span aria-live="polite" className="font-medium text-ink">
              {selected.length} of {question.maxSelections} chosen.
            </span>
          )}
        </p>
      )}
      {note && <p className="mt-2 rounded-lg bg-jade-tint px-3 py-2 text-sm">{note}</p>}

      <div
        className={`mt-6 grid gap-3 ${question.options.length > 4 ? "sm:grid-cols-2" : ""}`}
      >
        {question.options.map((option) => {
          const checked = selected.includes(option.value);
          const disabled = !checked && limitReached;
          return (
            <label key={option.value} className={disabled ? "cursor-not-allowed" : "cursor-pointer"}>
              <input
                type={question.multiple ? "checkbox" : "radio"}
                name={question.id}
                value={option.value}
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(option.value)}
                className="peer sr-only"
              />
              <span className="flex h-full items-start gap-3 rounded-xl border-2 border-line bg-surface p-4 transition-colors peer-checked:border-jade peer-checked:bg-jade-tint peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-jade-dark peer-disabled:opacity-50 hover:border-ink/30">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 flex size-5 shrink-0 items-center justify-center border-2 ${
                    question.multiple ? "rounded" : "rounded-full"
                  } ${checked ? "border-jade bg-jade" : "border-ink/30 bg-surface"}`}
                >
                  {checked && (
                    <svg viewBox="0 0 12 12" className="size-3 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2.5 6.5l2.5 2.5 4.5-5" />
                    </svg>
                  )}
                </span>
                <span>
                  <span className="block font-semibold">{option.label}</span>
                  {option.description && (
                    <span className="mt-0.5 block text-sm text-ink-soft">{option.description}</span>
                  )}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
