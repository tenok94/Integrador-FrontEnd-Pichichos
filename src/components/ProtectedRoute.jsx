import { Navigate } from "react-router-dom";
import PropTypes from "prop-types"; // Importamos PropTypes

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Obtenemos el token desde localStorage

  if (!token) {
    return <Navigate to="/" />; // Redirige al login si no hay token
  }

  return children; // Si hay token, muestra la página protegida
};

// Validación de props con PropTypes
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;

