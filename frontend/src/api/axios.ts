import axios from "axios";
import type { User } from "../compiler/types";

export const api = axios.create({
  baseURL: "http://localhost:5035/api"
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user: User = JSON.parse(userString);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
