import * as stylex from "@stylexjs/stylex";
import {
  color,
  font,
  layout,
  media,
  motion,
  radius,
  reading,
  space,
  vars,
} from "#lib/styles/tokens.stylex.ts";

const BAR = "0.875rem";

const lit = `color-mix(in oklab, ${color["--brand"]} 22%, ${reading["--viz-surface"]})`;

const figures = {
  fontFamily: font["--font-mono"],
  fontSize: reading["--type-caption"],
  fontVariantNumeric: "tabular-nums",
  whiteSpace: "nowrap",
} as const;

const grow = stylex.keyframes({
  from: { transform: "scaleX(0)" },
});

const entrance = (keyframes: string, duration: string) => ({
  animationName: { default: "none", [media.entrance]: keyframes },
  animationDuration: duration,
  animationTimingFunction: motion["--ease-out"],
  animationFillMode: "backwards",
  animationPlayState: vars["--play"],
});

export const chart = stylex.create({
  stage: {
    paddingBlockEnd: space["--space-8"],
    paddingInline: layout["--box-pad"],
  },
  plot: {
    position: "relative",
    isolation: "isolate",
    display: "grid",
    gridTemplateColumns: {
      default: "max-content minmax(0, 1fr) max-content",
      [media.phone]: "minmax(0, 1fr) max-content",
    },
    columnGap: space["--space-16"],
    paddingBlockStart: space["--space-8"],
  },
  marked: {
    paddingBlockStart: space["--space-32"],
  },
  row: {
    display: "grid",
    gridColumnStart: 1,
    gridColumnEnd: -1,
    gridTemplateColumns: "subgrid",
    alignItems: "center",
    transitionProperty: { default: "none", [media.motion]: "opacity" },
    transitionDuration: motion["--duration-base"],
  },
  rowAt: (row: string) => ({ gridRowStart: row }),
  dimmed: {
    opacity: 0.35,
  },
  rowLabel: {
    gridColumnStart: 1,
    gridColumnEnd: { default: "auto", [media.phone]: -1 },
    paddingBlockStart: { default: 0, [media.phone]: space["--space-12"] },
    color: color["--text-muted"],
    whiteSpace: "nowrap",
  },
  bars: {
    gridColumnStart: { default: 2, [media.phone]: 1 },
    display: "grid",
    gap: space["--space-4"],
    paddingBlock: { default: space["--space-12"], [media.phone]: space["--space-8"] },
  },
  lane: {
    position: "relative",
    blockSize: BAR,
  },
  bar: {
    position: "absolute",
    insetBlock: 0,
    minInlineSize: space["--space-4"],
    borderWidth: 1,
    borderStyle: "solid",
    transformOrigin: "left",
    ...entrance(grow, motion["--duration-entrance"]),
  },
  fromZero: {
    borderStartEndRadius: radius["--radius-xs"],
    borderEndEndRadius: radius["--radius-xs"],
  },
  range: {
    borderRadius: radius["--radius-xs"],
  },
  context: {
    borderColor: reading["--viz-stroke"],
    backgroundColor: color["--hairline"],
  },
  point: {
    borderColor: color["--brand"],
    backgroundColor: lit,
  },
  span: (start: string, size: string) => ({ insetInlineStart: start, inlineSize: size }),
  value: {
    position: "absolute",
    insetBlockStart: "50%",
    translate: `${space["--space-4"]} -50%`,
    paddingInline: space["--space-4"],
    backgroundColor: reading["--viz-surface"],
    ...figures,
    ...entrance(motion["--fade-in"], motion["--duration-entrance"]),
  },
  room: {
    gridRowStart: 1,
    gridColumnStart: -2,
    visibility: "hidden",
    ...figures,
  },
  at: (start: string) => ({ insetInlineStart: start }),
  delay: (ms: string) => ({ animationDelay: ms }),
  strong: {
    color: color["--text"],
  },
  quiet: {
    color: color["--text-muted"],
  },

  grid: {
    position: "relative",
    gridColumnStart: { default: 2, [media.phone]: 1 },
    zIndex: -1,
    pointerEvents: "none",
  },
  rows: (end: string) => ({ gridRowStart: 1, gridRowEnd: end }),
  gridline: {
    position: "absolute",
    insetBlock: 0,
    inlineSize: 1,
    backgroundColor: color["--hairline"],
  },
  marker: {
    position: "absolute",
    insetBlockStart: `calc(-1 * ${space["--space-24"]})`,
    insetBlockEnd: 0,
    borderInlineStartWidth: 1,
    borderInlineStartStyle: "dashed",
    borderInlineStartColor: color["--brand"],
  },
  markerLabel: {
    position: "absolute",
    insetBlockStart: `calc(-1 * ${space["--space-32"]})`,
    translate: `${space["--space-8"]} 0`,
    color: color["--text-secondary"],
    whiteSpace: "nowrap",
  },
  axis: {
    position: "relative",
    gridColumnStart: { default: 2, [media.phone]: 1 },
    blockSize: space["--space-24"],
    marginBlockStart: space["--space-4"],
  },
  tick: {
    position: "absolute",
    insetBlockEnd: 0,
    translate: "-50% 0",
    color: color["--text-muted"],
    fontVariantNumeric: "tabular-nums",
    whiteSpace: "nowrap",
  },
  innerTick: {
    display: { default: null, [media.phone]: "none" },
  },
  firstTick: {
    translate: "0 0",
  },

  tooltip: {
    position: "absolute",
    zIndex: 1,
    display: "grid",
    gap: space["--space-4"],
    minInlineSize: "10rem",
    paddingBlock: space["--space-12"],
    paddingInline: space["--space-16"],
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: color["--hairline"],
    borderRadius: radius["--radius-md"],
    backgroundColor: color["--overlay"],
    color: color["--text-secondary"],
    ...figures,
    translate: `-50% calc(-100% - ${space["--space-8"]})`,
    pointerEvents: "none",
  },
  place: (left: string, top: string) => ({ insetInlineStart: left, insetBlockStart: top }),
  reading: {
    display: "flex",
    alignItems: "center",
    gap: space["--space-8"],
  },
  line: {
    inlineSize: space["--space-12"],
    blockSize: space["--space-2"],
    borderRadius: radius["--radius-xs"],
  },
  lineContext: { backgroundColor: reading["--viz-stroke"] },
  linePoint: { backgroundColor: color["--brand"] },
  change: {
    marginBlockStart: space["--space-4"],
    paddingBlockStart: space["--space-8"],
    borderBlockStartWidth: 1,
    borderBlockStartStyle: "solid",
    borderBlockStartColor: color["--hairline"],
  },

  legend: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: space["--space-16"],
    rowGap: space["--space-4"],
    paddingBlock: 0,
    paddingInline: space["--space-8"],
    listStyle: "none",
    color: color["--text-secondary"],
  },
  key: {
    display: "inline-flex",
    alignItems: "center",
    gap: space["--space-8"],
  },
  swatch: {
    inlineSize: space["--space-12"],
    blockSize: space["--space-8"],
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: radius["--radius-xs"],
  },
  toggle: {
    display: "inline-flex",
    marginInlineStart: "auto",
    alignItems: "center",
    whiteSpace: "nowrap",
    inlineSize: "auto",
    gap: space["--space-8"],
    paddingInline: space["--space-8"],
    fontWeight: 400,
  },
  pressed: {
    color: { default: color["--brand"], ":hover": color["--brand"] },
  },

  table: {
    inlineSize: "100%",
    borderCollapse: "collapse",
    fontFamily: font["--font-mono"],
    fontSize: reading["--type-caption"],
    fontVariantNumeric: "tabular-nums",
    color: color["--text-secondary"],
  },
  cell: {
    paddingBlock: space["--space-8"],
    paddingInlineEnd: space["--space-16"],
    borderBlockEndWidth: 1,
    borderBlockEndStyle: "solid",
    borderBlockEndColor: color["--hairline"],
    textAlign: "start",
    fontWeight: 500,
  },
  number: {
    textAlign: "end",
    paddingInlineEnd: 0,
    paddingInlineStart: space["--space-16"],
  },
  head: {
    color: color["--text-muted"],
  },
});
