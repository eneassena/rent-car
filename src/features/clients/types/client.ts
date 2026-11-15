export interface Client {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  observacoes?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  imagem_path?: string | null;
}

export interface CreateClientDTO {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  endereco: string;
  observacoes?: string | null;
  imagem?: File | null;
}

export interface UpdateClientDTO extends Client {}

export interface DeleteClientDTO {
  id: number;
}

export interface DetailsClientDTO extends Client {}