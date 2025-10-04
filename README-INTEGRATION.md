# 🚀 Guide d'intégration EL Bouch Auto

## Architecture du projet

Ce projet est composé de deux parties :
- **Frontend React/Vite** (port 8081) : Vitrine publique des produits
- **Backend Spring Boot** (port 8082) : API REST + Admin Thymeleaf

## 🔧 Configuration

### 1️⃣ Frontend (React/Vite)

**Fichier `.env` à la racine du projet :**
```env
VITE_API_BASE_URL=http://localhost:8082
VITE_USE_MOCK=false
```

**Démarrage :**
```bash
npm install
npm run dev
```

Le frontend sera accessible sur **http://localhost:8081**

### 2️⃣ Backend (Spring Boot)

**Démarrage :**
```bash
cd backend
mvn spring-boot:run
```

Le backend sera accessible sur **http://localhost:8082**

## 📡 Connexion temps réel (SSE)

Le frontend se connecte automatiquement au flux SSE du backend pour recevoir les mises à jour en temps réel.

**Comment ça marche :**

1. Un administrateur modifie un produit dans l'admin (http://localhost:8082/admin)
2. Le backend émet un événement SSE via `/api/v1/events/products`
3. Le frontend (http://localhost:8081) reçoit l'événement et rafraîchit automatiquement les données
4. Les visiteurs voient les changements **instantanément** sans recharger la page

**Types d'événements SSE :**
- `product.created` : Nouveau produit créé
- `product.updated` : Produit modifié
- `product.deleted` : Produit supprimé
- `image.updated` : Image ajoutée/modifiée

## 🔐 Accès Admin

**URL :** http://localhost:8082/admin

**Identifiants :**
- Email : `Elbouch@elbouch.com`
- Mot de passe : `Admin`

## 🎯 Fonctionnalités Admin

### Gestion des produits
- ✅ Créer, modifier, supprimer des produits
- ✅ Gérer la visibilité et les produits mis en avant
- ✅ Upload et gestion des images (définir image principale)
- ✅ Assigner catégories et tags
- ✅ Spécifications JSON personnalisées

### Gestion des catégories
- ✅ Créer, modifier, supprimer des catégories
- ✅ Support des catégories hiérarchiques (parent/enfant)

### Gestion des tags
- ✅ Créer, modifier, supprimer des tags
- ✅ Tags utilisés pour filtrer les produits

## 📚 API REST Publique

Base URL : `http://localhost:8082/api/v1`

### Endpoints disponibles

**Catégories :**
```
GET /api/v1/categories
```

**Produits :**
```
GET /api/v1/products
  ?search=texte          # Recherche textuelle
  &category=slug         # Filtrer par catégorie
  &tags=tag1,tag2        # Filtrer par tags
  &visible=1             # Produits visibles uniquement
  &featured=1            # Produits mis en avant
  &page=1                # Page (pagination)
  &per_page=12           # Nombre par page
```

**Produit par slug :**
```
GET /api/v1/products/{slug}
```

**Produits associés :**
```
GET /api/v1/products/{slug}/related
```

**Événements temps réel (SSE) :**
```
GET /api/v1/events/products
```

## 🧪 Documentation API (Swagger)

Accessible sur : **http://localhost:8082/swagger-ui.html**

## 🗄️ Base de données

**Mode développement :** H2 (fichier `./data/elbouch-db`)
**Mode production :** PostgreSQL (via variables d'environnement)

### Variables d'environnement pour la production

```env
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/elbouch
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=votre_mot_de_passe
```

## 🔄 Flux de travail

1. **Admin modifie un produit** → Backend émet événement SSE
2. **Frontend écoute via SSE** → Invalidation du cache React Query
3. **React Query refetch** → Nouvelles données affichées
4. **Visiteur voit le changement** → Instantanément !

## 📦 Structure du projet

```
/
├── backend/                    # Spring Boot
│   ├── src/main/java/          # Code Java
│   ├── src/main/resources/     # Resources
│   │   ├── templates/admin/    # Pages Thymeleaf admin
│   │   ├── static/             # CSS/JS admin
│   │   └── db/migration/       # Scripts Flyway
│   └── pom.xml                 # Dépendances Maven
│
├── src/                        # React Frontend
│   ├── components/             # Composants React
│   ├── pages/                  # Pages (Home, Product, etc.)
│   ├── hooks/                  # Hooks React (useProductEvents)
│   ├── lib/                    # API client
│   └── types/                  # Types TypeScript
│
├── .env                        # Config frontend
└── vite.config.ts              # Config Vite
```

## 🎨 Personnalisation

### CSS Admin
Fichier : `backend/src/main/resources/static/admin.css`

### Design System Frontend
Fichiers :
- `src/index.css` : Variables CSS globales
- `tailwind.config.ts` : Configuration Tailwind

## 🚨 Dépannage

### Le frontend ne se connecte pas au backend
- Vérifiez que le backend tourne sur le port 8082
- Vérifiez le fichier `.env` : `VITE_API_BASE_URL=http://localhost:8082`
- Vérifiez `VITE_USE_MOCK=false`

### Les événements SSE ne fonctionnent pas
- Ouvrez la console du navigateur (F12)
- Cherchez les logs `[SSE]`
- Vérifiez que le backend est accessible

### Erreurs CORS
- Vérifiez `CorsConfig.java` : `http://localhost:8081` doit être autorisé
- Redémarrez le backend après modification

## 📞 Support

Pour toute question, consultez :
- **Backend README** : `backend/README.md`
- **Swagger UI** : http://localhost:8082/swagger-ui.html
- **Logs backend** : Visible dans la console Maven

---

**Bon développement ! 🚀**
