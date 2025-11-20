import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Animated } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

interface LocationDetailCardProps {
  title: string;
  address?: string;
  onDirectionsPress: () => void;
  onClose: () => void;
}

const { width } = Dimensions.get('window');

const LocationDetailCard: React.FC<LocationDetailCardProps> = ({ title, address, onDirectionsPress, onClose }) => {
  const { colors, isDark } = useTheme();
  const slideAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
  }, []);

  return (
    <Animated.View style={[
      styles.container, 
      { 
        backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
        shadowColor: isDark ? '#000' : '#666',
        transform: [{ translateY: slideAnim }],
      }
    ]}>
      {/* Drag Handle */}
      <View style={[styles.dragHandle, { backgroundColor: isDark ? '#444' : '#DDD' }]} />
      
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="location" size={24} color={colors.primary} style={styles.locationIcon} />
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{title}</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.6}>
          <Ionicons name="close-circle" size={32} color={colors.text} opacity={0.6} />
        </TouchableOpacity>
      </View>
      
      {address && (
        <Text style={[styles.address, { color: colors.text + 'CC' }]} numberOfLines={3}>
          {address}
        </Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.directionButton, { backgroundColor: colors.primary }]}
          onPress={onDirectionsPress}
          activeOpacity={0.8}
        >
          <MaterialIcons name="directions" size={24} color="#FFF" style={styles.buttonIcon} />
          <Text style={styles.directionText}>Get Directions</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingTop: 16,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    elevation: 25,
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  locationIcon: {
    marginTop: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    lineHeight: 30,
  },
  closeButton: {
    marginLeft: 12,
    marginTop: -4,
  },
  address: {
    fontSize: 15,
    marginBottom: 24,
    lineHeight: 22,
    paddingLeft: 36,
  },
  actions: {
    flexDirection: 'row',
  },
  directionButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    gap: 10,
  },
  buttonIcon: {
    marginRight: 4,
  },
  directionText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.3,
  },
});

export default LocationDetailCard;
