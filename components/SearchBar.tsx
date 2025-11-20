import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface SearchBarProps {
    onSearch: (query: string) => void;
    onProfilePress: () => void;
    onMenuPress: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onProfilePress, onMenuPress }) => {
    const { colors, isDark } = useTheme();
    const { user } = useAuth();
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isFocused) {
            Animated.sequence([
                Animated.spring(scaleAnim, {
                    toValue: 1.02,
                    useNativeDriver: true,
                    tension: 50,
                }),
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [isFocused]);

    const handleSearch = () => {
        if (query.trim()) {
            onSearch(query);
            setIsFocused(false);
        }
    };

    return (
        <Animated.View style={[
            styles.container,
            {
                backgroundColor: isDark ? '#1E1E1E' : '#FFFFFF',
                shadowColor: isDark ? '#000' : '#2196F3',
                transform: [{ scale: scaleAnim }],
            }
        ]}>
            <TouchableOpacity style={styles.menuButton} onPress={onMenuPress} activeOpacity={0.7}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                    <Ionicons name="menu" size={24} color={colors.primary} />
                </View>
            </TouchableOpacity>

            <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Where to?"
                placeholderTextColor={isDark ? '#888' : '#999'}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                returnKeyType="search"
            />

            {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')} style={styles.clearButton} activeOpacity={0.6}>
                    <Ionicons name="close-circle" size={22} color={colors.text} opacity={0.5} />
                </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.profileButton} onPress={onProfilePress} activeOpacity={0.7}>
                {user?.photoURL ? (
                    <Image source={{ uri: user.photoURL }} style={styles.avatar} />
                ) : (
                    <LinearGradient
                        colors={user ? ['#2196F3', '#1976D2'] : ['#999', '#777']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.avatar}
                    >
                        <Text style={styles.avatarText}>{user ? user.avatarInitials : '?'}</Text>
                    </LinearGradient>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 55,
        left: 15,
        right: 15,
        height: 56,
        borderRadius: 28,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 6,
        elevation: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    menuButton: {
        marginRight: 4,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 17,
        fontWeight: '500',
        paddingHorizontal: 12,
    },
    clearButton: {
        padding: 8,
        marginRight: 4,
    },
    profileButton: {
        marginLeft: 4,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    avatarText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 18,
    },
});

export default SearchBar;
