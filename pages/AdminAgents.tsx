
import React, { useState, useEffect } from 'react';
import { storage } from '../storage';
import { Agent } from '../types';

const AdminAgents: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newAgent, setNewAgent] = useState({ name: '', biNumber: '', agentNumber: '', salary: 0 });

  useEffect(() => {
    setAgents(storage.getAgents());
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...agents, { ...newAgent, id: crypto.randomUUID() }];
    setAgents(updated);
    storage.saveAgents(updated);
    setNewAgent({ name: '', biNumber: '', agentNumber: '', salary: 0 });
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja apagar este registo?")) {
      const updated = agents.filter(a => a.id !== id);
      setAgents(updated);
      storage.saveAgents(updated);
    }
  };

  const handleUpdate = (agent: Agent) => {
    const updated = agents.map(a => a.id === agent.id ? agent : a);
    setAgents(updated);
    storage.saveAgents(updated);
    setIsEditing(null);
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Gestão de Utentes Válidos</h2>
      </div>

      <div className="bg-white rounded-xl shadow border p-6">
        <h3 className="font-semibold text-lg mb-4">Adicionar Novo Utente</h3>
        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input required placeholder="Nome Completo" value={newAgent.name} onChange={e => setNewAgent(p => ({ ...p, name: e.target.value }))} className="border p-2 rounded" />
          <input required placeholder="BI Nº" value={newAgent.biNumber} onChange={e => setNewAgent(p => ({ ...p, biNumber: e.target.value.toUpperCase() }))} className="border p-2 rounded" />
          <input required placeholder="Nº Agente" value={newAgent.agentNumber} onChange={e => setNewAgent(p => ({ ...p, agentNumber: e.target.value }))} className="border p-2 rounded" />
          <div className="flex space-x-2">
            <input required type="number" placeholder="Salário" value={newAgent.salary} onChange={e => setNewAgent(p => ({ ...p, salary: Number(e.target.value) }))} className="border p-2 rounded flex-1" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-semibold text-sm">Nome</th>
              <th className="px-6 py-3 font-semibold text-sm">BI Nº</th>
              <th className="px-6 py-3 font-semibold text-sm">Nº Agente</th>
              <th className="px-6 py-3 font-semibold text-sm">Salário</th>
              <th className="px-6 py-3 font-semibold text-sm text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {agents.map(agent => (
              <tr key={agent.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  {isEditing === agent.id ? (
                    <input className="border p-1 rounded w-full" value={agent.name} onChange={e => handleUpdate({ ...agent, name: e.target.value })} />
                  ) : agent.name}
                </td>
                <td className="px-6 py-4">{agent.biNumber}</td>
                <td className="px-6 py-4 font-mono">{agent.agentNumber}</td>
                <td className="px-6 py-4">
                  {isEditing === agent.id ? (
                    <input type="number" className="border p-1 rounded w-full" value={agent.salary} onChange={e => handleUpdate({ ...agent, salary: Number(e.target.value) })} />
                  ) : agent.salary.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => setIsEditing(isEditing === agent.id ? null : agent.id)} 
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {isEditing === agent.id ? 'Salvar' : 'Editar'}
                  </button>
                  <button onClick={() => handleDelete(agent.id)} className="text-red-600 hover:text-red-800 font-medium">Apagar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {agents.length === 0 && <div className="p-8 text-center text-gray-500">Nenhum utente registado.</div>}
      </div>
    </div>
  );
};

export default AdminAgents;
