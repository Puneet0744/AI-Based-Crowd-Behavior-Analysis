import React, { useCallback } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AlertCard from '../components/AlertCard';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export default function AlertScreen() {
  const { user } = useAuth();
  const { alerts, refreshAlerts } = useApp();
  const [refreshing, setRefreshing] = React.useState(false);

  const load = useCallback(async () => {
    await refreshAlerts(user?.userId);
  }, [refreshAlerts, user?.userId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.heading}>Alerts</Text>
      <Text style={styles.caption}>Your SOS and safety notifications</Text>

      <FlatList
        data={alerts}
        keyExtractor={(item, index) => String(item.id ?? item.timestamp ?? index)}
        renderItem={({ item }) => <AlertCard alert={item} />}
        contentContainerStyle={alerts.length === 0 ? styles.emptyWrap : styles.listPad}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No alerts yet</Text>
            <Text style={styles.emptySub}>Pull to refresh</Text>
          </View>
        }
      />
    </SafeAreaView>
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
  },
  caption: {
    fontSize: 14,
    color: '#64748b',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  listPad: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyWrap: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  emptySub: {
    marginTop: 6,
    color: '#94a3b8',
  },
});
