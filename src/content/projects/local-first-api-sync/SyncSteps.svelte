<script lang="ts" module>
  import * as stylex from "@stylexjs/stylex";
  const moved = stylex.create({
    at: (x: number, y: number, shown: boolean) => ({
      transform: `translate(${x}px, ${y}px)`,
      opacity: shown ? 1 : 0,
    }),
  });
</script>

<script lang="ts">
  import Stepper from "#lib/Stepper.svelte";
  import { viz } from "#lib/styles/stepper.ts";
  import { iso, labels, local, packet, records, remote, server, slots, steps, wires } from "./sync-drawing";
  import type { EmbedProps } from "#lib/embeds/props.ts";

  let { id, autoplay = false }: EmbedProps<"sync-steps"> = $props();

  const placeOf = (index: number) => steps.slice(0, index + 1).findLast(({ change }) => change)?.change;
</script>

<Stepper {id} {steps} {autoplay}>
  {#snippet children(index)}
    {@const { lit, change } = steps[index] ?? steps[0]}
    {@const [x, y] = iso(placeOf(index) ?? [0, 0, 0])}
    <svg {...stylex.attrs(viz.svg)} viewBox="20 0 440 252" role="img" aria-label="A change travelling from this device through the server to the other device">
      <path {...stylex.attrs(viz.part, viz.dashed, lit.localWire && viz.glow)} d={wires.local} />
      <path {...stylex.attrs(viz.part, viz.dashed, lit.remoteWire && viz.glow)} d={wires.remote} />

      {#each server as face, i (i)}<path {...stylex.attrs(viz.line)} d={face} />{/each}
      {#each slots as slot, i (i)}<path {...stylex.attrs(viz.line)} d={slot} />{/each}
      <path {...stylex.attrs(viz.part, viz.line, lit.server && viz.lit)} d={records.server} />

      {#each local as face, i (i)}<path {...stylex.attrs(viz.line)} d={face} />{/each}
      <path {...stylex.attrs(viz.part, viz.line, lit.local && viz.lit)} d={records.local} />

      {#each remote as face, i (i)}<path {...stylex.attrs(viz.line)} d={face} />{/each}
      <path {...stylex.attrs(viz.part, viz.line, lit.remote && viz.lit)} d={records.remote} />

      <g {...stylex.attrs(viz.part, viz.lit, moved.at(x, y, change !== undefined))}>
        {#each packet as face, i (i)}<path d={face} />{/each}
      </g>

      {#each labels as label (label.text)}
        <text {...stylex.attrs(viz.label)} x={label.at[0]} y={label.at[1]}>{label.text}</text>
      {/each}
    </svg>
  {/snippet}
</Stepper>
