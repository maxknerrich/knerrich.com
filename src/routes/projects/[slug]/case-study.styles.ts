import * as stylex from "@stylexjs/stylex";
import { color, layout, media, radius, space, widths } from "#lib/styles/tokens.stylex.ts";

const margin = layout["--page-margin"];
const header = layout["--landing-header-height"];
const reach = space["--space-160"];
const phoneReach = space["--space-64"];

const sink = stylex.keyframes({
  "exit 0%": { transform: "translateY(0)", opacity: 1 },
  "exit 100%": { transform: "translateY(35%)", opacity: 0 },
});

const rise = stylex.keyframes({
  "entry 0%": { transform: "scale(0.92)" },
  "entry 100%": { transform: "scale(1)" },
});

export const caseStudy = stylex.create({
  brand: (value: string) => ({ [color["--brand"]]: value }),
  page: {
    inlineSize: "100%",
  },

  hero: {
    position: "relative",
    isolation: "isolate",
    overflow: "clip",
    marginInline: `calc(-1 * ${margin})`,
    marginBlockStart: `calc(-1 * ${header})`,
    paddingInline: margin,
    paddingBlockStart: `calc(${header} + ${layout["--hero-space"]})`,
    paddingBlockEnd: {
      default: `calc(${reach} + ${space["--space-96"]})`,
      [media.phone]: `calc(${phoneReach} + ${space["--space-64"]})`,
    },
    viewTimelineName: "--hero",
  },
  heroContent: {
    display: "grid",
    justifyItems: "center",
    textAlign: "center",
    maxInlineSize: "60rem",
    marginInline: "auto",
    animationName: {
      default: "none",
      [media.scrollTimeline]: { default: "none", [media.motion]: sink },
    },
    animationTimeline: "--hero",
    animationTimingFunction: "linear",
    animationFillMode: "both",
  },
  back: {
    marginBlockEnd: space["--space-32"],
  },
  title: {
    textWrap: "balance",
  },
  meta: {
    marginBlockStart: space["--space-24"],
  },
  description: {
    maxInlineSize: "40rem",
    marginInline: "auto",
    marginBlockStart: { default: space["--space-64"], [media.phone]: space["--space-48"] },
    textWrap: "balance",
  },

  fold: {
    position: "relative",
    zIndex: 1,
    maxInlineSize: layout["--content-width"],
    marginInline: "auto",
    marginBlockStart: {
      default: `calc(-1 * ${reach})`,
      [media.phone]: `calc(-1 * ${phoneReach})`,
    },
    animationName: {
      default: "none",
      [media.scrollTimeline]: { default: "none", [media.motion]: rise },
    },
    animationTimeline: "view()",
    animationTimingFunction: "linear",
    animationFillMode: "both",
  },
  ratio: (width: number, height: number) => ({
    aspectRatio: `${width} / ${height}`,
  }),
  cover: {
    display: "block",
    inlineSize: "100%",
    blockSize: "auto",
    borderRadius: radius["--radius-card"],
  },

  about: {
    display: "grid",
    gridTemplateColumns: { default: "minmax(0, 1fr) minmax(0, 2fr)", [media.phone]: "1fr" },
    gap: { default: space["--space-64"], [media.phone]: space["--space-40"] },
    maxInlineSize: widths.article,
    marginInline: "auto",
    paddingBlock: { default: space["--space-128"], [media.phone]: space["--space-64"] },
  },
  label: {
    marginBlockEnd: space["--space-16"],
  },
  services: {
    padding: 0,
    listStyle: "none",
    display: "grid",
    gap: space["--space-4"],
  },
  website: {
    marginBlockStart: space["--space-32"],
  },
  story: {
    maxInlineSize: widths.article,
    marginInline: "auto",
  },
});
