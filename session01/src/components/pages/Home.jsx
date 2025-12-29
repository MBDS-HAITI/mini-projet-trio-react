import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirection selon le rôle
      switch (user.role) {
        case 'ADMIN':
          navigate('/dashboard/admin');
          break;
        case 'SCOLARITE':
          navigate('/dashboard/scolarite');
          break;
        case 'STUDENT':
          navigate('/dashboard/student');
          break;
        default:
          navigate('/login');
      }
    } else if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [user, isAuthenticated, isLoading, navigate]);

  // Affichage pendant le chargement
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh' 
    }}>
      <CircularProgress />
    </Box>
  );
}