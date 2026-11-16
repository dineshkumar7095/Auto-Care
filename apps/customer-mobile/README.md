# Customer mobile app (React Native · Expo)

Same marketplace as `customer-web`, on Android and iPhone. Signs in with the same phone + OTP and talks to the same
backend through `@automotive/api-client`.

```bash
npm install            # from the repo root
npm run dev:customer-mobile
```

Scan the QR code with **Expo Go**. Demo mode is on by default: sign in with **98000 00001**, code **123456**.

- Tabs: **Parts** (search, fitment badge) · **Services** (book a verified workshop) · **Towing** ("Call 112" first, EV
  trips only see EV-safe trucks) · **Account** (orders, 7-day returns, notifications, sign out).
- Sign-in tokens are kept in the phone's secure keychain (`expo-secure-store`).
- `metro.config.js` pins React to this app's copy so it never mixes with the websites' React version.
- Tests: `npm test` (pure logic). Store builds: `npx eas build`.
