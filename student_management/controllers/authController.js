/**
 * Contrôleur d'authentification
 * Rôle : Implémenter la logique métier d'authentification
 */

const { google } = require('googleapis');
const User = require('../model/user');
const { Student } = require('../model/schemas');
const { encrypt, decrypt } = require('../utils/encryption');
const config = require('../config/env');

// ========================================
// 🔧 CONFIGURATION OAUTH2 CLIENT
// ========================================
console.log('🧪 Google config:', {
    id: config.googleClientId,
    secret: config.googleClientSecret,
    callback: config.googleCallbackUrl
});

const oauth2Client = new google.auth.OAuth2(
    config.googleClientId,
    config.googleClientSecret,
    config.googleCallbackUrl
);

// ========================================
// 📤 CONTROLLER : Initier l'authentification Google
// ========================================

/**
 * Redirige l'utilisateur vers la page de connexion Google
 * @route GET /api/auth/google
 */
exports.initiateGoogleAuth = (req, res) => {
    try {
        // Génère l'URL d'authentification Google
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',  // Pour obtenir un refresh token
            scope: [
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'
            ],
            prompt: 'consent'  // Force l'affichage de l'écran de consentement
        });

        console.log('🔗 Redirection vers Google OAuth');
        res.redirect(authUrl);

    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation Google Auth:', error);
        res.status(500).redirect(`${process.env.FRONT_URL}/login?error=init_failed`);
    }
};

// ========================================
// 📥 CONTROLLER : Callback Google OAuth
// ========================================

/**
 * Traite la réponse de Google après authentification
 * Crée ou met à jour l'utilisateur et crée la session
 * @route GET /api/auth/google/callback
 */
exports.googleCallback = async (req, res) => {
    try {
        // 🔍 LOGS CRITIQUES DE DIAGNOSTIC (À AJOUTER ICI)
        console.log(
            "CALLBACK HIT:",
            req.protocol + "://" + req.get("host") + req.originalUrl
        );
        console.log(
            "EXPECTED CALLBACK:",
            process.env.GOOGLE_CALLBACK_URL
        );
        const { code } = req.query;

        // Validation du code
        if (!code) {
            console.error('❌ Code d\'autorisation manquant');
            return res.status(400).redirect(`${process.env.FRONT_URL}/login?error=no_code`);
        }

        console.log('📨 Code d\'autorisation reçu');
        if (req.session?.oauthUsed) {
            console.warn("⚠️ OAuth callback already used");
            return res.redirect(`${process.env.FRONT_URL}/login?error=oauth_reuse`);
        }

        req.session.oauthUsed = true;

        // ─────────────────────────────────────────
        // 1️⃣ Échange du code contre les tokens
        // ─────────────────────────────────────────
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        console.log('🔑 Tokens reçus de Google');

        // ─────────────────────────────────────────
        // 2️⃣ Récupérer les informations utilisateur
        // ─────────────────────────────────────────
        const oauth2 = google.oauth2({
            version: 'v2',
            auth: oauth2Client
        });
        const { data: userInfo } = await oauth2.userinfo.get();

        console.log('👤 Informations utilisateur récupérées:', userInfo.email);

        // ─────────────────────────────────────────
        // 3️⃣ Vérifier que l'utilisateur existe (invité)
        // ─────────────────────────────────────────
        let user = await User.findOne({ email: userInfo.email });

        if (!user) {
            console.error('⛔ Utilisateur non invité:', userInfo.email);
            return res.status(403).render('error', {
                message: 'Accès refusé',
                details: 'Votre email n\'est pas autorisé à accéder à cette application. Veuillez contacter l\'administrateur.'
            });
            // Ou version JSON si API :
            // return res.status(403).json({ 
            //     error: 'Utilisateur non invité',
            //     message: 'Votre email n\'est pas autorisé'
            // });
        }

        console.log('✅ Utilisateur trouvé:', user.email);

        // ─────────────────────────────────────────
        // 4️⃣ Stocker les tokens (refresh token chiffré)
        // ─────────────────────────────────────────
        user.provider = 'google';
        user.status = 'ACTIVE';
        user.googleId = userInfo.id;
        user.name = userInfo.name;
        user.picture = userInfo.picture;

        // Chiffrement du refresh token pour la sécurité
        if (tokens.refresh_token) {
            user.refreshToken = encrypt(tokens.refresh_token);
        }

        user.accessToken = tokens.access_token;
        console.log('⏱️ expires_in (callback) =', tokens.expires_in);

        if (typeof tokens.expires_in === 'number') {
            user.tokenExpiry = Date.now() + tokens.expires_in * 1000;
        } else {
            console.warn('⚠️ expires_in manquant dans callback, défaut +1h');
            user.tokenExpiry = Date.now() + 60 * 60 * 1000;
        }

        await user.save();

        console.log('💾 Tokens sauvegardés pour:', user.email);

        // ─────────────────────────────────────────
        // 🔗 Lier l'utilisateur au Student existant
        // ─────────────────────────────────────────
        if (user.role === 'STUDENT' && user.email) {
            const student = await Student.findOne({
                email: user.email
            });

            if (student) {
                if (!student.user) {
                    student.user = user._id;
                    await student.save();
                    console.log('🔗 Student lié au user:', student.email);
                } else {
                    console.log('ℹ️ Student déjà lié à un user');
                }
            } else {
                console.warn('⚠️ Aucun student trouvé pour l\'email:', user.email);
            }
        }

        // ─────────────────────────────────────────
        // 5️⃣ 🔥 CRÉATION DE LA SESSION SSO
        // ─────────────────────────────────────────
        req.session.userId = user._id.toString();
        req.session.email = user.email;
        req.session.role = user.role;
        req.session.name = user.name;
        req.session.authenticated = true;

        console.log('🎫 Session créée pour:', user.email);

        // ─────────────────────────────────────────
        // 6️⃣ Redirection vers le dashboard
        // ─────────────────────────────────────────
        console.log('🚀 Redirection vers le dashboard');
        res.redirect(`${process.env.FRONT_URL}/dashboard`);
        //res.redirect('${process.env.FRONT_URL}/dashboard');

    } catch (error) {
        console.error('❌ Erreur lors du callback Google:', error);

        // Log détaillé en développement
        if (config.nodeEnv === 'development') {
            console.error('Stack trace:', error.stack);
        }

        res.status(500).redirect(`${process.env.FRONT_URL}/login?error=auth_failed`);
    }
};

