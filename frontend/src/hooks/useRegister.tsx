import { api } from "../api/axios";
import type { User, Response } from "../compiler/types";

/**
 * Hook personalizado para gestionar el registro de nuevos usuarios.
 * @returns Un objeto que contiene la función `register`.
 */
export const useRegister = () => {
  /**
   * Realiza la solicitud de registro de un nuevo usuario a la API.
   * Maneja las respuestas de éxito y error, actualizando los estados correspondientes.
   * @param user - Objeto con los datos del usuario a registrar (nombre, correo, clave).
   * @param setError - Función para establecer el mensaje de error en caso de fallo.
   * @param setSuccess - Función para establecer el mensaje de éxito en caso de un registro correcto.
   */
  const register = async (user: User, setError: Function, setSuccess: Function): Promise<void> => {
    try {
      const response = await api.post<Response>("/Acceso/Registrarse", {
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        clave: user.clave
      });

      console.log(response)


      if (!response.data.isSuccess) {
        throw new Error(response.data.mensaje || "No se pudo registrar.");
      }

      setSuccess(response.data.mensaje || "Registro exitoso, revisa tu correo para confirmar.");

    } catch (error: any) {
    // console.error(error);

    if (error.response && error.response.data?.errors) {
        const errores = error.response.data.errors;

        const mensajes = Object.values(errores)
            .flat()
            .join("\n");

        setError(mensajes);
        return;
    }

    if (error.response) {
        const mensaje = error.response.data?.mensaje || "Error del servidor.";
        setError(mensaje);
        return;
    }

    if (error.request) {
        setError("No se pudo conectar con el servidor. Verifica tu conexión.");
        return;
    }

    setError("Ocurrió un error inesperado. Inténtalo nuevamente.");
}

  };

  return { register };
};
