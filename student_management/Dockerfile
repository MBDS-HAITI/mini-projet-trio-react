# 1️⃣ Image de base avec Node.js déjà installé
FROM node:20

# 2️⃣ Dossier de travail à l’intérieur du container
WORKDIR /app

# 3️⃣ Copier package.json et package-lock.json
COPY package*.json ./

# 4️⃣ Installer les dépendances
RUN npm install

# 5️⃣ Copier tout le reste du code backend
COPY . .

# 6️⃣ Le backend écoute sur le port 8010
EXPOSE 8010

# 7️⃣ Commande pour démarrer le serveur
CMD ["npm", "run", "start"]
