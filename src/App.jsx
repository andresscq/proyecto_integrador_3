import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Importación de Páginas (Views)
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Materials from "./pages/Materials";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

// Importación de Componentes Globales
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      {/* El Navbar se coloca fuera de Routes para que sea visible en todas las páginas */}
      <Navbar />

      {/* Contenedor principal con padding superior para compensar el Navbar fixed */}
      <div className="container-fluid pt-4">
        <Routes>
          {/* RUTA PÚBLICA: Home (Landig Page) */}
          <Route path="/" element={<Home />} />

          {/* RUTAS DE AUTENTICACIÓN */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* RUTAS PROTEGIDAS (Solo usuarios logueados) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/materials" element={<Materials />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* RUTAS DE ADMINISTRADOR (Solo usuarios con rol 'admin') */}
          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* MANEJO DE ERRORES: Redirigir cualquier ruta desconocida al Home o Login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
