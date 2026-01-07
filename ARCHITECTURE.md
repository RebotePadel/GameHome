# 🏗️ Architecture GameHome - Main Courante Digitale

## 📋 Vue d'ensemble

Application web interne de type "logbook" pour Game Parc, permettant la publication et le suivi de messages internes sans système de comptes utilisateurs.

---

## 🎯 ÉTAPE 1 – Architecture & Stack Technique

### Architecture Globale

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (SPA)                       │
│              React 18 + TypeScript + Vite               │
│           TailwindCSS + shadcn/ui components            │
└─────────────────────┬───────────────────────────────────┘
                      │ REST API (JSON)
┌─────────────────────▼───────────────────────────────────┐
│                   BACKEND (API REST)                    │
│              Node.js + Express + TypeScript             │
│                                                          │
│  ┌─────────────────┐    ┌──────────────────────────┐   │
│  │  API Routes     │    │   File Storage           │   │
│  │  - Messages     │    │   - Images               │   │
│  │  - Tags         │    │   - Videos               │   │
│  │  - Prénoms      │    │   - PDFs                 │   │
│  │  - Likes        │    │   (uploads/)             │   │
│  │  - Comments     │    └──────────────────────────┘   │
│  └─────────────────┘                                    │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Data Storage (JSON Files)               │   │
│  │  - data/messages.json                            │   │
│  │  - data/tags.json                                │   │
│  │  - data/prenoms.json                             │   │
│  │  - data/config.json                              │   │
│  └──────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### Stack Technique

#### Frontend
- **Framework**: React 18 avec TypeScript
- **Build Tool**: Vite (rapide, moderne, HMR)
- **Styling**: TailwindCSS (utility-first, responsive facile)
- **Components UI**: shadcn/ui (composants réutilisables, accessibles)
- **State Management**: Zustand (simple, léger)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Date formatting**: date-fns

#### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: Express.js (simple, robuste)
- **Language**: TypeScript
- **File Upload**: Multer
- **CORS**: cors middleware
- **Validation**: Zod
- **Password**: bcrypt (pour le mot de passe de publication)

#### Stockage
- **Database**: Fichiers JSON (simplicité, pas de BDD complexe)
- **Files**: Système de fichiers local (`uploads/`)
- **Structure**:
  ```
  data/
    ├── messages.json
    ├── tags.json
    ├── prenoms.json
    └── config.json
  uploads/
    ├── images/
    ├── videos/
    └── documents/
  ```

### Justification des choix

✅ **Pourquoi React + TypeScript ?**
- Application moderne, maintenable
- TypeScript apporte la sûreté de type
- Grande communauté, nombreuses ressources

✅ **Pourquoi Vite ?**
- Build ultra-rapide
- HMR instantané
- Configuration minimale

✅ **Pourquoi TailwindCSS ?**
- Responsive facile (mobile-first)
- Pas de fichiers CSS à gérer
- Design system cohérent

✅ **Pourquoi Express + JSON Files ?**
- Simplicité (pas besoin de BDD complexe)
- Déploiement facile
- Backup simple (copie de fichiers)
- Pas de setup SQL/MongoDB
- Performant pour un usage interne

✅ **Pourquoi pas de système de comptes ?**
- Besoin exprimé : app interne simple
- Authentification via prénoms prédéfinis
- Sécurité minimale (mot de passe pour publier uniquement)

---

## 🗄️ ÉTAPE 2 – Modèle de Données

### Entities

#### Message
```typescript
interface Message {
  id: string;                    // UUID v4
  content: string;               // Texte du message
  tags: string[];                // IDs des tags associés
  attachments: Attachment[];     // Fichiers joints
  author: string;                // Prénom de l'auteur
  createdAt: string;             // ISO 8601 date
  updatedAt: string;             // ISO 8601 date
  likes: Like[];                 // Likes sur le message
  comments: Comment[];           // Commentaires
}
```

#### Tag
```typescript
interface Tag {
  id: string;                    // UUID v4
  name: string;                  // Nom de la catégorie
  color: string;                 // Couleur hex (#FF5733)
  order: number;                 // Ordre d'affichage
  createdAt: string;
  updatedAt: string;
}
```

