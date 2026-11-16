# `@automotive/backend`

One Express + MongoDB service for every portal (modular monolith). Each folder in `src/modules/` owns its models,
rules and routes; modules talk to each other through exported services, never through another module's collections
directly (e.g. orders reserve stock through `inventory.service`).

```bash
cp .env.example .env
npm run seed      # sample data
npm run dev       # http://localhost:4000/api/v1, health check at /health
npm test          # uses a temporary in-memory MongoDB
```

All responses use one envelope: `{ ok: true, data }` or `{ ok: false, error: { code, message } }`.
