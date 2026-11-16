# Deployment

Each portal is a static site; the backend is one Node service. Deploy them independently.

```text
dono.example.in             -> customer-web        (static)
seller.dono.example.in      -> seller-portal       (static)
distributor.dono.example.in -> distributor-portal  (static)
workshop.dono.example.in    -> workshop-portal     (static)
towing.dono.example.in      -> towing-portal       (static)
fleet.dono.example.in       -> fleet-portal        (static)
admin.dono.example.in       -> admin-portal        (static, consider IP allow-list / VPN)
api.dono.example.in         -> backend             (Node 22, port 4000)
                               MongoDB Atlas (Mumbai region) or self-hosted replica set
```

## Portals

Build one portal: `npm run build -w @automotive/seller-portal` → upload `apps/seller-portal/dist` to any static host
(S3 + CloudFront, Netlify, Vercel, Cloudflare Pages, Nginx). Configure the host to serve `index.html` for unknown
paths. Build-time settings:

| Variable | Production value |
| --- | --- |
| `VITE_API_URL` | `https://api.dono.example.in/api/v1` |
| `VITE_USE_MOCKS` | `false` |

Or use Docker: `docker build -f infrastructure/docker/Dockerfile.portal --build-arg APP=seller-portal .`

## Backend

`docker build -f infrastructure/docker/Dockerfile.backend .` and run with:

| Variable | Notes |
| --- | --- |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | Atlas connection string |
| `JWT_SECRET` | 32+ random characters, from your secret manager |
| `CORS_ORIGINS` | comma-separated list of every portal URL above |
| `OTP_DEV_CODE` | **must be empty** — the server refuses to start in production if set |

Before going live: plug an SMS provider into `backend/src/modules/auth/auth.service.ts`, a payment gateway into
`backend/src/modules/payments`, and put the API behind HTTPS.

## Extracting a portal into its own repository

A portal only depends on `packages/*`. To move one out: copy `apps/<portal>` plus the packages it lists in its
`package.json`, or publish the packages to a private npm registry and depend on them by version. No portal code
needs to change.
