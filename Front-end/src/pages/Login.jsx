import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', { userId, password });
      if (res.data.user) {
        loginContext(res.data.user);
        if (res.data.user.role === 'Admin') navigate('/admin-dashboard');
        else navigate('/user-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-main)', fontSize: '1.75rem', fontWeight: 600 }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Sign in to continue to LMS</p>
        
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.5rem 1rem', borderRadius: '4px', width: '100%', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <label>Member ID / Aadhar No</label>
            <div style={{ position: 'relative' }}>
               <User size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', color: 'var(--text-muted)' }} />
               <input 
                 type="text" 
                 value={userId} 
                 onChange={(e) => setUserId(e.target.value)}
                 className="input-field" 
                 style={{ paddingLeft: '2.5rem', marginTop: '0.5rem' }} 
                 placeholder="Enter ID"
                 required 
               />
            </div>
          </div>
          
          <div style={{ position: 'relative', marginBottom: '2.5rem' }}>
            <label>Password</label>
            <div style={{ position: 'relative' }}>
               <Lock size={18} style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '12px', color: 'var(--text-muted)' }} />
               <input 
                 type="password" 
                 value={password} 
                 onChange={(e) => setPassword(e.target.value)}
                 className="input-field" 
                 style={{ paddingLeft: '2.5rem', marginTop: '0.5rem' }} 
                 placeholder="••••••••"
                 required 
               />
            </div>
          </div>

          <button type="submit" className="btn-cyan" style={{ width: '100%' }}>Sign In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
