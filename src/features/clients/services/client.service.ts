import api from "@/services/api.service";
import type { Client, CreateClientDTO, UpdateClientDTO } from "../types/client";

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiDataResponse<T> {
  data: T;
}

export const clientesService = {
  async list(params: {
    page: number;
    limit: number;
    search?: string;
  }): Promise<PaginatedResponse<Client>> {
    const token =
      localStorage.getItem("rentcar.token") ||
      sessionStorage.getItem("rentcar.token");

    const response = await api.get("/clientes", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    return response.data.data;
  },

  async detailById(id: number): Promise<Client> {
    const response = await api.get(`/clientes/${id}`);
    return response.data.data;
  },

  async create(client: CreateClientDTO): Promise<Client> {
    const formData = new FormData();
    formData.append("nome", client.nome);
    formData.append("cpf", client.cpf);
    formData.append("telefone", client.telefone);
    formData.append("email", client.email);
    formData.append("endereco", client.endereco);
    if (client.observacoes) formData.append("observacoes", client.observacoes);

    if (client.imagem instanceof File) {
      formData.append("imagem", client.imagem);
    }

    const response = await api.post("/clientes", formData);

    return response.data.data;
  },

  async update(id: number, client: UpdateClientDTO): Promise<Client> {
    const response = await api.put(`/clientes/${id}`, client);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/clientes/${id}`);
  },
};
