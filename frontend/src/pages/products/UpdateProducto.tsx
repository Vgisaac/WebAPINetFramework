import { useEffect, useState } from "react";
import { Alert } from "flowbite-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api/axios";
import Loader from "../../components/Loader";
import type { Producto, ProductoResponse } from "../../compiler/types";

interface UpdateProductResponse {
  isSuccess: boolean;
  mensaje: string;
  errores?: string[];
}

interface ProductLocationState {
  producto?: Producto;
}

export default function UpdateProducto() {
  const { idProducto } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const initialProduct = (location.state as ProductLocationState | null)?.producto;

  const [nombre, setNombre] = useState(initialProduct?.nombre ?? "");
  const [marca, setMarca] = useState(initialProduct?.marca ?? "");
  const [precio, setPrecio] = useState(
    initialProduct ? String(initialProduct.precio) : ""
  );
  const [loadingProduct, setLoadingProduct] = useState(!initialProduct);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialProduct) return;

    const productId = Number(idProducto);

    if (!Number.isInteger(productId) || productId <= 0) {
      setError("El identificador del producto no es válido");
      setLoadingProduct(false);
      return;
    }

    const loadProduct = async () => {
      try {
        const response = await api.get<ProductoResponse>("/Producto/Lista");
        const product = response.data.value.find(
          (item) => item.idProducto === productId
        );

        if (!product) {
          setError("Producto no encontrado");
          return;
        }

        setNombre(product.nombre);
        setMarca(product.marca);
        setPrecio(String(product.precio));
      } catch {
        setError("No se pudo cargar el producto");
      } finally {
        setLoadingProduct(false);
      }
    };

    loadProduct();
  }, [idProducto, initialProduct]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await api.put<UpdateProductResponse>(
        `/Producto/Actualizar/${idProducto}`,
        {
          nombre: nombre.trim(),
          marca: marca.trim(),
          precio: Number(precio),
        }
      );

      if (!response.data.isSuccess) {
        setError(response.data.mensaje || "No se pudo actualizar el producto");
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
            (requestError.response?.status === 404
              ? "Producto no encontrado"
              : requestError.response?.status === 403
                ? "No tienes permisos para actualizar productos"
                : "Ocurrió un error al actualizar el producto")
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <div className="rounded-lg bg-white p-6 shadow">
        <h1 className="text-2xl font-bold text-gray-900">Actualizar producto</h1>

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
              disabled={saving || !!error && !nombre}
              className="flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving && <Loader />}
              Actualizar producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
