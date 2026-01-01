const app = require('./app');
const config = require('./config/env');
const { connectDB } = require('./config/database');

// Fonction pour démarrer le serveur
const startServer = async () => {
    try {
        // 1. Connexion à la base de données
        await connectDB();
        
        // 2. Démarrage du serveur Express
        app.listen(config.port, '0.0.0.0', () => {
            console.log('🚀 ====================================');
            console.log(`🚀 Serveur démarré avec succès!`);
            console.log(`🚀 Environnement: ${config.nodeEnv}`);
            console.log(`🚀 URL: Serveur fonctionne sur ${config.port}`);
            console.log('🚀 ====================================');
        });
        
    } catch (error) {
        console.error('❌ Erreur lors du démarrage du serveur:', error);
        process.exit(1);
    }
};

// Démarrage de l'application
startServer();