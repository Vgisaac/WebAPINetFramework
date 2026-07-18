
export interface User {
	// firstname: string;
	nombre: string;
	apellido: string;
	correo: string;
	token?: string;
	rol?: string;
	clave?: string;
}

export interface LoginRequest {
	correo: string | null;
	clave: string | null;

}

export interface Response {
	value: object;
	isSuccess: boolean;
	mensaje: string;
	token?: string;
}

export interface Producto {
	idProducto: number;
	nombre: string;
	marca: string;
	precio: number;
}

export interface ProductoResponse extends Response {
	value: Producto[];
}

export interface Tarea {
	id: number;
	name: string;
	isComplete: boolean;
}

export interface TareaResponse extends Response {
	value: Tarea[];

}
