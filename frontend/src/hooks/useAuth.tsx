import { useEffect } from "react";
import { useUser } from "../hooks/useUser";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { api } from "../api/axios";
import type { Response, LoginRequest, User } from "../compiler/types";
import { transformers } from "../helpers/transformers";

/**
 * Hook personalizado para la autenticación de usuarios.
 * Gestiona el estado de autenticación, el inicio de sesión, el cierre de sesión
 * y la persistencia del usuario en el almacenamiento local.
 * @returns Un objeto con el estado del usuario y las funciones de autenticación.
 */
export const useAuth = () => {
  const { user, addUser, removeUser, setUser } = useUser();
  const { getItem } = useLocalStorage();
  const { transformUserResponse } = transformers();

  /**
   * Carga el usuario desde el localStorage al estado de la aplicación al iniciar.
   */
  useEffect(() => {
    const storedUser = getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  
  /**
   * Realiza la solicitud de inicio de sesión a la API.
   * En caso de éxito, transforma y almacena los datos del usuario.
   * En caso de error, actualiza el estado de error.
   * @param req - Objeto con las credenciales de inicio de sesión (correo y clave).
   * @param setError - Función para establecer el mensaje de error.
   */
  const login = async (req: LoginRequest, setError: Function): Promise<void> => {
  try {
    const response = await api.post<Response>("/Acceso/Login", {
      correo: req.correo,
      clave: req.clave
    });

    if (!response.data.isSuccess) {
      setError(response.data.mensaje);
      return;
    }

    const user: User = transformUserResponse(response.data);
    addUser(user);

  } catch (error) {
    setError("No se pudo conectar con el servidor.");
  }
};

  /**
   * Cierra la sesión del usuario eliminando sus datos del estado y del almacenamiento local.
   */
  const logout = (): void => {
    removeUser();
  };

  return { user, login, logout, setUser };
};