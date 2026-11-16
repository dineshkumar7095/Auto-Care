# Dono Auto Care — automotive marketplace (modular monorepo)

Parts, workshop services, towing and fleet care for every vehicle type. Pilot city: **Hyderabad**.

Every portal is its own app with its own routes, layout, navigation, role checks, tests and build. All portals share
one backend, one database, one sign-in system, one API contract and one UI kit — no business logic is copied
between portals.

```text
automotive-marketplace/
  apps/
    customer-web/         customer website                      :5173
    seller-portal/        parts sellers                          :5174
    distributor-portal/   distributors / B2B                     :5175
    workshop-portal/      garages and service centres            :5176
    towing-portal/        towing companies                       :5177
    fleet-portal/         fleet operators                        :5178
    admin-portal/         marketplace operations                 :5179
    customer-mobile/      customer app — React Native (Expo)
    driver-mobile/        towing driver app — React Native (Expo)
  packages/
    shared-types/  shared-ui/  authentication/  api-client/  validation/  utilities/  mobile-kit/
  backend/                Express + MongoDB modular monolith     :4000
    src/modules/  auth users vendors vehicles catalogue inventory orders payments bookings towing fleet
                  trade reviews returns payouts notifications admin audit
    src/providers/  sms.ts  payments.ts   (plug-in slots for your SMS service and payment gateway)
  infrastructure/
    docker/  deployment/  database/
```

## Quick start (no backend needed)

Requires Node 20+.

```bash
npm install
npm run dev:customer        # http://localhost:5173
npm run dev:seller          # http://localhost:5174   (any other: dev:workshop, dev:admin, …)
```

Portals start in **demo mode** (`VITE_USE_MOCKS=true`): a built-in mock server answers with Hyderabad sample data
and enforces the same rules as the real backend.

| Portal | Demo phone | Person |
| --- | --- | --- |
| Customer | +91 98000 00001 | Arjun |
| Seller | +91 98000 00002 | Ganesh |
| Workshop | +91 98000 00003 | Anita |
| Admin | +91 98000 00004 | Kavya |
| Distributor | +91 98000 00005 | Farhan |
| Towing | +91 98000 00006 | Manjunath |
| Fleet | +91 98000 00007 | Deepa |
| Driver app | +91 98000 00016 | Shiva (driver) |

OTP for every demo account: **123456**. Signing in with the wrong portal's number shows "no access", which is the
role-based access control working.

## What each portal does

| App | Screens |
| --- | --- |
| Customer website | Part search with fitment badges, part page with reviews, workshop booking, towing (112 first), account with orders, GST invoices, returns and notifications |
| Seller | Dashboard, orders, products & stock, returns (approve/reject), payouts |
| Distributor | Trade desk, trade orders, quotes (RFQ), buyer-group price lists, credit & terms with automatic hold |
| Workshop | Dashboard, job cards (estimate approval before repair), bookings |
| Towing | Live jobs, trip history, trucks (EV-safe flagged), drivers, payouts |
| Fleet | Overview, vehicles, approvals, service plans, spend chart |
| Admin | Dashboard, partner approvals, returns & refunds, settlements (release payouts) |
| Customer app | Parts, part details + reviews, services booking, towing with "Call 112", account, returns |
| Driver app | Job list (auto-refresh), trip steps, directions, EV safety warning, "Call 112", earnings |

## Mobile apps (Expo)

```bash
npm install
npm run dev:customer-mobile     # scan the QR code with Expo Go on your phone
npm run dev:driver-mobile
```

They start in demo mode. To use the real backend, copy `apps/<app>/.env.example` to `.env`, set
`EXPO_PUBLIC_USE_MOCKS=false` and `EXPO_PUBLIC_API_URL` to your computer's LAN IP (a phone can't reach `localhost`).
The apps share `api-client`, `shared-types`, `utilities` and `validation` with the websites, plus `mobile-kit`
(native UI, theme and secure phone sign-in). Store builds: `npx eas build` inside each app folder.

