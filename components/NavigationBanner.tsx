import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';

interface NavigationBannerProps {
    instruction: string;
    distance: string;
    onExit: () => void;
}

const NavigationBanner: React.FC<NavigationBannerProps> = ({ instruction, distance, onExit }) => {
    const { colors, isDark } = useTheme();

    return (
        <LinearGradient
            colors={['#2196F3', '#1976D2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <MaterialIcons name="turn-right" size={48} color="#FFF" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.instruction} numberOfLines={2}>{instruction}</Text>
                    <Text style={styles.distance}>{distance}</Text>
                </View>
                <TouchableOpacity
                    onPress={onExit}
                    style={styles.exitButton}
                    activeOpacity={0.7}
                >
                    <MaterialIcons name="close" size={26} color="#FFF" />
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 50,
        paddingBottom: 25,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        elevation: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
    },
    instruction: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    distance: {
        color: '#FFF',
        fontSize: 17,
        opacity: 0.95,
        fontWeight: '500',
    },
    exitButton: {
        width: 44,
        height: 44,
        backgroundColor: 'rgba(0,0,0,0.25)',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default NavigationBanner;
