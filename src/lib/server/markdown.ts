import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { Element, ElementContent, Root, RootContent } from "hast";
import { fromHtml } from "hast-util-from-html";
import { toHtml } from "hast-util-to-html";
import { Effect, Schema } from "effect";
import { Marked, type Token, type Tokens } from "marked";
import { parse } from "yaml";
import { embedProps, isEmbedName, type EmbedName, type EmbedProps } from "#lib/embeds/props.ts";
import { prose, tagStyles } from "#lib/styles/prose.ts";
import { ContentError } from "#lib/writing/frontmatter.ts";
import { pictureFor } from "./images.ts";

// Renders repository Markdown into blocks for <Prose>: plain HTML, and Svelte
// embeds written as fenced code blocks named after a component (see #lib/embeds).
// Embed props are decoded with their schemas, so bad props fail the build.
// Headings get ids so pages can link to them and build a table of contents.
// Every element gets the StyleX classes for its tag (#lib/styles/prose), since
// StyleX can't style the children of {@html} by selector.

type EmbedBlock<N extends EmbedName> = {
  kind: "embed";
  name: N;
  props: EmbedProps<N>;
  wide: boolean;
};
export type Block = { kind: "html"; html: string } | { [N in EmbedName]: EmbedBlock<N> }[EmbedName];

export type Heading = { id: string; text: string; depth: number };

// Marked's own output, plus heading ids.
const headingIds = new WeakMap<Tokens.Heading, string>();
const marked = new Marked({
  renderer: {
    heading(token) {
      const id = headingIds.get(token) ?? slug(token.text);
      return `<h${token.depth} id="${id}">${this.parser.parseInline(token.tokens)}</h${token.depth}>\n`;
    },
  },
});

const isElement = (node: RootContent | ElementContent | undefined): node is Element =>
  node?.type === "element";

/** The only element in a paragraph, if it is a `tagName` and there is no text around it. */
function alone(node: Element, tagName: string) {
  if (node.tagName !== "p") return undefined;
  const [child, ...rest] = node.children.filter(
    (content) => !(content.type === "text" && !content.value.trim()),
  );
  return rest.length === 0 && isElement(child) && child.tagName === tagName ? child : undefined;
}

/** Top-level elements, with an image alone in a paragraph (and an italic line right after it) made into a figure. */
function topLevel(root: Root) {
  const blocks: Element[] = [];
  for (const node of root.children.filter(isElement)) {
    const image = alone(node, "img");
    const caption = alone(node, "em");
    const previous = blocks.at(-1);
    if (image) {
      blocks.push({ type: "element", tagName: "figure", properties: {}, children: [image] });
    } else if (caption && previous?.tagName === "figure" && previous.children.length === 1) {
      previous.children.push({
        type: "element",
        tagName: "figcaption",
        properties: {},
        children: [caption],
      });
    } else {
      blocks.push(node);
    }
  }
  return blocks;
}

/**
 * Gives an element and everything in it the classes for their tags, in one
 * `stylex.props` call per element so later styles win: where the block sits,
 * then its tag's style, then its role in the text.
 */
function style(node: Element, place?: StyleXStyles, role?: StyleXStyles) {
  const { className } = stylex.props(place, tagStyles[node.tagName], role);
  if (className) node.properties.className = className.split(" ");
  for (const child of node.children) if (isElement(child)) style(child);
}

/** How wide article images show: across the article (60rem), or the screen on smaller ones. */
const IMAGE_SIZES = "(max-width: 64rem) 100vw, 60rem";

/**
 * Swaps each project image for a <picture> of its processed versions (see ./images.ts),
 * keeping the <img> (with its classes and alt) as the fallback. Other images stay as they are.
 */
