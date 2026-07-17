import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
// import Footer from "../components/Footer";


export function Layout() {

  return (
     <>
        <NavBar />
        <div className="px-2 py-2.5 sm:px-4 container mx-auto">
            <Outlet />
        </div>
        {/* <Footer /> */}
    </>
  )
}