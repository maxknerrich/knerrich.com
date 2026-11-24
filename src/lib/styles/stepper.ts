import * as stylex from "@stylexjs/stylex";
import { color, font, layout, media, motion, radius, reading, space, text } from "./tokens.stylex";

export const stepper = stylex.create({
  card: {
    paddingBlockStart: layout["--box-pad"],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: color["--hairline"],
    borderRadius: radius["--radius-card"],
    backgroundColor: reading["--viz-surface"],
    scrollMarginBlock: layout["--scroll-offset"],
  },
  stage: {
    paddingInline: layout["--box-pad"],
  },
  caption: {
    display: "grid",
    gap: space["--space-4"],
    paddingBlock: space["--space-16"],
    paddingInline: layout["--box-pad"],
  },
  title: {
    color: color["--text-secondary"],
  },
  detail: {
    fontFamily: font["--font-mono"],
    fontSize: reading["--type-caption"],
    lineHeight: 1.4,
    color: color["--text-muted"],
    overflowWrap: "anywhere",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space["--space-8"],
    paddingBlock: space["--space-8"],
    paddingInline: `calc(${layout["--box-pad"]} - ${space["--space-8"]})`,
    borderBlockStartWidth: 1,
    borderBlockStartStyle: "solid",
    borderBlockStartColor: color["--hairline"],
    fontSize: text["--type-small"],
    color: color["--text-muted"],
  },
  pager: {
    display: "flex",
    alignItems: "center",
    gap: space["--space-4"],
  },
  button: {
    display: "inline-grid",
    placeItems: "center",
    inlineSize: "2.25rem",
    blockSize: "2.25rem",
    borderRadius: radius["--radius-md"],
    color: {
      default: color["--text-muted"],
      ":hover": color["--text"],
      ":disabled": color["--text-dim"],
    },
    cursor: { default: null, ":disabled": "default" },
    transitionProperty: { default: "none", [media.motion]: "color, box-shadow" },
    transitionDuration: motion["--duration-base"],
  },
  playing: {
    color: { default: color["--glow"], ":hover": color["--glow"] },
  },
  icon: {
    inlineSize: "1.125rem",
    blockSize: "1.125rem",
  },
});

const toStep = {
  transitionDuration: reading["--duration-step"],
  transitionTimingFunction: motion["--ease-out"],
} as const;

export const viz = stylex.create({
  svg: {
    display: "block",
    inlineSize: "100%",
    blockSize: "auto",
    overflow: "visible",
  },
  part: {
    transitionProperty: { default: "none", [media.motion]: "fill, stroke, opacity, transform" },
    ...toStep,
  },
  line: {
    fill: reading["--viz-surface"],
    stroke: reading["--viz-stroke"],
    strokeWidth: 1,
    strokeLinejoin: "round",
  },
  dashed: {
    fill: "none",
    stroke: reading["--viz-stroke"],
    strokeWidth: 1,
    strokeDasharray: "3 4",
  },
  lit: {
    fill: reading["--viz-lit"],
    stroke: color["--glow"],
    strokeWidth: 1,
    strokeLinejoin: "round",
  },
  glow: {
    stroke: color["--glow"],
  },
  label: {
    fill: color["--text-muted"],
    fontFamily: font["--font-pixel"],
    // oxlint-disable-next-line styles/no-raw-values
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    textAnchor: "middle",
  },
});
