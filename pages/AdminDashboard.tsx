
import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AdminUser } from '../types';
import AdminAgents from './AdminAgents';
import AdminHistory from './AdminHistory';
import AdminSettings from './AdminSettings';

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    return location.pathname.startsWith(path) && path !== '/admin';
  };

  const navItems = [
    { label: 'Utentes Válidos', path: '/admin/agents', icon: <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg> },
    { label: 'Histórico de Emissões', path: '/admin/history', icon: <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> },
    { label: 'Configurações', path: '/admin/settings', icon: <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-blue-900 text-white shadow-md z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-xl font-bold">DME Quibaxe - Admin</span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-semibold">{user.name}</span>
              <span className="text-xs text-blue-300">Acesso Administrativo</span>
            </div>
            <button 
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden lg:block overflow-y-auto">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center px-4 py-3 rounded-lg transition ${
                  isActive(item.path) ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<AdminAgents />} />
              <Route path="agents" element={<AdminAgents />} />
              <Route path="history" element={<AdminHistory />} />
              <Route path="settings" element={<AdminSettings currentAdmin={user} />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Mobile Nav */}
      <nav className="lg:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 h-16 flex items-center justify-around px-4 z-40">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`flex flex-col items-center justify-center space-y-1 transition ${
              isActive(item.path) ? 'text-blue-700' : 'text-gray-400'
            }`}
          >
            {/* Fix: Explicitly cast to React.ReactElement<any> to resolve TypeScript error on 'className' prop in cloneElement */}
            {React.cloneElement(item.icon as React.ReactElement<any>, { className: 'w-6 h-6 mr-0' })}
            <span className="text-[10px] uppercase font-bold">{item.label.split(' ')[0]}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminDashboard;
