import { useContext } from "react";
import type { User } from "../compiler/types";
import { AuthContext } from "../context/AuthContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

/**
 * Hook para gestionar los datos del usuario autenticado.
 * Proporciona acceso al estado del usuario y funciones para modificarlo,
 * sincronizando con el `localStorage`.
 * @returns Un objeto con el estado del usuario y funciones para añadir, eliminar y establecer el usuario.
 */
export const useUser = () => {
  const { user, setUser } = useContext(AuthContext);
  const { setItem } = useLocalStorage();

  /**
   * Añade un usuario al estado global y lo persiste en el `localStorage`.
   * @param user - El objeto de usuario a añadir.
   */
  const addUser = (user: User): void => {
    setUser(user);
    setItem("user", JSON.stringify(user));
  };

  /**
   * Elimina al usuario del estado global y del `localStorage`.
   */
  const removeUser = (): void => {
    setUser(null);
    setItem("user", "");
  };

  return { user, addUser, removeUser, setUser };
};