// ========================================
// 🚪 CONTROLLER : Déconnexion
// ========================================

/**
 * Déconnecte l'utilisateur et détruit la session
 * @route POST /api/auth/logout
 * @route GET /api/auth/logout
 */
exports.logout = async (req, res) => {
    try {
        const userEmail = req.session?.email || 'Utilisateur inconnu';

        // Destruction de la session
        req.session.destroy((err) => {
            if (err) {
                console.error('❌ Erreur lors de la destruction de session:', err);
                return res.status(500).json({
                    error: 'Erreur lors de la déconnexion'
                });
            }

            // Suppression du cookie de session
            res.clearCookie('connect.sid');

            console.log('👋 Utilisateur déconnecté:', userEmail);

            // Réponse selon le type de requête
            if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
                // Requête AJAX / API
                res.json({
                    success: true,
                    message: 'Déconnexion réussie'
                });
            } else {
                // Requête normale (navigateur)
                res.redirect(`${process.env.FRONT_URL}/login?message=logged_out`);
            }
        });

    } catch (error) {
        console.error('❌ Erreur lors de la déconnexion:', error);
        res.status(500).json({
            error: 'Erreur lors de la déconnexion'
        });
    }
};

// ========================================
// ✅ CONTROLLER : Vérifier le statut d'authentification
// ========================================

/**
 * Vérifie si l'utilisateur est connecté
 * Retourne les informations de session
 * @route GET /api/auth/status
 */
exports.checkAuthStatus = (req, res) => {
    try {
        if (req.session && req.session.authenticated) {
            // Utilisateur connecté
            res.json({
                authenticated: true,
                user: {
                    id: req.session.userId,
                    email: req.session.email,
                    name: req.session.name,
                    role: req.session.role
                }
            });
        } else {
            // Utilisateur non connecté
            res.json({
                authenticated: false,
                user: null
            });
        }

    } catch (error) {
        console.error('❌ Erreur lors de la vérification du statut:', error);
        res.status(500).json({
            error: 'Erreur lors de la vérification'
        });
    }
};