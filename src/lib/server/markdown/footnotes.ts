import { walkTokens, type Token, type TokenizerAndRendererExtension } from "marked";
import { FOOTNOTE_ID } from "#lib/writing/syntax.ts";
import { slug } from "./headings.ts";

type FootnoteRef = {
  type: "footnoteRef";
  raw: string;
  label: string;
  number?: number;
  id?: string;
};
type Footnote = { type: "footnote"; raw: string; label: string; tokens: Token[] };
type Footnotes = { type: "footnotes"; raw: ""; items: { number: number; note: Footnote }[] };

const footnoteId = (label: string) => `fn-${slug(label)}`;
const LABEL = FOOTNOTE_ID.source.replace(/^\^|\$$/g, "");
const DEFINITION = new RegExp(
  `^\\[\\^(${LABEL})\\]:[ \\t]+([^\\n]*(?:\\n(?:[ ]{2,}|\\t)[^\\n]*)*)(?:\\n|$)`,
);
const REFERENCE = new RegExp(`^\\[\\^(${LABEL})\\](?!:)`);

export const footnoteExtensions: TokenizerAndRendererExtension[] = [
  {
    name: "footnote",
    level: "block",
    tokenizer(src) {
      const match = DEFINITION.exec(src);
      if (!match) return undefined;
      const [raw, label = "", text = ""] = match;
      const footnote: Footnote = {
        type: "footnote",
        raw,
        label,
        tokens: this.lexer.blockTokens(text.replace(/\n(?:[ ]{2,}|\t)/g, "\n")),
      };
      return footnote;
    },
    renderer: () => "",
  },
  {
    name: "footnoteRef",
    level: "inline",
    start: (src) => src.indexOf("[^"),
    tokenizer(src) {
      const match = REFERENCE.exec(src);
      if (!match) return undefined;
      const ref: FootnoteRef = { type: "footnoteRef", raw: match[0], label: match[1] ?? "" };
      return ref;
    },
    renderer(token) {
      const { label, number, id } = token as FootnoteRef;
      if (!number) return "";
      return `<sup><a href="#${footnoteId(label)}" id="${id}" data-role="footnote-ref" aria-label="Footnote ${number}">${number}</a></sup>`;
    },
  },
  {
    name: "footnotes",
    renderer(token) {
      const items = (token as Footnotes).items.map(({ number, note }) => {
        const body = this.parser.parse(note.tokens).trimEnd();
        const back = `<a href="#${footnoteId(note.label)}-ref" data-role="footnote-number" aria-label="Back to footnote ${number} in the text">${number}</a>`;
        return `<li id="${footnoteId(note.label)}" data-role="footnote">${back}<div>${body}</div></li>`;
      });
      return `<section data-role="footnotes" aria-label="Footnotes"><ol data-role="footnote-list">${items.join("")}</ol></section>`;
    },
  },
];

const isFootnote = (token: Token): token is Token & Footnote => token.type === "footnote";

export function numberFootnotes(tokens: Token[]) {
  const definitions = tokens.filter(isFootnote);
  const notes = new Map<string, Footnote>(definitions.map((note) => [note.label, note]));
  const text = tokens.filter((token) => !isFootnote(token));
  const numbers = new Map<string, number>();
  const refCount = new Map<string, number>();
  const problems: string[] = [];
  if (notes.size < definitions.length) problems.push("defines a footnote twice");
  void walkTokens([...text, ...notes.values()], (token) => {
    if (token.type !== "footnoteRef") return;
    const { label } = token as FootnoteRef;
    if (!notes.has(label)) problems.push(`references footnote [^${label}], which isn't defined`);
    const number = numbers.get(label) ?? numbers.size + 1;
    const count = (refCount.get(label) ?? 0) + 1;
    numbers.set(label, number);
    refCount.set(label, count);
    const id = `${footnoteId(label)}-ref${count > 1 ? `-${count}` : ""}`;
    Object.assign(token, { number, id });
  });
  for (const label of notes.keys())
    if (!numbers.has(label)) problems.push(`footnote [^${label}] is never referenced`);
  const items = [...numbers].flatMap(([label, number]) => {
    const note = notes.get(label);
    return note ? [{ number, note }] : [];
  });
  const list: Footnotes = { type: "footnotes", raw: "", items };
  return {
    text,
    bodies: [...notes.values()],
    list: items.length ? (list as Token) : undefined,
    problems,
  };
}
