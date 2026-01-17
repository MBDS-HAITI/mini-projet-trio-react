import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { statsAPI } from '../../services/api';
import {
  PieChart, Pie, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';
import { useTheme } from "@mui/material/styles";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await statsAPI.getAdminDashboard();
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // ✅ Top 7 cours par moyenne
  const topCourses = (stats?.gradesByCourse || [])
    .sort((a, b) => b.average - a.average)
    .slice(0, 7);

  return (
    <Box sx={{ p: 2 }}>
      {/* ===== TITRE ===== */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: 700,
          mb: 1
        }}
      >
        📊 Tableau de bord – Administrateur
      </Typography>

      <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 3 }}>
        Vue d’ensemble des statistiques du système
      </Typography>

      {/* ===== CARTES DE STATISTIQUES ===== */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "👨‍🎓 Étudiants", value: stats?.totalStudents || 0, bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
          { label: "📚 Cours", value: stats?.totalCourses || 0, bg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
          { label: "📝 Notes", value: stats?.totalGrades || 0, bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
          { label: "📊 Moyenne", value: stats?.averageGrade?.toFixed(2) || "0.00", bg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)" },
          { label: "👥 Utilisateurs", value: stats?.totalUsers || 0, bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)" },
          { label: "⚠️ En difficulté", value: stats?.studentsInDifficulty || 0, bg: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", color: "#d32f2f" }
        ].map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card elevation={3} sx={{ background: item.bg, color: item.color || "white" }}>
              <CardContent sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  {item.value}
                </Typography>
                <Typography variant="subtitle2">
                  {item.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ===== GRAPHIQUES ===== */}
      <Grid container spacing={3} sx={{ maxWidth: 1100, mx: "auto" }}>

        {/* Distribution */}
        <Grid item xs={12} sx={{ width: "100%", mb: 3 }}>
          <Paper
            elevation={3}
            sx={{ p: 2, bgcolor: "background.paper", color: "text.primary" }}
          >            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              📈 Distribution des moyennes
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.gradeDistribution || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="count"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {(stats?.gradeDistribution || []).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>


        {/* Top cours */}
        <Grid item
          xs={12}
          sm={8}
        >
          <Paper
            elevation={3}
            sx={{ p: 2, bgcolor: "background.paper", color: "text.primary" }}
          >            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              📊 Top 7 cours par moyenne
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topCourses}
                  layout="vertical"
                  margin={{ left: 30, right: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                  <XAxis type="number" domain={[0, 20]} ticks={[5, 10, 15, 20]} tick={{ fontSize: 12, fill: theme.palette.text.primary }} />
                  <YAxis type="category" dataKey="courseName" width={60} tick={{fontSize: 12, fill: theme.palette.text.primary }} />
                  <Tooltip />
                  <Bar dataKey="average" fill="#8884d8" name="Moyenne" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Top étudiants */}
        <Grid item
          xs={12}
          sm={4}
        >
          <Paper
            elevation={3}
            sx={{ p: 2, bgcolor: "background.paper", color: "text.primary" }}
          >            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
              🏆 Top 5 meilleurs étudiants
            </Typography>
            {stats?.topStudents?.map((s, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  p: 1.5,
                  mb: 1,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? theme.palette.background.default
                      : i === 0
                        ? "#fff9c4"
                        : "#f5f5f5",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body2" sx={{ color: "text.primary" }}>
                  {i + 1}. {s.name}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ fontWeight: "bold", color: "primary.main" }}
                >
                  {s.average.toFixed(2)} / 20
                </Typography>

              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
