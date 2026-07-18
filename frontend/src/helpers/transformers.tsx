import type {User}  from "../compiler/types";
import { getRoleFromToken } from "./jwt";
/**
 * Proporciona un conjunto de funciones para transformar datos entre diferentes formatos.
 * @returns Un objeto que contiene funciones de transformación.
 */
export const transformers = () => {
   /**
   * Transforma los datos de la respuesta de la API de inicio de sesión a un objeto de tipo User.
   * @param user - El objeto de respuesta de la API.
   * @returns Un objeto User con los datos relevantes y la clave vacía.
   */
  const transformUserResponse = (user: any) : User => {
    return {
      correo: user.correo,
      token: user.token,
      rol: user.rol ?? getRoleFromToken(user.token) ?? undefined,
      nombre: user.nombre,
      apellido: user.apellido,
    }
  }

  return { transformUserResponse }
};
