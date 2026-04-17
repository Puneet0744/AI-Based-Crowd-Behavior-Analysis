import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * Floating circular SOS trigger (bottom-right).
 */
export default function SOSButton({ onPress, disabled, emergencyMode }) {
  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.button,
          disabled && styles.buttonDisabled,
          pressed && !disabled && styles.buttonPressed,
          emergencyMode && styles.buttonEmergencyGlow,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Send SOS emergency alert"
      >
        <Text style={styles.label}>SOS</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 20,
    bottom: 32,
    zIndex: 20,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.92,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonEmergencyGlow: {
    borderColor: 'rgba(254, 202, 202, 0.9)',
  },
  label: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
