import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface MapControlsProps {
    mapType: 'standard' | 'satellite';
    setMapType: (type: 'standard' | 'satellite') => void;
}

const MapControls: React.FC<MapControlsProps> = ({ mapType, setMapType }) => {
    const { colors, toggleTheme, isDark } = useTheme();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    }
                ]}
                onPress={toggleTheme}
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                    <Ionicons
                        name={isDark ? 'sunny' : 'moon'}
                        size={28}
                        color={colors.primary}
                    />
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.button,
                    {
                        backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    }
                ]}
                onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                    <MaterialCommunityIcons
                        name={mapType === 'standard' ? 'satellite-variant' : 'map'}
                        size={28}
                        color={colors.primary}
                    />
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        gap: 12,
    },
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
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default MapControls;
