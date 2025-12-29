import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { studentsAPI } from "../../services/api";
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

export default function StudentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentNumber: ""
  });

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditMode);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (isEditMode) loadStudentData();
  }, [id]);

  const loadStudentData = async () => {
    try {
      const data = await studentsAPI.getById(id);
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        studentNumber: data.studentNumber || ""
      });
    } catch (err) {
      setError("Erreur lors du chargement de l'étudiant");
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
    if (!formData.firstName.trim()) return setError("Le prénom est requis"), false;
    if (!formData.lastName.trim()) return setError("Le nom est requis"), false;
    if (!formData.email.trim()) return setError("L'email est requis"), false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return setError("Email invalide"), false;
    if (!formData.studentNumber.trim()) return setError("Le matricule est requis"), false;
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
        await studentsAPI.update(id, formData);
        setSuccess("Étudiant modifié avec succès !");
      } else {
        await studentsAPI.create(formData);
        setSuccess("Étudiant créé avec succès !");
      }
      setTimeout(() => navigate("/etudiants"), 1200);
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
        onClick={() => navigate("/etudiants")}
        sx={{ mb: 2 }}
      >
        Retour
      </Button>

      <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#1976d2", fontWeight: "bold", mb: 3 }}>
          {isEditMode ? "✏️ Modifier un Étudiant" : "➕ Nouvel Étudiant"}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                required 
                label="Prénom" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                disabled={loading} 
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField 
                fullWidth 
                required 
                label="Nom" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                disabled={loading} 
              />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                fullWidth 
                required 
                type="email" 
                label="Email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                disabled={loading} 
              />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                fullWidth 
                required 
                label="Matricule" 
                name="studentNumber" 
                value={formData.studentNumber} 
                onChange={handleChange} 
                disabled={loading} 
                helperText="Identifiant unique de l'étudiant" 
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate("/etudiants")} 
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
                    "&:hover": { background: "linear-gradient(135deg, #5568d3 0%, #653a8b 100%)" }
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