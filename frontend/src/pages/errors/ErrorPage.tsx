import { Link } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <>
      {/* <h4 className={"d-flex align-items-center align-self-center"}>Página de Error |  <Link to={"/"}>Regresar</Link></h4> */}
       <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-indigo-600">404</h2>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            Página no encontrada
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Lo sentimos, no pudimos encontrar la página que estás buscando.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </main>
    </>
    
  );
};

export default ErrorPage;
