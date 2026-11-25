# Build

How the site is built, checked and deployed. For writing content, see [content.md](content.md).

## Build and deploy

`vp build` prerenders every page to `build/` with `adapter-static`, and Cloudflare Pages serves that folder. There is no server at runtime.

- The layout sets `prerender`, but `+server.ts` endpoints (`llms.txt`, `rss.xml`, `sitemap.xml`) don't inherit it, so each exports its own.
- `src/routes/404` is prerendered to `build/404.html`. Pages serves it, with status 404, for any path that doesn't exist. Without it, Pages answers every missing path with the homepage.
- Paths are absolute (`paths.relative: false`). `404.html` is served at whatever URL was missing, so relative asset paths would break there. The site lives at the domain root.
- A route that isn't prerendered fails the build, except `/writing/[slug]`: the garden may be empty, and then it has nothing to prerender.
- `enhancedImages()` resizes and converts images (AVIF, WebP) at build. It must come before `sveltekit()` in `plugins`.
- Article images are made 1920, 1280 and 640 pixels wide: close to the article width (`widths.article`, 64rem) at 2x and 1x, and phones. Vite only reads `import.meta.glob` queries written as literals, so `assets.ts` repeats those numbers instead of deriving them. The `sizes` attribute (`markdown/figures.ts`) is derived from `widths.article`, or `widths.galleryItem` for the images in a gallery row.
- StyleX adds its CSS after Vite has minified the stylesheet, so it minifies its own rules with Lightning CSS. Its browser targets come from `browserslist` in `package.json`.
- The StyleX plugin hard-codes `enforce: "pre"` and has no option for it, so it would run its Babel step on raw `.svelte` files and fail to parse them. `vite.config.ts` clears `enforce` so it runs on Svelte's compiled JavaScript instead.

## Content checks at build

The build reads Markdown in `src/lib/server/` and fails on any content mistake. Each kind of input has an Effect Schema, and the same schemas back the editor checks below:

- Frontmatter: `src/lib/writing/frontmatter.ts` and `src/lib/projects/frontmatter.ts`.
- Embeds and their props: `src/lib/embeds/props.ts`.
- Everything else beyond plain Markdown (note kinds, code languages and meta, footnotes, step links): `src/lib/writing/syntax.ts`, checked by the modules in `src/lib/server/markdown/`.

The server code is Effect services, built once per build by `Content.layer` (`src/lib/server/content.ts`): `Content` holds the pieces and projects and needs `Highlighter` (Shiki, `markdown/code.ts`) and `Tweets` (`tweets.ts`). Routes import the plain values `content.ts` exports.

Some checks only run here, not in the editor: real dates, `created` on every piece that isn't a seed, and `updated` not before `created`. A link to a piece that doesn't exist isn't checked here: the prerender gets a 404 for it and fails the build (`prerender.handleHttpError`'s default), so it shows in the editor and in `vp build`, not in `vp dev`.

Tweets are fetched once per build, cached by id. A fetch that fails or takes over 5 seconds doesn't fail the build: the tweet embed becomes a plain link.

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
