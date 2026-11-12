import * as stylex from "@stylexjs/stylex";
import { cardMarker, detailsMarker } from "./markers.stylex";
import { media } from "./media.stylex";
import { color, font, layout, motion, radius, space, text } from "./tokens.stylex";

// The homepage (src/lib/Portfolio.svelte).

const bleed = layout["--section-bleed"];
const sectionSpace = layout["--section-space"];
const contactSpace = layout["--contact-space"];
const headerHeight = layout["--site-header-height"];

export const home = stylex.create({
  page: {
    maxInlineSize: "49rem",
    marginInline: "auto",
    paddingInline: { default: space["--space-32"], [media.small]: space["--space-24"] },
    paddingBlockStart: { default: space["--space-192"], [media.phone]: space["--space-128"] },
    paddingBlockEnd: space["--space-40"],
  },
  main: {
    display: "grid",
    gap: sectionSpace,
    scrollMarginBlockStart: { default: "1rem", [media.tablet]: "10rem", [media.phone]: "6rem" },
  },

  // Intro
  intro: {
    display: "grid",
    gap: space["--space-24"],
  },
  heroHeading: {
    display: "grid",
    gap: space["--space-16"],
  },
  greeting: {
    fontFamily: font["--font-display"],
    fontStyle: "italic",
    fontSize: text["--text-2xl"],
    color: color["--muted"],
  },
  headline: {
    fontFamily: font["--font-display"],
    fontSize: text["--text-display"],
    fontWeight: 400,
    letterSpacing: "-0.025em",
    lineHeight: 1.08,
    textWrap: "balance",
  },
  emphasis: {
    color: color["--accent-ink"],
  },
  bio: {
    maxInlineSize: "35rem",
    color: color["--muted"],
    fontSize: text["--text-lg"],
    lineHeight: 1.75,
  },
  introAction: {
    justifySelf: "start",
    fontSize: text["--text-md"],
  },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space["--space-12"],
    minBlockSize: "2.875rem",
    paddingBlock: space["--space-12"],
    paddingInline: space["--space-16"],
    borderRadius: radius["--radius-md"],
    backgroundColor: { default: color["--button-fill"], ":hover": color["--button-hover"] },
    color: { default: color["--button-ink"], ":hover": color["--button-ink"] },
    fontWeight: 500,
    textDecoration: "none",
    transform: { default: "translateY(0)", ":hover": "translateY(-2px)" },
    transitionProperty: { default: "none", [media.motion]: "background-color, transform" },
    transitionDuration: motion["--duration-slow"],
  },
  linkIcon: {
    inlineSize: "1rem",
    blockSize: "1rem",
    flexShrink: 0,
  },
  arrow: {
    color: color["--accent-ink"],
  },

  // Sections
  section: {
    borderBlockStartWidth: 0.5,
    borderBlockStartStyle: "solid",
    borderBlockStartColor: color["--rule"],
    marginInline: `calc(-1 * ${bleed})`,
    paddingInline: bleed,
    paddingBlockStart: sectionSpace,
    // Where the section lands when the outline jumps to it, clear of the header and outline bar.
    scrollMarginBlockStart: {
      default: "-1rem",
      [media.tablet]: `calc(${headerHeight} + 2.75rem - ${sectionSpace})`,
      [media.phone]: "6rem",
    },
  },
  sectionTitle: {
    fontFamily: font["--font-mono"],
    color: color["--muted"],
    fontSize: text["--text-xs"],
    fontWeight: 400,
    letterSpacing: "0.025em",
    marginBlockEnd: space["--space-32"],
    paddingBlock: { default: 0, [media.phone]: space["--space-16"] },
  },
  /** On phones, section headings stick under the header while their section scrolls. */
  stickyHeading: {
    position: { default: "static", [media.phone]: "sticky" },
    insetBlockStart: { default: "auto", [media.phone]: headerHeight },
    zIndex: { default: "auto", [media.phone]: 3 },
    marginInline: { default: 0, [media.phone]: `calc(-1 * ${bleed})` },
    paddingInline: { default: 0, [media.phone]: bleed },
    backgroundColor: { default: "transparent", [media.phone]: color["--sticky-paper"] },
    backdropFilter: { default: "none", [media.phone]: "blur(12px)" },
  },

  // Client logos
  trustedSection: {
    paddingBlockStart: `calc(${sectionSpace} / 2)`,
    marginBlockEnd: `calc(${sectionSpace} / -2)`,
  },
  trusted: {
    display: "grid",
    gridTemplateColumns: "1fr 0.7fr 1.4fr",
    alignItems: "center",
    gap: space["--space-24"],
    maxInlineSize: "27rem",
    inlineSize: "100%",
    listStyleType: "none",
    padding: 0,
    marginBlock: 0,
    marginInline: "auto",
  },
  trustedLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minBlockSize: "2.75rem",
    // The logos are drawn in this color; they don't change on hover.
    color: { default: color["--ink"], ":hover": color["--ink"] },
  },
  trustedLogo: {
    display: "block",
    inlineSize: "100%",
    blockSize: "2rem",
    opacity: 0.8,
  },
  tldrawLogo: { maxInlineSize: "6rem" },
  lwLogo: { maxInlineSize: "2.6875rem" },
  porscheLogo: { maxInlineSize: "9rem" },

  // Selected work
  projects: {
    display: "grid",
    gridTemplateColumns: { default: "repeat(2, minmax(0, 1fr))", [media.phone]: "1fr" },
    gap: space["--space-16"],
  },
  project: {
    display: "block",
    backgroundColor: color["--surface"],
    borderRadius: radius["--radius-lg"],
    padding: { default: space["--space-32"], [media.phone]: space["--space-24"] },
    color: { default: "inherit", ":hover": color["--ink"] },
    textDecoration: "none",
    scrollMarginBlockStart: `calc(${headerHeight} + 2rem)`,
    outlineStyle: "solid",
    outlineWidth: { default: 1, ":focus-visible": 2 },
    outlineColor: {
      default: "transparent",
      ":hover": color["--rule"],
      ":focus-visible": color["--accent-ink"],
    },
    outlineOffset: { default: 0, ":focus-visible": 4 },
    transitionProperty: { default: "none", [media.motion]: "outline-color" },
    transitionDuration: motion["--duration-base"],
    transitionTimingFunction: "ease",
  },
  wideProject: {
    gridColumnStart: "1",
    gridColumnEnd: "-1",
  },
  syncProject: {
    display: "grid",
    gridColumnStart: "1",
    gridColumnEnd: "-1",
    gridTemplateColumns: { default: "1.2fr 1fr", [media.phone]: "1fr" },
    alignItems: "center",
    gap: space["--space-24"],
  },
  featuredProject: {
    gridColumnStart: "1",
    gridColumnEnd: "-1",
    backgroundColor: color["--accent-surface"],
    padding: { default: space["--space-32"], [media.phone]: space["--space-24"] },
  },
  featuredLead: {
    fontFamily: font["--font-display"],
    fontSize: text["--text-4xl"],
    fontWeight: 500,
    letterSpacing: "-0.035em",
    lineHeight: 1.2,
    marginBlockEnd: space["--space-24"],
  },
  projectImage: {
    display: "block",
    inlineSize: "100%",
    blockSize: "auto",
    aspectRatio: "16 / 10",
    objectFit: "cover",
    borderRadius: radius["--radius-sm"],
    marginBlockEnd: space["--space-24"],
  },
  /** The tldraw illustration is shown whole, on white. */
  illustration: {
    aspectRatio: "2706 / 1464",
    objectFit: "contain",
    backgroundColor: color["--image-paper"],
  },
  projectTitle: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: space["--space-12"],
    fontFamily: font["--font-display"],
    fontSize: text["--text-xl"],
    fontWeight: 500,
    letterSpacing: "-0.025em",
    lineHeight: 1.3,
    marginBlockEnd: space["--space-8"],
    color: {
      default: "inherit",
      [stylex.when.ancestor(":hover", cardMarker)]: color["--accent-ink"],
      [stylex.when.ancestor(":focus-visible", cardMarker)]: color["--accent-ink"],
    },
    transitionProperty: { default: "none", [media.motion]: "color" },
    transitionDuration: motion["--duration-base"],
    transitionTimingFunction: "ease",
  },
  projectKind: {
    display: "block",
    fontFamily: font["--font-sans"],
    fontSize: text["--text-xs"],
    color: color["--muted"],
    marginBlockEnd: space["--space-8"],
  },
  description: {
    color: color["--muted"],
    fontSize: text["--text-base"],
    lineHeight: 1.7,
  },

  // Writing
  allWriting: {
    display: "inline-flex",
    alignItems: "center",
    gap: space["--space-8"],
    marginBlockStart: space["--space-24"],
    fontSize: text["--text-md"],
  },

  // About
  about: {
    display: "grid",
    gap: space["--space-24"],
    color: color["--muted"],
    fontSize: text["--text-base"],
    lineHeight: 1.8,
  },
  aboutEmphasis: {
    color: color["--ink"],
    fontWeight: 500,
  },

  // Experience and education: open/close sections
  summary: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: space["--space-16"],
    minBlockSize: "2.75rem",
    paddingBlock: { default: space["--space-8"], [media.phone]: space["--space-16"] },
    listStyle: "none",
    cursor: "pointer",
    color: { default: "inherit", ":hover": color["--accent-ink"] },
    outlineStyle: { default: "none", ":focus-visible": "solid" },
    outlineWidth: 2,
    outlineColor: color["--accent-ink"],
    outlineOffset: 5,
    borderRadius: { default: 0, ":focus-visible": radius["--radius-xs"] },
    // Safari may still draw its own marker.
    "::-webkit-details-marker": { display: "none" },
  },
  accordionTitle: {
    fontFamily: font["--font-mono"],
    fontSize: text["--text-xs"],
    fontWeight: 400,
    letterSpacing: "0.025em",
    color: color["--muted"],
    lineHeight: 1.5,
  },
  /** A plus that turns into a minus while its section is open. */
  expandIcon: {
    inlineSize: "1rem",
    blockSize: "1rem",
    flexShrink: 0,
    stroke: "currentColor",
    strokeWidth: 2,
  },
  expandIconBar: {
    display: { default: "inline", [stylex.when.ancestor(":is([open])", detailsMarker)]: "none" },
  },
  experience: {
    display: "grid",
    gap: space["--space-32"],
    // Below the summary, so the space goes away with the list when it closes.
    marginBlockStart: space["--space-24"],
  },
  experienceRow: {
    display: "grid",
    gridTemplateColumns: { default: "9rem 1fr", [media.phone]: "1fr" },
    columnGap: space["--space-24"],
    rowGap: space["--space-4"],
    fontSize: text["--text-base"],
  },
  experienceLabel: {
    color: color["--muted"],
    fontSize: text["--text-sm"],
    paddingBlockStart: space["--space-2"],
  },
  role: {
    fontSize: text["--text-base"],
    fontWeight: 500,
  },
  experienceDetail: {
    color: color["--muted"],
    fontSize: text["--text-md"],
    marginBlockStart: space["--space-4"],
  },
  experienceDescription: {
    color: color["--muted"],
    fontSize: text["--text-md"],
    marginBlockStart: space["--space-12"],
  },

  // Contact
  contactSection: {
    marginBlockStart: `calc(${contactSpace} - ${sectionSpace})`,
    paddingBlockStart: contactSpace,
    paddingBlockEnd: `calc(${contactSpace} - ${sectionSpace})`,
  },
  contactTitle: {
    fontFamily: font["--font-display"],
    fontSize: text["--text-3xl"],
    fontWeight: 500,
    letterSpacing: "-0.035em",
    lineHeight: 1.2,
    marginBlockEnd: space["--space-16"],
    paddingBlock: { default: 0, [media.phone]: space["--space-16"] },
  },
  contactInvitation: {
    color: color["--muted"],
    fontSize: text["--text-base"],
  },
  contactEmail: {
    display: "inline-block",
    fontFamily: font["--font-display"],
    fontSize: text["--text-5xl"],
    letterSpacing: "-0.04em",
    lineHeight: 1.3,
    color: color["--accent-ink"],
    textDecorationLine: { default: "none", ":hover": "underline" },
    marginBlockStart: space["--space-12"],
    marginBlockEnd: space["--space-24"],
  },
  links: {
    display: "flex",
    flexWrap: "wrap",
    columnGap: space["--space-24"],
    rowGap: space["--space-12"],
    fontSize: text["--text-md"],
  },
  contactLink: {
    display: "inline-flex",
    alignItems: "center",
    gap: space["--space-8"],
    transform: {
      default: "translateY(0)",
      ":hover": "translateY(-1px)",
      ":focus-visible": "translateY(-1px)",
    },
    transitionProperty: {
      default: "none",
      [media.motion]: "color, text-decoration-color, transform",
    },
    transitionDuration: motion["--duration-base"],
  },

  footer: {
    marginBlockStart: sectionSpace,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: space["--space-8"],
    fontFamily: font["--font-sans"],
    fontSize: text["--text-xs"],
    color: color["--muted"],
  },
  footerLocation: {
    marginInlineStart: "auto",
    textAlign: "end",
  },
});
