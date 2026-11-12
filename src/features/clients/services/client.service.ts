import api from '@/services/api.service';
import type { Client } from "../types/client";

type ItemApiResponse = {
  items: Client[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};


export type ClienteApiResponse = {
  data: ItemApiResponse;
  success: boolean;
};

export type ClienteDetailsApiResponse = {
  data: Client;
  success: boolean;
};


export const clientesService = {
  async getAll(params: { page: number; limit: number }): Promise<ClienteApiResponse> {
    const token = localStorage.getItem("rentcar.token") || sessionStorage.getItem("rentcar.token");
    const response = await api.get('/clientes',{
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    });
    // console.log('Response from getAll:', response.da
    // ta);
    return response.data;
  },

  async getById(id: string): Promise<ClienteDetailsApiResponse> {
    const response = await api.get(`/clientes/${id}`);
    return response.data;
  },

  async create(client: Client): Promise<Client> {
    const response = await api.post('/clientes', client);
    return response.data;
  },

  async update(id: string, client: Client): Promise<ClienteDetailsApiResponse> {
    const response = await api.put(`/clientes/${id}`, client);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/clientes/${id}`);
  },
};

