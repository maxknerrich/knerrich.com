import * as stylex from "@stylexjs/stylex";
import { rowMarker } from "./markers.stylex";
import { media } from "./media.stylex";
import { color, motion, space, text } from "./tokens.stylex";

// The writing list (src/lib/WritingList.svelte), its page, and the plant icons
// that mark each piece's stage.

export const list = stylex.create({
  group: {
    position: "relative",
  },
  /** The year in the left gutter, level with its first row. */
  year: {
    position: "absolute",
    insetBlockStart: "0.8rem",
    insetInlineStart: 0,
    color: color["--muted"],
    fontSize: text["--text-sm"],
    fontWeight: 400,
  },
  items: {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  withYears: {
    marginInlineStart: { default: "25%", [media.phone]: space["--space-48"] },
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: space["--space-12"],
    paddingBlock: space["--space-12"],
    borderBlockStartWidth: 1,
    borderBlockStartStyle: "solid",
    borderBlockStartColor: color["--rule"],
    textDecoration: "none",
    // Hovering the list dims every row except the one under the pointer.
    opacity: {
      default: 1,
      [media.hover]: { default: 1, [stylex.when.ancestor(":hover")]: 0.4, ":hover": 1 },
    },
    transitionProperty: { default: "none", [media.motion]: "opacity" },
    transitionDuration: motion["--duration-fast"],
  },
  firstRow: {
    borderBlockStartColor: "transparent",
  },
  icon: {
    display: "grid",
    placeItems: "end center",
    inlineSize: "0.875rem",
    blockSize: "1.125rem",
    flexShrink: 0,
  },
  title: {
    flexGrow: 1,
    minInlineSize: 0,
  },
  date: {
    color: color["--muted"],
    fontSize: text["--text-sm"],
    whiteSpace: "nowrap",
  },
  /** "planted …", shown while its row is hovered. */
  planted: {
    display: { default: null, [media.phone]: "none" },
    opacity: { default: 0, [stylex.when.ancestor(":hover", rowMarker)]: 1 },
    transitionProperty: { default: "none", [media.motion]: "opacity" },
    transitionDuration: motion["--duration-fast"],
  },
});

/** The pixel plant icons (src/lib/PlantIcon.svelte). */
export const plant = stylex.create({
  svg: {
    display: "block",
    flexShrink: 0,
  },
  leaf: {
    fill: color["--accent-ink"],
  },
  bud: {
    fill: color["--bud"],
  },
});

/** The list page (src/routes/writing). */
export const listPage = stylex.create({
  page: {
    maxInlineSize: "49rem",
    marginInline: "auto",
    paddingBlockStart: { default: space["--space-192"], [media.phone]: space["--space-160"] },
    paddingBlockEnd: { default: space["--space-96"], [media.phone]: space["--space-64"] },
    paddingInline: { default: space["--space-32"], [media.phone]: space["--space-24"] },
  },
  intro: {
    display: "grid",
    gridTemplateColumns: { default: "25% 1fr", [media.phone]: "1fr" },
    alignItems: "end",
    rowGap: space["--space-4"],
    marginBlockEnd: space["--space-40"],
  },
  title: {
    gridColumn: { default: "2", [media.phone]: "1" },
    fontSize: text["--text-base"],
    fontWeight: 600,
  },
  text: {
    gridColumn: { default: "2", [media.phone]: "1" },
    maxInlineSize: "44ch",
    color: color["--muted"],
    fontSize: text["--text-base"],
  },
});
