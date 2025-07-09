# Mon Application Node.js

Cette application utilise **Express**, **Prisma**, **Twig**, et plusieurs autres bibliothèques pour fonctionner correctement. Veuillez suivre les instructions ci-dessous pour l'installation et la configuration.

## Prérequis

- Node.js 
- npm 
- Une base de données MySQL disponible localement

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/olioli13390/tableViewer.git
cd ton-repo

### 2. Installer les dépendances : 

npm i

### 3. Créer un .env à la racine et renseigner les variables suivantes

DATABASE_URL= exemple : "mysql://user:password@host:port/schema"
PORT= Choisir un port

### 4. Initialiser prisma

npx prisma init

### 5. Appliquer les migrations

npx prisma generate
npx prisma migrate dev --name init

### 6. Lancer "nodemon" en commande
