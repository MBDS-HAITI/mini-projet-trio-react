import { Link, useLocation } from "react-router-dom";

function Menu() {
  const location = useLocation();

  const menuItems = [
    { name: "Home", icon: "🏠", path: "/" },
    { name: "Notes", icon: "📝", path: "/notes" },
    { name: "Etudiants", icon: "👨‍🎓", path: "/etudiants" },
    { name: "Matières", icon: "📚", path: "/matieres" },
    { name: "À propos", icon: "ℹ️", path: "/apropos" }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      style={{
        display: "flex",
        gap: "10px",
        padding: "20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        flexWrap: "wrap"
      }}
    >
      {menuItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          style={{
            textDecoration: "none",
            cursor: "pointer",
            padding: "12px 24px",
            border: "none",
            borderRadius: "8px",
            borderBottom: isActive(item.path) ? "3px solid #667eea" : "3px solid transparent",
            fontSize: "16px",
            fontWeight: isActive(item.path) ? "700" : "500",
            color: isActive(item.path) ? "#667eea" : "white",
            background: isActive(item.path)
              ? "white"
              : "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isActive(item.path) ? "translateY(-2px)" : "translateY(0)",
            boxShadow: isActive(item.path)
              ? "0 4px 12px rgba(0, 0, 0, 0.15)"
              : "0 2px 4px rgba(0, 0, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
          onMouseEnter={(e) => {
            if (!isActive(item.path)) {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            if (!isActive(item.path)) {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }
          }}
        >
          <span style={{ fontSize: "20px" }}>{item.icon}</span>
          {item.name}
        </Link>
      ))}
    </nav>
  );
}

export default Menu;