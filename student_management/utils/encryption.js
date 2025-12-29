/**
 * Utilitaires de chiffrement
 * Utilisé pour chiffrer/déchiffrer les tokens sensibles
 */

const crypto = require('crypto');
const config = require('../config/env');

// Algorithme de chiffrement
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

/**
 * Génère une clé de chiffrement à partir du secret
 */
function getKey() {
    // Utilise une clé depuis les variables d'environnement
    const secret = config.encryptionKey || 'default-secret-change-me';
    
    // Génère une clé de 32 bytes
    return crypto.scryptSync(secret, 'salt', KEY_LENGTH);
}

/**
 * Chiffre une chaîne de caractères
 * @param {string} text - Texte à chiffrer
 * @returns {string} - Texte chiffré (format: iv:encrypted:tag)
 */
function encrypt(text) {
    if (!text) {
        return null;
    }

    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const key = getKey();
        
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const tag = cipher.getAuthTag();
        
        // Format: iv:encrypted:tag (tous en hex)
        return `${iv.toString('hex')}:${encrypted}:${tag.toString('hex')}`;
        
    } catch (error) {
        console.error('❌ Erreur de chiffrement:', error.message);
        throw new Error('Échec du chiffrement');
    }
}

/**
 * Déchiffre une chaîne de caractères
 * @param {string} encryptedData - Texte chiffré (format: iv:encrypted:tag)
 * @returns {string} - Texte déchiffré
 */
function decrypt(encryptedData) {
    if (!encryptedData) {
        return null;
    }

    try {
        const parts = encryptedData.split(':');
        
        if (parts.length !== 3) {
            throw new Error('Format de données chiffrées invalide');
        }
        
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];
        const tag = Buffer.from(parts[2], 'hex');
        
        const key = getKey();
        
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);
        
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
        
    } catch (error) {
        console.error('❌ Erreur de déchiffrement:', error.message);
        throw new Error('Échec du déchiffrement');
    }
}

module.exports = {
    encrypt,
    decrypt
};