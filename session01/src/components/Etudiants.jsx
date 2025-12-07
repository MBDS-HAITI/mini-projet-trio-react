import { useState, useEffect, useMemo } from "react";
import { studentsAPI } from "../services/api";
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
import { Link } from "react-router-dom";


export default function Etudiants() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentsData = await studentsAPI.getAll();

        // Transformer pour correspondre au format attendu
        const formattedStudents = studentsData.map(student => ({
          id: student._id,
          firstname: student.firstName,
          lastname: student.lastName
        }));

        setStudents(formattedStudents);
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
 }*/

  const isLoading = loading;

  const uniqueStudents = students;

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
    const aVal = a[orderBy]?.toString().toLowerCase() || "";
    const bVal = b[orderBy]?.toString().toLowerCase() || "";

    if (bVal < aVal) return -1;
    if (bVal > aVal) return 1;
    return 0;
  };

  // Filtrage et tri des données
  const filteredAndSortedData = useMemo(() => {
    let filtered = uniqueStudents.filter((student) => {
      const searchLower = searchTerm.toLowerCase();

      return (
        student.firstname.toLowerCase().includes(searchLower) ||
        student.lastname.toLowerCase().includes(searchLower) ||
        student.id.toString().includes(searchLower)
      );
    });

    return filtered.sort(getComparator(order, orderBy));
  }, [uniqueStudents, searchTerm, order, orderBy]);

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



  return (
    <Box sx={{ width: "100%", p: 3 }}>  {isLoading ? (
      <Box sx={{ p: 3, textAlign: "center" }}>
        Chargement...
      </Box>
    ) : (
      <Paper elevation={3} sx={{ width: "100%", mb: 2, borderRadius: 2 }}>
        {/* En-tête avec titre et recherche */}
        <Box sx={{ p: 2, bgcolor: "#f5f5f5" }}>
          <Box sx={{ mb: 2 }}>
            <h2 style={{ margin: 0, color: "#1976d2", fontSize: "1.5rem" }}>
              👨‍🎓 Liste des Étudiants
            </h2>
            <p style={{ margin: "4px 0 0 0", color: "#666", fontSize: "0.875rem" }}>
              Total: {uniqueStudents.length} étudiant(s)
            </p>
          </Box>

          <TextField
            fullWidth
            variant="outlined"
            placeholder="Rechercher par ID, prénom ou nom..."
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
                    active={orderBy === "id"}
                    direction={orderBy === "id" ? order : "asc"}
                    onClick={() => handleSort("id")}
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
                    active={orderBy === "firstname"}
                    direction={orderBy === "firstname" ? order : "asc"}
                    onClick={() => handleSort("firstname")}
                    sx={{
                      color: "white !important",
                      "& .MuiTableSortLabel-icon": { color: "white !important" }
                    }}
                  >
                    <strong style={{ color: "white" }}>Prénom</strong>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "lastname"}
                    direction={orderBy === "lastname" ? order : "asc"}
                    onClick={() => handleSort("lastname")}
                    sx={{
                      color: "white !important",
                      "& .MuiTableSortLabel-icon": { color: "white !important" }
                    }}
                  >
                    <strong style={{ color: "white" }}>Nom</strong>
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
                  <TableCell colSpan={3} align="center" sx={{ py: 3 }}>
                    Aucun étudiant trouvé
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((student) => (
                  <TableRow
                    key={student.id}
                    sx={{
                      "&:nth-of-type(odd)": { bgcolor: "#f9f9f9" },
                      "&:hover": { bgcolor: "#e3f2fd" },
                      transition: "background-color 0.2s"
                    }}
                  >
                    <TableCell>
                      <Chip
                        label={student.id}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <strong>{student.firstname}</strong>
                    </TableCell>
                    <TableCell>
                      <strong>{student.lastname}</strong>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label="View Details"
                        color="primary"
                        clickable
                        component={Link}
                        to={`/etudiants/${student.id}`}
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
          rowsPerPageOptions={[5, 10, 25, 50]}
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