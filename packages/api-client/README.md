# @stryvia/api-client

Typed HTTP client for the STRYVIA engine.

Authored per the Q-007 hybrid decision (see STRYVIA_State.md):

- Generated layer (src/generated/) — types produced by openapi-typescript
  from the engine's /openapi.json. Internal to this package; not re-exported.
  Regenerate with "npm run codegen" from the repo root (engine must be running).
- Domain layer (src/domain/) — hand-written wrappers that consume branded
  IDs from @stryvia/types, validate response payloads with Zod, and return
  ApiResponse<T> envelopes from @stryvia/types/api.
- React layer (src/react/, exposed at @stryvia/api-client/react) —
  TanStack Query hooks that wrap the domain functions. Optional;
  non-React consumers can use the main entry without loading React.

Apps import only the domain and React layers. The generated layer is
package-internal.

## Codegen

From the repo root, with the engine running on :8000:

    npm run codegen

The generated file (src/generated/schema.d.ts) is committed to the repo so
schema diffs are visible in code review.
