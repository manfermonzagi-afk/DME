
import React, { useState, useEffect } from 'react';
import { storage } from '../storage';
import { SystemSettings, AdminUser } from '../types';

interface AdminSettingsProps {
  currentAdmin: AdminUser;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({ currentAdmin }) => {
  const [settings, setSettings] = useState<SystemSettings>(storage.getSettings());
  const [admins, setAdmins] = useState<AdminUser[]>(storage.getAdmins());
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', name: '' });

  const handleSettingsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveSettings(settings);
    alert("Configurações do sistema actualizadas com sucesso!");
  };

  const handleInsigniaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, insigniaUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (admins.length >= 10) {
      alert("Limite de 10 utilizadores administrativos atingido.");
      return;
    }
    const updated = [...admins, { ...newAdmin, id: crypto.randomUUID() }];
    setAdmins(updated);
    storage.saveAdmins(updated);
    setNewAdmin({ username: '', password: '', name: '' });
    alert("Novo administrador adicionado.");
  };

  const handleUpdateAdmin = (admin: AdminUser) => {
    const updated = admins.map(a => a.id === admin.id ? admin : a);
    setAdmins(updated);
    storage.saveAdmins(updated);
  };

  const handleDeleteAdmin = (id: string) => {
    if (id === currentAdmin.id) {
      alert("Você não pode apagar seu próprio utilizador.");
      return;
    }
    if (confirm("Remover este acesso administrativo?")) {
      const updated = admins.filter(a => a.id !== id);
      setAdmins(updated);
      storage.saveAdmins(updated);
    }
  };

  return (
    <div className="space-y-8 pb-20 lg:pb-0">
      <h2 className="text-2xl font-bold text-gray-800">Configurações Gerais</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* System Params */}
        <section className="bg-white p-6 rounded-xl shadow border space-y-4">
          <h3 className="text-lg font-bold uppercase border-b pb-2">Parâmetros da Declaração</h3>
          <form onSubmit={handleSettingsUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome do Director Municipal</label>
              <input 
                type="text" 
                value={settings.directorName} 
                onChange={e => setSettings(prev => ({ ...prev, directorName: e.target.value }))}
                className="w-full border p-2 rounded" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Insígnia da República</label>
              <div className="flex items-center space-x-4">
                <img src={settings.insigniaUrl} alt="Insignia" className="h-16 w-16 object-contain border p-1 rounded" />
                <input type="file" accept="image/*" onChange={handleInsigniaChange} className="text-xs" />
              </div>
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">Salvar Alterações</button>
          </form>
        </section>

        {/* User Management */}
        <section className="bg-white p-6 rounded-xl shadow border space-y-4">
          <h3 className="text-lg font-bold uppercase border-b pb-2">Gestão de Utilizadores ({admins.length}/10)</h3>
          
          <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
            {admins.map(admin => (
              <div key={admin.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                <div className="flex-1 mr-4">
                  <input 
                    className="bg-transparent font-bold w-full focus:ring-1 p-1" 
                    value={admin.name} 
                    onChange={e => handleUpdateAdmin({ ...admin, name: e.target.value })} 
                  />
                  <p className="text-xs text-gray-500">User: {admin.username}</p>
                </div>
                <div className="flex space-x-2">
                  <input 
                    type="password"
                    placeholder="Nova senha"
                    className="text-xs border p-1 rounded w-24"
                    onChange={e => handleUpdateAdmin({ ...admin, password: e.target.value })}
                  />
                  <button onClick={() => handleDeleteAdmin(admin.id)} className="text-red-500 hover:text-red-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddAdmin} className="bg-blue-50 p-4 rounded border border-blue-100 space-y-3">
            <h4 className="text-sm font-bold text-blue-900">Novo Utilizador</h4>
            <input required placeholder="Nome Real" value={newAdmin.name} onChange={e => setNewAdmin(p => ({ ...p, name: e.target.value }))} className="w-full text-sm border p-2 rounded" />
            <div className="grid grid-cols-2 gap-2">
              <input required placeholder="Username" value={newAdmin.username} onChange={e => setNewAdmin(p => ({ ...p, username: e.target.value }))} className="text-sm border p-2 rounded" />
              <input required type="password" placeholder="Senha" value={newAdmin.password} onChange={e => setNewAdmin(p => ({ ...p, password: e.target.value }))} className="text-sm border p-2 rounded" />
            </div>
            <button type="submit" className="w-full bg-blue-900 text-white text-sm py-2 rounded font-bold hover:bg-black transition">Adicionar Utilizador</button>
          </form>
        </section>

      </div>
    </div>
  );
};

export default AdminSettings;
