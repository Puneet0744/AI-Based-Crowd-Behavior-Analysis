# Tourist Safety (Expo)

A production-ready Tourist Safety System app built with **React Native (Expo)**.

## Prerequisites

- Node.js LTS
- Expo CLI (optional; we use `npx`)
- **Expo Go** app (for quick testing) or an emulator/simulator

## Install

From the project root:

```bash
npm install
```

Recommended (aligns native dependencies with your installed Expo SDK):

```bash
npx expo install
```

## Run

Start the dev server:

```bash
npx expo start
```

Then:
- Press **`a`** for Android emulator
- Press **`i`** for iOS simulator
- Or scan the QR code with **Expo Go**

## Location permissions

On first launch, the app will request **foreground location permission**.
If you deny it, the map/SOS will still render, but tracking and SOS coordinates will not work until you enable permission in device settings.

## Backend (SOS / Alerts / Auth)

The app calls these endpoints:

- `POST /auth/login`
- `POST /auth/register`
- `POST /sos`
- `GET /alerts?userId=...`
- `POST /location` (optional; non-blocking)

### Base URL rules

By default the app uses:
- **Android emulator**: `http://10.0.2.2:5000`
- **iOS simulator / web**: `http://localhost:5000`

### Using a real phone (Expo Go)

`localhost` will NOT point to your computer from a physical device. Set a LAN URL:

**PowerShell (Windows):**

```powershell
$env:EXPO_PUBLIC_API_URL="http://192.168.1.50:5000"
npx expo start --clear
```

Replace `192.168.1.50` with your PC’s local IP. Make sure your phone and PC are on the same Wi‑Fi.

## Maps notes (Android)

- `react-native-maps` may require a **Google Maps API key** for production builds.
- You can set it in `app.json` under:
  - `expo.android.config.googleMaps.apiKey`

For local development in Expo Go, maps often work without a key, depending on device/config.

## What to expect in the app

- **Home**: full-screen map, 5-second location updates, unsafe zone circles, live risk banner (SAFE/HIGH), SOS button with haptics and 10s emergency mode.
- **Alerts**: list of past alerts, pull-to-refresh.
- **Profile**: user info + logout.

## Troubleshooting

- **SOS doesn’t reach backend on Android emulator**: ensure your backend listens on port `5000`, and the app base URL is `10.0.2.2:5000`.
- **SOS doesn’t reach backend on real phone**: set `EXPO_PUBLIC_API_URL` to your computer’s LAN IP (not `localhost`).
- **No location updates**: enable device GPS, grant location permission, and test outdoors or with emulator location simulation.

