import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateForm from './components/CreateForm';
import PublicForm from './components/PublicForm';
import FormResponses from './components/FormResponses';
import Navbar from './components/Navbar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

function AppContent() {
  const { user } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Add navbar padding class when user is logged in
    if (user) {
      document.body.classList.add('has-navbar');
    } else {
      document.body.classList.remove('has-navbar');
    }
    
    return () => {
      document.body.classList.remove('has-navbar');
    };
  }, [user]);

  const showNavbar = user && !['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-form" element={<CreateForm />} />
        <Route path="/form/:id" element={<PublicForm />} />
        <Route path="/form/:id/responses" element={<FormResponses />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
