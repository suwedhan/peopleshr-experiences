"use client";

import { useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";

/*
  Shared lead form used by every experience. Each page passes:
  - source:   where the lead came from (for sales attribution)
  - context:  what the visitor did, e.g. calculator results or quiz answers,
              so sales gets a qualified lead instead of a bare email address
*/
type LeadSource = "home" | "cost-calculator" | "plan-finder" | "resources";

type Props = {
  source: LeadSource;
  title: string;
  description?: string;
  submitLabel: string;
  successTitle: string;
  successMessage: string;
  context?: Record<string, string | number | boolean>;
  askTeamSize?: boolean;
};

type Status = "idle" | "submitting" | "success" | "error";
type FieldErrors = Partial<Record<"name" | "email" | "company", string>>;

const teamSizes = ["1–25", "26–100", "101–500", "501–1,000", "1,000+"];

function validate(data: FormData): FieldErrors {
  const errors: FieldErrors = {};
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const company = String(data.get("company") ?? "").trim();

  if (!name) errors.name = "Enter your name.";
  if (!email) errors.email = "Enter your work email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Enter an email in the format name@company.com.";
  if (!company) errors.company = "Enter your company name.";

  return errors;
}

export function LeadCaptureForm({
  source,
  title,
  description,
  submitLabel,
  successTitle,
  successMessage,
  context = {},
  askTeamSize = false,
}: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const formId = `lead-${source}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fieldErrors = validate(data);
    setErrors(fieldErrors);

    if (Object.keys(fieldErrors).length > 0) {
      // Move focus to the first invalid field so keyboard and screen reader
      // users know what to fix.
      const first = Object.keys(fieldErrors)[0];
      document.getElementById(`${formId}-${first}`)?.focus();
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(data),
          source,
          context,
        }),
      });
      if (!response.ok) throw new Error("Request failed");
      track("lead_submitted", { source });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-2xl border border-jade/30 bg-jade-tint p-6 md:p-8">
        <h2 className="text-2xl font-bold">{successTitle}</h2>
        <p className="mt-2 text-ink-soft">{successMessage}</p>
      </div>
    );
  }

  const inputClass = (hasError: boolean) =>
    `mt-1 h-12 w-full rounded-lg border bg-surface px-4 text-base ${
      hasError ? "border-error" : "border-line"
    }`;

  const fields = [
    { name: "name", label: "Full name", type: "text", autoComplete: "name" },
    { name: "email", label: "Work email", type: "email", autoComplete: "email" },
    { name: "company", label: "Company", type: "text", autoComplete: "organization" },
  ] as const;

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 md:p-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      {description && <p className="mt-2 text-ink-soft">{description}</p>}

      <form noValidate onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => {
          const error = errors[field.name];
          const id = `${formId}-${field.name}`;
          return (
            <div key={field.name} className={field.name === "company" && !askTeamSize ? "sm:col-span-2" : ""}>
              <label htmlFor={id} className="font-medium">
                {field.label}
              </label>
              <input
                id={id}
                name={field.name}
                type={field.type}
                autoComplete={field.autoComplete}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? `${id}-error` : undefined}
                className={inputClass(Boolean(error))}
              />
              {error && (
                <p id={`${id}-error`} className="mt-1 text-sm text-error">
                  {error}
                </p>
              )}
            </div>
          );
        })}

        {askTeamSize && (
          <div>
            <label htmlFor={`${formId}-teamSize`} className="font-medium">
              Number of employees
            </label>
            <select
              id={`${formId}-teamSize`}
              name="teamSize"
              defaultValue=""
              className={inputClass(false)}
            >
              <option value="" disabled>
                Select a range
              </option>
              {teamSizes.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-lg bg-jade px-5 py-3 font-semibold text-white transition-colors hover:bg-jade-dark disabled:opacity-60 sm:w-auto"
          >
            {status === "submitting" ? "Sending…" : submitLabel}
          </button>
          <p className="mt-3 text-sm text-ink-soft">
            We only use your details to reply to this request. No mailing
            lists unless you ask.
          </p>
          {status === "error" && (
            <p role="alert" className="mt-3 text-sm text-error">
              Your details didn’t send. Check your connection and try again.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
