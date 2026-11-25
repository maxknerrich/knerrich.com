import * as stylex from "@stylexjs/stylex";
import { color, media, motion, radius, reading, space, vars } from "#lib/styles/tokens.stylex.ts";

const grow = stylex.keyframes({
  from: { transform: "scaleX(0)" },
});

export const chart = stylex.create({
  panels: (count: number) => ({
    display: "grid",
    gridTemplateColumns: {
      default: `repeat(${count}, minmax(0, 1fr))`,
      [media.phone]: "minmax(0, 1fr)",
    },
    gap: space["--space-24"],
  }),
  body: {
    gridTemplateColumns: "max-content minmax(0, 1fr) max-content",
    alignItems: "center",
  },
  row: {
    alignItems: "center",
  },
  track: {
    position: "relative",
    blockSize: space["--space-8"],
    borderRadius: radius["--radius-xs"],
    backgroundColor: reading["--viz-surface"],
  },
  bar: {
    position: "absolute",
    insetBlock: 0,
    minInlineSize: "2px",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: radius["--radius-xs"],
    transformOrigin: "left",
    animationName: { default: "none", [media.entrance]: grow },
    animationDuration: motion["--duration-zoom"],
    animationTimingFunction: motion["--ease-out"],
    animationFillMode: "backwards",
    animationPlayState: vars["--play"],
  },
  span: (start: string, size: string, delay: string) => ({
    insetInlineStart: start,
    inlineSize: size,
    animationDelay: delay,
  }),
  context: {
    borderColor: reading["--viz-stroke"],
    backgroundColor: color["--nav-hover"],
  },
  point: {
    borderColor: color["--glow"],
    backgroundColor: reading["--viz-lit"],
  },
  quiet: {
    color: color["--text-muted"],
  },
});
