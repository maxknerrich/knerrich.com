<script lang="ts" module>
  import * as stylex from "@stylexjs/stylex";
  import { color, counter, effect, font, media, motion, radius, reading, space, text } from "#lib/styles/tokens.stylex.ts";

  const DURATION = 15000;
  const SPAN = 300;
  const START = 0.03;
  const END = 0.9;
  const TRAVEL = 8;
  const READS_PER_EDIT = 83 / 20;
  const VISIBLE_LOG = 8;

  const offset = (time: number) => START + ((END - START) * Math.min(time, SPAN + TRAVEL * 2)) / SPAN;

  type Side = { writes: number[]; reads: number[] };

  function plan(editsPerMinute: number, syncSeconds: number) {
    const gap = 60 / editsPerMinute;
    const edits = Array.from({ length: Math.floor(SPAN / gap) }, (_, i) => (i + 1) * gap);
    const syncs = Array.from({ length: Math.floor(SPAN / syncSeconds) }, (_, i) => (i + 1) * syncSeconds);
    const syncFor = (time: number) => syncs.find((sync) => sync >= time);
    const clientServer: Side = {
      writes: edits,
      reads: edits.flatMap((time, i) => {
        const count = Math.floor((i + 1) * READS_PER_EDIT) - Math.floor(i * READS_PER_EDIT);
        return Array.from({ length: count }, (_, n) => time + TRAVEL + n * 1.5);
      }),
    };
    const localFirst: Side = {
      writes: syncs.filter((sync, i) => edits.some((time) => time <= sync && time > (syncs[i - 1] ?? 0))),
      reads: syncs.map((time) => time + TRAVEL),
    };
    const waiting = edits.flatMap((time) => {
      const sync = syncFor(time);
      if (sync === undefined || time >= sync) return [];
      const slot = edits.filter((other) => other <= time && syncFor(other) === sync).length - 1;
      return slot < VISIBLE_LOG ? [{ time, slot, sync }] : [];
    });
    return { edits, clientServer, localFirst, waiting };
  }

  const arrivals = ({ writes, reads }: Side) =>
    [...writes, ...reads].map((time) => time + TRAVEL).sort((a, b) => a - b);

  const lanes = stylex.create({
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gridTemplateRows: "auto 8rem auto",
      zoom: { default: 1, [media.phone]: 0.8 },
      columnGap: { default: space["--space-64"], [media.phone]: space["--space-16"] },
      paddingBlockStart: space["--space-48"],
      paddingBlockEnd: space["--space-32"],
      paddingInline: { default: space["--space-48"], [media.phone]: space["--space-16"] },
    },
    github: {
      gridColumnStart: "1",
      gridColumnEnd: "-1",
    },
    totals: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      columnGap: { default: space["--space-64"], [media.phone]: space["--space-16"] },
    },
    wire: {
      position: "relative",
      inlineSize: 1,
      marginInlineStart: space["--space-40"],
      backgroundColor: reading["--viz-stroke"],
    },
    packet: {
      position: "absolute",
      insetInlineStart: 0,
      inlineSize: "7px",
      blockSize: "7px",
      borderRadius: "50%",
      translate: "-50% -50%",
      opacity: 0,
    },
    write: {
      backgroundColor: color["--text"],
    },
    read: {
      backgroundColor: reading["--viz-stroke"],
    },
    batch: {
      inlineSize: "13px",
      blockSize: "13px",
      backgroundColor: color["--glow"],
      boxShadow: `0 0 10px ${color["--glow"]}`,
    },
    count: {
      counterReset: `requests ${counter["--count"]}`,
      fontFamily: font["--font-mono"],
      fontSize: text["--type-lead"],
      lineHeight: 1,
      whiteSpace: "nowrap",
      color: color["--text"],
      "::after": {
        content: "counter(requests)",
      },
    },
    log: {
      position: "relative",
      alignSelf: "center",
      blockSize: "1lh",
    },
    entry: (slot: number) => ({
      position: "absolute",
      insetBlockStart: "50%",
      insetInlineStart: `${slot * 12}px`,
      inlineSize: "7px",
      blockSize: "7px",
      translate: "0 -50%",
      borderRadius: radius["--radius-xs"],
      backgroundColor: color["--glow"],
      opacity: 0,
    }),
    icon: {
      display: { default: "block", [media.phone]: "none" },
      flexShrink: 0,
      inlineSize: "1.125rem",
      blockSize: "1.125rem",
    },
    setting: {
      position: "relative",
      isolation: "isolate",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: space["--space-16"],
      blockSize: "3rem",
      paddingInline: space["--space-16"],
      overflow: "hidden",
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: { default: color["--hairline"], ":hover": color["--text-dim"] },
      borderRadius: radius["--radius-card"],
      backgroundColor: color["--nav-hover"],
      boxShadow: { default: "none", ":focus-within": effect["--focus-glow"] },
      cursor: "ew-resize",
      transitionProperty: { default: "none", [media.motion]: "border-color, box-shadow" },
      transitionDuration: motion["--duration-base"],
    },
    fill: (share: string) => ({
      position: "absolute",
      insetBlock: 0,
      insetInlineStart: 0,
      inlineSize: share,
      zIndex: -1,
      backgroundColor: color["--hairline"],
    }),
    name: {
      fontSize: text["--type-small"],
      fontWeight: 500,
      color: color["--text-secondary"],
      pointerEvents: "none",
    },
    amount: {
      fontFamily: font["--font-mono"],
      fontSize: text["--type-small"],
      color: color["--text"],
      pointerEvents: "none",
    },
    range: {
      position: "absolute",
      inset: 0,
      inlineSize: "100%",
      blockSize: "100%",
      margin: 0,
      opacity: 0,
      cursor: "ew-resize",
    },
  });
