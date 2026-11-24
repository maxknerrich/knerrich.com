<script lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import Icon from "#lib/icons/Icon.svelte";
  import { playInView } from "#lib/in-view.ts";
  import { step as stepSound, warm } from "#lib/sound.svelte.ts";
  import { glass, screenReader, type } from "#lib/styles/shared.ts";
  import { stepper } from "#lib/styles/stepper.ts";
  import { chart } from "./Chart.styles";
  import type { ChartValue, EmbedProps } from "./props";

  let { title, series, rows, unit, marker, caption }: EmbedProps<"chart"> = $props();

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
  const widest = $derived(
    rows.flatMap(({ values }) => values.map(show)).reduce((longest, text) => (text.length > longest.length ? text : longest), ""),
  );
  const changes = $derived(rows.map(({ values }) => change(values)));
  const hasChanges = $derived(changes.some((text) => text !== undefined));

  const scale = $derived.by(() => {
    const top = Math.max(...rows.flatMap(({ values }) => values.map((value) => ends(value)[1])), marker?.value ?? 0);
    const rough = top / 4;
    const power = 10 ** Math.floor(Math.log10(rough));
    const step = ([1, 2, 2.5, 5, 10].find((n) => n * power >= rough) ?? 10) * power;
    const end = Math.ceil(top / step) * step;
    return { end, ticks: Array.from({ length: Math.round(end / step) + 1 }, (_, i) => i * step) };
  });
  const at = (n: number) => `${(n / scale.end) * 100}%`;

  const isPoint = (index: number) => index === series.length - 1;

  let showTable = $state(false);

  function toggle() {
    warm();
    stepSound(!showTable);
    showTable = !showTable;
  }

  let active = $state<number>();
  let x = $state(0);
  let y = $state(0);
  let plot = $state<HTMLElement>();
  let tipWidth = $state(0);

  function follow(event: PointerEvent & { currentTarget: HTMLElement }, row: number) {
    if (!plot) return;
    active = row;
    const box = plot.getBoundingClientRect();
    const half = tipWidth / 2;
    x = Math.min(Math.max(event.clientX - box.left, half), box.width - half);
    y = event.currentTarget.offsetTop;
  }
</script>

