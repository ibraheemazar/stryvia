# @stryvia/api-client

A typed client for the STRYVIA valuation engine, used by all frontend apps. Wraps HTTP transport, auth, retries, and error handling, exposing strongly-typed methods backed by the shared `@stryvia/types` package.

**Stack (planned):** TypeScript, with an HTTP layer (likely `fetch` + a thin wrapper) and runtime validation via Zod or similar.

**Currently a placeholder** — the client is implemented once the engine exposes its first endpoints. See `docs/architecture/` for the staged build plan.
