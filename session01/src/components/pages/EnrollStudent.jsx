import { useEffect, useState } from "react";
import { studentsAPI, coursesAPI } from "../../services/api";
import EnrollForm from "../forms/EnrollForm";

function EnrollStudent() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [s, c] = await Promise.all([
        studentsAPI.getAll(),
        coursesAPI.getAll()
      ]);
      setStudents(s);
      setCourses(c);
    } catch (err) {
      setMessage({ type: "error", text: "Erreur lors du chargement des données" });
    }
  };

  const handleEnroll = async (studentId, courseId) => {
    setMessage({ type: "", text: "" });

    try {
      await studentsAPI.enrollInCourse(studentId, courseId);

      setMessage({
        type: "success",
        text: "✅ Étudiant inscrit avec succès !"
      });

      await loadData();
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Erreur lors de l'inscription"
      });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📚 Inscrire un étudiant à un cours</h2>

      <EnrollForm
        students={students}
        courses={courses}
        onEnroll={handleEnroll}
      />

      {message.text && (
        <p style={{
          marginTop: 10,
          color: message.type === "success" ? "green" : "red"
        }}>
          {message.text}
        </p>
      )}
    </div>
  );
}

export default EnrollStudent;