import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import Login from './Login';
import Notes from './Notes';
import Etudiants from './Etudiants';
import Matieres from './Matieres';
import APropos from './APropos';
import DetailsMatiere from './DetailsMatiere';
import DetailsNote from './DetailsNote';
import DetailsEtudiant from './DetailsEtudiant';
import Users from './Users';
import UserForm from '../forms/UserForm';
import AdminDashboard from '../dashboards/AdminDashboard';
import ScolariteDashboard from '../dashboards/ScolariteDashboard';
import StudentDashboard from '../dashboards/StudentDashboard';
import StudentForm from '../forms/StudentForm';
import CourseForm from '../forms/CourseForm';
import GradeForm from '../forms/GradeForm';
import EnrollStudent from './EnrollStudent';
import Conditions from './Conditions';

function AppNavigation() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // ⏳ Loader GLOBAL (bloque toute navigation tant que l’auth n’est pas connue)
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
        color: '#667eea'
      }}>
        Chargement...
      </div>
    );
  }

  return (
    <Routes>

      {/* =====================
          🌍 ROUTES PUBLIQUES
      ====================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/conditions" element={<Conditions />} />

      {/* Si NON authentifié → tout renvoie vers /login */}
      {!isAuthenticated && (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}

      {/* =====================
          🔐 ROUTES AUTHENTIFIÉES
      ====================== */}
      {isAuthenticated && (
        <>
          {/* Redirection racine */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/apropos" element={<APropos />} />

          {/* ===== ADMIN ===== */}
          {user.role === 'ADMIN' && (
            <>
              <Route path="/dashboard" element={<AdminDashboard />} />

              <Route path="/notes" element={<Notes />} />
              <Route path="/notes/new" element={<GradeForm />} />
              <Route path="/notes/:id" element={<DetailsNote />} />
              <Route path="/notes/:id/edit" element={<GradeForm />} />

              <Route path="/etudiants" element={<Etudiants />} />
              <Route path="/etudiants/new" element={<StudentForm />} />
              <Route path="/etudiants/:id" element={<DetailsEtudiant />} />
              <Route path="/etudiants/:id/edit" element={<StudentForm />} />

              <Route path="/matieres" element={<Matieres />} />
              <Route path="/matieres/new" element={<CourseForm />} />
              <Route path="/matieres/:id" element={<DetailsMatiere />} />
              <Route path="/matieres/:id/edit" element={<CourseForm />} />

              <Route path="/enroll" element={<EnrollStudent />} />

              <Route path="/users" element={<Users />} />
              <Route path="/users/new" element={<UserForm />} />
            </>
          )}

          {/* ===== SCOLARITE ===== */}
          {user.role === 'SCOLARITE' && (
            <>
              <Route path="/dashboard" element={<ScolariteDashboard />} />

              <Route path="/notes" element={<Notes />} />
              <Route path="/notes/new" element={<GradeForm />} />
              <Route path="/notes/:id" element={<DetailsNote />} />
              <Route path="/notes/:id/edit" element={<GradeForm />} />

              <Route path="/etudiants" element={<Etudiants />} />
              <Route path="/etudiants/new" element={<StudentForm />} />
              <Route path="/etudiants/:id" element={<DetailsEtudiant />} />
              <Route path="/etudiants/:id/edit" element={<StudentForm />} />

              <Route path="/matieres" element={<Matieres />} />
              <Route path="/matieres/new" element={<CourseForm />} />
              <Route path="/matieres/:id" element={<DetailsMatiere />} />
              <Route path="/matieres/:id/edit" element={<CourseForm />} />

              <Route path="/enroll" element={<EnrollStudent />} />
            </>
          )}

          {/* ===== STUDENT ===== */}
          {user.role === 'STUDENT' && (
            <>
              <Route path="/dashboard" element={<StudentDashboard />} />

              <Route path="/mes-notes" element={<Notes />} />
              <Route path="/mes-notes/:id" element={<DetailsNote />} />

              <Route path="/mes-matieres" element={<Matieres />} />
              <Route path="/mes-matieres/:id" element={<DetailsMatiere />} />

              <Route path="/mon-profil" element={<DetailsEtudiant />} />
            </>
          )}

          {/* Fallback authentifié */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </>
      )}

    </Routes>
  );
}

export default AppNavigation;
