import { useState, useEffect, useRef } from "react"
import { api } from "../api/axios"
import type { Producto, ProductoResponse } from "../compiler/types"

/**
 * Hook personalizado para obtener y gestionar una lista de productos desde la API.
 * Maneja los estados de carga, error y los datos de los productos.
 * @returns Un objeto con la lista de productos, el estado de carga,
 * el estado de error y una función para volver a cargar los datos.
 */
export const useProductos = () =>{
    const [productos, setProductos] = useState<Producto[]>([])
    const [loading, setLoanding] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const hasFetched = useRef(false)

    /**
     * Realiza una solicitud a la API para obtener la lista de productos.
     * Actualiza los estados de productos, carga y error según la respuesta.
     */
    const fetchProductos = async () =>{
        setLoanding(true)
        setError(null)
        try {
            const response = await api.get<ProductoResponse>("/Producto/Lista");
            if (response.data.value && Array.isArray(response.data.value)) {
                setProductos(response.data.value);
            }else {
                setError(response.data.mensaje || "No se pudieron obtener los productos")
            }
        } catch (err: any) {
            console.error("Error al obtener productos:", err)

            if (err.response) {
                setError(err.response.data?.mensaje || "Error del ser idor al obtener productos")
            } else if (err.request) {
                setError("No se pudo conectar con el servidor. Revisa tu conexión")
            } else {
                setError("Ocurrió un error inesperado. Inténtalo de nuevo")
            
            }
        } finally {
            setLoanding(false)
        }
    }

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchProductos()
    }, []);

    return {
        productos,
        loading,
        error,
        refetch: fetchProductos
    }
    
}