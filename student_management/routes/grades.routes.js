const express = require('express');
const router = express.Router();
const controller = require('../controllers/gradesController');

const auth = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');

router.use(auth);

// Toutes les notes (ADMIN + SCOLARITE)
router.get('/', authorize('ADMIN', 'SCOLARITE'), controller.getAll);

// Mes notes (STUDENT)
router.get('/me', authorize('STUDENT'), controller.getMyGrades);

//Notes d'un étudiant spécifique
router.get('/student/:studentId', 
  authorize('ADMIN', 'SCOLARITE'), 
  controller.getGradesByStudent
);

//Notes d'un cours spécifique
router.get('/course/:courseId', 
  authorize('ADMIN', 'SCOLARITE'), 
  controller.getGradesByCourse
);
// Détail d'une de MES notes (STUDENT)
router.get(
  '/:id/student',
  authorize('STUDENT'),
  controller.getMyGradeById
);

//Détails d'une note
router.get('/:id', 
  authorize('ADMIN', 'SCOLARITE'), 
  controller.getById
);

// Créer une note (ADMIN + SCOLARITE)
router.post('/', authorize('ADMIN', 'SCOLARITE'), controller.create);

// Modifier une note
router.put('/:id', 
  authorize('ADMIN', 'SCOLARITE'), 
  controller.update
);

// Supprimer une note
router.delete('/:id', 
  authorize('ADMIN'), 
  controller.remove
);


module.exports = router;