# =========================
# ÉTAPE 1 : BUILD REACT
# =========================

# 1️⃣ Image avec Node.js pour construire l’app
FROM node:20 AS build

# 2️⃣ Dossier de travail dans le container
WORKDIR /app

# 3️⃣ Copier les fichiers de dépendances
COPY package*.json ./

# 4️⃣ Installer les dépendances React
RUN npm install

# 5️⃣ Copier tout le code frontend
COPY . .

# 6️⃣ Construire l’application (npm run build)
RUN npm run build


# =========================
# ÉTAPE 2 : SERVIR AVEC NGINX
# =========================

FROM nginx:alpine

# Supprimer la config Nginx par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copier notre config React
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier le build React
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
