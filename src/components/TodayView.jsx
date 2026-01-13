import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';

const TodayView = ({ products }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const expiringToday = [];

    products.forEach(product => {
        product.batches.forEach(batch => {
            const expDate = new Date(batch.expiryDate);
            expDate.setHours(0, 0, 0, 0);

            if (expDate.getTime() === today.getTime()) {
                expiringToday.push({
                    ...product,
                    batch,
                    expiryDate: batch.expiryDate,
                    quantity: batch.quantity
                });
            }
        });
    });

    return (
        <div className="container" style={{ paddingTop: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <AlertTriangle size={28} color="var(--danger)" />
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Ma lejár</h2>
            </div>

            {expiringToday.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <Clock size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Nincs ma lejáró termék! 🎉</p>
                </div>
            ) : (
                <div className="grid">
                    {expiringToday.map((item, idx) => (
                        <div key={idx} className="glass-panel animate-in" style={{ padding: '1.25rem', borderLeft: '4px solid var(--danger)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{item.name}</h3>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                        {item.category} • {item.quantity}x
                                    </p>
                                </div>
                                <span style={{
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    color: 'var(--danger)',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700
                                }}>
                                    MA LEJÁR
                                </span>
                            </div>

                            {item.location && (
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    📍 {item.location}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TodayView;
