export type Vec = { x: number; y: number };
export type Outline = { width: number; height: number; radius: number };

export type Fold = {
  u: Vec;
  min: number;
  depth: number;
  peel: number;
  offset: number;
  angle: number;
  pull: number;
};

export const FLAT: Fold = {
  u: { x: 1, y: 0 },
  min: 0,
  depth: 0,
  peel: 0,
  offset: 0,
  angle: 90,
  pull: 0,
};

const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y;
const turn = (v: Vec, radians: number): Vec => ({
  x: v.x * Math.cos(radians) - v.y * Math.sin(radians),
  y: v.x * Math.sin(radians) + v.y * Math.cos(radians),
});
const offInward = (degrees: number) => Math.cos((degrees * Math.PI) / 180);
const PULL_LIFTS_NOTHING = offInward(120);
const PULL_LIFTS_FULLY = offInward(100);
const smoothstep = (from: number, to: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - from) / (to - from)));
  return t * t * (3 - 2 * t);
};

const half = (o: Outline, u: Vec) =>
  Math.abs(u.x) * (o.width / 2 - o.radius) + Math.abs(u.y) * (o.height / 2 - o.radius) + o.radius;
const start = (o: Outline, u: Vec) => (o.width / 2) * u.x + (o.height / 2) * u.y - half(o, u);
const behind = (o: Outline, u: Vec, p: Vec) => dot(p, u) - start(o, u);

export function normalAt(o: Outline, p: Vec): Vec {
  const cx = o.width / 2;
  const cy = o.height / 2;
  const qx = Math.abs(p.x - cx) - (cx - o.radius);
  const qy = Math.abs(p.y - cy) - (cy - o.radius);
  const sx = Math.sign(p.x - cx) || 1;
  const sy = Math.sign(p.y - cy) || 1;
  if (qx > 0 && qy > 0) {
    const length = Math.hypot(qx, qy);
    return { x: (sx * qx) / length, y: (sy * qy) / length };
  }
  return qx > qy ? { x: sx, y: 0 } : { x: 0, y: sy };
}

export function fold(o: Outline, grab: Vec, normal: Vec, pointer: Vec): Fold {
  const inward = { x: -normal.x, y: -normal.y };
  const pull = { x: pointer.x - grab.x, y: pointer.y - grab.y };
  const length = Math.hypot(pull.x, pull.y);
  const toward = length > 0 ? { x: pull.x / length, y: pull.y / length } : inward;

  const full = Math.atan2(inward.x * toward.y - inward.y * toward.x, dot(inward, toward));
  const angle = Math.min(Math.PI / 2, Math.max(-Math.PI / 2, full));
  const allowed = liftedAt(o, inward, grab) + length / Math.min(o.width, o.height);
  const fits = (t: number) => liftedAt(o, turn(inward, angle * t), grab) <= allowed;
  let reach = 0;
  if (fits(1)) reach = 1;
  else
    for (let i = 0, over = 1; i < 12; i++) {
      const mid = (reach + over) / 2;
      if (fits(mid)) reach = mid;
      else over = mid;
    }
  const u = turn(inward, angle * reach);
  const flat = along(o, u, 0);

  const into = smoothstep(PULL_LIFTS_NOTHING, PULL_LIFTS_FULLY, dot(toward, inward));
  const travel = Math.max(dot(pull, u), 0);
  const grabbed = behind(o, inward, grab);
  const settle = grabbed > 0 ? Math.min(1, length / (2 * grabbed)) : 1;
  const peel = into * (travel / 2 + behind(o, u, grab) * settle);
  return { ...flat, peel: Math.min(flat.depth, Math.max(0, peel)), pull: length };
}

export function along(o: Outline, u: Vec, share: number): Fold {
  const depth = 2 * half(o, u);
  return {
    u,
    min: start(o, u),
    depth,
    peel: share * depth,
    offset: o.radius * (Math.abs(u.x) + Math.abs(u.y) - 1),
    angle: (Math.atan2(u.x, -u.y) * 180) / Math.PI,
    pull: 0,
  };
}

function mirrored(f: Fold, p: Vec): Vec {
  const past = dot(p, f.u) - (f.min + f.peel);
  return { x: p.x - 2 * past * f.u.x, y: p.y - 2 * past * f.u.y };
}

export function placed(f: Fold, p: Vec): Vec {
  return dot(p, f.u) < f.min + f.peel ? mirrored(f, p) : p;
}

const inside = (o: Outline, p: Vec) => {
  const qx = Math.max(Math.abs(p.x - o.width / 2) - (o.width / 2 - o.radius), 0);
  const qy = Math.max(Math.abs(p.y - o.height / 2) - (o.height / 2 - o.radius), 0);
  return Math.hypot(qx, qy) <= o.radius;
};

const grids = new WeakMap<Outline, Vec[]>();
function grid(o: Outline): Vec[] {
  let points = grids.get(o);
  if (points) return points;
  const steps = 48;
  points = [];
  for (let i = 0; i < steps; i++)
    for (let j = 0; j < steps; j++) {
      const p = { x: ((i + 0.5) / steps) * o.width, y: ((j + 0.5) / steps) * o.height };
      if (inside(o, p)) points.push(p);
    }
  grids.set(o, points);
  return points;
}

function shareBefore(o: Outline, u: Vec, line: number): number {
  const points = grid(o);
  let over = 0;
  for (const p of points) if (dot(p, u) < line) over++;
  return points.length ? over / points.length : 0;
}

const liftedAt = (o: Outline, u: Vec, p: Vec) => shareBefore(o, u, dot(p, u));

export const foldedShare = (o: Outline, f: Fold) => shareBefore(o, f.u, f.min + f.peel);
