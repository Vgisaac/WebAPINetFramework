import { useState } from "react";
import { Alert } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api/axios";
import Loader from "../../components/Loader";
import type { Producto } from "../../compiler/types";
import { getRoleFromToken } from "../../helpers/jwt";
import { useAuth } from "../../hooks/useAuth";
import { useProductos } from "../../hooks/useProducto";

const ProductCard = ({ producto }: { producto: Producto }) => (
  <>
    <h2 className="text-lg font-semibold text-gray-900">{producto.nombre}</h2>
    <p className="mt-1 text-sm text-gray-500">Marca: {producto.marca}</p>
    <p className="mt-2 text-xl font-bold text-gray-600">
      ${producto.precio.toFixed(2)}
    </p>
  </>
);

interface ProductAlert {
  color: "success" | "failure";
  mensaje: string;
}

interface ProductLocationState {
  alert?: ProductAlert;
}

interface DeleteProductResponse {
  isSuccess: boolean;
  mensaje: string;
}

export default function Productos() {
  const { productos, loading, error, refetch } = useProductos();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<ProductAlert | null>(
    (location.state as ProductLocationState | null)?.alert ?? null
  );
  const [productToDelete, setProductToDelete] = useState<Producto | null>(null);
  const [deleting, setDeleting] = useState(false);
  const role = user?.rol ?? getRoleFromToken(user?.token);
  const isAdmin = role === "Admin";

  const closeAlert = () => {
    setAlert(null);
    navigate(location.pathname, { replace: true, state: null });
  };

  const closeDeleteModal = () => {
    if (!deleting) setProductToDelete(null);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    setDeleting(true);
    setAlert(null);

    try {
      const response = await api.delete<DeleteProductResponse>(
        `/Producto/Eliminar/${productToDelete.idProducto}`
      );

      setAlert({
        color: response.data.isSuccess ? "success" : "failure",
        mensaje: response.data.mensaje,
      });

      if (response.data.isSuccess) {
        await refetch();
      }
    } catch (requestError: any) {
      setAlert({
        color: "failure",
        mensaje:
          requestError.response?.data?.mensaje ||
          "Ocurrió un error al eliminar el producto",
      });
    } finally {
      setDeleting(false);
      setProductToDelete(null);
    }
  };

  return (
    <div className="p-6">
      {alert && (
        <Alert color={alert.color} onDismiss={closeAlert} className="mb-5">
          {alert.mensaje}
        </Alert>
      )}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/productos/crear"
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              Crear producto
            </Link>
          )}
          <button
            onClick={refetch}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            Recargar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader />
        </div>
      ) : error ? (
        <div className="py-10 text-center">
          <p className="mb-4 text-red-500">{error}</p>
          <button
            onClick={refetch}
            className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Reintentar
          </button>
        </div>
      ) : productos.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          No hay productos disponibles.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {productos.map((producto: Producto) =>
            isAdmin ? (
              <div
                key={producto.idProducto}
                className="relative rounded-lg bg-white shadow transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <Link
                  to={`/productos/actualizar/${producto.idProducto}`}
                  state={{ producto }}
                  className="block rounded-lg p-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  aria-label={`Actualizar ${producto.nombre}`}
                >
                  <ProductCard producto={producto} />
                  <p className="mt-3 text-sm font-medium text-indigo-600">
                    Haz clic para actualizar
                  </p>
                </Link>
                <button
                  type="button"
                  onClick={() => setProductToDelete(producto)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-xl font-bold leading-none text-black hover:bg-red-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`Eliminar ${producto.nombre}`}
                  title="Eliminar producto"
                >
                  ×
                </button>
              </div>
            ) : (
              <div
                key={producto.idProducto}
                className="rounded-lg bg-white p-4 shadow"
              >
                <ProductCard producto={producto} />
              </div>
            )
          )}
        </div>
      )}

      {productToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={closeDeleteModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-product-title"
            className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2
              id="delete-product-title"
              className="text-xl font-bold text-gray-900"
            >
              Confirmar eliminación
            </h2>
            <p className="mt-3 text-gray-600">
              ¿Deseas eliminar el producto{" "}
              <span className="font-semibold">{productToDelete.nombre}</span>?
              Esta acción no se puede deshacer.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting && <Loader />}
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
