import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { statsAPI } from '../../services/api';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useTheme } from "@mui/material/styles";


export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const result = await statsAPI.getStudentDashboard();
      console.log('📊 Données reçues:', result);
      setData(result);
    } catch (err) {
      console.error('❌ Erreur chargement stats:', err);
      setError(err.response?.data?.message || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={3}>
        <Alert severity="info">Aucune donnée disponible</Alert>
      </Box>
    );
  }

  const stats = data.stats || {};
  const student = data.student || {};

  // Préparer les données pour le graphique des moyennes par cours
  const courseAveragesData = (data.myAveragesByCourse || []).map(myCourse => {
    const classAvg = (data.classAveragesByCourse || []).find(
      c => c._id?.toString() === myCourse._id?.toString()
    );
    return {
      courseName: myCourse.courseName || 'Inconnu',
      myAverage: parseFloat((myCourse.myAverage || 0).toFixed(2)),
      classAverage: parseFloat((classAvg?.classAverage || 0).toFixed(2))
    };
  });

  // Préparer les données pour la tendance (évolution des notes)
  const gradesTrendData = (data.grades || []).slice(0, 10).reverse().map(g => ({
    date: new Date(g.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
    grade: g.grade,
    courseName: g.course
  }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontWeight: "bold",
        mb: 4
      }}>
        🎓 Bienvenue {student.firstName} {student.lastName}
      </Typography>

      {/* ========== CARTES DE STATISTIQUES ========== */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats.averageGrade || '0.00'}
              </Typography>
              <Typography variant="h6">📊 Ma Moyenne Générale</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {data.myAveragesByCourse?.length || 0}
              </Typography>
              <Typography variant="h6">📚 Cours avec Notes</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats.totalGrades || 0}
              </Typography>
              <Typography variant="h6">📝 Notes Obtenues</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{
            background: stats.bestGrade >= 16
              ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
              : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {stats.bestGrade || '-'}
              </Typography>
              <Typography variant="h6">🏆 Meilleure Note</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ========== GRAPHIQUES ========== */}
      <Grid container spacing={3}>
        {/* Évolution des notes */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ p: 3, bgcolor: "background.paper", color: "text.primary" }}
          >
            <Typography variant="h6" gutterBottom>
              📈 Évolution de Mes Notes (10 dernières)
            </Typography>
            {gradesTrendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={gradesTrendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.palette.divider}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: theme.palette.text.primary }}
                  />
                  <YAxis
                    domain={[0, 20]}
                    tick={{ fill: theme.palette.text.primary }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="grade"
                    stroke={theme.palette.primary.main}
                    name="Note"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Alert severity="info">Aucune note enregistrée</Alert>
            )}
          </Paper>
        </Grid>

        {/* Mes notes par matière */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ p: 3, bgcolor: "background.paper", color: "text.primary" }}
          >
            <Typography variant="h6" gutterBottom>
              📚 Mes Moyennes par Matière
            </Typography>
            {courseAveragesData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={courseAveragesData}>
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
                    dataKey="myAverage"
                    fill={theme.palette.primary.main}
                    name="Ma Moyenne"
                  />
                  <Bar
                    dataKey="classAverage"
                    fill={theme.palette.secondary.main}
                    name="Moyenne Classe"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Alert severity="info">Aucune moyenne calculée</Alert>
            )}
          </Paper>
        </Grid>

        {/* Meilleures notes */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ p: 3, bgcolor: "background.paper", color: "text.primary" }}
          >
            <Typography variant="h6" gutterBottom>
              🏆 Mes Meilleures Notes
            </Typography>
            {data.bestGrades && data.bestGrades.length > 0 ? (
              data.bestGrades.map((grade, index) => (
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
                        : "#e8f5e9",
                    borderRadius: 1,
                  }}
                >
                  <Typography sx={{ color: "text.primary" }}>
                    {grade.courseName}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color:
                        theme.palette.mode === "dark"
                          ? theme.palette.success.main
                          : "#2e7d32",
                    }}
                  >
                    {grade.grade} / 20
                  </Typography>
                </Box>
              ))
            ) : (
              <Alert severity="info">Aucune note disponible</Alert>
            )}
          </Paper>
        </Grid>

        {/* Notes à améliorer */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ p: 3, bgcolor: "background.paper", color: "text.primary" }}
          >
            <Typography variant="h6" gutterBottom>
              ⚠️ Matières à Améliorer
            </Typography>
            {data.worstGrades && data.worstGrades.length > 0 ? (
              data.worstGrades.map((grade, index) => (
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
                        : grade.grade < 10
                          ? "#ffebee"
                          : "#fff3e0",
                    borderRadius: 1,
                  }}
                >
                  <Typography sx={{ color: "text.primary" }}>
                    {grade.courseName}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: "bold",
                      color:
                        grade.grade < 10
                          ? theme.palette.error.main
                          : theme.palette.warning.main,
                    }}
                  >
                    {grade.grade} / 20
                  </Typography>
                </Box>
              ))
            ) : (
              <Alert severity="info">Aucune note disponible</Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}