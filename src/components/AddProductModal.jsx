import React, { useState } from 'react';
import { Package, Calendar, Tag, Plus, Trash2, X, MapPin } from 'lucide-react';
import { useCategories } from '../contexts/CategoriesContext';

const AddProductModal = ({ onClose, onAdd }) => {
    const { categories } = useCategories();

    const [formData, setFormData] = useState({
        name: '',
        category: categories[0]?.name || 'Élelmiszer',
        batches: [{ expiryDate: '', quantity: 1, id: Date.now() }],
        barcode: '',
        location: ''
    });

    const addBatch = () => {
        setFormData({
            ...formData,
            batches: [...formData.batches, { expiryDate: '', quantity: 1, id: Date.now() }]
        });
    };

    const removeBatch = (id) => {
        if (formData.batches.length > 1) {
            setFormData({
                ...formData,
                batches: formData.batches.filter(b => b.id !== id)
            });
        }
    };

    const updateBatch = (id, field, value) => {
        setFormData({
            ...formData,
            batches: formData.batches.map(b => b.id === id ? { ...b, [field]: value } : b)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.name && formData.batches.every(b => b.expiryDate)) {
            onAdd(formData);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000, backdropFilter: 'blur(10px)', padding: '1rem'
        }}>
            <form
                className="glass-panel animate-in"
                onSubmit={handleSubmit}
                style={{ padding: '2.5rem', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Új termék felvétele</h2>
                    <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        <X size={24} />
                    </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Termék neve</label>
                            <input
                                autoFocus
                                required
                                className="input-style"
                                type="text"
                                placeholder="Pl: Tej, Aszpirin..."
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Kategória</label>
                            <select
                                className="input-style"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                style={{ appearance: 'none' }}
                            >
                                {categories.map(cat => <option key={cat.id} value={cat.name} style={{ background: '#1e293b' }}>{cat.icon} {cat.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                            Polc/Hely
                        </label>
                        <input
                            className="input-style"
                            type="text"
                            placeholder="Pl: A2, Hűtő, Raktár"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Lejárati dátumok és mennyiség</label>
                            <button type="button" onClick={addBatch} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                                <Plus size={14} /> Több lejárati idő
                            </button>
                        </div>

                        {formData.batches.map((batch, index) => (
                            <div key={batch.id} className="grid" style={{ gridTemplateColumns: '1fr 80px 40px', gap: '0.75rem', alignItems: 'flex-end', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Dátum</label>
                                    <input
                                        required
                                        className="input-style"
                                        type="date"
                                        value={batch.expiryDate}
                                        onChange={e => updateBatch(batch.id, 'expiryDate', e.target.value)}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>db</label>
                                    <input
                                        required
                                        className="input-style"
                                        type="number"
                                        min="1"
                                        value={batch.quantity}
                                        onChange={e => updateBatch(batch.id, 'quantity', parseInt(e.target.value) || 1)}
                                    />
                                </div>
                                <button
                                    type="button"
                                    disabled={formData.batches.length === 1}
                                    onClick={() => removeBatch(batch.id)}
                                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', paddingBottom: '12px', opacity: formData.batches.length === 1 ? 0.3 : 1 }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Vonalkód (opcionális)</label>
                        <input
                            className="input-style"
                            type="text"
                            placeholder="Szkennelés után automatikusan kitöltve"
                            value={formData.barcode}
                            onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Mégse</button>
                        <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>Minden mentése</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProductModal;
