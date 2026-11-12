import * as stylex from "@stylexjs/stylex";
import { media } from "./media.stylex";
import { color, font, motion, space, text } from "./tokens.stylex";

// The looping sync illustration (src/lib/SyncDiagram.svelte). A dot travels
// each way along its track and the receiving node lights up after it arrives.
// The return trip runs half a cycle later.

const loop = motion["--duration-loop"];
const halfLoop = `calc(${loop} / 2)`;

const sendRight = stylex.keyframes({
  "0%, 4%": { opacity: 0, transform: "translateX(0)" },
  "8%": { opacity: 1, transform: "translateX(0)" },
  "43%": { opacity: 1, transform: "translateX(140px)" },
  "47%, 100%": { opacity: 0, transform: "translateX(140px)" },
});

const sendLeft = stylex.keyframes({
  "0%, 4%": { opacity: 0, transform: "translateX(0)" },
  "8%": { opacity: 1, transform: "translateX(0)" },
  "43%": { opacity: 1, transform: "translateX(-140px)" },
  "47%, 100%": { opacity: 0, transform: "translateX(-140px)" },
});

/** Both nodes get the same complete pulse, starting only after arrival. */
const receive = stylex.keyframes({
  "0%, 43%, 63%, 100%": { fill: color["--surface-strong"], stroke: color["--rule"] },
  "47%, 53%": { fill: color["--accent-surface-strong"], stroke: color["--accent-ink"] },
});

export const sync = stylex.create({
  figure: {
    marginBlockStart: "auto",
    marginBlockEnd: 0,
    marginInline: 0,
    paddingBlockStart: space["--space-32"],
  },
  svg: {
    display: "block",
    inlineSize: "100%",
  },
  trackBed: {
    stroke: color["--surface-strong"],
    strokeWidth: 8,
    strokeLinecap: "round",
    filter: "blur(2px)",
  },
  track: {
    stroke: color["--rule"],
    strokeWidth: 1.5,
    strokeLinecap: "round",
  },
  node: {
    fill: color["--surface-strong"],
    stroke: color["--rule"],
    animationName: { default: "none", [media.motion]: receive },
    animationDuration: loop,
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    animationFillMode: "backwards",
  },
  /** The local node receives the return trip, half a cycle later. */
  localNode: {
    animationDelay: halfLoop,
  },
  icon: {
    stroke: color["--muted"],
    strokeWidth: 1.5,
    strokeLinecap: "round",
  },
  label: {
    fill: color["--muted"],
    fontFamily: font["--font-mono"],
    // SVG user units, scaled with the drawing rather than a type size.
    // oxlint-disable-next-line styles/no-raw-values
    fontSize: "11px",
    textAnchor: "middle",
  },
  packet: {
    fill: color["--accent"],
    animationDuration: loop,
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
    animationFillMode: "backwards",
  },
  /** Local to remote. Without motion, the dot rests partway along. */
  outbound: {
    transform: "translateX(42px)",
    animationName: { default: "none", [media.motion]: sendRight },
  },
  /** Remote to local, half a cycle later. */
  inbound: {
    transform: "translateX(-42px)",
    animationName: { default: "none", [media.motion]: sendLeft },
    animationDelay: halfLoop,
  },
  glow: {
    filter: "blur(4px)",
    opacity: 0.65,
  },
  caption: {
    textAlign: "center",
    color: color["--muted"],
    fontSize: text["--text-2xs"],
  },
});
