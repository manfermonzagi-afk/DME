
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicForm from './pages/PublicForm';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { storage } from './storage';
import { AdminUser } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const session = storage.getSession();
    if (session) setUser(session);
  }, []);

  const handleLogin = (admin: AdminUser) => {
    storage.setSession(admin);
    setUser(admin);
  };

  const handleLogout = () => {
    storage.setSession(null);
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicForm />} />
        <Route 
          path="/admin/login" 
          element={user ? <Navigate to="/admin" /> : <AdminLogin onLogin={handleLogin} />} 
        />
        <Route 
          path="/admin/*" 
          element={user ? <AdminDashboard user={user} onLogout={handleLogout} /> : <Navigate to="/admin/login" />} 
        />
      </Routes>
    </Router>
  );
};

export default App;
