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

// 🔐 IMPORTANT POUR HTTPS + COOKIES
if (config.nodeEnv === 'production') {
  app.set("trust proxy", 1);
}
// ========================================
// 🗄️ INITIALISATION BASE DE DONNÉES
// ========================================
require('./config/database');

// ========================================
// 🔧 MIDDLEWARES GLOBAUX
// ========================================

// CORS - Pour accepter les connexions cross-domain
const allowedOrigins = (process.env.FRONTEND_ORIGINS || "")
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    // autoriser Postman / curl
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));


// Body Parser - Pour les formulaires et JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
/*
// Configuration des sessions
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,  // 24 heures
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? "none" : "lax",
    domain: config.nodeEnv === 'production' ? ".onrender.com" : undefined
  }
}));*/

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false,      // 🔥 OBLIGATOIRE en HTTP
    sameSite: "lax",    // 🔥 OBLIGATOIRE
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