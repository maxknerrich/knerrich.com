import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { enhancedImages } from "@sveltejs/enhanced-img";
import { sveltekit } from "@sveltejs/kit/vite";
import stylex from "@stylexjs/unplugin";
import { defineConfig } from "vite-plus";

export default defineConfig({
  server: { host: "0.0.0.0" },
  lint: {
    options: { typeAware: true },
    jsPlugins: [
      "@stylexjs/eslint-plugin",
      "./tools/oxlint-styles.ts",
      "./tools/oxlint-comments.ts",
    ],
    rules: {
      "@stylexjs/valid-styles": [
        "error",
        {
          propLimits: {
            anchorName: { limit: "string" },
            anchorScope: { limit: "string" },
            positionAnchor: { limit: "string" },
            positionArea: { limit: "string" },
            positionTryFallbacks: { limit: ["none", "flip-block", "flip-inline", "flip-start"] },
            transitionBehavior: { limit: ["normal", "allow-discrete"] },
          },
        },
      ],
      "@stylexjs/valid-shorthands": "error",
      "@stylexjs/no-conflicting-props": "error",
      "styles/no-raw-values": "error",
      "comments/no-comments": "error",
    },
  },
  staged: {
    "*.{ts,js,json,css,html,md,yaml,yml}": "vp fmt",
    "*.{ts,js,svelte,md}": () => "vp run lint",
  },
  build: { cssTarget: "esnext" },
  plugins: [
    enhancedImages(),
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: adapter(),
      paths: { relative: false },
      prerender: {
        handleUnseenRoutes: ({ routes, message }) => {
          if (routes.some((route) => route !== "/writing/[slug]")) throw new Error(message);
        },
      },
    }),
    {
      ...stylex.vite({ useCSSLayers: true, lightningcssOptions: { minify: true } }),
      enforce: undefined,
    },
  ],
});
