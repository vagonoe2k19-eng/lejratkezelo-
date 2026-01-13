import React from 'react';
import { Package, Calendar, Trash2, ArrowRight } from 'lucide-react';

const ProductCard = ({ product, onDelete }) => {
    const getStatus = (date) => {
        const now = new Date();
        const expDate = new Date(date);
        const diffTime = expDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) return { label: 'Lejárt', color: 'var(--danger)', bg: 'rgba(239, 68, 68, 0.1)' };
        if (diffDays <= 7) return { label: `${diffDays} nap maradt`, color: 'var(--warning)', bg: 'rgba(245, 158, 11, 0.1)' };
        return { label: 'Rendben', color: 'var(--safe)', bg: 'rgba(16, 185, 129, 0.1)' };
    };

    const totalQuantity = product.batches.reduce((sum, b) => sum + (b.quantity || 1), 0);

    // Find soonest expiry
    const soonest = [...product.batches].sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate))[0];
    const status = getStatus(soonest.expiryDate);

    return (
        <div className="glass-panel animate-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
            <button
                onClick={() => onDelete(product.id)}
                style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s' }}
                className="delete-btn"
            >
                <Trash2 size={18} />
            </button>

            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{
                        fontSize: '0.7rem',
                        background: 'var(--primary-glow)',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: 700
                    }}>{product.category}</span>
                    {product.barcode && <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>#{product.barcode}</span>}
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'white' }}>{product.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Összesen: {totalQuantity} db</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {product.batches.map((batch, idx) => {
                    const bStatus = getStatus(batch.expiryDate);
                    return (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.6rem 0.8rem', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Calendar size={14} color="var(--text-secondary)" />
                                <span style={{ fontSize: '0.85rem' }}>{batch.expiryDate}</span>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>• {batch.quantity}x</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: bStatus.color }}>{bStatus.label}</span>
                        </div>
                    );
                })}
            </div>

            <div style={{
                marginTop: '0.5rem',
                background: status.bg,
                color: status.color,
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                fontSize: '0.85rem',
                fontWeight: 700,
                textAlign: 'center',
                border: `1px solid ${status.color}30`
            }}>
                Legközelebbi lejárat: {status.label}
            </div>
        </div>
    );
};

export default ProductCard;
