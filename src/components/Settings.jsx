import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Palette, RotateCcw } from 'lucide-react';

const Settings = () => {
    const { theme, isDark, toggleTheme, setCustomTheme, resetTheme } = useTheme();
    const [showColorPicker, setShowColorPicker] = React.useState(false);
    const [customColors, setCustomColors] = React.useState({
        primary: theme.primary,
        secondary: theme.secondary,
        accent: theme.accent,
    });

    const handleColorChange = (key, value) => {
        setCustomColors({ ...customColors, [key]: value });
    };

    const applyCustomTheme = () => {
        setCustomTheme({
            ...theme,
            ...customColors,
        });
        setShowColorPicker(false);
    };

    return (
        <div className="container" style={{ paddingTop: '1rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1.5rem' }}>Beállítások</h2>

            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Téma</h3>

                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                    <button
                        className="btn btn-secondary"
                        onClick={toggleTheme}
                        style={{ flex: 1 }}
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                        {isDark ? 'Világos mód' : 'Sötét mód'}
                    </button>

                    <button
                        className="btn btn-secondary btn-icon"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                    >
                        <Palette size={20} />
                    </button>

                    <button
                        className="btn btn-secondary btn-icon"
                        onClick={resetTheme}
                        title="Alapértelmezett téma"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>

                {showColorPicker && (
                    <div className="animate-in" style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                        <h4 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Egyéni színek</h4>

                        {Object.keys(customColors).map(key => (
                            <div key={key} style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                                    {key === 'primary' ? 'Elsődleges' : key === 'secondary' ? 'Másodlagos' : 'Kiemelés'}
                                </label>
                                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                                    <input
                                        type="color"
                                        value={customColors[key]}
                                        onChange={(e) => handleColorChange(key, e.target.value)}
                                        style={{ width: '60px', height: '48px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                    />
                                    <input
                                        type="text"
                                        value={customColors[key]}
                                        onChange={(e) => handleColorChange(key, e.target.value)}
                                        className="input-style"
                                        style={{ flex: 1 }}
                                    />
                                </div>
                            </div>
                        ))}

                        <button className="btn btn-primary" onClick={applyCustomTheme} style={{ width: '100%', marginTop: '0.5rem' }}>
                            Alkalmazás
                        </button>
                    </div>
                )}
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Információ</h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                    <p><strong>Verzió:</strong> 2.0.0</p>
                    <p><strong>Készítette:</strong> Vágó Noé</p>
                    <p style={{ marginTop: '1rem' }}>Lejáratkezelő - Modern termék nyilvántartó rendszer boltok számára.</p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
