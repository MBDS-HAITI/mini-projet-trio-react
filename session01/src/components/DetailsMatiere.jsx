import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { gradesAPI } from "../services/api";
import { Box, Chip, Paper } from "@mui/material";

export default function DetailsMatiere() {
  const { name } = useParams(); // On récupère la matière depuis l'URL
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const allGrades = await gradesAPI.getAll();

      // On récupère uniquement les notes de cette matière
      const filtered = allGrades.filter(
        (g) => g.course?.name === decodeURIComponent(name)
      );

      setGrades(filtered);
      setLoading(false);
    };

    fetchData();
  }, [name]);

  if (loading) return <Box p={3}>Chargement...</Box>;

  return (
    <Box p={3}>
      <Paper sx={{ p: 3 }}>
        <h2 style={{ margin: 0, color: "#1976d2" }}>
          Détails de la matière : {decodeURIComponent(name)}
        </h2>

        <p style={{ marginTop: "10px", color: "#555" }}>
          Nombre de notes : <strong>{grades.length}</strong>
        </p>

        {grades.length === 0 ? (
          <p>Aucune note trouvée pour cette matière.</p>
        ) : (
          grades.map((g, index) => (
            <Box
              key={index}
              sx={{
                my: 1,
                p: 2,
                borderRadius: 2,
                bgcolor: "#f5f5f5",
              }}
            >
              <strong>Étudiant :</strong> {g.student?.name || "Non défini"}  
              <br />
              <strong>Note :</strong>{" "}
              <Chip label={g.grade} color="primary" />
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
}
