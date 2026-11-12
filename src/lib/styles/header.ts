import * as stylex from "@stylexjs/stylex";
import { optionMarker } from "./markers.stylex";
import { media } from "./media.stylex";
import { color, layout, motion, radius, space, text } from "./tokens.stylex";

// The site header (src/lib/SiteHeader.svelte): logo, navigation and theme switch.

export const header = stylex.create({
  skip: {
    position: "absolute",
    zIndex: 20,
    insetBlockStart: "1rem",
    insetInlineStart: "1rem",
    paddingBlock: space["--space-8"],
    paddingInline: space["--space-16"],
    backgroundColor: color["--paper"],
    transform: { default: "translateY(-200%)", ":focus": "translateY(0)" },
  },
  /** Fixed over the page. Only its links and switch take the pointer on wide screens. */
  bar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space["--space-16"],
    position: "fixed",
    insetBlockStart: 0,
    insetInline: 0,
    zIndex: 5,
    blockSize: layout["--site-header-height"],
    margin: 0,
    paddingInline: { default: space["--space-32"], [media.phone]: space["--space-24"] },
    paddingBlockStart: "env(safe-area-inset-top)",
    backgroundColor: {
      default: "transparent",
      [media.tablet]: color["--paper"],
      [media.phone]: color["--sticky-paper"],
    },
    pointerEvents: { default: "none", [media.tablet]: "auto" },
    backdropFilter: { default: "none", [media.phone]: "blur(12px)" },
  },
  logoLink: {
    display: "inline-flex",
    textDecoration: "none",
    pointerEvents: "auto",
  },
  logo: {
    inlineSize: "3rem",
    blockSize: "3rem",
    color: color["--accent-ink"],
    flexShrink: 0,
  },
  /** The site navigation, pushed right next to the theme switch. */
  nav: {
    marginInlineStart: "auto",
    fontSize: text["--text-md"],
    pointerEvents: "auto",
  },
  navLink: {
    display: "inline-flex",
    alignItems: "center",
    minBlockSize: "2.75rem",
    paddingInline: space["--space-8"],
    color: { default: color["--muted"], ":hover": color["--ink"] },
    textDecoration: "none",
  },
  navCurrent: {
    color: color["--ink"],
    textDecorationLine: "underline",
    textDecorationColor: color["--accent-ink"],
    textDecorationThickness: "1.5px",
  },

  // The theme switch: three radios with icons. Only the checked one shows its name.
  themeSwitch: {
    display: "flex",
    gap: space["--space-2"],
    minInlineSize: 0,
    margin: 0,
    padding: space["--space-4"],
    borderWidth: 0,
    borderRadius: radius["--radius-pill"],
    backgroundColor: color["--surface"],
    pointerEvents: "auto",
  },
  themeOption: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minInlineSize: { default: "2.25rem", [media.phone]: "2.75rem" },
    minBlockSize: { default: "2.25rem", [media.phone]: "2.75rem" },
    paddingInline: space["--space-12"],
    borderRadius: radius["--radius-pill"],
    fontSize: text["--text-xs"],
    color: { default: color["--muted"], ":has(:checked)": color["--ink"] },
    backgroundColor: { default: "transparent", ":has(:checked)": color["--surface-strong"] },
    outlineStyle: { default: "none", ":has(:focus-visible)": "solid" },
    outlineWidth: 2,
    outlineColor: color["--accent-ink"],
    outlineOffset: 2,
    cursor: "pointer",
    transitionProperty: { default: "none", [media.motion]: "background-color, color" },
    transitionDuration: motion["--duration-base"],
    transitionTimingFunction: "ease",
  },
  themeIcon: {
    inlineSize: "1.125rem",
    blockSize: "1.125rem",
    flexShrink: 0,
  },
  themeName: {
    interpolateSize: "allow-keywords",
    inlineSize: { default: 0, [stylex.when.ancestor(":has(:checked)", optionMarker)]: "auto" },
    marginInlineStart: {
      default: 0,
      [stylex.when.ancestor(":has(:checked)", optionMarker)]: space["--space-8"],
    },
    overflow: "hidden",
    whiteSpace: "nowrap",
    opacity: { default: 0, [stylex.when.ancestor(":has(:checked)", optionMarker)]: 1 },
    transitionProperty: {
      default: "none",
      [media.motion]: "inline-size, margin-inline-start, opacity",
    },
    transitionDuration: `${motion["--duration-slow"]}, ${motion["--duration-slow"]}, ${motion["--duration-base"]}`,
    transitionTimingFunction: `${motion["--ease-snap"]}, ${motion["--ease-snap"]}, ease`,
  },
});
