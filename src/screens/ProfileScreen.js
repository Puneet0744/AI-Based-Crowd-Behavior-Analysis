import React from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const onLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch {
            Alert.alert('Error', 'Could not log out.');
          }
        },
      },
    ]);
  };

  const verified = !!user?.token;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Profile</Text>

      <View style={styles.card}>
        <Row label="Name" value={user?.name || '—'} />
        <Row label="Nationality" value={user?.nationality || '—'} />
        <Row label="Email" value={user?.email || '—'} />
        <Row label="User ID" value={user?.userId || '—'} />
        <Row
          label="Verification"
          value={verified ? 'Verified' : 'Not verified'}
          valueStyle={verified ? styles.ok : styles.warn}
        />
      </View>

      <Pressable onPress={onLogout} style={({ pressed }) => [styles.logout, pressed && styles.pressed]}>
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function Row({ label, value, valueStyle }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, valueStyle]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  row: {
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(148,163,184,0.35)',
  },
  label: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '700',
  },
  ok: {
    color: '#15803d',
  },
  warn: {
    color: '#b45309',
  },
  logout: {
    marginHorizontal: 16,
    marginTop: 22,
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  pressed: {
    opacity: 0.9,
  },
});
