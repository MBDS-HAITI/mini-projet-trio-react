const express = require('express');
const router = express.Router();

const controller = require('../controllers/coursesController');
const auth = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');

// 🔐 Toutes les routes courses nécessitent une authentification
router.use(auth);

/**
 * GET /api/courses
 * ADMIN + SCOLARITE
 * Liste de tous les cours
 */
router.get(
  '/',
  authorize('ADMIN', 'SCOLARITE'),
  controller.getAll
);
/**
 * GET /api/courses/:id/student
 * STUDENT
 * Détails d’un cours pour un étudiant (lecture seule)
 */
router.get(
  '/:id/student',
  authorize('STUDENT'),
  controller.getById
);

/**
 * GET /api/courses/me
 * STUDENT
 * Mes cours
 */
router.get(
  '/me',
  authorize('STUDENT'),
  controller.getMyCourses
);

// ⚠️ MANQUANT : Détails d'un cours
router.get('/:id', 
  authorize('ADMIN', 'SCOLARITE'), 
  controller.getById
);

// ⚠️ MANQUANT : Liste des étudiants inscrits à un cours
router.get('/:id/students', 
  authorize('ADMIN', 'SCOLARITE'), 
  controller.getEnrolledStudents
);
/**
 * POST /api/courses
 * ADMIN + SCOLARITE
 * Création d’un cours
 */
router.post(
  '/',
  authorize('ADMIN', 'SCOLARITE'),
  controller.create
);

/**
 * PUT /api/courses/:id
 * ADMIN + SCOLARITE
 * Modification d’un cours
 */
router.put(
  '/:id',
  authorize('ADMIN', 'SCOLARITE'),
  controller.update
);

/**
 * DELETE /api/courses/:id
 * ADMIN SEULEMENT
 * Suppression d’un cours
 */
router.delete(
  '/:id',
  authorize('ADMIN'),
  controller.remove
);

module.exports = router;
