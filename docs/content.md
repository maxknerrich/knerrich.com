# Content

Projects and writing are Markdown files in `src/content/`; the filename is the URL. Each starts with a `#` title, an optional bullet list of tags, and an opening paragraph that doubles as the page description (writing can set `description` in its frontmatter instead). To start one, copy `TEMPLATE.md` in the same folder and rename it; the templates themselves are never published.

**Images** go in `src/lib/assets/projects/<slug>/` and are linked as `/projects/<slug>/image.jpg`, so the build can serve small, modern versions of them.

**Embeds** let a piece show a live component instead of a picture: a code block named after the component, with its props as YAML (see `src/lib/embeds/`).

````md
```iframe
src: https://example.com/demo
title: What the frame shows
```
````

**TypeScript code blocks** (` ```ts `) are type-checked like the site's code, with errors shown in the Markdown. Each block has its own scope and can import from the project (`#lib/…`) or its packages. Mark a block ` ```ts nocheck ` for a fragment or pseudo-code.

**Writing is a digital garden**: pieces are published early and grow. The optional frontmatter says how far along a piece is (`stage`: seed, seedling, budding, evergreen) and when it was first published and last reworked (`planted`, `tended`). Bump `tended` by hand only for real changes, not typos, so "last tended" means something to readers. Committing a new `tended` saves the old version in `.versions/`, for a future version history. A `seed` is an idea, not published yet: it only shows in `vp dev`, and gets its dates on the commit that moves it to `seedling`.

**A new project** also needs its card in `src/lib/Portfolio.svelte` and its URL in `static/sitemap.xml` (new pieces need the sitemap too).
