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
vp build
```

Commits run a hook that formats the staged files and lints the project.

## Docs

Custom decision that agent cant find themselves are documented in [docs](docs/)