</script>

<script lang="ts">
  import type { Attachment } from "svelte/attachments";
  import Icon from "#lib/icons/Icon.svelte";
  import Playback from "#lib/Playback.svelte";
  import { type } from "#lib/styles/shared.ts";
  import { board } from "#lib/styles/board.ts";

  let editsPerMinute = $state(4);
  let syncSeconds = $state(60);
  const scene = $derived(plan(editsPerMinute, syncSeconds));
  const total = (side: Side) => side.writes.length + side.reads.length;

  const COUNT = counter["--count"].replace(/^var\((--[^,)]+).*$/, "$1");

  const animate =
    (keyframes: Keyframe[]): Attachment<Element> =>
    (element) => {
      const animation = element.animate(keyframes, { duration: DURATION, iterations: Infinity, fill: "both" });
      return () => animation.cancel();
    };

  const travel = (time: number, up: boolean) => {
    const [from, to] = up ? ["100%", "0%"] : ["0%", "100%"];
    return animate([
      { top: from, opacity: 0, offset: 0 },
      { top: from, opacity: 0, offset: offset(time) },
      { top: from, opacity: 1, offset: offset(time) + 0.001, easing: "ease-in-out" },
      { top: to, opacity: 1, offset: offset(time + TRAVEL) },
      { top: to, opacity: 0, offset: offset(time + TRAVEL) + 0.001 },
      { top: to, opacity: 0, offset: 1 },
    ]);
  };

  const shown = (from: number, to: number) =>
    animate([
      { opacity: 0, offset: 0 },
      { opacity: 0, offset: offset(from) },
      { opacity: 1, offset: offset(from) + 0.002 },
      { opacity: 1, offset: offset(to) },
      { opacity: 0, offset: offset(to) + 0.002 },
      { opacity: 0, offset: 1 },
    ]);

  const counting = (times: number[]) =>
    animate([
      { [COUNT]: 0, offset: 0, easing: "step-end" },
      ...times.map((time, i) => ({ [COUNT]: i + 1, offset: offset(time), easing: "step-end" })),
      { [COUNT]: times.length, offset: 0.97, easing: "step-end" },
      { [COUNT]: 0, offset: 1 },
    ]);
</script>

