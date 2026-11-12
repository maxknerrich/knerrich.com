<script lang="ts">
  import '../app.css';
  import * as stylex from '@stylexjs/stylex';
  import { afterNavigate, beforeNavigate, onNavigate } from '$app/navigation';
  import SiteHeader from '#lib/SiteHeader.svelte';
  import { navigated, site } from '#lib/styles/layout.ts';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
  let hasNavigated = $state(false);

  // After the first client-side navigation, entrances are instant (see navigated).
  onNavigate((navigation) => {
    if (navigation.from?.url.pathname !== navigation.to?.url.pathname) hasNavigated = true;
  });

  // Smooth scrolling (app.css) is for jumps within a page. When the page changes,
  // SvelteKit's scroll to the top (or back to where you were) should be instant.
  beforeNavigate(({ from, to }) => {
    if (from?.url.pathname !== to?.url.pathname) document.documentElement.style.scrollBehavior = 'auto';
  });
  afterNavigate(() => {
    document.documentElement.style.removeProperty('scroll-behavior');
  });

  if (import.meta.env.DEV) {
    $effect(() => {
      void import('virtual:stylex:runtime');
    });
  }
</script>

<svelte:head>
  <!-- Lets feed readers find the writing feed from any page. -->
  <link rel="alternate" type="application/atom+xml" title="Writing · Max Knerrich" href="/rss.xml" />
  {#if import.meta.env.DEV}
    <link rel="stylesheet" href="/virtual:stylex.css" />
  {/if}
</svelte:head>

<div {...stylex.attrs(site.root, hasNavigated && navigated)}>
  <SiteHeader />
  {@render children()}
</div>

