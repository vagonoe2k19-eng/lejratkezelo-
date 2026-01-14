import React, { useState, useEffect } from 'react';
import { Plus, Camera } from 'lucide-react';
import { useTheme } from './contexts/ThemeContext';
import { supabase } from './lib/supabase';
import Dashboard from './components/Dashboard';
import ProductCard from './components/ProductCard';
import AddProductModal from './components/AddProductModal';
import BarcodeScanner from './components/BarcodeScanner';
import Auth from './components/Auth';
import BottomNav from './components/BottomNav';
import TodayView from './components/TodayView';
import CalendarView from './components/CalendarView';
import Settings from './components/Settings';

function App() {
    const { theme } = useTheme();

    const [currentUser, setCurrentUser] = useState(null);
    const [products, setProducts] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [activeView, setActiveView] = useState('home');
    const [loading, setLoading] = useState(true);

    // Check for existing session on mount
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetchUserProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                fetchUserProfile(session.user.id);
            } else {
                setCurrentUser(null);
                setProducts([]);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchUserProfile = async (userId) => {
        const { data: profile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (profile) {
            setCurrentUser({
                id: profile.id,
                email: profile.email,
                name: profile.name,
            });
        }
        setLoading(false);
    };

    // Apply theme colors to CSS variables
    useEffect(() => {
        if (theme) {
            document.documentElement.style.setProperty('--primary', theme.primary);
            document.documentElement.style.setProperty('--secondary', theme.secondary);
            document.documentElement.style.setProperty('--accent', theme.accent);
            document.documentElement.style.setProperty('--bg', theme.background);
            document.documentElement.style.setProperty('--surface', theme.surface);
            document.documentElement.style.setProperty('--text', theme.text);
            document.documentElement.style.setProperty('--text-muted', theme.textMuted);
        }
    }, [theme]);

    // Load products when user changes
    useEffect(() => {
        if (currentUser) {
            fetchProducts();
        } else {
            setProducts([]);
        }
    }, [currentUser]);

    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setProducts(data);
        }
    };

    const addProduct = async (product) => {
        const { data, error } = await supabase
            .from('products')
            .insert([
                {
                    user_id: currentUser.id,
                    name: product.name,
                    category: product.category,
                    barcode: product.barcode || null,
                    location: product.location || null,
                    batches: product.batches,
                },
            ])
            .select();

        if (!error && data) {
            setProducts([data[0], ...products]);
            setShowAddModal(false);
            setShowScanner(false);
        }
    };

    const deleteProduct = async (id) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (!error) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setCurrentUser(null);
        setProducts([]);
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg)'
            }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!currentUser) {
        return <Auth onLogin={setCurrentUser} />;
    }

    const renderView = () => {
        switch (activeView) {
            case 'home':
                return (
                    <div className="container" style={{ paddingTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div>
                                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Lejáratkezelő</h1>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Üdv, {currentUser.name}!</p>
                            </div>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button className="btn btn-secondary btn-icon" onClick={() => setShowScanner(true)}>
                                    <Camera size={20} />
                                </button>
                                <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
                                    <Plus size={20} style={{ marginRight: '4px' }} />
                                    Új
                                </button>
                            </div>
                        </div>

                        <Dashboard products={products} />

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', marginTop: '1.5rem' }}>
                            {products.map(product => (
                                <ProductCard key={product.id} product={product} onDelete={deleteProduct} />
                            ))}
                        </div>
                    </div>
                );
            case 'today':
                return <TodayView products={products} />;
            case 'calendar':
                return <CalendarView products={products} />;
            case 'settings':
                return <Settings onLogout={logout} />;
            default:
                return null;
        }
    };

    return (
        <>
            {renderView()}
            <BottomNav activeView={activeView} setActiveView={setActiveView} />
            {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onAdd={addProduct} />}
            {showScanner && <BarcodeScanner onClose={() => setShowScanner(false)} onScan={addProduct} />}
        </>
    );
}

export default App;