#### Prénom
```typescript
interface Prenom {
  id: string;                    // UUID v4
  name: string;                  // Prénom
  active: boolean;               // Actif ou non
  createdAt: string;
  updatedAt: string;
}
```

#### Like
```typescript
interface Like {
  id: string;                    // UUID v4
  prenomId: string;              // Référence au prénom
  messageId: string;             // Référence au message
  createdAt: string;
}
```

#### Comment
```typescript
interface Comment {
  id: string;                    // UUID v4
  messageId: string;             // Référence au message
  prenomId: string;              // Référence au prénom
  content: string;               // Texte du commentaire
  createdAt: string;
}
```

#### Attachment
```typescript
interface Attachment {
  id: string;                    // UUID v4
  filename: string;              // Nom original
  filepath: string;              // Chemin relatif
  mimetype: string;              // Type MIME
  size: number;                  // Taille en bytes
  type: 'image' | 'video' | 'document';
  createdAt: string;
}
```

### Relations

```
Message 1──────* Tag         (un message a plusieurs tags)
Message 1──────* Attachment  (un message a plusieurs pièces jointes)
Message 1──────* Like        (un message a plusieurs likes)
Message 1──────* Comment     (un message a plusieurs commentaires)
Like    *──────1 Prénom      (un like est lié à un prénom)
Comment *──────1 Prénom      (un commentaire est lié à un prénom)
```

### Contraintes métier

