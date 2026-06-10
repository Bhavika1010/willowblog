import '../styles/Navbar.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

function Navbar({ setShowLogin }) {
  const [activeSection, setActiveSection] = useState('home');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const categories = document.getElementById('categories');
      if (categories) {
        const rect = categories.getBoundingClientRect();
        setActiveSection(rect.top <= 100 && rect.bottom >= 100 ? 'categories' : 'home');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <NavLink to="/">
          <span className="logo-text">The Willow Blog</span>
        </NavLink>
      </div>

      <ul className="nav-links">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive && activeSection === 'home' ? 'nav-item active' : 'nav-item'
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/blog" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Blog
          </NavLink>
        </li>
        <li>
          <span
            className={activeSection === 'categories' ? 'nav-item active' : 'nav-item'}
            onClick={() => {
              if (window.location.pathname !== '/') {
                window.location.href = '/#categories';
              } else {
                document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Categories
          </span>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            Contact
          </NavLink>
        </li>

        {user ? (
          <>
            {user.role === 'admin' && (
              <li>
                <NavLink to="/create" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                  + Write
                </NavLink>
              </li>
            )}
            <li>
              <NavLink to="/saved" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
                Saved
              </NavLink>
            </li>
            <li>
              <NotificationBell />
            </li>
            <li>
              <span className="nav-item nav-user">Hi, {user.name.split(' ')[0]}</span>
            </li>
            <li>
              <button className="nav-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <li>
            <button className="nav-signin-btn" onClick={() => setShowLogin(true)}>
              Sign In
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
