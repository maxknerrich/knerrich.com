import { sveltekit } from "@sveltejs/kit/vite";
import stylex from "@stylexjs/unplugin";
import { defineConfig } from "vite-plus";

export default defineConfig({
  server: { host: "0.0.0.0" },
  build: { cssTarget: "esnext" },
  plugins: [
    sveltekit(),
    {
      ...stylex.vite({ useCSSLayers: true }),
      enforce: undefined,
    },
  ],
});
