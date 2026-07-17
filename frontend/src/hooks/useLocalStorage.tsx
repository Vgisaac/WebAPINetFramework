import { useState } from "react";

/**
 * Hook personalizado para interactuar con el `localStorage` del navegador.
 * Proporciona métodos para establecer, obtener y eliminar ítems,
 * manteniendo un estado interno sincronizado.
 * @returns Un objeto con el valor actual y las funciones para manipular el `localStorage`.
 */
export const useLocalStorage = () => {
  const [value, setValue] = useState<string | null>(null);

  /**
   * Guarda un valor en el `localStorage` con una clave específica.
   * @param key - La clave bajo la cual se guardará el valor.
   * @param value - El valor (string) a guardar.
   */
  const setItem = (key: string, value: string) : void => {
    localStorage.setItem(key, value);
    setValue(value);
  };

  /**
   * Obtiene un valor del `localStorage` a partir de su clave.
   * @param key - La clave del ítem a obtener.
   * @returns El valor recuperado del `localStorage` o `null` si no existe.
   */
  const getItem = (key: string) : any => {
    const value = localStorage.getItem(key);
    setValue(value);
    return value;
  };

  /**
   * Elimina un ítem del `localStorage` usando su clave.
   * @param key - La clave del ítem a eliminar.
   */
  const removeItem = (key: string) : void => {
    localStorage.removeItem(key);
    setValue(null);
  };

  return { value, setItem, getItem, removeItem };
};