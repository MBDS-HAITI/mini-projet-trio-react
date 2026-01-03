import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

/**
 * =====================================================
 * 🔐 CONTEXTE D'AUTHENTIFICATION GLOBAL
 * - Charge la session au démarrage
 * - Expose user / isAuthenticated / isLoading
 * - AUCUNE redirection ici (règle d’or)
 * =====================================================
 */

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 Chargement initial de la session
  useEffect(() => {
    const initAuth = async () => {
      await checkAuthStatus();
    };

    initAuth();
  }, []);

  /**
   * 🔍 Vérifie le statut de la session côté backend
   */
  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.getStatus();

      if (response?.authenticated) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('❌ Erreur vérification auth:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      // 🔥 IMPORTANT : on termine toujours le loading
      setIsLoading(false);
    }
  };

  /**
   * ✅ Login manuel (rarement utilisé avec OAuth,
   * mais utile si un jour tu ajoutes un login classique)
   */
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * 🚪 Logout
   */
  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
    }
  };

  /**
   * 🎁 Valeur exposée au reste de l’application
   */
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * 🧩 Hook personnalisé
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }

  return context;
}
