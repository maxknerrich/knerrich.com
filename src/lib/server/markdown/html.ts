import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { Element, ElementContent, RootContent } from "hast";
import { glyph, type IconName } from "#lib/icons/glyphs.ts";
import { roleStyles, tagStyles } from "#lib/styles/prose.ts";
import { headingMarker } from "#lib/styles/tokens.stylex.ts";

export const isElement = (node: RootContent | ElementContent | undefined): node is Element =>
  node?.type === "element";

export const textOf = (nodes: ElementContent[]): string =>
  nodes
    .map((node) =>
      node.type === "text" ? node.value : isElement(node) ? textOf(node.children) : "",
    )
    .join("");

export function style(node: Element, place?: StyleXStyles, role?: StyleXStyles) {
  const { dataRole } = node.properties;
  const { className } = stylex.props(
    place,
    tagStyles[node.tagName],
    roleStyles[typeof dataRole === "string" ? dataRole : ""],
    role,
    /^h[2-4]$/.test(node.tagName) && headingMarker,
  );
  if (className) node.properties.className = className.split(" ");
  for (const child of node.children) if (isElement(child)) style(child);
}

export function iconHtml(name: IconName, attributes = "") {
  const { attributes: own, inner } = glyph(name);
  const root = Object.entries(own).map(([key, value]) => ` ${key}="${value}"`);
  return `<svg${root.join("")} aria-hidden="true"${attributes}>${inner}</svg>`;
}
