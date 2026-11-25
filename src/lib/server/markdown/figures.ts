import type { Element, Root } from "hast";
import { walkTokens, type Token, type Tokens } from "marked";
import { widths } from "#lib/styles/tokens.stylex.ts";
import { pictureFor } from "../assets.ts";
import { isElement } from "./html.ts";

function alone(node: Element, tagName: string) {
  if (node.tagName !== "p") return undefined;
  const [child, ...rest] = node.children.filter(
    (content) => !(content.type === "text" && !content.value.trim()),
  );
  return rest.length === 0 && isElement(child) && child.tagName === tagName ? child : undefined;
}

function onlyImages(node: Element) {
  if (node.tagName !== "p") return undefined;
  const children = node.children.filter(
    (content) => !(content.type === "text" && !content.value.trim()),
  );
  const images = children.filter(isElement).filter((child) => child.tagName === "img");
  return images.length > 1 && images.length === children.length ? images : undefined;
}

function galleryItem(image: Element): Element {
  const { title, ...properties } = image.properties;
  const label: Element[] =
    typeof title === "string" && title
      ? [
          {
            type: "element",
            tagName: "figcaption",
            properties: { dataRole: "gallery-label" },
            children: [{ type: "text", value: title }],
          },
        ]
      : [];
  return {
    type: "element",
    tagName: "li",
    properties: { dataRole: "gallery-item" },
    children: [
      {
        type: "element",
        tagName: "figure",
        properties: { dataRole: "gallery-figure" },
        children: [
          { ...image, properties: { ...properties, dataRole: "gallery-image" } },
          ...label,
        ],
      },
    ],
  };
}

const gallery = (images: Element[]): Element => ({
  type: "element",
  tagName: "figure",
  properties: { dataRole: "gallery" },
  children: [
    {
      type: "element",
      tagName: "ul",
      properties: { dataRole: "gallery-list" },
      children: images.map(galleryItem),
    },
  ],
});

export function withFigures(root: Root) {
  const blocks: Element[] = [];
  for (const node of root.children.filter(isElement)) {
    const image = alone(node, "img");
    const images = onlyImages(node);
    const caption = alone(node, "em");
    const previous = blocks.at(-1);
    if (images) {
      blocks.push(gallery(images));
    } else if (image) {
      blocks.push({ type: "element", tagName: "figure", properties: {}, children: [image] });
    } else if (caption && previous?.tagName === "figure" && previous.children.length === 1) {
      previous.children.push({
        type: "element",
        tagName: "figcaption",
        properties: {},
        children: [caption],
      });
    } else {
      blocks.push(node);
    }
  }
  return blocks;
}

const IMAGE_SIZES = `(max-width: ${widths.article}) 100vw, ${widths.article}`;
const GALLERY_SIZES = widths.galleryItem;

export function useProcessedImages(node: Element, source: string) {
  processImages(node, source, node.properties.dataRole === "gallery" ? GALLERY_SIZES : IMAGE_SIZES);
}

function processImages(node: Element, source: string, sizes: string) {
  node.children = node.children.map((child) => {
    if (!isElement(child)) return child;
    const src = child.properties.src;
    const image = child.tagName === "img" && typeof src === "string" ? src : undefined;
    const picture = image ? pictureFor(image, source) : undefined;
    if (!picture) {
      processImages(child, source, sizes);
      return child;
    }
    const sources: Element[] = Object.entries(picture.sources).map(([format, srcSet]) => ({
      type: "element",
      tagName: "source",
      properties: { srcSet, sizes, type: `image/${format}` },
      children: [],
    }));
    const img: Element = {
      ...child,
      properties: {
        ...child.properties,
        src: picture.img.src,
        width: picture.img.w,
        height: picture.img.h,
        loading: "lazy",
        decoding: "async",
      },
    };
    return { type: "element", tagName: "picture", properties: {}, children: [...sources, img] };
  });
}

export function imageProblems(tokens: Token[], source: string) {
  const problems: string[] = [];
  void walkTokens(tokens, (token) => {
    if (token.type !== "image") return;
    const { href } = token as Tokens.Image;
    if (href.startsWith("./") && !pictureFor(href, source))
      problems.push(`image ${href} isn't beside the piece`);
  });
  return problems;
}
