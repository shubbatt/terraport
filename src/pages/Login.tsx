import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if(email && password) {
      setError('');
      setIsLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }
        
        login(data.token, data.user);
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div style={{ 
      minHeight: 'calc(100vh - 80px)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--light), #e2e8f0)',
      padding: '40px 0'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <div style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <img src="/logo.png" alt="Terraport Logistics" style={{ height: '70px', objectFit: 'contain' }} />
            </div>
          </div>
          <h2>Customer Login</h2>
          <p style={{ color: 'var(--muted)', marginTop: '8px' }}>Access your logistics dashboard</p>
        </div>

        {error && (
          <div style={{ 
            background: 'var(--danger)', color: 'white', padding: '12px 16px', 
            borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px',
            fontSize: '0.9rem' 
          }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} color="var(--muted)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
              <input 
                type="email" 
                placeholder="you@company.com" 
                style={{ paddingLeft: '48px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="form-group" style={{ marginBottom: '30px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
              Password
              <a href="#" style={{ color: 'var(--secondary)', fontSize: '0.85rem' }}>Forgot?</a>
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} color="var(--muted)" style={{ position: 'absolute', left: '16px', top: '16px' }} />
              <input 
                type="password" 
                placeholder="••••••••" 
                style={{ paddingLeft: '48px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button className="btn btn-primary" type="submit" style={{ width: '100%', justifyContent: 'center', padding: '16px' }} disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign In to Dashboard'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.95rem' }}>
          <p style={{ color: 'var(--muted)' }}>Don't have an account? <Link to="/register" style={{ color: 'var(--secondary)', fontWeight: '600' }}>Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
