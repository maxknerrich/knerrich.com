import { posix } from "node:path";
import type { Picture } from "@sveltejs/enhanced-img";

const pictures = import.meta.glob<Picture>("/src/content/**/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
  query: { enhanced: true, w: "1920;1280;640" },
});

const drawings = import.meta.glob<string>("/src/content/**/*.svg", {
  eager: true,
  import: "default",
  query: "?url",
});

const videos = import.meta.glob<string>("/src/content/**/*.mp4", {
  eager: true,
  import: "default",
  query: "?url",
});

const assetPath = (src: string, source: string) =>
  src.startsWith("./") ? posix.join(posix.dirname(source), src) : undefined;

export const pictureFor = (src: string, source: string) => pictures[assetPath(src, source) ?? ""];

export const drawingFor = (src: string, source: string) => drawings[assetPath(src, source) ?? ""];

export const videoFor = (src: string, source: string) => videos[assetPath(src, source) ?? ""];
