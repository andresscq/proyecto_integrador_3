import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("loggedUser"));

  // Si no hay usuario, redirige al login (requireAuth)
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si se pide un rol específico (admin) y no lo tiene, redirige al dashboard (requireAdmin)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    alert("Acceso denegado");
    return <Navigate to="/dashboard" replace />;
  }

  // Si todo está bien, muestra el componente hijo (página)
  return <Outlet />;
};

export default ProtectedRoute;
