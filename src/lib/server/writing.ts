import { Effect } from "effect";
import type { Tokens } from "marked";
import { ContentError, splitFrontmatter } from "#lib/writing/frontmatter.ts";
import { PIECE_PATH } from "#lib/writing/syntax.ts";
import { inlineText, markdown as marked, renderMarkdown } from "./markdown/index.ts";

const files = import.meta.glob<string>(
  ["/src/content/writing/*.md", "/src/content/writing/*/index.md", "!**/TEMPLATE.md"],
  {
    query: "?raw",
    import: "default",
    eager: true,
  },
);

const PAGE_IDS = ["main", "piece-title"];
const slugOf = (path: string) => PIECE_PATH.exec(path)?.[1] ?? path;

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
    const { blocks, headings, footnotes, minutes } = yield* renderMarkdown(content, path, {
      reserved: PAGE_IDS,
      figures: "box",
    });
    return {
      slug: slugOf(path),
      title: inlineText(heading.tokens ?? []),
      description: meta.description ?? inlineText(intro.tokens),
      tags: tagList?.items.map((item) => item.text) ?? [],
      stage: meta.stage,
      created: meta.created,
      updated: meta.updated,
      blocks,
      headings,
      footnotes,
      minutes,
      path,
    };
  });

export const readPieces = Effect.fnUntraced(function* (showUnpublished: boolean) {
  const read = yield* Effect.forEach(Object.entries(files), ([path, markdown]) =>
    readPiece(path, markdown),
  );
  const all = showUnpublished ? read : read.filter(({ stage }) => stage !== "seed");
  const twice = read.find(({ slug, path }) =>
    read.some((other) => other.slug === slug && other.path !== path),
  );
  if (twice) {
    return yield* new ContentError({
      message: `${twice.path}: another piece has the slug "${twice.slug}" (<slug>.md and <slug>/index.md)`,
    });
  }
  return all
    .map(({ path: _path, ...piece }) => piece)
    .toSorted((a, b) => (b.updated ?? "").localeCompare(a.updated ?? ""));
});
