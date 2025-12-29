import { useState } from "react";
import { usersAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function UserForm() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await usersAPI.invite({ email, role });
      alert("Invitation envoyée !");
      navigate("/users");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>📨 Inviter un utilisateur</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label><br />
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Rôle</label><br />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="STUDENT">STUDENT</option>
            <option value="SCOLARITE">SCOLARITE</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Envoi..." : "Envoyer l’invitation"}
        </button>
        <button type="button" onClick={() => navigate("/users")}>
          Annuler
        </button>
      </form>
    </div>
  );
}
