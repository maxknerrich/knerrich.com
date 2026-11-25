export type Depth = "none" | "copy" | "solid";

export const steps: {
  title: string;
  detail: string;
  depth: Depth;
  lifted: boolean;
  iso: boolean;
  soft: boolean;
}[] = [
  {
    title: "Draw it flat",
    detail: "a rounded square on its base",
    depth: "none",
    lifted: false,
    iso: false,
    soft: false,
  },
  {
    title: "Duplicate it",
    detail: "10% black, shifted diagonally",
    depth: "copy",
    lifted: false,
    iso: false,
    soft: false,
  },
  {
    title: "Line up the corners",
    detail: "the copy becomes the side",
    depth: "solid",
    lifted: false,
    iso: false,
    soft: false,
  },
  {
    title: "Shadow the base and shift it",
    detail: "the part now floats above it",
    depth: "solid",
    lifted: true,
    iso: false,
    soft: false,
  },
  {
    title: "Set it at 30° isometric",
    detail: "with a plugin, no 3D software",
    depth: "solid",
    lifted: true,
    iso: true,
    soft: false,
  },
  {
    title: "Blur and fade what sits lower",
    detail: "70% opacity, like a shallow focus",
    depth: "solid",
    lifted: true,
    iso: true,
    soft: true,
  },
];
