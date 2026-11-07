import api from "@/services/api.service";
import type {
  CreateVehicleDTO,
  Vehicle,
} from "@/features/vehicles/types/vehicles";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const vehiclesServices = {
  async create(dados: CreateVehicleDTO): Promise<Vehicle> {
    const response = await api.post<ApiResponse<Vehicle>>(
      "/veiculos",
      dados
    );

    return response.data.data;
  },

  async list(): Promise<Vehicle[]> {
    const response = await api.get<
      ApiResponse<{ items: Vehicle[] }>
    >("/veiculos");

    return response.data.data.items;
  },

  async getById(id: number): Promise<Vehicle> {
    const response = await api.get<ApiResponse<Vehicle>>(
      `/veiculos/${id}`
    );

    return response.data.data;
  },
  async update(id: number, dados: CreateVehicleDTO): Promise<Vehicle> {
    const response = await api.put<ApiResponse<Vehicle>>(
      `/veiculos/${id}`,
      dados
    );

    return response.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/veiculos/${id}`);
  }

};