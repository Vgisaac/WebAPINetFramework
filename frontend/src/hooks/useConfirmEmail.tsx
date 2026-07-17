import { api } from "../api/axios";
import type { Response } from "../compiler/types";

/**
 * Hook personalizado para gestionar la confirmación de correo electrónico.
 * @returns Un objeto que contiene la función `confirmEmail`.
 */
export const useConfirmEmail = () => {

  /**
   * Envía una solicitud a la API para confirmar el correo electrónico de un usuario usando un token.
   * @param token - El token de confirmación recibido por el usuario.
   * @param setError - Función para establecer un mensaje de error si la confirmación falla.
   * @returns Una promesa que se resuelve con los datos de la respuesta de la API o `null` en caso de un error de conexión.
   */
  const confirmEmail = async (token: string, setError: Function): Promise<Response | null> => {
  try {
    const response = await api.get<Response>(`/Acceso/ConfirmarCorreo?token=${token}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      setError(error.response.data?.mensaje || "Error al verificar el correo.");
      return error.response.data;
    }
    setError("Error al conectar con el servidor.");
    return null;
  }
};

  return { confirmEmail };
};
