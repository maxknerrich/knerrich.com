<script module lang="ts">
  import * as stylex from "@stylexjs/stylex";
  import { color, effect, layout, marks, media, motion, radius, space, text, vars } from "#lib/styles/tokens.stylex.ts";

  const tweet = stylex.create({
    card: {
      display: "grid",
      rowGap: space["--space-16"],
      paddingBlock: space["--space-16"],
      paddingInline: layout["--box-pad"],
      color: { default: color["--text"], ":hover": color["--text"] },
      textDecoration: "none",
      [vars["--edge"]]: {
        default: effect["--card-edge"],
        ":hover": effect["--secondary-hover-edge"],
        ":focus-visible": effect["--secondary-hover-edge"],
      },
    },
    author: {
      display: "grid",
      gridTemplateColumns: "auto minmax(0, 1fr) auto",
      alignItems: "center",
      columnGap: space["--space-12"],
    },
    avatar: {
      inlineSize: "2.5rem",
      blockSize: "2.5rem",
      borderRadius: "50%",
      backgroundColor: marks["--chip-fill"],
    },
    names: {
      display: "grid",
      lineHeight: 1.3,
    },
    handle: {
      color: color["--text-muted"],
      fontSize: text["--type-small"],
    },
    logo: {
      alignSelf: "start",
      inlineSize: "1.25rem",
      blockSize: "1.25rem",
      color: { default: color["--text-muted"], [stylex.when.ancestor(":hover")]: color["--text"] },
      transitionProperty: { default: "none", [media.motion]: "color" },
      transitionDuration: motion["--duration-base"],
    },
    text: {
      whiteSpace: "pre-line",
    },
    media: {
      display: "block",
      inlineSize: "100%",
      blockSize: "auto",
      maxBlockSize: "32rem",
      objectFit: "cover",
      borderRadius: radius["--radius-md"],
      backgroundColor: marks["--chip-fill"],
    },
    frame: {
      position: "relative",
      display: "grid",
      placeItems: "center",
    },
    play: {
      position: "absolute",
      inlineSize: space["--space-48"],
      blockSize: space["--space-48"],
      padding: space["--space-12"],
      borderRadius: "50%",
      backgroundColor: color["--pill"],
      backdropFilter: "blur(8px)",
      color: color["--text"],
    },
    meta: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      columnGap: space["--space-16"],
      rowGap: space["--space-4"],
      color: color["--text-muted"],
      fontSize: text["--type-small"],
    },
    count: {
      display: "inline-flex",
      alignItems: "center",
      gap: space["--space-4"],
    },
    icon: {
      inlineSize: "1em",
      blockSize: "1em",
    },
    date: {
      marginInlineStart: "auto",
    },
    fallback: {
      display: "flex",
      alignItems: "center",
      gap: space["--space-12"],
    },
  });
</script>

<script lang="ts">
  import Icon from "#lib/icons/Icon.svelte";
  import type { EmbedProps, TweetData } from "./props";
  import { glass, screenReader } from "#lib/styles/shared.ts";

  let { id, data }: EmbedProps<"tweet"> & { data?: TweetData } = $props();

  const href = $derived(
    data ? `https://x.com/${data.handle}/status/${id}` : `https://x.com/i/status/${id}`,
  );
  const count = new Intl.NumberFormat("en", { notation: "compact" });
  const day = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" });
</script>

{#snippet logo()}
  <Icon name="x" style={tweet.logo} />
{/snippet}

<a {href} target="_blank" rel="noopener" {...stylex.attrs(glass.edge, glass.card, glass.focus, tweet.card)}>
  {#if data}
    <header {...stylex.attrs(tweet.author)}>
      <img
        {...stylex.attrs(tweet.avatar)}
        src={data.avatar}
        alt=""
        width="40"
        height="40"
        loading="lazy"
        decoding="async"
      />
      <span {...stylex.attrs(tweet.names)}>
        <span>{data.name}</span>
        <span {...stylex.attrs(tweet.handle)}>@{data.handle}</span>
      </span>
      {@render logo()}
    </header>
    <p {...stylex.attrs(tweet.text)}>{data.text}</p>
    {#if data.media}
      <span {...stylex.attrs(tweet.frame)}>
        <img
          {...stylex.attrs(tweet.media)}
          src={data.media.src}
          alt={data.media.alt ?? ""}
          width={data.media.width}
          height={data.media.height}
          loading="lazy"
          decoding="async"
        />
        {#if data.media.video}
          <Icon name="play" style={tweet.play} />
        {/if}
      </span>
    {/if}
    <footer {...stylex.attrs(tweet.meta)}>
      <span {...stylex.attrs(tweet.count)}>
        <Icon name="replies" style={tweet.icon} />
        {count.format(data.replies)}<span {...stylex.attrs(screenReader.only)}> replies</span>
      </span>
      <span {...stylex.attrs(tweet.count)}>
        <Icon name="likes" style={tweet.icon} />
        {count.format(data.likes)}<span {...stylex.attrs(screenReader.only)}> likes</span>
      </span>
      <time {...stylex.attrs(tweet.date)} datetime={data.date}>{day.format(new Date(data.date))}</time>
    </footer>
  {:else}
    <span {...stylex.attrs(tweet.fallback)}>
      {@render logo()}
      View the post on X
    </span>
  {/if}
</a>
