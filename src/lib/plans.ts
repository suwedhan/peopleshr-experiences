/*
  Plan finder logic for Challenge 02.
  Plans, modules and prices are illustrative. The recommendation is a set of
  plain, readable rules (not a black-box score) so it is easy to explain to
  a visitor, a sales team or an interviewer, and easy to change.
*/

/* ---------- Product catalogue ---------- */

export type ModuleId =
  | "core"
  | "leave"
  | "selfService"
  | "attendance"
  | "payroll"
  | "expenses"
  | "analytics"
  | "performance"
  | "recruitment"
  | "learning"
  | "multiCountry";

export const MODULES: Record<ModuleId, { name: string; description: string }> = {
  core: { name: "Core HR", description: "Employee records, documents and org structure in one place" },
  leave: { name: "Leave management", description: "Requests, approvals and live leave balances" },
  selfService: { name: "Employee self-service app", description: "Payslips, leave and requests on mobile" },
  attendance: { name: "Attendance and shifts", description: "Biometric and mobile clock-in, rosters and overtime" },
  payroll: { name: "Payroll", description: "Automated pay runs with EPF, ETF and APIT calculations" },
  expenses: { name: "Expense claims", description: "Submit, approve and reimburse expenses" },
  analytics: { name: "HR reports and analytics", description: "Headcount, cost and attrition dashboards" },
  performance: { name: "Performance", description: "Goals, reviews and feedback cycles" },
  recruitment: { name: "Recruitment and onboarding", description: "Job posts, candidate tracking and onboarding checklists" },
  learning: { name: "Learning", description: "Training plans, courses and certifications" },
  multiCountry: { name: "Multi-country payroll", description: "Local statutory rules for each country you operate in" },
};

export type PlanId = "essentials" | "professional" | "enterprise";

export type Plan = {
  id: PlanId;
  name: string;
  tagline: string;
  bestFor: string;
  /** Illustrative LKR per employee per month. null = custom pricing */
  priceLkr: number | null;
  included: ModuleId[];
  addOns: ModuleId[];
};

