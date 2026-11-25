<script module lang="ts">
  import { claudeCodeArt, operaHouseArt, type Art } from "#lib/stickers/art.ts";
  import { boxOf as cutBox, cutOf, maskOf, type Mark } from "#lib/stickers/cut.ts";
  import * as marks from "#lib/stickers/marks.ts";
  import { palette, query, stack, sticker as p, stickerMotion, timing } from "#lib/styles/tokens.stylex.ts";

  type Em = [x: number, y: number];
  type Pin = { pin: string; rotate: number; wide: Em; phone: Em };
  type Spot = Pin | { zone: "writing" };
  const CHAPTERS = [
    ["home", "Home base"],
    ["work", "Where I've worked"],
    ["tools", "Tools I build with"],
    ["craft", "Building with agents"],
  ] as const;
  type Chapter = (typeof CHAPTERS)[number][0];
  type Sticker = {
    label: string;
    chapter: Chapter;
    mark: Mark;
    badge?: "holo" | "chrome";
    ink?: string;
    colourFile?: string;
    art?: Art;
    at?: Spot;
  };

  const STICKERS: readonly Sticker[] = [
    {
      label: "Knerrich",
      chapter: "home",
      mark: marks.symbol,
      badge: "chrome",
      ink: palette.stickerGraphite,
      at: { pin: "[data-pin=place]", rotate: -8, wide: [4, -8], phone: [2.1, -2.5] },
    },
    {
      label: "Sydney Opera House",
      chapter: "home",
      mark: marks.operaHouse,
      art: operaHouseArt,
      ink: p["--opera-sail"],
      at: { pin: "[data-pin=place]", rotate: 6, wide: [9.443, 0.4781], phone: [8.264, 0.5246] },
    },
    {
      label: "Porsche 911",
      chapter: "work",
      mark: marks.porsche911,
      colourFile: "/stickers/porsche-911.svg",
      at: { pin: "[data-pin=place]", rotate: 8, wide: [27, -4.5], phone: [20.7, -2.5] },
    },
    {
      label: "Porsche",
      chapter: "work",
      mark: marks.porsche,
      colourFile: "/stickers/porsche.svg",
      at: { pin: "#about-heading", rotate: -6, wide: [6.1698, 0.6319], phone: [5.2135, 0.6527] },
    },
    {
      label: "Claude Code",
      chapter: "craft",
      mark: marks.claudeCode,
      art: claudeCodeArt,
      ink: p["--brand-claude"],
      at: { zone: "writing" },
    },
    { label: "Figma", chapter: "tools", mark: marks.figma, colourFile: "/stickers/figma.svg" },
    { label: "TypeScript", chapter: "tools", mark: marks.typescript, colourFile: "/stickers/typescript.svg" },
    { label: "Svelte", chapter: "tools", mark: marks.svelte, colourFile: "/stickers/svelte.svg" },
    { label: "Nix", chapter: "tools", mark: marks.nixos, colourFile: "/stickers/nixos.svg" },
    { label: "Effect", chapter: "tools", mark: marks.effect, ink: p["--sticker-ink"] },
    { label: "Docker", chapter: "tools", mark: marks.docker, ink: p["--brand-docker"] },
    {
      label: "Local-first software",
      chapter: "tools",
      mark: marks.localFirst,
      ink: p["--sticker-ink"],
      at: { pin: "[data-pin=place]", rotate: 10, wide: [18, -10], phone: [14.6, -2.5] },
    },
    {
      label: "OpenAI",
      chapter: "craft",
      mark: marks.openai,
      badge: "holo",
      ink: p["--sticker-ink"],
      at: { zone: "writing" },
    },
    { label: "React", chapter: "tools", mark: marks.react, ink: p["--brand-react"] },
    { label: "Next.js", chapter: "tools", mark: marks.nextjs, ink: p["--sticker-ink"] },
    { label: "LW Works", chapter: "work", mark: marks.lwWorks, ink: p["--sticker-ink"] },
    { label: "HdM Stuttgart", chapter: "work", mark: marks.hdm, colourFile: "/stickers/hdm.svg" },
  ];

  const LONG_PER_ASPECT = 0.1;
  const LONG_MAX = 1.2;

  function frameOf({ badge, mark }: Sticker) {
    const size = p["--sticker-size"];
    if (badge) return { width: `calc(${size} * ${p["--sticker-round"]})`, aspect: 1 };
    const [, , w, h] = cutBox(cutOf(mark));
    const long = Math.min(LONG_MAX, 1 + LONG_PER_ASPECT * (Math.max(w / h, h / w) - 1));
    return { width: `calc(${size} * ${Math.sqrt(w / h) * long})`, aspect: w / h };
  }
</script>

