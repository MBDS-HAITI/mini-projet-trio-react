import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { gradesAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  Box,
  Paper,
  Chip,
  Button,
  Card,
  CardContent,
  Avatar,
  Divider,
  Typography,
  Grid
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import GradeIcon from "@mui/icons-material/Grade";

const formatDateFRLong = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("T")[0].split("-");
  return `${d}/${m}/${y}`;
};
export default function DetailsNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [grade, setGrade] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGradeData();
  }, [id]);

  const loadGradeData = async () => {
    try {
      let data;
      if (user?.role === "STUDENT") {
        data = await gradesAPI.getMyGradeById(id);
      } else {
        data = await gradesAPI.getById(id);
      }
      setGrade(data);
    } catch (err) {
      console.error("Erreur chargement note:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Box p={3}>Chargement...</Box>;

  if (!grade) {
    return (
      <Box p={3}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <h2>Note introuvable</h2>
          <Button variant="contained" onClick={() => navigate(user?.role === "STUDENT" ? "/mes-notes" : "/notes")}>Retour</Button>
        </Paper>
      </Box>
    );
  }

  const getGradeColor = (g) => (g >= 16 ? "success" : g >= 14 ? "primary" : g >= 10 ? "warning" : "error");

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 2, display: "flex", gap: 2 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(user?.role === "STUDENT" ? "/mes-notes" : "/notes")}>
          Retour
        </Button>
        {(user?.role === "ADMIN" || user?.role === "SCOLARITE") && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/notes/${id}/edit`)}
            sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
          >
            Modifier
          </Button>
        )}
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 3, textAlign: "center" }}>
        <h2 style={{ margin: 0, color: "#1976d2" }}>📝 Détails de la Note</h2>
        <Box sx={{ mt: 2 }}>
          <Chip
            icon={<GradeIcon />}
            label={`${grade.grade}/20`}
            color={getGradeColor(grade.grade)}
            sx={{ fontWeight: "bold", fontSize: "1.4rem", height: 50, px: 2 }}
          />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: "#1976d2" }}><PersonIcon /></Avatar>
                <h3 style={{ margin: 0, color: "#1976d2" }}>Étudiant</h3>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 1 }}>
                <strong>Nom :</strong> {grade.student?.firstName} {grade.student?.lastName}
              </Box>
              <Box sx={{ mb: 1 }}>
                <strong>Email :</strong>{" "}
                <Chip label={grade.student?.email} size="small" variant="outlined" />
              </Box>
              <Box sx={{ mb: 2 }}>
                <strong>Matricule :</strong> {grade.student?.studentNumber}
              </Box>
              {user?.role !== "STUDENT" && (
                <Button size="small" variant="outlined" onClick={() => navigate(`/etudiants/${grade.student?._id}`)}>
                  Voir le profil
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Avatar sx={{ bgcolor: "#f50057" }}><SchoolIcon /></Avatar>
                <h3 style={{ margin: 0, color: "#f50057" }}>Cours</h3>
              </Box>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ mb: 1 }}>
                <strong>Nom :</strong> {grade.course?.name}
              </Box>
              <Box sx={{ mb: 2 }}>
                <strong>Code :</strong>{" "}
                <Chip label={grade.course?.code} size="small" variant="outlined" />
              </Box>

              <Button
                size="small"
                variant="outlined"
                color="secondary"
                onClick={() => navigate(
                  user?.role === "STUDENT"
                    ? `/mes-matieres/${grade.course?._id}`
                    : `/matieres/${grade.course?._id}`
                )}
              >
                Voir le cours
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CalendarTodayIcon color="primary" />
          <Box>
            <Typography variant="body2" color="text.secondary">
              Date d'évaluation
            </Typography>
            <Typography fontWeight="bold">
              {formatDateFRLong(grade.date)}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}