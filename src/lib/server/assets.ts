import { posix } from "node:path";
import type { Picture } from "@sveltejs/enhanced-img";

const pictures = import.meta.glob<Picture>("/src/content/**/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
  query: { enhanced: true, w: "1920;1280;640" },
});

const assetPath = (src: string, source: string) =>
  src.startsWith("./") ? posix.join(posix.dirname(source), src) : undefined;

export const pictureFor = (src: string, source: string) => pictures[assetPath(src, source) ?? ""];
