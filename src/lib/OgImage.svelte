<script lang="ts">
  import { ogImage } from "./site.ts";

  let { page, alt }: { page: string; alt: string } = $props();
  const src = $derived(ogImage(page));
</script>

<meta property="og:image" content={src} />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content={alt} />
<meta name="twitter:image" content={src} />
<meta name="twitter:image:alt" content={alt} />
