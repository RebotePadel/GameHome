# GameHome - Main Courante Digitale

Application web interne pour Game Parc permettant la gestion et le suivi des messages de main courante.

C'est la main courante, le livre interne de l'entreprise. Un outil pour faire passer les infos, et être sûr qu'elles sont lues par tous.

## 📋 Fonctionnalités

- **Mur de messages** : Affichage de tous les messages en temps réel
- **Catégories** : Organisation par tags (Sécurité, Maintenance, Événements, RH, etc.)
- **Interactions** :
  - Likes avec sélection de prénom
  - Commentaires
  - Like groupé sur plusieurs messages
- **Pièces jointes** : Support images, vidéos, PDFs
- **Paramètres** : Gestion CRUD des prénoms et catégories
- **Mobile-first** : Interface responsive optimisée mobile

## 🏗️ Architecture

- **Frontend** : React 18 + TypeScript + Vite + TailwindCSS
- **Backend** : Node.js + Express + TypeScript
- **Stockage** : Fichiers JSON (simple, pas de BDD)
- **Fichiers** : Système de fichiers local

Voir [ARCHITECTURE.md](./ARCHITECTURE.md) pour les détails complets.

## 🚀 Installation

### Prérequis

- Node.js 20+ (LTS)
- npm ou yarn

### Backend

```bash
cd backend
npm install
npm run dev
```

Le serveur démarre sur http://localhost:3000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

L'application démarre sur http://localhost:5173

## 📖 Utilisation

### Publier un message

1. Cliquer sur "Nouvelle main courante"
2. Entrer le mot de passe : `MainCourante`
3. Remplir le formulaire :
   - Sélectionner l'auteur (prénom)
   - Écrire le message
   - Sélectionner au moins 1 catégorie
   - (Optionnel) Ajouter des fichiers
4. Cliquer sur "Publier"

### Liker un message

1. Cliquer sur le bouton ❤️
2. Sélectionner un prénom
3. Le like est ajouté instantanément

### Commenter

1. Cliquer sur le bouton 💬
2. Sélectionner un prénom
3. Écrire le commentaire
4. Cliquer sur "Envoyer"

### Like groupé

1. Cocher plusieurs messages
2. Cliquer sur "Liker"
3. Sélectionner un prénom
4. Tous les messages sélectionnés sont likés

### Gérer les prénoms et catégories

1. Aller dans "Paramètres"
2. **Onglet Prénoms** :
   - Ajouter : entrer un nom et cliquer "Ajouter"
   - Modifier : cliquer sur ✏️, modifier, "Enregistrer"
   - Désactiver : cliquer sur "Désactiver" (soft delete)
3. **Onglet Catégories** :
   - Ajouter : entrer nom + couleur, cliquer "Ajouter"
   - Modifier : cliquer sur ✏️, modifier, "Enregistrer"
   - Supprimer : cliquer sur 🗑️ (impossible si messages associés)

## 🔐 Sécurité

- Mot de passe de publication : `MainCourante` (hardcodé, configurable dans le code)
- Pas de système de comptes utilisateurs (app interne)
- Rate limiting : 100 requêtes / 15 min par IP
- Validation des fichiers uploadés
- CORS configuré

## 📁 Structure du projet

```
GameHome/
├── backend/          # API Express + TypeScript
│   ├── src/
│   │   ├── routes/   # Routes API
│   │   ├── services/ # Logique métier
│   │   ├── types/    # Types TypeScript
│   │   └── server.ts # Point d'entrée
│   ├── data/         # Fichiers JSON (données)
│   └── uploads/      # Fichiers uploadés
├── frontend/         # React + TypeScript + Vite
│   └── src/
│       ├── components/  # Composants React
│       ├── pages/       # Pages (Wall, Category, Settings)
│       ├── store/       # Zustand store
│       └── services/    # API client
├── ARCHITECTURE.md   # Documentation architecture
└── README.md         # Ce fichier
```

## 🛠️ Développement

### Backend

```bash
cd backend
npm run dev      # Démarre en mode watch
npm run build    # Build TypeScript
npm start        # Démarre en production
npm run lint     # ESLint
npm run format   # Prettier
```

### Frontend

```bash
cd frontend
npm run dev      # Démarre Vite dev server
npm run build    # Build pour production
npm run preview  # Preview du build
npm run lint     # ESLint
npm run format   # Prettier
```

## 🚢 Déploiement

### Production simple

1. Build le frontend :
   ```bash
   cd frontend
   npm run build
   ```

2. Démarrer le backend (qui sert aussi le frontend) :
   ```bash
   cd backend
   npm run build
   npm start
   ```

3. Accéder à http://localhost:3000

### Docker (optionnel)

Voir [ARCHITECTURE.md](./ARCHITECTURE.md) pour le Dockerfile.

## 📊 Données

Les données sont stockées dans `backend/data/` :

- `messages.json` : Tous les messages
- `tags.json` : Catégories
- `prenoms.json` : Prénoms
- `config.json` : Configuration app

**Backup** : Copier simplement le dossier `data/` et `uploads/`

## 🎨 Personnalisation

### Changer le mot de passe

Modifier dans `backend/src/services/auth.service.ts` :

```typescript
private readonly PUBLISH_PASSWORD = 'VotreNouveauMotDePasse';
```

### Ajouter des tags par défaut

Modifier dans `backend/src/services/storage.service.ts` :

```typescript
async initializeDefaultData()
```

### Thème / Couleurs

Modifier dans `frontend/src/index.css` les variables CSS.

## 🤝 Support

Pour toute question ou problème :

1. Consulter [ARCHITECTURE.md](./ARCHITECTURE.md)
2. Vérifier les logs du serveur
3. Vérifier la console du navigateur

## 📝 Licence

MIT

---

**Créé pour Game Parc** - Main courante digitale interne
**Version** : 1.0.0
**Date** : 2026-01-07
