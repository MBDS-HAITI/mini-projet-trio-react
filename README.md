# Project Final React

## Description

Dans ce projet, vous allez finaliser l'application de gestion des
étudiants, cours et notes que vous avez commencée en TP.

## Fonctionnalités

### Module 0

-   Fonctionnalités de base du TP précédent\
-   Gestion des entités **cours**, **étudiants** et **notes**\
-   Synchronisation avec une **API Node.js**

### Module 1 -- Authentification

Mettre en place un module d'authentification en utilisant **OAuth 2**
permettant la connexion des utilisateurs avant d'accéder aux
fonctionnalités de base.

#### Gestion des rôles

-   **ADMIN** : Administration des comptes\
-   **SCOLARITÉ** : Administration des étudiants, cours et notes\
-   **STUDENT** : Visualisation de ses propres données

#### Accès après authentification

-   **Administrateur** : accès **lecture + écriture** à toutes les
    données\
-   **Scolarité** : accès aux étudiants, cours et notes. Peut :
    -   saisir des notes\
    -   éditer des profils étudiants\
    -   saisir des cours\
    -   associer des étudiants à des cours\
-   **Étudiant** : visualisation uniquement de ses notes et statistiques
    associées

### Module 2 -- Statistiques améliorées

Développer des dashboards adaptés aux rôles :

-   **Administrateur** : vision globale de toutes les entités\
-   **Scolarité** : vision sur les dossiers des étudiants, cours et
    notes\
-   **Étudiant** : vision uniquement sur son propre dossier

### Module 3 -- Containerisation et déploiement

-   Containerisation des applications **React** et **Node** via
    **Docker**\
-   Mise en place d'une **pipeline de déploiement dans le cloud** (ex.
    AWS, Hostinger, ...)

### Bonus

-   Utiliser les themings Material (mode clair / sombre)\
-   Envoi de mails\
-   Authentification **SSO** (Google, LinkedIn, GitHub, ...)\
-   ...

## Modalités de rendus
-   Utiliser les mêmes groupes que pour le TP\
-   Répartir le travail sur la base du code des TPs\
-   **Deadline ferme : Voir la date de l'assignation **\
-   Faire une **vidéo démo** de l'ensemble des fonctionnalités (publiée
    sur YouTube)
