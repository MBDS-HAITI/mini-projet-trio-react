import { StrictMode, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

function Root() {
  const [mode, setMode] = useState(
    localStorage.getItem("theme") || "light"
  );

  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode,
        primary: { main: "#6f63d2" },
        secondary: { main: "#1976d2" },
        background: {
          default: mode === "dark" ? "#2b255f" : "#f3f1ff",
          paper: mode === "dark" ? "#3a347a" : "#ffffff",
        },
        text: {
          primary: mode === "dark" ? "#ffffff" : "#2b255f",
          secondary: mode === "dark" ? "#d1ccff" : "#5a55aa",
        },
      },
    }),
    [mode]
  );

  const toggleTheme = () => {
    setMode(prev => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("theme", next);
      return next;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App toggleTheme={toggleTheme} mode={mode} />
      </BrowserRouter>
    </ThemeProvider>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
