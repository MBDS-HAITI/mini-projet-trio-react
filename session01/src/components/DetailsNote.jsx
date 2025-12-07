import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { gradesAPI } from "../services/api";
import { Box, Paper, Chip } from "@mui/material";

export default function DetailsNote() {
  const { id } = useParams(); // id = unique_id
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const grades = await gradesAPI.getAll();

      // On cherche la note avec l'ID dans l'URL
      const found = grades.find((g) => g._id === id);

      setNote(found || null);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <Box p={3}>Chargement...</Box>;

  if (!note) {
    return (
      <Box p={3}>
        <h2>Note introuvable</h2>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Paper sx={{ p: 3 }}>
        <h2 style={{ margin: 0, color: "#1976d2" }}>
          📘 Détail de la note #{note._id}
        </h2>

        <Box sx={{ mt: 2 }}>
          <p><strong>Étudiant :</strong> {note.student?.firstName} {note.student?.lastName}</p>
          <p><strong>Cours :</strong> {note.course?.name}</p>
          <p><strong>Date :</strong> {new Date(note.date).toLocaleDateString()}</p>
          <p>
            <strong>Note :</strong>{" "}
            <Chip 
              label={note.grade}
              color={
                note.grade >= 90 ? "success" :
                note.grade >= 75 ? "primary" :
                note.grade >= 60 ? "warning" :
                "error"
              }
              sx={{ fontWeight: "bold" }}
            />
          </p>
        </Box>
      </Paper>
    </Box>
  );
}
