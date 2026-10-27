

# PeoplesHR Web Experiences

Three interactive website experiences for PeoplesHR, built for the **Web Experience Engineer practical assessment**.

**Live site:** https://peopleshr-experiences.vercel.app

## Challenges selected

| # | Challenge | Solution | Live URL |
| --- | --- | --- | --- |
| 01 | Visitors cannot quantify the cost of inefficient work | HR admin cost calculator | https://peopleshr-experiences.vercel.app/cost-calculator |
| 02 | Buyers struggle to identify the right software option | Guided plan finder | https://peopleshr-experiences.vercel.app/plan-finder |
| 05 | Useful content does not lead visitors toward solutions | HR and payroll resource hub | https://peopleshr-experiences.vercel.app/resources |

The three experiences are connected rather than standalone. The calculator passes the visitor’s team size into the plan finder, guides link to whichever tool fits their topic, and every page ends in a lead form that tells sales what the visitor did.

```
Search / AI answer  →  Guide  →  Cost calculator  →  Plan finder  →  Demo request
                         ↑______________________________________________|
                               (each step links back to the others)
```

Ideas from Challenge 04 (lead capture with a clear value exchange) are built into all three: visitors get something useful first, such as an estimate, a recommendation or a template, and are then offered a relevant next step.

---

## Run locally

Requires **Node.js 20 or newer**.

```bash
git clone <this-repository-url>
cd peopleshr-experiences
npm install
npm run dev
```

Open http://localhost:3000.

For production, set `NEXT_PUBLIC_SITE_URL` to the deployed URL (see `.env.example`). It is used for canonical links, the sitemap, structured data and `llms.txt`. Locally it falls back to `http://localhost:3000`.

---

## Tech stack

- **Next.js 16 (App Router) with React and TypeScript.** Pages are pre-rendered to static HTML, so search engines and AI crawlers see full content. Interactive parts are React client components.
- **Tailwind CSS v4** with design tokens defined once in `globals.css`.
- **Vercel** for hosting, with automatic deploys on every push.

I chose Next.js over a plain React app because a client-only React app sends crawlers an almost empty page, which would undermine the SEO and GEO goals of Challenge 05.

## Project structure

```
src/
  app/
    page.tsx                  Home: links to the three experiences + demo form
    cost-calculator/          Challenge 01 page (SEO, method, FAQ)
    plan-finder/              Challenge 02 page (comparison table, FAQ)
    resources/                Challenge 05 hub
    resources/[slug]/         Individual guides (statically generated)
    api/leads/route.ts        Mock CRM endpoint
    sitemap.ts, robots.ts     Technical SEO
    llms.txt/route.ts         Site map for AI assistants
  components/                 Shared UI, plus one folder per experience
  lib/
    calculator.ts             Calculator formulas and assumptions
    plans.ts                  Plans, modules, questions and recommendation rules
    articles.ts               Guide content
```

Business logic lives in `src/lib` as plain data and pure functions, kept separate from the UI. Changing a price, an assumption, a question or a guide is usually a one-line edit, and the rest of the site updates to match.

---

## Challenge 01: HR admin cost calculator

**Problem.** HR and finance leads know manual admin is tedious but can’t put a number on it, so it never becomes a business case.

**Solution.** A calculator that asks questions visitors can actually answer, rather than “how many hours does payroll take?”:

- team size and HR staff salary
- how each process is handled today (mostly manual, partly automated or fully automated) for payroll, attendance, leave and employee records
- how often payslips need correcting

Results update live and show:

- the yearly cost of manual HR admin, in hours and in full-time equivalents
- a breakdown by process, now compared with PeoplesHR
- the time saved, its value, the estimated PeoplesHR cost and the net benefit

**An honest verdict.** The brief asks whether improving the process is *worthwhile*, so the calculator says so plainly: “A strong case”, “Worth exploring” or “A modest saving for now”. A small team can be told automation may not pay off yet. This builds trust that a tool which always says “buy” can’t.

**Transparent model.** Time per employee per task, adjusted for how automated the process is, multiplied by the hourly cost of HR staff (salary plus 15% employer EPF and ETF). Every assumption is shown on the page in a table rendered from the same data the formulas use, so the two can never disagree. Money is rounded to avoid false precision, and there is an LKR/USD toggle.

**Conversion.**

- “Email me this breakdown” sends the results to sales as lead context. A breakdown is something a visitor can forward to their manager.
- “Find the right plan for N employees” opens the plan finder with team size pre-filled.

**SEO.** A keyword-focused title and description, WebApplication and FAQPage structured data, and server-rendered method and FAQ content.

## Challenge 02: Plan finder

**Problem.** Buyers facing many modules and packages can’t tell what they need, and either stall or pick on price.

**Solution.** Six questions, one per screen: team size, countries, how the team works, up to three priorities, current tools and timeline. The result includes:

