import React from 'react';
import { Home, Calendar, Settings, TrendingUp } from 'lucide-react';

const BottomNav = ({ activeView, setActiveView }) => {
    const navItems = [
        { id: 'home', label: 'Főoldal', icon: Home },
        { id: 'today', label: 'Ma lejár', icon: TrendingUp },
        { id: 'calendar', label: 'Naptár', icon: Calendar },
        { id: 'settings', label: 'Beállítások', icon: Settings },
    ];

    return (
        <nav className="bottom-nav">
            {navItems.map(item => {
                const Icon = item.icon;
                return (
                    <div
                        key={item.id}
                        className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => setActiveView(item.id)}
                    >
                        <Icon size={24} />
                        <span>{item.label}</span>
                    </div>
                );
            })}
        </nav>
    );
};

export default BottomNav;