export const PLANS: Plan[] = [
  {
    id: "essentials",
    name: "Essentials",
    tagline: "Get HR records and leave out of spreadsheets",
    bestFor: "Teams of up to 200 in one country",
    priceLkr: 250,
    included: ["core", "leave", "selfService"],
    addOns: [],
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Run payroll, attendance and HR in one system",
    bestFor: "Growing businesses with up to 1,000 employees",
    priceLkr: 450,
    included: ["core", "leave", "selfService", "attendance", "payroll", "expenses", "analytics"],
    addOns: ["performance", "recruitment", "learning", "multiCountry"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "The full suite for large and multi-country organisations",
    bestFor: "1,000+ employees or operations in 4+ countries",
    priceLkr: null,
    included: Object.keys(MODULES) as ModuleId[],
    addOns: [],
  },
];

/** Illustrative add-on price, LKR per employee per month */
export const ADD_ON_PRICE_LKR = 100;

export const getPlan = (id: PlanId) => PLANS.find((p) => p.id === id)!;

/* ---------- Questions ---------- */

export type TeamSize = "small" | "medium" | "large" | "xlarge";
export type Countries = "one" | "few" | "many";
export type Workforce = "office" | "shift" | "mixed";
export type Priority =
  | "payroll"
  | "attendance"
  | "leave"
  | "selfService"
  | "performance"
  | "hiring"
  | "learning"
  | "analytics";
export type CurrentSetup = "spreadsheets" | "basicPayroll" | "otherHr";
export type Timeline = "soon" | "later" | "researching";

export type Answers = {
  teamSize?: TeamSize;
  /** Exact headcount when it arrives from the cost calculator */
  employees?: number;
  countries?: Countries;
  workforce?: Workforce;
  priorities: Priority[];
  currentSetup?: CurrentSetup;
  timeline?: Timeline;
};

export type QuestionId = "teamSize" | "countries" | "workforce" | "priorities" | "currentSetup" | "timeline";

export type Question = {
  id: QuestionId;
  title: string;
  hint?: string;
  multiple?: boolean;
  maxSelections?: number;
  options: { value: string; label: string; description?: string }[];
};

export const MAX_PRIORITIES = 3;

export const QUESTIONS: Question[] = [
  {
    id: "teamSize",
    title: "How many people work for you?",
    options: [
      { value: "small", label: "1–50" },
      { value: "medium", label: "51–200" },
      { value: "large", label: "201–1,000" },
      { value: "xlarge", label: "More than 1,000" },
    ],
  },
  {
    id: "countries",
    title: "How many countries do you pay people in?",
    options: [
      { value: "one", label: "One country" },
      { value: "few", label: "2–3 countries" },
      { value: "many", label: "4 or more" },
    ],
  },
  {
    id: "workforce",
    title: "How does your team work?",
    options: [
      { value: "office", label: "Mostly office-based", description: "Regular hours, desk-based roles" },
      { value: "shift", label: "Mostly shifts or on-site", description: "Factories, retail, hospitality, field teams" },
      { value: "mixed", label: "A mix of both", description: "Office staff plus shift or field teams" },
    ],
  },
  {
    id: "priorities",
    title: "What do you most need to fix?",
    hint: `Choose up to ${MAX_PRIORITIES}.`,
    multiple: true,
    maxSelections: MAX_PRIORITIES,
    options: [
      { value: "payroll", label: "Accurate, on-time payroll" },
      { value: "attendance", label: "Attendance and shift tracking" },
      { value: "leave", label: "Leave requests and approvals" },
      { value: "selfService", label: "Fewer HR questions from staff" },
      { value: "performance", label: "Performance reviews" },
      { value: "hiring", label: "Hiring and onboarding" },
      { value: "learning", label: "Training and development" },
      { value: "analytics", label: "HR reporting for management" },
    ],
  },
  {
    id: "currentSetup",
    title: "What do you use today?",
    options: [
      { value: "spreadsheets", label: "Spreadsheets and paper" },
      { value: "basicPayroll", label: "A payroll tool, everything else manual" },
      { value: "otherHr", label: "Another HR system we want to replace" },
    ],
  },
  {
    id: "timeline",
    title: "When are you hoping to have a new system running?",
    options: [
      { value: "soon", label: "Within 3 months" },
      { value: "later", label: "In 3–6 months" },
      { value: "researching", label: "Just researching for now" },
    ],
  },
];

/** Converts a headcount (e.g. from the calculator) into a team size answer */
export function teamSizeFromEmployees(employees: number): TeamSize {
  if (employees <= 50) return "small";
  if (employees <= 200) return "medium";
  if (employees <= 1000) return "large";
  return "xlarge";
}

const TEAM_SIZE_MIDPOINT: Record<TeamSize, number> = { small: 30, medium: 120, large: 500, xlarge: 1500 };

const PRIORITY_MODULE: Record<Priority, ModuleId> = {
  payroll: "payroll",
  attendance: "attendance",
  leave: "leave",
  selfService: "selfService",
  performance: "performance",
  hiring: "recruitment",
  learning: "learning",
  analytics: "analytics",
};

/* ---------- Recommendation rules ---------- */

export type Recommendation = {
  plan: Plan;
  /** Modules the visitor's answers point to */
  neededModules: ModuleId[];
  addOns: ModuleId[];
  reasons: string[];
  focusAreas: string[];
  alternative: { plan: Plan; reason: string } | null;
  /** Illustrative monthly cost, null for custom pricing */
  monthlyCostLkr: number | null;
  employeesUsed: number;
};

export function recommend(answers: Answers): Recommendation {
  const { teamSize = "medium", countries = "one", workforce = "office", priorities, currentSetup } = answers;
  const reasons: string[] = [];

  // 1. Work out which modules the answers point to
  const needed = new Set<ModuleId>(["core", "leave"]);
  priorities.forEach((p) => needed.add(PRIORITY_MODULE[p]));
  if (workforce !== "office") {
    needed.add("attendance");
    needed.add("selfService");
  }
  if (countries !== "one") {
    needed.add("payroll");
    needed.add("multiCountry");
  }

  // 2. Pick the smallest plan that covers them
  const essentials = getPlan("essentials");
  const professional = getPlan("professional");
  const enterprise = getPlan("enterprise");
  let plan: Plan;
  let addOns: ModuleId[] = [];

  if (teamSize === "xlarge" || countries === "many") {
    plan = enterprise;
    reasons.push(
      teamSize === "xlarge"
        ? "With more than 1,000 people, you’ll need the scale, controls and dedicated support in Enterprise."
        : "Paying people in 4 or more countries needs Enterprise’s full multi-country payroll and compliance.",
    );
  } else {
    const coveredByEssentials = [...needed].every((m) => essentials.included.includes(m));
    if (coveredByEssentials && teamSize !== "large") {
      plan = essentials;
      reasons.push("Everything you said you need is included in Essentials, so there’s no reason to pay for more.");
    } else {
      addOns = [...needed].filter((m) => !professional.included.includes(m));
      if (addOns.length >= 3) {
        plan = enterprise;
        reasons.push(
          `You need ${addOns.length} modules beyond Professional. Enterprise includes them all and is usually better value at that point.`,
        );
        addOns = [];
      } else {
        plan = professional;
        if (needed.has("payroll") || needed.has("attendance")) {
          reasons.push("Professional brings payroll and attendance into the same system as your HR records, so data flows straight into each pay run.");
        }
        if (teamSize === "large") {
          reasons.push("At 200–1,000 employees, Professional’s reporting and approval workflows keep HR manageable.");
        }
      }
    }
  }

  // 3. Explain the reasoning in the visitor's own terms
  if (workforce !== "office") {
    reasons.push("Because your team works shifts or on-site, clock-in data and a mobile app for staff matter more than usual.");
  }
  if (countries === "few") {
    reasons.push("Multi-country payroll covers the local statutory rules in each of the 2–3 countries you pay people in.");
  }
  if (addOns.length > 0) {
    reasons.push(
      `Your priorities also call for ${addOns.map((m) => MODULES[m].name).join(" and ")}, available as add-ons.`,
    );
  }

  // 4. Practical advice on where to start (useful even if they never buy)
  const focusAreas: string[] = [];
  if (currentSetup === "spreadsheets") {
    focusAreas.push("Start by moving employee records and leave into one system. Clean data makes every later step easier.");
  }
  if (needed.has("attendance") && needed.has("payroll")) {
    focusAreas.push("Get attendance right before automating payroll. Most overtime and pay errors start with inaccurate time data.");
  } else if (needed.has("payroll")) {
    focusAreas.push("Run one or two parallel payrolls in the new system before switching over, so you can check every figure.");
  }
  if (currentSetup === "otherHr") {
    focusAreas.push("Plan your data migration early. Export employee records, leave balances and payroll history before your current contract ends.");
  }
  if (countries !== "one") {
    focusAreas.push("List the statutory requirements in each country up front, so payroll can be set up correctly from day one.");
  }
  if (focusAreas.length === 0) {
    focusAreas.push("Agree who owns each HR process and what ‘done’ looks like before you configure any software.");
  }

  // 5. One honest alternative
  let alternative: Recommendation["alternative"] = null;
  if (plan.id === "essentials") {
    alternative = { plan: professional, reason: "Choose Professional if you also want to run payroll and track attendance in the same system." };
  } else if (plan.id === "professional") {
    alternative =
      teamSize === "small" && !needed.has("payroll") && !needed.has("attendance")
        ? { plan: essentials, reason: "Essentials could be enough if you only need records and leave for now." }
        : { plan: enterprise, reason: "Consider Enterprise if you expect to grow past 1,000 people or into 4+ countries." };
  } else if (teamSize !== "xlarge" && countries !== "many") {
    alternative = { plan: professional, reason: "Professional with selected add-ons can work if you’d rather start smaller and expand later." };
  }

  // 6. Illustrative cost
  const employeesUsed = answers.employees ?? TEAM_SIZE_MIDPOINT[teamSize];
  const monthlyCostLkr =
    plan.priceLkr === null ? null : employeesUsed * (plan.priceLkr + addOns.length * ADD_ON_PRICE_LKR);

  return {
    plan,
    neededModules: [...needed],
    addOns,
    reasons,
    focusAreas: focusAreas.slice(0, 3),
    alternative,
    monthlyCostLkr,
    employeesUsed,
  };
}
