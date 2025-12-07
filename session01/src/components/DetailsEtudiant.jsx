import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { studentsAPI, gradesAPI } from "../services/api";
import { Box, Paper, Chip } from "@mui/material";

export default function DetailsEtudiant() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {

      // 1. Charger l'étudiant
      const allStudents = await studentsAPI.getAll();
      const foundStudent = allStudents.find((s) => s._id === id);
      setStudent(foundStudent);

      // 2. Charger toutes les notes de cet étudiant
      const allGrades = await gradesAPI.getAll();
      const studentGrades = allGrades.filter((g) => g.student?._id === id);
      setGrades(studentGrades);

      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) return <Box p={3}>Chargement...</Box>;

  if (!student) {
    return <Box p={3}><h2>Étudiant introuvable</h2></Box>;
  }

  return (
    <Box p={3}>
      <Paper sx={{ p: 3 }}>
        <h2 style={{ margin: 0, color: "#1976d2" }}>
          👨‍🎓 Détails de l'étudiant : {student.firstName} {student.lastName}
        </h2>

        <Box sx={{ mt: 2 }}>
          <p><strong>ID :</strong> {student._id}</p>
          <p><strong>Prénom :</strong> {student.firstName}</p>
          <p><strong>Nom :</strong> {student.lastName}</p>
        </Box>

        <h3 style={{ marginTop: "20px", color: "#1976d2" }}>Notes :</h3>

        {grades.length === 0 ? (
          <p>Aucune note enregistrée pour cet étudiant.</p>
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
              <strong>Cours :</strong> {g.course?.name} <br />
              <strong>Date :</strong> {
                new Date(g.date).toLocaleDateString()
              } <br />

              <strong>Note :</strong>{" "}
              <Chip
                label={g.grade}
                color={
                  g.grade >= 90 ? "success" :
                  g.grade >= 75 ? "primary" :
                  g.grade >= 60 ? "warning" :
                  "error"
                }
                sx={{ fontWeight: "bold" }}
              />
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
}
