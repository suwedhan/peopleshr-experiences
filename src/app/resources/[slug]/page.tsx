import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { ArticleBody } from "@/components/resources/ArticleBody";
import { ArticleCard } from "@/components/resources/ArticleCard";
import { ArticleNextStep } from "@/components/resources/ArticleNextStep";
import { ARTICLES, TOPICS, formatDate, getArticle, getRelated } from "@/lib/articles";
import { siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

// Pre-render every guide as static HTML at build time
export function generateStaticParams() {
  return ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const url = `/resources/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url,
      publishedTime: article.published,
      modifiedTime: article.updated,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const url = `${siteConfig.url}/resources/${article.slug}`;
  const related = getRelated(article);
  const topic = TOPICS[article.topic];

  const toc = (
    <ol className="mt-3 space-y-2 text-sm">
      {article.sections.map((s) => (
        <li key={s.id}>
          <a href={`#${s.id}`} className="text-ink-soft hover:text-jade">
            {s.heading}
          </a>
        </li>
      ))}
      <li>
        <a href="#faq" className="text-ink-soft hover:text-jade">
          Common questions
        </a>
      </li>
    </ol>
  );

  return (
    <>
      {/* Structured data: article, breadcrumbs and FAQ */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          datePublished: article.published,
          dateModified: article.updated,
          mainEntityOfPage: url,
          articleSection: topic.name,
          author: { "@type": "Organization", name: "PeoplesHR HR team", url: siteConfig.url },
          publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "HR guides", item: `${siteConfig.url}/resources` },
            { "@type": "ListItem", position: 3, name: article.title, item: url },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />

      <div className="mx-auto max-w-6xl px-5 pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-ink-soft">
            <li>
              <Link href="/" className="hover:text-jade">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/resources" className="hover:text-jade">HR guides</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-ink">{article.title}</li>
          </ol>
        </nav>
      </div>

      <article>
        <header className="mx-auto max-w-6xl px-5 pt-8 pb-10">
          <p className="font-semibold text-jade">{topic.name}</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink-soft">{article.description}</p>
          <p className="mt-5 text-sm text-ink-soft">
            By the PeoplesHR HR team · Updated{" "}
            <time dateTime={article.updated}>{formatDate(article.updated)}</time> ·{" "}
            {article.readingMinutes} min read
          </p>
        </header>

        <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="min-w-0 max-w-3xl">
            {/* Direct answer first: what featured snippets and AI assistants quote */}
            <section aria-labelledby="short-answer" className="rounded-2xl border border-jade/30 bg-jade-tint p-6">
              <h2 id="short-answer" className="font-sans text-base font-bold">The short answer</h2>
              <p className="mt-2 text-lg leading-relaxed">{article.quickAnswer}</p>
            </section>

            <details className="mt-8 rounded-xl border border-line bg-surface p-4 lg:hidden">
              <summary className="cursor-pointer font-semibold">On this page</summary>
              {toc}
            </details>

            <div className="mt-12">
              <ArticleBody sections={article.sections} />
            </div>

            <section aria-labelledby="faq" className="mt-16">
              <h2 id="faq" className="scroll-mt-8 text-2xl font-bold tracking-tight md:text-3xl">
                Common questions
              </h2>
              <dl className="mt-6 divide-y divide-line border-y border-line">
                {article.faqs.map((faq) => (
                  <div key={faq.question} className="py-5">
                    <dt className="font-semibold">{faq.question}</dt>
                    <dd className="mt-2 text-ink-soft">{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="mt-16">
              <ArticleNextStep article={article} />
            </div>

            <p className="mt-8 text-sm text-ink-soft">
              This guide is general information, not legal or tax advice. Check
              current requirements with the relevant authority or your adviser.
            </p>
          </div>

          <aside className="hidden lg:block">
            <nav aria-label="On this page" className="sticky top-28">
              <p className="font-semibold">On this page</p>
              {toc}
            </nav>
          </aside>
        </div>
      </article>

      <section aria-labelledby="related-heading" className="mx-auto mt-20 max-w-6xl px-5">
        <h2 id="related-heading" className="text-3xl font-bold tracking-tight">
          Related guides
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <li key={r.slug}>
              <ArticleCard article={r} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
