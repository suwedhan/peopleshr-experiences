import { ButtonLink } from "@/components/ButtonLink";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-5 py-24">
      <h1 className="text-4xl font-bold tracking-tight md:text-5xl">We couldn’t find that page</h1>
      <p className="mt-4 text-lg text-ink-soft">
        It may have moved, or the link may be wrong. These are good places to start.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/resources">Browse HR guides</ButtonLink>
        <ButtonLink href="/" variant="secondary">Go to the homepage</ButtonLink>
      </div>
    </section>
  );
}
