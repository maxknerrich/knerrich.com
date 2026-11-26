<script lang="ts" module>
  import { prefersReducedMotion } from "svelte/motion";

  class Clock {
    elapsed = $state(0);
    started = $state(false);
    #end: () => number;
    #frame = 0;

    constructor(end: () => number) {
      this.#end = end;
    }

    run() {
      cancelAnimationFrame(this.#frame);
      this.started = true;
      if (prefersReducedMotion.current) {
        this.elapsed = this.#end();
        return;
      }
      this.elapsed = 0;
      const start = performance.now();
      const tick = (now: number) => {
        this.elapsed = Math.min(now - start, this.#end());
        if (this.elapsed < this.#end()) this.#frame = requestAnimationFrame(tick);
      };
      this.#frame = requestAnimationFrame(tick);
    }

    stop() {
      cancelAnimationFrame(this.#frame);
    }
  }

  const TITLES = ["Login fails on iOS", "Dark mode", "Export as CSV", "Slow search"];
  const RENAMED = "Dark mode in settings";
  const BARS = ["72%", "54%", "81%", "46%", "63%", "58%"];
  const LISTED = 6;
  const SPINNER_AFTER = 100;
</script>

<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import type { Attachment } from "svelte/attachments";
  import Icon from "#lib/icons/Icon.svelte";
  import { step as stepSound, warm } from "#lib/sound.svelte.ts";
  import { code } from "#lib/styles/code.ts";
  import { glass, screenReader, type } from "#lib/styles/shared.ts";
  import { stepper } from "#lib/styles/stepper.ts";
  import type { EmbedProps } from "./props";
  import { timing } from "./Timing.styles";

  let { title, series, rows, marker, caption }: EmbedProps<"timing"> = $props();
  const uid = $props.id();

  let selected = $state(0);
  let showTable = $state(false);
  const row = $derived(rows[selected] ?? rows[0]);
  const clock = new Clock(() => Math.max(...(row?.values ?? [0])));

  const ms = (value: number) =>
    value >= 1000
      ? `${(value / 1000).toFixed(2)} s`
      : `${value < 100 && !Number.isInteger(value) ? value.toFixed(1) : Math.round(value)} ms`;

  const startInView: Attachment<HTMLElement> = (element) => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        clock.run();
        observer.disconnect();
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      clock.stop();
    };
  };

  function choose(index: number) {
    warm();
    stepSound(index > selected);
    selected = index;
    showTable = false;
    clock.run();
  }

  function replay() {
    warm();
    stepSound(false);
    showTable = false;
    clock.run();
  }

  function toggle() {
    warm();
    stepSound(!showTable);
    showTable = !showTable;
  }
</script>

{#snippet window(name: string, value: number)}
  {@const done = clock.started && clock.elapsed >= value}
  {@const pending = clock.started && !done}
  {@const action = row?.action ?? "open"}
  {@const quick = marker !== undefined && value <= marker.value}
  <section {...stylex.attrs(timing.window)}>
    <header {...stylex.attrs(timing.head, type.caps)}>
      <Icon name="pixelLaptop" style={timing.headIcon} /><span {...stylex.attrs(timing.name)}>{name}</span>
      <span {...stylex.attrs(timing.timer, done && quick && timing.instant)}>{ms(Math.min(clock.elapsed, value))}</span>
    </header>
    <div {...stylex.attrs(timing.body)}>
      {#if action === "open"}
        {#if done}
          {#each Array.from({ length: Math.min(row?.issues ?? LISTED, LISTED) }, (_, i) => i) as i (i)}
            <div {...stylex.attrs(timing.issue, timing.shown)}>
              <span {...stylex.attrs(timing.number)}>#{i + 1}</span>
              <span {...stylex.attrs(timing.bar(BARS[i] ?? "60%"))}></span>
            </div>
          {/each}
          {#if (row?.issues ?? 0) > LISTED}
            <p {...stylex.attrs(timing.more, timing.shown)}>+ {(row?.issues ?? 0) - LISTED} more</p>
          {/if}
        {:else if clock.elapsed > SPINNER_AFTER}
          <div {...stylex.attrs(timing.loading, type.caps)}><span {...stylex.attrs(timing.spinner)}></span>Loading</div>
        {/if}
      {:else}
        {#if action === "create" && clock.started}
          <div {...stylex.attrs(timing.issue, done && timing.lit, timing.shown)}>
            <span {...stylex.attrs(timing.number)}>#{TITLES.length + 1}</span>
            <span {...stylex.attrs(timing.title)}>New issue</span>
            {#if pending && clock.elapsed > SPINNER_AFTER}<span {...stylex.attrs(timing.spinner, timing.small)}></span>{/if}
          </div>
        {/if}
        {#each TITLES as text, i (text)}
          {@const renamed = action === "update" && i === 1}
          <div {...stylex.attrs(timing.issue, renamed && done && timing.lit)}>
            <span {...stylex.attrs(timing.number)}>#{i + 1}</span>
            <span {...stylex.attrs(timing.title)}>{renamed && done ? RENAMED : text}</span>
            {#if renamed && pending && clock.elapsed > SPINNER_AFTER}<span {...stylex.attrs(timing.spinner, timing.small)}></span>{/if}
          </div>
        {/each}
      {/if}
    </div>
  </section>
{/snippet}

<figure aria-labelledby="{uid}-caption" {@attach startInView} {...stylex.attrs(stepper.figure)}>
  <div {...stylex.attrs(stepper.card, stepper.withControls, timing.canvas)}>
    <div {...stylex.attrs(stepper.controlPanel, timing.panel)} role="group" aria-label="Controls">
      <p {...stylex.attrs(type.caps, stepper.controlTitle, timing.panelTitle)}>Replay</p>
      {#each rows as option, i (option.label)}
        <button
          type="button"
          aria-pressed={i === selected}
          onclick={() => choose(i)}
          {...stylex.attrs(timing.choice, i === selected && timing.chosen, glass.focus)}
        >
          {option.label}
        </button>
      {/each}
    </div>
    <div {...stylex.attrs(timing.stage)}>
      <div {...stylex.attrs(timing.layer, !showTable && timing.ghost)}>
        <table {...stylex.attrs(timing.table)}>
          <caption {...stylex.attrs(screenReader.only)}>{title}</caption>
          <thead>
            <tr>
              <td {...stylex.attrs(timing.cell)}></td>
              {#each series as name (name)}
                <th scope="col" {...stylex.attrs(timing.cell, timing.numeric, type.caps)}>{name}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each rows as option (option.label)}
              <tr>
                <th scope="row" {...stylex.attrs(timing.cell)}>{option.label}</th>
                {#each option.values as value, s (s)}
                  <td {...stylex.attrs(timing.cell, timing.numeric, timing.strong)}>{ms(value)}</td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div {...stylex.attrs(timing.layer, timing.windows, showTable && timing.away)} aria-hidden="true">
        {#each series as name, s (name)}
          {@render window(name, row?.values[s] ?? 0)}
        {/each}
      </div>
    </div>
    <div {...stylex.attrs(timing.corner)}>
      <button
        type="button"
        aria-pressed={showTable}
        aria-label="Show the numbers as a table"
        title="Table"
        onclick={toggle}
        {...stylex.attrs(code.button, showTable && code.on, glass.focus)}
      >
        <Icon name="table" style={code.icon} />
      </button>
    </div>
  </div>
  <figcaption>
    <div id="{uid}-caption" {...stylex.attrs(stepper.caption)}>
      <p {...stylex.attrs(stepper.title)}>{title}</p>
      {#if caption}<span {...stylex.attrs(stepper.detail)}>{caption}</span>{/if}
    </div>
    <div {...stylex.attrs(stepper.controls, timing.centered)}>
      <div {...stylex.attrs(stepper.pager)}>
        <button type="button" {...stylex.attrs(stepper.button, glass.focus)} onclick={replay} aria-label="Replay at real speed">
          <Icon name="pixelReplay" style={stepper.icon} />
        </button>
      </div>
    </div>
  </figcaption>
</figure>
