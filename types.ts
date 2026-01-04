
export enum Gender {
  MASCULINO = 'Masculino',
  FEMININO = 'Feminino'
}

export enum CivilStatus {
  SOLTEIRO = 'Solteiro',
  SOLTEIRA = 'Solteira',
  CASADO = 'Casado',
  CASADA = 'Casada',
  VIUVO = 'Viúvo',
  VIUVA = 'Viúva'
}

export enum FunctionType {
  PROFESSOR = 'Professor',
  PROFESSORA = 'Professora'
}

export enum Category {
  ENSINO_PRIMARIO_SECUNDARIO = 'Professor do Ensino Primário e Secundário',
  PROFESSOR_AUXILIAR = 'Professor Auxiliar',
  PROFESSORA_AUXILIAR = 'Professora Auxiliar'
}

export interface Agent {
  id: string;
  biNumber: string;
  agentNumber: string;
  name: string;
  salary: number;
}

export interface Declaration {
  id: string;
  date: string;
  formData: any;
  agentData: Agent;
  pdfUrl?: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password: string; // Em produção seria um hash
  name: string;
}

export interface SystemSettings {
  directorName: string;
  insigniaUrl: string;
}
