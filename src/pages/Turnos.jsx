import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import API from "../services/api";

const Turnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTurno, setSelectedTurno] = useState({
    mascota: "",
    cliente: "",
    fecha: "",
    notas: "",
  });

  // Obtener turnos, mascotas y clientes del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [turnosData, mascotasData, clientesData] = await Promise.all([
          API.get("/turnos", { headers: { Authorization: token } }),
          API.get("/mascotas", { headers: { Authorization: token } }),
          API.get("/clientes", { headers: { Authorization: token } }),
        ]);
        setTurnos(turnosData.data);
        setMascotas(mascotasData.data);
        setClientes(clientesData.data);
      } catch (error) {
        console.error("Error al obtener datos:", error.response?.data || error.message);
      }
    };
    fetchData();
  }, []);

  // Abrir el modal para agregar/editar turno
  const handleOpen = (turno = null) => {
    setSelectedTurno(
      turno || { mascota: "", cliente: "", fecha: "", notas: "" }
    );
    setOpen(true);
  };

  // Cerrar el modal
  const handleClose = () => {
    setOpen(false);
    setSelectedTurno({ mascota: "", cliente: "", fecha: "", notas: "" });
  };

  // // Guardar turno (crear o actualizar)
  // const handleSave = async () => {
  //   try {
  //     const token = localStorage.getItem("token");

  //     if (selectedTurno._id) {
  //       // Actualizar turno existente
  //       const { data } = await API.put(`/turnos/${selectedTurno._id}`, selectedTurno, {
  //         headers: { Authorization: token },
  //       });
  //       setTurnos((prev) =>
  //         prev.map((t) => (t._id === data._id ? data : t))
  //       );
  //     } else {
  //       // Crear nuevo turno
  //       const { data } = await API.post("/turnos", selectedTurno, {
  //         headers: { Authorization: token },
  //       });
  //       setTurnos((prev) => [...prev, data]);
  //     }
  //     handleClose();
  //   } catch (error) {
  //     console.error("Error al guardar turno:", error.response?.data || error.message);
  //   }
  // };
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
  
      if (!selectedTurno.mascota || !selectedTurno.cliente) {
        console.error("Error: Falta seleccionar mascota o cliente.");
        return;
      }
  
      // Asegurar que se envían solo los IDs
      const turnoData = {
        mascota: typeof selectedTurno.mascota === "object" ? selectedTurno.mascota._id : selectedTurno.mascota,
        cliente: typeof selectedTurno.cliente === "object" ? selectedTurno.cliente._id : selectedTurno.cliente,
        fecha: selectedTurno.fecha,
        notas: selectedTurno.notas,
      };
  
      console.log("Datos enviados al backend:", turnoData);
  
      if (selectedTurno._id) {
        // Actualizar turno
        const { data } = await API.put(`/turnos/${selectedTurno._id}`, turnoData, {
          headers: { Authorization: token },
        });
        setTurnos((prev) =>
          prev.map((t) => (t._id === data._id ? data : t))
        );
      } else {
        // Crear nuevo turno
        const { data } = await API.post("/turnos", turnoData, {
          headers: { Authorization: token },
        });
        setTurnos((prev) => [...prev, data]);
      }
      handleClose();
    } catch (error) {
      console.error("Error al guardar turno:", error.response?.data || error.message);
    }
  };
  

  // Eliminar turno
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/turnos/${id}`, { headers: { Authorization: token } });
      setTurnos((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error al eliminar turno:", error.response?.data || error.message);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Lista de Turnos
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        onClick={() => handleOpen()}
        sx={{ marginBottom: 2 }}
      >
        Nuevo Turno
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mascota</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {turnos.map((turno) => (
              <TableRow key={turno._id}>
                <TableCell>{turno.mascota?.nombre}</TableCell>
                <TableCell>{turno.cliente?.nombre}</TableCell>
                <TableCell>
                  {new Date(turno.fecha).toLocaleString("es-ES")}
                </TableCell>
                <TableCell>{turno.notas}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(turno)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(turno._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedTurno._id ? "Editar Turno" : "Nuevo Turno"}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Mascota</InputLabel>
            <Select
              value={selectedTurno.mascota}
              onChange={(e) =>
                setSelectedTurno((prev) => ({
                  ...prev,
                  mascota: e.target.value,
                }))
              }
            >
              {mascotas.map((mascota) => (
                <MenuItem key={mascota._id} value={mascota._id}>
                  {mascota.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Cliente</InputLabel>
            <Select
              value={selectedTurno.cliente}
              onChange={(e) =>
                setSelectedTurno((prev) => ({
                  ...prev,
                  cliente: e.target.value,
                }))
              }
            >
              {clientes.map((cliente) => (
                <MenuItem key={cliente._id} value={cliente._id}>
                  {cliente.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Fecha"
            type="datetime-local"
            value={selectedTurno.fecha}
            onChange={(e) =>
              setSelectedTurno((prev) => ({ ...prev, fecha: e.target.value }))
            }
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ marginBottom: 2 }}
          />
          <TextField
            fullWidth
            label="Notas"
            value={selectedTurno.notas}
            onChange={(e) =>
              setSelectedTurno((prev) => ({ ...prev, notas: e.target.value }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Turnos;
