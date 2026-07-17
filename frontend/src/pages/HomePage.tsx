import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Alert } from "flowbite-react";

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(
    !!location.state?.successMessage
  );
  const successMessage = location.state?.successMessage;

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

      return () => {
        clearTimeout(timer);
        if (location.state?.successMessage) {
          navigate(".", { state: undefined });
        }
      };
    }
  }, [showSuccessMessage, navigate, location]);

  return (
    <>
      {successMessage && (
        <Alert color="success" className="mx-auto mt-4 w-[90%] md:w-1/2 text-center">
          {successMessage}
        </Alert>
      )}

      <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        
        {/* Contenedor principal */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-2xl px-6 py-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
            Bienvenido a <span className="text-yellow-300">Web Api </span>
             .NET FRAMEWORK
          </h1>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/register"
              className="bg-yellow-400 text-gray-900 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-yellow-300 transition-transform transform hover:scale-105"
            >
              Crear cuenta
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-indigo-700 transition-transform transform hover:scale-105"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
