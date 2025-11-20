import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, Alert, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import MapScreen, { MapScreenHandle } from './components/MapScreen';
import MapControls from './components/MapControls';
import SearchBar from './components/SearchBar';
import LocationButton from './components/LocationButton';
import LocationDetailCard from './components/LocationDetailCard';
import NavigationBanner from './components/NavigationBanner';
import AuthModal from './components/AuthModal';
import SideMenu from './components/SideMenu';
import { searchLocation } from './services/GeocodingService';
import { getRoute, RouteStep } from './services/RoutingService';

const AppContent = () => {
  const { colors, isDark } = useTheme();
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');

  // State for flow control
  const [viewMode, setViewMode] = useState<'IDLE' | 'LOCATION_VIEW' | 'NAVIGATION'>('IDLE');
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [routeCoordinates, setRouteCoordinates] = useState<RouteStep[]>([]);
  const [isAuthModalVisible, setAuthModalVisible] = useState(false);
  const [isSideMenuVisible, setSideMenuVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const mapScreenRef = useRef<MapScreenHandle>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setLoadingMessage('Searching location...');

    const result = await searchLocation(query);
    setIsLoading(false);

    if (result) {
      setDestination({ latitude: result.latitude, longitude: result.longitude });
      setSelectedAddress(result.displayName);
      setViewMode('LOCATION_VIEW');
      setRouteCoordinates([]); // Clear previous route
    } else {
      Alert.alert('Not Found', 'Location not found. Please try a different search.');
    }
  };

  const handleGetDirections = async () => {
    if (!destination) return;

    setIsLoading(true);
    setLoadingMessage('Calculating route...');

    const { status } = await Location.getForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      const route = await getRoute(
        location.coords.latitude,
        location.coords.longitude,
        destination.latitude,
        destination.longitude
      );

      setIsLoading(false);

      if (route && route.length > 0) {
        setRouteCoordinates(route);
        setViewMode('NAVIGATION');
      } else {
        Alert.alert('Error', 'Could not find a route. Please try again.');
      }
    } else {
      setIsLoading(false);
      Alert.alert('Location needed', 'Please enable location permissions to calculate route.');
    }
  };

  const handleCloseLocation = () => {
    setDestination(null);
    setSelectedAddress('');
    setRouteCoordinates([]);
    setViewMode('IDLE');
  };

  const handleLocationPress = () => {
    mapScreenRef.current?.animateToUserLocation();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <MapScreen
        ref={mapScreenRef}
        mapType={mapType}
        destination={destination}
        routeCoordinates={routeCoordinates}
        isNavigating={viewMode === 'NAVIGATION'}
      />

      <SafeAreaView style={styles.overlay}>
        {/* Top Bar - Only show when not in navigation or when idle/viewing */}
        {viewMode !== 'NAVIGATION' && (
          <SearchBar
            onSearch={handleSearch}
            onProfilePress={() => setAuthModalVisible(true)}
            onMenuPress={() => setSideMenuVisible(true)}
          />
        )}

        {/* Controls - Hide when viewing location details to avoid clutter */}
        {viewMode === 'IDLE' && (
          <View style={styles.controlsContainer}>
            <MapControls mapType={mapType} setMapType={setMapType} />
            <View style={{ height: 15 }} />
            <LocationButton onPress={handleLocationPress} />
          </View>
        )}

        {/* Location Detail Card */}
        {viewMode === 'LOCATION_VIEW' && !isLoading && (
          <LocationDetailCard
            title="Selected Location"
            address={selectedAddress}
            onDirectionsPress={handleGetDirections}
            onClose={handleCloseLocation}
          />
        )}

        {/* Navigation Mode UI */}
        {viewMode === 'NAVIGATION' && (
          <View style={styles.navigationContainer}>
            <NavigationBanner
              instruction="Turn Right onto Main St"
              distance="200m"
              onExit={handleCloseLocation}
            />
            {/* Navigation controls can go here */}
            <View style={styles.controlsContainer}>
              <LocationButton onPress={handleLocationPress} />
            </View>
          </View>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <View style={[styles.loadingContainer, { backgroundColor: isDark ? '#1E1E1EF0' : '#FFFFFFF0' }]}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>{loadingMessage}</Text>
          </View>
        )}
      </SafeAreaView>

      <AuthModal
        visible={isAuthModalVisible}
        onClose={() => setAuthModalVisible(false)}
      />

      <SideMenu
        visible={isSideMenuVisible}
        onClose={() => setSideMenuVisible(false)}
      />
    </View>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'box-none',
  },
  controlsContainer: {
    position: 'absolute',
    right: 20,
    bottom: 40, // Move to bottom right
    alignItems: 'center',
  },
  navigationContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  navHeader: {
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
  },
  navText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exitButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  exitText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
