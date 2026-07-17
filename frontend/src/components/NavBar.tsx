import { Navbar, Button } from "flowbite-react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../App.css";

const NavBar = () => {
  const { user, logout } = useAuth();
  return (
    <Navbar fluid rounded className="bg-white shadow-sm dark:bg-gray-900">
      {/* Logo */}
      <Link to="/" className="flex items-center space-x-2">
        <img
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          className="h-8 w-8"
          alt="Logo"
        />
        <span className="text-xl font-semibold dark:text-white">Web Api</span>
      </Link>

      {/* Menú principal */}
      <div className="flex items-center gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-gray-700 dark:text-gray-200 hover:text-indigo-600 ${
              isActive ? "font-semibold text-indigo-600" : ""
            }`
          }
        >
          Inicio
        </NavLink>

        {user && (
          <NavLink
            to="/productos"
            className={({ isActive }) =>
              `text-gray-700 dark:text-gray-200 hover:text-indigo-600 ${
                isActive ? "font-semibold text-indigo-600" : ""
              }`
            }
          >
            Productos
          </NavLink>
        )}

        {user && (
          <NavLink
            to="/tareas"
            className={({ isActive }) =>
              `text-gray-700 dark:text-gray-200 hover:text-indigo-600 ${
                isActive ? "font-semibold text-indigo-600" : ""
              }`
            }
          >
            Tareas
          </NavLink>
        )}

        {user ? (
          <>
            {/* <span className="text-gray-800 dark:text-white">Hola, {user.nombre}</span> */}
            <Button color="indigo" size="sm" onClick={logout}>
              Cerrar sesión
            </Button>
          </>
        ) : (
          <>
            <NavLink to="/register">
              <Button color="indigo" size="sm">Registrarse</Button>
            </NavLink>
            <NavLink to="/login">
              <Button color="indigo" size="sm">Iniciar sesión</Button>
            </NavLink>
          </>
        )}
      </div>
    </Navbar>
  );
};

export default NavBar;
