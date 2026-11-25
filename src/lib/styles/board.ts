import * as stylex from "@stylexjs/stylex";
import { color, font, media, motion, radius, reading, space } from "./tokens.stylex.ts";

const travel = stylex.keyframes({
  from: { insetInlineStart: "0%", insetBlockStart: "0%" },
  to: { insetInlineStart: "100%", insetBlockStart: "100%" },
});

const fade = stylex.keyframes({
  "0%": { opacity: 0 },
  "20%": { opacity: 1 },
  "80%": { opacity: 1 },
  "100%": { opacity: 0 },
});

const typing = stylex.keyframes({
  from: { inlineSize: 0 },
});

const otherLit = `color-mix(in srgb, ${color["--actor-other"]} 18%, ${reading["--viz-surface"]})`;

const toStep = {
  transitionDuration: reading["--duration-step"],
  transitionTimingFunction: motion["--ease-out"],
} as const;

const HEAD = "3rem";

export const board = stylex.create({
  row: {
    display: "flex",
    flexDirection: { default: "row", [media.phone]: "column" },
    alignItems: { default: "flex-start", [media.phone]: "stretch" },
    zoom: { default: 1, [media.phone]: 0.8 },
    paddingBlock: space["--space-64"],
    paddingInline: space["--space-32"],
  },
  panel: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minInlineSize: 0,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: color["--hairline"],
    borderRadius: radius["--radius-xs"],
    backgroundColor: color["--nav-hover"],
    transitionProperty: { default: "none", [media.motion]: "border-color, opacity" },
    ...toStep,
  },
  active: {
    borderColor: color["--glow"],
  },
  idle: {
    opacity: 0.4,
  },
  head: {
    display: "flex",
    alignItems: "center",
    gap: space["--space-8"],
    blockSize: HEAD,
    paddingInline: space["--space-20"],
    borderBlockEndWidth: 1,
    borderBlockEndStyle: "solid",
    borderBlockEndColor: color["--hairline"],
    backgroundColor: color["--nav-hover"],
    color: color["--text-secondary"],
  },
  meta: {
    marginInlineStart: "auto",
    color: color["--glow"],
  },
  icon: {
    flexShrink: 0,
    inlineSize: "1.125rem",
    blockSize: "1.125rem",
  },
  body: {
    display: "grid",
    gridTemplateColumns: "max-content minmax(0, 1fr)",
    rowGap: space["--space-4"],
    paddingBlock: space["--space-16"],
    paddingInline: space["--space-12"],
  },
  section: {
    display: "flex",
    alignItems: "center",
    gap: space["--space-8"],
    paddingBlockStart: space["--space-8"],
    paddingBlockEnd: 0,
    paddingInline: space["--space-20"],
    color: color["--text-muted"],
  },
  field: {
    display: "grid",
    gridColumnStart: 1,
    gridColumnEnd: -1,
    gridTemplateColumns: "subgrid",
    alignItems: "baseline",
    columnGap: space["--space-24"],
    paddingBlock: space["--space-10"],
    paddingInline: space["--space-8"],
    borderRadius: radius["--radius-xs"],
    fontFamily: font["--font-mono"],
    transitionProperty: { default: "none", [media.motion]: "background-color, box-shadow" },
    ...toStep,
  },
  lit: {
    backgroundColor: reading["--viz-lit"],
  },
  litOther: {
    backgroundColor: otherLit,
  },
  metaOther: {
    color: color["--actor-other"],
  },
  activeOther: {
    borderColor: color["--actor-other"],
  },
  typed: (characters: number) => ({
    display: "inline-block",
    overflow: "hidden",
    whiteSpace: "nowrap",
    verticalAlign: "bottom",
    inlineSize: `${characters}ch`,
    animationName: { default: "none", [media.motion]: typing },
    animationDuration: motion["--duration-zoom"],
    animationTimingFunction: `steps(${characters})`,
    animationFillMode: "both",
  }),
  gone: {
    opacity: 0,
  },
  stack: {
    position: "relative",
    isolation: "isolate",
  },
  glow: {
    position: "absolute",
    inset: 0,
    zIndex: -1,
    borderRadius: radius["--radius-xs"],
    backgroundColor: reading["--viz-lit"],
    opacity: 0,
  },
  key: {
    fontSize: reading["--type-caption"],
    color: color["--text-muted"],
  },
  value: {
    fontSize: reading["--type-caption"],
    color: color["--text"],
    overflowWrap: "anywhere",
  },
  empty: {
    color: color["--text-dim"],
  },
  chip: {
    display: "inline-block",
    flexShrink: 0,
    inlineSize: space["--space-8"],
    blockSize: space["--space-8"],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: color["--glow"],
    borderRadius: radius["--radius-xs"],
    backgroundColor: reading["--viz-lit"],
  },
  link: {
    position: "relative",
    flexShrink: 0,
    alignSelf: "flex-start",
    inlineSize: { default: space["--space-64"], [media.phone]: 1 },
    blockSize: { default: 1, [media.phone]: space["--space-40"] },
    marginBlockStart: { default: `calc(${HEAD} / 2)`, [media.phone]: 0 },
    marginInlineStart: { default: 0, [media.phone]: space["--space-40"] },
    backgroundColor: reading["--viz-stroke"],
    transitionProperty: { default: "none", [media.motion]: "background-color" },
    ...toStep,
  },
  flowLine: {
    backgroundColor: reading["--viz-stroke"],
    transitionProperty: { default: "none", [media.motion]: "background-color" },
    ...toStep,
  },
  flowing: {
    backgroundColor: color["--glow"],
  },
  beam: {
    position: "absolute",
    inset: 0,
    backgroundColor: color["--glow"],
    opacity: 0,
  },
  end: {
    position: "absolute",
    inlineSize: "5px",
    blockSize: "5px",
    borderRadius: "50%",
    backgroundColor: "currentColor",
    color: reading["--viz-stroke"],
    translate: "-50% -50%",
  },
  endFlowing: {
    color: color["--glow"],
  },
  from: { insetInlineStart: 0, insetBlockStart: 0 },
  to: { insetInlineStart: "100%", insetBlockStart: "100%" },
  packet: {
    position: "absolute",
    inlineSize: "7px",
    blockSize: "7px",
    borderRadius: "50%",
    backgroundColor: color["--text"],
    boxShadow: `0 0 8px ${color["--glow"]}`,
    translate: "-50% -50%",
  },
  looping: {
    animationName: { default: "none", [media.motion]: `${travel}, ${fade}` },
    animationDuration: motion["--duration-packet"],
    animationTimingFunction: "ease-in-out, linear",
    animationIterationCount: "infinite",
  },
  backwards: {
    animationDirection: "reverse",
  },
  backwardsWide: {
    animationDirection: { default: "reverse", [media.phone]: "normal" },
  },
  backwardsNarrow: {
    animationDirection: { default: "normal", [media.phone]: "reverse" },
  },
});
