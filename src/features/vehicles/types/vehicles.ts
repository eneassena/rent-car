export interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  placa: string;
  ano: number;
  cor: string;
  valor_diaria: number;
  observacoes?: string | null;
  status: VehicleStatusType;
  imagem_path?: File | null;
}

export type VehicleStatusType = "DISPONIVEL" | "LOCADO" | "MANUTENCAO" | "INATIVO";

export interface CreateVehicleDTO {
  marca: string;
  modelo: string;
  placa: string;
  ano: number;
  cor: string;
  valor_diaria: number;
  imagem_path?: File | null;
}