import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

interface ThemeColors {
    background: string;
    text: string;
    card: string;
    border: string;
    primary: string;
}

const lightColors: ThemeColors = {
    background: '#FFFFFF',
    text: '#000000',
    card: '#F5F5F5',
    border: '#E0E0E0',
    primary: '#2196F3',
};

const darkColors: ThemeColors = {
    background: '#121212',
    text: '#FFFFFF',
    card: '#1E1E1E',
    border: '#333333',
    primary: '#BB86FC',
};

interface ThemeContextType {
    theme: Theme;
    colors: ThemeColors;
    toggleTheme: () => void;
    isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemScheme = useColorScheme();
    const [theme, setTheme] = useState<Theme>(systemScheme === 'dark' ? 'dark' : 'light');

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const colors = theme === 'light' ? lightColors : darkColors;

    return (
        <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
