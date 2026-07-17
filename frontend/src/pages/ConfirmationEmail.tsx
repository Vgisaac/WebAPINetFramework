import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useConfirmEmail } from "../hooks/useConfirmEmail";

const ConfirmationEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { confirmEmail } = useConfirmEmail();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const hasVerified = useRef(false);

  useEffect(() => {
    document.title = "Confirmación de Email";

    if (hasVerified.current) return;

    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setErrorMessage("Token no válido.");
      setLoading(false);
      return;
    }

    const verificar = async () => {
      hasVerified.current = true;

      try {
        const data = await confirmEmail(token, setErrorMessage);

        if (data?.isSuccess) {
          setStatus("success");
          setSuccessMessage(data.mensaje);
          setErrorMessage(null);
        } else {
          setStatus("error");
          setErrorMessage(data?.mensaje || "Error al verificar el correo.");
          setSuccessMessage(null);
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage("Error al verificar el correo.");
        setSuccessMessage(null);
      } finally {
        setLoading(false);
      }
    };

    verificar();
  }, [location.search]);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 w-full max-w-md mx-auto">
        <div className="text-center">

          {loading ? (
            <p className="text-gray-600 text-lg">Verificando tu correo...</p>
          ) : (
            <>
              {status === "success" ? (
                <>
                  <FaCheckCircle className="w-20 h-20 text-green-500 animate-bounce mx-auto mb-6" />

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    ¡Correo Verificado!
                  </h1>

                  <p className="text-gray-600 text-lg mb-8">{successMessage}</p>

                  <button
                    onClick={handleLoginRedirect}
                    className="w-full py-3 px-6 text-lg font-medium text-white bg-linear-to-r from-blue-500 to-blue-600 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
                  >
                    Ir a Iniciar Sesión
                  </button>
                </>
              ) : (
                <>
                  <FaTimesCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                    Error en la verificación
                  </h1>

                  <p className="text-gray-600 text-lg mb-8">{errorMessage}</p>
                </>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default ConfirmationEmail;
