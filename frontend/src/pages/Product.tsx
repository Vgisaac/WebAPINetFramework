import { useProductos } from "../hooks/useProducto";
import Loader from "../components/Loader";
import type { Producto } from "../compiler/types";

export default function Productos() {
  const { productos, loading, error, refetch } = useProductos();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No hay productos disponibles.
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
        >
          Recargar
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {productos.map((p: Producto) => (
          <div
            key={p.idProducto}
            className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-lg font-semibold text-gray-900">{p.nombre}</h2>
            <p className="text-sm text-gray-500 mt-1">Marca: {p.marca}</p>
            <p className="text-gray-600 mt-2 text-xl font-bold">
              ${p.precio.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}