<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { tick } from "svelte";
  import { prefersReducedMotion } from "svelte/motion";
  import { MediaQuery } from "svelte/reactivity";
  import Icon from "#lib/icons/Icon.svelte";
  import LogoMark from "#lib/logos/Mark.svelte";
  import {
    FLAT,
    along,
    fold,
    foldedShare,
    normalAt,
    placed,
    type Fold,
    type Outline,
    type Vec,
  } from "#lib/stickers/fold.ts";
  import { onView } from "#lib/in-view.ts";
  import { drop as dropSound, peel, stick, warm } from "#lib/sound.svelte.ts";
  import { reveal } from "#lib/styles/shared.ts";
  import { stickers } from "#lib/Stickers.styles.ts";

  const uid = $props.id();

  type Phase = "flat" | "peeling" | "carried";
  type Placed = Sticker & {
    phase: Phase;
    x: number;
    y: number;
    rotate: number;
    tilt: number;
    outline: Outline;
    band: number;
    origin: Vec;
    z: number;
    fold: Fold;
    light: Vec;
    settling: boolean;
    placed: boolean;
    moved: boolean;
    offset: Vec;
    inBook: boolean;
    unfit: boolean;
    fall: number | undefined;
    seen: boolean;
  };
  type Kept = {
    book?: string[];
    moved?: Record<string, [x: number, y: number, rotate: number]>;
  };

  const sheens = { holo: "holoSheen", chrome: "chromeSheen" } as const;
  const KEPT = "stickers:page";

  const RELEASE = 0.85;
  const MIN_PULL = 1;
  const FLING = 260;
  const AIM = 6;
  const CARRIED = 0.2;
  const STILL = 0.15;
  const TILT_PER_SPEED = 9;
  const TILT_MAX = 14;
  const TURN_PER_WHEEL = 0.15;
  const EASE = { duration: timing.slowMs, easing: stickerMotion.ease };
  const LINE_PX = 16;
  const NEAR = 120;
  const FALL_AFTER = 1300;
  const FALL_STAGGER = 120;
  const FALL_ON_SCROLL = 500;

  let mounted = $state(false);
  let layer = $state<HTMLElement>();
  let drawer = $state<HTMLElement>();
  let open = $state(false);
  let near = $state(false);
  let peeking = $state(false);
  let cover = $state<HTMLElement>();
  let dragging = $state(false);
  let items = $state<Placed[]>([]);
  let kept: Kept = {};
  let top = STICKERS.length;
  const coarse = new MediaQuery("(pointer: coarse)");
  let peeling: ReturnType<typeof peel> | undefined;
  const lifting = $derived(items.some((item) => item.phase !== "flat"));
  const carrying = $derived(items.some((item) => item.phase === "carried"));

  let held:
    | {
        item: Placed;
        fromBook: boolean;
        aiming: boolean;
        pointer: number;
        grab: Vec;
        normal: Vec;
        clientX: number;
        clientY: number;
        time: number;
      }
    | undefined;
  let stillTimer: ReturnType<typeof setTimeout> | undefined;

  const elements = new Map<Placed, HTMLElement>();
  const owners = new Map<Element, Placed>();
  let sizes: ResizeObserver | undefined;

  let layerRect: DOMRect | undefined;
  const layerBox = () => (layerRect ??= layer?.getBoundingClientRect() ?? new DOMRect());

  const random = (min: number, max: number) => min + Math.random() * (max - min);
  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const turn = (v: Vec, degrees: number): Vec => {
    const a = radians(degrees);
    return { x: v.x * Math.cos(a) - v.y * Math.sin(a), y: v.x * Math.sin(a) + v.y * Math.cos(a) };
  };
  const scaleOf = (item: Placed) => (item.phase === "carried" && !prefersReducedMotion.current ? stickerMotion.lift : 1);
  const wheelPx = (event: WheelEvent, page: number) => [1, LINE_PX, page][event.deltaMode] ?? 1;
  const centreOrigin = (item: Placed) => (item.origin = { x: item.outline.width / 2, y: item.outline.height / 2 });
  const largestFirst = (a: Placed, b: Placed) =>
    b.outline.width * b.outline.height - a.outline.width * a.outline.height;

  function fresh(s: Sticker, index: number): Placed {
    const left = kept.moved?.[s.label];
    const inBook = kept.book?.includes(s.label) ?? (!left && !s.at);
    return {
      ...s,
      phase: "flat",
      x: 0,
      y: 0,
      rotate: inBook ? 0 : (left?.[2] ?? (s.at && "pin" in s.at ? s.at.rotate : random(-12, 12))),
      tilt: 0,
      outline: { width: 0, height: 0, radius: 0 },
      band: 0,
      origin: { x: 0, y: 0 },
      z: index + 1,
      fold: FLAT,
      light: { x: 50, y: 50 },
      settling: false,
      placed: false,
      moved: !!left,
      offset: { x: 0, y: 0 },
      inBook,
      unfit: false,
      fall: undefined,
      seen: false,
    };
  }

  $effect(() => {
    try {
      kept = JSON.parse(localStorage.getItem(KEPT) ?? "{}");
    } catch {
    }
    items = STICKERS.map(fresh);

    sizes = new ResizeObserver((entries) => {
      for (const { target } of entries) {
        const item = owners.get(target);
        if (item?.placed) measure(item);
      }
    });
    mounted = true;
    const resized = () => {
      layerRect = undefined;
      for (const item of items) if (!item.moved && item.phase === "flat") place(item);
    };
    const page = new ResizeObserver(resized);
    void tick()
      .then(() => document.fonts.ready)
      .then(() => {
        scatter();
        fallIn();
        if (layer) page.observe(layer);
      });

    const scrolled = () => {
      layerRect = undefined;
      if (held) pointerAt(held.clientX, held.clientY);
    };
    const blurred = () => held && letGo(held.item);
    const wheeled = (event: WheelEvent) => {
      if (!held || held.item.phase === "flat" || event.ctrlKey) return;
      event.preventDefault();
      if (held.item.phase !== "carried") return;
      held.item.rotate += event.deltaY * wheelPx(event, innerHeight) * TURN_PER_WHEEL;
    };
    addEventListener("resize", resized);
    addEventListener("scroll", scrolled, { passive: true });
    addEventListener("blur", blurred);
    addEventListener("wheel", wheeled, { passive: false });
    return () => {
      removeEventListener("resize", resized);
      removeEventListener("scroll", scrolled);
      removeEventListener("blur", blurred);
      removeEventListener("wheel", wheeled);
      sizes?.disconnect();
      page.disconnect();
      clearTimeout(stillTimer);
    };
  });

  const mount = (item: Placed) => (node: HTMLElement) => {
    elements.set(item, node);
    owners.set(node, item);
    sizes?.observe(node);
    return () => {
      if (elements.get(item) === node) elements.delete(item);
      owners.delete(node);
      sizes?.unobserve(node);
    };
  };

  function sideways(node: HTMLElement) {
    let target = node.scrollLeft;
    let frame = 0;
    const end = () => node.scrollWidth - node.clientWidth;
    const glide = () => {
      const gap = target - node.scrollLeft;
      if (Math.abs(gap) < 1) {
        node.scrollLeft = target;
        frame = 0;
        return;
      }
      node.scrollLeft += Math.sign(gap) * Math.max(1, Math.abs(gap) * 0.2);
      frame = requestAnimationFrame(glide);
    };
    const glideTo = (left: number) => {
      target = clamp(left, 0, end());
      if (prefersReducedMotion.current) node.scrollLeft = target;
      else frame ||= requestAnimationFrame(glide);
    };
    const halt = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      target = node.scrollLeft;
    };

    let drag: { pointer: number; x: number; left: number; speed: number; time: number; last: number } | undefined;
    const down = (event: PointerEvent) => {
      if (event.pointerType === "touch" || event.button !== 0) return;
      if (event.target instanceof Element && event.target.closest("[data-grab]")) return;
      halt();
      drag = {
        pointer: event.pointerId,
        x: event.clientX,
        left: node.scrollLeft,
        speed: 0,
        time: event.timeStamp,
        last: event.clientX,
      };
      node.setPointerCapture(event.pointerId);
      dragging = true;
    };
    const moved = (event: PointerEvent) => {
      if (drag?.pointer !== event.pointerId) return;
      node.scrollLeft = drag.left - (event.clientX - drag.x);
      const elapsed = event.timeStamp - drag.time;
      if (elapsed > 0) drag.speed = (event.clientX - drag.last) / elapsed;
      drag.time = event.timeStamp;
      drag.last = event.clientX;
    };
    const up = (event: PointerEvent) => {
      if (drag?.pointer !== event.pointerId) return;
      const still = event.timeStamp - drag.time > 80;
      if (!still) glideTo(node.scrollLeft - drag.speed * FLING);
      else target = node.scrollLeft;
      drag = undefined;
      dragging = false;
    };
    const wheeled = (event: WheelEvent) => {
      if (held || event.ctrlKey) return;
      event.preventDefault();
      if (!frame) target = node.scrollLeft;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      glideTo(target + delta * wheelPx(event, node.clientWidth));
    };
    node.addEventListener("wheel", wheeled, { passive: false });
    node.addEventListener("pointerdown", down);
    node.addEventListener("pointermove", moved);
    node.addEventListener("lostpointercapture", up);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("wheel", wheeled);
      node.removeEventListener("pointerdown", down);
      node.removeEventListener("pointermove", moved);
      node.removeEventListener("lostpointercapture", up);
    };
  }

  function save() {
    const width = layer?.clientWidth || 1;
    const moved = items.filter((item) => item.moved && !item.inBook);
    kept = {
      book: items.filter((item) => item.inBook && !item.unfit).map((item) => item.label),
      moved: Object.fromEntries(
        moved.map((item) => {
          const centre = centreOf(item);
          return [item.label, [centre.x / width, centre.y, item.rotate]];
        }),
      ),
    };
    try {
      localStorage.setItem(KEPT, JSON.stringify(kept));
    } catch {
    }
  }

  function reset() {
    if (held) return;
    kept = {};
    items = STICKERS.map(fresh);
    void tick().then(() => {
      scatter();
      save();
    });
  }

  function centreOf(item: Placed): Vec {
    const { width, height } = item.outline;
    const toCentre = turn({ x: width / 2 - item.origin.x, y: height / 2 - item.origin.y }, item.rotate + item.tilt);
    return { x: item.x + item.origin.x + toCentre.x, y: item.y + item.origin.y + toCentre.y };
  }

  function holdTouch(node: Element) {
    const stop = (event: Event) => event.preventDefault();
    node.addEventListener("touchstart", stop, { passive: false });
    return () => node.removeEventListener("touchstart", stop);
  }

  type Box = { x: number; y: number; width: number; height: number };
  const overlaps = (a: Box, b: Box) =>
    a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

  function toLayer(r: DOMRect): Box {
    const origin = layerBox();
    return { x: r.left - origin.left, y: r.top - origin.top, width: r.width, height: r.height };
  }
  function atRest(box: Box, el: Element): Box {
    let { x, y } = box;
    for (let node: Element | null = el; node && node !== document.body; node = node.parentElement) {
      const [dx, dy] = getComputedStyle(node).translate.split(" ").map(parseFloat);
      x -= dx || 0;
      y -= dy || 0;
    }
    return { ...box, x, y };
  }
  const boxOf = (el: Element) => atRest(toLayer(el.getBoundingClientRect()), el);

  function measure(item: Placed) {
    const el = elements.get(item);
    if (!el) return;
    const before = item.outline;
    const width = el.offsetWidth;
    const height = el.offsetHeight;
    const shorter = Math.min(width, height);
    item.outline = { width, height, radius: item.badge ? shorter / 2 : shorter * 0.15 };
    item.band = Math.min(shorter * 0.2, 24);
    if (!item.placed || (width === before.width && height === before.height)) return;

    const stretch = (p: Vec) => ({ x: (p.x * width) / before.width, y: (p.y * height) / before.height });
    const origin = stretch(item.origin);
    item.x += item.origin.x - origin.x;
    item.y += item.origin.y - origin.y;
    item.origin = origin;
    if (held?.item === item) {
      held.grab = stretch(held.grab);
      held.normal = normalAt(item.outline, held.grab);
      if (item.phase === "carried") {
        item.fold = along(item.outline, item.fold.u, CARRIED);
        pivotAt(item, placed(item.fold, held.grab));
      }
      pointerAt(held.clientX, held.clientY);
    } else if (!item.moved && item.phase === "flat") place(item);
  }

  const mainOf = () => layer?.closest("main");

  function textOf(el: Element): Box {
    const range = document.createRange();
    range.selectNodeContents(el);
    return atRest(toLayer(range.getBoundingClientRect()), el);
  }

  const textIn = (el: Element | null | undefined) =>
    el
      ? [...[...el.querySelectorAll("h1, h2, h3, p")].map(textOf), ...[...el.querySelectorAll("a, li, button")].map(boxOf)]
      : [];

  function spotOf({ pin, wide, phone }: Pin): Vec | undefined {
    const anchor = mainOf()?.querySelector(pin);
    if (!anchor) return;
    const box = boxOf(anchor);
    const em = parseFloat(getComputedStyle(anchor).fontSize);
    const [x, y] = matchMedia(query.phone).matches ? phone : wide;
    return { x: box.x + x * em, y: box.y + y * em };
  }

  function zoneOf(zone: string): Box | undefined {
    const main = mainOf();
    const section = main?.querySelector(`#${zone}`);
    if (!main || !section) return;
    const page = boxOf(main);
    const box = boxOf(section);
    return { x: page.x, y: box.y, width: page.width, height: box.height };
  }

  function place(item: Placed) {
    if (item.inBook || !item.at) return false;
    const { width, height } = item.outline;
    centreOrigin(item);
    let spot: Vec | undefined;
    if ("pin" in item.at) {
      const centre = spotOf(item.at);
      spot = centre && { x: centre.x - width / 2, y: centre.y - height / 2 };
    } else {
      const zone = zoneOf(item.at.zone);
      spot = zone && { x: zone.x + item.offset.x, y: zone.y + item.offset.y };
    }
    if (!spot) return false;
    const kept = onPage(item, spot.x, spot.y);
    item.x = kept.x;
    item.y = kept.y;
    return true;
  }

  function scatter() {
    if (!layer) return;
    layerRect = undefined;
    const taken: Box[] = [];
    for (const item of items) {
      measure(item);
      centreOrigin(item);
      const { width, height } = item.outline;
      const left = kept.moved?.[item.label];
      if (item.inBook) item.placed = true;
      else if (item.moved && left) {
        const spot = onPage(item, left[0] * layer.clientWidth - width / 2, left[1] - height / 2);
        item.x = spot.x;
        item.y = spot.y;
        item.placed = true;
      } else if (item.at && "pin" in item.at) item.placed = place(item);
      if (item.placed && !item.inBook) taken.push({ x: item.x, y: item.y, width, height });
    }

    for (const item of items.toSorted(largestFirst)) {
      if (item.placed || !item.at || !("zone" in item.at)) continue;
      const zone = zoneOf(item.at.zone);
      const section = mainOf()?.querySelector(`#${item.at.zone}`);
      if (!zone || !section) continue;
      const spot = freeSpot(item.outline, zone, [...taken, ...textIn(section)], 1 / 3);
      if (!spot) continue;
      taken.push(spot);
      item.offset = {
        x: spot.x + (spot.width - item.outline.width) / 2 - zone.x,
        y: spot.y + (spot.height - item.outline.height) / 2 - zone.y,
      };
      item.placed = place(item);
    }
    for (const item of items)
      if (!item.placed) {
        item.inBook = true;
        item.unfit = true;
        item.placed = true;
      }
  }

  function fallIn() {
    if (!layer) return;
    const { top } = layer.getBoundingClientRect();
    const onPage = items.filter((item) => !item.inBook);
    for (const item of onPage) item.fall = FALL_ON_SCROLL;
    const onScreen = onPage
      .filter((item) => top + item.y < innerHeight)
      .toSorted((a, b) => a.y - b.y || a.x - b.x);
    for (const [index, item] of onScreen.entries()) item.fall = FALL_AFTER + index * FALL_STAGGER;
  }

  function freeSpot({ width, height }: Outline, zone: Box, avoid: Box[], hang = 0) {
    const pad = Math.max(width, height) * 0.12;
    for (let attempt = 0; attempt < 1000; attempt++) {
      const box = {
        x: random(zone.x - width * hang, zone.x + zone.width - width * (1 - hang)) - pad,
        y: random(zone.y - height * hang, zone.y + zone.height - height * (1 - hang)) - pad,
        width: width + pad * 2,
        height: height + pad * 2,
      };
      if (!avoid.some((t) => overlaps(box, t))) return box;
    }
  }

  function onPage(item: Placed, x: number, y: number): Vec {
    if (!layer) return { x, y };
    const angle = item.rotate + item.tilt;
    const scale = scaleOf(item);
    const half = { x: item.outline.width / 2, y: item.outline.height / 2 };
    const toCentre = turn({ x: (half.x - item.origin.x) * scale, y: (half.y - item.origin.y) * scale }, angle);
    const shift = { x: item.origin.x + toCentre.x, y: item.origin.y + toCentre.y };
    const cos = Math.abs(Math.cos(radians(angle)));
    const sin = Math.abs(Math.sin(radians(angle)));
    const extent = {
      x: (half.x * cos + half.y * sin) * scale,
      y: (half.x * sin + half.y * cos) * scale,
    };
    return {
      x: clamp(x + shift.x, extent.x, layer.clientWidth - extent.x) - shift.x,
      y: clamp(y + shift.y, extent.y, layer.clientHeight - extent.y) - shift.y,
    };
  }

  function easeFrom(item: Placed, offset: Vec, duration: number = EASE.duration) {
    if (prefersReducedMotion.current || (!offset.x && !offset.y)) return;
    elements
      .get(item)
      ?.animate([{ translate: `${offset.x}px ${offset.y}px` }, { translate: "0px 0px" }], {
        ...EASE,
        duration,
        composite: "add",
      });
  }

  function middleOf(item: Placed): Vec | undefined {
    const r = elements.get(item)?.getBoundingClientRect();
    return r && { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  async function moveAll(toBook: boolean) {
    if (held || !layer) return;
    const moving = items.filter((item) => item.inBook !== toBook);
    if (!moving.length) return;
    const from = new Map(moving.map((item) => [item, middleOf(item)]));
    for (const item of items) item.unfit = false;
    if (toBook) for (const item of moving) stow(item, false);
    else strew(moving);
    await tick();
    for (const item of moving) {
      const a = from.get(item);
      const b = middleOf(item);
      if (a && b) easeFrom(item, { x: a.x - b.x, y: a.y - b.y }, 480);
    }
    stick();
    save();
  }

  function strew(moving: Placed[]) {
    if (!layer) return;
    layerRect = undefined;
    const origin = layerBox();
    const edge = 16;
    const bottom = (open && drawer ? drawer.getBoundingClientRect().top : innerHeight) - origin.top - edge;
    const top = -origin.top + edge;
    const screen = { x: edge, y: top, width: layer.clientWidth - edge * 2, height: Math.max(0, bottom - top) };
    const text = textIn(mainOf()).filter((box) => overlaps(box, screen));
    const taken: Box[] = items
      .filter((item) => !item.inBook)
      .map((item) => {
        const centre = centreOf(item);
        const { width, height } = item.outline;
        return { x: centre.x - width / 2, y: centre.y - height / 2, width, height };
      });
    for (const item of moving.toSorted(largestFirst)) {
      const { width, height } = item.outline;
      const spot = freeSpot(item.outline, screen, [...taken, ...text]) ??
        freeSpot(item.outline, screen, taken) ?? {
          x: random(screen.x, screen.x + Math.max(0, screen.width - width)),
          y: random(screen.y, screen.y + Math.max(0, screen.height - height)),
          width,
          height,
        };
      taken.push(spot);
      item.inBook = false;
      item.moved = true;
      item.rotate = random(-12, 12);
      centreOrigin(item);
      item.x = spot.x + (spot.width - width) / 2;
      item.y = spot.y + (spot.height - height) / 2;
      item.settling = !prefersReducedMotion.current;
    }
  }

  function toLocal(item: Placed, clientX: number, clientY: number): Vec {
    const origin = layerBox();
    const scale = scaleOf(item);
    const local = turn(
      {
        x: clientX - origin.left - item.x - item.origin.x,
        y: clientY - origin.top - item.y - item.origin.y,
      },
      -(item.rotate + item.tilt),
    );
    return { x: item.origin.x + local.x / scale, y: item.origin.y + local.y / scale };
  }

  function pivotAt(item: Placed, point: Vec) {
    const delta = { x: item.origin.x - point.x, y: item.origin.y - point.y };
    const turned = turn(delta, item.rotate + item.tilt);
    const scale = scaleOf(item);
    item.x += delta.x - turned.x * scale;
    item.y += delta.y - turned.y * scale;
    item.origin = point;
  }

  function pointerAt(clientX: number, clientY: number) {
    if (!held) return;
    const { item } = held;
    if (item.phase === "peeling") {
      const pointer = toLocal(item, clientX, clientY);
      if (held.aiming) {
        const pull = { x: pointer.x - held.grab.x, y: pointer.y - held.grab.y };
        const length = Math.hypot(pull.x, pull.y);
        if (length < AIM) return;
        held.normal = { x: -pull.x / length, y: -pull.y / length };
        held.aiming = false;
      }
      item.fold = fold(item.outline, held.grab, held.normal, pointer);
      const shorter = Math.min(item.outline.width, item.outline.height);
      if (item.fold.pull >= MIN_PULL * shorter && foldedShare(item.outline, item.fold) >= RELEASE)
        comeOff(item);
      return;
    }
    const origin = layerBox();
    item.x = clientX - origin.left - item.origin.x;
    item.y = clientY - origin.top - item.origin.y;
    item.moved = true;
    approach(clientX, clientY);
  }

  function comeOff(item: Placed) {
    if (!held) return;
    const tip = placed(item.fold, held.grab);
    const carried = along(item.outline, item.fold.u, CARRIED);
    const anchor = placed(carried, held.grab);
    pivotAt(item, anchor);
    item.fold = carried;
    item.phase = "carried";
    item.z = ++top;
    peeling?.stop(0.15);
    peeling = undefined;
    pointerAt(held.clientX, held.clientY);
    const gap = turn({ x: tip.x - anchor.x, y: tip.y - anchor.y }, item.rotate + item.tilt);
    easeFrom(item, { x: -gap.x, y: -gap.y });
  }

  function drop(item: Placed) {
    item.phase = "flat";
    item.fold = { ...item.fold, peel: 0 };
    item.tilt = 0;
    item.settling = !prefersReducedMotion.current;
    const spot = onPage(item, item.x, item.y);
    easeFrom(item, { x: item.x - spot.x, y: item.y - spot.y });
    item.x = spot.x;
    item.y = spot.y;
    item.moved = true;
    stick();
  }

  function stow(item: Placed, pat: boolean) {
    item.phase = "flat";
    item.fold = FLAT;
    item.tilt = 0;
    item.rotate = 0;
    item.x = 0;
    item.y = 0;
    centreOrigin(item);
    item.moved = false;
    item.inBook = true;
    item.settling = pat && !prefersReducedMotion.current;
    if (pat) stick();
  }

  function overBook(clientX: number, clientY: number) {
    const boxes = [open ? drawer : undefined, cover].map((el) => el?.getBoundingClientRect());
    return boxes.some((r) => !!r && clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom);
  }

  function approach(clientX: number, clientY: number) {
    const r = cover?.getBoundingClientRect();
    near = !open && !!r && Math.hypot(clientX - (r.left + r.width / 2), clientY - (r.top + r.height / 2)) <= NEAR;
  }

  function putAway(item: Placed) {
    const el = elements.get(item);
    const from = middleOf(item);
    const to = cover?.getBoundingClientRect();
    const done = (into: "page" | "folder") => {
      near = false;
      item.unfit = false;
      stow(item, into === "page");
      if (into === "folder") dropSound();
      save();
    };
    if (open || !el || !from || !to) return done("page");
    if (prefersReducedMotion.current) return done("folder");
    const options = { duration: 220, easing: "ease-in" };
    const offset = `${to.left + to.width / 2 - from.x}px ${to.top + to.height / 2 - from.y}px`;
    el.animate([{ translate: "0px 0px" }, { translate: offset }], { ...options, composite: "add" });
    el.animate([{ scale: "1", opacity: 1 }, { scale: "0.15", opacity: 0 }], options)
      .finished.then(() => done("folder"))
      .catch(() => done("folder"));
  }

  async function grab(event: PointerEvent, item: Placed) {
    if (event.button !== 0 || event.ctrlKey || held || item.phase !== "flat") return;
    item.fall = undefined;
    const fromBook = item.inBook;
    if (fromBook) {
      const slot = elements.get(item);
      if (!slot) return;
      const at = toLayer(slot.getBoundingClientRect());
      item.inBook = false;
      item.rotate = 0;
      item.x = at.x;
      item.y = at.y;
      item.z = ++top;
      await tick();
    }
    const el = elements.get(item);
    if (!el || held) return;
    try {
      el.setPointerCapture(event.pointerId);
    } catch {
      if (fromBook) stow(item, false);
      return;
    }
    const point = toLocal(item, event.clientX, event.clientY);
    pivotAt(item, point);
    held = {
      item,
      fromBook,
      aiming: event.pointerType === "touch",
      pointer: event.pointerId,
      grab: point,
      normal: normalAt(item.outline, point),
      clientX: event.clientX,
      clientY: event.clientY,
      time: event.timeStamp,
    };
    item.phase = "peeling";
    item.z = ++top;
    item.settling = false;
    item.tilt = 0;
    item.fold = fold(item.outline, point, held.normal, point);
    peeling = peel();
  }

  function move(event: PointerEvent, item: Placed) {
    if (!prefersReducedMotion.current && !item.inBook) {
      const p = toLocal(item, event.clientX, event.clientY);
      item.light = {
        x: clamp((p.x / item.outline.width) * 100, 0, 100),
        y: clamp((p.y / item.outline.height) * 100, 0, 100),
      };
    }
    if (held?.item !== item || held.pointer !== event.pointerId) return;
    const sideways = event.clientX - held.clientX;
    const down = event.clientY - held.clientY;
    const elapsed = event.timeStamp - held.time;
    if (!sideways && !down) return;
    held.clientX = event.clientX;
    held.clientY = event.clientY;
    held.time = event.timeStamp;
    if (item.phase === "peeling" && elapsed > 0)
      peeling?.speed(Math.hypot(sideways, down) / elapsed);
    pointerAt(event.clientX, event.clientY);
    if (item.phase !== "carried" || prefersReducedMotion.current) return;
    const speed = elapsed > 0 ? sideways / elapsed : 0;
    item.tilt = Math.abs(speed) < STILL ? 0 : clamp(speed * TILT_PER_SPEED, -TILT_MAX, TILT_MAX);
    clearTimeout(stillTimer);
    stillTimer = setTimeout(() => (item.tilt = 0), 80);
  }

  function letGo(item: Placed) {
    if (held?.item !== item) return;
    const { clientX, clientY, fromBook } = held;
    held = undefined;
    clearTimeout(stillTimer);
    peeling?.stop();
    peeling = undefined;
    if (item.phase === "carried") {
      if (near || overBook(clientX, clientY)) putAway(item);
      else {
        drop(item);
        save();
      }
    } else if (item.phase === "peeling") {
      item.phase = "flat";
      item.fold = { ...item.fold, peel: 0 };
      if (fromBook) stow(item, false);
    }
  }
</script>

{#snippet parts(list: Art["layers"][number]["parts"])}
  {#each list as { d, paint, width }, index (index)}
    <path {d} stroke-width={width} {...stylex.attrs(paint)} />
  {/each}
{/snippet}

{#snippet drawing(art: Art, [x, y, w, h]: readonly number[], key: string)}
  <svg viewBox="{x} {y} {w} {h}" {...art.attributes} aria-hidden="true" {...stylex.attrs(stickers.cutArt)}>
    {#each art.layers as layer, index (index)}
      {#if layer.hiddenBy}
        <mask id="{key}-{index}" maskUnits="userSpaceOnUse" {x} {y} width={w} height={h}>
          <rect {x} {y} width={w} height={h} fill="white" />
          {#each layer.hiddenBy as front, at (at)}
            <path d={front} fill="black" />
          {/each}
        </mask>
        <g mask="url(#{key}-{index})">{@render parts(layer.parts)}</g>
      {:else}
        {@render parts(layer.parts)}
      {/if}
    {/each}
  </svg>
{/snippet}

{#snippet sticker(item: Placed)}
    {@const frame = frameOf(item)}
    {@const { u, min, angle, offset, peel } = item.fold}
    {@const { width, height, radius } = item.outline}
    <div
      {@attach mount(item)}
      {@attach item.fall !== undefined && onView(() => (item.seen = true))}
      onpointermove={(event) => move(event, item)}
      onlostpointercapture={() => letGo(item)}
      onanimationend={() => (item.settling = false)}
    onpointerenter={warm}
      {...stylex.attrs(
        stickers.sticker,
        stickers.frame(frame.width, frame.aspect),
        item.phase === "peeling" && stickers.tracking,
        item.phase !== "flat" && stickers.held,
        !item.placed && stickers.measuring,
        item.phase === "carried" && stickers.lifted,
        item.settling && stickers.settle,
        item.fall !== undefined && [stickers.fall, reveal.delay(`${item.fall}ms`), item.seen && stickers.falling],
        stickers.place(
          item.x,
          item.y,
          item.rotate + item.tilt,
          item.origin.x,
          item.origin.y,
          item.phase === "flat" ? item.z : item.z + stack.held,
        ),
        stickers.fold(u.x, u.y, min, angle, offset, peel),
        stickers.light(item.light.x, item.light.y),
      )}
    >
      {#if item.badge}
        <span {...stylex.attrs(stickers.body, stickers.round)}>
          <span
            {...stylex.attrs(
              stickers.face,
              stickers.round,
              item.ink !== undefined && stickers.ink(item.ink),
              stickers[item.badge],
            )}
          >
            <LogoMark mark={item.mark} {...stylex.attrs(stickers.badgeMark)} />
            <span {...stylex.attrs(stickers.sheen, stickers[sheens[item.badge]])}></span>
          </span>
        </span>
        <span {...stylex.attrs(stickers.flapShadow)}>
          <span {...stylex.attrs(stickers.flap, stickers.round)}>
            <span {...stylex.attrs(stickers.flapPaper)}></span>
          </span>
        </span>
        <svg {...stylex.attrs(stickers.ringSvg)}>
          <rect
            {@attach holdTouch}
            x={item.band / 2}
            y={item.band / 2}
            width={Math.max(width - item.band, 0)}
            height={Math.max(height - item.band, 0)}
            rx={Math.max(radius - item.band / 2, 0)}
            stroke-width={item.band}
            pointer-events={coarse.current ? "all" : "stroke"}
            data-grab
            onpointerdown={(event) => grab(event, item)}
            {...stylex.attrs(stickers.ring, item.phase !== "flat" && stickers.held)}
          />
        </svg>
      {:else}
        {@const cut = cutOf(item.mark)}
        {@const box = cutBox(cut)}
        {@const band = (item.band * box[2]) / Math.max(width, 1)}
        {@const line = cut.mark.line ?? 0}
        <span {...stylex.attrs(stickers.body, stickers.cutBody)}>
          <span {...stylex.attrs(stickers.cutPaper, stickers.mask(maskOf(cut, true)))}></span>
          <span
            {...stylex.attrs(
              stickers.face,
              stickers.cutFace,
              item.ink !== undefined && stickers.fill(item.ink),
              !item.colourFile && stickers.mask(maskOf(cut, false)),
            )}
          >
            {#if item.art}
              {@render drawing(item.art, box, `${uid}-${STICKERS.findIndex(({ label }) => label === item.label)}`)}
            {:else if item.colourFile}
              {@const [x, y, w, h] = cut.mark.box}
              <img
                src={item.colourFile}
                alt=""
                draggable="false"
                {...stylex.attrs(
                  stickers.cutColour(
                    ((x - box[0]) / box[2]) * 100,
                    ((y - box[1]) / box[3]) * 100,
                    (w / box[2]) * 100,
                    (h / box[3]) * 100,
                  ),
                )}
              />
            {/if}
          </span>
        </span>
        <span {...stylex.attrs(stickers.flapShadow)}>
          <span {...stylex.attrs(stickers.flap)}>
            <span {...stylex.attrs(stickers.flapPaper, stickers.mask(maskOf(cut, true)))}></span>
          </span>
        </span>
        <svg viewBox={box.join(" ")} preserveAspectRatio="none" {...stylex.attrs(stickers.ringSvg)}>
          {#each cut.contour ? [{ d: cut.contour, paint: "fill" as const }] : cut.mark.paths as { d, paint = "fill" }, index (index)}
            <path
              {@attach holdTouch}
              {d}
              stroke-width={(paint === "fill" ? 0 : line) + cut.margin * 2 + band}
              stroke-linejoin="round"
              stroke-linecap="round"
              pointer-events={coarse.current ? "all" : "stroke"}
              data-grab
              onpointerdown={(event) => grab(event, item)}
              {...stylex.attrs(stickers.ring, item.phase !== "flat" && stickers.held)}
            />
          {/each}
        </svg>
        {#if !coarse.current}
          <svg viewBox={box.join(" ")} preserveAspectRatio="none" {...stylex.attrs(stickers.inertSvg)}>
            {#each cut.mark.paths as { d, paint = "fill" }, index (index)}
              <path
                {d}
                stroke-width={paint === "fill" ? 0 : line}
                pointer-events={paint === "line" ? "stroke" : "all"}
                {...stylex.attrs(stickers.inert)}
              />
            {/each}
          </svg>
        {/if}
      {/if}
    </div>
{/snippet}

{#if mounted}
  <div bind:this={layer} aria-hidden="true" data-stickers {...stylex.attrs(stickers.layer, lifting && stickers.lifting)}>
    {#each items as item (item.label)}
      {#if !item.inBook}
        {@render sticker(item)}
      {/if}
    {/each}

    <button
      type="button"
      aria-hidden="true"
      tabindex="-1"
      title="Sticker book"
      onclick={() => (open = !open)}
      onpointerenter={(event) => {
        warm();
        peeking = event.pointerType === "mouse";
      }}
      onpointerleave={() => (peeking = false)}
      bind:this={cover}
      {...stylex.attrs(stickers.cover, carrying && stickers.coverReady, near && stickers.coverNear, open && stickers.coverOpen)}
    >
      <span {...stylex.attrs(stickers.coverInside)}></span>
      <span {...stylex.attrs(stickers.coverFront, (near || peeking) && stickers.coverFrontOpen)}>
        <span {...stylex.attrs(stickers.coverSticker)}>
          <LogoMark mark={marks.symbol} {...stylex.attrs(stickers.coverMark)} />
        </span>
      </span>
    </button>

    <div
      bind:this={drawer}
      aria-hidden="true"
      inert={!open}
      {...stylex.attrs(stickers.book, open && stickers.bookOpen)}
    >
      <header {...stylex.attrs(stickers.bookHead)}>
        <span {...stylex.attrs(stickers.bookCount)}>
          {items.filter((item) => item.inBook).length}/{items.length}
        </span>
        <span {...stylex.attrs(stickers.bookActions)}>
          <button type="button" tabindex="-1" onclick={() => moveAll(false)} {...stylex.attrs(stickers.bookAction)}>
            All on page
          </button>
          <button type="button" tabindex="-1" onclick={() => moveAll(true)} {...stylex.attrs(stickers.bookAction)}>
            All in book
          </button>
          <button type="button" tabindex="-1" onclick={reset} {...stylex.attrs(stickers.bookAction)}>Reset</button>
        </span>
        <button
          type="button"
          tabindex="-1"
          title="Close"
          onclick={() => (open = false)}
          {...stylex.attrs(stickers.bookAction, stickers.bookIconAction)}
        >
          <Icon name="cross" style={stickers.bookIcon} />
        </button>
      </header>
      <div {@attach sideways} {...stylex.attrs(stickers.shelf, dragging && stickers.shelfDragging)}>
        {#each CHAPTERS as [chapter, title] (chapter)}
          <section {...stylex.attrs(stickers.chapter)}>
            <h2 {...stylex.attrs(stickers.chapterTitle)}>{title}</h2>
            <ul {...stylex.attrs(stickers.chapterRow)}>
              {#each items.filter((item) => item.chapter === chapter) as item (item.label)}
              {@const frame = frameOf(item)}
              <li {...stylex.attrs(stickers.slot)}>
                <span {...stylex.attrs(stickers.slotFrame, stickers.frame(frame.width, frame.aspect))}>
                  {#if item.inBook}
                    {@render sticker(item)}
                  {:else if item.badge}
                    <span {...stylex.attrs(stickers.slotEdge)}></span>
                  {:else}
                    <svg {...stylex.attrs(stickers.slotOutline)}>
                      <image href={maskOf(cutOf(item.mark), true)} width="100%" height="100%" preserveAspectRatio="none" filter="url(#sticker-outline)" />
                    </svg>
                  {/if}
                </span>
                <span {...stylex.attrs(stickers.slotLabel)}>{item.label}</span>
              </li>
              {/each}
            </ul>
          </section>
        {/each}
      </div>
      <svg width="0" height="0" {...stylex.attrs(stickers.defs)}>
        <filter id="sticker-outline">
          <feMorphology in="SourceAlpha" operator="erode" radius="1.25" result="inner" />
          <feComposite in="SourceAlpha" in2="inner" operator="out" result="ring" />
          <feFlood flood-color="currentColor" />
          <feComposite in2="ring" operator="in" />
        </filter>
      </svg>
    </div>
  </div>
{/if}