1. **Multi-tags**: Un message peut avoir plusieurs tags
2. **Affichage multi-pages**: Un message apparaît dans toutes les pages de ses tags
3. **Like unique**: Un prénom ne peut liker qu'une fois le même message
4. **Liste fermée**: Les prénoms sont prédéfinis (pas d'inscription libre)

---

## 📱 ÉTAPE 3 – Navigation & Pages

### Structure de navigation

```
┌─────────────────────────────────────────────────────────┐
│  SIDEBAR                     CONTENU PRINCIPAL           │
│                                                           │
│  🏠 Mur                      [Page dynamique]            │
│  ─────────────                                           │
│  📁 Catégories:                                          │
│    • Sécurité                                            │
│    • Maintenance                                         │
│    • Événements                                          │
│    • RH                                                  │
│  ─────────────                                           │
│  ⚙️  Paramètres                                          │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Pages

#### 1. Mur (`/`)
- **Rôle**: Vue d'ensemble de tous les messages
- **Contenu**:
  - Bouton "➕ Nouvelle main courante" (en haut)
  - Liste de tous les messages (tri anti-chronologique)
  - Filtres rapides par tags
- **Actions**:
  - Like / Commentaire
  - Sélection multiple pour like groupé

#### 2. Page Catégorie (`/category/:tagId`)
- **Rôle**: Messages filtrés par tag
- **Contenu**:
  - Titre de la catégorie
  - Messages contenant ce tag uniquement
  - Même interface que le Mur

#### 3. Page Paramètres (`/settings`)
- **Rôle**: Administration des prénoms et tags
- **Contenu**:
  - **Onglet Prénoms**:
    - Liste des prénoms
    - CRUD: Ajouter, Modifier, Désactiver
    - Impact immédiat sur les sélecteurs
  - **Onglet Tags**:
    - Liste des tags (ordre personnalisable)
    - CRUD: Ajouter, Modifier, Supprimer, Réorganiser
    - Sélecteur de couleur
    - Impact immédiat sur sidebar et filtres

### Sidebar

```
┌──────────────────┐
│ 🏠 Mur          │ ← Lien vers /
├──────────────────┤
│ CATÉGORIES       │
│ • Tag 1          │ ← Lien vers /category/tag1
│ • Tag 2          │
│ • Tag 3          │
│ ...              │
├──────────────────┤
│ ⚙️ Paramètres    │ ← Lien vers /settings
└──────────────────┘
```

---

## ✍️ ÉTAPE 4 – Publication d'un Message

### Flow de publication

```
[Bouton "Nouvelle main courante"]
          ↓
[Modal de mot de passe] → Vérification "MainCourante"
          ↓
[Formulaire de publication]
  ├── Textarea (texte)
  ├── Multi-select (tags)
  └── Upload fichiers (images, vidéos, PDFs)
          ↓
[Validation + Enregistrement]
          ↓
[Affichage immédiat sur le Mur]
```

### Formulaire

```typescript
interface NewMessageForm {
  content: string;              // Required, min 10 chars
  tagIds: string[];             // Required, min 1 tag
  files: File[];                // Optional, max 10 files, max 50MB total
}
```

### Contraintes

- **Mot de passe**: `MainCourante` (hardcodé pour simplifier)
- **Validation**:
  - Contenu: min 10 caractères
  - Tags: au moins 1 tag sélectionné
  - Fichiers:
    - Images: JPG, PNG, GIF (max 10MB/fichier)
    - Vidéos: MP4, MOV (max 50MB/fichier)
    - Documents: PDF (max 10MB/fichier)

### Stockage

1. **Fichiers**:
   - Upload dans `uploads/YYYY-MM-DD/`
   - Renommage avec UUID pour éviter collisions

2. **Message**:
   - Ajout dans `data/messages.json`
   - Auteur: "Système" (ou nom configuré)
   - Date: timestamp actuel

---

## 💬 ÉTAPE 5 – Interactions

### Likes

#### Flow individuel
```
[Message] → [Bouton ❤️] → [Sélection prénom] → [Enregistrement]
                                    ↓
                        [Affichage des prénoms ayant liké]
```

#### Contraintes
- Un prénom ne peut liker qu'une fois le même message
- Affichage: "❤️ Jean, Marie, Pierre (3)"
- Possibilité de unliker

#### Flow groupé (multi-sélection)
```
[Sélection de 3 messages]
          ↓
[Bouton "❤️ Liker la sélection"]
          ↓
[Sélection du prénom UNE SEULE FOIS]
          ↓
[Like appliqué sur les 3 messages]
```

### Commentaires

#### Structure
```
┌─────────────────────────────────────────────┐
│ Message principal                           │
├─────────────────────────────────────────────┤
│ 💬 Commentaires (2)                         │
│                                              │
│ 👤 Jean - 12/01/2026 14:30                  │
│ "Super info, merci !"                       │
│                                              │
│ 👤 Marie - 12/01/2026 15:45                 │
│ "À noter pour demain"                       │
│                                              │
│ [Ajouter un commentaire...]                 │
│ [Sélectionner prénom ▼] [Envoyer]          │
└─────────────────────────────────────────────┘
```

#### Flow
1. Clic sur "💬 Commenter"
2. Sélection du prénom (dropdown)
3. Saisie du texte
4. Enregistrement avec date/heure
5. Affichage immédiat sous le message

---

## ⚙️ ÉTAPE 6 – Paramètres

### Onglet Prénoms

#### Interface
```
┌──────────────────────────────────────────────┐
│ PRÉNOMS                                       │
├──────────────────────────────────────────────┤
│ [+ Ajouter un prénom]                        │
│                                               │
│ ✅ Jean          [✏️ Modifier] [🗑️ Désactiver]│
│ ✅ Marie         [✏️ Modifier] [🗑️ Désactiver]│
│ ✅ Pierre        [✏️ Modifier] [🗑️ Désactiver]│
│ ❌ Sophie        [✏️ Modifier] [✅ Activer]    │
└──────────────────────────────────────────────┘
```

#### Actions CRUD
- **Create**: Modal avec champ "Nom"
- **Read**: Liste affichée
- **Update**: Modal de modification
- **Delete**: Désactivation (soft delete) pour garder l'historique

#### Impact
- Mise à jour immédiate des dropdowns de sélection
- Les prénoms désactivés n'apparaissent plus dans les sélecteurs
- Historique conservé (likes/comments passés restent visibles)

### Onglet Tags

#### Interface
```
┌──────────────────────────────────────────────┐
│ TAGS / CATÉGORIES                             │
├──────────────────────────────────────────────┤
│ [+ Ajouter un tag]                           │
│                                               │
│ ⬍ 🟥 Sécurité       [✏️] [🗑️]               │
│ ⬍ 🟦 Maintenance    [✏️] [🗑️]               │
│ ⬍ 🟩 Événements     [✏️] [🗑️]               │
│ ⬍ 🟨 RH             [✏️] [🗑️]               │
└──────────────────────────────────────────────┘
```

#### Actions CRUD
- **Create**: Modal avec nom + couleur
- **Read**: Liste affichée avec drag-and-drop
- **Update**: Modal de modification
- **Delete**: Suppression (avec confirmation si messages associés)
- **Reorder**: Drag-and-drop pour changer l'ordre

#### Impact
- Mise à jour immédiate de la sidebar
- Mise à jour des filtres sur le Mur
- Réorganisation de l'ordre d'affichage

---

## 🎨 ÉTAPE 7 – UX & Bonnes Pratiques

### Principes UX

#### Mobile First
- Design responsive dès le départ
- Breakpoints:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- Touch-friendly (boutons min 44x44px)
- Swipe pour actions (optional)

#### Lecture Rapide
- Typographie claire (16px minimum)
- Hiérarchie visuelle forte
- Badges de tags colorés
- Dates relatives ("il y a 2h", "hier")

#### Actions Rapides (1-2 clics max)
- Like: 1 clic (sélection prénom) + 1 clic (valider)
- Commentaire: 1 clic (ouvrir) + sélection + saisie + 1 clic (envoyer)
- Nouvelle main courante: 1 clic (bouton) + saisie mot de passe + formulaire

#### Feedback Visuel
- Animations subtiles (hover, click)
- Toasts de confirmation:
  - "✅ Message publié"
  - "❤️ Like ajouté"
  - "💬 Commentaire publié"
- Loading states clairs

#### Design
- Interface sobre et professionnelle
- Palette de couleurs cohérente
- Pas de distractions
- Focus sur le contenu

### Bonnes Pratiques Code

#### Frontend
- Composants réutilisables
- Hooks personnalisés
- TypeScript strict
- ESLint + Prettier
- Tests unitaires (Vitest)

#### Backend
- Validation des entrées (Zod)
- Gestion d'erreurs robuste
- Logs structurés
- Rate limiting (protection)
- CORS configuré

#### Performance
- Lazy loading des images
- Pagination des messages (infinite scroll)
- Debounce sur recherche
- Cache des données fréquentes

#### Sécurité
- Validation fichiers uploadés
- Sanitization des inputs
- Protection CSRF
- Limite de taille des uploads
- Pas d'injection possible

---

## 📦 Structure du Projet

```
GameHome/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── messages.ts
│   │   │   ├── tags.ts
│   │   │   ├── prenoms.ts
│   │   │   ├── likes.ts
│   │   │   └── comments.ts
│   │   ├── services/
│   │   │   ├── storage.service.ts
│   │   │   ├── file.service.ts
│   │   │   └── auth.service.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── upload.ts
│   │   │   └── validation.ts
│   │   └── server.ts
│   ├── data/
│   │   ├── messages.json
│   │   ├── tags.json
│   │   ├── prenoms.json
│   │   └── config.json
│   ├── uploads/
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           (shadcn components)
│   │   │   ├── Message.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── NewMessageModal.tsx
│   │   │   ├── LikeButton.tsx
│   │   │   └── CommentSection.tsx
│   │   ├── pages/
│   │   │   ├── Wall.tsx
│   │   │   ├── Category.tsx
│   │   │   └── Settings.tsx
│   │   ├── store/
│   │   │   └── useStore.ts
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
├── README.md
├── ARCHITECTURE.md
└── .gitignore
```

---

## 🚀 Déploiement

### Développement
```bash
# Backend
cd backend
npm install
npm run dev  # Port 3000

# Frontend
cd frontend
npm install
npm run dev  # Port 5173
```

### Production
```bash
# Build frontend
cd frontend
npm run build

# Servir via backend
cd backend
npm run build
npm start
```

### Alternative: Docker
```dockerfile
# Dockerfile simple
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📊 Évolutions Futures

- Export Excel des messages
- Recherche full-text
- Notifications push
- Mode hors-ligne (PWA)
- Statistiques d'usage
- Archivage automatique
- Multi-entreprises

---

**Document créé le**: 2026-01-07
**Auteur**: Architecture GameHome
**Version**: 1.0
