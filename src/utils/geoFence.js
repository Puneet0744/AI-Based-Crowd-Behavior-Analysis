/**
 * Geo-fencing utilities using the Haversine formula (great-circle distance).
 * Distances are in meters; zones use `radius` in meters.
 */

/** Predefined unsafe zones (Chennai + Bangalore example coordinates). */
export const UNSAFE_ZONES = [
  { latitude: 13.0827, longitude: 80.2707, radius: 500 },
  { latitude: 12.9716, longitude: 77.5946, radius: 700 },
];

const EARTH_RADIUS_M = 6371000;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Haversine distance between two WGS84 points in meters.
 */
export function haversineDistanceMeters(lat1, lon1, lat2, lon2) {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_M * c;
}

/**
 * Returns true if the user is inside the circular zone (center + radius meters).
 */
export function isInsideZone(userLat, userLng, zone) {
  if (
    typeof userLat !== 'number' ||
    typeof userLng !== 'number' ||
    !zone ||
    typeof zone.latitude !== 'number' ||
    typeof zone.longitude !== 'number' ||
    typeof zone.radius !== 'number'
  ) {
    return false;
  }
  const d = haversineDistanceMeters(userLat, userLng, zone.latitude, zone.longitude);
  return d <= zone.radius;
}

/**
 * Returns "HIGH" if inside any unsafe zone, otherwise "SAFE".
 */
export function computeRiskFromZones(userLat, userLng, zones = UNSAFE_ZONES) {
  if (typeof userLat !== 'number' || typeof userLng !== 'number') {
    return 'SAFE';
  }
  for (let i = 0; i < zones.length; i += 1) {
    if (isInsideZone(userLat, userLng, zones[i])) {
      return 'HIGH';
    }
  }
  return 'SAFE';
}
