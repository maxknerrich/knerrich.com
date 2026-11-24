import * as stylex from "@stylexjs/stylex";
import { color, layout, media, radius, reading, space, text } from "#lib/styles/tokens.stylex.ts";

const lit = `color-mix(in oklab, ${color["--brand"]} 22%, ${reading["--viz-surface"]})`;

export const stats = stylex.create({
  card: {
    display: "grid",
    gap: space["--space-1"],
    padding: 0,
    listStyle: "none",
    overflow: "clip",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: color["--hairline"],
    borderRadius: radius["--radius-card"],
    backgroundColor: color["--hairline"],
  },
  one: { gridTemplateColumns: "minmax(0, 1fr)" },
  two: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
  three: {
    gridTemplateColumns: { default: "repeat(3, minmax(0, 1fr))", [media.phone]: "minmax(0, 1fr)" },
  },
  cell: {
    display: "grid",
    alignContent: "space-between",
    gap: { default: space["--space-24"], [media.phone]: space["--space-16"] },
    minBlockSize: { default: "9rem", [media.phone]: "auto" },
    padding: layout["--box-pad"],
    backgroundColor: reading["--viz-surface"],
  },
  value: {
    color: color["--text"],
    fontSize: text["--type-h2"],
    lineHeight: 1,
    letterSpacing: "-0.04em",
    whiteSpace: "nowrap",
  },
  label: {
    display: "flex",
    alignItems: "baseline",
    gap: space["--space-8"],
    color: color["--text-secondary"],
  },
  dot: {
    flexShrink: 0,
    inlineSize: space["--space-8"],
    blockSize: space["--space-8"],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: color["--brand"],
    borderRadius: radius["--radius-xs"],
    backgroundColor: lit,
  },
});
