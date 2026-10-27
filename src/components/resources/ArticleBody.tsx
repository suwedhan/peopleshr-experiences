import type { Block, Section } from "@/lib/articles";

function BlockView({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="mt-4 leading-relaxed">{block.text}</p>;
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List className={`mt-4 space-y-2 pl-6 leading-relaxed ${block.ordered ? "list-decimal" : "list-disc"}`}>
          {block.items.map((item) => (
            <li key={item} className="pl-1">{item}</li>
          ))}
        </List>
      );
    }
    case "table":
      return (
        <div className="mt-5 overflow-x-auto rounded-xl border border-line bg-surface">
          <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
            <caption className="sr-only">{block.caption}</caption>
            <thead>
              <tr className="border-b border-line bg-paper">
                {block.head.map((h, i) => (
                  <th key={i} scope="col" className="p-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join("|")} className="border-b border-line last:border-0">
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="p-3 font-medium">{cell}</th>
                    ) : (
                      <td key={i} className="p-3 tabular-nums">{cell}</td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case "callout":
      return (
        <p className="mt-5 rounded-xl border-l-4 border-saffron bg-saffron-tint p-4 leading-relaxed">
          {block.text}
        </p>
      );
  }
}

export function ArticleBody({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.id} aria-labelledby={section.id} className="mt-12 first:mt-0">
          <h2 id={section.id} className="scroll-mt-8 text-2xl font-bold tracking-tight md:text-3xl">
            {section.heading}
          </h2>
          {section.blocks.map((block, i) => (
            <BlockView key={i} block={block} />
          ))}
        </section>
      ))}
    </>
  );
}
