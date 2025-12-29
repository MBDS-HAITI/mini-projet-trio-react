import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Login from './Login';
import Notes from './Notes';
import Etudiants from './Etudiants';
import Matieres from './Matieres';
import APropos from './APropos';
import DetailsMatiere from "./DetailsMatiere";
import DetailsNote from "./DetailsNote";
import DetailsEtudiant from "./DetailsEtudiant";
import Users from "./Users";
import UserForm from "../forms/UserForm";
import AdminDashboard from '../dashboards/AdminDashboard';
import ScolariteDashboard from '../dashboards/ScolariteDashboard';
import StudentDashboard from '../dashboards/StudentDashboard';
import StudentForm from '../forms/StudentForm';
import CourseForm from '../forms/CourseForm';
import GradeForm from '../forms/GradeForm';
import EnrollStudent from './EnrollStudent';
import Conditions from "./Conditions";


function AppNavigation() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Routes publiques où le menu ne doit PAS s'afficher
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Affichage du loader
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

  // Redirection si non connecté
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/conditions" element={<Conditions />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // Redirection vers dashboard si connecté ET sur login
  if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      {/* Afficher le menu uniquement si connecté ET pas sur une route publique */}
      {isAuthenticated && !isPublicRoute}

      <Routes>
        {/* Route publique */}
        <Route path="/login" element={<Login />} />

        {/* Routes communes */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/apropos" element={<APropos />} />

        {/* ADMIN - Accès complet */}
        {user.role === 'ADMIN' && (
          <>
            <Route path="/dashboard" element={<AdminDashboard />} />

            {/* Notes */}
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/new" element={<GradeForm />} />
            <Route path="/notes/:id" element={<DetailsNote />} />
            <Route path="/notes/:id/edit" element={<GradeForm />} />

            {/* Étudiants */}
            <Route path="/etudiants" element={<Etudiants />} />
            <Route path="/etudiants/new" element={<StudentForm />} />
            <Route path="/etudiants/:id" element={<DetailsEtudiant />} />
            <Route path="/etudiants/:id/edit" element={<StudentForm />} />

            {/* Matières */}
            <Route path="/matieres" element={<Matieres />} />
            <Route path="/matieres/new" element={<CourseForm />} />
            <Route path="/matieres/:id" element={<DetailsMatiere />} />
            <Route path="/matieres/:id/edit" element={<CourseForm />} />

            {/* Inscription */}
            <Route path="/enroll" element={<EnrollStudent />} />

            {/* Utilisateurs */}
            <Route path="/users" element={<Users />} />
            <Route path="/users/new" element={<UserForm />} />
          </>
        )}

        {/* SCOLARITE - Étudiants, cours, notes */}
        {user.role === 'SCOLARITE' && (
          <>
            <Route path="/dashboard" element={<ScolariteDashboard />} />

            {/* Notes */}
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/new" element={<GradeForm />} />
            <Route path="/notes/:id" element={<DetailsNote />} />
            <Route path="/notes/:id/edit" element={<GradeForm />} />

            {/* Étudiants */}
            <Route path="/etudiants" element={<Etudiants />} />
            <Route path="/etudiants/new" element={<StudentForm />} />
            <Route path="/etudiants/:id" element={<DetailsEtudiant />} />
            <Route path="/etudiants/:id/edit" element={<StudentForm />} />

            {/* Matières */}
            <Route path="/matieres" element={<Matieres />} />
            <Route path="/matieres/new" element={<CourseForm />} />
            <Route path="/matieres/:id" element={<DetailsMatiere />} />
            <Route path="/matieres/:id/edit" element={<CourseForm />} />

            {/* Inscription */}
            <Route path="/enroll" element={<EnrollStudent />} />
          </>
        )}

        {/* STUDENT - Ses notes uniquement */}
        {user.role === 'STUDENT' && (
          <>
            <Route path="/dashboard" element={<StudentDashboard />} />

            {/* Mes notes */}
            <Route path="/mes-notes" element={<Notes />} />
            <Route path="/mes-notes/:id" element={<DetailsNote />} />

            {/* Mes matières */}
            <Route path="/mes-matieres" element={<Matieres />} />
            <Route path="/mes-matieres/:id" element={<DetailsMatiere />} />

            {/* Mon profil */}
            <Route path="/mon-profil" element={<DetailsEtudiant />} />
          </>
        )}

        {/* 404 - Redirection par défaut */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default AppNavigation;