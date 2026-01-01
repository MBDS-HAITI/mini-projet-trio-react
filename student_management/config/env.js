// Charge les variables d'environnement depuis le fichier .env
require('dotenv').config();

// Validation de variable obligatoire
if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI manquante!');
    process.exit(1);
}

// Export de la configuration
const config = {
    // Configuration du serveur
    port: process.env.PORT || 8010,
    nodeEnv: process.env.NODE_ENV || 'development',
    
    // Configuration MongoDB
    mongoUri: process.env.MONGO_URI,
    
    // Configuration des sessions
    sessionSecret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',

     // ✅ Google OAuth
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  googleCallbackUrl: process.env.GOOGLE_CALLBACK_URL,

    
    // Autres configurations
    // jwtSecret: process.env.JWT_SECRET,
    // apiKey: process.env.API_KEY,
};

// Validation des variables d'environnement essentielles
const requiredEnvVars = ['MONGO_URI'];

if (config.nodeEnv === 'production' && !process.env.SESSION_SECRET) {
    console.error('❌ SESSION_SECRET manquante en production!');
    process.exit(1);
}

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        console.error(`❌ Variable d'environnement manquante: ${varName}`);
        process.exit(1);
    }
});

module.exports = config;