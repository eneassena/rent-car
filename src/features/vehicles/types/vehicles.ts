export interface Vehicle {
  id: number;
  marca: string;
  modelo: string;
  placa: string;
  ano: number;
  cor: string;
  valor_diaria: number;
  observacoes?: string | null;
  status: VeiculoStatus;
  imagem_path?: string | null;
}

export type VeiculoStatus =
  | "DISPONIVEL"
  | "LOCADO"
  | "MANUTENCAO"
  | "INATIVO";

export interface CreateVehicleDTO {
  marca: string;
  modelo: string;
  placa: string;
  ano: number;
  cor: string;
  valor_diaria: number;
  observacoes?: string | null;
  imagem?: File | null;
}

export interface UpdateVehicleDTO extends CreateVehicleDTO {}
export interface CreateVehicleResponse extends Vehicle {}

export type VehicleCores =
  | "BRANCO"
  | "PRETO"
  | "PRATA"
  | "CINZA"
  | "VERMELHO"
  | "AZUL"
  | "VERDE"
  | "AMARELO"
  | "LARANJA"
  | "ROXO";
