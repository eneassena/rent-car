export type Rental = {
    id: string;
    veiculoId: string;
    veiculo: string;
    clienteId: string;
    cliente: string;
    data_inicio: string;
    data_fim: string;
    diarias: number;
    valor: number;
    valor_diaria: number;
    status: string;
    paymentStatus: string;
    imagem_path: string;
};

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  status: "ACTIVE" | "INACTIVE";
  endereco: string | null;
  imagem_path: string;
}
 