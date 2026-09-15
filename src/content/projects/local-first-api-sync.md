# Local-first API sync

- Software engineering
- Research
- Local-first

My bachelor thesis explored how to build local-first applications on top of existing REST APIs, without changing the server.

Most external APIs don't provide the conflict resolution or update streams that local-first software expects. I wanted to find out how much of that could live in the client, while keeping the interface responsive and usable offline.

## Keeping edits local

I built a client-side synchronization layer and tested it in a GitHub issue tracker. Edits go straight into a local database. A write-log records those changes, and a two-pass reconciliation process merges them with remote updates when the app synchronizes.

![Architecture diagram showing the application reading and writing locally, with a synchronization layer exchanging updates with a remote API](/projects/local-first-api-sync/architecture.png)

## Results and trade-offs

In the prototype's benchmarks, repeat loads were about 97% faster than the client-server version, and local edits gave visual feedback in under 100 ms. The trade-off was data freshness between syncs. Large offline queues and interrupted synchronization still needed more work.

The prototype used SvelteKit and Dexie.js, with an adapter for GitHub's REST API. It was a research prototype, evaluated against a client-server implementation, not a production-ready synchronization library.

Completed in June 2025 at Hochschule der Medien, Stuttgart.

[Read the full thesis, PDF](/projects/local-first-api-sync/thesis.pdf)
