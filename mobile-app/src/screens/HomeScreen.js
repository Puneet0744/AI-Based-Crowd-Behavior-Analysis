import React, { useCallback, useRef } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapViewComponent from '../components/MapViewComponent';
import SOSButton from '../components/SOSButton';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import * as api from '../services/api';
import * as locationService from '../services/locationService';

/**
 * Core screen: map, live location, geo-fencing risk banner, SOS.
 */
export default function HomeScreen() {
  const { user } = useAuth();
  const {
    location,
    risk,
    unsafeZones,
    updateLocationAndRisk,
    setLocationError,
    emergencyMode,
    activateEmergencyMode,
    appendAlertLocal,
  } = useApp();

  const unsubscribeRef = useRef(null);

  /** One-shot permission + first fix (used for clearer error messages). */
  const ensurePermission = useCallback(async () => {
    const ok = await locationService.requestLocationPermission();
    if (!ok) {
      setLocationError('Location permission denied. Enable it in settings to use maps and SOS.');
      Alert.alert(
        'Permission required',
        'Location access is needed for safety tracking and SOS coordinates.'
      );
      return false;
    }
    setLocationError(null);
    return true;
  }, [setLocationError]);

  const checkZones = useCallback(
    (lat, lng) => {
      updateLocationAndRisk({ latitude: lat, longitude: lng });
    },
    [updateLocationAndRisk]
  );

  const handleSOS = useCallback(async () => {
    const lat = location?.latitude;
    const lng = location?.longitude;
    if (lat == null || lng == null) {
      Alert.alert('Location unavailable', 'Wait for GPS lock, then try SOS again.');
      return;
    }

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch {
      /* haptics optional */
    }

    const timestamp = new Date().toISOString();
    try {
      const result = await api.sendSOS({
        userId: user?.userId || 'demo-user',
        latitude: lat,
        longitude: lng,
        timestamp,
      });

      if (result?.alert) {
        appendAlertLocal({
          ...result.alert,
          type: result.alert.type || 'SOS',
          status: result.alert.status || 'sent',
          timestamp: result.alert.timestamp || timestamp,
        });
      }

      const msg =
        result?.warning != null
          ? `🚨 Emergency Alert Sent\n(${result.warning})`
          : '🚨 Emergency Alert Sent';
      Alert.alert('SOS', msg);

      activateEmergencyMode(10000);
    } catch (e) {
      Alert.alert('SOS failed', e?.message || 'Could not send alert. Try again.');
    }
  }, [location, user, appendAlertLocal, activateEmergencyMode]);

  // Start/stop 5s loop while this tab is focused (clears interval on blur/unmount)
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const start = async () => {
        const permitted = await ensurePermission();
        if (cancelled || !permitted) return;

        unsubscribeRef.current = locationService.startLocationUpdates(
          async (coords) => {
            checkZones(coords.latitude, coords.longitude);
            try {
              await api.sendLocation({
                userId: user?.userId,
                latitude: coords.latitude,
                longitude: coords.longitude,
                timestamp: new Date().toISOString(),
              });
            } catch {
              /* non-blocking */
            }
          },
          (err) => {
            if (!cancelled) {
              setLocationError(err?.message || 'Unable to read GPS.');
            }
          },
          5000
        );
      };

      start();

      return () => {
        cancelled = true;
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
      };
    }, [ensurePermission, checkZones, user?.userId, setLocationError])
  );

  const riskBannerStyle = risk === 'HIGH' ? styles.bannerDanger : styles.bannerSafe;
  const riskText = risk === 'HIGH' ? 'Danger Zone' : 'You are Safe';

  // Demo-only: ensure danger zones are visible even if the user is far from Chennai/Bangalore.
  // We render 2 additional circles near the user (offset so the user isn't always inside them).
  const demoZonesNearUser =
    typeof location?.latitude === 'number' && typeof location?.longitude === 'number'
      ? [
          {
            latitude: location.latitude + 0.01,
            longitude: location.longitude + 0.01,
            radius: 420,
          },
          {
            latitude: location.latitude - 0.012,
            longitude: location.longitude + 0.006,
            radius: 520,
          },
        ]
      : [];

  const zonesToRender = [...(unsafeZones || []), ...demoZonesNearUser];

  return (
    <View style={styles.root}>
      <MapViewComponent location={location} unsafeZones={zonesToRender} />

      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={[styles.banner, riskBannerStyle]}>
          <Text style={styles.bannerTitle}>{riskText}</Text>
        </View>
        {emergencyMode ? (
          <View style={[styles.banner, styles.bannerEmergency]}>
            <Text style={styles.emergencyText}>Emergency Mode Active</Text>
          </View>
        ) : null}
      </SafeAreaView>

      <SOSButton onPress={handleSOS} disabled={emergencyMode} emergencyMode={emergencyMode} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  safeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  banner: {
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  bannerSafe: {
    backgroundColor: 'rgba(34, 197, 94, 0.95)',
  },
  bannerDanger: {
    backgroundColor: 'rgba(220, 38, 38, 0.95)',
  },
  bannerEmergency: {
    backgroundColor: 'rgba(127, 29, 29, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(254, 202, 202, 0.5)',
  },
  bannerTitle: {
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 16,
  },
  emergencyText: {
    color: '#fee2e2',
    fontWeight: '800',
    textAlign: 'center',
    fontSize: 14,
  },
});
