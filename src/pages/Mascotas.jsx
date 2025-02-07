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

const Mascotas = () => {
  const [mascotas, setMascotas] = useState([]);
  const [clientes, setClientes] = useState([]); // Lista de clientes
  const [open, setOpen] = useState(false);
  const [selectedMascota, setSelectedMascota] = useState(null);

  // Obtener mascotas y clientes del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // Obtener mascotas
        const { data: mascotasData } = await API.get("/mascotas", {
          headers: { Authorization: token },
        });
        setMascotas(mascotasData);

        // Obtener clientes
        const { data: clientesData } = await API.get("/clientes", {
          headers: { Authorization: token },
        });
        setClientes(clientesData);
      } catch (error) {
        console.error("Error al cargar datos:", error.response?.data || error.message);
      }
    };

    fetchData();
  }, []);

  // Abrir modal (crear o editar mascota)
  const handleOpen = (mascota = null) => {
    setSelectedMascota(
      mascota || { nombre: "", especie: "", cliente_id: "" } // Cliente vacío para una nueva mascota
    );
    setOpen(true);
  };

  // Cerrar modal
  const handleClose = () => {
    setOpen(false);
    setSelectedMascota(null);
  };

  // Guardar mascota (crear o actualizar)
  // const handleSave = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (selectedMascota._id) {
  //       // Actualizar
  //       await API.put(`/mascotas/${selectedMascota._id}`, selectedMascota, {
  //         headers: { Authorization: token },
  //       });
  //       setMascotas((prev) =>
  //         prev.map((m) =>
  //           m._id === selectedMascota._id ? selectedMascota : m
  //         )
  //       );
  //     } else {
  //       // Crear nueva mascota
  //       const { data } = await API.post("/mascotas", selectedMascota, {
  //         headers: { Authorization: token },
  //       });
  //       setMascotas((prev) => [...prev, data]);
  //     }
  //     handleClose();
  //   } catch (error) {
  //     console.error("Error al guardar mascota:", error.response?.data || error.message);
  //   }
  // };
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
  
      // Asegurarse de que cliente_id esté definido
      if (!selectedMascota.cliente_id) {
        console.error("Cliente no seleccionado");
        return;
      }
  
      if (selectedMascota._id) {
        // Actualizar mascota existente
        const { data } = await API.put(
          `/mascotas/${selectedMascota._id}`,
          {
            nombre: selectedMascota.nombre,
            especie: selectedMascota.especie,
            cliente_id: selectedMascota.cliente_id, // Aseguramos que se envíe cliente_id
          },
          {
            headers: { Authorization: token },
          }
        );
        // Actualizar la lista local
        setMascotas((prev) =>
          prev.map((m) =>
            m._id === data._id ? data : m // Aseguramos que se actualicen todos los campos
          )
        );
      } else {
        // Crear nueva mascota
        const { data } = await API.post(
          "/mascotas",
          {
            nombre: selectedMascota.nombre,
            especie: selectedMascota.especie,
            cliente_id: selectedMascota.cliente_id, // Aseguramos que se envíe cliente_id
          },
          {
            headers: { Authorization: token },
          }
        );
        setMascotas((prev) => [...prev, data]);
      }
      handleClose();
    } catch (error) {
      console.error(
        "Error al guardar mascota:",
        error.response?.data || error.message
      );
    }
  };
  

  // Eliminar mascota
  const deleteMascota = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/mascotas/${id}`, {
        headers: { Authorization: token },
      });
      setMascotas(mascotas.filter((m) => m._id !== id));
    } catch (error) {
      console.error("Error al eliminar mascota:", error.response?.data || error.message);
    }
  };

  // Manejar cambios en los campos del modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedMascota((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Lista de Mascotas
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCircleIcon />}
        onClick={() => handleOpen()}
        sx={{ marginBottom: 2 }}
      >
        Nueva Mascota
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Especie</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mascotas.map((mascota) => (
              <TableRow key={mascota._id}>
                <TableCell>{mascota.nombre}</TableCell>
                <TableCell>{mascota.especie}</TableCell>
                <TableCell>
                  {clientes.find((c) => c._id === mascota.cliente)?.nombre || "Sin cliente"}
                </TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(mascota)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => deleteMascota(mascota._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para crear/editar mascota */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedMascota?.cliente_id ? "Editar Mascota" : "Nueva Mascota"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Nombre"
            name="nombre"
            value={selectedMascota?.nombre || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Especie"
            name="especie"
            value={selectedMascota?.especie || ""}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Cliente</InputLabel>
            <Select
              name="cliente_id"
              value={selectedMascota?.cliente_id || ""}
              onChange={handleChange}
            >
              {clientes.map((cliente) => (
                <MenuItem key={cliente._id} value={cliente._id}>
                  {cliente.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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

export default Mascotas;