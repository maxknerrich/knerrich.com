import type { Element, ElementContent } from "hast";
import { fromHtml } from "hast-util-from-html";
import { Schema } from "effect";
import { walkTokens, type Token, type Tokens } from "marked";
import type { IconName } from "#lib/icons/glyphs.ts";
import { NOTE_KINDS, NOTE_LINE, NoteKind } from "#lib/writing/syntax.ts";
import { iconHtml, isElement, textOf } from "./html.ts";

const NOTES = {
  NOTE: { title: "Note", icon: "note" },
  TIP: { title: "Tip", icon: "tip" },
  IMPORTANT: { title: "Important", icon: "important" },
  WARNING: { title: "Warning", icon: "warning" },
  CAUTION: { title: "Caution", icon: "caution" },
} as const satisfies Record<NoteKind, { title: string; icon: IconName }>;

const icon = (kind: NoteKind) =>
  fromHtml(iconHtml(NOTES[kind].icon, ' data-role="note-icon"'), {
    fragment: true,
  }).children.filter(isElement);

const isNoteKind = Schema.is(NoteKind);

function noteLine(firstLine: string) {
  const match = NOTE_LINE.exec(firstLine);
  return match
    ? { kind: match[1] ?? "", marker: match[0].length - (match[2] ?? "").length }
    : undefined;
}

export function note(quote: Element): { block: Element; kind: NoteKind } | undefined {
  if (quote.tagName !== "blockquote") return undefined;
  const first = quote.children.find(isElement);
  const [lead] = first?.tagName === "p" ? first.children : [];
  if (!first || lead?.type !== "text") return undefined;
  const line = noteLine(lead.value.split("\n")[0] ?? "");
  const kind = line?.kind;
  if (!line || !isNoteKind(kind)) return undefined;
  lead.value = lead.value.slice(line.marker);
  const title: ElementContent[] = [];
  while (first.children.length) {
    const node = first.children.shift();
    if (!node) break;
    const lineBreak = node.type === "text" ? node.value.indexOf("\n") : -1;
    if (node.type === "text" && lineBreak !== -1) {
      title.push({ type: "text", value: node.value.slice(0, lineBreak) });
      first.children.unshift({ type: "text", value: node.value.slice(lineBreak + 1) });
      break;
    }
    if (isElement(node) && node.tagName === "br") break;
    title.push(node);
  }
  const label = textOf(title).trim() || NOTES[kind].title;
  const body = quote.children.filter(
    (node) => isElement(node) && (node !== first || textOf(node.children).trim()),
  );
  const block: Element = {
    type: "element",
    tagName: "aside",
    properties: { ariaLabel: label, dataRole: "note", dataKind: kind.toLowerCase() },
    children: [
      {
        type: "element",
        tagName: "p",
        properties: { dataRole: "note-title" },
        children: [
          ...icon(kind),
          ...(textOf(title).trim() ? title : [{ type: "text" as const, value: label }]),
        ],
      },
      ...body,
    ],
  };
  return { block, kind };
}

export function noteProblems(text: Token[], bodies: Token[]) {
  const outer = new Set(text);
  const problems: string[] = [];
  void walkTokens([...text, ...bodies], (token) => {
    if (token.type !== "blockquote") return;
    const line = noteLine((token as Tokens.Blockquote).text.split("\n")[0] ?? "");
    if (line && !isNoteKind(line.kind))
      problems.push(`[!${line.kind}] isn't a note kind (${NOTE_KINDS.join(", ")})`);
    else if (line && !outer.has(token)) problems.push(`[!${line.kind}] notes can't be nested`);
  });
  return problems;
}
