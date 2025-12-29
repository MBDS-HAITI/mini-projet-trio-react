const mongoose = require('mongoose');
const config = require('./env');

// Configuration de Mongoose
mongoose.Promise = global.Promise;

// Active le mode debug en développement (optionnel)
if (config.nodeEnv === 'development') {
    mongoose.set('debug', true);
}

// Options de connexion recommandées (Mongoose 6+)
const options = {
    // Options modernes pour Mongoose 6+
    maxPoolSize: 10,              // Nombre max de connexions
    serverSelectionTimeoutMS: 5000, // Timeout de sélection du serveur
    socketTimeoutMS: 45000,       // Timeout des opérations
    family: 4                     // Forcer IPv4
};

// Fonction de connexion à la base de données
const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUri, options);
        console.log('✅ Connexion à MongoDB réussie');
        console.log(`📊 Base de données: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ Erreur de connexion à MongoDB:', error.message);
        // En production, vous pourriez vouloir arrêter l'application
        process.exit(1);
    }
};

// Gestion des événements de connexion
mongoose.connection.on('connected', () => {
    console.log('🔗 Mongoose connecté à MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ Erreur Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('🔌 Mongoose déconnecté de MongoDB');
});

// Fermeture propre de la connexion lors de l'arrêt de l'application
process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log('🛑 Connexion MongoDB fermée suite à l\'arrêt de l\'application');
    process.exit(0);
});

module.exports = { connectDB, mongoose };