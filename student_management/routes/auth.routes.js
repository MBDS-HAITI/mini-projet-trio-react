const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ========================================
// 📍 ROUTES D'AUTHENTIFICATION GOOGLE (Passport)
// ========================================

// Lance l'auth Google
router.get('/api/auth/google',
  authController.initiateGoogleAuth);

// Callback Google
router.get('/api/auth/google/callback',
  authController.googleCallback);

// ========================================
// 📍 ROUTES DE DÉCONNEXION
// ========================================

router.post('/api/auth/logout', authController.logout);
router.get('/api/auth/logout', authController.logout);

// ========================================
// 📍 ROUTES DE VÉRIFICATION
// ========================================

router.get('/api/auth/status', authController.checkAuthStatus);

module.exports = router;
