import '../styles/login.css';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Login({ setShowLogin }) {
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (isSignup) {
        if (!form.name || !form.email || !form.password) {
          setError('Please fill all fields');
          setLoading(false);
          return;
        }
        await register(form.name, form.email, form.password);
      } else {
        if (!form.email || !form.password) {
          setError('Please fill all fields');
          setLoading(false);
          return;
        }
        await login(form.email, form.password);
      }
      setShowLogin(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowLogin(false)}>
      <div className="modal-box">
        <button className="close-btn" onClick={() => setShowLogin(false)}>×</button>

        <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>

        {error && <p className="auth-error">{error}</p>}

        {isSignup && (
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
          />
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : (isSignup ? 'Sign Up' : 'Login')}
        </button>

        <p>
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => { setIsSignup(!isSignup); setError(''); }}>
            {isSignup ? ' Login' : ' Sign up'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
