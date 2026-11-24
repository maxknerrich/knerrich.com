export type Path = { d: string; paint?: "fill" | "line" | "both" };
export type Mark = {
  box: readonly [number, number, number, number];
  paths: readonly Path[];
  line?: number;
  cut?: { margin: number; contour?: string };
};
export type Cut = { mark: Mark; margin: number; contour?: string };

const MARGIN = 0.1;
export const cutOf = (mark: Mark): Cut =>
  mark.cut ? { mark, ...mark.cut } : { mark, margin: Math.max(mark.box[2], mark.box[3]) * MARGIN };

export function boxOf({ mark, margin }: Cut): [number, number, number, number] {
  const [x, y, width, height] = mark.box;
  return [x - margin, y - margin, width + margin * 2, height + margin * 2];
}

function shapesOf({ paths, line = 0 }: Mark, widen: number, paint: string): string {
  return paths
    .map(({ d, paint: kind = "fill" }) => {
      const width = (kind === "fill" ? 0 : line) + widen;
      const fill = kind === "line" ? "none" : paint;
      const stroke = width > 0 ? ` stroke="${paint}" stroke-width="${width}"` : "";
      return `<path d="${d}" fill="${fill}"${stroke} stroke-linejoin="round" stroke-linecap="round"/>`;
    })
    .join("");
}

const made = new WeakMap<Mark, { border?: string; face?: string }>();

export function maskOf(cut: Cut, border: boolean): string {
  const masks = made.get(cut.mark) ?? {};
  made.set(cut.mark, masks);
  const key = border ? "border" : "face";
  const done = masks[key];
  if (done) return done;
  const shapes =
    border && cut.contour
      ? `<path d="${cut.contour}" fill="black"/>`
      : shapesOf(cut.mark, border ? cut.margin * 2 : 0, "black");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${boxOf(cut).join(" ")}" preserveAspectRatio="none">${shapes}</svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  return (masks[key] = url);
}
