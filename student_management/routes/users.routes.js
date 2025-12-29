const express = require('express');
const router = express.Router();

const controller = require('../controllers/usersController');
const auth = require('../middlewares/auth');
const { authorize } = require('../middlewares/role');

// 🔐 Seulement les ADMIN peuvent inviter
router.use(auth);

// 📩 Inviter
router.post(
  '/',
  authorize('ADMIN'),
  controller.inviteUser
);

// 👥 Lister les utilisateurs
router.get('/', authorize('ADMIN'), controller.getAllUsers);

// ❌ Supprimer un utilisateur
router.delete('/:id', authorize('ADMIN'), controller.deleteUser);

module.exports = router;
