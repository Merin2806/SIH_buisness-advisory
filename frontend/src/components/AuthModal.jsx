import React, { useState } from 'react';
import { 
  X, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Building2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { api } from '../api';

export default function AuthModal({ initialMode = 'login', onClose, onSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [village, setVillage] = useState('Baramati Rural');
  const [district, setDistrict] = useState('Pune');
  const [state, setState] = useState('Maharashtra');

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(email, password);
      onSuccess(res);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e?.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.register({
        full_name: fullName,
        email,
        phone_number: phoneNumber,
        password,
        confirm_password: confirmPassword,
        village,
        district,
        state
      });
      onSuccess(res);
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Fillers and 1-Click Login
  const fillAdmin = () => {
    setMode('login');
    setEmail('riyamokale@gmail.com');
    setPassword('AdminRuralBiz@2026');
  };

  const fillUser = () => {
    setMode('login');
    setEmail('ramesh.patil@ruralbiz.org');
    setPassword('RuralPass@2026');
    setFullName('Ramesh Patil');
    setPhoneNumber('9822334455');
    setConfirmPassword('RuralPass@2026');
  };

  const loginAsDemoUser = async () => {
    setMode('login');
    setEmail('ramesh.patil@ruralbiz.org');
    setPassword('RuralPass@2026');
    setError('');
    setLoading(true);
    try {
      const res = await api.login('ramesh.patil@ruralbiz.org', 'RuralPass@2026');
      onSuccess(res);
      onClose();
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const loginAsAdmin = async () => {
    setMode('login');
    setEmail('riyamokale@gmail.com');
    setPassword('AdminRuralBiz@2026');
    setError('');
    setLoading(true);
    try {
      const res = await api.login('riyamokale@gmail.com', 'AdminRuralBiz@2026');
      onSuccess(res);
      onClose();
    } catch (err) {
      setError(err.message || 'Admin login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address to receive reset instructions.');
      return;
    }
    setLoading(true);
    try {
      await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      setForgotSent(true);
      setError('');
    } catch (err) {
      setError('Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(19, 21, 26, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 20
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: 24,
        maxWidth: 900,
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            background: '#F1F5F9',
            border: 'none',
            borderRadius: '50%',
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-secondary)'
          }}
        >
          <X size={18} />
        </button>

        {/* Split Screen Visual Side */}
        <div style={{
          background: 'linear-gradient(145deg, #6F3DFF 0%, #4D26C4 60%, #BFE9FF 100%)',
          padding: 40,
          color: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
              <Building2 size={28} color="#BFE9FF" />
              <span style={{ fontSize: '1.3rem', fontWeight: 800 }}>RuralBiz <strong style={{ color: '#BFE9FF' }}>AI</strong></span>
            </div>

            <h3 style={{ fontSize: '1.65rem', lineHeight: 1.25, color: '#FFFFFF', marginBottom: 16 }}>
              {mode === 'login' ? 'Welcome Back to Your Enterprise Hub' : 'Empowering Rural Micro-Entrepreneurs'}
            </h3>

            <p style={{ color: '#E2E8F0', fontSize: '0.92rem', lineHeight: 1.6 }}>
              Evaluate local competition, examine verified Mudra/NABARD financing, and stress-test your business margins with zero hallucination.
            </p>
          </div>

          {/* Quick Demo Credentials Box */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: 16,
            padding: 16,
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: '#BFE9FF', marginBottom: 8 }}>
              Hackathon Quick Demo Logins
            </div>
            <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <button 
                  type="button"
                  onClick={loginAsAdmin}
                  style={{
                    flex: 1,
                    background: '#FFFFFF',
                    color: '#13151A',
                    padding: '8px 10px',
                    borderRadius: 8,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <span>👑 Admin (1-Click)</span>
                </button>
                <button
                  type="button"
                  onClick={fillAdmin}
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '8px 10px',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Fill
                </button>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <button 
                  type="button"
                  onClick={loginAsDemoUser}
                  style={{
                    flex: 1,
                    background: '#BFE9FF',
                    color: '#13151A',
                    padding: '8px 10px',
                    borderRadius: 8,
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textAlign: 'left',
                    cursor: 'pointer',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  <span>🌾 Ramesh Patil (1-Click)</span>
                </button>
                <button
                  type="button"
                  onClick={fillUser}
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    padding: '8px 10px',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Fill
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Split Screen Form Side */}
        <div style={{ padding: '36px 36px', overflowY: 'auto' }}>
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: 6 }}>
              {mode === 'login' ? 'Sign In to Your Account' : 'Register New Account'}
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              {mode === 'login' ? 'Access your saved assessments and feasibility reports.' : 'Join RuralBiz AI to evaluate rural business schemes.'}
            </p>
          </div>

          {error && (
            <div style={{
              background: '#FEF2F2',
              color: '#DC2626',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: '0.85rem',
              marginBottom: 16,
              border: '1px solid #FCA5A5'
            }}>
              {error}
            </div>
          )}

          {forgotSent && (
            <div style={{
              background: '#ECFDF5',
              color: '#059669',
              padding: '10px 14px',
              borderRadius: 8,
              fontSize: '0.85rem',
              marginBottom: 16,
              border: '1px solid #A7F3D0'
            }}>
              Password reset link has been dispatched to your email.
            </div>
          )}

          <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
            {mode === 'register' && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <UserIcon size={16} style={{ position: 'absolute', top: 12, left: 12, color: 'var(--text-muted)' }} />
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Ramesh Patil" 
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        borderRadius: 10,
                        border: '1px solid var(--mineral-grey-border)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', top: 12, left: 12, color: 'var(--text-muted)' }} />
                    <input 
                      type="tel" 
                      required
                      placeholder="10-digit mobile number" 
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        borderRadius: 10,
                        border: '1px solid var(--mineral-grey-border)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', top: 12, left: 12, color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: 10,
                    border: '1px solid var(--mineral-grey-border)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600 }}>Password</label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    style={{ fontSize: '0.78rem', color: '#6F3DFF', fontWeight: 600 }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', top: 12, left: 12, color: 'var(--text-muted)' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 38px 10px 38px',
                    borderRadius: 10,
                    border: '1px solid var(--mineral-grey-border)',
                    fontSize: '0.9rem'
                  }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', top: 10, right: 12, color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', top: 12, left: 12, color: 'var(--text-muted)' }} />
                    <input 
                      type="password" 
                      required
                      placeholder="••••••••" 
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 38px',
                        borderRadius: 10,
                        border: '1px solid var(--mineral-grey-border)',
                        fontSize: '0.9rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 2 }}>Village / Taluka</label>
                    <input 
                      type="text" 
                      value={village}
                      onChange={e => setVillage(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 8,
                        border: '1px solid var(--mineral-grey-border)',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: 2 }}>District</label>
                    <input 
                      type="text" 
                      value={district}
                      onChange={e => setDistrict(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 8,
                        border: '1px solid var(--mineral-grey-border)',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', marginTop: 10, padding: '12px' }}
            >
              {loading ? 'Authenticating...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {mode === 'login' ? (
              <span>Don't have an account? <strong style={{ color: '#6F3DFF', cursor: 'pointer' }} onClick={() => setMode('register')}>Register now</strong></span>
            ) : (
              <span>Already registered? <strong style={{ color: '#6F3DFF', cursor: 'pointer' }} onClick={() => setMode('login')}>Sign in</strong></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
