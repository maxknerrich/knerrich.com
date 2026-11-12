import * as stylex from "@stylexjs/stylex";
import { motion } from "./tokens.stylex";

// The site wrapper around every page (src/routes/+layout.svelte).

export const site = stylex.create({
  root: {
    display: "contents",
  },
});

/** After client-side navigation entrances are instant, so returning home doesn't replay them. */
export const navigated = stylex.createTheme(motion, {
  "--duration-entrance": "0ms",
  "--entrance-delay-scale": "0",
});
