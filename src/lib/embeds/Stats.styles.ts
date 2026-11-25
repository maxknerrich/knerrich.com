import * as stylex from "@stylexjs/stylex";
import { color, media, space, text } from "#lib/styles/tokens.stylex.ts";

export const stats = stylex.create({
  list: {
    display: "grid",
    columnGap: space["--space-32"],
    rowGap: space["--space-40"],
    padding: 0,
    listStyle: "none",
  },
  two: { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" },
  three: {
    gridTemplateColumns: { default: "repeat(3, minmax(0, 1fr))", [media.phone]: "minmax(0, 1fr)" },
  },
  item: {
    position: "relative",
    containerType: "inline-size",
    display: "grid",
    alignContent: "start",
    gap: space["--space-12"],
    paddingBlockStart: space["--space-20"],
    borderBlockStartWidth: 1,
    borderBlockStartStyle: "solid",
    borderBlockStartColor: color["--hairline"],
    "::before": {
      content: '""',
      position: "absolute",
      insetBlockStart: -1,
      insetInlineStart: 0,
      inlineSize: space["--space-24"],
      blockSize: space["--space-2"],
      backgroundColor: color["--brand"],
    },
  },
  value: {
    color: color["--text"],
    fontSize: `min(${text["--type-h2"]}, 26cqi)`,
    lineHeight: 1,
    letterSpacing: "-0.04em",
    whiteSpace: "nowrap",
  },
  label: {
    textWrap: "pretty",
  },
});
