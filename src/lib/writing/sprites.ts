import type { Stage } from "./frontmatter";

/** Pixel art rows: "#" uses the main color, "+" the secondary color (buds), "." is empty. */
export type Sprite = readonly string[];

export const STAGE_NAMES: Record<Stage, string> = {
  seed: "Seed",
  seedling: "Seedling",
  budding: "Budding",
  evergreen: "Evergreen",
};

/** Small icons for lists and legends. */
export const ICONS: Record<Stage, Sprite> = {
  seed: [".##.", "####", "####", ".##."],
  seedling: [".#...#.", ".##.##.", "..###..", "...#...", "...+...", "...+..."],
  budding: [
    "...+#+...",
    "....#....",
    ".#..#..#.",
    "..#.#.#..",
    "#..###..#",
    ".#..#..#.",
    "..#####..",
    "....#....",
    "....#....",
    "....#....",
  ],
  evergreen: [
    ".....#.....",
    "....###....",
    "...#.#.#...",
    ".....#.....",
    "....###....",
    "...#.#.#...",
    "..#..#..#..",
    ".....#.....",
    "...#####...",
    "..#..#..#..",
    ".#...#...#.",
    ".....#.....",
    "..#######..",
    ".#...#...#.",
    "#....#....#",
    ".....#.....",
    ".....#.....",
  ],
};
