import * as stylex from "@stylexjs/stylex";
import {
  cardMarker,
  color,
  effect,
  layout,
  media,
  motion,
  radius,
  space,
  vars,
} from "#lib/styles/tokens.stylex.ts";

const shimmer = stylex.keyframes({
  "0%": { backgroundPosition: "100% 0" },
  "60%": { backgroundPosition: "0% 0" },
  "100%": { backgroundPosition: "0% 0" },
});

const bleed = `max(100%, 100cqi + 2 * ${layout["--page-margin"]} - 2 * ${layout["--bleed-margin"]})`;

export const landing = stylex.create({
  inline: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    minBlockSize: `calc(100svh - ${layout["--landing-header-height"]})`,
    paddingBlockStart: layout["--hero-space"],
    paddingBlockEnd: layout["--nav-clearance"],
  },
  statement: {
    maxInlineSize: "28.75rem",
    marginInlineStart: { default: "50%", [media.phone]: 0 },
  },
  heroBottom: {
    marginBlockStart: "auto",
    paddingBlockStart: space["--space-64"],
  },
  heroMeta: {
    display: "grid",
    gridTemplateColumns: { default: "repeat(2, minmax(0, 1fr))", [media.phone]: "1fr" },
    alignItems: "baseline",
    rowGap: space["--space-8"],
    marginBlockEnd: { default: space["--space-40"], [media.phone]: space["--space-24"] },
  },
  heroPlace: {
    justifyContent: "space-between",
    columnGap: space["--space-24"],
    rowGap: space["--space-8"],
  },
  place: {
    gap: space["--space-12"],
  },
  shimmer: {
    color: { default: "transparent", ":hover": "transparent" },
    backgroundImage: effect["--shimmer"],
    backgroundSize: "250% 100%",
    backgroundPosition: "0% 0",
    backgroundClip: "text",
    animationName: { default: "none", [media.motion]: shimmer },
    animationDuration: motion["--duration-shimmer"],
    animationTimingFunction: "ease-in-out",
    animationIterationCount: "infinite",
  },

  section: {
    marginBlockStart: layout["--landing-section-space"],
    scrollMarginBlockStart: space["--space-40"],
  },
  column: {
    maxInlineSize: layout["--text-column"],
    marginInline: "auto",
  },
  columns: {
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 32.1875rem) minmax(0, 17.8125rem)",
      [media.phone]: "1fr",
    },
    justifyContent: "space-between",
    gap: space["--space-24"],
    marginBlockStart: layout["--intro-space"],
  },
  aboutColumns: {
    marginBlockStart: space["--space-32"],
  },
  action: {
    marginBlockStart: { default: space["--space-64"], [media.phone]: space["--space-48"] },
  },
  trusted: {
    marginBlockStart: { default: space["--space-96"], [media.phone]: space["--space-64"] },
  },
  logos: {
    columnGap: space["--space-32"],
    rowGap: space["--space-16"],
  },
  logoItem: {
    display: "flex",
    alignItems: "center",
    minBlockSize: "2.75rem",
  },
  trustedLogo: {
    display: "block",
    blockSize: "1.25rem",
    inlineSize: "auto",
  },
  porscheLogo: {
    blockSize: "0.75rem",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: { default: "repeat(2, minmax(0, 1fr))", [media.phone]: "1fr" },
    gap: space["--space-20"],
    marginBlockStart: layout["--intro-space"],
  },
  project: {
    display: "block",
    scrollMarginBlockStart: space["--space-40"],
    overflow: "hidden",
    color: { default: color["--text"], ":hover": color["--text"] },
    textDecoration: "none",
    outlineStyle: "solid",
    outlineWidth: 1,
    outlineColor: "transparent",
    [vars["--edge"]]: {
      default: effect["--card-edge"],
      ":hover": effect["--secondary-hover-edge"],
      ":focus-visible": effect["--secondary-hover-edge"],
    },
    boxShadow: {
      default: "none",
      ":hover": effect["--secondary-glow"],
      ":focus-visible": effect["--secondary-glow"],
    },
  },
  imageProject: {
    aspectRatio: { default: "670 / 738", [media.phone]: "4 / 5" },
  },
  image: {
    position: "absolute",
    inset: 0,
    zIndex: -1,
    inlineSize: "100%",
    blockSize: "100%",
    objectFit: "cover",
    transform: {
      default: "scale(1.06)",
      [stylex.when.ancestor(":hover", cardMarker)]: "scale(1)",
      [stylex.when.ancestor(":focus-visible", cardMarker)]: "scale(1)",
    },
    transitionProperty: { default: "none", [media.motion]: "transform" },
    transitionDuration: motion["--duration-zoom"],
    transitionTimingFunction: motion["--ease-out"],
  },
  tags: {
    position: "absolute",
    insetBlockStart: { default: "1.5rem", [media.phone]: "1rem" },
    insetInline: { default: "1.5rem", [media.phone]: "1rem" },
    justifyContent: "end",
    gap: space["--space-8"],
  },
  tag: {
    display: "flex",
    alignItems: "center",
    blockSize: { default: "2.5rem", [media.phone]: "2rem" },
    paddingInline: { default: space["--space-16"], [media.phone]: space["--space-12"] },
    borderRadius: radius["--radius-md"],
    backgroundColor: color["--pill"],
    backdropFilter: "blur(10px)",
  },
  caption: {
    position: "absolute",
    insetInline: 0,
    insetBlockEnd: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "end",
    gap: space["--space-4"],
    minBlockSize: "50%",
    padding: { default: space["--space-32"], [media.phone]: space["--space-24"] },
    backgroundImage: effect["--scrim"],
  },

  experience: {
    display: "grid",
    gridTemplateColumns: { default: "12.5rem minmax(0, 41.25rem)", [media.phone]: "1fr" },
    justifyContent: "space-between",
    gap: space["--space-8"],
    paddingBlock: { default: space["--space-32"], [media.phone]: space["--space-24"] },
  },
  dates: {
    paddingBlockStart: space["--space-4"],
  },
  org: {
    marginBlockStart: space["--space-8"],
  },
  role: {
    marginBlockStart: space["--space-12"],
  },
  education: {
    marginBlockStart: { default: space["--space-160"], [media.phone]: space["--space-96"] },
  },

  contact: {
    paddingBlockStart: layout["--landing-section-space"],
  },
  contactHeading: {
    maxInlineSize: "13em",
    marginBlockStart: space["--space-24"],
  },
  contactAction: {
    marginBlockStart: { default: space["--space-48"], [media.phone]: space["--space-32"] },
  },

  grow: {
    inlineSize: bleed,
    marginInline: `calc((100% - ${bleed}) / 2)`,
    transformOrigin: "50% 0",
    willChange: { default: null, [media.motion]: "scale" },
  },
  parallax: {
    insetBlock: `calc(${motion["--parallax"]} * -1)`,
    blockSize: `calc(100% + ${motion["--parallax"]} * 2)`,
    willChange: { default: null, [media.motion]: "translate" },
  },
});
