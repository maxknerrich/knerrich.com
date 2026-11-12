# knerrich.com

Max Knerrich's portfolio and writing, a small digital garden.

## Development

Requires Node.js 22.18+ and [Vite+](https://viteplus.dev/).

```sh
vp install
vp dev
```

```sh
vp run lint    # lint and type-check, including the Markdown content
vp run check   # type-check .svelte files
vp test
vp build
```

Commits run a hook that formats the staged files, lints the project and checks writing frontmatter.

## Docs

Custom decision that agent cant find themselves are documented in [docs](docs/)
