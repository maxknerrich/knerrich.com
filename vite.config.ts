import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import stylex from "@stylexjs/unplugin";
import { defineConfig } from "vite-plus";

export default defineConfig({
  server: { host: "0.0.0.0" },
  // `vp run lint` runs on @effect/tsgo's build of tsrs (the Rust port of TypeScript 7, with
  // Effect's diagnostics): `tsrs --noEmit` type-checks the whole program, Markdown included,
  // which Oxlint's `typeCheck` would skip, then Oxlint runs the type-aware rules on tsrs.
  // .svelte files are type-checked by `vp run check` (svelte-check).
  lint: {
    options: { typeAware: true },
    // StyleX's own rules catch styles it would drop (like `border: "1px solid …"`).
    // tools/oxlint-styles.ts keeps design values in src/lib/styles/tokens.stylex.ts.
    jsPlugins: ["@stylexjs/eslint-plugin", "./tools/oxlint-styles.ts"],
    rules: {
      "@stylexjs/valid-styles": "error",
      "@stylexjs/valid-shorthands": "error",
      "@stylexjs/no-unused": "error",
      "@stylexjs/no-conflicting-props": "error",
      "styles/no-raw-values": "error",
      "styles/when-inside-create": "error",
    },
  },
  // `vp staged`, run by .vite-hooks/pre-commit: formats the staged files (and re-stages
  // them), then lints the whole project once, since a change can break types in files
  // that aren't staged. oxfmt doesn't format .svelte files yet.
  staged: {
    "*.{ts,js,json,css,html,md,yaml,yml}": "vp fmt",
    "*.{ts,js,svelte,md}": () => "vp run lint",
  },
  // CSS ships as written, using new Baseline features like light-dark().
  build: { cssTarget: "esnext" },
  plugins: [
    // Resizes and converts images (AVIF, WebP) at build; must come before sveltekit().
    enhancedImages(),
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: adapter(),
      // The site lives at the domain root. Absolute paths let build/404.html work at any
      // missing URL (Cloudflare Pages serves it there), where relative ones would break.
      paths: { relative: false },
      prerender: {
        // The garden may be empty; then /writing/[slug] has nothing to prerender. Any other
        // unprerendered route still fails the build.
        handleUnseenRoutes: ({ routes, message }) => {
          if (routes.some((route) => route !== "/writing/[slug]")) throw new Error(message);
        },
      },
    }),
    {
      // StyleX adds its CSS after Vite has minified the stylesheet, so it minifies its own
      // rules with Lightning CSS. Its browser targets come from `browserslist` in package.json.
      ...stylex.vite({ useCSSLayers: true, lightningcssOptions: { minify: true } }),
      // StyleX defaults to `enforce: "pre"`, which runs its Babel step on raw .svelte files
      // and fails to parse them; this runs it on Svelte's compiled JavaScript instead.
      enforce: undefined,
    },
  ],
});
