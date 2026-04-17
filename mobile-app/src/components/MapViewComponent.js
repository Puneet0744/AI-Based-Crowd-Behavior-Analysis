import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Circle, PROVIDER_GOOGLE } from 'react-native-maps';
import { Platform } from 'react-native';

const INITIAL_REGION = {
  latitude: 13.0827,
  longitude: 80.2707,
  latitudeDelta: 2.5,
  longitudeDelta: 2.5,
};

/**
 * Full-screen map with user location and unsafe zone circles.
 */
export default function MapViewComponent({ location, unsafeZones }) {
  const region = useMemo(() => {
    if (location?.latitude != null && location?.longitude != null) {
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      };
    }
    return INITIAL_REGION;
  }, [location?.latitude, location?.longitude]);

  const mapProvider = Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined;

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={mapProvider}
        initialRegion={INITIAL_REGION}
        region={region}
        showsUserLocation
        followsUserLocation={true}
        showsMyLocationButton={false}
        mapPadding={{ top: 100, right: 0, bottom: 100, left: 0 }}
      >
        {(unsafeZones || []).map((z, index) => (
          <Circle
            key={`zone-${index}-${z.latitude}-${z.longitude}`}
            center={{ latitude: z.latitude, longitude: z.longitude }}
            radius={z.radius}
            strokeColor="rgba(127, 29, 29, 0.95)"
            fillColor="rgba(220, 38, 38, 0.22)"
            strokeWidth={2}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
