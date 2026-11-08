import api from "@/services/api.service";
import type {
  CreateVehicleDTO,
  UpdateVehicleDTO,
  Vehicle,
} from "@/features/vehicles/types/vehicles";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

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
      console.log(`Appending image: ${vehicle.imagem}`);
      formData.append("imagem", vehicle.imagem);
    }
    
    const response = await api.post<ApiResponse<Vehicle>>(
      "/veiculos",
      formData,
      {
        headers: {
          "Content-Type": undefined,
        },
      },
    );

    return response.data.data;
  },

  async list(): Promise<Vehicle[]> {
    const response =
      await api.get<ApiResponse<{ items: Vehicle[] }>>("/veiculos");

    return response.data.data.items;
  },

  async getById(id: number): Promise<Vehicle> {
    const response = await api.get<ApiResponse<Vehicle>>(`/veiculos/${id}`);

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

    if (vehicle.observacoes) {
      formData.append("observacoes", vehicle.observacoes);
    }

    if (vehicle.imagem) {
      formData.append("imagem", vehicle.imagem);
    }
    const response = await api.put<ApiResponse<Vehicle>>(
      `/veiculos/${id}`,
      formData,
    );

    return response.data.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/veiculos/${id}`);
  },
};
