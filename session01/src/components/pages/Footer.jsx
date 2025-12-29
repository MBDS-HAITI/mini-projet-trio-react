function Footer() {
  const annee = new Date().getFullYear();
  const nom = "Alfred";
  const prenom = "Times";
  return (
    <footer>
       © {annee} - {prenom}.{nom}, Tous droits réservés.
    </footer>
  );
}

export{Footer}