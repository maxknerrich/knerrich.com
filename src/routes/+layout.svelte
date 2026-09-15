<script lang="ts">
  import '../app.css';
  import { onNavigate } from '$app/navigation';
  import SiteHeader from '$lib/SiteHeader.svelte';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
  let hasNavigated = $state(false);

  onNavigate((navigation) => {
    if (navigation.from?.url.pathname === navigation.to?.url.pathname) return;
    hasNavigated = true;

    if (
      !document.startViewTransition ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) return;

    return new Promise<void>((resolve) => {
      const transition = document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
        // Decode the destination image, including a lazy-loaded card on return.
        const slug = navigation.to?.params?.slug ?? navigation.from?.params?.slug;
        const image = document.querySelector<HTMLImageElement>('[data-project-hero]')
          ?? document.getElementById(`project-${slug}`)?.querySelector('img');
        if (image) {
          image.loading = 'eager';
          await image.decode().catch(() => {});
        }
      });
      // A newer navigation can interrupt the current transition.
      void transition.finished.catch(() => {});
    });
  });

  if (import.meta.env.DEV) {
    $effect(() => {
      void import('virtual:stylex:runtime');
    });
  }
</script>

<svelte:head>
  {#if import.meta.env.DEV}
    <link rel="stylesheet" href="/virtual:stylex.css" />
  {/if}
</svelte:head>

<div class="site" data-navigated={hasNavigated || undefined}>
  <SiteHeader />
  {@render children()}
</div>

<style>
  @layer portfolio {
    .site {
      display: contents;
    }

    [data-navigated] {
      --entrance-duration: 0ms;
      --entrance-delay: 0ms;
    }
  }
</style>
