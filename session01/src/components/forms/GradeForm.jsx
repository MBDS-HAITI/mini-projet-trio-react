import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { gradesAPI, studentsAPI, coursesAPI } from "../../services/api";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Slider,
  Chip,
  Grid
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function GradeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const todayLocal = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const [formData, setFormData] = useState({
    student: "",
    course: "",
    grade: 10,
    date: todayLocal()
  });

  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const loadInitialData = async () => {
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        studentsAPI.getAll(),
        coursesAPI.getAll()
      ]);

      console.log("coursesRes =", coursesRes);

      setStudents(Array.isArray(studentsRes) ? studentsRes : []);
      setCourses(Array.isArray(coursesRes) ? coursesRes : []);

      if (isEditMode) {
        const gradeData = await gradesAPI.getById(id);
        setFormData({
          student: gradeData.student?._id || "",
          course: gradeData.course?._id || "",
          grade: gradeData.grade ?? 10,
          date: gradeData.date
            ? gradeData.date.split("T")[0]
            : todayLocal()
        });
      }
    } catch (err) {
      setError("Erreur lors du chargement des données");
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSliderChange = (e, newValue) => {
    setFormData((prev) => ({ ...prev, grade: newValue }));
  };

  const validateForm = () => {
    if (!formData.student) return setError("Veuillez sélectionner un étudiant"), false;
    if (!formData.course) return setError("Veuillez sélectionner un cours"), false;
    if (formData.grade < 0 || formData.grade > 20)
      return setError("La note doit être entre 0 et 20"), false;
    if (!formData.date) return setError("La date est requise"), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const dataToSend = {
        student: formData.student,
        course: formData.course,
        grade: parseFloat(formData.grade),
        date: formData.date
      };

      if (isEditMode) {
        await gradesAPI.update(id, dataToSend);
        setSuccess("Note modifiée avec succès !");
      } else {
        await gradesAPI.create(dataToSend);
        setSuccess("Note créée avec succès !");
      }

      setTimeout(() => navigate("/notes"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (g) => (g >= 16 ? "success" : g >= 14 ? "primary" : g >= 10 ? "warning" : "error");
  const getGradeAppreciation = (g) =>
    g >= 18 ? "Excellent" : g >= 16 ? "Très bien" : g >= 14 ? "Bien" : g >= 12 ? "Assez bien" : g >= 10 ? "Passable" : "Insuffisant";

  if (loadingData) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/notes")} sx={{ mb: 2 }}>
        Retour
      </Button>

      <Paper elevation={3} sx={{ p: 4, maxWidth: 700, mx: "auto" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#1976d2", fontWeight: "bold", mb: 3 }}>
          {isEditMode ? "✏️ Modifier une Note" : "➕ Nouvelle Note"}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth required disabled={loading || isEditMode}>
                <InputLabel>Choix de l’étudiant</InputLabel>
                <Select
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
                  label="Choix de l’étudiant"
                >
                  <MenuItem value="">
                    <em>— Sélectionnez un étudiant —</em>
                  </MenuItem>
                  {students.map((s) => (
                    <MenuItem key={s._id} value={s._id}>
                      {s.firstName} {s.lastName} ({s.email})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {isEditMode ? (
                <Typography variant="caption" color="text.secondary">
                  L'étudiant ne peut pas être modifié après création
                </Typography>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  Choisissez l’étudiant à qui attribuer la note
                </Typography>
              )}

            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required disabled={loading || isEditMode}>
                <InputLabel>Choix du cours</InputLabel>
                <Select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  label="Choix du cours"
                >
                  <MenuItem value="">
                    <em>— Sélectionnez un cours —</em>
                  </MenuItem>
                  {Array.isArray(courses) &&
                    courses.map((c) => (
                      <MenuItem key={c._id} value={c._id}>
                        {c.name} ({c.code})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              {isEditMode ? (
                <Typography variant="caption" color="text.secondary">
                  Le cours ne peut pas être modifié après création
                </Typography>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  Choisissez le cours concerné par cette note
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              {/* Ligne Note + Chip */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 1
                }}
              >
                <Typography>
                  Note : <strong>{formData.grade}/20</strong>
                </Typography>

                <Chip
                  label={getGradeAppreciation(formData.grade)}
                  color={getGradeColor(formData.grade)}
                  sx={{ fontWeight: "bold" }}
                />
              </Box>

              {/* Slider */}
              <Box sx={{ px: 2 }}>
                <Slider
                  value={formData.grade}
                  onChange={handleSliderChange}
                  min={0}
                  max={20}
                  step={0.5}
                  disabled={loading}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="date"
                label="Date d'évaluation"
                name="date"
                value={formData.date}
                onChange={handleChange}
                disabled={loading}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  justifyContent: "center",
                  mt: 3
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate("/notes")}
                  disabled={loading}
                >
                  Annuler
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #5568d3 0%, #653a8b 100%)"
                    }
                  }}
                >
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </Box>
            </Grid>

          </Grid>
        </form>
      </Paper>
    </Box>
  );
}