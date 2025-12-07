import './App.css'
import Menu from "./components/Menu";
import {Header}  from './components/Header'
import AppNavigation from './components/Navigation'
import {Footer}  from './components/Footer'


function App() {
  
  return (
        <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column",
      //background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)"
    }}>
      <div style={{ 
        position: "sticky", 
        top: 0, 
        zIndex: 1000,
      //  background: "linear-gradient(to bottom, #f8f9fa, #e9ecef)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "20px" }}>
          <Menu />
        </div>
      </div>

      <Header />
      
      <main
        style={{
          flex: 1,
        }}
      >
        <AppNavigation />
      </main>
      
      <Footer />
    </div>
      )
  
}

export default App