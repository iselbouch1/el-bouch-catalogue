# EL Bouch Auto Backend

Backend Spring Boot (Java 21, Maven) pour EL Bouch Auto.

## Prérequis
- Java 21
- Maven 3.9+

## Lancement (dev)

```bash
mvn spring-boot:run
```

- Backend: http://localhost:8082
- Admin: http://localhost:8082/admin (email: `Elbouch@elbouch.com` / mot de passe: `Admin`)
- Swagger UI: http://localhost:8082/swagger-ui.html

## Configuration
- Port: 8082
- CORS: autorise http://localhost:8080
- Uploads: dossier configurable via `application.yml` (par défaut `./uploads`)
- Profils: `dev` (H2 file) / `prod` (PostgreSQL via variables d'environnement)

## Variables d'environnement (prod)
- `SPRING_DATASOURCE_URL` (ex: jdbc:postgresql://host:5432/db)
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`

## Fonctionnalités
- API REST versionnée `/api/v1`
- SSE: `/api/v1/events/products`
- Admin `/admin` (Thymeleaf + Security)
- CRUD Produits / Catégories / Tags / Images
- Upload d'images vers `uploads/` servi par `/files/**`
- Migrations Flyway (V1__init.sql), seed dev via DataLoader
