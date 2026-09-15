import { marked, type Tokens } from "marked";

const files = import.meta.glob<string>("/src/content/projects/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
});

// Only repository-authored Markdown is rendered. The heading and opening
// paragraph supply page metadata; an optional list after the title supplies tags.
export const projects = Object.entries(files).map(([path, markdown]) => {
  const tokens = marked.lexer(markdown).filter((token) => token.type !== "space");
  const heading = tokens[0];
  const tagList = tokens.find(
    (token, index): token is Tokens.List => index === 1 && token.type === "list",
  );
  const introduction = tokens.find(
    (token): token is Tokens.Paragraph => token.type === "paragraph",
  );

  if (heading?.type !== "heading" || heading.depth !== 1 || !introduction) {
    throw new Error(`${path} needs a title and an opening paragraph`);
  }

  // The first standalone Markdown image becomes the page's lead image.
  const heroParagraph = tokens.find(
    (token): token is Tokens.Paragraph =>
      token.type === "paragraph" && token.tokens?.length === 1 && token.tokens[0].type === "image",
  );
  const hero = heroParagraph?.tokens?.find(
    (token): token is Tokens.Image => token.type === "image",
  );

  return {
    slug: path.slice("/src/content/projects/".length, -".md".length),
    title: heading.text,
    description: introduction.text,
    tags: tagList?.items.map((item) => item.text) ?? [],
    hero: hero ? { src: hero.href, alt: hero.text } : undefined,
    html: marked.parser(tokens.slice(1).filter((token) => token !== tagList && token !== heroParagraph)),
  };
});
