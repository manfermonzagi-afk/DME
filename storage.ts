
import { Agent, Declaration, AdminUser, SystemSettings } from './types';
import { DEFAULT_SETTINGS } from './constants';

const STORAGE_KEYS = {
  AGENTS: 'dme_agents',
  HISTORY: 'dme_history',
  ADMINS: 'dme_admins',
  SETTINGS: 'dme_settings',
  SESSION: 'dme_session'
};

export const storage = {
  getAgents: (): Agent[] => {
    const data = localStorage.getItem(STORAGE_KEYS.AGENTS);
    // Dados padrão para teste
    if (!data) return [{ id: '1', biNumber: '123456789LA123', agentNumber: '99999', name: 'Teste Utilizador', salary: 150000 }];
    return JSON.parse(data);
  },
  saveAgents: (agents: Agent[]) => localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(agents)),

  getHistory: (): Declaration[] => {
    const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  },
  saveHistory: (history: Declaration[]) => localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history)),

  getAdmins: (): AdminUser[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ADMINS);
    if (!data) return [{ id: '1', username: 'Ferraz', password: 'Admin', name: 'Administrador Ferraz' }];
    return JSON.parse(data);
  },
  saveAdmins: (admins: AdminUser[]) => localStorage.setItem(STORAGE_KEYS.ADMINS, JSON.stringify(admins)),

  getSettings: (): SystemSettings => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : DEFAULT_SETTINGS;
  },
  saveSettings: (settings: SystemSettings) => localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)),

  getSession: (): AdminUser | null => {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  },
  setSession: (user: AdminUser | null) => {
    if (user) localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.SESSION);
  }
};
