
import type { Client } from "../types/client";
import clientesMock from '../../../data/mocks/clientes.json';

let clients: Client[] = clientesMock as Client[];

export const clientService = {
  async getAll(): Promise<Client[]> {
    return [...clients];
  },

  async getById(id: number): Promise<Client | undefined> {
    return clients.find((client) => client.id === id);
  },

  async delete(id: number): Promise<void> {
    clients = clients.filter((client) => client.id !== id);
  },

  async update(
    id: number,
    data: Partial<Client>
  ): Promise<Client> {
    const index = clients.findIndex((client) => client.id === id);

    if (index === -1) {
      throw new Error("Cliente não encontrado.");
    }

    clients[index] = {
      ...clients[index],
      ...data,
    };

    return clients[index];
  },
};

