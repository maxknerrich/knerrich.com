<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import Icon from "#lib/icons/Icon.svelte";
  import { playInView } from "#lib/in-view.ts";
  import { step as stepSound, warm } from "#lib/sound.svelte.ts";
  import { board } from "#lib/styles/board.ts";
  import { code } from "#lib/styles/code.ts";
  import { glass, screenReader, type } from "#lib/styles/shared.ts";
  import { stepper } from "#lib/styles/stepper.ts";
  import { chart } from "./Chart.styles";
  import type { ChartValue, EmbedProps } from "./props";
  import { timing } from "./Timing.styles";

  let { title, series, rows, unit, caption }: EmbedProps<"chart"> = $props();

  const format = new Intl.NumberFormat("en", { maximumFractionDigits: 1 });
  const withUnit = (text: string) => (unit ? `${text} ${unit}` : text);
  const ends = (value: ChartValue): readonly [number, number] =>
    typeof value === "number" ? [0, value] : value;
  const show = (value: ChartValue) => {
    const [low, high] = ends(value);
    const text = typeof value === "number" || low === high ? format.format(high) : `${format.format(low)}–${format.format(high)}`;
    return withUnit(text);
  };

  const change = (values: readonly ChartValue[]) => {
    const [from, to] = values;
    if (values.length !== 2 || typeof from !== "number" || typeof to !== "number" || from === 0) return undefined;
    const percent = ((to - from) / from) * 100;
    const size = Math.abs(percent);
    return `${percent < 0 ? "−" : "+"}${size.toFixed(size >= 99 && size < 100 ? 1 : 0)}%`;
  };
  const changes = $derived(rows.map(({ values }) => change(values)));
  const hasChanges = $derived(changes.some((text) => text !== undefined));

  const end = $derived(Math.max(...rows.flatMap(({ values }) => values.map((value) => ends(value)[1]))));
  const at = (n: number) => `${(n / end) * 100}%`;
  const isPoint = (index: number) => index === series.length - 1;

  let showTable = $state(false);

  function toggle() {
    warm();
    stepSound(!showTable);
    showTable = !showTable;
  }
</script>

<figure {@attach playInView} {...stylex.attrs(stepper.figure)}>
  <div {...stylex.attrs(stepper.card, timing.canvas)}>
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
              {#if hasChanges}
                <th scope="col" {...stylex.attrs(timing.cell, timing.numeric, type.caps)}>Change</th>
              {/if}
            </tr>
          </thead>
          <tbody>
            {#each rows as row, r (row.label)}
              <tr>
                <th scope="row" {...stylex.attrs(timing.cell)}>{row.label}</th>
                {#each row.values as value, s (s)}
                  <td {...stylex.attrs(timing.cell, timing.numeric, timing.strong)}>{show(value)}</td>
                {/each}
                {#if hasChanges}
                  <td {...stylex.attrs(timing.cell, timing.numeric)}>{changes[r] ?? "–"}</td>
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
      <div {...stylex.attrs(timing.layer, chart.panels(series.length), showTable && timing.away)} aria-hidden="true">
        {#each series as name, s (name)}
          <section {...stylex.attrs(board.panel, isPoint(s) && board.active)}>
            <header {...stylex.attrs(board.head, type.caps)}><Icon name="pixelSpeed" style={board.icon} />{name}</header>
            <div {...stylex.attrs(board.body, chart.body)}>
              {#each rows as row, r (row.label)}
                {@const value = row.values[s] ?? 0}
                {@const [low, high] = ends(value)}
                <div {...stylex.attrs(board.field, chart.row)}>
                  <span {...stylex.attrs(board.key)}>{row.label}</span>
                  <span {...stylex.attrs(chart.track)}>
                    <span
                      {...stylex.attrs(
                        chart.bar,
                        isPoint(s) ? chart.point : chart.context,
                        chart.span(at(low), at(high - low), `${r * 120 + s * 60}ms`),
                      )}
                    ></span>
                  </span>
                  <span {...stylex.attrs(board.value, !isPoint(s) && chart.quiet)}>{show(value)}</span>
                </div>
              {/each}
            </div>
          </section>
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
    <div {...stylex.attrs(stepper.caption)}>
      <p {...stylex.attrs(stepper.title)}>{title}</p>
      {#if caption}<span {...stylex.attrs(stepper.detail)}>{caption}</span>{/if}
    </div>
  </figcaption>
</figure>
