import { useEffect, useState } from "react";
import { usersAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur chargement users:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await usersAPI.delete(id);
      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>👥 Gestion des utilisateurs</h2>

      {/* ✅ Bouton invitation */}
      <button onClick={() => navigate("/users/new")}>
        ➕ Inviter un utilisateur
      </button>

      <br /><br />

      {/* ✅ Liste des utilisateurs */}
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Email</th>
            <th>Rôle</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" align="center">
                Aucun utilisateur
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u._id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.status}</td>
                <td>
                  <button onClick={() => handleDelete(u._id)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
