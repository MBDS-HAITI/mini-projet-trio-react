/**
 * Middleware centralisé de gestion des erreurs
 * À placer en DERNIER dans app.js
 */

const config = require('../config/env');

/**
 * Classe d'erreur personnalisée avec code HTTP
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Erreur prévue (vs bug système)
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Gestionnaire d'erreur global
 */
const errorHandler = (err, req, res, next) => {
    // Valeurs par défaut
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || 500;

    // Log de l'erreur (toujours logger en console)
    console.error('❌ Erreur capturée:', {
        message: error.message,
        statusCode: error.statusCode,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });

    // === ERREURS MONGOOSE ===
    
    // Erreur de validation Mongoose
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        error.message = `Validation échouée : ${messages.join(', ')}`;
        error.statusCode = 400;
    }

    // Erreur de duplication (clé unique)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error.message = `Le champ "${field}" existe déjà`;
        error.statusCode = 400;
    }

    // Erreur de cast (ID invalide)
    if (err.name === 'CastError') {
        error.message = `Ressource non trouvée (ID invalide)`;
        error.statusCode = 404;
    }

    // === ERREURS JWT ===
    
    if (err.name === 'JsonWebTokenError') {
        error.message = 'Token invalide';
        error.statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        error.message = 'Token expiré';
        error.statusCode = 401;
    }

    // === RÉPONSE ===
    
    res.status(error.statusCode).json({
        success: false,
        error: error.message,
        // Détails supplémentaires en développement uniquement
        ...(config.nodeEnv === 'development' && {
            stack: err.stack,
            fullError: err
        })
    });
};

/**
 * Gestionnaire pour les routes non trouvées (404)
 */
const notFoundHandler = (req, res, next) => {
    const error = new AppError(
        `Route non trouvée : ${req.method} ${req.path}`,
        404
    );
    next(error);
};

module.exports = {
    AppError,
    errorHandler,
    notFoundHandler
};