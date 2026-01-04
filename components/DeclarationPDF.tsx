
import React from 'react';
import { Agent, SystemSettings, Gender } from '../types';
import { differenceInYears, parseISO } from 'date-fns';

interface DeclarationPDFProps {
  formData: any;
  agent: Agent;
  settings: SystemSettings;
  onClose: () => void;
}

const DeclarationPDF: React.FC<DeclarationPDFProps> = ({ formData, agent, settings, onClose }) => {
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '0';
    return differenceInYears(new Date(), parseISO(birthDate)).toString();
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-PT');
  };

  const todayStr = new Date().toLocaleDateString('pt-PT', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  const getParentLabel = () => {
    return formData.sexo === Gender.MASCULINO ? 'Filho de' : 'Filha de';
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl min-h-[11in] p-[2cm] shadow-2xl relative">
        <div className="absolute top-4 right-4 flex space-x-2 no-print">
          <button 
            onClick={() => window.print()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Imprimir / Salvar PDF
          </button>
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Fechar
          </button>
        </div>

        {/* PDF Content - Arial 12 simulation */}
        <div id="pdf-content" style={{ fontFamily: 'Arial, sans-serif', fontSize: '12pt', lineHeight: '1.0' }}>
          
          <div className="flex flex-col items-center mb-8 text-center uppercase font-bold">
            <img src={settings.insigniaUrl} alt="Insígnia" className="h-24 mb-4 object-contain" />
            <p>Governo Provincial do Bengo</p>
            <p>Administração Municipal de Quibaxe</p>
            <p>Direcção Municipal da Educação</p>
          </div>

          <div className="text-center mb-10 font-bold text-xl underline">
            DECLARAÇÃO
          </div>

          <div className="text-justify mb-8 leading-relaxed">
            <p className="mb-6">
              <span className="font-bold">{settings.directorName}</span>, Director Municipal da Educação de Quibaxe, declara que 
              <span className="font-bold"> {formData.nome}</span>, {formData.estadoCivil.toLowerCase()} de {calculateAge(formData.dataNascimento)} anos de idade, nascido aos {formatDate(formData.dataNascimento)}, {getParentLabel().toLowerCase()} {formData.nomePai} e de {formData.nomeMae}, natural de {formData.naturalDe}, Município {formData.municipio}, Província {formData.provincia}, portador do Bilhete de Identidade nº {formData.biNumber}, emitido pela Direcção Nacional de Identificação aos {formatDate(formData.dataEmissao)}.
            </p>

            <p className="mb-6">
              É {formData.funcao} do {formData.categoria} do {formData.grau}, com o nº de Agente {formData.agenteNumber} em efetivo serviço, colocado na Direcção Municipal da Educação, exercendo a função de {formData.cargo}, auferindo o salário mensal de {agent.salary.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}.
            </p>

            <p className="italic">
              Obs.: A presente Declaração destina-se para efeito de {formData.efeito}.
            </p>

            <p className="mt-8">
              Por ser verdade e me ter sido solicitado, mandei passar a presente Declaração que vai por mim assinada e autenticada com o carimbo a óleo, em uso nesta Direcção Municipal.
            </p>
          </div>

          <div className="mt-20 flex flex-col items-center">
            <p className="uppercase font-bold mb-12">DIRECÇÃO MUNICIPAL DA EDUCAÇÃO DE QUIBAXE, {todayStr}.</p>
            
            <div className="border-t border-black pt-2 w-64 text-center">
              <p>O Director Municipal</p>
              <p className="font-bold uppercase">{settings.directorName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeclarationPDF;
