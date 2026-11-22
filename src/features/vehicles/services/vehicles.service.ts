import api from "@/services/api.service";
import type {
  CreateVehicleDTO,
  UpdateVehicleDTO,
  Vehicle,
} from "@/features/vehicles/types/vehicles";
import { PaginatedResponse } from "@/features/clients/services/client.service";

export const vehiclesServices = {
  async create(vehicle: CreateVehicleDTO): Promise<Vehicle> {
    const formData = new FormData();
    formData.append("marca", vehicle.marca);
    formData.append("modelo", vehicle.modelo);
    formData.append("ano", String(vehicle.ano));
    formData.append("placa", vehicle.placa);
    formData.append("cor", vehicle.cor);
    formData.append("valor_diaria", String(vehicle.valor_diaria));

    if (vehicle.observacoes) {
      formData.append("observacoes", vehicle.observacoes);
    }

    if (vehicle.imagem) {
      formData.append("imagem", vehicle.imagem);
    }
    
    const response = await api.post("/veiculos",formData);

    return response.data.data;
  },

  async list(params: { page: number; limit: number; search?: string }): Promise<PaginatedResponse<Vehicle>> {
    const response = await api.get("/veiculos", { params });
    return response.data.data;
  },
  async getById(id: number): Promise<Vehicle> {
    const response = await api.get(`/veiculos/${id}`);

    return response.data.data;
  },
  async update(id: number, vehicle: UpdateVehicleDTO): Promise<Vehicle> {
    const formData = new FormData();

    formData.append("marca", vehicle.marca);
    formData.append("modelo", vehicle.modelo);
    formData.append("placa", vehicle.placa);
    formData.append("ano", String(vehicle.ano));
    formData.append("cor", vehicle.cor);
    formData.append("valor_diaria", String(vehicle.valor_diaria));
    formData.append("status", vehicle.status);

    if (vehicle.observacoes) {
      formData.append("observacoes", vehicle.observacoes);
    }

    if (vehicle.imagem instanceof File) {
      formData.append("imagem", vehicle.imagem);
    }

    const response = await api.put(`/veiculos/${id}`, formData);

    return response.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/veiculos/${id}`);
  },
};
