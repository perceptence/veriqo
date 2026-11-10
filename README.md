# Veriqo — Digital Identity Wallet

**Prove one fact about yourself, and nothing else.**

A mobile-first identity wallet: hold your credentials, then present a proof by
QR or PIN that discloses a single attribute rather than handing over a whole
document — with every past share on a timeline you can read back.

It got here by being taken apart. The original was one large file, and
rebuilding it onto a token-driven design system is what surfaced three
references that would crash it on contact: `AcctDevices` and
`AcctTrustedContacts` were called but never defined, and `AcctSharingDefaults`
threw on toggle. All three are fixed, and written up at the bottom rather than
quietly patched.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 89 tests across 5 files
npm run build    # production build to dist/
```

## Responsive model

The UI is a phone-first design. It uses an **adaptive frame**:

- **Phone (≤ 480px):** fills the viewport edge-to-edge like a native app.
- **Tablet / desktop:** renders inside a centered device mockup with a debug surface-jump bar.

This lives in `src/styles/global.css` (`.vq-frame` / `.vq-chrome` media query) and `src/App.jsx`.

## Design system — the single source of truth

**Never hardcode a raw color, font, radius, or spacing value in a component.** Import from tokens:

| Concern      | Source                          | Example                         |
| ------------ | ------------------------------- | ------------------------------- |
| Color        | `src/styles/tokens.js` → `C`    | `C.ink`, `C.acc`, `C.bone`      |
| Status color | `tokens.js` → `STATUS`          | `STATUS.warning`               |
| Type         | `tokens.js` → `FONT`/`DISP`…    | `FONT.display`, `MONO`, `NUM`   |
| Radii        | `tokens.js` → `RADIUS`          | `RADIUS.lg`                     |
| Spacing      | `tokens.js` → `SPACE`           | `SPACE[4]`                      |
| Motion       | `tokens.js` → `MOTION`/`EASE`   | `EASE`                          |
| Elevation    | `tokens.js` → `SHADOW`          | `SHADOW.card`                   |
| Breakpoints  | `tokens.js` → `BP`              | `BP.sm`                         |

Keyframes and entrance-animation helpers (`.fu`, `.fu1…5`, `.si`) live in `src/styles/global.css`.

## Structure

```
src/
  main.jsx                 App entry (imports global.css + index.css)
  App.jsx                  State machine + view router + responsive shell
  styles/
    tokens.js              Design tokens (color, type, radius, spacing, motion)
    global.css             Reset, keyframes, font import, responsive frame
  data/
    credentials.js         Credential catalog, directory, share history, helpers
  components/              Shared, reusable building blocks
    Icon.jsx               Ic (icon system) + Grain texture
    BitAvatar.jsx          User avatar illustration
    Avatar.jsx             BadgedAvatar, avatar swatches
    Logo.jsx               markSvg, LogoMark, Wordmark
    primitives.jsx         Btn, Back, Toggle, Row, Group, Notice, Header, DataRows, progress
    cards.jsx              IDCard, CredCard, CredTile, QR
    DynamicIsland.jsx      DynamicIsland + TabBar
  screens/                 Feature screens
    onboarding.jsx         Welcome, details, verify, sign-in, Auth, ToS, Splash
    verify.jsx             Permission → capture → review → selfie → processing → success
    wallet.jsx             Wallet home (drag-reorder) + credential Detail
    share.jsx              Present proof (QR / PIN / selective disclosure)
    pulse.jsx              AI identity intelligence feed + timeline
    showcase.jsx           Dynamic Island demo, Logo studio
    account/
      account-main.jsx     Account hub + edit profile
      account-security.jsx Recovery key, auto-lock, devices, trusted contacts
      account-privacy.jsx  Sharing defaults, connected services, consent, export
      account-misc.jsx     Notifications, help, delete account
      emergency.jsx        Emergency ID flow
```

## Known issues carried over / addressed during import

1. **`AcctDevices` and `AcctTrustedContacts` were referenced but never defined** in the original
   single-file source (the app would crash when opening them). Both are now implemented in
   `account-security.jsx` following the existing design system.
2. **`AcctSharingDefaults` referenced an undefined `updateAttr`** (would throw on toggle). Fixed in
   `account-privacy.jsx`.
3. **Pulse's "Ask Pulse" calls the Anthropic API directly from the browser** (`pulse.jsx`,
   `askPulse`). This cannot work client-side — it needs an API key and hits CORS, so it currently
   degrades to a "connection issue" message. To make it live, add a small backend proxy that holds
   the key and forwards the request; never ship the key in client code.
