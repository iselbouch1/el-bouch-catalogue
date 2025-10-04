# EL Bouch Auto - Catalogue d'Accessoires Automobiles

Site vitrine/catalogue complet pour accessoires et décorations automobiles, sans système de panier ou paiement.

## 🚀 Démarrage rapide

### Installation

```bash
npm install
```

### Lancement en développement

```bash
npm run dev
```

L'application sera accessible sur `http://localhost:8080`

### Build de production

```bash
npm run build
npm run start
```

## 📁 Structure du projet

```
/public
  /images              # 24+ images de produits automobiles
/data/local
  categories.json      # 6 catégories de produits
  products.json        # 23 produits avec specs complètes
/src
  /components          # Composants réutilisables
    Header.tsx         # Navigation + recherche
    Footer.tsx
    ProductCard.tsx    # Carte produit
    ProductSkeleton.tsx
    Filters.tsx        # Filtres par catégorie/tags
    ImageGallery.tsx   # Galerie avec zoom
    Layout.tsx
  /pages
    Home.tsx           # Hero + Nouveautés + Catégories
    CategoryPage.tsx   # Liste avec filtres + tri
    ProductPage.tsx    # Détail + galerie + produits associés
    SearchPage.tsx     # Recherche globale
    NotFound.tsx       # 404 personnalisée
  /lib
    api.ts             # Adaptateur API/Mock
  /types
    index.ts           # Types TypeScript
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine (voir `.env.example`) :

```env
# Mode mock (true) ou API externe (false)
VITE_USE_MOCK=true

# URL de l'API REST (si USE_MOCK=false)
VITE_API_BASE_URL=""
```

### Basculer entre Mock et API

**Mode Mock (par défaut)** : Les données sont chargées depuis `/data/local/*.json`

**Mode API** : 
1. Définissez `VITE_USE_MOCK=false`
2. Configurez `VITE_API_BASE_URL` avec l'URL de votre API
3. L'API doit exposer :
   - `GET /api/v1/categories`
   - `GET /api/v1/products` (avec params : search, category, tags, visible, featured, page, per_page)
   - `GET /api/v1/products/{slug}`

## 🎨 Fonctionnalités

### Pages

- **Accueil** : Hero, produits nouveautés (featured), grille de catégories
- **Catégorie** : Liste avec filtres latéraux (catégories, tags), tri (alphabétique, récent), pagination
- **Produit** : Galerie d'images avec zoom, description, caractéristiques, tags, partage, produits associés
- **Recherche** : Recherche globale sur nom + tags
- **404** : Page d'erreur avec recherche et retour accueil

### UX/Accessibilité

- Responsive mobile-first
- Navigation clavier complète
- Alt text sur toutes les images
- Skeletons de chargement
- Micro-interactions (hover, focus)
- Transitions fluides

### SEO

- Meta tags par page (title, description)
- Open Graph configuré
- Sitemap `/public/sitemap.xml`
- Robots.txt présent
- Images lazy-load
- Structure sémantique HTML5

## 🏗️ Technologies

- **React 18** + TypeScript
- **Vite** pour le build
- **React Router** pour le routing
- **Tailwind CSS** avec design system personnalisé
- **Shadcn UI** pour les composants
- **Lucide React** pour les icônes

## 📊 Données

### Catégories (6)

1. Éclairage
2. Jantes & Enjoliveurs
3. Sièges & Housses
4. Volants & Commandes
5. Carrosserie & Stickers
6. Intérieur & Rangement

### Produits (23)

Chaque produit contient :
- Images (avec cover)
- Description courte/longue
- Catégories liées
- Tags (couleur, matière, style)
- Specs techniques
- Flags `isVisible` et `isFeatured`

## 🧪 Tests

```bash
npm run test
```

Un test basique de rendu de la liste de produits est inclus.

## 📦 Scripts disponibles

- `npm run dev` : Serveur de développement
- `npm run build` : Build de production
- `npm run preview` : Prévisualiser le build
- `npm run lint` : Linter ESLint
- `npm run test` : Lancer les tests

## 🌐 Déploiement

Le site peut être déployé sur n'importe quel hébergeur statique :
- Netlify
- Vercel
- GitHub Pages
- etc.

Assurez-vous de configurer les redirections pour le routing côté client (SPA).

## 📄 Licence

Projet personnel © 2025 EL Bouch Auto

---

**Note** : Ce catalogue est conçu sans système de prix, panier ou paiement. Pour ajouter ces fonctionnalités, il faudra intégrer un backend et un système de e-commerce.
