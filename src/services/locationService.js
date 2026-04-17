import * as Location from 'expo-location';

/**
 * Request foreground location permission (Expo).
 */
export async function requestLocationPermission() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === 'granted';
}

/**
 * Returns current coords or null on failure.
 */
export async function getCurrentLocation() {
  const pos = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
  return {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    accuracy: pos.coords.accuracy,
  };
}

/**
 * Polls location every `intervalMs`, calls `onLocation` with { latitude, longitude }.
 * Immediately fetches once, then on interval.
 * Returns unsubscribe function (clears interval).
 */
export function startLocationUpdates(onLocation, onError, intervalMs = 5000) {
  let intervalId = null;
  let cancelled = false;

  const tick = async () => {
    if (cancelled) return;
    try {
      const loc = await getCurrentLocation();
      if (!cancelled && onLocation) {
        onLocation({ latitude: loc.latitude, longitude: loc.longitude });
      }
    } catch (e) {
      if (!cancelled && onError) {
        onError(e);
      }
    }
  };

  tick();
  intervalId = setInterval(tick, intervalMs);

  return () => {
    cancelled = true;
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
}