- **A recommended plan and add-ons**, with the reasons written in the visitor’s own terms.
- **Included modules**, with those matching their answers highlighted (“Matches your needs”).
- **“Where to start”**: practical advice that is useful even if they never buy, such as “get attendance right before automating payroll”.
- **An honest alternative**, sometimes a cheaper plan.

**Readable rules, not a hidden score** (`recommend()` in `lib/plans.ts`):

1. Answers map to the modules they need. For example, shift workers need attendance and the mobile app.
2. The smallest plan covering those modules is chosen. More than 1,000 employees or 4+ countries means Enterprise.
3. If Professional would need 3 or more add-ons, Enterprise is recommended as better value.

**Conversion.** The call to action depends on readiness:

| Timeline | Call to action |
| --- | --- |
| Within 3 months | Book a demo built around your answers |
| 3–6 months | Request a demo |
| Just researching | Email me this recommendation |

Every answer is sent with the lead, so sales starts the conversation already knowing the prospect’s size, priorities and timeline.

**SEO.** A server-rendered plan comparison table for visitors who prefer to compare themselves, plus FAQ content with structured data. The finder sits inside a `Suspense` boundary because it reads the URL (`?employees=`), which lets the rest of the page be pre-rendered as static HTML.

## Challenge 05: HR resource hub

**Problem.** Visitors arrive from search or AI tools with a question, read the answer and leave, with no path to related content or to PeoplesHR.

**Solution.** A hub of six practical guides in three topic clusters (payroll and compliance, attendance and leave, choosing HR software), with search and topic filters. Each guide follows the same journey:

1. **The short answer:** a direct 2–3 sentence answer at the top.
2. A table of contents, sections, tables and a worked example.
3. A contextual prompt partway through.
4. Question-style FAQs.
5. A next step that matches the topic:
    - The payroll mistakes guide leads to the cost calculator.
    - The attendance guide leads to the plan finder.
    - The leave policy guide offers a free template in exchange for an email.
6. Related guides, same topic first.

**SEO foundations.**

- Every guide is statically generated with a unique title, description, canonical URL and Open Graph article dates.
- Structured data: Article, BreadcrumbList and FAQPage on guides, and CollectionPage on the hub.
- Correct heading order, breadcrumbs and internal linking.
- A sitemap with `lastModified` dates, `robots.txt` and a branded 404 page.

**GEO (generative engine optimisation).**

- “Short answer” blocks and concise FAQ answers are the format AI assistants and featured snippets tend to quote.
- Visible authorship and updated dates signal credibility.
- `/llms.txt` gives AI tools a plain-text map of the site’s tools and guides, with a one-line answer for each.

**Content as data.** Guides live in `lib/articles.ts` in a structured format. In production this would come from a CMS such as Webflow, Contentful or Sanity using the same shape. Adding a guide updates the hub, search, sitemap, `llms.txt` and related links automatically.

---

## Across all three

- **Responsive:** designed mobile-first. Includes a floating navigation bar with a hamburger menu on small screens, and a sticky cost summary on mobile in the calculator.
- **Accessible:**
    - semantic HTML and real form controls (styled radios and checkboxes, labelled inputs)
    - visible keyboard focus, and focus moved to each new question or result
    - error messages linked to their fields, and live regions for updates
    - a skip link and reduced-motion support
    - all colour pairs checked against WCAG AA contrast
- **Performance:** static pre-rendering, no images or heavy libraries, and self-hosted fonts via `next/font`.
- **Lead capture:**
    - one shared form component with validation and honest privacy copy
    - every lead carries a `source` (which experience it came from) and a `context` (what the visitor did)
    - `/api/leads` stands in for a CRM; submissions are logged in Vercel
- **Analytics:** a `track()` helper records funnel events (`calculator_started`, `plan_recommended`, `lead_submitted`) to `dataLayer`, ready for Google Tag Manager.

## Assumptions

- Plans, prices, modules, time-per-task figures and the exchange rate are illustrative, as permitted by the brief. EPF (12% employer, 8% employee) and ETF (3% employer) rates reflect current Sri Lankan rules. Guides include a “not legal advice” note.
- No real CRM, email delivery or analytics are connected. The lead endpoint validates and logs submissions.

## What I’d do next with more time

- Connect leads to the CRM and send real emails with the calculator breakdown and plan recommendation.
- Let visitors share or save results with a link (state in the URL).
- A/B test calculator call-to-action wording and the number of plan finder questions.
- Move guides into the CMS and add topic landing pages for each cluster.
- Add an AI question box in the resource hub, building on PeoplesHR’s Lexi AI, that answers using the guides and links to the right one.
- Industry-specific advice in the plan finder (manufacturing, hospitality, retail and so on).

## Use of AI tools

As the brief encourages, I used AI tools (Claude) for ideation, research, coding and testing. I reviewed and tested all decisions, logic and content, and can explain and change any part of it.