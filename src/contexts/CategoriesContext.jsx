import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const CategoriesContext = createContext();

export const useCategories = () => useContext(CategoriesContext);

const defaultCategories = [
    { name: 'Tejtermék', icon: '🥛', color: '#10b981' },
    { name: 'Pékáru', icon: '🍞', color: '#f59e0b' },
    { name: 'Hús & Hal', icon: '🥩', color: '#ef4444' },
    { name: 'Zöldség & Gyümölcs', icon: '🥬', color: '#22c55e' },
    { name: 'Fagyasztott', icon: '❄️', color: '#06b6d4' },
    { name: 'Konzerv', icon: '🥫', color: '#f97316' },
    { name: 'Üdítő & Ital', icon: '🥤', color: '#3b82f6' },
    { name: 'Édességek', icon: '🍫', color: '#ec4899' },
    { name: 'Gyógyszer', icon: '💊', color: '#ef4444' },
    { name: 'Kozmetikum', icon: '💄', color: '#a855f7' },
    { name: 'Tisztítószer', icon: '🧼', color: '#06b6d4' },
    { name: 'Háztartási', icon: '🏠', color: '#64748b' },
    { name: 'Egyéb', icon: '📦', color: '#8b5cf6' },
];

export const CategoriesProvider = ({ children }) => {
    const [categories, setCategories] = useState(defaultCategories);
    const [userId, setUserId] = useState(null);

    // Listen for auth changes
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setUserId(session.user.id);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUserId(session.user.id);
            } else {
                setUserId(null);
                setCategories(defaultCategories);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Load categories when user changes
    useEffect(() => {
        if (userId) {
            fetchCategories();
        }
    }, [userId]);

    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('user_id', userId);

        if (!error && data && data.length > 0) {
            setCategories(data);
        } else if (!error && data && data.length === 0) {
            // Initialize with default categories for new users
            await initializeDefaultCategories();
        }
    };

    const initializeDefaultCategories = async () => {
        const categoriesToInsert = defaultCategories.map(cat => ({
            user_id: userId,
            ...cat,
        }));

        const { data, error } = await supabase
            .from('categories')
            .insert(categoriesToInsert)
            .select();

        if (!error && data) {
            setCategories(data);
        }
    };

    const addCategory = async (category) => {
        if (!userId) return;

        const { data, error } = await supabase
            .from('categories')
            .insert([
                {
                    user_id: userId,
                    ...category,
                },
            ])
            .select();

        if (!error && data) {
            setCategories([...categories, data[0]]);
        }
    };

    const updateCategory = async (id, updates) => {
        if (!userId) return;

        const { error } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', id);

        if (!error) {
            setCategories(categories.map(c => c.id === id ? { ...c, ...updates } : c));
        }
    };

    const deleteCategory = async (id) => {
        if (!userId || categories.length <= 1) return;

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (!error) {
            setCategories(categories.filter(c => c.id !== id));
        }
    };

    return (
        <CategoriesContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
            {children}
        </CategoriesContext.Provider>
    );
};
