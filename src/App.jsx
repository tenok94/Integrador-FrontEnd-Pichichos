import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Mascotas from "./pages/Mascotas";
import Clientes from "./pages/Clientes";
import Turnos from "./pages/Turnos";
import Perfil from "./pages/Perfil";
import themeConfig from "./theme";
import ProtectedRoute from "./components/ProtectedRoute"; // Importamos el componente

function App() {
  const theme = useSelector((state) => state.user.theme);

  return (
    <ThemeProvider theme={themeConfig(theme)}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          {/* Ruta pública */}
          <Route path="/" element={<Login />} />

          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mascotas"
            element={
              <ProtectedRoute>
                <Mascotas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <ProtectedRoute>
                <Clientes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/turnos"
            element={
              <ProtectedRoute>
                <Turnos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
