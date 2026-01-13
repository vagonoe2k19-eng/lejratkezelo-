import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = ({ products }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const getProductsForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        const items = [];

        products.forEach(product => {
            product.batches.forEach(batch => {
                if (batch.expiryDate === dateStr) {
                    items.push({ ...product, quantity: batch.quantity });
                }
            });
        });

        return items;
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const monthNames = ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'];
    const dayNames = ['V', 'H', 'K', 'Sz', 'Cs', 'P', 'Sz'];

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const productsOnDay = getProductsForDate(date);
        const isToday = date.toDateString() === new Date().toDateString();

        days.push(
            <div
                key={day}
                style={{
                    padding: '0.5rem',
                    borderRadius: '8px',
                    background: isToday ? 'rgba(139, 92, 246, 0.2)' : productsOnDay.length > 0 ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                    border: isToday ? '2px solid var(--primary)' : productsOnDay.length > 0 ? '1px solid var(--danger)' : '1px solid transparent',
                    minHeight: '60px',
                    position: 'relative',
                }}
            >
                <div style={{ fontSize: '0.9rem', fontWeight: isToday ? 700 : 400 }}>{day}</div>
                {productsOnDay.length > 0 && (
                    <div style={{
                        position: 'absolute',
                        bottom: '4px',
                        right: '4px',
                        background: 'var(--danger)',
                        color: 'white',
                        borderRadius: '50%',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700
                    }}>
                        {productsOnDay.length}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '1rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <button className="btn btn-secondary btn-icon" onClick={prevMonth}>
                        <ChevronLeft size={20} />
                    </button>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{monthNames[month]} {year}</h2>
                    <button className="btn btn-secondary btn-icon" onClick={nextMonth}>
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {dayNames.map(name => (
                        <div key={name} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                            {name}
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
                    {days}
                </div>

                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.3)', border: '1px solid var(--danger)' }} />
                            <span>Lejáró termékek</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: 'rgba(139, 92, 246, 0.3)', border: '2px solid var(--primary)' }} />
                            <span>Mai nap</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
