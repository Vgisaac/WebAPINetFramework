import { Footer } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import type { MouseEvent } from "react";

const customTheme = {
  root: {
    base: "w-full rounded-none bg-white shadow-sm dark:bg-gray-900",
  },
};

const FooterComponent = () => {
  const navigate = useNavigate();

  return (
    <Footer theme={customTheme} container className="rounded-none">
      <div className="w-full">
        <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
          <Link to="/">
            <div className="mb-4 md:mb-0">
              <Footer.Brand
                href="/"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                alt="WebApiSign Logo"
                name="WebApiSign"
                className="h-8"
              />
            </div>
          </Link>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="Recursos" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="/docs"
                  onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    navigate("/docs");
                  }}
                  className="hover:text-indigo-600"
                >
                  Documentación
                </Footer.Link>

                <Footer.Link
                  href="/soporte"
                  onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    navigate("/soporte");
                  }}
                  className="hover:text-indigo-600"
                >
                  Soporte
                </Footer.Link>
              </Footer.LinkGroup>
            </div>

            <div>
              <Footer.Title title="Cuenta" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="/login"
                  onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    navigate("/login");
                  }}
                  className="hover:text-indigo-600"
                >
                  Iniciar sesión
                </Footer.Link>

                <Footer.Link
                  href="/register"
                  onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    navigate("/register");
                  }}
                  className="hover:text-indigo-600"
                >
                  Registrarse
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>

        <Footer.Divider />

        <Link to="/">
          <Footer.Copyright
            by="WebApiSign™"
            year={new Date().getFullYear()}
          />
        </Link>
      </div>
    </Footer>
  );
};

export default FooterComponent;
