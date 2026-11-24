import * as stylex from "@stylexjs/stylex";
import type { StyleXStyles } from "@stylexjs/stylex";
import { sticker } from "#lib/styles/tokens.stylex.ts";

type Part = { d: string; paint: StyleXStyles; width?: number };
type Layer = { parts: readonly Part[]; hiddenBy?: readonly string[] };
export type Art = { attributes: Record<string, string | number>; layers: readonly Layer[] };

const paint = stylex.create({
  outline: { stroke: sticker["--opera-teal"] },
  teal: { fill: sticker["--opera-teal"], stroke: "none" },
  shade: { fill: sticker["--opera-rust"], stroke: "none" },
  podium: { fill: sticker["--opera-stone"], stroke: sticker["--opera-teal"] },
  grain: { stroke: sticker["--opera-grain"] },
  rib: { stroke: sticker["--opera-sail-light"] },
  eye: { fill: sticker["--brand-claude-dark"] },
});

const sails = [
  "M46 64L48 30C60 31 70 40 73 56L72 64Z",
  "M64 64L66 22C80 24 90 36 93 54L92 64Z",
  "M94 64L96 10C114 13 128 30 133 52L130 64Z",
  "M128 63C134 42 148 32 162 30L156 64Z",
  "M154 63.5C159 52 169 46 182 44L176 64Z",
  "M172 63.5C177 55 186 50 196 48L190 64Z",
];
const ribs = [
  "M50.5 33C59 35 66 42 68.5 56",
  "M68.5 26C79 29 86 38 88.5 53",
  "M99 15C112 19 122 31 126.5 50",
  "M135 58C140 45 149 37.5 158 35",
  "M160 60C164 53 170 49.5 177.5 48",
  "M177.5 60.5C181 56 185.5 53 191.5 51.5",
];
const undersides = [
  "M38 64C40 59 43 57 47 57L46.6 64Z",
  "M86.5 64C88.5 60.5 91.5 58.5 94.6 57.5L94 64Z",
  "M150 64C152 60.5 155 58.5 158.4 58L157.6 64Z",
];
const podium = "M22 78L30 70H36V67H44V64H196L204 78Z";
const water = "M8 78.5H212V81H8Z";

export const operaHouseShape = [...sails, ...undersides, podium, water];

export const operaHouseArt: Art = {
  attributes: {
    fill: "none",
    "stroke-width": 1.8,
    "stroke-linejoin": "round",
    "stroke-linecap": "round",
  },
  layers: [
    { parts: [{ d: podium, paint: paint.podium }] },
    {
      parts: [
        {
          d: Array.from({ length: 49 }, (_, i) => `M${48 + i * 3} 71.5V77`).join(""),
          paint: paint.grain,
          width: 0.6,
        },
      ],
    },
    { parts: [{ d: "M70 66.5H180V70H70Z", paint: paint.teal }] },
    { parts: undersides.map((d) => ({ d, paint: paint.shade })) },
    ...sails.map((d, index) => ({
      parts: [
        { d: ribs[index] ?? "", paint: paint.rib, width: 1.1 },
        { d, paint: paint.outline },
      ],
      hiddenBy: sails.slice(index + 1),
    })),
    { parts: [{ d: water, paint: paint.teal }] },
  ],
};

export const claudeCodeShape =
  "M3 0H15V4H17V6H15V8H14V10H13V8H12V10H11V8H7V10H6V8H5V10H4V8H3V6H1V4H3Z";

export const claudeCodeArt: Art = {
  attributes: {},
  layers: [{ parts: ["M5 2h1v2H5Z", "M12 2h1v2H12Z"].map((d) => ({ d, paint: paint.eye })) }],
};