{#snippet slider(name: string, value: number, min: number, max: number, step: number, shown: string, set: (value: number) => void, spoken?: string)}
  <label {...stylex.attrs(lanes.setting)}>
    <span {...stylex.attrs(lanes.fill(`${((value - min) / (max - min)) * 100}%`))}></span>
    <span {...stylex.attrs(lanes.name)}>{name}</span>
    <output aria-hidden="true" {...stylex.attrs(lanes.amount)}>{shown}</output>
    <input
      type="range"
      {min}
      {max}
      {step}
      {value}
      aria-label={name}
      aria-valuetext={spoken}
      oninput={(event) => set(Number(event.currentTarget.value))}
      {...stylex.attrs(lanes.range)}
    />
  </label>
{/snippet}

{#snippet wire(side: Side, batched: boolean)}
  <span {...stylex.attrs(lanes.wire)}>
    {#each side.writes as time (time)}
      <span {@attach travel(time, true)} {...stylex.attrs(lanes.packet, batched ? lanes.batch : lanes.write)}></span>
    {/each}
    {#each side.reads as time, i (i)}
      <span {@attach travel(time, false)} {...stylex.attrs(lanes.packet, lanes.read)}></span>
    {/each}
  </span>
{/snippet}

{#snippet app(name: string, batched: boolean)}
  <section {...stylex.attrs(board.panel)}>
    <header {...stylex.attrs(board.head, type.caps)}><Icon name="pixelLaptop" style={lanes.icon} />{name}</header>
    <div {...stylex.attrs(board.body)}>
      <div {...stylex.attrs(board.field)}>
        <span {...stylex.attrs(board.key)}>edits</span>
        <span {@attach counting(scene.edits)} {...stylex.attrs(lanes.count)}></span>
      </div>
      <div {...stylex.attrs(board.field)}>
        <span {...stylex.attrs(board.key)}>saved</span>
        <span {...stylex.attrs(lanes.log, board.value, !batched && board.empty)}>
          {#if batched}
            {#each scene.waiting as { time, slot, sync } (time)}
              <span {@attach shown(time, sync)} {...stylex.attrs(lanes.entry(slot))}></span>
            {/each}
          {:else}
            —
          {/if}
        </span>
      </div>
    </div>
  </section>
{/snippet}

<Playback
  title="The same edits, sent two ways"
  detail="five minutes of editing one issue, played in fifteen seconds"
>
  {#snippet controls()}
    {@render slider("Edits per minute", editsPerMinute, 1, 12, 1, String(editsPerMinute), (value) => (editsPerMinute = value))}
    {@render slider("Sync every", syncSeconds, 15, 150, 15, `${syncSeconds} s`, (value) => (syncSeconds = value), `${syncSeconds} seconds`)}
  {/snippet}
  {#key scene}
    <div
      {...stylex.attrs(lanes.grid)}
      role="img"
      aria-label="{scene.edits.length} edits to one issue over five minutes. The client-server app sends each edit to GitHub and fetches everything again after it: {total(scene.clientServer)} requests. The local-first app saves each edit on the device and sends them together every {syncSeconds} seconds: {total(scene.localFirst)} requests."
    >
      <section {...stylex.attrs(board.panel, lanes.github)}>
        <header {...stylex.attrs(board.head, type.caps)}><Icon name="pixelGithub" style={lanes.icon} />GitHub</header>
        <div {...stylex.attrs(lanes.totals)}>
          {#each [scene.clientServer, scene.localFirst] as side, i (i)}
            <div {...stylex.attrs(board.body)}>
              <div {...stylex.attrs(board.field)}>
                <span {...stylex.attrs(board.key)}>requests</span>
                <span {@attach counting(arrivals(side))} {...stylex.attrs(lanes.count)}></span>
              </div>
            </div>
          {/each}
        </div>
      </section>
      {@render wire(scene.clientServer, false)}
      {@render wire(scene.localFirst, true)}
      {@render app("Client-server", false)}
      {@render app("Local-first", true)}
    </div>
  {/key}
</Playback>
