import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Dimensions, ScrollView, Image, Animated } from 'react-native';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface SideMenuProps {
    visible: boolean;
    onClose: () => void;
}

const { width, height } = Dimensions.get('window');
const MENU_WIDTH = width * 0.8;

const SideMenu: React.FC<SideMenuProps> = ({ visible, onClose }) => {
    const { colors, isDark, toggleTheme } = useTheme();
    const { user, logout, isAuthenticated } = useAuth();
    const slideAnim = useRef(new Animated.Value(-MENU_WIDTH)).current;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: visible ? 0 : -MENU_WIDTH,
            useNativeDriver: true,
            tension: 50,
            friction: 9,
        }).start();
    }, [visible]);

    const handleLogout = async () => {
        try {
            await logout();
            onClose();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const menuSections = [
        {
            items: [
                { icon: 'time-outline', label: 'Recent Searches', iconPack: 'ionic' as const },
                { icon: 'bookmark-outline', label: 'Saved Places', iconPack: 'ionic' as const },
                { icon: 'star-outline', label: 'Favorites', iconPack: 'ionic' as const },
            ]
        },
        {
            items: [
                { icon: 'share-social-outline', label: 'Share Location', iconPack: 'ionic' as const },
                { icon: 'navigate-circle-outline', label: 'Offline Maps', iconPack: 'ionic' as const },
                { icon: 'car-sport-outline', label: 'Driving Mode', iconPack: 'ionic' as const },
            ]
        },
        {
            items: [
                { icon: 'settings-outline', label: 'Settings', iconPack: 'ionic' as const },
                { icon: 'help-circle-outline', label: 'Help & Support', iconPack: 'ionic' as const },
                { icon: 'information-circle-outline', label: 'About NaviGO', iconPack: 'ionic' as const },
            ]
        }
    ];

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    onPress={onClose}
                    activeOpacity={1}
                />

                <Animated.View style={[
                    styles.menuContainer,
                    {
                        transform: [{ translateX: slideAnim }],
                        backgroundColor: isDark ? '#121212' : '#FAFAFA',
                    }
                ]}>
                    {/* Profile Header */}
                    <LinearGradient
                        colors={isAuthenticated ? ['#2196F3', '#1976D2'] : ['#666', '#444']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.header}
                    >
                        <View style={styles.profileSection}>
                            {user?.photoURL ? (
                                <Image source={{ uri: user.photoURL }} style={styles.avatar} />
                            ) : (
                                <View style={styles.avatarPlaceholder}>
                                    <Text style={styles.avatarText}>{user?.avatarInitials || 'G'}</Text>
                                </View>
                            )}
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
                                <Text style={styles.userEmail}>{user?.email || 'Sign in to save places'}</Text>
                            </View>
                        </View>
                    </LinearGradient>

                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        {menuSections.map((section, sectionIndex) => (
                            <View key={sectionIndex} style={styles.section}>
                                {section.items.map((item, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.menuItem,
                                            { backgroundColor: isDark ? '#1E1E1E' : '#FFF' }
                                        ]}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                                            <Ionicons
                                                name={item.icon as any}
                                                size={24}
                                                color={colors.primary}
                                            />
                                        </View>
                                        <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
                                        <Ionicons name="chevron-forward" size={20} color={colors.text} opacity={0.3} />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}

                        {/* Theme Toggle */}
                        <View style={styles.section}>
                            <TouchableOpacity
                                style={[
                                    styles.menuItem,
                                    { backgroundColor: isDark ? '#1E1E1E' : '#FFF' }
                                ]}
                                onPress={toggleTheme}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
                                    <Ionicons
                                        name={isDark ? 'sunny' : 'moon'}
                                        size={24}
                                        color={colors.primary}
                                    />
                                </View>
                                <Text style={[styles.menuLabel, { color: colors.text }]}>
                                    {isDark ? 'Light Mode' : 'Dark Mode'}
                                </Text>
                                <View style={[styles.toggle, { backgroundColor: isDark ? '#2196F3' : '#DDD' }]}>
                                    <View style={[
                                        styles.toggleCircle,
                                        { transform: [{ translateX: isDark ? 22 : 2 }] }
                                    ]} />
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Logout Button */}
                        {isAuthenticated && (
                            <TouchableOpacity
                                style={styles.logoutButton}
                                onPress={handleLogout}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#FF3B30', '#D32F2F']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.logoutGradient}
                                >
                                    <MaterialIcons name="logout" size={22} color="#FFF" />
                                    <Text style={styles.logoutText}>Sign Out</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    </ScrollView>

                    {/* Footer */}
                    <View style={[styles.footer, { borderTopColor: colors.border }]}>
                        <Text style={[styles.versionText, { color: colors.text }]}>
                            NaviGO v1.0.0 • Premium Navigation
                        </Text>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    backdrop: {
        flex: 1,
    },
    menuContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: MENU_WIDTH,
        maxWidth: 360,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 4, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 24,
        paddingHorizontal: 20,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 3,
        borderColor: '#FFF',
    },
    avatarPlaceholder: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    avatarText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    userEmail: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 14,
    },
    content: {
        flex: 1,
        paddingTop: 8,
    },
    section: {
        paddingHorizontal: 16,
        marginBottom: 12,
        gap: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuLabel: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    toggle: {
        width: 48,
        height: 28,
        borderRadius: 14,
        padding: 2,
    },
    toggleCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#FFF',
        elevation: 2,
    },
    logoutButton: {
        marginHorizontal: 16,
        marginVertical: 12,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
    },
    logoutGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 12,
    },
    logoutText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: 'bold',
    },
    footer: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    versionText: {
        opacity: 0.5,
        fontSize: 12,
        fontWeight: '500',
    },
});

export default SideMenu;
