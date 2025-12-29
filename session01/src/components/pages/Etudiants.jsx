import { useState, useEffect, useMemo } from "react";
import { studentsAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, TablePagination, TableSortLabel, Box,
  Button, IconButton, InputAdornment, Chip, Avatar
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link, useNavigate } from "react-router-dom";
import "./Etudiants.css";

export default function Etudiants() {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("lastName");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await studentsAPI.getAll();
      setStudents(Array.isArray(data) ? data : data?.data || []);
    } catch (err) {
      console.error("Erreur chargement étudiants:", err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer l'étudiant ${name} ?`)) return;
    try {
      await studentsAPI.delete(id);
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Erreur suppression:", err);
      alert("Erreur lors de la suppression");
    }
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const descendingComparator = (a, b, key) => {
    const aVal = a[key]?.toString().toLowerCase() || "";
    const bVal = b[key]?.toString().toLowerCase() || "";
    if (bVal < aVal) return -1;
    if (bVal > aVal) return 1;
    return 0;
  };

  const getComparator = (order, key) =>
    order === "desc"
      ? (a, b) => descendingComparator(a, b, key)
      : (a, b) => -descendingComparator(a, b, key);

  const filteredAndSortedData = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    const filtered = students.filter((s) =>
      s.firstName?.toLowerCase().includes(searchLower) ||
      s.lastName?.toLowerCase().includes(searchLower) ||
      s.email?.toLowerCase().includes(searchLower) ||
      s.studentNumber?.toLowerCase().includes(searchLower)
    );
    return filtered.sort(getComparator(order, orderBy));
  }, [students, searchTerm, order, orderBy]);

  const paginatedData = filteredAndSortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getInitials = (f, l) =>
    `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();

  if (loading) {
    return <Box sx={{ p: 3, textAlign: "center" }}>Chargement des étudiants...</Box>;
  }

  return (
    <Box sx={{ width: "100%", p: 3, bgcolor: "background.default" }}>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          mb: 2,
          borderRadius: 2,
          bgcolor: "background.paper",
          color: "text.primary",
        }}
      >
        {/* 🧾 En-tête */}
        <Box
          className="etudiants-header"
          sx={{ bgcolor: "background.paper", color: "text.primary" }}
        >
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <h2
                className="etudiants-title"
                style={{ color: theme.palette.primary.main }}
              >
                👨‍🎓 Gestion des Étudiants
              </h2>
              <p
                className="etudiants-subtitle"
                style={{ color: theme.palette.text.secondary }}
              >
                Total: {students.length}
              </p>
            </Box>

            {(user?.role === "ADMIN" || user?.role === "SCOLARITE") && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/etudiants/new")}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                Nouvel Étudiant
              </Button>
            )}
          </Box>

          <TextField
            fullWidth
            placeholder="Rechercher par nom, prénom, email ou matricule..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ bgcolor: "background.paper" }}
          />
        </Box>

        {/* 📋 Table */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                <TableCell>
                  <strong className="etudiants-table-head">Photo</strong>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "firstName"}
                    direction={orderBy === "firstName" ? order : "asc"}
                    onClick={() => handleSort("firstName")}
                    sx={{ color: "white !important" }}
                  >
                    <strong className="etudiants-table-head">Prénom</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "lastName"}
                    direction={orderBy === "lastName" ? order : "asc"}
                    onClick={() => handleSort("lastName")}
                    sx={{ color: "white !important" }}
                  >
                    <strong className="etudiants-table-head">Nom</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "email"}
                    direction={orderBy === "email" ? order : "asc"}
                    onClick={() => handleSort("email")}
                    sx={{ color: "white !important" }}
                  >
                    <strong className="etudiants-table-head">Email</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <strong className="etudiants-table-head">Matricule</strong>
                </TableCell>
                <TableCell align="center">
                  <strong className="etudiants-table-head">Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    {searchTerm ? "Aucun étudiant trouvé" : "Aucun étudiant inscrit"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((s) => (
                  <TableRow key={s._id} hover>
                    <TableCell>
                      <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                        {getInitials(s.firstName, s.lastName)}
                      </Avatar>
                    </TableCell>
                    <TableCell><strong>{s.firstName}</strong></TableCell>
                    <TableCell><strong>{s.lastName}</strong></TableCell>
                    <TableCell>
                      <Chip
                        label={s.email}
                        size="small"
                        variant="outlined"
                        sx={{ color: theme.palette.text.primary }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip label={s.studentNumber} size="small" color="info" />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                        <IconButton
                          color="primary"
                          size="small"
                          component={Link}
                          to={`/etudiants/${s._id}`}
                        >
                          <VisibilityIcon />
                        </IconButton>

                        {(user?.role === "ADMIN" || user?.role === "SCOLARITE") && (
                          <IconButton
                            color="warning"
                            size="small"
                            component={Link}
                            to={`/etudiants/${s._id}/edit`}
                          >
                            <EditIcon />
                          </IconButton>
                        )}

                        {user?.role === "ADMIN" && (
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() =>
                              handleDelete(
                                s._id,
                                `${s.firstName} ${s.lastName}`
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredAndSortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, p) => setPage(p)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          labelRowsPerPage="Lignes par page:"
        />
      </Paper>
    </Box>
  );
}
