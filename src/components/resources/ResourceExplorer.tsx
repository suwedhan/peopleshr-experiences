"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { TOPICS, type TopicId } from "@/lib/articles";
import { track } from "@/lib/analytics";
import { ArticleCard, type ArticleSummary } from "./ArticleCard";

type Filter = TopicId | "all";

/* Search and topic filters for the guides. The full list is server-rendered
   (so crawlers see every guide); filtering just narrows it in the browser. */
export function ResourceExplorer({ articles }: { articles: ArticleSummary[] }) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<Filter>("all");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      const matchesTopic = topic === "all" || a.topic === topic;
      const matchesQuery =
        !q || [a.title, a.description, a.quickAnswer].some((text) => text.toLowerCase().includes(q));
      return matchesTopic && matchesQuery;
    });
  }, [articles, query, topic]);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All guides" },
    ...(Object.keys(TOPICS) as TopicId[]).map((id) => ({ id, label: TOPICS[id].name })),
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="w-full max-w-md">
          <label htmlFor="guide-search" className="font-semibold">
            Search the guides
          </label>
          <input
            id="guide-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onBlur={() => query && track("resource_search", { query })}
            placeholder="e.g. EPF, overtime, leave policy"
            className="mt-2 h-12 w-full rounded-lg border border-line bg-surface px-4 text-base"
          />
        </div>
        <div role="group" aria-label="Filter by topic" className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={topic === f.id}
              onClick={() => setTopic(f.id)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                topic === f.id ? "border-jade bg-jade text-white" : "border-line bg-surface hover:border-ink/40"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p aria-live="polite" className="mt-6 text-sm text-ink-soft">
        {results.length === articles.length
          ? `${results.length} guides`
          : `${results.length} of ${articles.length} guides`}
      </p>

      {results.length > 0 ? (
        <ul className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((article) => (
            <li key={article.slug}>
              <ArticleCard article={article} headingLevel="h3" />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-3 rounded-xl border border-dashed border-line bg-surface p-8">
          <p className="font-semibold">No guides match “{query}” yet.</p>
          <p className="mt-1 text-ink-soft">
            Try a broader word, or{" "}
            <Link href="/#book-demo" className="font-semibold text-jade underline underline-offset-4">
              ask a PeoplesHR specialist
            </Link>
            . We use these questions to decide what to write next.
          </p>
        </div>
      )}
    </div>
  );
}
