import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';

const Home = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="home-container">
      <div className="floating-shapes"></div>
      <div className="hero-section fade-in">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="gradient-text">✨ Ayna</span>
              <br />
              Beautiful Feedback Forms
            </h1>
            <p className="hero-description">
              Create stunning feedback forms in minutes. Collect responses, 
              analyze data, and make better decisions with our intuitive platform.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary pulse">
                🚀 Get Started Free
              </Link>
              <Link to="/login" className="btn btn-outline">
                👋 Welcome Back
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="feature-cards">
              <div className="feature-card glass-card slide-in">
                <div className="feature-icon">📝</div>
                <h3>Easy Form Creation</h3>
                <p>Build forms with our intuitive drag-and-drop interface</p>
              </div>
              <div className="feature-card glass-card slide-in" style={{animationDelay: '0.2s'}}>
                <div className="feature-icon">📊</div>
                <h3>Real-time Analytics</h3>
                <p>Track responses and analyze feedback in real-time</p>
              </div>
              <div className="feature-card glass-card slide-in" style={{animationDelay: '0.4s'}}>
                <div className="feature-icon">🔗</div>
                <h3>Easy Sharing</h3>
                <p>Share forms with a simple link, no registration required</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
