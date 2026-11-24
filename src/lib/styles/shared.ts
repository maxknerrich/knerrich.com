import * as stylex from "@stylexjs/stylex";
import {
  button,
  color,
  effect,
  font,
  layout,
  media,
  motion,
  radius,
  reading,
  space,
  stop,
  text,
  vars,
  widths,
} from "./tokens.stylex";

export const type = stylex.create({
  display: {
    fontSize: text["--type-display"],
    lineHeight: 1,
    letterSpacing: "-0.04em",
    fontWeight: 500,
  },
  h1: { fontSize: text["--type-h1"], lineHeight: 1, letterSpacing: "-0.04em", fontWeight: 500 },
  h2: { fontSize: text["--type-h2"], lineHeight: 1.1, letterSpacing: "-0.04em", fontWeight: 500 },
  h3: { fontSize: text["--type-h3"], lineHeight: 1.2, letterSpacing: "-0.03em", fontWeight: 500 },
  lead: {
    fontSize: text["--type-lead"],
    lineHeight: 1.3,
    letterSpacing: "-0.03em",
    fontWeight: 500,
  },
  body: {
    fontSize: text["--type-body"],
    lineHeight: 1.3,
    letterSpacing: "-0.02em",
    fontWeight: 500,
  },
  small: {
    fontSize: text["--type-small"],
    lineHeight: 1.3,
    letterSpacing: "-0.02em",
    fontWeight: 500,
  },
  caps: {
    fontFamily: font["--font-pixel"],
    fontSize: reading["--type-caption"],
    lineHeight: 1.4,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  secondary: { color: color["--text-secondary"] },
  muted: { color: color["--text-muted"] },
});

export const glass = stylex.create({
  edge: {
    position: "relative",
    isolation: "isolate",
    "::after": {
      content: '""',
      position: "absolute",
      inset: 0,
      padding: space["--space-1"],
      borderRadius: "inherit",
      backgroundImage: vars["--edge"],
      maskImage: effect["--edge-mask"],
      maskClip: "content-box, border-box",
      maskComposite: "exclude",
      pointerEvents: "none",
    },
  },
  card: {
    borderRadius: radius["--radius-card"],
    backgroundImage: effect["--card-fill"],
    [vars["--edge"]]: effect["--card-edge"],
  },
  focus: {
    outlineStyle: "solid",
    outlineWidth: 1,
    outlineColor: "transparent",
    boxShadow: { default: "none", ":focus-visible": effect["--focus-glow"] },
    transitionProperty: { default: "none", [media.motion]: "box-shadow" },
    transitionDuration: motion["--duration-slow"],
    transitionTimingFunction: "ease",
  },

  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space["--space-8"],
    blockSize: "3rem",
    paddingBlock: 0,
    paddingInline: space["--space-20"],
    borderRadius: radius["--radius-button"],
    fontSize: text["--type-label"],
    lineHeight: 1.3,
    letterSpacing: "-0.02em",
    whiteSpace: "nowrap",
    color: { default: color["--text"], ":hover": color["--text"] },
    textDecoration: "none",
    outlineStyle: "solid",
    outlineWidth: 1,
    outlineColor: "transparent",
    backgroundImage: `linear-gradient(${button["--button-dim"]}, ${button["--button-dim"]}), radial-gradient(circle at 0 0, ${button["--button-fill-from"]}, ${button["--button-fill-to"]})`,
    [vars["--edge"]]:
      `radial-gradient(circle at 0 0, ${button["--button-edge-from"]}, ${button["--button-edge-to"]})`,
    transitionProperty: {
      default: "none",
      [media.motion]:
        "--button-fill-from, --button-fill-to, --button-edge-from, --button-edge-to, --button-dim, box-shadow",
    },
    transitionDuration: motion["--duration-slow"],
    transitionTimingFunction: "ease-out",
  },
  primary: {
    [button["--button-fill-from"]]: {
      default: stop["--primary-fill-from"],
      ":hover": stop["--primary-hover-fill-from"],
      ":focus-visible": stop["--primary-hover-fill-from"],
    },
    [button["--button-fill-to"]]: {
      default: stop["--primary-fill-to"],
      ":hover": stop["--primary-hover-fill-to"],
      ":focus-visible": stop["--primary-hover-fill-to"],
    },
    [button["--button-edge-from"]]: {
      default: stop["--primary-edge-from"],
      ":hover": stop["--primary-hover-edge-from"],
      ":focus-visible": stop["--primary-hover-edge-from"],
    },
    [button["--button-edge-to"]]: {
      default: stop["--primary-edge-to"],
      ":hover": stop["--primary-hover-edge-to"],
      ":focus-visible": stop["--primary-hover-edge-to"],
    },
    [button["--button-dim"]]: {
      default: "transparent",
      ":hover": stop["--primary-hover-dim"],
      ":focus-visible": stop["--primary-hover-dim"],
    },
    boxShadow: {
      default: "none",
      ":hover": effect["--primary-glow"],
      ":focus-visible": effect["--primary-glow"],
    },
  },
  secondary: {
    [button["--button-fill-from"]]: stop["--secondary-fill-from"],
    [button["--button-fill-to"]]: stop["--secondary-fill-to"],
    [button["--button-edge-from"]]: {
      default: stop["--secondary-edge-from"],
      ":hover": stop["--secondary-hover-edge-from"],
      ":focus-visible": stop["--secondary-hover-edge-from"],
    },
    [button["--button-edge-to"]]: {
      default: stop["--secondary-edge-to"],
      ":hover": stop["--secondary-hover-edge-to"],
      ":focus-visible": stop["--secondary-hover-edge-to"],
    },
    boxShadow: {
      default: "none",
      ":hover": effect["--secondary-glow"],
      ":focus-visible": effect["--secondary-glow"],
    },
  },
  icon: {
    inlineSize: "1rem",
    blockSize: "1rem",
    flexShrink: 0,
  },
});

