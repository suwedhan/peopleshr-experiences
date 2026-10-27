/*
  Cost calculator logic for Challenge 01.
  Everything here is plain data and pure functions, so it is easy to test,
  explain and change. The page also renders ASSUMPTIONS on screen, so the
  visitor sees exactly what the numbers are based on.
*/

export type Currency = "LKR" | "USD";
export type Method = "manual" | "partial" | "automated";
export type ProcessId = "payroll" | "attendance" | "leave" | "records";
export type ErrorFrequency = "rarely" | "sometimes" | "often";

export const ASSUMPTIONS = {
  /** Working hours in a month: 40 hours × 52 weeks ÷ 12 */
  hoursPerMonth: 173,
  /** Employer EPF (12%) + ETF (3%) on top of salary */
  employerOnCost: 0.15,
  /** Illustrative exchange rate for the USD view */
  lkrPerUsd: 300,
  /** Share of payslips that need correcting each month */
  errorRate: { rarely: 0.01, sometimes: 0.03, often: 0.06 } as Record<ErrorFrequency, number>,
  /** HR time to investigate, fix and explain one payroll error */
  hoursPerErrorFix: 1.5,
  /** With automated payroll, errors are assumed to fall to the "rarely" level */
  automatedErrorRate: 0.01,
  /** Illustrative PeoplesHR subscription, per employee per month */
  softwareCostPerEmployeeLkr: 450,
  /** Illustrative minimum monthly subscription */
  softwareMinimumMonthlyLkr: 25000,
};

/** Admin minutes per employee per month, by process and current method */
export const PROCESSES: {
  id: ProcessId;
  label: string;
  description: string;
  minutes: Record<Method, number>;
}[] = [
  {
    id: "payroll",
    label: "Payroll",
    description: "Calculating pay, overtime, EPF/ETF and producing payslips",
    minutes: { manual: 20, partial: 10, automated: 3 },
  },
  {
    id: "attendance",
    label: "Attendance and timesheets",
    description: "Collecting, checking and correcting attendance records",
    minutes: { manual: 25, partial: 12, automated: 3 },
  },
  {
    id: "leave",
    label: "Leave",
    description: "Handling requests, approvals and leave balances",
    minutes: { manual: 10, partial: 5, automated: 1 },
  },
  {
    id: "records",
    label: "Employee records and queries",
    description: "Updating records, issuing letters, answering payslip questions",
    minutes: { manual: 15, partial: 8, automated: 3 },
  },
];

export const METHOD_OPTIONS: { value: Method; label: string }[] = [
  { value: "manual", label: "Mostly manual" },
  { value: "partial", label: "Partly automated" },
  { value: "automated", label: "Fully automated" },
];

export const ERROR_OPTIONS: { value: ErrorFrequency; label: string }[] = [
  { value: "rarely", label: "Rarely" },
  { value: "sometimes", label: "Every month or two" },
  { value: "often", label: "Every payroll run" },
];

export type Inputs = {
  employees: number;
  monthlySalaryLkr: number;
  methods: Record<ProcessId, Method>;
  errorFrequency: ErrorFrequency;
};

export const DEFAULT_INPUTS: Inputs = {
  employees: 150,
  monthlySalaryLkr: 150000,
  methods: { payroll: "partial", attendance: "manual", leave: "manual", records: "manual" },
  errorFrequency: "sometimes",
};

export type Verdict = "strong" | "worthwhile" | "modest";

export type Result = {
  hourlyCostLkr: number;
  processes: { id: string; label: string; currentHours: number; futureHours: number }[];
  currentHoursPerMonth: number;
  futureHoursPerMonth: number;
  hoursSavedPerYear: number;
  currentCostPerYearLkr: number;
  savingPerYearLkr: number;
  softwareCostPerYearLkr: number;
  netBenefitPerYearLkr: number;
  /** How many times the saving covers the subscription */
  returnMultiple: number;
  fullTimeEquivalent: number;
  verdict: Verdict;
};

export function calculate(inputs: Inputs): Result {
  const { employees, monthlySalaryLkr, methods, errorFrequency } = inputs;
  const a = ASSUMPTIONS;

  const hourlyCostLkr = (monthlySalaryLkr * (1 + a.employerOnCost)) / a.hoursPerMonth;

  const processes: Result["processes"] = PROCESSES.map((process) => ({
    id: process.id,
    label: process.label,
    currentHours: (employees * process.minutes[methods[process.id]]) / 60,
    futureHours: (employees * process.minutes.automated) / 60,
  }));

  const currentErrorHours = employees * a.errorRate[errorFrequency] * a.hoursPerErrorFix;
  const futureErrorHours =
    employees * Math.min(a.automatedErrorRate, a.errorRate[errorFrequency]) * a.hoursPerErrorFix;

  processes.push({
    id: "payroll-errors",
    label: "Fixing payroll errors",
    currentHours: currentErrorHours,
    futureHours: futureErrorHours,
  });

  const currentHoursPerMonth = processes.reduce((sum, p) => sum + p.currentHours, 0);
  const futureHoursPerMonth = processes.reduce((sum, p) => sum + p.futureHours, 0);
  const hoursSavedPerYear = (currentHoursPerMonth - futureHoursPerMonth) * 12;

  const currentCostPerYearLkr = currentHoursPerMonth * 12 * hourlyCostLkr;
  const savingPerYearLkr = hoursSavedPerYear * hourlyCostLkr;
  const softwareCostPerYearLkr =
    Math.max(employees * a.softwareCostPerEmployeeLkr, a.softwareMinimumMonthlyLkr) * 12;

  const returnMultiple = savingPerYearLkr / softwareCostPerYearLkr;
  const verdict: Verdict =
    returnMultiple >= 3 ? "strong" : returnMultiple >= 1 ? "worthwhile" : "modest";

  return {
    hourlyCostLkr,
    processes,
    currentHoursPerMonth,
    futureHoursPerMonth,
    hoursSavedPerYear,
    currentCostPerYearLkr,
    savingPerYearLkr,
    softwareCostPerYearLkr,
    netBenefitPerYearLkr: savingPerYearLkr - softwareCostPerYearLkr,
    returnMultiple,
    fullTimeEquivalent: currentHoursPerMonth / a.hoursPerMonth,
    verdict,
  };
}

/* ---------- Formatting helpers ---------- */

export function toCurrency(lkr: number, currency: Currency) {
  return currency === "LKR" ? lkr : lkr / ASSUMPTIONS.lkrPerUsd;
}

export function fromCurrency(amount: number, currency: Currency) {
  return currency === "LKR" ? amount : amount * ASSUMPTIONS.lkrPerUsd;
}

/** Rounded to avoid false precision: nearest 1,000 LKR or 10 USD */
export function formatMoney(lkr: number, currency: Currency) {
  const value = toCurrency(lkr, currency);
  const rounded = currency === "LKR" ? Math.round(value / 1000) * 1000 : Math.round(value / 10) * 10;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "code",
    maximumFractionDigits: 0,
  })
    .format(rounded)
    .replace(/\u00a0/, " ");
}

export function formatHours(hours: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(hours));
}
