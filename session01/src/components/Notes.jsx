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
import Chip from "@mui/material/Chip";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";

function Notes() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("unique_id");
  const [order, setOrder] = useState("asc");

  // ← AJOUTER ce useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const grades = await gradesAPI.getAll();

        // Transformer les données pour correspondre au format JSON existant
        const formattedData = grades.map((grade, index) => ({
          unique_id: grade._id || index,
          student: {
            firstname: grade.student?.firstName || 'N/A',
            lastname: grade.student?.lastName || 'N/A'
          },
          course: grade.course?.name || 'N/A',
          date: new Date(grade.date).toISOString().split('T')[0],
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


  // ← AJOUTER cette condition pour le chargement
  /*if (loading) {
    return <Box sx={{ p: 3, textAlign: 'center' }}>Chargement...</Box>;
  }*/
  const isLoading = loading;

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
    let aVal, bVal;

    if (orderBy === "student") {
      aVal = `${a.student.firstname} ${a.student.lastname}`.toLowerCase();
      bVal = `${b.student.firstname} ${b.student.lastname}`.toLowerCase();
    } else {
      aVal = a[orderBy];
      bVal = b[orderBy];
    }

    if (bVal < aVal) return -1;
    if (bVal > aVal) return 1;
    return 0;
  };

  // Filtrage et tri des données
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((item) => {
      const fullName = `${item.student.firstname} ${item.student.lastname}`.toLowerCase();
      const searchLower = searchTerm.toLowerCase();

      return (
        fullName.includes(searchLower) ||
        item.course.toLowerCase().includes(searchLower) ||
        item.date.includes(searchLower) ||
        item.grade.toString().includes(searchLower)
      );
    });

    return filtered.sort(getComparator(order, orderBy));
  }, [data, searchTerm, order, orderBy]);

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

  // Fonction pour obtenir la couleur selon la note
  const getGradeColor = (grade) => {
    if (grade >= 90) return "success";
    if (grade >= 75) return "primary";
    if (grade >= 60) return "warning";
    return "error";
  };

  console.log("loading vaut :", loading);
  return (
    <Box sx={{ width: "100%", p: 3 }}>
      {isLoading ? (
        <Box sx={{ p: 3, textAlign: "center" }}>
          Chargement...
        </Box>
      ) : (
        <Paper elevation={3} sx={{ width: "100%", mb: 2, borderRadius: 2 }}>
          {/* Barre de recherche */}
          <Box sx={{ p: 2, bgcolor: "#f5f5f5" }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Rechercher par étudiant, cours, date ou note..."
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
                      active={orderBy === "unique_id"}
                      direction={orderBy === "unique_id" ? order : "asc"}
                      onClick={() => handleSort("unique_id")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": { color: "white !important" }
                      }}
                    >
                      <strong style={{ color: "white" }}>ID</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "student"}
                      direction={orderBy === "student" ? order : "asc"}
                      onClick={() => handleSort("student")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": { color: "white !important" }
                      }}
                    >
                      <strong style={{ color: "white" }}>Étudiant</strong>
                    </TableSortLabel>
                  </TableCell>
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
                      <strong style={{ color: "white" }}>Cours</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "date"}
                      direction={orderBy === "date" ? order : "asc"}
                      onClick={() => handleSort("date")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": { color: "white !important" }
                      }}
                    >
                      <strong style={{ color: "white" }}>Date</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === "grade"}
                      direction={orderBy === "grade" ? order : "asc"}
                      onClick={() => handleSort("grade")}
                      sx={{
                        color: "white !important",
                        "& .MuiTableSortLabel-icon": { color: "white !important" }
                      }}
                    >
                      <strong style={{ color: "white" }}>Note</strong>
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <strong style={{ color: "white" }}>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      Aucun résultat trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item, index) => (
                    <TableRow
                      key={item.unique_id}
                      sx={{
                        "&:nth-of-type(odd)": { bgcolor: "#f9f9f9" },
                        "&:hover": { bgcolor: "#e3f2fd" },
                        transition: "background-color 0.2s"
                      }}
                    >
                      <TableCell>{item.unique_id}</TableCell>
                      <TableCell>
                        <strong>
                          {item.student.firstname} {item.student.lastname}
                        </strong>
                      </TableCell>
                      <TableCell>{item.course}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.grade}
                          color={getGradeColor(item.grade)}
                          size="small"
                          sx={{ fontWeight: "bold", minWidth: 50 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label="View Details"
                          color="primary"
                          clickable
                          component={Link}
                          to={`/notes/${item.unique_id}`}
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

export default Notes;