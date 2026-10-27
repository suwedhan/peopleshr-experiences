/*
  Content for the HR resource hub (Challenge 05).
  Articles are structured data rather than raw HTML, so every page gets
  consistent headings, a table of contents, FAQ schema and a relevant
  next step. In production this would come from a CMS (e.g. Webflow,
  Contentful or Sanity) with the same shape.
*/

export type TopicId = "payroll" | "time" | "software";

export const TOPICS: Record<TopicId, { name: string; description: string }> = {
  payroll: {
    name: "Payroll and compliance",
    description: "EPF, ETF, payslips and getting every pay run right",
  },
  time: {
    name: "Attendance and leave",
    description: "Tracking time, shifts and leave fairly and accurately",
  },
  software: {
    name: "Choosing HR software",
    description: "When to switch, what to look for and how to compare options",
  },
};

export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "table"; caption: string; head: string[]; rows: string[][] }
  | { type: "callout"; text: string };

export type Section = { id: string; heading: string; blocks: Block[] };

/** The contextual next step shown inside and after the article */
export type ArticleCta =
  | { type: "calculator" }
  | { type: "planFinder" }
  | { type: "template"; name: string; description: string };

export type Article = {
  slug: string;
  title: string;
  description: string;
  topic: TopicId;
  published: string;
  updated: string;
  readingMinutes: number;
  /** A direct 2–3 sentence answer at the top: what search snippets and AI assistants quote */
  quickAnswer: string;
  sections: Section[];
  faqs: { question: string; answer: string }[];
  cta: ArticleCta;
};

