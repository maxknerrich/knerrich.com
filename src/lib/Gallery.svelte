<script module lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { on } from "svelte/events";
  import { gallery as styles } from "#lib/Gallery.styles.ts";

  type Slide = {
    sources: { srcset: string; type: string }[];
    sizes: string;
    src: string;
    alt: string;
    caption: string;
  };

  const SELECTOR = "figure > picture > img, figure > img";
  const openerClasses = (stylex.props(styles.opener).className ?? "").split(" ").filter(Boolean);

  function slideOf(img: HTMLImageElement): Slide {
    const sources = [...(img.parentElement?.querySelectorAll("source") ?? [])].map((source) => ({
      srcset: source.srcset,
      type: source.type,
    }));
    const caption = img.closest("figure")?.querySelector("figcaption")?.textContent?.trim();
    const width = Number(img.getAttribute("width"));
    const sizes = width > 0 ? `(max-width: ${width}px) 100vw, ${width}px` : "100vw";
    return { sources, sizes, src: img.currentSrc || img.src, alt: img.alt, caption: caption || img.alt };
  }

  export class Gallery {
    slides = $state<Slide[]>([]);
    index = $state(0);
    dialog = $state<HTMLDialogElement>();

    get slide() {
      return this.slides[this.index];
    }
    get several() {
      return this.slides.length > 1;
    }

    step(by: number) {
      this.index = (this.index + by + this.slides.length) % this.slides.length;
    }

    attach = (root: HTMLElement) => {
      const openers = [...root.querySelectorAll<HTMLImageElement>(SELECTOR)].filter((img) => !img.closest("[data-embed]"));
      for (const img of openers) {
        img.role = "button";
        img.tabIndex = 0;
        img.ariaHasPopup = "dialog";
        img.ariaLabel = `Open image: ${img.alt}`;
        img.classList.add(...openerClasses);
      }
      const open = (target: EventTarget | null) => {
        const at = openers.findIndex((img) => img === target);
        if (at === -1) return false;
        this.slides = openers.map(slideOf);
        this.index = at;
        this.dialog?.showModal();
        return true;
      };
      const stops = [
        on(root, "click", (event) => open(event.target)),
        on(root, "keydown", (event) => {
          if ((event.key === "Enter" || event.key === " ") && open(event.target)) event.preventDefault();
        }),
      ];
      return () => stops.forEach((stop) => stop());
    };
  }
</script>

<script lang="ts">
  import Icon from "#lib/icons/Icon.svelte";
  import { mediaBlock } from "#lib/styles/media-blocks.ts";
  import { glass } from "#lib/styles/shared.ts";

  let { gallery }: { gallery: Gallery } = $props();

  function onDialogKeydown(event: KeyboardEvent) {
    if (!gallery.several) return;
    if (event.key === "ArrowLeft") gallery.step(-1);
    else if (event.key === "ArrowRight") gallery.step(1);
    else return;
    event.preventDefault();
  }

  function onDialogClick(event: MouseEvent) {
    if (event.target instanceof Element && event.target.closest("img, button, p")) return;
    gallery.dialog?.close();
  }
</script>

<dialog
  bind:this={gallery.dialog}
  {...stylex.attrs(styles.dialog)}
  aria-label="Image gallery"
  onkeydown={onDialogKeydown}
  onclick={onDialogClick}
  onclose={() => (gallery.slides = [])}
>
  {#if gallery.slide}
    {@const slide = gallery.slide}
    <header {...stylex.attrs(styles.top)}>
      <p {...stylex.attrs(styles.counter)} aria-live="polite">
        {#if gallery.several}{gallery.index + 1} / {gallery.slides.length}{/if}
      </p>
      <button
        type="button"
        {...stylex.attrs(glass.edge, mediaBlock.roundControl, styles.button, glass.focus)}
        aria-label="Close"
        onclick={() => gallery.dialog?.close()}
      >
        <Icon name="close" style={mediaBlock.icon} />
      </button>
    </header>

    <figure {...stylex.attrs(styles.stage)}>
      {#key gallery.index}
        <picture {...stylex.attrs(styles.picture)}>
          {#each slide.sources as source (source.type)}
            <source {...stylex.attrs(styles.source)} srcset={source.srcset} type={source.type} sizes={slide.sizes} />
          {/each}
          <img {...stylex.attrs(styles.image)} src={slide.src} alt={slide.alt} />
        </picture>
      {/key}
      {#if gallery.several}
        <button
          type="button"
          {...stylex.attrs(glass.edge, mediaBlock.roundControl, styles.button, glass.focus, styles.step, styles.previous)}
          aria-label="Previous image"
          onclick={() => gallery.step(-1)}
        >
          <Icon name="previous" style={mediaBlock.icon} />
        </button>
        <button
          type="button"
          {...stylex.attrs(glass.edge, mediaBlock.roundControl, styles.button, glass.focus, styles.step, styles.next)}
          aria-label="Next image"
          onclick={() => gallery.step(1)}
        >
          <Icon name="next" style={mediaBlock.icon} />
        </button>
      {/if}
    </figure>

    <p {...stylex.attrs(styles.caption)}>{slide.caption}</p>
  {/if}
</dialog>
