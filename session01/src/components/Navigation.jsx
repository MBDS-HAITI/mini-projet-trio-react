import { Routes, Route } from 'react-router-dom';
import Notes from './Notes';
import Etudiants from './Etudiants';
import Matieres from './Matieres';
import APropos from './APropos';
import Home from "./Home";
import DetailsMatiere from "./DetailsMatiere";
import DetailsNote from "./DetailsNote";
import DetailsEtudiant from "./DetailsEtudiant";


function AppNavigation() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/etudiants" element={<Etudiants />} />
        <Route path="/matieres" element={<Matieres />} />
        <Route path="/etudiants/:id" element={<DetailsEtudiant />} />
        <Route path="/notes/:id" element={<DetailsNote />} />
        <Route path="/matieres/:name" element={<DetailsMatiere />} />
        <Route path="/apropos" element={<APropos />} />
      </Routes>
    </>
  );
}

export default AppNavigation;