
import React, { useState, useEffect } from 'react';
import { storage } from '../storage';
import { Declaration } from '../types';
import DeclarationPDF from '../components/DeclarationPDF';

const AdminHistory: React.FC = () => {
  const [history, setHistory] = useState<Declaration[]>([]);
  const [selected, setSelected] = useState<Declaration | null>(null);

  useEffect(() => {
    setHistory(storage.getHistory());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Deseja apagar este histórico de emissão?")) {
      const updated = history.filter(h => h.id !== id);
      setHistory(updated);
      storage.saveHistory(updated);
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString('pt-PT');

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <h2 className="text-2xl font-bold text-gray-800">Histórico de Declarações Emitidas</h2>

      <div className="bg-white rounded-xl shadow border overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-semibold text-sm">Data</th>
              <th className="px-6 py-3 font-semibold text-sm">Utente</th>
              <th className="px-6 py-3 font-semibold text-sm">BI Nº</th>
              <th className="px-6 py-3 font-semibold text-sm">Efeito</th>
              <th className="px-6 py-3 font-semibold text-sm text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {history.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-xs">{formatDate(item.date)}</td>
                <td className="px-6 py-4 font-medium">{item.formData.nome}</td>
                <td className="px-6 py-4 font-mono text-xs">{item.formData.biNumber}</td>
                <td className="px-6 py-4 text-sm italic">{item.formData.efeito}</td>
                <td className="px-6 py-4 text-right space-x-3">
                  <button onClick={() => setSelected(item)} className="text-blue-600 hover:text-blue-800 font-medium">Reemitir</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 font-medium">Apagar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {history.length === 0 && <div className="p-12 text-center text-gray-400">Sem declarações emitidas recentemente.</div>}
      </div>

      {selected && (
        <DeclarationPDF 
          formData={selected.formData} 
          agent={selected.agentData} 
          settings={storage.getSettings()} 
          onClose={() => setSelected(null)} 
        />
      )}
    </div>
  );
};

export default AdminHistory;
