<script lang="ts">
  import '../app.css';
  import type { LayoutProps } from './$types';

  let { children }: LayoutProps = $props();

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

{@render children()}
