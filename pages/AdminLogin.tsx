
import React, { useState } from 'react';
import { storage } from '../storage';
import { AdminUser } from '../types';

interface AdminLoginProps {
  onLogin: (user: AdminUser) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const admins = storage.getAdmins();
    const found = admins.find(a => a.username === username && a.password === password);
    
    if (found) {
      onLogin(found);
    } else {
      alert("Credenciais inválidas.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Área Administrativa</h1>
          <p className="text-gray-500">Acesse para gerir declarações e utentes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Utilizador</label>
            <input 
              required 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input 
              required 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>
          <button 
            type="submit" 
            className="w-full py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition shadow-lg"
          >
            ENTRAR
          </button>
        </form>

        <div className="mt-8 text-center">
          <a href="/" className="text-blue-600 hover:underline text-sm font-medium">Voltar ao Formulário Público</a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
