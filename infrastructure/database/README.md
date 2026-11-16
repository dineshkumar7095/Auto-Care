# Database

One MongoDB database (`automotive_marketplace`) for every portal. Portals never get their own database — they
all go through the backend, which scopes data by the signed-in user's role, business (`vendorId`) or fleet (`fleetId`).

| Collection | Owned by backend module |
| --- | --- |
| users, otps | auth, users |
| vendors | vendors (sellers, distributors, workshops, towing companies) |
| vehicles | vehicles |
| products | catalogue (stock changed only by inventory) |
| orders | orders |
| payments | payments |
| workshops, bookings, jobcards | bookings |
| towingproviders, towingtrips | towing |
| fleetvehicles, fleetapprovals | fleet |
| auditlogs | audit (append-only record of approvals and status changes) |

**Conventions:** ids are UUID strings, money is integer paise, timestamps are stored in UTC.

**Sample data:** `npm run seed` (from the repo root) wipes and loads the same sample data that demo mode uses.
It refuses to run when `NODE_ENV=production`.

`mongo-init.js` creates the key indexes when the Docker Mongo container is first created.
