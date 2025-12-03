import axios from 'axios';
import { Production } from '../types/Production';

// IMPORTANTE: Altere para o IP do seu computador na rede local
// Use 'ipconfig' no Windows para descobrir seu IP (procure por IPv4)
// Exemplo: 192.168.15.2, 192.168.1.100, etc.
const API_URL = 'http://192.168.50.117:3000/api';

export const mongoService = {
  // Produção
  addProduction: async (production: Production) => {
    try {
      console.log('📤 Enviando para MongoDB:', production);
      const response = await axios.post(`${API_URL}/productions`, production);
      console.log('✅ Resposta do servidor:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao adicionar produção:', error.message);
      if (error.response) {
        console.error('Resposta do servidor:', error.response.data);
      }
      throw error;
    }
  },

  getAllProductions: async (): Promise<Production[]> => {
    try {
      console.log('📥 Buscando produções do MongoDB...');
      const response = await axios.get(`${API_URL}/productions`);
      console.log('✅ Produções recebidas:', response.data.length);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar produções:', error.message);
      throw error;
    }
  },

  getProductionById: async (id: string): Promise<Production> => {
    const response = await axios.get(`${API_URL}/productions/${id}`);
    return response.data;
  },

  updateProduction: async (id: string, production: Partial<Production>) => {
    const response = await axios.put(`${API_URL}/productions/${id}`, production);
    return response.data;
  },

  deleteProduction: async (id: string) => {
    const response = await axios.delete(`${API_URL}/productions/${id}`);
    return response.data;
  },

  // Buscar por tipo
  getProductionsByType: async (type: 'filme' | 'série'): Promise<Production[]> => {
    const response = await axios.get(`${API_URL}/productions/type/${type}`);
    return response.data;
  },

  // Buscar por gênero
  getProductionsByGenre: async (genre: string): Promise<Production[]> => {
    const response = await axios.get(`${API_URL}/productions/genre/${genre}`);
    return response.data;
  },

  // Buscar por plataforma
  getProductionsByPlatform: async (platform: string): Promise<Production[]> => {
    const response = await axios.get(`${API_URL}/productions/platform/${platform}`);
    return response.data;
  },
};
