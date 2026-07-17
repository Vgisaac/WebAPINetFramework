import "../App.css"
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { Alert } from "flowbite-react";
import Loader from "../components/Loader";

export default function Register() {
    const { register } = useRegister()
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [success, setSuccess] = useState<string | null>(null); // ✅ ESTE ES EL QUE USA
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        correo: "",
        clave: "",
    });

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        try {
            const registrationData = {
                nombre: formData.nombre,
                apellido: formData.apellido,
                correo: formData.correo,
                clave: formData.clave,
            };
            
            await register(registrationData, setError, setSuccess);
            
        } catch (err: any) {
            console.error("Error en el registro:", err);
        } finally {
            setLoading(false);
        }
    }

    const handleInputChage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { target } = event;
        const { name, value } = target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate("/login", { state: { successMessage: success } });
            }, 4500);

            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    return (
        <>
            {error && (
                <Alert color="failure" onDismiss={() => setError(null)}>
                    <span className="whitespace-pre-line">{error}</span>
                </Alert>
            )}

            {success && (
                <Alert color="success" onDismiss={() => setSuccess(null)}>
                    <span className="font-medium">¡Éxito!</span> {success}
                </Alert>
            )}

            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Your Company"
                        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                        className="mx-auto h-10 w-auto"
                    />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Registrarse
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="nombre" className="block text-sm/6 font-medium text-gray-900">
                                Nombre
                            </label>
                            <div className="mt-2">
                                <input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    value={formData.nombre}
                                    onChange={handleInputChage}
                                    required
                                    autoComplete="additional-name"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="apellido" className="block text-sm/6 font-medium text-gray-900">
                                Apellidos
                            </label>
                            <div className="mt-2">
                                <input
                                    id="apellido"
                                    name="apellido"
                                    type="text"
                                    value={formData.apellido}
                                    onChange={handleInputChage}
                                    required
                                    autoComplete="additional-name"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Ingresa el correo
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="correo"
                                    type="email"
                                    value={formData.correo}
                                    onChange={handleInputChage}
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Ingresar Contraseña
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="clave"
                                    type="password"
                                    value={formData.clave}
                                    onChange={handleInputChage}
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full justify-center items-center gap-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading && <Loader />}
                                Registrarse
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}