# Build

How the site is built, checked and deployed. For writing content, see [content.md](content.md).

## Build and deploy

`vp build` prerenders every page to `build/` with `adapter-static`, and Cloudflare Pages serves that folder. There is no server at runtime.

- The layout sets `prerender`, but `+server.ts` endpoints (`llms.txt`, `rss.xml`, `sitemap.xml`) don't inherit it, so each exports its own.
- `static/_headers` sets caching on Pages; anything it doesn't match, HTML included, keeps Pages' default `max-age=0, must-revalidate`. Only `/_app/immutable/*` is content-hashed, so only it is cached for a year as `immutable`. Fonts, stickers, licences and the thesis PDF keep their names when replaced, so they get a week plus a month of `stale-while-revalidate`; share images and icons a day. Pages picks `Content-Type` from the extension, so `_headers` also serves the Atom feed as `application/atom+xml`.
- `src/routes/404` is prerendered to `build/404.html`. Pages serves it, with status 404, for any path that doesn't exist. Without it, Pages answers every missing path with the homepage.
- Paths are absolute (`paths.relative: false`). `404.html` is served at whatever URL was missing, so relative asset paths would break there. The site lives at the domain root.
- A route that isn't prerendered fails the build, except `/writing/[slug]`: the garden may be empty, and then it has nothing to prerender.
- `enhancedImages()` resizes and converts images (AVIF, WebP) at build. It must come before `sveltekit()` in `plugins`.
- Article images, covers and compare images are made 1920, 1600, 1440, 1280, 1120, 750 and 640 pixels wide, so each common screen gets the first width at or above what it shows: 750 for a 2x phone, 1120 for a 3x phone, 1600 for a 2x tablet, 1440 for a cover and 1120 for an article image on a 1x laptop, and 1920 for 2x laptops. Imagetools never enlarges, so a smaller source gets fewer. Cards are made 1920, 1280, 960, 800 and 640 wide: a card fills half the page, so a 2x phone and a 1x laptop get 800, and a 1x desktop 960.
- `sizes` (`imageSizes` in `markdown/figures.ts`) follows the layout: an image spans the page less its margins (`--page-margin`, `clamp(1rem, 2.8vw, 2.5rem)`), so `calc(100vw - 2rem)` on a phone and `94.4vw` up to where it reaches its cap (`widths.article` for article images, 64rem; 85rem for the cover). `sizes` can't read custom properties, so a change to the margin or the widths needs these numbers changed too. Images in a gallery row use `widths.galleryItem`.
- A smaller width has its height rounded, so its aspect ratio is a hair off the source's, and `height: auto` would follow whichever file the browser picked. The cover, article images and the compare's before image set `aspect-ratio` to their width and height (`ratio` in `case-study.styles.ts`, `Gallery.styles.ts` and `Compare.styles.ts`), so the layout is the same whichever file loads.
- Video posters are one AVIF at the poster's own size (`poster` takes a single URL), and every browser in `baseline 2025` reads AVIF.
- `kit.version.name` is the commit (`CF_PAGES_COMMIT_SHA` on Cloudflare Pages), so a build of the same commit gives the same output. Without it, SvelteKit's default (the build time) stays.

### Only what ships is built

`tools/content-media.ts` is a Vite plugin behind `virtual:content-media`, which `src/lib/server/assets.ts` reads.

- In `vp build` it reads the Markdown of every published piece and project (no `draft: true`, no `stage: seed`, no `TEMPLATE.md`) and imports only the `./` files they link: images and compare images through the image pipeline, `poster:` images as one AVIF, SVGs and MP4s as plain files, and each project's `card.jpg`. Drafts, seeds and files nothing links are never encoded or copied. A published piece linking a file that isn't there still fails the build: the lookup comes back empty, as before.
- In `vp dev` it globs every image, SVG and MP4 under `src/content/` as before, so drafts and seeds show with their media.
- `.svelte` files beside an unpublished piece or project are replaced in a build by a module that throws if loaded, so a draft's own embeds (and their styles) stay out of the bundle and the CSS. A published piece that uses one fails the prerender, naming the file.
- The build renders only published content, so tweets in seeds aren't fetched and drafts' bodies aren't checked by `vp build`; `vp dev` and the content mapper still check them, and frontmatter is checked for every file.

Vite only reads `import.meta.glob` queries written as literals, which is why the plugin writes the imports itself instead of `assets.ts` filtering a glob.

### Fonts

`static/fonts/geist-mono-variable.woff2` has no Cyrillic: the site doesn't write in it. Every other glyph and OpenType feature is kept. Geist is under the OFL with no Reserved Font Name, so a subset can keep the name. To subset a new release the same way, with fontTools: `pyftsubset <font> --unicodes=<every code point in the font but U+0400–052F, 1C80–1C8F, 2DE0–2DFF, A640–A69F> --layout-features='*' --layout-scripts='*' --name-IDs='*' --name-legacy --name-languages='*' --notdef-outline --glyph-names --legacy-kern --passthrough-tables --no-prune-unicode-ranges --flavor=woff2`.

