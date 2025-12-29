import { useState, useEffect, useMemo } from "react";
import { coursesAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, TablePagination, TableSortLabel, Box,
  Button, IconButton, InputAdornment, Chip
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link, useNavigate } from "react-router-dom";
import "./Matieres.css";

export default function Matieres() {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    if (user) loadCourses();
  }, [user]);

  const loadCourses = async () => {
    try {
      let data;
      if (user?.role === "STUDENT") {
        data = await coursesAPI.getMyCourses();
      } else {
        data = await coursesAPI.getAll();
      }
      setCourses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur chargement cours:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Supprimer le cours "${name}" ?`)) return;
    try {
      await coursesAPI.delete(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
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

  const descendingComparator = (a, b, orderBy) => {
    const aVal = a[orderBy]?.toString().toLowerCase() || "";
    const bVal = b[orderBy]?.toString().toLowerCase() || "";
    if (bVal < aVal) return -1;
    if (bVal > aVal) return 1;
    return 0;
  };

  const getComparator = (order, orderBy) =>
    order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);

  const filteredAndSortedData = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    const filtered = courses.filter(
      (c) =>
        c.name?.toLowerCase().includes(searchLower) ||
        c.code?.toLowerCase().includes(searchLower)
    );
    return filtered.sort(getComparator(order, orderBy));
  }, [courses, searchTerm, order, orderBy]);

  const paginatedData = filteredAndSortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return <Box sx={{ p: 3, textAlign: "center" }}>Chargement des cours...</Box>;
  }

  const isStudent = user?.role === "STUDENT";

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
        <Box className="matieres-header" sx={{ bgcolor: "background.paper" }}>
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box>
              <h2
                className="matieres-title"
                style={{ color: theme.palette.primary.main }}
              >
                {isStudent ? "📚 Mes Matières" : "📚 Gestion des Matières"}
              </h2>
              <p
                className="matieres-subtitle"
                style={{ color: theme.palette.text.secondary }}
              >
                Total: {courses.length} cours
              </p>
            </Box>

            {!isStudent && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/matieres/new")}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                Nouveau Cours
              </Button>
            )}
          </Box>

          <TextField
            fullWidth
            placeholder="Rechercher par nom ou code..."
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
                  <TableSortLabel
                    active={orderBy === "name"}
                    direction={orderBy === "name" ? order : "asc"}
                    onClick={() => handleSort("name")}
                    sx={{ color: "white !important" }}
                  >
                    <strong className="matieres-table-head">Nom</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "code"}
                    direction={orderBy === "code" ? order : "asc"}
                    onClick={() => handleSort("code")}
                    sx={{ color: "white !important" }}
                  >
                    <strong className="matieres-table-head">Code</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center">
                  <strong className="matieres-table-head">Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    {searchTerm ? "Aucun cours trouvé" : "Aucun cours disponible"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((c) => (
                  <TableRow key={c._id} hover>
                    <TableCell><strong>{c.name}</strong></TableCell>
                    <TableCell>
                      <Chip
                        label={c.code}
                        size="small"
                        variant="outlined"
                        sx={{ color: theme.palette.text.primary }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                        <IconButton
                          component={Link}
                          to={isStudent ? `/mes-matieres/${c._id}` : `/matieres/${c._id}`}
                          size="small"
                          color="primary"
                        >
                          <VisibilityIcon />
                        </IconButton>

                        {!isStudent && (
                          <>
                            <IconButton
                              component={Link}
                              to={`/matieres/${c._id}/edit`}
                              size="small"
                              color="warning"
                            >
                              <EditIcon />
                            </IconButton>

                            {user?.role === "ADMIN" && (
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(c._id, c.name)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </>
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
