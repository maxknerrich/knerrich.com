import type { Element } from "hast";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";
import { Effect } from "effect";
import { Marked, walkTokens, type Token, type Tokens } from "marked";
import { noteKinds, parts, prose } from "#lib/styles/prose.ts";
import { ContentError } from "#lib/writing/frontmatter.ts";
import type { NoteKind } from "#lib/writing/syntax.ts";
import { codeBlock, type CodeBlock } from "./code.ts";
import { embedBlock, isEmbed, stepLinkProblem, stepLinksIn, type AnyEmbedBlock } from "./embeds.ts";
import { imageProblems, useProcessedImages, withFigures } from "./figures.ts";
import { footnoteExtensions, numberFootnotes } from "./footnotes.ts";
import { collectHeadings, headingRenderer } from "./headings.ts";
import { isElement, style } from "./html.ts";
import { groupKeys, linkData } from "./inline.ts";
import { note, noteProblems } from "./notes.ts";

export type Block = { kind: "html"; html: string } | CodeBlock | AnyEmbedBlock;
export type Figures = "wide" | "box";
export type { Heading } from "./headings.ts";

export const markdown = new Marked({ extensions: footnoteExtensions, renderer: headingRenderer });

type Options = { figures: Figures; source: string };

function renderHtml(tokens: Token[], opening: boolean, { figures, source }: Options) {
  const blocks: { block: Element; kind?: NoteKind }[] = withFigures(
    fromHtml(markdown.parser(tokens), { fragment: true }),
  ).map((block) => note(block) ?? { block });
  for (const [index, { block, kind }] of blocks.entries()) {
    linkData(block);
    groupKeys(block);
    if (kind) {
      style(block, prose.box, noteKinds[kind]);
      for (const child of block.children)
        if (isElement(child)) style(child, undefined, parts.inNote);
    } else {
      style(
        block,
        block.tagName === "figure" ? (figures === "box" ? prose.box : prose.wide) : prose.column,
        opening && index === 0 && block.tagName === "p" ? prose.lead : undefined,
      );
    }
    useProcessedImages(block, source);
  }
  return toHtml({ type: "root", children: blocks.map(({ block }) => block) });
}

const toBlocks = (tokens: Token[], options: Options) =>
  Effect.gen(function* () {
    const blocks: Block[] = [];
    let pending: Token[] = [];
    const flush = () => {
      if (pending.some((token) => token.type !== "space"))
        blocks.push({ kind: "html", html: renderHtml(pending, blocks.length === 0, options) });
      pending = [];
    };
    for (const token of tokens) {
      if (isEmbed(token)) {
        flush();
        blocks.push(yield* embedBlock(token.lang, token.text, options.source));
      } else if (token.type === "code") {
        flush();
        blocks.push(yield* codeBlock(token as Tokens.Code, options.source));
      } else {
        pending.push(token);
      }
    }
    flush();
    return blocks;
  });

const flatText = (tokens: Token[]): string =>
  tokens
    .map((token) =>
      "tokens" in token && token.tokens
        ? flatText(token.tokens)
        : token.type === "br"
          ? " "
          : token.type !== "html" && "text" in token && typeof token.text === "string"
            ? token.text
            : "",
    )
    .join("");

export const inlineText = (tokens: Token[]) => flatText(tokens).replace(/\s+/g, " ").trim();

function plainText(tokens: Token[]) {
  const words: string[] = [];
  void walkTokens(tokens, (token) => {
    const leaf = !("tokens" in token && token.tokens?.length);
    if (leaf && (token.type === "text" || token.type === "codespan" || token.type === "escape"))
      words.push(token.text);
  });
  return words.join(" ").replace(/\s+/g, " ").trim();
}

const WORDS_A_MINUTE = 220;

export const renderMarkdown = (
  tokens: Token[],
  source: string,
  {
    reserved = ["main"],
    figures = "wide",
  }: { reserved?: readonly string[]; figures?: Figures } = {},
) =>
  Effect.gen(function* () {
    const headings = collectHeadings(tokens, reserved);
    const words = plainText(tokens).split(" ").filter(Boolean).length;
    const fail = (detail: string) => new ContentError({ message: `${source}: ${detail}` });

    const footnotes = numberFootnotes(tokens);
    const read = [...footnotes.text, ...footnotes.bodies];
    const steps = stepLinksIn(read);
    const [problem] = [
      ...footnotes.problems,
      ...noteProblems(footnotes.text, footnotes.bodies),
      ...imageProblems(read, source),
      ...steps.problems,
    ];
    if (problem) return yield* fail(problem);

    const blocks = yield* toBlocks(
      footnotes.list ? [...footnotes.text, footnotes.list] : footnotes.text,
      { figures, source },
    );
    const lost = stepLinkProblem(steps.links, blocks);
    if (lost) return yield* fail(lost);
    return {
      blocks,
      headings,
      footnotes: footnotes.list !== undefined,
      minutes: Math.max(1, Math.round(words / WORDS_A_MINUTE)),
    };
  });
