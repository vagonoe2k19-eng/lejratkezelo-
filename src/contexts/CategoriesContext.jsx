import React, { createContext, useContext, useState, useEffect } from 'react';

const CategoriesContext = createContext();

export const useCategories = () => useContext(CategoriesContext);

const defaultCategories = [
    { id: 1, name: 'Tejtermék', icon: '🥛', color: '#10b981' },
    { id: 2, name: 'Pékáru', icon: '🍞', color: '#f59e0b' },
    { id: 3, name: 'Hús & Hal', icon: '🥩', color: '#ef4444' },
    { id: 4, name: 'Zöldség & Gyümölcs', icon: '🥬', color: '#22c55e' },
    { id: 5, name: 'Fagyasztott', icon: '❄️', color: '#06b6d4' },
    { id: 6, name: 'Konzerv', icon: '🥫', color: '#f97316' },
    { id: 7, name: 'Üdítő & Ital', icon: '🥤', color: '#3b82f6' },
    { id: 8, name: 'Édességek', icon: '🍫', color: '#ec4899' },
    { id: 9, name: 'Gyógyszer', icon: '💊', color: '#ef4444' },
    { id: 10, name: 'Kozmetikum', icon: '💄', color: '#a855f7' },
    { id: 11, name: 'Tisztítószer', icon: '🧼', color: '#06b6d4' },
    { id: 12, name: 'Háztartási', icon: '🏠', color: '#64748b' },
    { id: 13, name: 'Egyéb', icon: '📦', color: '#8b5cf6' },
];

export const CategoriesProvider = ({ children }) => {
    const [categories, setCategories] = useState(() => {
        const saved = localStorage.getItem('categories');
        return saved ? JSON.parse(saved) : defaultCategories;
    });

    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories]);

    const addCategory = (category) => {
        setCategories([...categories, { ...category, id: Date.now() }]);
    };

    const updateCategory = (id, updates) => {
        setCategories(categories.map(c => c.id === id ? { ...c, ...updates } : c));
    };

    const deleteCategory = (id) => {
        if (categories.length > 1) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    return (
        <CategoriesContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
            {children}
        </CategoriesContext.Provider>
    );
};
