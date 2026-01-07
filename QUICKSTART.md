# 🚀 Guide de Démarrage Rapide - GameHome

## Installation en 2 minutes

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd GameHome
```

### 2. Installer les dépendances

**Backend :**
```bash
cd backend
npm install
```

**Frontend :**
```bash
cd ../frontend
npm install
```

### 3. Démarrer l'application

**Terminal 1 - Backend :**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

### 4. Ouvrir l'application

Ouvrir http://localhost:5173 dans votre navigateur.

---

## Premier usage

### Créer votre premier message

1. Cliquer sur **"Nouvelle main courante"**
2. Entrer le mot de passe : `MainCourante`
3. Remplir le formulaire :
   - Auteur : Sélectionner un prénom (Jean, Marie, Pierre sont créés par défaut)
   - Message : Écrire votre texte
   - Catégories : Sélectionner au moins une catégorie
   - Fichiers : (Optionnel) Ajouter des images, vidéos ou PDFs
4. Cliquer sur **"Publier"**

### Interagir avec un message

- **❤️ Liker** : Cliquer sur le cœur, sélectionner un prénom
- **💬 Commenter** : Cliquer sur la bulle, sélectionner un prénom, écrire le commentaire
- **✅ Sélection multiple** : Cocher plusieurs messages puis cliquer "Liker" pour liker en masse

### Personnaliser les paramètres

1. Aller dans **Paramètres** (barre latérale ou menu mobile)
2. **Onglet Prénoms** :
   - Ajouter vos prénoms d'équipe
   - Désactiver les prénoms par défaut si besoin
3. **Onglet Catégories** :
   - Créer vos propres catégories
   - Personnaliser les couleurs
   - Réorganiser l'ordre

---

## Architecture rapide

```
┌─────────────┐     HTTP      ┌─────────────┐
│  Frontend   │ ◄────────────► │   Backend   │
│ React+Vite  │     REST API   │   Express   │
│  :5173      │                │    :3000    │
└─────────────┘                └─────────────┘
                                      │
                                      ▼
                               ┌─────────────┐
                               │  JSON Files │
                               │  + Uploads  │
                               └─────────────┘
```

---

## Commandes utiles

### Développement

```bash
# Backend (en watch mode)
cd backend && npm run dev

# Frontend (avec HMR)
cd frontend && npm run dev
```

### Production

```bash
# Build frontend
cd frontend && npm run build

# Build et démarrer backend
cd backend && npm run build && npm start

# Accéder à http://localhost:3000
```

### Reset des données

```bash
# Supprimer toutes les données
rm -rf backend/data/*.json backend/uploads/*

# Redémarrer le backend pour recréer les données par défaut
npm run dev
```

---

## Troubleshooting

### Le backend ne démarre pas

- Vérifier que Node.js 20+ est installé : `node --version`
- Vérifier que le port 3000 est libre
- Supprimer `node_modules` et refaire `npm install`

### Le frontend ne se connecte pas au backend

- Vérifier que le backend tourne sur http://localhost:3000
- Vérifier la configuration du proxy dans `frontend/vite.config.ts`

### Erreur "Mot de passe incorrect"

Le mot de passe par défaut est `MainCourante` (sensible à la casse).

### Les fichiers ne s'uploadent pas

- Vérifier que le dossier `backend/uploads/` existe
- Vérifier les permissions en écriture
- Vérifier la taille du fichier (max 50MB)

---

## Prochaines étapes

1. ✅ Personnaliser les prénoms de votre équipe
2. ✅ Créer vos catégories métier
3. ✅ Créer votre premier message
4. ✅ Tester les interactions (likes, commentaires)
5. 📚 Lire [ARCHITECTURE.md](./ARCHITECTURE.md) pour comprendre en détail
6. 🚀 Déployer en production

---

**Besoin d'aide ?** Consulter [README.md](./README.md) ou [ARCHITECTURE.md](./ARCHITECTURE.md)

**Mot de passe** : `MainCourante`
