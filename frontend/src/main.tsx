import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Router } from "../src/components/Router";
import AuthProvider  from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider.Provider>
      <RouterProvider router={Router} />
    </AuthProvider.Provider>
  </React.StrictMode>
);
