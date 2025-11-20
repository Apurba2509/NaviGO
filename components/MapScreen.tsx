import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, Dimensions, Alert, ActivityIndicator } from 'react-native';
import MapView, { UrlTile, Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import { RouteStep } from '../services/RoutingService';

const { width, height } = Dimensions.get('window');

export interface MapScreenHandle {
    animateToUserLocation: () => void;
}

interface MapScreenProps {
    mapType: 'standard' | 'satellite';
    routeCoordinates?: RouteStep[];
    destination?: { latitude: number; longitude: number } | null;
    isNavigating?: boolean;
}

const WEST_BENGAL_REGION = {
    latitude: 22.9868,
    longitude: 87.8550,
    latitudeDelta: 4.0,
    longitudeDelta: 4.0,
};

const MapScreen = forwardRef<MapScreenHandle, MapScreenProps>(({ mapType, routeCoordinates, destination, isNavigating }, ref) => {
    const { colors, isDark } = useTheme();
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const mapRef = useRef<MapView>(null);

    useImperativeHandle(ref, () => ({
        animateToUserLocation: async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Location permission is required.');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
            if (location && mapRef.current) {
                const camera = {
                    center: {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    },
                    pitch: isNavigating ? 45 : 0,
                    heading: location.coords.heading || 0,
                    altitude: isNavigating ? 1000 : 10000,
                    zoom: isNavigating ? 18 : 15,
                };
                mapRef.current.animateCamera(camera, { duration: 1000 });
            }
        }
    }));

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLocation(location);
        })();
    }, []);

    // Handle Navigation Mode Camera
    useEffect(() => {
        if (isNavigating && location && mapRef.current) {
            const camera = {
                center: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                },
                pitch: 45, // Tilt for navigation
                heading: location.coords.heading || 0,
                zoom: 18,
                altitude: 500,
            };
            mapRef.current.animateCamera(camera, { duration: 1000 });
        } else if (!isNavigating && mapRef.current && location) {
            // Reset camera when exiting navigation
            const camera = {
                center: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                },
                pitch: 0,
                heading: 0,
                zoom: 15,
                altitude: 2000,
            };
            mapRef.current.animateCamera(camera, { duration: 1000 });
        }
    }, [isNavigating, location]);

    useEffect(() => {
        if (destination && mapRef.current && !isNavigating) {
            mapRef.current.animateToRegion({
                latitude: destination.latitude,
                longitude: destination.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
            });
        }
    }, [destination, isNavigating]);

    useEffect(() => {
        if (routeCoordinates && routeCoordinates.length > 0 && mapRef.current && !isNavigating) {
            mapRef.current.fitToCoordinates(routeCoordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [routeCoordinates, isNavigating]);

    // Tile URLs
    const tileUrl = mapType === 'standard'
        ? (isDark
            ? 'https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'
            : 'https://cartodb-basemaps-a.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}.png')
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={WEST_BENGAL_REGION}
                mapType="none"
                showsUserLocation={true}
                showsMyLocationButton={false}
                showsCompass={false}
                rotateEnabled={true}
                pitchEnabled={true}
            >
                <UrlTile
                    urlTemplate={tileUrl}
                    maximumZ={19}
                    flipY={false}
                    zIndex={1}
                />

                {destination && (
                    <Marker
                        coordinate={destination}
                        title="Destination"
                    />
                )}

                {routeCoordinates && routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor={colors.primary}
                        strokeWidth={5}
                        zIndex={2}
                    />
                )}

            </MapView>
            {errorMsg && (
                <View style={[styles.errorContainer, { backgroundColor: colors.card }]}>
                    <ActivityIndicator size="small" color={colors.primary} />
                </View>
            )}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map: {
        width: width,
        height: height,
    },
    errorContainer: {
        position: 'absolute',
        bottom: 20,
        padding: 10,
        borderRadius: 8,
    },
});

export default MapScreen;
