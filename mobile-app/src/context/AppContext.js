import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { UNSAFE_ZONES, computeRiskFromZones } from '../utils/geoFence';
import * as api from '../services/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [risk, setRisk] = useState('SAFE');
  const [alerts, setAlerts] = useState([]);
  const [locationError, setLocationError] = useState(null);
  const [emergencyMode, setEmergencyMode] = useState(false);

  const updateLocationAndRisk = useCallback((coords) => {
    const lat = coords?.latitude;
    const lng = coords?.longitude;
    setLocation({ latitude: lat ?? null, longitude: lng ?? null });
    if (typeof lat === 'number' && typeof lng === 'number') {
      setRisk(computeRiskFromZones(lat, lng, UNSAFE_ZONES));
    } else {
      setRisk('SAFE');
    }
  }, []);

  const refreshAlerts = useCallback(async (userId) => {
    if (!userId) {
      setAlerts([]);
      return;
    }
    try {
      const list = await api.getAlerts(userId);
      const serverList = Array.isArray(list) ? list : [];
      setAlerts((prev) => {
        const map = new Map();
        serverList.forEach((a) => {
          if (a?.id != null) map.set(String(a.id), a);
        });
        prev.forEach((p) => {
          if (p?.id != null && !map.has(String(p.id))) {
            map.set(String(p.id), p);
          }
        });
        return Array.from(map.values()).sort((a, b) => {
          const ta = new Date(a.timestamp || a.createdAt || 0).getTime();
          const tb = new Date(b.timestamp || b.createdAt || 0).getTime();
          return tb - ta;
        });
      });
    } catch {
      /* keep existing alerts on network failure */
    }
  }, []);

  const appendAlertLocal = useCallback((alert) => {
    setAlerts((prev) => [alert, ...prev.filter((a) => a.id !== alert.id)]);
  }, []);

  const activateEmergencyMode = useCallback((durationMs = 10000) => {
    setEmergencyMode(true);
    setTimeout(() => setEmergencyMode(false), durationMs);
  }, []);

  const value = useMemo(
    () => ({
      location,
      setLocation,
      risk,
      setRisk,
      alerts,
      setAlerts,
      locationError,
      setLocationError,
      emergencyMode,
      setEmergencyMode,
      unsafeZones: UNSAFE_ZONES,
      updateLocationAndRisk,
      refreshAlerts,
      appendAlertLocal,
      activateEmergencyMode,
    }),
    [
      location,
      risk,
      alerts,
      locationError,
      emergencyMode,
      updateLocationAndRisk,
      refreshAlerts,
      appendAlertLocal,
      activateEmergencyMode,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
