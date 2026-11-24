import type { Element, ElementContent } from "hast";
import { isExternal } from "#lib/links.ts";
import { STEP_HREF } from "#lib/writing/syntax.ts";
import { isElement } from "./html.ts";

export function groupKeys(node: Element) {
  const children: ElementContent[] = [];
  let group: Element | undefined;
  let space: ElementContent | undefined;
  for (const child of node.children) {
    if (isElement(child) && child.tagName === "kbd") {
      if (group) group.children.push(child);
      else {
        group = {
          type: "element",
          tagName: "span",
          properties: { dataRole: "keys" },
          children: [child],
        };
        children.push(group);
      }
      space = undefined;
      continue;
    }
    if (group && !space && child.type === "text" && !child.value.trim()) {
      space = child;
      continue;
    }
    if (space) children.push(space);
    space = undefined;
    group = undefined;
    if (isElement(child)) groupKeys(child);
    children.push(child);
  }
  if (space) children.push(space);
  node.children = children;
}

export function linkData(node: Element) {
  for (const child of node.children) if (isElement(child)) linkData(child);
  const href = node.properties.href;
  if (node.tagName !== "a" || typeof href !== "string") return;
  const step = STEP_HREF.exec(href);
  if (step) {
    Object.assign(node.properties, {
      href: `#${step[1]}`,
      dataStep: `${step[1]}/${step[2]}`,
      dataRole: "step",
    });
    return;
  }
  if (isExternal(href)) Object.assign(node.properties, { target: "_blank", rel: "noopener" });
}
