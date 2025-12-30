import './App.css'
import Menu from "./components/pages/Menu";
import { Header } from './components/pages/Header'
import AppNavigation from './components/pages/Navigation'
import { Footer } from './components/pages/Footer'
import { AuthProvider } from './contexts/AuthContext';
import { useLocation } from "react-router-dom";   // ✅

function App({ toggleTheme, mode }) {
  const location = useLocation();
  const publicRoutes = ["/login", "/conditions"];
  const isPublicPage = publicRoutes.includes(location.pathname);
  return (
    <AuthProvider>
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        //background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)"
      }}>
        {/* ✅ Menu uniquement si on n'est PAS sur /login */}
        {!isPublicPage && (
          <div style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
              <Menu />
            </div>
          </div>
        )}

        <Header toggleTheme={toggleTheme} mode={mode}/>

        <main
          style={{
            flex: 1,
          }}
        >
          <AppNavigation />
        </main>
        {!isPublicPage && (
          <Footer />
        )}
      </div>
    </AuthProvider>
  )

}

export default App;