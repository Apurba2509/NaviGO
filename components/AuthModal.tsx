import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Dimensions, TextInput, ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
    visible: boolean;
    onClose: () => void;
}

const { width, height } = Dimensions.get('window');

const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose }) => {
    const { colors, isDark } = useTheme();
    const { signInWithEmail, signUpWithEmail, signInWithGoogle, user } = useAuth();

    const [mode, setMode] = useState<'signin' | 'signup'>('signin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Reset state when modal opens/closes
    useEffect(() => {
        if (visible) {
            setSuccess(false);
            setLoading(false);
        }
    }, [visible]);

    // Handle successful login
    useEffect(() => {
        if (user && visible && !loading) {
            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1500);
        }
    }, [user, visible]);

    const handleEmailAuth = async () => {
        if (!email || !password) {
            Alert.alert('Missing Information', 'Please fill in all fields to continue.');
            return;
        }

        setLoading(true);
        try {
            if (mode === 'signin') {
                await signInWithEmail(email, password);
            } else {
                if (!name) {
                    Alert.alert('Missing Information', 'Please enter your full name.');
                    setLoading(false);
                    return;
                }
                await signUpWithEmail(email, password, name);
            }
            // Success is handled by the useEffect above
        } catch (error: any) {
            Alert.alert('Authentication Failed', error.message);
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            // Success is handled by the useEffect above
        } catch (error: any) {
            Alert.alert('Google Sign-In Failed', error.message);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Modal animationType="fade" transparent={true} visible={visible}>
                <View style={styles.successCenteredView}>
                    <BlurView intensity={90} tint={isDark ? 'dark' : 'light'} style={styles.absolute} />
                    <View style={[styles.successCard, { backgroundColor: isDark ? '#1E1E1E' : '#FFF' }]}>
                        <LinearGradient
                            colors={['#4CAF50', '#2E7D32']}
                            style={styles.successIconContainer}
                        >
                            <Ionicons name="checkmark" size={50} color="#FFF" />
                        </LinearGradient>
                        <Text style={[styles.successTitle, { color: colors.text }]}>Welcome Back!</Text>
                        <Text style={[styles.successText, { color: colors.text }]}>
                            {user?.name ? `Great to see you, ${user.name.split(' ')[0]}` : 'You are now signed in'}
                        </Text>
                    </View>
                </View>
            </Modal>
        );
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.centeredView}
            >
                <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1}>
                    <BlurView intensity={20} tint="dark" style={styles.absolute} />
                </TouchableOpacity>

                <View style={[
                    styles.modalView,
                    { backgroundColor: isDark ? '#121212' : '#FFFFFF' }
                ]}>
                    {/* Header Image/Gradient */}
                    <View style={styles.headerContainer}>
                        <LinearGradient
                            colors={['#2196F3', '#1565C0']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.headerGradient}
                        >
                            <View style={styles.headerContent}>
                                <View style={styles.logoContainer}>
                                    <Ionicons name="navigate" size={40} color="#FFF" />
                                </View>
                                <Text style={styles.welcomeText}>NaviGO</Text>
                                <Text style={styles.taglineText}>Premium Navigation</Text>
                            </View>

                            {/* Decorative Circles */}
                            <View style={styles.circle1} />
                            <View style={styles.circle2} />
                        </LinearGradient>

                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <BlurView intensity={30} tint="light" style={styles.closeButtonBlur}>
                                <Ionicons name="close" size={24} color="#FFF" />
                            </BlurView>
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.contentContainer}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 24 }}
                    >
                        {/* Tabs */}
                        <View style={[styles.tabContainer, { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' }]}>
                            <TouchableOpacity
                                style={[styles.tab, mode === 'signin' && styles.activeTab]}
                                onPress={() => setMode('signin')}
                            >
                                <Text style={[
                                    styles.tabText,
                                    { color: mode === 'signin' ? '#2196F3' : (isDark ? '#888' : '#666') }
                                ]}>Sign In</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, mode === 'signup' && styles.activeTab]}
                                onPress={() => setMode('signup')}
                            >
                                <Text style={[
                                    styles.tabText,
                                    { color: mode === 'signup' ? '#2196F3' : (isDark ? '#888' : '#666') }
                                ]}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.formContainer}>
                            {mode === 'signup' && (
                                <View style={[styles.inputWrapper, { borderColor: isDark ? '#333' : '#E0E0E0' }]}>
                                    <Ionicons name="person-outline" size={20} color={isDark ? '#AAA' : '#666'} style={styles.inputIcon} />
                                    <TextInput
                                        style={[styles.input, { color: colors.text }]}
                                        placeholder="Full Name"
                                        placeholderTextColor={isDark ? '#666' : '#999'}
                                        value={name}
                                        onChangeText={setName}
                                        autoCapitalize="words"
                                    />
                                </View>
                            )}

                            <View style={[styles.inputWrapper, { borderColor: isDark ? '#333' : '#E0E0E0' }]}>
                                <Ionicons name="mail-outline" size={20} color={isDark ? '#AAA' : '#666'} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="Email Address"
                                    placeholderTextColor={isDark ? '#666' : '#999'}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={[styles.inputWrapper, { borderColor: isDark ? '#333' : '#E0E0E0' }]}>
                                <Ionicons name="lock-closed-outline" size={20} color={isDark ? '#AAA' : '#666'} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, { color: colors.text }]}
                                    placeholder="Password"
                                    placeholderTextColor={isDark ? '#666' : '#999'}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={handleEmailAuth}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={['#2196F3', '#1976D2']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.gradientButton}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#FFF" />
                                    ) : (
                                        <Text style={styles.primaryButtonText}>
                                            {mode === 'signin' ? 'Sign In' : 'Create Account'}
                                        </Text>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={styles.dividerContainer}>
                                <View style={[styles.line, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />
                                <Text style={[styles.orText, { color: isDark ? '#666' : '#999' }]}>OR</Text>
                                <View style={[styles.line, { backgroundColor: isDark ? '#333' : '#E0E0E0' }]} />
                            </View>

                            <TouchableOpacity
                                style={[styles.googleButton, { borderColor: isDark ? '#333' : '#E0E0E0' }]}
                                onPress={handleGoogleSignIn}
                                disabled={loading}
                            >
                                <Image
                                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                                    style={styles.googleIcon}
                                />
                                <View style={styles.googleIconPlaceholder}>
                                    <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
                                </View>
                                <Text style={[styles.googleButtonText, { color: colors.text }]}>Continue with Google</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    successCenteredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalView: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        overflow: 'hidden',
        elevation: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        minHeight: height * 0.65,
    },
    headerContainer: {
        height: 200,
        position: 'relative',
    },
    headerGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContent: {
        alignItems: 'center',
        zIndex: 2,
    },
    logoContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
        letterSpacing: 1,
    },
    taglineText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    circle1: {
        position: 'absolute',
        top: -50,
        left: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    circle2: {
        position: 'absolute',
        bottom: -30,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
    },
    closeButtonBlur: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    contentContainer: {
        padding: 24,
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
        marginBottom: 24,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    tabText: {
        fontWeight: '600',
        fontSize: 15,
    },
    formContainer: {
        gap: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
    },
    primaryButton: {
        height: 56,
        borderRadius: 12,
        overflow: 'hidden',
        marginTop: 8,
        elevation: 4,
        shadowColor: '#2196F3',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    gradientButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 16,
    },
    line: {
        flex: 1,
        height: 1,
    },
    orText: {
        marginHorizontal: 16,
        fontSize: 14,
        fontWeight: '500',
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 12,
        borderWidth: 1,
        gap: 12,
    },
    googleIcon: {
        width: 24,
        height: 24,
        display: 'none', // Using vector icon instead for reliability
    },
    googleIconPlaceholder: {
        // Wrapper for vector icon
    },
    googleButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    successCard: {
        width: width * 0.8,
        padding: 32,
        borderRadius: 24,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
    },
    successIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    successText: {
        fontSize: 16,
        opacity: 0.7,
        textAlign: 'center',
    },
});

export default AuthModal;
