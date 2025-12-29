import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { statsAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from "@mui/material/styles";

export default function ScolariteDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
const theme = useTheme();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await statsAPI.getScolariteDashboard();
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontWeight: "bold",
        mb: 4
      }}>
        📋 Dashboard Scolarité - Gestion Académique
      </Typography>

      {/* ========== CARTES DE STATISTIQUES ========== */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card elevation={3} sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            cursor: 'pointer'
          }}
            onClick={() => navigate('/etudiants')}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats?.totalStudents || 0}
              </Typography>
              <Typography variant="h6">👨‍🎓 Étudiants Inscrits</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card elevation={3} sx={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            cursor: 'pointer'
          }}
            onClick={() => navigate('/matieres')}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats?.totalCourses || 0}
              </Typography>
              <Typography variant="h6">📚 Cours Actifs</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card elevation={3} sx={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            cursor: 'pointer'
          }}
            onClick={() => navigate('/notes')}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats?.totalGrades || 0}
              </Typography>
              <Typography variant="h6">📝 Notes Saisies</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ========== ACTIONS RAPIDES ========== */}
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          ⚡ Actions Rapides
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => navigate('/etudiants/new')}
              sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
            >
              ➕ Nouveau étudiant
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => navigate('/matieres/new')}
              sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}
            >
              ➕ Nouveau cours
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => navigate('/notes/new')}
              sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}
            >
              ➕ Saisir une note
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              onClick={() => navigate('/enroll')}
              sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}
            >
              🔗 Associer étudiant-cours
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ========== GRAPHIQUES ========== */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ p: 3, bgcolor: "background.paper", color: "text.primary" }}
          >
            <Typography variant="h6" gutterBottom>
              📊 Moyenne par Cours
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.averageByCourse || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.palette.divider}
                />
                <XAxis
                  dataKey="courseName"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  tick={{ fill: theme.palette.text.primary }}
                />
                <YAxis
                  domain={[0, 20]}
                  tick={{ fill: theme.palette.text.primary }}
                />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="average"
                  fill={theme.palette.primary.main}
                  name="Moyenne"
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ p: 3, bgcolor: "background.paper", color: "text.primary" }}
          >
            <Typography variant="h6" gutterBottom>
              ⚠️ Étudiants Nécessitant un Suivi
            </Typography>
            {stats?.studentsAtRisk?.map((student, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  p: 2,
                  mb: 1,
                  bgcolor:
                    theme.palette.mode === "dark"
                      ? theme.palette.background.default
                      : "#ffebee",
                  borderRadius: 1,
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/etudiants/${student.id}`)}
              >
                <Typography sx={{ color: "text.primary" }}>
                  {student.name}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: "bold",
                    color:
                      theme.palette.mode === "dark"
                        ? theme.palette.error.main
                        : "#d32f2f",
                  }}
                >
                  Moyenne: {student.average.toFixed(2)} / 20
                </Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}