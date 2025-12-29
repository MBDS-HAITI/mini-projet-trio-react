import { Box, Paper, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import "./APropos.css";

export default function APropos() {
  const theme = useTheme();

  return (
    <Box className="apropos-container" sx={{ bgcolor: "background.default" }}>
      <Paper
        className="apropos-paper"
        elevation={3}
        sx={{
          bgcolor: "background.paper",
          color: "text.primary",
        }}
      >
        <Typography
          variant="h5"
          className="apropos-title"
          sx={{ color: theme.palette.primary.main }}
        >
          ℹ️ À propos de cette application
        </Typography>

        <Typography
          className="apropos-text"
          sx={{ color: theme.palette.text.primary }}
        >
          Cette application a été développée dans le cadre du cours MBDS Haïti.
          Elle permet de gérer les étudiants, les matières et leurs notes de manière
          dynamique grâce à une API Node.js/MongoDB et une interface réalisée en React.
        </Typography>

        <Typography
          className="apropos-text"
          sx={{ color: theme.palette.text.primary }}
        >
          Elle illustre l’utilisation de technologies modernes telles que :
        </Typography>

        <ul
          className="apropos-list"
          style={{ color: theme.palette.text.primary }}
        >
          <li>React + Hooks</li>
          <li>React Router v6</li>
          <li>Material UI</li>
          <li>Express / Node.js</li>
          <li>MongoDB / Mongoose</li>
        </ul>

        <Typography
          className="apropos-text"
          sx={{ color: theme.palette.text.primary }}
        >
          Le but est d’offrir une interface moderne et intuitive, tout en travaillant
          avec de vraies données provenant d’une API.
        </Typography>

        <Typography
          className="apropos-highlight"
          sx={{ color: theme.palette.primary.main }}
        >
          Merci d’utiliser cette application 👨‍🎓🚀
        </Typography>
      </Paper>
    </Box>
  );
}
