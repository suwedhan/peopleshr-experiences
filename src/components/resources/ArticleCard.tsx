import Link from "next/link";
import { TOPICS, type Article } from "@/lib/articles";

export type ArticleSummary = Pick<
  Article,
  "slug" | "title" | "description" | "topic" | "readingMinutes" | "quickAnswer"
>;

export function ArticleCard({ article, headingLevel = "h3" }: { article: ArticleSummary; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return (
    <article className="group relative flex h-full flex-col rounded-xl border border-line bg-surface p-5 transition-colors hover:border-jade">
      <p className="text-sm font-medium text-jade">{TOPICS[article.topic].name}</p>
      <Heading className="mt-2 font-sans text-lg font-bold leading-snug">
        {/* The stretched link makes the whole card clickable while keeping one link per card */}
        <Link href={`/resources/${article.slug}`} className="after:absolute after:inset-0 group-hover:text-jade">
          {article.title}
        </Link>
      </Heading>
      <p className="mt-2 flex-1 text-sm text-ink-soft">{article.description}</p>
      <p className="mt-4 text-sm text-ink-soft">{article.readingMinutes} min read</p>
    </article>
  );
}
