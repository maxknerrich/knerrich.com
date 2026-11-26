import { Effect } from "effect";
import type { Token, Tokens } from "marked";
import { ProjectFrontmatter } from "#lib/projects/frontmatter.ts";
import { ContentError, readFrontmatter } from "#lib/writing/frontmatter.ts";
import { cardFor, pictureFor } from "./assets.ts";
import { imageSizes } from "./markdown/figures.ts";
import { inlineText, markdown as marked, renderMarkdown } from "./markdown/index.ts";

const files = import.meta.glob<string>("/src/content/projects/*/index.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

const PAGE_IDS = ["main", "project-title", "about"];
const HERO_SIZES = imageSizes("85rem", "90rem");

const isImageParagraph = (token: Token): token is Tokens.Paragraph =>
  token.type === "paragraph" && token.tokens?.length === 1 && token.tokens[0]?.type === "image";

const readProject = (path: string, markdown: string, showUnpublished: boolean) =>
  Effect.gen(function* () {
    const fail = (message: string) => new ContentError({ message: `${path}: ${message}` });
    const { data, body } = yield* readFrontmatter(ProjectFrontmatter, markdown, path);
    if (data.draft && !showUnpublished) return undefined;
    const tokens = marked.lexer(body).filter((token) => token.type !== "space");
    const [heading, second] = tokens;
    const services = second?.type === "list" ? (second as Tokens.List) : undefined;
    const description = tokens.find(
      (token): token is Tokens.Paragraph => token.type === "paragraph" && !isImageParagraph(token),
    );
    if (heading?.type !== "heading" || heading.depth !== 1 || !description) {
      return yield* fail("needs a # title and an opening paragraph");
    }

    const coverParagraph = tokens.find(isImageParagraph);
    const cover = coverParagraph?.tokens?.[0] as Tokens.Image | undefined;
    if (!cover) return yield* fail("needs a cover image after the opening paragraph");
    const picture = pictureFor(cover.href, path);
    if (!picture) return yield* fail(`cover ${cover.href} isn't beside the piece`);

    const rest = tokens.filter(
      (token) => ![heading, services, description, coverParagraph].includes(token),
    );
    const aboutEnd = rest.findIndex(
      (token) => token.type !== "paragraph" || isImageParagraph(token),
    );
    const split = aboutEnd === -1 ? rest.length : aboutEnd;
    const about = yield* renderMarkdown(rest.slice(0, split), path, { reserved: PAGE_IDS });
    const story = yield* renderMarkdown(rest.slice(split), path, { reserved: PAGE_IDS });

    return {
      slug: path.slice("/src/content/projects/".length, -"/index.md".length),
      title: inlineText(heading.tokens ?? []),
      description: inlineText(description.tokens),
      services: services?.items.map((item) => item.text) ?? [],
      year: String(data.year),
      industry: data.industry,
      color: data.color,
      website: data.website,
      draft: data.draft,
      hero: { src: cover.href, picture, alt: cover.text, sizes: HERO_SIZES },
      card: cardFor("./card.jpg", path) ?? picture,
      about: about.blocks,
      blocks: story.blocks,
      footnotes: story.footnotes,
    };
  });

const years = (year: string) => [Number(year.slice(-4)), Number(year.slice(0, 4))] as const;

export const readProjects = (showUnpublished: boolean) =>
  Effect.forEach(Object.entries(files), ([path, markdown]) =>
    readProject(path, markdown, showUnpublished),
  ).pipe(
    Effect.map((projects) =>
      projects
        .filter((project) => project !== undefined)
        .toSorted((a, b) => {
          const [aLast, aFirst] = years(a.year);
          const [bLast, bFirst] = years(b.year);
          return bLast - aLast || bFirst - aFirst;
        }),
    ),
  );
