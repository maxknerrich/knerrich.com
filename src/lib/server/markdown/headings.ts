import type { RendererObject, Token, Tokens } from "marked";
import { iconHtml } from "./html.ts";

export type Heading = { id: string; text: string; depth: number };

export const plain = (text: string) =>
  text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_`~]/g, "");

export const slug = (text: string) =>
  plain(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "section";

export const headingRenderer: RendererObject = {
  heading(token) {
    const id = "id" in token && typeof token.id === "string" ? token.id : slug(token.text);
    const link = `<a href="#${id}" data-role="heading-link" aria-label="Copy link to “${plain(token.text).replaceAll('"', "&quot;")}”" title="Copy link">${iconHtml("link", ' width="16" height="16"')}</a>`;
    return `<h${token.depth} id="${id}" aria-labelledby="${id}--name"><span id="${id}--name">${this.parser.parseInline(token.tokens)}</span>${link}</h${token.depth}>\n`;
  },
};

const isHeading = (token: Token): token is Tokens.Heading => token.type === "heading";

export function collectHeadings(tokens: Token[], reserved: readonly string[]): Heading[] {
  const used = new Set(reserved);
  return tokens.filter(isHeading).map((heading) => {
    const base = slug(heading.text);
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    Object.assign(heading, { id });
    return { id, text: plain(heading.text), depth: heading.depth };
  });
}
