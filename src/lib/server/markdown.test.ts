import { Effect } from "effect";
import { marked } from "marked";
import { expect, test } from "vite-plus/test";
import { renderMarkdown } from "./markdown";

const render = (markdown: string) =>
  Effect.runSync(renderMarkdown(marked.lexer(markdown), "test.md"));

test("a code block named after an embed becomes that component, with YAML props", () => {
  const { blocks } = render(
    "Intro\n\n```iframe\nsrc: https://example.com\ntitle: Demo\nwide: true\n```\n\n```js\nlet a\n```\n",
  );
  expect(blocks.map((block) => block.kind)).toEqual(["html", "embed", "html"]);
  expect(blocks[1]).toMatchObject({
    name: "iframe",
    props: { src: "https://example.com", title: "Demo" },
    wide: true,
  });
  expect(blocks[2]).toMatchObject({ html: expect.stringContaining("language-js") });
});

test("headings get unique ids that avoid the page's own", () => {
  const { headings, blocks } = render("## Main\n\n## Same\n\n## Same\n");
  expect(headings.map(({ id }) => id)).toEqual(["main-2", "same", "same-2"]);
  expect(blocks[0]).toMatchObject({
    html: expect.stringMatching(/<h2 id="same-2"[^>]*>Same<\/h2>/),
  });
});

test("an image alone in a paragraph becomes a figure, captioned by an italic line after it", () => {
  const { blocks } = render("![A chart](/chart.png)\n\n*Sales by month.*\n\nText.\n");
  const html = blocks[0]?.kind === "html" ? blocks[0].html : "";
  expect(html).toMatch(
    /^<figure class="[^"]+"><img[^>]* alt="A chart"[^>]*><figcaption class="[^"]+"><em>Sales by month\.<\/em><\/figcaption><\/figure><p class="[^"]+">Text\.<\/p>$/,
  );
});

test("embed props are checked against the embed's schema", () => {
  const failure = Effect.runSync(
    Effect.flip(
      renderMarkdown(marked.lexer("```iframe\nsrc: http://example.com\n```\n"), "test.md"),
    ),
  );
  expect(failure.message).toMatch(/test\.md: `iframe` block .*https:\/\//s);
});
