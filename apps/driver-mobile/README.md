# Towing driver app (React Native · Expo)

For drivers of towing partners. Drivers sign in with the towing-portal role check (role `driver`) and only see open
requests and trips assigned to them; the operator manages trucks in `towing-portal`.

```bash
npm install            # from the repo root
npm run dev:driver-mobile
```

Demo mode: sign in with **98000 00016** (Shiva), code **123456**.

- **Jobs:** live trip first, then new requests; refreshes every 15 s.
- **Trip:** step buttons (Accept → Start driving → Arrived → Loaded → Complete) use the same transition rules as the
  backend; Google Maps directions; EV safety warning; "Call 112".
- **Me:** completed trips and amount billed.
