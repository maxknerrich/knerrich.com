import type { Heading } from "#lib/server/markdown.ts";

/**
 * An article's table of contents for <SectionOutline>: its intro and its `##`
 * sections. Only worth showing with a few sections, so it's empty below three.
 */
export function tableOfContents(headings: Heading[]) {
  const sections = [
    { id: "main", label: "Intro" },
    ...headings.filter(({ depth }) => depth === 2).map(({ id, text }) => ({ id, label: text })),
  ];
  return sections.length > 2 ? sections : [];
}
