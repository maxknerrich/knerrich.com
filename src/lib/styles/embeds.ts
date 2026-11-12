import * as stylex from "@stylexjs/stylex";
import { color, radius } from "./tokens.stylex";

// The components that can be embedded in Markdown (src/lib/embeds).
export const embed = stylex.create({
  frame: {
    display: "block",
    inlineSize: "100%",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: color["--rule"],
    borderRadius: radius["--radius-lg"],
    backgroundColor: color["--surface"],
  },
  /** The frame's shape, e.g. `embed.aspect("16 / 9")`. */
  aspect: (ratio: string) => ({ aspectRatio: ratio }),
});
