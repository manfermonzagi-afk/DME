
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gender, CivilStatus, FunctionType, Category } from '../types';
import { PROVINCES_ANGOLA, DEGREES } from '../constants';
import { storage } from '../storage';
import CameraCapture from '../components/CameraCapture';
import DeclarationPDF from '../components/DeclarationPDF';

const PublicForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nome: '',
    sexo: Gender.MASCULINO,
    estadoCivil: CivilStatus.SOLTEIRO,
    nomePai: '',
    nomeMae: '',
    naturalDe: '',
    municipio: '',
    provincia: PROVINCES_ANGOLA[0],
    dataNascimento: '',
    biNumber: '',
    cargoFuncao: '',
    localTrabalho: '',
    dataEmissao: '',
    email: '',
    telemovel: '',
    agenteNumber: '',
    funcao: FunctionType.PROFESSOR,
    categoria: Category.ENSINO_PRIMARIO_SECUNDARIO,
    grau: DEGREES[0],
    cargo: '',
    efeito: '',
    fotoBIFrontal: '',
    fotoBIVerso: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [showPDF, setShowPDF] = useState(false);
  const [matchedAgent, setMatchedAgent] = useState<any>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCapture = (name: string, data: string) => {
    setFormData(prev => ({ ...prev, [name]: data }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Validações
    const agents = storage.getAgents();
    const agent = agents.find(a => a.biNumber === formData.biNumber && a.agentNumber === formData.agenteNumber);

    if (!agent) {
      alert("Validação Falhou: O Bilhete de Identidade ou Nº de Agente não coincidem com os registos oficiais.");
      setIsProcessing(false);
      return;
    }

    if (!formData.fotoBIFrontal || !formData.fotoBIVerso) {
      alert("Por favor, capture as fotos do Bilhete de Identidade.");
      setIsProcessing(false);
      return;
    }

    // Salvar no histórico
    const history = storage.getHistory();
    const newRecord = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      formData: { ...formData },
      agentData: agent
    };
    storage.saveHistory([newRecord, ...history]);

    setMatchedAgent(agent);
    setShowPDF(true);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-900 text-white p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-wide">Direcção Municipal da Educação</h1>
            <p className="text-blue-200">Emissão de Declaração de Serviço - Quibaxe</p>
          </div>
          <Link to="/admin/login" className="px-4 py-2 bg-blue-800 text-blue-100 rounded-lg hover:bg-blue-700 transition flex items-center text-sm font-semibold">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.181m2.753-9.181c.463-1.248.717-2.59.717-3.988 0-3.901-2.428-7.241-5.834-8.561M12 11c0 3.517 1.009 6.799 2.753 9.181M12 11c.463-1.248.717-2.59.717-3.988 0-3.901 2.428-7.241 5.834-8.561M12 12.039v.001M12 12c-3.116 0-5.833 1.838-7.117 4.534M12 12c3.116 0 5.833 1.838 7.117 4.534M12 12v.039m0-2.037v2.038m0 0v1.039m0-1.039l3.414 3.414M12 12l-3.414 3.414M12 12L8.586 8.586M12 12l3.414-3.414M12 12l3.414 3.414M12 12l-3.414-3.414"/></svg>
            Acesso Restrito
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* SECTION I: DADOS PESSOAIS */}
          <section>
            <div className="flex items-center space-x-2 mb-6 border-b pb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold">1</div>
              <h2 className="text-xl font-semibold text-gray-800 uppercase tracking-tight">Secção I – Dados Pessoais</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input required type="text" name="nome" value={formData.nome} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                <select name="sexo" value={formData.sexo} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
                <select name="estadoCivil" value={formData.estadoCivil} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  {Object.values(CivilStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{formData.sexo === Gender.MASCULINO ? 'Filho de' : 'Filha de'} (Nome do Pai)</label>
                <input required type="text" name="nomePai" value={formData.nomePai} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E de (Nome da Mãe)</label>
                <input required type="text" name="nomeMae" value={formData.nomeMae} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Natural de</label>
                <input required type="text" name="naturalDe" value={formData.naturalDe} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Município de</label>
                <input required type="text" name="municipio" value={formData.municipio} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Província</label>
                <select name="provincia" value={formData.provincia} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  {PROVINCES_ANGOLA.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                <input required type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bilhete de Identidade Nº</label>
                <input required type="text" maxLength={14} name="biNumber" value={formData.biNumber} onChange={handleChange} placeholder="Ex: 004561234LA052" className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                <p className="text-xs text-gray-500 mt-1">Apenas letras e números, sem espaços.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Emissão (BI)</label>
                <input required type="date" name="dataEmissao" value={formData.dataEmissao} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telemóvel</label>
                <input required type="number" name="telemovel" value={formData.telemovel} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <CameraCapture label="Fotografia do B.I – Frente" onCapture={(data) => handleCapture('fotoBIFrontal', data)} />
              <CameraCapture label="Fotografia do B.I – Verso" onCapture={(data) => handleCapture('fotoBIVerso', data)} />
            </div>
          </section>

          {/* SECTION II: DADOS PROFISSIONAIS */}
          <section>
            <div className="flex items-center space-x-2 mb-6 border-b pb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold">2</div>
              <h2 className="text-xl font-semibold text-gray-800 uppercase tracking-tight">Secção II – Dados Profissionais</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nº de Agente</label>
                <input required type="text" name="agenteNumber" value={formData.agenteNumber} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                <select name="funcao" value={formData.funcao} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  {Object.values(FunctionType).map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                <select name="categoria" value={formData.categoria} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grau</label>
                <select name="grau" value={formData.grau} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo Atual</label>
                <input required type="text" name="cargo" value={formData.cargo} onChange={handleChange} className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Declaração para Efeito de:</label>
                <input required type="text" name="efeito" value={formData.efeito} onChange={handleChange} placeholder="Ex: Abertura de conta bancária, Candidatura, etc." className="w-full border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </section>

          <button 
            type="submit" 
            disabled={isProcessing}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-lg disabled:bg-blue-300"
          >
            {isProcessing ? 'Processando...' : 'GERAR DECLARAÇÃO'}
          </button>
        </form>
      </div>

      {showPDF && matchedAgent && (
        <DeclarationPDF 
          formData={formData} 
          agent={matchedAgent} 
          settings={storage.getSettings()} 
          onClose={() => setShowPDF(false)} 
        />
      )}
    </div>
  );
};

export default PublicForm;
