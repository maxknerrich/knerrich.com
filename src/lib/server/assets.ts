import { posix } from "node:path";
import { cards, drawings, pictures, posters, videos } from "virtual:content-media";

const assetPath = (src: string, source: string) =>
  src.startsWith("./") ? posix.join(posix.dirname(source), src) : undefined;

const lookup =
  <T>(assets: Readonly<Partial<Record<string, T>>>) =>
  (src: string, source: string) =>
    assets[assetPath(src, source) ?? ""];

export const pictureFor = lookup(pictures);

export const cardFor = lookup(cards);

export const posterFor = lookup(posters);

export const drawingFor = lookup(drawings);

export const videoFor = lookup(videos);
