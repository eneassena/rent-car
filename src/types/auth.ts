export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface User {
  ativo: 1;
  email: string;
  id: number;
  imagem_path: string | null;
  nome: string;
  role: "ADMIN" | "ATENDENTE" | "GERENTE";
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
  };
  user: User;
}
