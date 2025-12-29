import { Box, Paper, Typography, Grid, Card, CardContent } from "@mui/material";

export default function Home() {
  const stats = [
    { title: "📝 Notes", value: "Gérer les notes", color: "#1976d2" },
    { title: "👨‍🎓 Étudiants", value: "Liste des étudiants", color: "#2e7d32" },
    { title: "📚 Matières", value: "Statistiques des cours", color: "#ed6c02" },
  ];

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h3" gutterBottom sx={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold",
          mb: 2
        }}>
          🎓 Bienvenue au Système de Gestion des Notes
        </Typography>
        
        <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
          Gérez efficacement les notes, étudiants et matières
        </Typography>

        <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", justifyContent: "center", mt: 4 }}>
          {stats.map((stat, index) => (
            <Card 
              key={index}
              elevation={2}
              sx={{ 
                width: { xs: "100%", sm: "45%", md: "30%" },
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 4
                }
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  {stat.title.split(' ')[0]}
                </Typography>
                <Typography variant="h6" sx={{ color: stat.color, fontWeight: "bold" }}>
                  {stat.title.split(' ')[1]}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ mt: 5, p: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary">
            💡 Utilisez le menu ci-dessus pour naviguer entre les différentes sections
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}