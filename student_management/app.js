/**
 * Configuration de l'application Express
 * Rôle : Configurer les middlewares et enregistrer les routes
 */
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const config = require('./config/env');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

const app = express();

// ========================================
// 🗄️ INITIALISATION BASE DE DONNÉES
// ========================================
require('./config/database');

// ========================================
// 🔧 MIDDLEWARES GLOBAUX
// ========================================

// CORS - Pour accepter les connexions cross-domain
/*app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONT_URL);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});*/

app.use(cors({
  origin: process.env.FRONT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body Parser - Pour les formulaires et JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuration des sessions
app.use(session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,  // 24 heures
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'lax'
    }
}));

// Logging des requêtes (en développement uniquement)
if (config.nodeEnv === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// ========================================
// 📍 ROUTES
// ========================================
const prefix = '/api';

// Routes d'authentification
app.use(require('./routes/auth.routes'));

// Routes métier
app.use(prefix + '/students', require('./routes/students.routes'));
app.use(prefix + '/courses', require('./routes/courses.routes'));
app.use(prefix + '/grades', require('./routes/grades.routes'));
const usersRoutes = require('./routes/users.routes');
app.use(prefix + '/users', usersRoutes);
app.use(prefix + '/stats', require('./routes/stats.routes'));



// ========================================
// 🏠 ROUTE DE BASE (HEALTH CHECK)
// ========================================
app.get('/', (req, res) => {
    res.json({
        message: 'API is running',
        status: 'OK',
        environment: config.nodeEnv,
        timestamp: new Date().toISOString()
    });
});

// ========================================
// ❌ GESTION DES ERREURS
// ========================================

// 1. Route non trouvée (404) - AVANT le gestionnaire d'erreurs
app.use(notFoundHandler);

// 2. Gestionnaire d'erreurs global - TOUJOURS EN DERNIER
app.use(errorHandler);

module.exports = app;