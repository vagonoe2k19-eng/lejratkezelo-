import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

const defaultThemes = {
    dark: {
        primary: '#8b5cf6',
        secondary: '#ec4899',
        accent: '#06b6d4',
        background: '#020617',
        surface: 'rgba(15, 23, 42, 0.6)',
        text: '#f8fafc',
        textMuted: '#94a3b8',
    },
    light: {
        primary: '#7c3aed',
        secondary: '#db2777',
        accent: '#0891b2',
        background: '#f8fafc',
        surface: 'rgba(255, 255, 255, 0.9)',
        text: '#0f172a',
        textMuted: '#64748b',
    }
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : true;
    });

    const [customColors, setCustomColors] = useState(() => {
        const saved = localStorage.getItem('customColors');
        return saved ? JSON.parse(saved) : null;
    });

    const theme = customColors || (isDark ? defaultThemes.dark : defaultThemes.light);

    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        if (customColors) {
            localStorage.setItem('customColors', JSON.stringify(customColors));
        }
    }, [isDark, customColors]);

    const toggleTheme = () => setIsDark(!isDark);

    const setCustomTheme = (colors) => {
        setCustomColors(colors);
    };

    const resetTheme = () => {
        setCustomColors(null);
        localStorage.removeItem('customColors');
    };

    return (
        <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setCustomTheme, resetTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
