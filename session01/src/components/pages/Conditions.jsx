import { Box, Paper, Typography, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

export default function Conditions() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: 6,
        px: 2,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          maxWidth: 900,
          width: '100%',
          p: { xs: 3, sm: 5 },
          borderRadius: 4,
          boxShadow: 6,
        }}
      >
        {/* Retour */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Retour
        </Button>

        {/* Titre */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            mb: 1,
            textAlign: 'center',
          }}
        >
          Conditions d’utilisation
        </Typography>

        <Typography
          variant="body2"
          sx={{ textAlign: 'center', color: 'text.secondary', mb: 4 }}
        >
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* Introduction */}
        <Typography sx={{ mb: 3, lineHeight: 1.7 }}>
          Bienvenue sur <strong>Student Management System</strong>.  
          Cette plateforme a pour objectif de faciliter la gestion académique
          des étudiants, des notes et des utilisateurs. En accédant à ce service,
          vous acceptez les présentes conditions d’utilisation.
        </Typography>

        {/* Sections */}
        <Section
          title="1. Acceptation des conditions"
          text="En utilisant cette application, vous reconnaissez avoir lu, compris et accepté l’ensemble des présentes conditions. Si vous n’êtes pas d’accord, vous devez cesser immédiatement l’utilisation du service."
        />

        <Section
          title="2. Utilisation du service"
          list={[
            "Utiliser la plateforme uniquement à des fins académiques",
            "Respecter les règles et politiques de votre établissement",
            "Ne pas tenter d’accéder à des données non autorisées",
            "Ne pas perturber le fonctionnement du système",
          ]}
        />

        <Section
          title="3. Comptes et sécurité"
          text="Vous êtes responsable de la confidentialité de vos identifiants. Toute action réalisée depuis votre compte est réputée avoir été effectuée par vous."
        />

        <Section
          title="4. Données et confidentialité"
          list={[
            "Les données sont utilisées uniquement à des fins pédagogiques",
            "Elles sont accessibles uniquement aux utilisateurs autorisés",
            "Aucune donnée n’est vendue ou partagée sans consentement",
            "Des mesures de sécurité sont mises en place pour les protéger",
          ]}
        />

        <Section
          title="5. Propriété intellectuelle"
          text="L’ensemble des contenus, logos et fonctionnalités de la plateforme sont protégés par les lois sur la propriété intellectuelle et restent la propriété de l’établissement."
        />

        <Section
          title="6. Limitation de responsabilité"
          text="Le service est fourni « en l’état ». Nous ne garantissons pas une disponibilité continue et ne saurions être tenus responsables des pertes de données ou dommages indirects."
        />

        <Section
          title="7. Modifications"
          text="Nous pouvons modifier ces conditions à tout moment. Les utilisateurs seront informés et l’utilisation continue du service vaudra acceptation."
        />

        <Section
          title="8. Résiliation"
          text="L’accès peut être suspendu ou supprimé en cas de non-respect des présentes conditions ou pour des raisons de sécurité."
        />

        <Section
          title="9. Droit applicable"
          text="Ces conditions sont régies par les lois en vigueur en Haïti. Tout litige relèvera de la compétence des tribunaux compétents."
        />

        <Section
          title="10. Contact"
          list={[
            "Email : student.app.ht@gmail.com",
            "Téléphone : +509 3740-0000",
            "Adresse : Port-au-Prince, Haïti",
          ]}
        />

        {/* Bouton accepter */}
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(-1)}
            sx={{
              px: 6,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            J’ai lu et j’accepte
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

/* 🔹 Petit composant interne pour les sections */
function Section({ title, text, list }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      {text && (
        <Typography sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
          {text}
        </Typography>
      )}
      {list && (
        <Box component="ul" sx={{ pl: 3, color: 'text.secondary', lineHeight: 1.8 }}>
          {list.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </Box>
      )}
    </Box>
  );
}
