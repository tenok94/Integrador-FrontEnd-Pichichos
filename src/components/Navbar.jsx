import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Elimina el token del almacenamiento local
    navigate("/"); // Redirige al login
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Gestión Veterinaria
        </Typography>
        <Button color="inherit" onClick={() => navigate("/dashboard")}>
          Dashboard
        </Button>
        <Button color="inherit" onClick={() => navigate("/mascotas")}>
          Mascotas
        </Button>
        <Button color="inherit" onClick={() => navigate("/clientes")}>
          Clientes
        </Button>
        <Button color="inherit" onClick={() => navigate("/turnos")}>
          Turnos
        </Button>
        <Button color="inherit" onClick={() => navigate("/perfil")}>
          Perfil
        </Button>
        <Button color="inherit" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

