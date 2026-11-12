
import axios from "axios";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adiciona o JWT automaticamente nas requisições.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("rentcar.token") || sessionStorage.getItem("rentcar.token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Tratamento centralizado de erros.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("rentcar.token");
      sessionStorage.removeItem("rentcar.token");

      // Evita redirecionar quando o próprio login falha.
      if (!error.config?.url?.includes("/auth/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
