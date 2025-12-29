import { Box, Paper } from "@mui/material";

export default function APropos() {
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 800, margin: "auto" }}>
        <h1 style={{ color: "#1976d2", marginBottom: "10px" }}>
          ℹ️ À propos de cette application
        </h1>

        <p style={{ fontSize: "1rem", color: "#444", lineHeight: "1.6" }}>
          Cette application a été développée dans le cadre du cours MBDS Haïti. 
          Elle permet de gérer les étudiants, les matières et leurs notes de manière 
          dynamique grâce à une API Node.js/MongoDB et une interface réalisée en React.
        </p>

        <p style={{ fontSize: "1rem", color: "#444", lineHeight: "1.6" }}>
          Elle illustre l’utilisation de technologies modernes telles que :
        </p>

        <ul style={{ color: "#444", lineHeight: "1.6" }}>
          <li>React + Hooks</li>
          <li>React Router v6</li>
          <li>Material UI</li>
          <li>Express / Node.js</li>
          <li>MongoDB / Mongoose</li>
        </ul>

        <p style={{ fontSize: "1rem", color: "#444", lineHeight: "1.6" }}>
          Le but est d’offrir une interface moderne et intuitive, tout en travaillant 
          avec de vraies données provenant d’une API.
        </p>

        <p style={{ fontSize: "1rem", color: "#1976d2", fontWeight: "bold" }}>
          Merci d’utiliser cette application 👨‍🎓🚀
        </p>
      </Paper>
    </Box>
  );
}
