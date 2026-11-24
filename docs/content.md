# Content

Projects and writing are Markdown in `src/content/`; the name is the URL. A project is a folder, `src/content/projects/<slug>/index.md`, with its images beside it. A piece of writing is a file, `src/content/writing/<slug>.md`, or a folder like a project's, with its images beside it. Each starts with a `#` title, an optional bullet list of tags, and an opening paragraph that doubles as the page description (writing can set `description` in its frontmatter instead; it's what lists and the feed show). The title is plain text. To start one, copy `TEMPLATE.md` in the same folder to `<slug>/index.md` (for writing, `<slug>.md` works too); the templates themselves are never published.

**Projects** start with frontmatter: `year` (2025, or a span like 2023–2025), `industry`, `color` (the client's brand color as `#rrggbb`, which tints the case study: its glow and the lit bars of its charts) and an optional `website`, linked from the case study. `draft: true` keeps the case study to `vp dev` and previews; in production its card links to the website instead, so a draft needs one. After the title comes a list of the services (the work done), the description, then the cover: `./cover.jpg`, 1920×1200, made on the "Case Studys" page of the Web file in Figma. It's the card's image, the image over the case study's title, and the preview image. The paragraphs right after the cover sit next to the services; the rest is the write-up. Projects are listed most recent first.

**Images** beside a piece are linked by their path from it, `![Alt](./photo.jpg)`, and the build serves small, modern versions of them. Other files, like a PDF, go in `static/` and are linked from `/`.

**Embeds** let a piece show a live component instead of a picture: a code block named after the component, with its props as YAML (see `src/lib/embeds/`).

````md
```compare
before: ./before.jpg
after: ./after.jpg
alt: What the two images show
```
````

**TypeScript code blocks** (` ```ts `) are type-checked like the site's code, with errors shown in the Markdown. Each block has its own scope and can import from the project (`#lib/…`) or its packages. Mark a block ` ```ts nocheck ` for a fragment or pseudo-code.

**In the text:**

- Notes: `> [!NOTE] Optional title` as a quote's first line (also `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`); the rest of the quote is the note.
- Code: ` ```ts title="review.ts" `, highlighted at build, with line numbers and a copy button. `title` is the only option; languages are `CODE_LANGS` in `src/lib/writing/syntax.ts`, and anything else fails the build.
- Keys: `<kbd>⌘</kbd> <kbd>K</kbd>`.
- Footnotes: `[^id]` in the text, `[^id]: The note.` anywhere below.
- External links open in a new tab.
- Blocks: `compare` (before/after images), `tweet` (`id: "…"`, fetched at build), `stats` (up to four headline numbers), `chart` (bars for one or two series, with a table of the numbers; the last series is what the chart is about, in the page's brand color, and the one before it is context, in grey; a value can be a range `[low, high]`), and the visualizations below. Their props are in `src/lib/embeds/props.ts`.

Mistakes in any of these fail the build, and show in the editor while writing. `src/content/writing/components/` (a seed) uses them all.

### Visualizations

`sync-steps` draws the local-first sync in steps and takes an `id`; link to a step with `[step 2](step:<id>/2)`, and `autoplay: true` steps through on its own (not with reduced motion). `sync-live` is the same drawing, playing on its own; `loop: false` plays it once and leaves everything lit. They belong to the thesis case study and live beside it, in `src/content/projects/local-first-api-sync/`, but any piece can use them.

A new one is a Svelte component built from the shells: `Stepper` (`src/lib/Stepper.svelte`) draws a step from its index, and `Playback` (`src/lib/Playback.svelte`) plays, pauses and restarts whatever it animates with `element.animate()`. Draw with the palette, `viz` in `src/lib/styles/stepper.ts`, and keep a step's whole state in one row of a table, as `steps` in `sync-drawing.ts` does, so the drawing only shows a state. Give it a block: its props in `src/lib/embeds/props.ts`, its component in `src/lib/embeds/index.ts`, and, if step links can point at it, its name in `VISUALIZATIONS` and its step count in `STEP_COUNTS` (`src/lib/server/markdown/embeds.ts`), so the build rejects a link past the last step.

**Writing is a digital garden**: pieces are published early and grow. The frontmatter says how far along a piece is (`stage`: seed, seedling, budding, evergreen; `seedling` if unset) and when it was first published and last reworked (`created`, `updated`). Type `created` once, when the piece is first published; every piece but a seed needs it. Bump `updated` by hand only for real changes, not typos, so "last tended" means something to readers; without it, it's `created`, and it can't be before `created`. A `seed` is an idea, not published yet: it only shows in `vp dev` and on preview deployments (branches other than `main`).

The feed, `/rss.xml`, is Atom rather than RSS 2.0 because Atom gives each entry both a published and an updated date: `created` and `updated`, so feed readers show reworked pieces as updated. The feed's own date is its latest entry's `updated`, and a seed without dates stays out of it. Entries carry the description and link to the piece on the site.

**Preview images** (what a link shows when shared) are made at build: the title on graph paper for writing, the lead image with the Knerrich sticker for projects. To use your own instead, put it at `src/content/og/<page>.jpg` or `.png`, where `<page>` is the URL path, e.g. `src/content/og/writing/my-piece.jpg`, or as `og.jpg` in a piece's or project's folder (1200×630; it's cropped to fit).

### Rendering

`src/lib/server/markdown/` renders Markdown into blocks for `<Prose>`, one module per kind of block (footnotes, notes, figures, embeds, code, headings, and keys and links in `inline.ts`), joined in `index.ts`. `<Prose>` shows them with `{@html}`. That's only safe because the HTML comes from this repository's Markdown: never pass it visitor input. StyleX can't style the children of `{@html}` by selector, so the renderer puts the classes on each element itself: by tag and `data-role` from `src/lib/styles/prose.ts`, and per code line from `src/lib/styles/code.ts` (`src/lib/server/markdown/code.ts`). Restyle prose there.
