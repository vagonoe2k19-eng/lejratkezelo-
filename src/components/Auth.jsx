import React, { useState } from 'react';
import { User, Lock, Mail, ArrowRight } from 'lucide-react';

const Auth = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            // Simple mock login
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === formData.email && u.password === formData.password);

            if (user) {
                onLogin(user);
            } else {
                setError('Helytelen e-mail vagy jelszó!');
            }
        } else {
            // Simple mock registration
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.find(u => u.email === formData.email)) {
                setError('Ez az e-mail cím már foglalt!');
                return;
            }

            const newUser = { ...formData };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            onLogin(newUser);
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
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'white', outline: 'none' }}
                            />
                        </div>
                    </div>

                    {error && <p style={{ color: 'var(--status-danger)', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        {isLogin ? 'Bejelentkezés' : 'Regisztráció'}
                        <ArrowRight size={18} />
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