## Run with the real backend and MongoDB

```bash
cp backend/.env.example backend/.env          # set MONGODB_URI and JWT_SECRET
npm run seed                                  # loads the same sample data into MongoDB
npm run dev:backend                           # http://localhost:4000/api/v1
# in each portal: copy apps/<portal>/.env.example to .env and set VITE_USE_MOCKS=false
npm run dev:seller
```

Or run everything with Docker:

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
docker compose -f infrastructure/docker/docker-compose.yml run --rm seed
```

## Tests and checks

```bash
npm test             # every package, portal and the backend
npm run typecheck
npm run build        # builds every portal into apps/*/dist
```

Backend tests start a temporary in-memory MongoDB (downloaded on first run). They include a **contract test** that
points the shared `api-client` at the real backend and checks every response has the same shape as demo mode.

## How the pieces fit

- **Central sign-in.** Phone + OTP via `/auth/otp/*`. The token records the user's roles; each portal only admits its
  own roles (`PORTAL_ROLES` in `shared-types`), checked both in the portal's route guard and on every backend call.
- **Permissions.** Fine-grained actions (`orders:fulfil`, `partners:approve`, `jobs:advance`…) live in
  `shared-types/roles.ts`. The UI hides buttons with `<Can>`; the backend enforces with `requirePermission`.
- **Business rules in one place.** Status flows (orders, job cards, towing trips) are transition maps in
  `shared-types`; totals and GST in `utilities`; input rules in `validation`. Backend, mock server and portals all
  import the same code.
- **Data scoping.** Sellers, workshops, distributors and towing companies only see their own data (`vendorId` in the
  token); fleets by `fleetId`. Customers see their own orders and bookings.
- **Money** is integer paise everywhere; ids are UUIDs; times are UTC.
- **After-sales rules** live in `utilities/commerce.ts`: GST invoices (CGST+SGST inside Telangana, IGST across
  states), payouts (commission per partner type + 0.1% TDS under 194-O − refunds), the 7-day return window, trade
  credit hold after 30 days overdue, and RFQ quoting.
- **Returns flow:** customer requests → seller approves or rejects → admin finance releases the refund (order becomes
  *returned* and stock goes back). Reviews are marked "verified purchase" by the server only.
- **Notifications:** every module calls `notify()`; an in-app copy is always stored and SMS is optional.

## Connecting SMS and payments (when you choose providers)

- **SMS:** set `SMS_PROVIDER=msg91` (with `MSG91_AUTH_KEY`, `MSG91_TEMPLATE_ID`) or `SMS_PROVIDER=twilio` (with
  `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM`) and remove `OTP_DEV_CODE`. Indian SMS needs a
  DLT-registered sender and template. Another provider = one small adapter in `backend/src/providers/sms.ts`.
- **Payments:** the backend only talks to the `PaymentProvider` interface in `backend/src/providers/payments.ts`
  (create intent + verify webhook signature). Add a Razorpay, Cashfree, PhonePe or PayU adapter there and set
  `PAYMENT_PROVIDER`. The built-in `mock` provider signs webhooks with `PAYMENT_WEBHOOK_SECRET` so the flow is
  testable today.

## Safety rules built in

- Fitment status is always shown (verified / seller-confirmed / possible / not verified).
- "OEM" or "genuine" listings need a proof document; every new listing starts as *pending review*.
- EV high-voltage jobs only go to EV-qualified workshops; EV towing only to EV-safe flatbeds.
- The towing screen always points to emergency services (112) for accidents and injuries.
- Repair can't start until the customer approves the estimate; partners can't be approved with unverified documents.

## Not included yet

- A chosen SMS service and payment gateway — the slots above are ready; checkout shows a notice until then.
- Live GPS tracking of tow trucks and push notifications (needs a maps key and Expo push setup).
- Menu items marked "Soon" (e.g. admin order search, seller reports, workshop invoices and technicians).
- Sample businesses, prices and people are invented for the demo.
