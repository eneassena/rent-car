export interface Client {
   id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  status: "ACTIVE" | "INACTIVE";
  endereco: string | null;
  observacoes?: string | null;
  imagem_path: string | null;
  created_at?: string;
  updated_at?: string | null; 
}
