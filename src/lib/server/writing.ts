import { Effect } from "effect";
import { marked, type Token, type Tokens } from "marked";
import { ContentError, splitFrontmatter } from "#lib/writing/frontmatter.ts";
import { renderMarkdown } from "./markdown";

// Loads every piece in src/content/writing/ at build time. Frontmatter, embed props
// and links to other pieces are validated here (Effect Schema), so bad content
// fails the build with the file and field at fault.
// Earlier versions are saved to .versions/ by the pre-commit hook (scripts/tend-writing.ts)
// but aren't shown yet.

const ROOT = "/src/content/writing/";
// TEMPLATE.md is the starting point for new pieces, not a piece.
const files = import.meta.glob<string>(["/src/content/writing/*.md", "!**/TEMPLATE.md"], {
  query: "?raw",
  import: "default",
  eager: true,
});

// Ids the piece page uses itself, so headings never take them.
const PAGE_IDS = ["main", "piece-title"];
const slugOf = (path: string) => path.slice(ROOT.length, -".md".length);

/** Slugs this piece links to as /writing/<slug>. */
function writingLinks(tokens: Token[]) {
  const slugs = new Set<string>();
  // walkTokens returns the callback's results; this callback only collects.
  void marked.walkTokens(tokens, (token) => {
    const slug =
      token.type === "link" && /^\/writing\/([^/#?]+)\/?(?:[#?].*)?$/.exec(token.href)?.[1];
    if (slug) slugs.add(slug);
  });
  return slugs;
}

// Like projects, the first heading is the title, an optional list right after it
// supplies tags, and the first paragraph doubles as the description unless the
// frontmatter sets one.
const readPiece = (path: string, markdown: string) =>
  Effect.gen(function* () {
    const { meta, body } = yield* splitFrontmatter(markdown, path);
    const tokens = marked.lexer(body).filter((token) => token.type !== "space");
    const [heading] = tokens;
    const tagList = tokens.find(
      (token, index): token is Tokens.List => index === 1 && token.type === "list",
    );
    const intro = tokens.find((token): token is Tokens.Paragraph => token.type === "paragraph");
    if (heading?.type !== "heading" || heading.depth !== 1 || !intro) {
      return yield* new ContentError({
        message: `${path}: needs a # title and an opening paragraph`,
      });
    }
    const content = tokens.slice(tagList ? 2 : 1);
    const { blocks, headings } = yield* renderMarkdown(content, path, PAGE_IDS);
    return {
      slug: slugOf(path),
      title: heading.text,
      description: meta.description ?? intro.text,
      tags: tagList?.items.map((item) => item.text) ?? [],
      stage: meta.stage,
      planted: meta.planted,
      tended: meta.tended,
      blocks,
      headings,
      links: writingLinks(content),
      path,
    };
  });

const load = Effect.gen(function* () {
  const read = yield* Effect.forEach(Object.entries(files), ([path, markdown]) =>
    readPiece(path, markdown),
  );
  // Seeds are still validated, but only `vp dev` shows them. A published piece linking
  // to a seed fails the build below.
  const all = import.meta.env.DEV ? read : read.filter(({ stage }) => stage !== "seed");
  const slugs = new Set(all.map(({ slug }) => slug));
  for (const { path, links } of all) {
    const missing = [...links].filter((slug) => !slugs.has(slug));
    if (missing.length) {
      return yield* new ContentError({
        message: `${path}: links to missing writing: ${missing.join(", ")}`,
      });
    }
  }
  return all
    .map(({ links: _links, path: _path, ...piece }) => piece)
    .toSorted((a, b) => b.tended.localeCompare(a.tended));
});

/** All pieces, most recently tended first. */
export const pieces = Effect.runSync(load);

export type Piece = (typeof pieces)[number];

/** What lists need: no rendered HTML. */
export const entries = pieces.map(({ slug, title, description, stage, planted, tended }) => ({
  slug,
  title,
  description,
  stage,
  planted,
  tended,
}));

export type WritingEntry = (typeof entries)[number];
