import { useState, useEffect, useMemo } from "react";
import { gradesAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, TextField, TablePagination, TableSortLabel, Box,
  Button, IconButton, Chip, InputAdornment
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link, useNavigate } from "react-router-dom";
import "./Notes.css";

const formatDateFR = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
};

function Notes() {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState("date");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      let data;
      if (user?.role === "STUDENT") {
        data = await gradesAPI.getMyGrades();
      } else {
        data = await gradesAPI.getAll();
      }
      setGrades(Array.isArray(data) ? data : data.data);
    } catch (err) {
      console.error("Erreur chargement notes:", err);
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, studentName, courseName) => {
    if (!window.confirm(`Supprimer la note de ${studentName} en ${courseName} ?`)) return;
    try {
      await gradesAPI.delete(id);
      setGrades((prev) => prev.filter((g) => g._id !== id));
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
    let aVal, bVal;
    if (orderBy === "student") {
      aVal = `${a.student?.firstName} ${a.student?.lastName}`.toLowerCase();
      bVal = `${b.student?.firstName} ${b.student?.lastName}`.toLowerCase();
    } else if (orderBy === "course") {
      aVal = a.course?.name?.toLowerCase() || "";
      bVal = b.course?.name?.toLowerCase() || "";
    } else if (orderBy === "date") {
      aVal = new Date(a.date).getTime();
      bVal = new Date(b.date).getTime();
    } else {
      aVal = a[orderBy];
      bVal = b[orderBy];
    }
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
    const filtered = grades.filter((g) => {
      const fullName = `${g.student?.firstName} ${g.student?.lastName}`.toLowerCase();
      const courseName = g.course?.name?.toLowerCase() || "";
      return (
        fullName.includes(searchLower) ||
        courseName.includes(searchLower) ||
        g.grade?.toString().includes(searchLower)
      );
    });
    return filtered.sort(getComparator(order, orderBy));
  }, [grades, searchTerm, order, orderBy]);

  const paginatedData = filteredAndSortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getGradeColor = (grade) => {
    if (grade >= 16) return "success";
    if (grade >= 14) return "primary";
    if (grade >= 10) return "warning";
    return "error";
  };

  const averageGrade = useMemo(() => {
    if (grades.length === 0) return 0;
    const sum = grades.reduce((acc, g) => acc + g.grade, 0);
    return (sum / grades.length).toFixed(2);
  }, [grades]);

  if (loading) {
    return <Box sx={{ p: 3, textAlign: "center" }}>Chargement des notes...</Box>;
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
          className="notes-header"
          sx={{
            bgcolor: "background.paper",
            color: "text.primary",
          }}
        >
          <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <div>
              <h2
                className="notes-title"
                style={{ color: theme.palette.primary.main }}
              >
                {user?.role === "STUDENT" ? "📝 Mes Notes" : "📝 Gestion des Notes"}
              </h2>
              <p
                className="notes-subtitle"
                style={{ color: theme.palette.text.secondary }}
              >
                Total: {grades.length} • Moyenne: {averageGrade}/20
              </p>
            </div>

            {(user?.role === "ADMIN" || user?.role === "SCOLARITE") && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => navigate("/notes/new")}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
              >
                Nouvelle Note
              </Button>
            )}
          </Box>

          <TextField
            fullWidth
            placeholder="Rechercher par étudiant, cours ou note..."
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
                {["student", "course", "date", "grade"]
                  .filter(col => !(user?.role === "STUDENT" && col === "student"))
                  .map((col) => (
                    <TableCell key={col}>
                      <TableSortLabel
                        active={orderBy === col}
                        direction={orderBy === col ? order : "asc"}
                        onClick={() => handleSort(col)}
                        sx={{ color: "white !important" }}
                      >
                        <strong className="notes-table-head">
                          {col === "student" && "Étudiant"}
                          {col === "course" && "Cours"}
                          {col === "date" && "Date"}
                          {col === "grade" && "Note"}
                        </strong>
                      </TableSortLabel>
                    </TableCell>
                  ))}
                <TableCell align="center">
                  <strong className="notes-table-head">Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={user?.role === "STUDENT" ? 4 : 5} align="center" sx={{ py: 3 }}>
                    {searchTerm ? "Aucune note trouvée" : "Aucune note enregistrée"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((g) => (
                  <TableRow key={g._id} hover>
                    {user?.role !== "STUDENT" && (
                      <TableCell>
                        <strong>{g.student?.firstName} {g.student?.lastName}</strong><br />
                        <small
                          className="notes-small"
                          style={{ color: theme.palette.text.secondary }}
                        >
                          {g.student?.email}
                        </small>
                      </TableCell>
                    )}

                    <TableCell>
                      <strong>{g.course?.name}</strong><br />
                      <small
                        className="notes-small"
                        style={{ color: theme.palette.text.secondary }}
                      >
                        {g.course?.code}
                      </small>
                    </TableCell>

                    <TableCell>
                      {formatDateFR(g.date)}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={`${g.grade}/20`}
                        color={getGradeColor(g.grade)}
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                        <IconButton
                          component={Link}
                          to={
                            user?.role === "STUDENT"
                              ? `/mes-notes/${g._id}`
                              : `/notes/${g._id}`
                          }
                          color="primary"
                          size="small"
                        >
                          <VisibilityIcon />
                        </IconButton>

                        {(user?.role === "ADMIN" || user?.role === "SCOLARITE") && (
                          <IconButton
                            component={Link}
                            to={`/notes/${g._id}/edit`}
                            color="warning"
                            size="small"
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
                                g._id,
                                `${g.student?.firstName} ${g.student?.lastName}`,
                                g.course?.name
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

export default Notes;
