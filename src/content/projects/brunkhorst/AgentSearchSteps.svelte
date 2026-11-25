<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import Icon from "#lib/icons/Icon.svelte";
  import Stepper from "#lib/Stepper.svelte";
  import type { EmbedProps } from "#lib/embeds/props.ts";
  import { board } from "#lib/styles/board.ts";
  import { type } from "#lib/styles/shared.ts";
  import { actors, rows, steps } from "./agent-search";

  let { id, autoplay = false }: EmbedProps<"agent-search-steps"> = $props();
</script>

<Stepper {id} {steps} {autoplay}>
  {#snippet children(index)}
    {@const step = steps[index] ?? steps[0]}
    <div {...stylex.attrs(board.row)}>
      {#each actors as actor, a (actor.name)}
        {#if a > 0}
          {@const flowing = Math.min(step.from, step.to) === a - 1}
          <span {...stylex.attrs(board.link, flowing && board.flowing)} aria-hidden="true">
            <span {...stylex.attrs(board.end, board.from, flowing && board.endFlowing)}></span>
            <span {...stylex.attrs(board.end, board.to, flowing && board.endFlowing)}></span>
            {#if flowing}
              {#key index}<span {...stylex.attrs(board.packet, board.looping, step.to < step.from && board.backwards)}></span>{/key}
            {/if}
          </span>
        {/if}
        <section
          {...stylex.attrs(board.panel, step.from === a ? board.active : step.to !== a && board.idle)}
          aria-label={actor.name}
        >
          <header {...stylex.attrs(board.head, type.caps)}>
            <Icon name={actor.icon} style={board.icon} />{actor.name}
            {#if step.from === a}<span {...stylex.attrs(board.meta)}>{step.label}</span>{/if}
          </header>
          <div {...stylex.attrs(board.body)}>
            {#each rows.filter((row) => row.actor === a) as row (row.key)}
              <div {...stylex.attrs(board.field, row.step > index && board.gone, row.step === index && board.lit)}>
                <span {...stylex.attrs(board.key)}>{row.key}</span>
                <span {...stylex.attrs(board.value)}>{row.value}</span>
              </div>
            {/each}
          </div>
        </section>
      {/each}
    </div>
  {/snippet}
</Stepper>
