import { useState, useEffect } from "react";
import { Container, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // Redirige al Dashboard si ya está logueado
    }
  }, [navigate]);

  const handleLogin = async () => {
    try {
      const { data } = await API.post("/auth/login", credentials);
      localStorage.setItem("token", data.token); // Guarda el token
      navigate("/dashboard"); // Redirige al Dashboard
    } catch (error) {
      setError("Credenciales inválidas");
      console.error("Error al iniciar sesión:", error.response?.data || error.message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Iniciar Sesión
      </Typography>
      {error && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <TextField
        fullWidth
        label="Correo"
        margin="normal"
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
      />
      <TextField
        fullWidth
        type="password"
        label="Contraseña"
        margin="normal"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
      />
      <Button variant="contained" fullWidth onClick={handleLogin} sx={{ mt: 2 }}>
        Ingresar
      </Button>
    </Container>
  );
};

export default Login;

