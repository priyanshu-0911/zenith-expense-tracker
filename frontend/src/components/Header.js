// src/components/Header.js
import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth/authContext';

const Header = () => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated, logout, user, loadUser } = authContext;
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line
  }, []);

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-logo">
        <h1><i className="fas fa-om" /> Dhan Sanchay</h1>
      </div>
      <nav className="header-nav">
        {isAuthenticated ? (
          <ul>
            <li className="user-email">Namaste, {user && user.email}</li>
            <li><button onClick={onLogout} className="logout-btn">Logout</button></li>
          </ul>
        ) : (
          <ul>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;
