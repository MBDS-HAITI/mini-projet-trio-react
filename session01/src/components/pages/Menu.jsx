import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useMemo, useCallback } from "react";

function Menu() {
  const location = useLocation();
  const { user } = useAuth();

  // Configuration des menus par rôle - ADAPTÉ À AppNavigation
  const getMenuItems = useCallback((role) => {
    const menus = {
      ADMIN: [
        { name: "Dashboard", icon: "📊", path: "/dashboard" },
        { name: "Notes", icon: "📝", path: "/notes" },
        { name: "Etudiants", icon: "👨‍🎓", path: "/etudiants" },
        { name: "Matières", icon: "📚", path: "/matieres" },
        { name: "Utilisateurs", icon: "👥", path: "/users" },
        { name: "À propos", icon: "ℹ️", path: "/apropos" }
      ],
      SCOLARITE: [ 
        { name: "Dashboard", icon: "📊", path: "/dashboard" },
        { name: "Notes", icon: "📝", path: "/notes" },
        { name: "Etudiants", icon: "👨‍🎓", path: "/etudiants" },
        { name: "Matières", icon: "📚", path: "/matieres" },
        { name: "À propos", icon: "ℹ️", path: "/apropos" }
      ],
      STUDENT: [
        { name: "Dashboard", icon: "📊", path: "/dashboard" }, 
        { name: "Mes Notes", icon: "📝", path: "/mes-notes" },
        { name: "Mes Matières", icon: "📚", path: "/mes-matieres" },
        { name: "Mon Profil", icon: "👤", path: "/mon-profil" },
        { name: "À propos", icon: "ℹ️", path: "/apropos" }
      ],
      DEFAULT: [
        { name: "Dashboard", icon: "📊", path: "/dashboard" },
        { name: "Notes", icon: "📝", path: "/notes" },
        { name: "Etudiants", icon: "👨‍🎓", path: "/etudiants" },
        { name: "Matières", icon: "📚", path: "/matieres" },
        { name: "À propos", icon: "ℹ️", path: "/apropos" }
      ]
    };

    return menus[role] || menus.DEFAULT;
  }, []);

  const menuItems = useMemo(() => getMenuItems(user?.role), [user?.role, getMenuItems]);

  const isActive = useCallback((path) => location.pathname === path, [location.pathname]);

  // Styles
  const navStyle = {
    display: "flex",
    gap: "10px",
    padding: "20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    flexWrap: "wrap"
  };

  const getLinkStyle = useCallback((active) => ({
    textDecoration: "none",
    cursor: "pointer",
    padding: "12px 24px",
    border: "none",
    borderRadius: "8px",
    borderBottom: active ? "3px solid #667eea" : "3px solid transparent",
    fontSize: "16px",
    fontWeight: active ? "700" : "500",
    color: active ? "#667eea" : "white",
    background: active ? "white" : "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: active ? "translateY(-2px)" : "translateY(0)",
    boxShadow: active
      ? "0 4px 12px rgba(0, 0, 0, 0.15)"
      : "0 2px 4px rgba(0, 0, 0, 0.1)",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  }), []);

  const iconStyle = {
    fontSize: "20px"
  };

  // Handlers
  const handleMouseEnter = useCallback((e, active) => {
    if (!active) {
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
      e.currentTarget.style.transform = "translateY(-1px)";
    }
  }, []);

  const handleMouseLeave = useCallback((e, active) => {
    if (!active) {
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
      e.currentTarget.style.transform = "translateY(0)";
    }
  }, []);

  return (
    <nav style={navStyle} role="navigation" aria-label="Menu principal">
      {menuItems.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            style={getLinkStyle(active)}
            aria-current={active ? "page" : undefined}
            aria-label={item.name}
            onMouseEnter={(e) => handleMouseEnter(e, active)}
            onMouseLeave={(e) => handleMouseLeave(e, active)}
          >
            <span style={iconStyle} aria-hidden="true">
              {item.icon}
            </span>
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}

export default Menu;