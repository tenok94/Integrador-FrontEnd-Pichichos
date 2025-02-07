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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import API from "../services/api";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [isNew, setIsNew] = useState(false);

  // Obtener clientes del backend
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await API.get("/clientes", {
          headers: { Authorization: token },
        });
        setClientes(data);
      } catch (error) {
        console.error("Error al cargar clientes:", error.response?.data || error.message);
      }
    };

    fetchClientes();
  }, []);

  // Abrir modal para editar o crear
  const handleOpen = (cliente = null) => {
    setSelectedCliente(cliente || { nombre: "", email: "", telefono: "" });
    setIsNew(!cliente); // Si no hay cliente, se trata de uno nuevo
    setOpen(true);
  };

  // Cerrar modal
  const handleClose = () => {
    setOpen(false);
    setSelectedCliente(null);
    setIsNew(false);
  };

  // Guardar cliente en el backend
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      if (isNew) {
        // Crear nuevo cliente
        const { data } = await API.post("/clientes", selectedCliente, {
          headers: { Authorization: token },
        });
        setClientes((prev) => [...prev, data]);
      } else {
        // Actualizar cliente existente
        await API.put(`/clientes/${selectedCliente._id}`, selectedCliente, {
          headers: { Authorization: token },
        });
        setClientes((prev) =>
          prev.map((cliente) =>
            cliente._id === selectedCliente._id ? selectedCliente : cliente
          )
        );
      }
      handleClose();
    } catch (error) {
      console.error(
        "Error al guardar cliente:",
        error.response?.data || error.message
      );
    }
  };

  // Manejar cambios en los campos del modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedCliente((prev) => ({ ...prev, [name]: value }));
  };

  // Función para eliminar un cliente
  const deleteCliente = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/clientes/${id}`, {
        headers: { Authorization: token },
      });
      setClientes(clientes.filter((cliente) => cliente._id !== id));
    } catch (error) {
      console.error("Error al eliminar cliente:", error.response?.data || error.message);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Lista de Clientes
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleOpen()}
        sx={{ marginBottom: 2 }}
      >
        Nuevo Cliente
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Teléfono</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente._id}>
                <TableCell>{cliente.nombre}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>{cliente.telefono}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleOpen(cliente)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => deleteCliente(cliente._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para Crear/Editar Cliente */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isNew ? "Nuevo Cliente" : "Editar Cliente"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Nombre"
            name="nombre"
            value={selectedCliente?.nombre || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Email"
            name="email"
            value={selectedCliente?.email || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Teléfono"
            name="telefono"
            value={selectedCliente?.telefono || ""}
            onChange={handleChange}
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

export default Clientes;
