import { entries } from "#lib/server/writing.ts";
import { today } from "#lib/writing/frontmatter.ts";

// The writing as an Atom feed. Atom (rather than RSS 2.0) gives each entry both a
// published and an updated date, which fits a garden: `planted` is when a piece was
// published, `tended` when it last grew, so feed readers can show reworked pieces as
// updated. Entries carry the summary and link to the site, the piece's canonical home.

// Endpoints don't inherit the layout's `prerender`.
export const prerender = true;

const SITE = "https://knerrich.com";
const FEED = `${SITE}/rss.xml`;
const AUTHOR = "Max Knerrich";

const escape = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char] ?? char,
  );
const time = (date: string) => `${date}T00:00:00Z`;

export const GET = () => {
  // Entries are sorted by `tended`, newest first; an empty garden is "updated" today.
  const updated = entries[0]?.tended ?? today();
  const items = entries.map(({ slug, title, description, planted, tended }) => {
    const url = `${SITE}/writing/${slug}`;
    return `  <entry>
    <title>${escape(title)}</title>
    <link href="${url}"/>
    <id>${url}</id>
    <published>${time(planted)}</published>
    <updated>${time(tended)}</updated>
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
  <updated>${time(updated)}</updated>
  <author><name>${AUTHOR}</name><uri>${SITE}</uri></author>
${items.join("\n")}
</feed>
`,
    { headers: { "content-type": "application/atom+xml; charset=utf-8" } },
  );
};
