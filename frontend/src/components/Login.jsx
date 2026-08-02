import '../styles/login.css';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Login({ setShowLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      if (!form.email || !form.password) {
        setError('Please fill all fields');
        setLoading(false);
        return;
      }
      await login(form.email, form.password);
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

        <h2>Welcome Back</h2>

        {error && <p className="auth-error">{error}</p>}

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
          {loading ? 'Please wait...' : 'Login'}
        </button>
      </div>
    </div>
  );
}

export default Login;
