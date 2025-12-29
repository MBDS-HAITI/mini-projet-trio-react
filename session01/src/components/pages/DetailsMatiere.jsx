import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { coursesAPI, gradesAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "@mui/material/styles";


import {
  Box,
  Chip,
  Paper,
  CircularProgress,
  Typography,
  Button
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function DetailsMatiere() {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ pour le retour
  const { user } = useAuth();
  const theme = useTheme();

  const [course, setCourse] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let courseData;

        if (user?.role === "STUDENT") {
          courseData = await coursesAPI.getByIdStudent(id);
        } else {
          courseData = await coursesAPI.getById(id);
        }

        setCourse(courseData);

        let gradesData = [];

        if (user?.role === "STUDENT") {
          // ✅ L’étudiant récupère SES notes puis on filtre par cours
          const myGrades = await gradesAPI.getMyGrades();
          gradesData = myGrades.filter(
            g => g.course?._id === id
          );
        } else {
          // ✅ Admin / Scolarité → toutes les notes du cours
          gradesData = await gradesAPI.getByCourse(id);
        }

        setGrades(Array.isArray(gradesData) ? gradesData : []);
      } catch (error) {
        console.error("Erreur chargement:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return <Box p={3}>Matière introuvable</Box>;
  }

  const moyenne =
    grades.length > 0
      ? (grades.reduce((sum, g) => sum + g.grade, 0) / grades.length).toFixed(2)
      : null;

  return (
    <Box p={3}>
      {/* ✅ Bouton Retour */}
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2 }}
      >
        Retour
      </Button>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ color: "primary.main", mb: 1 }}>
          📚 {course.name}
        </Typography>

        <Box sx={{ mt: 2, mb: 3 }}>
          <Typography>
            <strong>Code :</strong> {course.code}
          </Typography>
          <Typography>
            <strong>Nombre de notes :</strong> {grades.length}
          </Typography>
          {moyenne && (
            <Typography>
              <strong>Moyenne du cours :</strong> {moyenne} / 20
            </Typography>
          )}
        </Box>

        <Typography variant="h6" sx={{ color: "primary.main", mb: 2 }}>
          📝 Notes des étudiants
        </Typography>

        {grades.length === 0 ? (
          <Typography color="text.secondary">
            Aucune note saisie pour ce cours.
          </Typography>
        ) : (
          grades.map((g) => (
            <Box
              key={g._id}
              sx={{
                my: 1,
                p: 2,
                borderRadius: 2,
                bgcolor: "background.paper",
                color: "text.primary",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography>
                  <strong>Étudiant :</strong>{" "}
                  {g.student?.firstName} {g.student?.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {g.student?.email}
                </Typography>
              </Box>

              <Chip
                label={`${g.grade} / 20`}
                color={g.grade >= 10 ? "success" : "error"}
                sx={{ fontWeight: "bold" }}
              />
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
}
