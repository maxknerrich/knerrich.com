export type Point = [x: number, y: number, z: number];
export const iso = ([x, y, z]: Point, cx = 240, cy = 64) =>
  [cx + (x - y) * 0.866, cy + (x + y) * 0.5 - z] as const;
const path = (points: Point[], cx?: number, cy?: number) =>
  `M${points
    .map((point) =>
      iso(point, cx, cy)
        .map((n) => n.toFixed(1))
        .join(" "),
    )
    .join("L")}Z`;

function box([x, y, z]: Point, w: number, d: number, h: number, cx?: number, cy?: number) {
  const t = z + h;
  return [
    path(
      [
        [x, y + d, z],
        [x + w, y + d, z],
        [x + w, y + d, t],
        [x, y + d, t],
      ],
      cx,
      cy,
    ),
    path(
      [
        [x + w, y, z],
        [x + w, y + d, z],
        [x + w, y + d, t],
        [x + w, y, t],
      ],
      cx,
      cy,
    ),
    path(
      [
        [x, y, t],
        [x + w, y, t],
        [x + w, y + d, t],
        [x, y + d, t],
      ],
      cx,
      cy,
    ),
  ];
}
const tile = ([x, y, z]: Point, w: number, d: number) =>
  path([
    [x, y, z],
    [x + w, y, z],
    [x + w, y + d, z],
    [x, y + d, z],
  ]);
const line = (from: Point, to: Point) => `M${iso(from).join(" ")}L${iso(to).join(" ")}`;

export const server = box([20, 20, 0], 60, 60, 52);
export const slots = [14, 28].flatMap((z) => [
  line([20, 80, z], [80, 80, z]),
  line([80, 20, z], [80, 80, z]),
]);
export const local = box([20, 170, 0], 70, 50, 8);
export const remote = box([170, 20, 0], 50, 70, 8);
export const records = {
  local: tile([32, 180, 8], 46, 30),
  server: tile([32, 32, 52], 36, 36),
  remote: tile([180, 32, 8], 30, 46),
};
export const wires = {
  local: line([50, 168, 0], [50, 82, 0]),
  remote: line([168, 50, 0], [82, 50, 0]),
};
export const packet = box([-6, -6, 0], 12, 12, 12, 0, 0);

const below = (corner: Point) => [iso(corner)[0], iso(corner)[1] + 22] as const;
export const labels = [
  { text: "This device", at: below([90, 220, 0]) },
  { text: "Server", at: [240, iso([20, 20, 52])[1] - 12] },
  { text: "Other device", at: below([220, 90, 0]) },
];

export const steps: {
  title: string;
  detail: string;
  lit: {
    local: boolean;
    server: boolean;
    remote: boolean;
    localWire: boolean;
    remoteWire: boolean;
  };
  change?: Point;
}[] = [
  {
    title: "A change is saved on this device",
    detail: "db.todos.put({ id: 7, done: true })",
    lit: { local: true, server: false, remote: false, localWire: false, remoteWire: false },
    change: [55, 195, 8],
  },
  {
    title: "It's queued and sent to the server",
    detail: "outbox.flush() → POST /sync",
    lit: { local: true, server: false, remote: false, localWire: true, remoteWire: false },
    change: [50, 125, 0],
  },
  {
    title: "The server merges it",
    detail: "merge(serverRow, change)",
    lit: { local: true, server: true, remote: false, localWire: false, remoteWire: false },
    change: [50, 50, 52],
  },
  {
    title: "The other device pulls it",
    detail: "GET /sync?since=41",
    lit: { local: true, server: true, remote: true, localWire: false, remoteWire: true },
    change: [195, 55, 8],
  },
  {
    title: "Both devices are in sync",
    detail: "local === server === remote",
    lit: { local: true, server: true, remote: true, localWire: true, remoteWire: true },
  },
];
