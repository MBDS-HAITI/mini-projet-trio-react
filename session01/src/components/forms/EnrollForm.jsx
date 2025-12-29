import { useState } from "react";

function EnrollForm({ students, courses, onEnroll }) {
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!studentId || !courseId) {
      return;
    }

    onEnroll(studentId, courseId);

    // Reset
    setStudentId("");
    setCourseId("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
      <div>
        <label>Étudiant :</label>
        <select
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          required
        >
          <option value="">-- Choisir un étudiant --</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.firstName} {s.lastName}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Cours :</label>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          required
        >
          <option value="">-- Choisir un cours --</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.code})
            </option>
          ))}
        </select>
      </div>

      <button style={{ marginTop: 15 }} type="submit">
        Inscrire
      </button>
    </form>
  );
}

export default EnrollForm;