declare module "virtual:content-media" {
  import type { Picture } from "@sveltejs/enhanced-img";

  type Assets<T> = Readonly<Partial<Record<string, T>>>;

  export const pictures: Assets<Picture>;
  export const cards: Assets<Picture>;
  export const posters: Assets<Picture>;
  export const drawings: Assets<string>;
  export const videos: Assets<string>;
}
