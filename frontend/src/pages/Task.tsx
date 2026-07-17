import { useState } from "react";
import { useTask } from "../hooks/useTask"
import Loader from "../components/Loader"
import type { Tarea } from "../compiler/types"
import { FaCheckCircle, FaCircle, FaChevronLeft, FaChevronRight} from "react-icons/fa";


export default function Tarea() {
    const { tareas, loading, error, refetch } = useTask();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage  = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTareas = tareas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tareas.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };


  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {

      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {

      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

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

    if (tareas.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500">
                No hay tareas disponibles.
            </div>
        );
    }

    return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mis Tareas</h1>
        <button
          onClick={refetch}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
        >
          Recargar
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <ul className="divide-y divide-gray-200">
          {currentTareas.map((tarea: Tarea) => (
            <li
              key={tarea.id}
              className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-3"
            >

              {tarea.isComplete ? (
                <FaCheckCircle className="text-green-500 text-xl shrink-0" />
              ) : (
                <FaCircle className="text-gray-300 text-xl shrink-0" />
              )}

              <span
                className={`flex-1 ${
                  tarea.isComplete
                    ? "line-through text-gray-500"
                    : "text-gray-900"
                }`}
              >
                {tarea.name}
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  tarea.isComplete
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {tarea.isComplete ? "Completada" : "Pendiente"}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {tareas.length > itemsPerPage && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Mostrando {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, tareas.length)} de{" "}
            {tareas.length} tareas
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FaChevronLeft />
            </button>

            <div className="flex gap-1">
              {getPageNumbers().map((pageNum, index) => (
                <button
                  key={index}
                  onClick={() => typeof pageNum === 'number' && goToPage(pageNum)}
                  disabled={pageNum === '...'}
                  className={`px-3 py-1 rounded-md text-sm ${
                    pageNum === currentPage
                      ? "bg-indigo-600 text-white font-medium"
                      : pageNum === '...'
                      ? "text-gray-400 cursor-default"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              ))}
            </div>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-between text-sm text-gray-600">
        <span>Total: {tareas.length} tareas</span>
        <span>
          Completadas: {tareas.filter((t) => t.isComplete).length} | Pendientes:{" "}
          {tareas.filter((t) => !t.isComplete).length}
        </span>
      </div>
    </div>
  );

}