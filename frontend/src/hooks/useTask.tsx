import { useState, useEffect, useRef } from "react";
import { api } from "../api/axios";
import type { Tarea, TareaResponse } from "../compiler/types";

/**
 * Hook personalizado para obtener y gestionar una lista de tareas desde la API.
 * Maneja los estados de carga, error y los datos de las tareas.
 * @returns Un objeto con la lista de tareas, el estado de carga,
 * el estado de error y una función para volver a cargar los datos.
 */
export const useTask = () => {
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const hasFetched = useRef(false);

    /**
     * Realiza una solicitud a la API para obtener la lista de tareas.
     * Actualiza los estados de tareas, carga y error según la respuesta.
     */
    const fetchTareas = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<TareaResponse>("/TodoItem/Items");
            if (response.data.value && Array.isArray(response.data.value)) {
                setTareas(response.data.value);
            } else {
                setError(response.data.mensaje || "No se pudieron obtener las tareas");
            }
        } catch (err: any) {
            console.error("Error al obtener tareas:", err);

            if (err.response) {
                setError(err.response.data?.mensaje || "Error del servidor al obtener tareas");
            } else if (err.request) {
                setError("No se pudo conectar con el servidor. Revisa tu conexión");
            } else {
                setError("Ocurrió un error inesperado. Inténtalo de nuevo");
            }
        } finally {
            setLoading(false);
        }
            
    }

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchTareas();
    }, []);

    return {
        tareas,
        loading,
        error,
        refetch: fetchTareas
    };

}