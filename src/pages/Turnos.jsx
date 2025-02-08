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
  MenuItem,
  Select,
  InputLabel,
  FormControl,
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

  // Obtener turnos, mascotas y clientes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [turnosRes, mascotasRes, clientesRes] = await Promise.all([
          API.get("/turnos", { headers: { Authorization: token } }),
          API.get("/mascotas", { headers: { Authorization: token } }),
          API.get("/clientes", { headers: { Authorization: token } }),
        ]);

        setTurnos(turnosRes.data);
        setMascotas(mascotasRes.data);
        setClientes(clientesRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error.message);
      }
    };

    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!selectedTurno.mascota || !selectedTurno.cliente) {
        console.error("Debe seleccionar una mascota y un cliente");
        return;
      }

      if (selectedTurno._id) {
        // Actualizar turno existente
        const { data } = await API.put(
          `/turnos/${selectedTurno._id}`,
          selectedTurno,
          { headers: { Authorization: token } }
        );
        setTurnos((prev) =>
          prev.map((t) => (t._id === data._id ? data : t))
        );
      } else {
        // Crear nuevo turno
        const { data } = await API.post("/turnos", selectedTurno, {
          headers: { Authorization: token },
        });
        setTurnos((prev) => [...prev, data]);
      }

      handleClose();
    } catch (error) {
      console.error(
        "Error al guardar turno:",
        error.response?.data || error.message
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/turnos/${id}`, {
        headers: { Authorization: token },
      });
      setTurnos((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error al eliminar turno:", error.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTurno({ mascota: "", cliente: "", fecha: "", notas: "" });
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Lista de Turnos
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        onClick={() => setOpen(true)}
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
                <TableCell>{turno.mascota?.nombre || "Sin mascota"}</TableCell>
                <TableCell>{turno.cliente?.nombre || "Sin cliente"}</TableCell>
                <TableCell>
                  {new Date(turno.fecha).toLocaleString("es-ES")}
                </TableCell>
                <TableCell>{turno.notas}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setSelectedTurno(turno);
                      setOpen(true);
                    }}
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
          <FormControl fullWidth margin="normal">
            <InputLabel>Mascota</InputLabel>
            <Select
              value={selectedTurno.mascota}
              onChange={(e) =>
                setSelectedTurno((prev) => ({ ...prev, mascota: e.target.value }))
              }
            >
              {mascotas.map((m) => (
                <MenuItem key={m._id} value={m._id}>
                  {m.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Cliente</InputLabel>
            <Select
              value={selectedTurno.cliente}
              onChange={(e) =>
                setSelectedTurno((prev) => ({ ...prev, cliente: e.target.value }))
              }
            >
              {clientes.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Fecha"
            type="datetime-local"
            value={selectedTurno.fecha}
            onChange={(e) =>
              setSelectedTurno((prev) => ({ ...prev, fecha: e.target.value }))
            }
          />
          <TextField
            fullWidth
            margin="normal"
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