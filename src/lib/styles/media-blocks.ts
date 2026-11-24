import * as stylex from "@stylexjs/stylex";
import { color, effect, layout, mediaUi, space, text, vars } from "./tokens.stylex";

const frosted = {
  backgroundColor: mediaUi["--media-glass"],
  backdropFilter: mediaUi["--media-blur"],
} as const;

const round = {
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  borderRadius: "50%",
  color: color["--text"],
} as const;

export const mediaBlock = stylex.create({
  caption: {
    marginBlockStart: space["--space-16"],
    paddingInline: layout["--box-pad"],
    color: color["--text-muted"],
    fontSize: text["--type-small"],
    lineHeight: 1.3,
  },
  icon: {
    inlineSize: "1.25rem",
    blockSize: "1.25rem",
  },
  frosted,
  roundControl: {
    ...round,
    ...frosted,
    inlineSize: "2.75rem",
    blockSize: "2.75rem",
    [vars["--edge"]]: effect["--card-edge"],
  },
  invisibleRange: {
    position: "absolute",
    inset: 0,
    inlineSize: "100%",
    blockSize: "100%",
    opacity: 0,
  },
});
