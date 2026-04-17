import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function formatTime(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return String(iso);
  }
}

/**
 * Single alert row for the alerts list.
 */
export default function AlertCard({ alert }) {
  if (!alert) return null;
  const type = alert.type || 'Alert';
  const status = alert.status || 'unknown';
  const lat = alert.latitude ?? alert.lat;
  const lng = alert.longitude ?? alert.lng;

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.type}>{type}</Text>
        <View style={[styles.badge, status === 'sent' ? styles.badgeOk : styles.badgeWarn]}>
          <Text style={styles.badgeText}>{String(status).toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.meta}>
        {lat != null && lng != null ? `${lat.toFixed(5)}, ${lng.toFixed(5)}` : 'Location unavailable'}
      </Text>
      <Text style={styles.time}>{formatTime(alert.timestamp || alert.createdAt)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  type: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  meta: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#94a3b8',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeOk: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  badgeWarn: {
    backgroundColor: 'rgba(234, 179, 8, 0.18)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0f172a',
  },
});
