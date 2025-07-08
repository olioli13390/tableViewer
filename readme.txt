# Mon Application Node.js

Cette application utilise **Express**, **Prisma**, **Twig**, et plusieurs autres bibliothèques pour fonctionner correctement. Veuillez suivre les instructions ci-dessous pour l'installation et la configuration.

## Prérequis

- Node.js 
- npm 
- Une base de données MySQL disponible localement

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/ton-utilisateur/ton-repo.git
cd ton-repo

### 2. Installer les dépendances suivantes : 

"dependencies": {
  "@prisma/client": "^6.11.0",
  "bcrypt": "^6.0.0",
  "dotenv": "^17.0.1",
  "express": "^5.1.0",
  "express-session": "^1.18.1",
  "prisma": "^6.11.0",
  "twig": "^1.17.1"
}

### 3. Créer un .env à la racine et renseigner les variables suivantes

DATABASEDATABASE_URL= exemple : "mysql://user:password@host:port/schema"
PORT= Choisir un port

### 4. Initialiser prisma

npx prisma Initialiser

### 5. Appliquer les migrations

npx prisma generate
npx prisma migrate dev --name init

### 6. Lancer "nodemon" en commande
