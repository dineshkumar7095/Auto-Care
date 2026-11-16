# Admin portal — `admin-portal`

Independent app: its own routes, layout, navigation, tests and build. Shares only `packages/*` and the backend.

```bash
npm run dev -w @automotive/admin-portal     # http://localhost:5179
npm run test -w @automotive/admin-portal
npm run build -w @automotive/admin-portal   # -> apps/admin-portal/dist
```

**Demo sign-in:** +919800000004 · OTP `123456` · Kavya (operations admin)

**Screens:** Marketplace overview with weekly chart and alerts, partner approvals (documents must be verified)

**Routes:** /, /partners

## Folder layout

```text
src/
  app/          config (portal id), env, navigation, router
  routes/       file-based routes (TanStack Router); _portal/ (or _site/_account/) is the guarded area
  layouts/      this portal's shell and navigation
  features/     one folder per feature: api.ts (queries), *-rules.ts (pure logic + tests), components/
  test/         access-control tests (signed out -> /login, wrong role -> /unauthorized)
```

Set `VITE_USE_MOCKS=false` in `.env` to use the real backend instead of built-in sample data.
