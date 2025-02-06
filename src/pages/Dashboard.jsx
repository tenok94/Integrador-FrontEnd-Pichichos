import  { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography } from "@mui/material";
import API from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({ clientes: 0, mascotas: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token"); // Obtener el token del usuario
        const { data } = await API.get("/stats", {
          headers: { Authorization: token },
        });
        setStats(data);
      } catch (error) {
        console.error("Error al obtener estadísticas:", error.response?.data || error.message);
      }
    };

    fetchStats();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Total de Clientes</Typography>
              <Typography variant="h3" color="primary">
                {stats.clientes}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardContent>
              <Typography variant="h5">Total de Mascotas</Typography>
              <Typography variant="h3" color="primary">
                {stats.mascotas}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
