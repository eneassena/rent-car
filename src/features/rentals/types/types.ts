type Rental = {
  id: number;
  cliente_id: number;
  veiculo_id: number;
  modalidade: string;
  data_retirada: string;
  data_devolucao: string;
  valor_diaria: number | null;
  valor_fechado: number | null;
  valor_total: number;
  status: string;
  observacoes: string | null;
  imagem_path?: string | null;
  cliente_nome?: string;
  cliente_cpf?: string;
  veiculo_placa?: string;
  veiculo_marca?: string;
  veiculo_modelo?: string;
};

export type RentalStatus = "ATIVA" | "FINALIZADA" | "CANCELADA";
export type RentalModalidade = "DIARIA" | "PERIODO";

export interface CreateRentalDTO {
  cliente_id: number;
  veiculo_id: number;
  modalidade: string;
  data_retirada: string;
  data_devolucao: string;
  valor_diaria: number | null;
  valor_fechado: number | null;
  observacoes: string | null;
  imagem?: File | null;
}

export interface UpdateRentalDTO extends CreateRentalDTO {}

export default Rental;
