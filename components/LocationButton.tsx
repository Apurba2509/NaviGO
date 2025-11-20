import React, { useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface LocationButtonProps {
    onPress: () => void;
    isTracking?: boolean;
}

const LocationButton: React.FC<LocationButtonProps> = ({ onPress, isTracking = false }) => {
    const { colors, isDark } = useTheme();
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isTracking) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isTracking]);

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Animated.View style={[
                styles.button,
                {
                    backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    transform: [{ scale: pulseAnim }],
                }
            ]}>
                <LinearGradient
                    colors={['#2196F3', '#1976D2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    <MaterialIcons name="my-location" size={28} color="#FFF" />
                </LinearGradient>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 6,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        overflow: 'hidden',
    },
    gradient: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default LocationButton;
