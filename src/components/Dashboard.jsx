import React from 'react';
import { ShieldCheck, AlertCircle, Zap, Package } from 'lucide-react';

const Dashboard = ({ products }) => {
    const getStats = () => {
        const now = new Date();
        let expired = 0;
        let warning = 0;
        let safe = 0;
        let totalItems = 0;

        products.forEach(p => {
            p.batches.forEach(b => {
                const expDate = new Date(b.expiryDate);
                const diffDays = Math.ceil((expDate - now) / (1000 * 60 * 60 * 24));
                const qty = b.quantity || 1;

                totalItems += qty;
                if (diffDays <= 0) expired += qty;
                else if (diffDays <= 7) warning += qty;
                else safe += qty;
            });
        });

        return { expired, warning, safe, totalItems };
    };

    const { expired, warning, safe, totalItems } = getStats();

    const cards = [
        { label: 'Rendben lévők', value: safe, color: 'var(--safe)', icon: ShieldCheck, desc: 'Friss és biztonságos' },
        { label: 'Sürgős figyelés', value: warning, color: 'var(--warning)', icon: Zap, desc: 'Lejár 7 napon belül' },
        { label: 'Lejárt tételek', value: expired, color: 'var(--danger)', icon: AlertCircle, desc: 'Ezeket dobd ki!' }
    ];

    return (
        <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Package className="animate-in" size={24} color="var(--primary)" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Összegzés: {totalItems} termék összesen</h2>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {cards.map((card, i) => (
                    <div key={i} className="glass-panel animate-in" style={{
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        animationDelay: `${i * 0.1}s`,
                        borderLeft: `4px solid ${card.color}`
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ background: `${card.color}15`, padding: '10px', borderRadius: '12px' }}>
                                <card.icon color={card.color} size={24} />
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>{card.value}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>darab</div>
                            </div>
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, marginBottom: '2px' }}>{card.label}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{card.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
