[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/fHqqMzWZ)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=21965358&assignment_repo_type=AssignmentRepo)
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

## 👨‍🎓 Travail réalisé par le groupe Trio React

### 👥 Membres du groupe
- Times Alfred
- Jeudy Ralph Stevens
- Caleb Toussaint

### 🌐 Accès à l’application
L’application est déployée et accessible en ligne à l’adresse suivante :
https://student-management.duckdns.org/

L’accès est sécurisé et restreint aux utilisateurs invités.

### 🎯 Description de l’application
Application complète de gestion académique permettant l’administration des étudiants,
des cours et des notes avec authentification sécurisée, gestion des rôles et dashboards
adaptés aux profils utilisateurs.

### 🔐 Authentification & sécurité
- Authentification OAuth 2
- Connexion via Google (SSO) pour vérification des emails
- Gestion des rôles :
  - ADMIN
  - SCOLARITÉ
  - STUDENT
- Accès restreint à la plateforme (invitation obligatoire)

### 🚀 Fonctionnalités implémentées
- Gestion des étudiants, cours et notes (CRUD)
- Dashboards dynamiques selon le rôle utilisateur
- Thème Material UI clair / sombre
- Envoi d’emails d’invitation via Nodemailer
- Sessions persistantes et sécurisées

### 🗄️ Persistance des données
Les données de l’application sont stockées dans une **base de données MongoDB distante**,
hébergée dans le cloud.

- Persistance des étudiants, cours, notes et utilisateurs
- Accès sécurisé via variables d’environnement
- Aucune donnée sensible stockée en dur dans le code

### 📊 Statistiques
- ADMIN : vision globale sur toutes les entités
- SCOLARITÉ : suivi académique des étudiants
- STUDENT : visualisation de ses notes et statistiques personnelles

### 🐳 Containerisation & déploiement
- Containerisation du frontend React et du backend Node.js avec Docker
- Reverse proxy Nginx
- Pipeline CI/CD avec GitHub Actions
- Déploiement sur le cloud via AWS

### 🎥 Vidéo de démonstration
Lien de la vidéo de démonstration (mis à jour suite à un problème de paramétrage YouTube) :
https://youtu.be/vdUNe12aPt4


### 🔒 Sécurité & HTTPS
- Application accessible exclusivement en **HTTPS**
- Certificat SSL valide émis par **Let’s Encrypt**
- Connexions chiffrées (TLS)
- Requis pour l’authentification OAuth 2 (Google)
