export default function NoteCard({ note }) {
  const { course, grade, student, date} = note;
  const { firstname, lastname } = student;

  return (
    <div className="note-card">
      <h3>{course}</h3>
      <p>
        Étudiant : {firstname} {lastname}<br/>
        Date : {date}<br/>
        Note : <strong>{grade}</strong>
      </p>
    </div>
  );
}
