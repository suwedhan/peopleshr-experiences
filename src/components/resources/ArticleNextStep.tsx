import Link from "next/link";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";
import type { Article } from "@/lib/articles";

/* The end-of-article next step. It always matches what the reader was
   reading about: a tool to apply the advice, or a template to download. */
export function ArticleNextStep({ article }: { article: Article }) {
  const { cta } = article;

  if (cta.type === "template") {
    return (
      <LeadCaptureForm
        source="resources"
        title={`Get the free ${cta.name}`}
        description={cta.description}
        submitLabel="Email me the template"
        successTitle="Template on its way"
        successMessage="Check your inbox in the next few minutes. We’ll only email you again if you ask."
        context={{ article: article.slug, template: cta.name }}
      />
    );
  }

  const content =
    cta.type === "calculator"
      ? {
          title: "See what manual HR admin costs your business",
          text: "Answer a few questions about your team and how you work today. Get an estimate of the hours and money involved, and whether automating is worth it.",
          href: "/cost-calculator",
          label: "Calculate your cost",
        }
      : {
          title: "Find the right HR software plan for your business",
          text: "Six quick questions about your team, locations and priorities. Get a recommended plan and practical advice on where to start.",
          href: "/plan-finder",
          label: "Find your plan",
        };

  return (
    <div className="rounded-2xl bg-ink p-6 text-white md:p-8">
      <h2 className="text-2xl font-bold">{content.title}</h2>
      <p className="mt-2 text-white/85">{content.text}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={content.href}
          className="rounded-lg bg-saffron px-5 py-3 font-semibold text-ink transition-colors hover:bg-white"
        >
          {content.label}
        </Link>
        <Link
          href="/#book-demo"
          className="rounded-lg border border-white/30 px-5 py-3 font-semibold text-white transition-colors hover:border-white"
        >
          Talk to a specialist
        </Link>
      </div>
    </div>
  );
}
