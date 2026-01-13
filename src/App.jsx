import React, { useState, useEffect } from 'react';
import { Plus, Search, Camera, Trash2, AlertTriangle, CheckCircle, Clock, LogOut } from 'lucide-react';
import Dashboard from './components/Dashboard';
import ProductCard from './components/ProductCard';
import AddProductModal from './components/AddProductModal';
import BarcodeScanner from './components/BarcodeScanner';
import Auth from './components/Auth';

function App() {
    const [currentUser, setCurrentUser] = useState(() => {
        const saved = localStorage.getItem('currentUser');
        return saved ? JSON.parse(saved) : null;
    });

    const [products, setProducts] = useState(() => {
        const key = currentUser ? `products_${currentUser.email}` : 'products_guest';
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : [];
    });

    const [showAddModal, setShowAddModal] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            localStorage.setItem(`products_${currentUser.email}`, JSON.stringify(products));
        } else {
            localStorage.removeItem('currentUser');
        }
    }, [products, currentUser]);

    const addProduct = (product) => {
        setProducts([...products, { ...product, id: Date.now() }]);
        setShowAddModal(false);
        setShowScanner(false);
    };

    const deleteProduct = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const logout = () => {
        setCurrentUser(null);
        setProducts([]);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!currentUser) {
        return <Auth onLogin={setCurrentUser} />;
    }

    return (
        <div className="container">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Lejáratkezelő</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Üdv, {currentUser.name}! Kövesd nyomon termékeid szavatosságát.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-primary" onClick={() => setShowScanner(true)}>
                        <Camera size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Beolvasás
                    </button>
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                        <Plus size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Hozzáadás
                    </button>
                    <button
                        style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}
                        onClick={logout}
                        title="Kijelentkezés"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </header>

            <Dashboard products={products} />

            <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                <input
                    type="text"
                    placeholder="Keresés termékek között..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 12px 12px 45px',
                        background: 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '12px',
                        color: 'white',
                        outline: 'none'
                    }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} onDelete={deleteProduct} />
                ))}
                {filteredProducts.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        <Clock size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>Nincs találat. Adj hozzá egy új terméket!</p>
                    </div>
                )}
            </div>

            {showAddModal && <AddProductModal onClose={() => setShowAddModal(false)} onAdd={addProduct} />}
            {showScanner && <BarcodeScanner onClose={() => setShowScanner(false)} onScan={addProduct} />}
        </div>
    );
}

export default App;
