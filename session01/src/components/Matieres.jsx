import { useState, useEffect, useMemo } from "react";
import { gradesAPI } from "../services/api";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import TablePagination from "@mui/material/TablePagination";
import TableSortLabel from "@mui/material/TableSortLabel";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import { Link } from "react-router-dom";

export default function Matieres() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("course");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const grades = await gradesAPI.getAll();

        // Transformer pour correspondre au format attendu
        const formattedData = grades.map((grade) => ({
          course: grade.course?.name || 'N/A',
          grade: grade.grade
        }));

        setData(formattedData);
        setLoading(false);
      } catch (err) {
        console.error('Erreur:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /*if (loading) {
     return <Box sx={{ p: 3, textAlign: 'center' }}>Chargement...</Box>;
   }
 */
  const isLoading = loading;
  // Regrouper par cours et calculer les statistiques
  const coursesData = useMemo(() => {
    const courses = {};

    data.forEach((item) => {
      if (!courses[item.course]) {
        courses[item.course] = [];
      }
      courses[item.course].push(item.grade);
    });

    // Transformer en tableau exploitable avec plus de statistiques
    return Object.entries(courses).map(([course, grades]) => {
      const sum = grades.reduce((a, b) => a + b, 0);
      const avg = (sum / grades.length).toFixed(2);
      const min = Math.min(...grades);
      const max = Math.max(...grades);

      return {
        course,
        count: grades.length,
        avg: parseFloat(avg),
        min,
        max,
      };
    });
  }, [data]);

  // Fonction de tri
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Fonction de comparaison pour le tri
  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    const aVal = typeof a[orderBy] === "string"
      ? a[orderBy].toLowerCase()
      : a[orderBy];
    const bVal = typeof b[orderBy] === "string"
      ? b[orderBy].toLowerCase()
      : b[orderBy];

    if (bVal < aVal) return -1;
    if (bVal > aVal) return 1;
    return 0;
  };

  // Filtrage et tri des données
  const filteredAndSortedData = useMemo(() => {
    let filtered = coursesData.filter((row) => {
      const searchLower = searchTerm.toLowerCase();

      return (
        row.course.toLowerCase().includes(searchLower) ||
        row.count.toString().includes(searchLower) ||
        row.avg.toString().includes(searchLower)
      );
    });

    return filtered.sort(getComparator(order, orderBy));
  }, [coursesData, searchTerm, order, orderBy]);

  // Données paginées
  const paginatedData = filteredAndSortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Fonction pour obtenir la couleur selon la moyenne
  const getAverageColor = (avg) => {
    if (avg >= 90) return "success";
    if (avg >= 75) return "primary";
    if (avg >= 60) return "warning";
    return "error";
  };

  // Calculer la moyenne générale
  const overallAverage = useMemo(() => {
    if (coursesData.length === 0) return 0;
    const sum = coursesData.reduce((acc, row) => acc + row.avg, 0);
    return (sum / coursesData.length).toFixed(2);
  }, [coursesData]);

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      {isLoading ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          Chargement...
        </Box>
      ) : (
        <Paper elevation={3} sx={{ width: "100%", mb: 2, borderRadius: 2 }}>
          {/* En-tête avec titre et statistiques */}
          <Box sx={{ p: 2, bgcolor: "#f5f5f5" }}>
            <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ margin: 0, color: "#1976d2", fontSize: "1.5rem" }}>
                  📚 Liste des Matières
                </h2>
                <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: "0.875rem" }}>
                  Total: {coursesData.length} matière(s)
                </p>
              </div>
              <Box sx={{ textAlign: "right" }}>
                <p style={{ margin: 0, color: "#666", fontSize: "0.875rem" }}>
                  Moyenne générale
                </p>
                <Chip
                  label={overallAverage}
                  color={getAverageColor(parseFloat(overallAverage))}
                  sx={{ fontWeight: "bold", fontSize: "1.1rem", height: 32 }}
                />
              </Box>
            </Box>

            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher par matière, nombre de notes ou moyenne..."
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
              sx={{ bgcolor: "white" }}
            />
          </Box>

          {/* Table */}
          <TableContainer>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#1976d2" }}>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "course"}
                      direction={orderBy === "course" ? order : "asc"}
                      onClick={() => handleSort("course")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": { color: "white !important" }
                      }}
                    >
                      <strong style={{ color: "white" }}>Matière</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "count"}
                      direction={orderBy === "count" ? order : "asc"}
                      onClick={() => handleSort("count")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": { color: "white !important" }
                      }}
                    >
                      <strong style={{ color: "white" }}>Nombre de notes</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "avg"}
                      direction={orderBy === "avg" ? order : "asc"}
                      onClick={() => handleSort("avg")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": { color: "white !important" }
                      }}
                    >
                      <strong style={{ color: "white" }}>Moyenne</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "min"}
                      direction={orderBy === "min" ? order : "asc"}
                      onClick={() => handleSort("min")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": { color: "white !important" }
                      }}
                    >
                      <strong style={{ color: "white" }}>Min</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "max"}
                      direction={orderBy === "max" ? order : "asc"}
                      onClick={() => handleSort("max")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": { color: "white !important" }
                      }}
                    >
                      <strong style={{ color: "white" }}>Max</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <strong style={{ color: "white" }}>Distribution</strong>
                  </TableCell>
                  <TableCell>
                    <strong style={{ color: "white" }}>Actions</strong>
                  </TableCell>

                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                      Aucune matière trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row) => (
                    <TableRow
                      key={row.course}
                      sx={{
                        "&:nth-of-type(odd)": { bgcolor: "#f9f9f9" },
                        "&:hover": { bgcolor: "#e3f2fd" },
                        transition: "background-color 0.2s"
                      }}
                    >
                      <TableCell>
                        <strong style={{ fontSize: "1rem" }}>{row.course}</strong>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.count}
                          size="small"
                          color="info"
                          variant="outlined"
                          sx={{ fontWeight: "bold" }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.avg}
                          color={getAverageColor(row.avg)}
                          size="small"
                          sx={{ fontWeight: "bold", minWidth: 50 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.min}
                          size="small"
                          sx={{
                            bgcolor: "#ffebee",
                            color: "#c62828",
                            fontWeight: "bold"
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={row.max}
                          size="small"
                          sx={{
                            bgcolor: "#e8f5e9",
                            color: "#2e7d32",
                            fontWeight: "bold"
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ width: "100%", display: "flex", alignItems: "center", gap: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={row.avg}
                            sx={{
                              flex: 1,
                              height: 8,
                              borderRadius: 4,
                              bgcolor: "#e0e0e0",
                              "& .MuiLinearProgress-bar": {
                                bgcolor: row.avg >= 75 ? "#4caf50" : row.avg >= 60 ? "#ff9800" : "#f44336"
                              }
                            }}
                          />
                          <span style={{ fontSize: "0.75rem", color: "#666", minWidth: 35 }}>
                            {row.avg}%
                          </span>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label="View Details"
                          color="primary"
                          clickable
                          component={Link}
                          to={`/matieres/${encodeURIComponent(row.course)}`}
                        />
                      </TableCell>

                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAndSortedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Lignes par page:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} sur ${count}`
            }
          />
        </Paper>
      )}
    </Box>
  );
}