<script module lang="ts">
  import '../app.css';
  import * as stylex from '@stylexjs/stylex';
  import { color, layout, media, motion, radius, space } from '#lib/styles/tokens.stylex.ts';

  const shell = stylex.create({
    root: {
      isolation: 'isolate',
      display: 'flex',
      flexDirection: 'column',
      minBlockSize: '100dvh',
      backgroundColor: color['--night'],
      fontWeight: 500,
    },
    page: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      containerType: 'inline-size',
      paddingInline: layout['--page-margin'],
      paddingBlockEnd: { default: space['--space-128'], [media.phone]: space['--space-96'] },
      backgroundColor: color['--night'],
    },
    skip: {
      position: 'absolute',
      zIndex: 20,
      insetBlockStart: '1rem',
      insetInlineStart: '1rem',
      paddingBlock: space['--space-8'],
      paddingInline: space['--space-16'],
      borderRadius: radius['--radius-md'],
      backgroundColor: color['--overlay'],
      transform: { default: 'translateY(-200%)', ':focus': 'translateY(0)' },
    },
    header: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      blockSize: layout['--landing-header-height'],
    },
    symbol: {
      display: 'block',
      inlineSize: 'auto',
      blockSize: { default: '1.875rem', [media.phone]: '1.5rem' },
    },
  });

  const navigated = stylex.createTheme(motion, {
    '--duration-entrance': '0ms',
    '--entrance-delay-scale': '0',
  });
</script>

<script lang="ts">
  import { afterNavigate, beforeNavigate, onNavigate } from '$app/navigation';
  import { resolve } from '$app/paths';
  import BottomBar from '#lib/BottomBar.svelte';
  import Mark from '#lib/logos/Mark.svelte';
  import { symbol } from '#lib/stickers/symbol.ts';
  import SiteFooter from '#lib/SiteFooter.svelte';
  import { soundSetting, warmOnFirstUse } from '#lib/sound.svelte.ts';
  import { onMount } from 'svelte';
  import { glass, site } from '#lib/styles/shared.ts';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();
  let hasNavigated = $state(false);
  onMount(() => {
    soundSetting.load();
    return warmOnFirstUse();
  });

  onNavigate((navigation) => {
    if (navigation.from?.url.pathname !== navigation.to?.url.pathname) hasNavigated = true;
  });

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
  <link rel="alternate" type="application/atom+xml" title="Writing · Max Knerrich" href="/rss.xml" />
  <link rel="preload" href="/fonts/switzer-variable.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
  {#if import.meta.env.DEV}
    <link rel="stylesheet" href="/virtual:stylex.css" />
  {/if}
</svelte:head>

<div {...stylex.attrs(shell.root, hasNavigated && navigated)}>
  <div {...stylex.attrs(shell.page)}>
    <a {...stylex.attrs(shell.skip)} href="#main">Skip to content</a>

    <header {...stylex.attrs(site.content, shell.header)}>
      <a href={resolve('/')} aria-label="Knerrich, home" {...stylex.attrs(site.link, glass.focus)}>
        <Mark mark={symbol} {...stylex.attrs(shell.symbol)} />
      </a>
    </header>

    <BottomBar />

    {@render children()}
  </div>

  <SiteFooter />
</div>
