<script lang="ts" module>
  const DURATION = 10000;

  const at = {
    writes: [
      [0.04, 0.12],
      [0.18, 0.26],
    ],
    pull: [0.36, 0.44],
    sync: [0.44, 0.52, 0.6, 0.68, 0.76],
    push: [0.68, 0.76],
    apply: [0.76, 0.84],
    cleared: 0.84,
    hold: 0.96,
  } as const;
</script>

<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import type { Attachment } from "svelte/attachments";
  import Icon from "#lib/icons/Icon.svelte";
  import type { IconName } from "#lib/icons/glyphs.ts";
  import Playback from "#lib/Playback.svelte";
  import { type } from "#lib/styles/shared.ts";
  import type { EmbedProps } from "#lib/embeds/props.ts";
  import { board } from "#lib/styles/board.ts";

  let { loop = true }: EmbedProps<"sync-live"> = $props();

  const animate =
    (keyframes: Keyframe[]): Attachment<Element> =>
    (element) => {
      const animation = element.animate(keyframes, {
        duration: DURATION,
        iterations: loop ? Infinity : 1,
        fill: "both",
        easing: "linear",
      });
      return () => animation.cancel();
    };

  const between = (from: number, to: number) =>
    animate([
      { opacity: 0, offset: 0 },
      { opacity: 0, offset: from },
      { opacity: 1, offset: from + 0.015 },
      { opacity: 1, offset: to },
      { opacity: 0, offset: Math.min(1, to + 0.02) },
      ...(to + 0.02 < 1 ? [{ opacity: 0, offset: 1 }] : []),
    ]);

  const travel = ([start, end]: readonly [number, number], backwards = false) => {
    const [from, to] = backwards ? ["100%", "0%"] : ["0%", "100%"];
    return animate([
      { left: from, top: from, opacity: 0, offset: 0 },
      { left: from, top: from, opacity: 0, offset: start },
      { left: from, top: from, opacity: 1, offset: start + 0.005, easing: "ease-in-out" },
      { left: to, top: to, opacity: 1, offset: end },
      { left: to, top: to, opacity: 0, offset: end + 0.005 },
      { left: to, top: to, opacity: 0, offset: 1 },
    ]);
  };

  const flowing = (windows: (readonly [number, number])[]) =>
    animate(
      [{ opacity: 0, offset: 0 }].concat(
        windows.flatMap(([start, end]) => [
          { opacity: 0, offset: start },
          { opacity: 1, offset: start + 0.005 },
          { opacity: 1, offset: end },
          { opacity: 0, offset: end + 0.01 },
        ]),
        [{ opacity: 0, offset: 1 }],
      ),
    );

  const app = ["update title", "update description"];
  const syncSteps = ["pull", "sort", "merge", "push"];
</script>

{#snippet head(icon: IconName, label: string, meta?: string)}
  <header {...stylex.attrs(board.head, type.caps)}>
    <Icon name={icon} style={board.icon} />{label}
    {#if meta}<span {...stylex.attrs(board.meta)}>{meta}</span>{/if}
  </header>
{/snippet}

{#snippet row(key: string, value: string, glow: Attachment<Element>)}
  <div {...stylex.attrs(board.field, board.stack)}>
    <span {@attach glow} {...stylex.attrs(board.glow)}></span>
    <span {...stylex.attrs(board.key)}>{key}</span>
    <span {...stylex.attrs(board.value)}>{value}</span>
  </div>
{/snippet}

{#snippet link(windows: (readonly [number, number])[], packets: Attachment<Element>[])}
  <span {...stylex.attrs(board.link)} aria-hidden="true">
    <span {@attach flowing(windows)} {...stylex.attrs(board.beam)}></span>
    <span {...stylex.attrs(board.end, board.from)}></span>
    <span {...stylex.attrs(board.end, board.to)}></span>
    {#each packets as packet, i (i)}<span {@attach packet} {...stylex.attrs(board.packet)}></span>{/each}
  </span>
{/snippet}

<Playback title="Every write is logged where it's saved" detail="then synced with the API in the background">
  <div
    {...stylex.attrs(board.row)}
    role="img"
    aria-label="The app writes to its own database, and each write is logged there too. The sync layer pulls from the API, sorts and merges the changes, pushes them, applies them to the database and clears the log, again and again"
  >
    <section {...stylex.attrs(board.panel)}>
      {@render head("pixelLaptop", "App")}
      <div {...stylex.attrs(board.body)}>
        {#each app as action, i (action)}
          {@render row(action.split(" ")[0] ?? "", action.split(" ")[1] ?? "", between(at.writes[i]?.[0] ?? 0, at.writes[i]?.[1] ?? 0))}
        {/each}
      </div>
    </section>
    {@render link([...at.writes], at.writes.map((window) => travel(window)))}
    <section {...stylex.attrs(board.panel)}>
      {@render head("pixelDatabase", "Database")}
      <div {...stylex.attrs(board.body)}>
        {@render row("table", "issues", between(at.writes[0][1], at.apply[1]))}
      </div>
      <p {...stylex.attrs(board.section, type.caps)}><Icon name="pixelList" style={board.icon} />Write-log</p>
      <div {...stylex.attrs(board.body)}>
        {#each at.writes as window, i (i)}
          {@render row(`#${i + 1}`, app[i]?.split(" ")[1] ?? "", between(window[1], at.cleared))}
        {/each}
      </div>
    </section>
    {@render link([at.pull, at.apply], [travel([at.pull[0], at.pull[1]]), travel(at.apply, true)])}
    <section {...stylex.attrs(board.panel)}>
      {@render head("pixelSync", "Sync layer")}
      <div {...stylex.attrs(board.body)}>
        {#each syncSteps as name, i (name)}
          {@render row(String(i + 1).padStart(2, "0"), name, between(at.sync[i] ?? 0, at.sync[i + 1] ?? 0))}
        {/each}
      </div>
    </section>
    {@render link([at.pull, at.push], [travel(at.pull, true), travel(at.push)])}
    <section {...stylex.attrs(board.panel)}>
      {@render head("pixelGithub", "GitHub API")}
      <div {...stylex.attrs(board.body)}>
        {@render row("GET", "/issues?since", between(at.pull[0] - 0.02, at.pull[1]))}
        {@render row("PATCH", "/issues/7", between(at.push[1], at.push[1] + 0.1))}
      </div>
    </section>
  </div>
</Playback>