<figure {@attach playInView} {...stylex.attrs(stepper.card)}>
  <div {...stylex.attrs(chart.stage)}>
    <div {...stylex.attrs(!showTable && screenReader.only)}>
      <table {...stylex.attrs(chart.table)}>
        <caption {...stylex.attrs(screenReader.only)}>{title}</caption>
        <thead>
          <tr>
            <td {...stylex.attrs(chart.cell)}></td>
            {#each series as name (name)}
              <th scope="col" {...stylex.attrs(chart.cell, chart.number, chart.head, type.caps)}>{name}</th>
            {/each}
            {#if hasChanges}
              <th scope="col" {...stylex.attrs(chart.cell, chart.number, chart.head, type.caps)}>Change</th>
            {/if}
          </tr>
        </thead>
        <tbody>
          {#each rows as row, r (row.label)}
            <tr>
              <th scope="row" {...stylex.attrs(chart.cell)}>{row.label}</th>
              {#each row.values as value, s (s)}
                <td {...stylex.attrs(chart.cell, chart.number, chart.strong)}>{show(value)}</td>
              {/each}
              {#if hasChanges}
                <td {...stylex.attrs(chart.cell, chart.number)}>{changes[r] ?? "–"}</td>
              {/if}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
    {#if !showTable}
      <div bind:this={plot} {...stylex.attrs(chart.plot, marker && chart.marked)} aria-hidden="true" onpointerleave={() => (active = undefined)}>
        {#each rows as row, r (row.label)}
          <div
            {...stylex.attrs(chart.row, chart.rowAt(String(r + 1)), active !== undefined && active !== r && chart.dimmed)}
            onpointermove={(event) => follow(event, r)}
          >
            <span {...stylex.attrs(type.caps, chart.rowLabel)}>{row.label}</span>
            <div {...stylex.attrs(chart.bars)}>
              {#each row.values as value, s (s)}
                {@const [low, high] = ends(value)}
                {@const delay = r * 120 + s * 60}
                <div {...stylex.attrs(chart.lane)}>
                  <span
                    {...stylex.attrs(
                      chart.bar,
                      typeof value === "number" ? chart.fromZero : chart.range,
                      isPoint(s) ? chart.point : chart.context,
                      chart.span(at(low), at(high - low)),
                      chart.delay(`${delay}ms`),
                    )}
                  ></span>
                  <span
                    {...stylex.attrs(chart.value, isPoint(s) ? chart.strong : chart.quiet, chart.at(at(high)), chart.delay(`${delay + 400}ms`))}
                    >{show(value)}</span
                  >
                </div>
              {/each}
            </div>
          </div>
        {/each}
        <span {...stylex.attrs(chart.room)}>{widest}</span>

        <div {...stylex.attrs(chart.grid, chart.rows(`span ${rows.length}`))}>
          {#each scale.ticks as tick (tick)}
            <span {...stylex.attrs(chart.gridline, chart.at(at(tick)))}></span>
          {/each}
          {#if marker}
            <span {...stylex.attrs(chart.marker, chart.at(at(marker.value)))}></span>
            <span {...stylex.attrs(type.caps, chart.markerLabel, chart.at(at(marker.value)))}>{marker.label}</span>
          {/if}
        </div>
        <div {...stylex.attrs(chart.axis, chart.rowAt(String(rows.length + 1)))}>
          {#each scale.ticks as tick, t (tick)}
            <span
              {...stylex.attrs(
                type.caps,
                chart.tick,
                t === 0 && chart.firstTick,
                t > 0 && t < scale.ticks.length - 1 && chart.innerTick,
                chart.at(at(tick)),
              )}>{t === scale.ticks.length - 1 ? withUnit(format.format(tick)) : format.format(tick)}</span
            >
          {/each}
        </div>

        {#if active !== undefined}
          {@const row = rows[active]}
          {@const difference = changes[active]}
          <div bind:offsetWidth={tipWidth} {...stylex.attrs(chart.tooltip, chart.place(`${x}px`, `${y}px`))}>
            <span {...stylex.attrs(type.caps, chart.quiet)}>{row?.label}</span>
            {#each row?.values ?? [] as value, s (s)}
              <span {...stylex.attrs(chart.reading)}>
                <span {...stylex.attrs(chart.line, isPoint(s) ? chart.linePoint : chart.lineContext)}></span>
                <span {...stylex.attrs(chart.strong)}>{show(value)}</span>
                {series[s]}
              </span>
            {/each}
            {#if difference}
              <span {...stylex.attrs(chart.change)}><span {...stylex.attrs(chart.strong)}>{difference}</span> change</span>
            {/if}
          </div>
        {/if}
      </div>
    {/if}
  </div>
  <figcaption>
    <div {...stylex.attrs(stepper.caption)}>
      <p {...stylex.attrs(stepper.title, type.caps)}>{title}</p>
      {#if caption}<span {...stylex.attrs(stepper.detail)}>{caption}</span>{/if}
    </div>
    <div {...stylex.attrs(stepper.controls)}>
      {#if series.length > 1}
        <ul {...stylex.attrs(chart.legend, type.caps)} aria-hidden="true">
          {#each series as name, index (name)}
            <li {...stylex.attrs(chart.key)}>
              <span {...stylex.attrs(chart.swatch, isPoint(index) ? chart.point : chart.context)}></span>{name}
            </li>
          {/each}
        </ul>
      {/if}
      <button type="button" {...stylex.attrs(stepper.button, chart.toggle, showTable && chart.pressed, glass.focus)} aria-pressed={showTable} onclick={toggle}>
        <Icon name="table" style={stepper.icon} />
        <span {...stylex.attrs(type.caps)}>Table</span>
      </button>
    </div>
  </figcaption>
</figure>
