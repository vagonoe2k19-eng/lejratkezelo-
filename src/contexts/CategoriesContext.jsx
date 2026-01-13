import React, { createContext, useContext, useState, useEffect } from 'react';

const CategoriesContext = createContext();

export const useCategories = () => useContext(CategoriesContext);

const defaultCategories = [
    { id: 1, name: 'Élelmiszer', icon: '🍎', color: '#10b981' },
    { id: 2, name: 'Gyógyszer', icon: '💊', color: '#ef4444' },
    { id: 3, name: 'Kozmetikum', icon: '💄', color: '#ec4899' },
    { id: 4, name: 'Tisztítószer', icon: '🧼', color: '#06b6d4' },
    { id: 5, name: 'Egyéb', icon: '📦', color: '#8b5cf6' },
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
