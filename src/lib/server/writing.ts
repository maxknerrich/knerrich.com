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

const readPiece = (path: string, markdown: string, showUnpublished: boolean) =>
  Effect.gen(function* () {
    const { meta, body } = yield* splitFrontmatter(markdown, path);
    if (meta.stage === "seed" && !showUnpublished) return undefined;
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
    };
  });

export const readPieces = Effect.fnUntraced(function* (showUnpublished: boolean) {
  const paths = Object.keys(files);
  const twice = paths.find((path) =>
    paths.some((other) => other !== path && slugOf(other) === slugOf(path)),
  );
  if (twice) {
    return yield* new ContentError({
      message: `${twice}: another piece has the slug "${slugOf(twice)}" (<slug>.md and <slug>/index.md)`,
    });
  }
  const read = yield* Effect.forEach(Object.entries(files), ([path, markdown]) =>
    readPiece(path, markdown, showUnpublished),
  );
  return read
    .filter((piece) => piece !== undefined)
    .toSorted((a, b) => (b.updated ?? "").localeCompare(a.updated ?? ""));
});
