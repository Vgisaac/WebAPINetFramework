import { createContext } from "react";
import type { User } from "../compiler/types";
import { useState } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

/**
 * @interface AuthContext
 * Define la forma del contexto de autenticación, incluyendo el estado del usuario
 * y la función para actualizarlo.
 */
interface AuthContext {
  user: User | null;
  setUser: (user: User | null) => void;
}

/**
 * @constant AuthContext
 * Crea el contexto de React para la autenticación.
 * Se inicializa con un usuario nulo y una función `setUser` vacía como valores predeterminados.
 */
export const AuthContext = createContext<AuthContext>({
  user: null,
  setUser: () => {},
});

/**
 * @component Provider
 * Componente proveedor que envuelve la aplicación para proporcionar el contexto de autenticación.
 * Inicializa el estado del usuario desde el `localStorage` para mantener la persistencia de la sesión.
 * @param {object} props - Propiedades del componente.
 * @param {any} props.children - Los componentes hijos que tendrán acceso al contexto.
 */
const Provider = ({children}: any) => {
  const { getItem } = useLocalStorage();
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = getItem("user");
    if (storedUser) {
      return JSON.parse(storedUser);
    }
    return null;
  })

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * @constant AuthProvider
 * Objeto que agrupa el `Provider` y el `Consumer` del contexto para una exportación más limpia.
 */
const AuthProvider = {Provider, Consumer: AuthContext.Consumer};

export default AuthProvider;