import { entries } from "#lib/server/content.ts";
import { SITE } from "#lib/site.ts";

export const prerender = true;

const FEED = `${SITE}/rss.xml`;
const AUTHOR = "Max Knerrich";
const FIRST_PIECE = "2026-11-21";

const escape = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char] ?? char,
  );
const time = (date: string) => `${date}T00:00:00Z`;

export const GET = () => {
  const dated = entries.flatMap(({ created, updated, ...entry }) =>
    created && updated ? [{ ...entry, created, updated }] : [],
  );
  const latest = dated[0]?.updated ?? FIRST_PIECE;
  const items = dated.map(({ slug, title, description, created, updated }) => {
    const url = `${SITE}/writing/${slug}`;
    return `  <entry>
    <title>${escape(title)}</title>
    <link href="${url}"/>
    <id>${url}</id>
    <published>${time(created)}</published>
    <updated>${time(updated)}</updated>
    <summary>${escape(description)}</summary>
  </entry>`;
  });
  return new Response(
    `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Writing · ${AUTHOR}</title>
  <subtitle>A garden of things I keep rewriting.</subtitle>
  <link href="${SITE}/writing"/>
  <link rel="self" href="${FEED}"/>
  <id>${FEED}</id>
  <updated>${time(latest)}</updated>
  <author><name>${AUTHOR}</name><uri>${SITE}</uri></author>
${items.join("\n")}
</feed>
`,
    { headers: { "content-type": "application/atom+xml; charset=utf-8" } },
  );
};
