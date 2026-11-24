<script lang="ts" module>
  import { iso, labels, local, packet, records, remote, server, slots, wires, type Point } from "./sync-drawing";

  const DURATION = 6000;
  const START = 0.08;
  const END = 0.86;

  const route: Point[] = [
    [55, 195, 8],
    [50, 172, 8],
    [50, 166, 0],
    [50, 86, 0],
    [50, 86, 52],
    [50, 50, 52],
    [86, 50, 52],
    [86, 50, 0],
    [166, 50, 0],
    [172, 50, 8],
    [195, 55, 8],
  ];
  const onScreen = route.map((point) => iso(point));
  const along = onScreen.reduce<number[]>((sums, [x, y], i) => {
    const [px, py] = onScreen[i - 1] ?? [x, y];
    sums.push((sums.at(-1) ?? 0) + Math.hypot(x - px, y - py));
    return sums;
  }, []);
  const total = along.at(-1) ?? 0;

  function pointAt(distance: number) {
    const i = Math.max(1, along.findIndex((sum) => sum >= distance));
    const [ax, ay] = onScreen[i - 1] ?? [0, 0];
    const [bx, by] = onScreen[i] ?? [ax, ay];
    const from = along[i - 1] ?? 0;
    const t = Math.min(1, (distance - from) / ((along[i] ?? from) - from || 1));
    return `translate(${ax + (bx - ax) * t}px, ${ay + (by - ay) * t}px)`;
  }

  const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

  function reach(distance: number) {
    let low = 0;
    let high = 1;
    for (let i = 0; i < 24; i++) {
      const mid = (low + high) / 2;
      if (ease(mid) * total < distance) low = mid;
      else high = mid;
    }
    return START + (END - START) * low;
  }

  const SAMPLES = 72;
  const journey: Keyframe[] = Array.from({ length: SAMPLES + 1 }, (_, i) => ({
    transform: pointAt(ease(i / SAMPLES) * total),
    opacity: 1,
    offset: START + ((END - START) * i) / SAMPLES,
  }));

  const at = {
    localWire: reach(along[2] ?? 0),
    localWireEnd: reach(along[3] ?? 0),
    server: reach(along[5] ?? 0),
    remoteWire: reach(along[7] ?? 0),
    remoteWireEnd: reach(along[8] ?? 0),
    remote: END,
  };
</script>

<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import type { Attachment } from "svelte/attachments";
  import Playback from "#lib/Playback.svelte";
  import { viz } from "#lib/styles/stepper.ts";
  import type { EmbedProps } from "#lib/embeds/props.ts";

  let { loop = true }: EmbedProps<"sync-live"> = $props();

  const timing = $derived<KeyframeAnimationOptions>({
    duration: DURATION,
    iterations: loop ? Infinity : 1,
    fill: "both",
    easing: "linear",
  });

  const animate =
    (keyframes: Keyframe[]): Attachment<Element> =>
    (element) => {
      const animation = element.animate(keyframes, timing);
      return () => animation.cancel();
    };

  const travel = animate([
    { transform: pointAt(0), opacity: 0, offset: 0 },
    ...journey,
    { transform: pointAt(total), opacity: 0, offset: 0.94 },
    { transform: pointAt(total), opacity: 0, offset: 1 },
  ]);

  const light = (from: number) =>
    animate([
      { opacity: 0, offset: 0 },
      { opacity: 0, offset: from },
      { opacity: 1, offset: Math.min(1, from + 0.04) },
      { opacity: 1, offset: loop ? 0.96 : 1 },
      ...(loop ? [{ opacity: 0, offset: 1 }] : []),
    ]);

  const glow = (from: number, to: number) =>
    animate([
      { opacity: 0, offset: 0 },
      { opacity: 0, offset: from },
      { opacity: 1, offset: from + 0.02 },
      { opacity: 1, offset: to },
      { opacity: 0, offset: Math.min(1, to + 0.06) },
      { opacity: 0, offset: 1 },
    ]);
</script>

<Playback title="Changes flow through the server" detail="this device → server → other device">
  <svg {...stylex.attrs(viz.svg)} viewBox="20 0 440 252" role="img" aria-label="A change flowing from this device through the server to the other device, again and again">
    <path {...stylex.attrs(viz.dashed)} d={wires.local} />
    <path {...stylex.attrs(viz.dashed)} d={wires.remote} />
    <path {@attach glow(at.localWire, at.localWireEnd)} {...stylex.attrs(viz.dashed, viz.glow)} d={wires.local} />
    <path {@attach glow(at.remoteWire, at.remoteWireEnd)} {...stylex.attrs(viz.dashed, viz.glow)} d={wires.remote} />

    {#each server as face, i (i)}<path {...stylex.attrs(viz.line)} d={face} />{/each}
    {#each slots as slot, i (i)}<path {...stylex.attrs(viz.line)} d={slot} />{/each}
    <path {...stylex.attrs(viz.line)} d={records.server} />
    <path {@attach light(at.server)} {...stylex.attrs(viz.line, viz.lit)} d={records.server} />

    {#each local as face, i (i)}<path {...stylex.attrs(viz.line)} d={face} />{/each}
    <path {...stylex.attrs(viz.line)} d={records.local} />
    <path {@attach light(0.04)} {...stylex.attrs(viz.line, viz.lit)} d={records.local} />

    {#each remote as face, i (i)}<path {...stylex.attrs(viz.line)} d={face} />{/each}
    <path {...stylex.attrs(viz.line)} d={records.remote} />
    <path {@attach light(at.remote)} {...stylex.attrs(viz.line, viz.lit)} d={records.remote} />

    <g {@attach travel} {...stylex.attrs(viz.lit)}>
      {#each packet as face, i (i)}<path d={face} />{/each}
    </g>

    {#each labels as label (label.text)}
      <text {...stylex.attrs(viz.label)} x={label.at[0]} y={label.at[1]}>{label.text}</text>
    {/each}
  </svg>
</Playback>
