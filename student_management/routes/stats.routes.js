// routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/statsController');
const auth = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');

router.use(auth);

// ========================================
// STATISTIQUES ADMIN (vision globale)
// ========================================
router.get('/admin/dashboard', 
  authorize('ADMIN'), 
  controller.getAdminDashboard
);
// Retourne:
// - Nombre total d'étudiants, cours, notes, utilisateurs
// - Moyenne générale de l'établissement
// - Répartition des notes par cours
// - Étudiants en difficulté (moyenne < 10)
// - Taux de réussite global

// ========================================
// STATISTIQUES SCOLARITÉ (étudiants/cours/notes)
// ========================================
router.get('/scolarite/dashboard', 
  authorize('SCOLARITE'), 
  controller.getScolariteDashboard
);
// Retourne:
// - Nombre d'étudiants, cours, notes
// - Moyenne par cours
// - Liste des étudiants par tranche de moyenne
// - Cours avec le plus/moins d'étudiants

// ========================================
// STATISTIQUES ÉTUDIANT (son dossier uniquement)
// ========================================
router.get('/student/dashboard', 
  authorize('STUDENT'), 
  controller.getStudentDashboard
);
// Retourne:
// - Moyenne générale
// - Nombre de cours suivis
// - Meilleures/pires notes
// - Évolution des notes (graphique)
// - Comparaison avec la moyenne de classe

// Statistiques détaillées d'un étudiant (ADMIN + SCOLARITE)
router.get('/student/:id', 
  authorize('ADMIN', 'SCOLARITE'), 
  controller.getStudentStats
);

// Statistiques d'un cours (ADMIN + SCOLARITE)
router.get('/course/:id', 
  authorize('ADMIN', 'SCOLARITE'), 
  controller.getCourseStats
);

module.exports = router;