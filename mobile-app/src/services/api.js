import axios from 'axios';
import { Platform } from 'react-native';

/**
 * Backend base URL.
 * - iOS simulator: localhost works
 * - Android emulator: use 10.0.2.2 instead of localhost
 * - Physical device: use your machine LAN IP
 */
function getDefaultBaseUrl() {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000';
  }
  return 'http://localhost:5000';
}

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || getDefaultBaseUrl();

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/** In-memory mock store for demo when server is offline */
const mockUsers = new Map();
const mockAlerts = [];

function pushMockAlert(alert) {
  mockAlerts.unshift({ ...alert, id: String(Date.now()), status: alert.status || 'sent' });
}

/**
 * Attach bearer token for authenticated routes.
 */
export function setAuthToken(token) {
  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete client.defaults.headers.common.Authorization;
  }
}

/**
 * Login — tries server first, falls back to mock credentials.
 */
export async function login(email, password) {
  try {
    const res = await client.post('/auth/login', { email, password });
    return normalizeUser(res.data);
  } catch (err) {
    const key = `${email}:${password}`.toLowerCase();
    const stored = mockUsers.get(key);
    if (stored) {
      return { ...stored };
    }
    if (email && password) {
      const fallback = {
        userId: 'demo-user',
        name: 'Demo Traveler',
        nationality: 'International',
        token: `mock-token-${Date.now()}`,
        email,
      };
      return fallback;
    }
    throw new Error(err?.response?.data?.message || err?.message || 'Login failed');
  }
}

/**
 * Register — tries server first, falls back to local mock user.
 */
export async function register({ name, email, password, nationality }) {
  try {
    const res = await client.post('/auth/register', {
      name,
      email,
      password,
      nationality,
    });
    return normalizeUser(res.data);
  } catch (err) {
    const userId = `user-${Date.now()}`;
    const token = `mock-token-${userId}`;
    const user = {
      userId,
      name: name || 'Traveler',
      nationality: nationality || 'Unknown',
      token,
      email,
    };
    mockUsers.set(`${email}:${password}`.toLowerCase(), user);
    return { ...user };
  }
}

function normalizeUser(data) {
  if (!data) return null;
  return {
    userId: data.userId || data.id || data.user_id,
    name: data.name || 'Traveler',
    nationality: data.nationality || '—',
    token: data.token || data.accessToken || data.access_token,
    email: data.email,
  };
}

/**
 * Periodic location ping (optional backend tracking).
 */
export async function sendLocation({ userId, latitude, longitude, timestamp }) {
  try {
    await client.post('/location', {
      userId,
      latitude,
      longitude,
      timestamp: timestamp || new Date().toISOString(),
    });
  } catch {
    // Non-blocking: home screen should keep working if server is down
  }
}

/**
 * SOS emergency alert.
 */
export async function sendSOS({ userId, latitude, longitude, timestamp }) {
  const payload = {
    userId,
    latitude,
    longitude,
    timestamp: timestamp || new Date().toISOString(),
  };
  try {
    const res = await client.post('/sos', payload);
    const serverAlert = res.data?.alert || res.data;
    if (serverAlert) {
      return { ok: true, alert: serverAlert, source: 'server' };
    }
    const local = buildLocalSosAlert(payload);
    pushMockAlert(local);
    return { ok: true, alert: local, source: 'local-fallback' };
  } catch (err) {
    const local = buildLocalSosAlert(payload);
    pushMockAlert(local);
    return {
      ok: true,
      alert: local,
      source: 'offline',
      warning: err?.message || 'Server unreachable; alert saved locally',
    };
  }
}

function buildLocalSosAlert({ userId, latitude, longitude, timestamp }) {
  return {
    id: `sos-${Date.now()}`,
    type: 'SOS',
    latitude,
    longitude,
    timestamp,
    status: 'queued',
    userId,
  };
}

/**
 * Fetch alert history.
 */
export async function getAlerts(userId) {
  try {
    const res = await client.get('/alerts', { params: { userId } });
    const list = Array.isArray(res.data) ? res.data : res.data?.alerts || [];
    return list;
  } catch {
    return mockAlerts.filter((a) => !userId || a.userId === userId);
  }
}

export { client };
