import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { studentsAPI, gradesAPI, coursesAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  Box,
  Paper,
  Chip,
  Button,
  Card,
  CardContent,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/School";
import EmailIcon from "@mui/icons-material/Email";
import { useTheme } from "@mui/material/styles";

export default function DetailsEtudiant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();


  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allCourses, setAllCourses] = useState([]);
  const [showEnroll, setShowEnroll] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
  try {
    let studentData;

    if (user?.role === "STUDENT") {
      // ✅ profil de l'étudiant connecté
      studentData = await studentsAPI.getMyProfile();
    } else {
      // ✅ admin / scolarité avec id dans l'URL
      studentData = await studentsAPI.getById(id);
    }

    setStudent(studentData);

  const studentId = studentData._id;

let gradesData;
if (user?.role === "STUDENT") {
  // ✅ ses propres notes
  gradesData = await gradesAPI.getMyGrades();
} else {
  // ✅ notes d’un étudiant par id
  gradesData = await gradesAPI.getByStudent(studentId);
}

setGrades(Array.isArray(gradesData) ? gradesData : []);


    const coursesData = await coursesAPI.getAll();
    setAllCourses(coursesData);

  } catch (err) {
    console.error("Erreur chargement:", err);
  } finally {
    setLoading(false);
  }
};


  if (loading) {
    return <Box p={3}>Chargement...</Box>;
  }

  if (!student) {
    return (
      <Box p={3}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6">Étudiant introuvable</Typography>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Retour
          </Button>
        </Paper>
      </Box>
    );
  }

  const average =
    grades.length > 0
      ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2)
      : 0;

  const best = grades.length ? Math.max(...grades.map((g) => g.grade)) : 0;
  const worst = grades.length ? Math.min(...grades.map((g) => g.grade)) : 0;

  const getInitials = (f, l) =>
    `${f?.[0] || ""}${l?.[0] || ""}`.toUpperCase();

  const getGradeColor = (g) => {
    if (g >= 16) return "success";
    if (g >= 14) return "primary";
    if (g >= 10) return "warning";
    return "error";
  };

  const canManage = user?.role === "ADMIN" || user?.role === "SCOLARITE";

  const handleEnroll = async (courseId) => {
    try {
      await studentsAPI.enrollInCourse(student._id, courseId);
      alert("✅ Étudiant inscrit !");
      setShowEnroll(false);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUnenroll = async (courseId) => {
    if (!window.confirm("Désinscrire cet étudiant de ce cours ?")) return;

    try {
      await studentsAPI.unenrollFromCourse(student._id, courseId);
      alert("✅ Étudiant désinscrit !");
      loadData();
    } catch (err) {
      alert(err.message); // ex: Impossible: X note(s) existent
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Actions */}
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Retour
        </Button>

        {(user?.role === "ADMIN" || user?.role === "SCOLARITE") && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/etudiants/${id}/edit`)}
            sx={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            }}
          >
            Modifier
          </Button>
        )}
      </Box>

      {/* Profil */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          <Avatar sx={{ bgcolor: "#1976d2", width: 80, height: 80 }}>
            {getInitials(student.firstName, student.lastName)}
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ color: "#1976d2", fontWeight: "bold" }}>
              {student.firstName} {student.lastName}
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 1, flexWrap: "wrap" }}>
              <Chip
                icon={<EmailIcon />}
                label={student.email}
                variant="outlined"
              />
              <Chip
                icon={<SchoolIcon />}
                label={`Matricule: ${student.studentNumber}`}
                variant="outlined"
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          { label: "Moyenne", value: average },
          { label: "Meilleure note", value: best },
          { label: "Plus basse note", value: worst },
          { label: "Notes", value: grades.length }
        ].map((s, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h5" sx={{ color: "#1976d2" }}>
                  {s.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {s.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Cours inscrits */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#1976d2" }}>
          📚 Cours suivis
        </Typography>

        {student.courses?.length === 0 ? (
          <Box sx={{ color: "#999" }}>Aucun cours inscrit.</Box>
        ) : (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {student.courses.map((c) => (
              <Chip
                key={c._id}
                label={`${c.name} (${c.code})`}
                onDelete={
                  canManage ? () => handleUnenroll(c._id) : undefined
                }
                color="white"
                variant="outlined"
              />
            ))}
          </Box>
        )}

        {canManage && (
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            onClick={() => setShowEnroll(!showEnroll)}
          >
            ➕ Inscrire à un cours
          </Button>
        )}

        {canManage && showEnroll && (
          <Box sx={{ mt: 2, display: "flex", gap: 2, alignItems: "center", justifyContent: "center" }}>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="">-- Choisir un cours --</option>
              {allCourses
                .filter(
                  (c) =>
                    !student.courses?.some((sc) => sc._id === c._id)
                )
                .map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.code})
                  </option>
                ))}
            </select>

            <Button
              variant="contained"
              disabled={!selectedCourse}
              onClick={() => handleEnroll(selectedCourse)}
            >
              OK
            </Button>
          </Box>
        )}

      </Paper>

      {/* Notes */}
      <Paper elevation={3} sx={{ p: 3,  bgcolor: "background.paper",  color: "text.primary",}}>
        <Typography variant="h6" sx={{ mb: 2, color: theme.palette.primary.main }}>
          📝 Notes détaillées
        </Typography>

        {grades.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 3, color: "#999" }}>
            Aucune note enregistrée.
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                  <TableCell><strong style={{ color: "white" }}>Matière</strong></TableCell>
                  <TableCell><strong style={{ color: "white" }}>Date</strong></TableCell>
                  <TableCell><strong style={{ color: "white" }}>Note</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {grades.map((g) => (
                  <TableRow key={g._id}>
                    <TableCell>
                      <strong>{g.course?.name}</strong>
                      <br />
                      <small style={{ color: theme.palette.text.secondary }}>
                        {g.course?.code}
                      </small>
                    </TableCell>
                    <TableCell>
                      {new Date(g.date).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${g.grade} / 20`}
                        color={getGradeColor(g.grade)}
                        sx={{ fontWeight: "bold" }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}