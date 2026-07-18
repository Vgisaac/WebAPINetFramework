import { useState } from "react";
import { Alert } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import Loader from "../../components/Loader";

interface CreateProductResponse {
  isSuccess: boolean;
  mensaje: string;
  errores?: string[];
}

export default function CreateProducto() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [precio, setPrecio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<CreateProductResponse>("/Producto/Crear", {
        nombre: nombre.trim(),
        marca: marca.trim(),
        precio: Number(precio),
      });

      if (!response.data.isSuccess) {
        setError(response.data.mensaje || "No se pudo crear el producto");
        return;
      }

      navigate("/productos", {
        replace: true,
        state: {
          alert: {
            color: "success",
            mensaje: response.data.mensaje,
          },
        },
      });
    } catch (requestError: any) {
      const errores = requestError.response?.data?.errores;
      const mensajeBackend = requestError.response?.data?.mensaje;

      if (Array.isArray(errores)) {
        setError(errores.join("\n"));
      } else {
        setError(
          mensajeBackend ||
            (requestError.response?.status === 403
              ? "No tienes permisos para crear productos"
              : "Ocurrió un error al crear el producto")
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-gray-900">Crear producto</h1>

        {error && (
          <Alert
            color="failure"
            onDismiss={() => setError(null)}
            className="mt-4"
          >
            <span className="whitespace-pre-line">{error}</span>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              id="nombre"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              maxLength={100}
              required
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
              Marca
            </label>
            <input
              id="marca"
              value={marca}
              onChange={(event) => setMarca(event.target.value)}
              maxLength={50}
              required
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
              Precio
            </label>
            <input
              id="precio"
              type="number"
              value={precio}
              onChange={(event) => setPrecio(event.target.value)}
              min="0.01"
              step="0.01"
              required
              className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-indigo-600"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Link
              to="/productos"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <Loader />}
              Guardar producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
