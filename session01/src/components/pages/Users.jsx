import { useEffect, useState } from "react";
import { usersAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Chip,
  Tooltip
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";

export default function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur chargement users:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await usersAPI.delete(id);
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "ADMIN":
        return "secondary";
      case "SCOLARITE":
        return "warning";
      default:
        return "info";
    }
  };

  const getStatusColor = (status) =>
    status === "ACTIVE" ? "success" : "default";

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {/* 🧾 HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <h2 style={{ margin: 0 }}>👥 Gestion des utilisateurs</h2>
            <p style={{ margin: 0, opacity: 0.7 }}>
              Total : {users.length}
            </p>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/users/new")}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              cursor: "pointer",
            }}
          >
            Inviter un utilisateur
          </Button>
        </Box>

        {/* 📋 TABLE */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#667eea" }}>
                <TableCell sx={{ color: "white" }}>
                  <strong>Email</strong>
                </TableCell>
                <TableCell sx={{ color: "white" }}>
                  <strong>Rôle</strong>
                </TableCell>
                <TableCell sx={{ color: "white" }}>
                  <strong>Statut</strong>
                </TableCell>
                <TableCell align="center" sx={{ color: "white" }}>
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    Aucun utilisateur
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow
                    key={u._id}
                    hover
                    sx={{
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "#f5f6ff" },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PersonIcon color="primary" />
                        <strong>{u.email}</strong>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={u.role}
                        color={getRoleColor(u.role)}
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={u.status}
                        color={getStatusColor(u.status)}
                        size="small"
                        variant={u.status === "ACTIVE" ? "filled" : "outlined"}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Tooltip title="Supprimer">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(u._id)}
                          sx={{ cursor: "pointer" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