const focusIn = stylex.keyframes({
  from: {
    opacity: 0,
    filter: `blur(${motion["--focus-blur"]})`,
    translate: `0 ${motion["--focus-rise"]}`,
  },
});

const scaled = (time: string) => `calc(${time} * ${motion["--entrance-delay-scale"]})`;

const rise = stylex.keyframes({
  from: { opacity: 0, translate: `0 ${motion["--reveal-rise"]}` },
});

export const reveal = stylex.create({
  focus: {
    animationName: { default: "none", [media.motion]: focusIn },
    animationDuration: `calc(${motion["--duration-focus"]} * ${motion["--entrance-delay-scale"]})`,
    animationDelay: `calc(${motion["--reveal-delay"]} * ${motion["--entrance-delay-scale"]})`,
    animationTimingFunction: motion["--ease-out"],
    animationFillMode: "backwards",
  },
  delay: (value: string) => ({ [motion["--reveal-delay"]]: value }),
});

export const scroll = stylex.create({
  reveal: {
    animationName: { default: "none", [media.entrance]: rise },
    animationDuration: scaled(motion["--duration-reveal"]),
    animationDelay: scaled(motion["--reveal-delay"]),
    animationTimingFunction: motion["--ease-out"],
    animationFillMode: "backwards",
    animationPlayState: vars["--play"],
  },
  now: {
    animationPlayState: "running",
  },
  later: {
    [motion["--reveal-delay"]]: motion["--reveal-later"],
  },
});

export const screenReader = stylex.create({
  only: {
    position: "absolute",
    inlineSize: "1px",
    blockSize: "1px",
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
  },
});

export const site = stylex.create({
  content: {
    inlineSize: "100%",
    maxInlineSize: layout["--content-width"],
    marginInline: "auto",
  },
  plainList: {
    padding: 0,
    listStyle: "none",
  },
  link: {
    color: { default: "inherit", ":hover": color["--text"] },
    textDecoration: "none",
    borderRadius: radius["--radius-xs"],
  },
  backLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: space["--space-4"],
  },
  backIcon: {
    inlineSize: "1em",
    blockSize: "1em",
    flexShrink: 0,
  },
  rows: {
    marginBlockStart: layout["--intro-space"],
    marginBlockEnd: { default: space["--space-64"], [media.phone]: space["--space-48"] },
  },
  row: {
    borderBlockStartWidth: 1,
    borderBlockStartStyle: "solid",
    borderBlockStartColor: color["--hairline"],
  },
});

export const article = stylex.create({
  page: {
    inlineSize: "100%",
    maxInlineSize: widths.article,
    marginInline: "auto",
    paddingBlockStart: layout["--hero-space"],
  },
  column: {
    maxInlineSize: layout["--measure"],
    marginInline: "auto",
  },
  title: {
    textWrap: "balance",
  },
  footer: {
    borderBlockStartWidth: 1,
    borderBlockStartStyle: "solid",
    borderBlockStartColor: color["--hairline"],
    marginBlockStart: space["--space-96"],
    paddingBlockStart: space["--space-32"],
  },
  footerAfterNotes: {
    borderBlockStartWidth: 0,
    marginBlockStart: space["--space-48"],
    paddingBlockStart: 0,
  },
});
