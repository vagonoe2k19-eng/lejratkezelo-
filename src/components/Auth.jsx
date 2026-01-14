import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Auth = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                // Login with Supabase
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: formData.email,
                    password: formData.password,
                });

                if (error) throw error;

                // Fetch user profile
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('*')
                    .eq('id', data.user.id)
                    .single();

                onLogin({
                    id: data.user.id,
                    email: data.user.email,
                    name: profile?.name || data.user.email,
                });
            } else {
                // Register with Supabase
                const { data, error } = await supabase.auth.signUp({
                    email: formData.email,
                    password: formData.password,
                });

                if (error) throw error;

                if (data.user) {
                    // Create user profile
                    const { error: profileError } = await supabase
                        .from('user_profiles')
                        .insert([
                            {
                                id: data.user.id,
                                email: formData.email,
                                name: formData.name,
                            },
                        ]);

                    if (profileError) throw profileError;

                    onLogin({
                        id: data.user.id,
                        email: formData.email,
                        name: formData.name,
                    });
                }
            }
        } catch (error) {
            setError(error.message || 'Hiba történt!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-gradient)',
            padding: '1rem'
        }}>
            <div className="glass-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '2rem' }}>Lejáratkezelő</h1>
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                    {isLogin ? 'Jelentkezz be a fiókodba' : 'Hozz létre egy új fiókot'}
                </p>

                <form onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Név</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'white', outline: 'none' }}
                                />
                            </div>
                        </div>
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>E-mail cím</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'white', outline: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Jelszó</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'white', outline: 'none' }}
                            />
                        </div>
                        {!isLogin && (
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                Minimum 6 karakter
                            </p>
                        )}
                    </div>

                    {error && <p style={{ color: 'var(--status-danger)', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: loading ? 0.6 : 1 }}
                    >
                        {loading ? 'Betöltés...' : (isLogin ? 'Bejelentkezés' : 'Regisztráció')}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>

                <p style={{ marginTop: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {isLogin ? 'Nincs még fiókod?' : 'Már van fiókod?'}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', marginLeft: '5px' }}
                    >
                        {isLogin ? 'Regisztrálj!' : 'Jelentkezz be!'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Auth;