- StyleX adds its CSS after Vite has minified the stylesheet, so it minifies its own rules with Lightning CSS. Its browser targets come from `browserslist` in `package.json`.
- The StyleX plugin hard-codes `enforce: "pre"` and has no option for it, so it would run its Babel step on raw `.svelte` files and fail to parse them. `vite.config.ts` clears `enforce` so it runs on Svelte's compiled JavaScript instead.

## Content checks at build

The build reads Markdown in `src/lib/server/` and fails on any content mistake. Each kind of input has an Effect Schema, and the same schemas back the editor checks below:

- Frontmatter: `src/lib/writing/frontmatter.ts` and `src/lib/projects/frontmatter.ts`.
- Embeds and their props: `src/lib/embeds/props.ts`.
- Everything else beyond plain Markdown (note kinds, code languages and meta, footnotes, step links): `src/lib/writing/syntax.ts`, checked by the modules in `src/lib/server/markdown/`.

The server code is Effect services, built once per build by `Content.layer` (`src/lib/server/content.ts`): `Content` holds the pieces and projects and needs `Highlighter` (Shiki, `markdown/code.ts`) and `Tweets` (`tweets.ts`). Routes import the plain values `content.ts` exports.

Some checks only run here, not in the editor: real dates, `created` on every piece that isn't a seed, and `updated` not before `created`. A link to a piece that doesn't exist isn't checked here: the prerender gets a 404 for it and fails the build (`prerender.handleHttpError`'s default), so it shows in the editor and in `vp build`, not in `vp dev`.

Tweets are fetched once per build, cached by id. SvelteKit loads the content twice in a build (route analysis, then prerender, in worker threads of one process), so `tweets.ts` also writes each result to `<tmpdir>/knerrich-tweets-<pid>/`, and the second load reads it from there. A fetch that fails or takes over 5 seconds doesn't fail the build: the tweet embed becomes a plain link.

### Modules shared with plain `node`

`writing/syntax.ts` and `embeds/props.ts` also run outside Vite: the content mapper imports them in plain `node`. Keep them free of relative and SvelteKit imports.

## The content mapper

`tools/markdown-content-mapper/mapper.ts` makes TypeScript check the Markdown in `src/content/`, so mistakes show in the `.md` file while editing and in `vp run lint`. It's a TypeScript 7.1 content mapper, registered under `contentMappers` in `tsconfig.json`. TypeScript (tsrs) starts it with `node` and asks it, over JSON-RPC on stdio, to turn each `.md` file into a small virtual TypeScript module. The protocol is only described in [typescript-go#4712](https://github.com/microsoft/typescript-go/pull/4712).

- Every emitted value is mapped back to its span in the `.md` file, so an error points at the wrong YAML value, key or link. A mapping is `[virtualStart, virtualLength, originalStart, originalLength, kind]`, where kind `1` (Atom) means the two texts differ.
- Frontmatter is emitted as `{ … } satisfies $FrontmatterInput`. TypeScript reports "does not satisfy" on the type, so the type is mapped to the opening `---`.
- Code languages and note kinds are emitted as `"foo" satisfies $CodeLang`. For a literal, TypeScript reports "does not satisfy" on the `satisfies` keyword, so the keyword is mapped to the language or the kind.
- An embed missing a required prop can't be placed inside the Markdown by TypeScript, so the mapper reports it itself, on the block's name.
- Plain `node` strips types, so the mapper imports `embeds/props.ts` and reads embed names and required props from the schemas themselves. They always match what the build decodes.
- `ts` code blocks: their imports are lifted to the top of the module, and each body gets its own `{ }` scope. The mapper's own top-level names start with `$` so a block can import any name. `WritingSlug` keeps its plain name because it shows in error messages; a block can only shadow it.

## Lint and type checks

- `vp run lint` runs `tsrs --noEmit` first (`@effect/tsgo`'s build of tsrs, the Rust port of TypeScript 7, with Effect's diagnostics). It type-checks the whole program, Markdown included, which Oxlint's `typeCheck` would skip. `--runExternalCode` lets it start the content mapper. Then Oxlint runs the type-aware rules on tsrs.
- `vp run check` type-checks `.svelte` files (svelte-check). Lint doesn't.
- Lint also runs the StyleX rules (`tools/oxlint-styles.ts`) and `comments/no-comments` (`tools/oxlint-comments.ts`), which reports every comment that isn't a tool directive (`oxlint-`, `eslint-`, `@ts-`). Decisions go in `docs/`.

## Pre-commit

`.vite-hooks/pre-commit` runs `vp staged`: it formats the staged files and re-stages them, then lints the whole project once, since a change can break types in files that aren't staged. oxfmt doesn't format `.svelte` files yet. The hook doesn't touch frontmatter: authors set `created` and `updated` by hand, and the build checks them.