function useProcessedImages(node: Element) {
  node.children = node.children.map((child) => {
    if (!isElement(child)) return child;
    const src = child.properties.src;
    const picture =
      child.tagName === "img" && typeof src === "string" ? pictureFor(src) : undefined;
    if (!picture) {
      useProcessedImages(child);
      return child;
    }
    const sources: Element[] = Object.entries(picture.sources).map(([format, srcSet]) => ({
      type: "element",
      tagName: "source",
      properties: { srcSet, sizes: IMAGE_SIZES, type: `image/${format}` },
      children: [],
    }));
    const img: Element = {
      ...child,
      properties: {
        ...child.properties,
        src: picture.img.src,
        width: picture.img.w,
        height: picture.img.h,
        loading: "lazy",
        decoding: "async",
      },
    };
    return { type: "element", tagName: "picture", properties: {}, children: [...sources, img] };
  });
}

/**
 * Renders a run of tokens to styled HTML. Top-level blocks go in the reading
 * column (figures across the page); `opening` marks the start of the document,
 * whose first paragraph is the lead.
 */
function renderHtml(tokens: Token[], opening: boolean) {
  const blocks = topLevel(fromHtml(marked.parser(tokens), { fragment: true }));
  for (const [index, block] of blocks.entries()) {
    const lead = opening && index === 0 && block.tagName === "p";
    style(
      block,
      block.tagName === "figure" ? prose.wide : prose.column,
      lead ? prose.lead : undefined,
    );
  }
  // Images always sit inside a block (a figure or paragraph), never at the top level.
  for (const block of blocks) useProcessedImages(block);
  return toHtml({ type: "root", children: blocks });
}

/** Heading text without inline Markdown, for ids and tables of contents. */
const plain = (text: string) => text.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_`~]/g, "");
const slug = (text: string) =>
  plain(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "section";

const isHeading = (token: Token): token is Tokens.Heading => token.type === "heading";
const isEmbed = (token: Token): token is Tokens.Code & { lang: EmbedName } =>
  token.type === "code" && typeof token.lang === "string" && isEmbedName(token.lang);

/** Gives every top-level heading a unique id, in document order, skipping ids the page already uses. */
function collectHeadings(tokens: Token[], reserved: readonly string[]): Heading[] {
  const used = new Set(reserved);
  return tokens.filter(isHeading).map((heading) => {
    const base = slug(heading.text);
    let id = base;
    for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
    used.add(id);
    headingIds.set(heading, id);
    return { id, text: plain(heading.text), depth: heading.depth };
  });
}

/** Decodes an embed's YAML props with its schema. `wide` is for the page: the embed spans the full article width. */
const embedBlock = (token: Tokens.Code & { lang: EmbedName }, source: string) =>
  Effect.gen(function* () {
    const fail = (detail: string) =>
      new ContentError({ message: `${source}: \`${token.lang}\` block ${detail}` });
    const data = yield* Effect.try({
      try: (): unknown => (token.text.trim() ? parse(token.text) : {}),
      catch: (error) => fail(`has invalid YAML (${String(error)})`),
    });
    const { wide, ...rest } =
      typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {};
    // Still the file's YAML; the embed's schema decides what it is.
    const input: unknown = rest;
    const props = yield* Schema.decodeUnknownEffect(embedProps[token.lang])(input, {
      onExcessProperty: "error",
    }).pipe(Effect.mapError((error) => fail(error.message)));
    // Each name is paired with its own schema's output above; TypeScript can't follow that across the union.
    return { kind: "embed", name: token.lang, props, wide: wide === true } as Block;
  });

/** Turns tokens into blocks, merging neighbouring HTML. */
const toBlocks = (tokens: Token[], source: string) =>
  Effect.gen(function* () {
    const blocks: Block[] = [];
    let pending: Token[] = [];
    const flush = () => {
      if (pending.length)
        blocks.push({ kind: "html", html: renderHtml(pending, blocks.length === 0) });
      pending = [];
    };
    for (const token of tokens) {
      if (!isEmbed(token)) {
        pending.push(token);
        continue;
      }
      flush();
      blocks.push(yield* embedBlock(token, source));
    }
    flush();
    return blocks;
  });

/** Renders a document. `reserved` lists ids the page already uses, so headings never clash with them. */
export const renderMarkdown = (
  tokens: Token[],
  source: string,
  reserved: readonly string[] = ["main"],
) =>
  Effect.gen(function* () {
    const headings = collectHeadings(tokens, reserved);
    return { blocks: yield* toBlocks(tokens, source), headings };
  });
