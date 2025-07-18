import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="navbar glass-card">
      <div className="container">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">
            <span className="brand-icon">✨</span>
            Ayna
          </Link>
          
          <div className="navbar-menu">
            <Link to="/dashboard" className="navbar-link">
              🏠 Dashboard
            </Link>
            <Link to="/create-form" className="navbar-link">
              ➕ New Form
            </Link>
            <div className="navbar-user">
              <span className="user-greeting">👋 {user.name}</span>
              <button onClick={handleLogout} className="btn btn-outline btn-small">
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
