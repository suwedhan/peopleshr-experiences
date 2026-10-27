import { ARTICLES, TOPICS } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

/*
  /llms.txt: a plain-text map of the site for AI assistants and LLM-based
  search (an emerging convention, see llmstxt.org). It points them to the
  most useful pages with a one-line summary of each.
*/
export function GET() {
  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "## Tools",
    `- [HR admin cost calculator](${siteConfig.url}/cost-calculator): estimate the time and money spent on manual payroll, attendance and leave.`,
    `- [Plan finder](${siteConfig.url}/plan-finder): six questions that recommend a PeoplesHR plan and modules.`,
    "",
    "## Guides",
    ...ARTICLES.map(
      (a) => `- [${a.title}](${siteConfig.url}/resources/${a.slug}) (${TOPICS[a.topic].name}): ${a.quickAnswer}`,
    ),
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