export const ARTICLES: Article[] = [
  {
    slug: "epf-etf-contributions-sri-lanka",
    title: "How to calculate EPF and ETF contributions in Sri Lanka",
    description:
      "A step-by-step guide to EPF and ETF for Sri Lankan employers: the rates, which earnings to include, a worked example and the mistakes that lead to surcharges.",
    topic: "payroll",
    published: "2026-08-12",
    updated: "2026-10-20",
    readingMinutes: 6,
    quickAnswer:
      "Employers in Sri Lanka contribute 12% of an employee’s total monthly earnings to EPF and deduct a further 8% from the employee, making 20% in total. Employers also pay 3% to ETF, with no employee share. Both are calculated on total earnings, not basic salary alone.",
    sections: [
      {
        id: "rates",
        heading: "EPF and ETF rates at a glance",
        blocks: [
          {
            type: "table",
            caption: "Statutory EPF and ETF contribution rates in Sri Lanka",
            head: ["Fund", "Employer pays", "Employee pays", "Paid to"],
            rows: [
              ["EPF (Employees’ Provident Fund)", "12%", "8% (deducted from pay)", "Central Bank of Sri Lanka"],
              ["ETF (Employees’ Trust Fund)", "3%", "Nothing", "Employees’ Trust Fund Board"],
            ],
          },
          {
            type: "p",
            text: "Together, these add 15% to the employer’s cost of each employee’s earnings, on top of the 8% the employee contributes.",
          },
        ],
      },
      {
        id: "total-earnings",
        heading: "Which earnings to include",
        blocks: [
          {
            type: "p",
            text: "Contributions are based on total earnings, which usually means basic salary plus regular, fixed allowances such as cost-of-living allowances. Calculating on basic salary alone is one of the most common causes of underpayment.",
          },
          {
            type: "list",
            items: [
              "Usually included: basic salary, fixed monthly allowances, cost-of-living allowance.",
              "Check case by case: overtime, commissions, bonuses and reimbursements, as treatment depends on how they’re paid.",
              "If you’re unsure about an allowance, check with the EPF Department or your auditor before the first run.",
            ],
          },
        ],
      },
      {
        id: "worked-example",
        heading: "A worked example",
        blocks: [
          {
            type: "p",
            text: "Nimal earns a basic salary of LKR 100,000 plus a fixed allowance of LKR 20,000, so his total earnings for EPF and ETF are LKR 120,000.",
          },
          {
            type: "table",
            caption: "EPF and ETF for total earnings of LKR 120,000",
            head: ["Contribution", "Rate", "Amount"],
            rows: [
              ["Employee EPF (deducted)", "8%", "LKR 9,600"],
              ["Employer EPF", "12%", "LKR 14,400"],
              ["Employer ETF", "3%", "LKR 3,600"],
              ["Total sent to the funds", "23%", "LKR 27,600"],
            ],
          },
          {
            type: "p",
            text: "Nimal’s pay before tax is reduced by LKR 9,600. The cost to his employer is LKR 120,000 plus LKR 18,000 in employer contributions.",
          },
        ],
      },
      {
        id: "paying",
        heading: "When and how to pay",
        blocks: [
          {
            type: "p",
            text: "EPF and ETF are paid monthly, with a schedule listing each employee and their earnings, by the end of the month after the one they relate to. Late payments attract surcharges, so build the deadline into your payroll calendar rather than relying on memory.",
          },
        ],
      },
      {
        id: "mistakes",
        heading: "Common mistakes to avoid",
        blocks: [
          {
            type: "list",
            items: [
              "Calculating on basic salary instead of total earnings.",
              "Forgetting new joiners or leavers part-way through the month.",
              "Using an old spreadsheet formula after pay structures change.",
              "Missing the payment deadline during busy periods or holidays.",
            ],
          },
          {
            type: "callout",
            text: "Payroll software calculates EPF and ETF on the right earnings every month and produces the schedules for you, which removes most of these errors.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What are the EPF and ETF rates in Sri Lanka?",
        answer:
          "EPF is 20% of total earnings: 12% from the employer and 8% deducted from the employee. ETF is 3%, paid only by the employer.",
      },
      {
        question: "Is EPF calculated on basic salary or total earnings?",
        answer:
          "Total earnings. That usually includes basic salary and regular fixed allowances, not basic salary alone.",
      },
      {
        question: "Does the employee contribute to ETF?",
        answer: "No. ETF is funded entirely by the employer at 3% of total earnings.",
      },
    ],
    cta: { type: "planFinder" },
  },
  {
    slug: "common-payroll-mistakes",
    title: "7 common payroll mistakes and how to prevent them",
    description:
      "The payroll errors growing businesses make most often, what they really cost, and simple checks that stop them before payslips go out.",
    topic: "payroll",
    published: "2026-07-03",
    updated: "2026-10-14",
    readingMinutes: 5,
    quickAnswer:
      "Most payroll mistakes come from inaccurate attendance data, outdated employee records, manual overtime calculations and statutory deductions applied to the wrong earnings. A short pre-run checklist and a single source of employee data prevent the majority of them.",
    sections: [
      {
        id: "mistakes",
        heading: "The 7 mistakes",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Paying from inaccurate attendance or timesheet data.",
              "Calculating overtime by hand, at the wrong rate.",
              "Missing changes: new joiners, leavers, promotions and salary revisions.",
              "Applying EPF and ETF to basic salary instead of total earnings.",
              "Not recording unpaid leave, so no-pay days are paid in full.",
              "Keeping payroll data in several spreadsheets that disagree.",
              "Missing statutory payment deadlines.",
            ],
          },
        ],
      },
      {
        id: "cost",
        heading: "What payroll errors really cost",
        blocks: [
          {
            type: "p",
            text: "Each error takes time to investigate, correct and explain, often an hour or more of HR time. There are also surcharges for late or incorrect statutory payments, and a less visible cost: employees lose trust when their pay is wrong.",
          },
          {
            type: "callout",
            text: "Want a number for your business? Our cost calculator estimates the time your team spends fixing payroll errors and on other manual HR work.",
          },
        ],
      },
      {
        id: "checklist",
        heading: "A pre-payroll checklist",
        blocks: [
          {
            type: "list",
            items: [
              "Attendance for the period is complete and approved by managers.",
              "All joiners, leavers and pay changes are entered.",
              "Unpaid leave is recorded.",
              "Overtime totals have been reviewed for unusual figures.",
              "Totals are compared with last month and big differences explained.",
            ],
          },
        ],
      },
      {
        id: "prevent",
        heading: "Preventing errors for good",
        blocks: [
          {
            type: "p",
            text: "Checklists reduce errors, but the lasting fix is to stop re-typing data. When attendance, leave and employee records feed directly into payroll, most of these mistakes can’t happen in the first place.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What is the most common payroll mistake?",
        answer:
          "Paying from inaccurate attendance data. Wrong hours flow straight into overtime and no-pay calculations.",
      },
      {
        question: "How can small businesses reduce payroll errors?",
        answer:
          "Keep one source of employee data, approve attendance before each run, and compare totals with the previous month before paying.",
      },
    ],
    cta: { type: "calculator" },
  },
  {
    slug: "attendance-tracking-shift-workers",
    title: "How to track attendance for shift workers",
    description:
      "Practical ways to track attendance for factory, retail and field teams: clock-in options, rostering, overtime and how attendance connects to payroll.",
    topic: "time",
    published: "2026-06-18",
    updated: "2026-10-02",
    readingMinutes: 5,
    quickAnswer:
      "The most reliable way to track shift attendance is to combine planned rosters with automatic clock-in records, from biometric devices or a mobile app, in one system. Comparing the two highlights late arrivals, missed punches and overtime before payroll is run.",
    sections: [
      {
        id: "why",
        heading: "Why shift attendance is harder",
        blocks: [
          {
            type: "p",
            text: "Shift teams work changing hours, often across several sites, with night shifts that cross midnight and overtime that varies week to week. Paper registers and spreadsheets struggle to keep up, and errors flow directly into pay.",
          },
        ],
      },
      {
        id: "options",
        heading: "Clock-in options compared",
        blocks: [
          {
            type: "table",
            caption: "Common ways to record attendance for shift workers",
            head: ["Method", "Best for", "Watch out for"],
            rows: [
              ["Biometric device", "Fixed sites such as factories and warehouses", "Device downtime and manual uploads"],
              ["Mobile app with location", "Field teams and multiple sites", "Phone access and battery"],
              ["Supervisor sign-off", "Very small teams", "Accuracy and time cost"],
            ],
          },
        ],
      },
      {
        id: "rostering",
        heading: "Plan rosters, then compare",
        blocks: [
          {
            type: "p",
            text: "Publish rosters in advance so everyone knows their shifts. Then compare actual clock-ins against the roster each day, so supervisors fix gaps while they still remember what happened.",
          },
        ],
      },
      {
        id: "payroll",
        heading: "Connecting attendance to payroll",
        blocks: [
          {
            type: "p",
            text: "Attendance only saves time if it flows into payroll without re-typing. Approved hours, overtime and no-pay days should move straight into the pay run.",
          },
          {
            type: "callout",
            text: "If attendance is your biggest headache, our plan finder shows which PeoplesHR modules cover rostering, clock-in and payroll together.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What is the best way to track attendance for shift workers?",
        answer:
          "Combine published rosters with automatic clock-in from biometric devices or a mobile app, and review the differences daily.",
      },
      {
        question: "How do you handle night shifts that cross midnight?",
        answer:
          "Record shifts by their start date and use a system that understands overnight shifts, so hours aren’t split across two days.",
      },
    ],
    cta: { type: "planFinder" },
  },
  {
    slug: "leave-policy-guide",
    title: "How to write a leave policy employees understand",
    description:
      "What to include in a company leave policy, how to explain entitlements clearly, and a free template to adapt for your business.",
    topic: "time",
    published: "2026-05-22",
    updated: "2026-09-30",
    readingMinutes: 4,
    quickAnswer:
      "A good leave policy states each type of leave, how much people get, how to request it, who approves it and what happens to unused days. Keep it short, use examples, and make sure it meets the statutory minimums for every country you operate in.",
    sections: [
      {
        id: "include",
        heading: "What to include",
        blocks: [
          {
            type: "list",
            items: [
              "Types of leave: annual, casual, sick, maternity and paternity, and unpaid leave.",
              "Entitlements, including how leave builds up for new joiners.",
              "How to request leave and how much notice is needed.",
              "Who approves requests and how quickly.",
              "What happens to unused leave at year end.",
            ],
          },
          {
            type: "callout",
            text: "Statutory leave entitlements vary by country and by type of employer. Check the minimums that apply to your business before you publish.",
          },
        ],
      },
      {
        id: "clear",
        heading: "Making it easy to understand",
        blocks: [
          {
            type: "p",
            text: "Write for the employee, not the lawyer. Use short sentences, put entitlements in a table, and include a worked example for anyone joining part-way through the year.",
          },
        ],
      },
      {
        id: "running",
        heading: "Running leave day to day",
        blocks: [
          {
            type: "p",
            text: "Most leave disputes come from unclear balances. When employees can see their own balance and request leave from their phone, HR spends far less time answering questions.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What should a leave policy include?",
        answer:
          "Leave types, entitlements, how to request leave, who approves it, notice periods and how unused leave is handled.",
      },
      {
        question: "How long should a leave policy be?",
        answer: "Usually two to three pages. Put entitlements in a table and link to the request process.",
      },
    ],
    cta: {
      type: "template",
      name: "leave policy template",
      description: "An editable Word template with sections for each leave type and a sample entitlement table.",
    },
  },
  {
    slug: "spreadsheets-vs-hr-software",
    title: "Spreadsheets vs HR software: when is it time to switch?",
    description:
      "The signs your business has outgrown HR spreadsheets, what switching involves, and how to work out whether HR software is worth the cost.",
    topic: "software",
    published: "2026-04-10",
    updated: "2026-10-18",
    readingMinutes: 5,
    quickAnswer:
      "Spreadsheets work for very small teams, but most businesses outgrow them at around 30 to 50 employees, or sooner with shift work. The signs are frequent payroll corrections, several versions of the same data, and HR spending most of its time on admin.",
    sections: [
      {
        id: "signs",
        heading: "Signs you’ve outgrown spreadsheets",
        blocks: [
          {
            type: "list",
            items: [
              "Payslips regularly need correcting after payroll runs.",
              "Several people keep their own version of employee data.",
              "Leave balances are disputed or hard to find.",
              "Month-end payroll takes days rather than hours.",
              "Management can’t get basic reports such as headcount or overtime costs quickly.",
            ],
          },
        ],
      },
      {
        id: "compare",
        heading: "How they compare",
        blocks: [
          {
            type: "table",
            caption: "Spreadsheets compared with HR software",
            head: ["", "Spreadsheets", "HR software"],
            rows: [
              ["Cost to start", "Free", "Monthly subscription"],
              ["Time per payroll run", "High, grows with headcount", "Low, mostly checking"],
              ["Error risk", "High, from re-typing", "Low, data entered once"],
              ["Employee self-service", "No", "Yes, usually on mobile"],
              ["Reports", "Built by hand", "Ready-made"],
            ],
          },
        ],
      },
      {
        id: "worth-it",
        heading: "Is it worth the cost?",
        blocks: [
          {
            type: "p",
            text: "Compare the subscription with the hours your team spends on manual HR work and fixing errors. For small teams the saving can be modest; as headcount grows it usually outweighs the cost several times over.",
          },
          {
            type: "callout",
            text: "Our cost calculator estimates this for your business in about a minute, and tells you honestly if the saving is small.",
          },
        ],
      },
      {
        id: "switching",
        heading: "What switching involves",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Clean up and export your employee data.",
              "Set up leave types, pay structures and approvals.",
              "Run one or two payrolls in parallel to check every figure.",
              "Switch over, and give employees access to self-service.",
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        question: "At what size should a business move to HR software?",
        answer:
          "Most businesses benefit at around 30 to 50 employees, or earlier if they run shifts or pay people in more than one country.",
      },
      {
        question: "How long does it take to switch from spreadsheets?",
        answer:
          "For a small or mid-sized business, typically a few weeks, including one or two parallel payroll runs.",
      },
    ],
    cta: { type: "calculator" },
  },
  {
    slug: "hr-software-buying-checklist",
    title: "HR software buying checklist: 10 questions to ask vendors",
    description:
      "The questions to ask before choosing HR and payroll software, covering local compliance, implementation, support, data security and pricing.",
    topic: "software",
    published: "2026-03-15",
    updated: "2026-10-08",
    readingMinutes: 4,
    quickAnswer:
      "Before choosing HR software, check that it handles your local payroll rules, fits your size and growth plans, has a clear implementation plan, and is transparent about pricing and data security. Ask each vendor the same questions so you can compare fairly.",
    sections: [
      {
        id: "questions",
        heading: "The 10 questions",
        blocks: [
          {
            type: "list",
            ordered: true,
            items: [
              "Does it calculate statutory deductions for every country we operate in?",
              "Can it handle our shift patterns, overtime rules and allowances?",
              "How long does implementation take, and who does the work?",
              "How will our existing data be migrated?",
              "Is there a mobile app for employees and managers?",
              "What reports are included as standard?",
              "Where is our data stored, and how is it secured?",
              "What does support look like, and in which time zones?",
              "How is pricing calculated as we grow?",
              "Can we speak to a customer similar to us?",
            ],
          },
        ],
      },
      {
        id: "compare",
        heading: "Comparing vendors fairly",
        blocks: [
          {
            type: "p",
            text: "Score each vendor against the same questions, and weight the ones that matter most to you. A short demo using your own scenarios, such as a tricky overtime case, tells you more than a standard presentation.",
          },
          {
            type: "callout",
            text: "Not sure which capabilities matter most for you? The plan finder helps you work out your must-haves in six questions.",
          },
        ],
      },
    ],
    faqs: [
      {
        question: "What should I look for in HR software?",
        answer:
          "Local payroll compliance, support for your working patterns, a clear implementation plan, mobile self-service, data security and transparent pricing.",
      },
    ],
    cta: {
      type: "template",
      name: "vendor comparison scorecard",
      description: "A spreadsheet with all 10 questions, weightings and space to score up to four vendors.",
    },
  },
];

export const getArticle = (slug: string) => ARTICLES.find((a) => a.slug === slug);

/** Same-topic articles first, then the most recently updated others */
export function getRelated(article: Article, count = 3) {
  const others = ARTICLES.filter((a) => a.slug !== article.slug);
  const sameTopic = others.filter((a) => a.topic === article.topic);
  const rest = others
    .filter((a) => a.topic !== article.topic)
    .sort((a, b) => b.updated.localeCompare(a.updated));
  return [...sameTopic, ...rest].slice(0, count);
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
