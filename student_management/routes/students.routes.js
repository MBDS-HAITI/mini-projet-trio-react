const express = require('express');
const router = express.Router();
const controller = require('../controllers/studentsController');
const auth = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');

router.use(auth);

// ========================================
// ORDRE IMPORTANT : Routes spécifiques d'abord !
// ========================================

// 1️⃣ Routes les plus spécifiques EN PREMIER
// Profil de l'étudiant connecté (STUDENT)
router.get('/me/profile', authorize('STUDENT'), controller.getMyProfile);

// Associer un étudiant à un cours (ADMIN + SCOLARITE)
router.post('/:studentId/courses/:courseId', 
  authorize('ADMIN', 'SCOLARITE'), 
  controller.enrollInCourse
);

// Retirer un étudiant d'un cours (ADMIN + SCOLARITE)
router.delete('/:studentId/courses/:courseId', 
  authorize('ADMIN', 'SCOLARITE'), 
  controller.unenrollFromCourse
);

// 2️⃣ Routes génériques APRÈS
// Liste tous les étudiants (ADMIN + SCOLARITE)
router.get('/', authorize('ADMIN', 'SCOLARITE'), controller.getAll);

// Créer un étudiant (ADMIN + SCOLARITE)
router.post('/', authorize('ADMIN', 'SCOLARITE'), controller.create);

// Détails d'un étudiant par ID (ADMIN + SCOLARITE)
router.get('/:id', authorize('ADMIN', 'SCOLARITE'), controller.getById);

// Modifier un étudiant (ADMIN + SCOLARITE)
router.put('/:id', authorize('ADMIN', 'SCOLARITE'), controller.update);

// Supprimer un étudiant (ADMIN uniquement)
router.delete('/:id', authorize('ADMIN'), controller.remove);

module.exports = router;