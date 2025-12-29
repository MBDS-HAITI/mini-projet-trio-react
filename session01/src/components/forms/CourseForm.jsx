import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { coursesAPI } from "../../services/api";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Grid
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({ name: "", code: "" });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isEditMode) loadCourseData();
  }, [id]);

  const loadCourseData = async () => {
    try {
      const data = await coursesAPI.getById(id);
      setFormData({
        name: data.name || "",
        code: data.code || ""
      });
    } catch (err) {
      setError("Erreur lors du chargement du cours");
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return setError("Le nom est requis"), false;
    if (!formData.code.trim()) return setError("Le code est requis"), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;
    setLoading(true);

    try {
      if (isEditMode) {
        await coursesAPI.update(id, formData);
        setSuccess("Cours modifié avec succès !");
      } else {
        await coursesAPI.create(formData);
        setSuccess("Cours créé avec succès !");
      }

      setTimeout(() => navigate("/matieres"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/matieres")}
        sx={{ mb: 2 }}
      >
        Retour
      </Button>

      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h4" sx={{ color: "#1976d2", mb: 3 }}>
          {isEditMode ? "✏️ Modifier un cours" : "➕ Nouveau cours"}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Nom du cours"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Code du cours"
                name="code"
                value={formData.code}
                onChange={handleChange}
                disabled={loading}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={() => navigate("/matieres")} disabled={loading}>
                  Annuler
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                  sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
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