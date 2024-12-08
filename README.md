
# Badminton Reservation API

Mettre explication projet

## Fonctionnalités

Mettre résumé des features

## Installation

1. Clone le repo :
   ```bash
   git clone <url>
   ```
2. Copier le .env.dist et changer le .env si besoin :
   ```bash
   cp .env.dist .env
   ```
3. Lancer le Docker :
   ```bash
   docker compose watch
   ```
4. Tester connexion :
   ```bash
   curl.exe -i http://localhost:5001
   ```
## Swagger
1. Swagger :
   ```bash
   docker exec -it projet-api-badminton-api npm run swagger-autogen
   ```
## Stopper
1. Stopper :
   ```bash
   docker compose down
   ```

## Conception

### Dictionnaire des données

| **Nom du Champ** | **Type de Donnée** | **Taille/Format**           | **Contraintes**                | **Description**                  |
|-------------------|--------------------|------------------------------|---------------------------------|----------------------------------|
| `id_user`         | Integer           | 4 octets (32 bits)           | Primary key, auto-incrémentée  | Identifiant unique de l'utilisateur. |
| `pseudo`          | String            | 255 caractères               | Unique, non nul                | Pseudo de l'utilisateur.         |
| `password`        | String            | 128 caractères SHA 512       | Non nul                        | Mot de passe hashé de l'utilisateur. |
| `isAdmin`         | Boolean           | 1 bit                        | Non nul                        | Indique si l'utilisateur est administrateur. |
| `id_terrain`      | Integer           | 4 octets (32 bits)           | Primary key, auto-incrémentée  | Identifiant unique du terrain.   |

---

#### Notes
- Les mots de passe sont stockés en utilisant l'algorithme SHA-512 pour garantir une meilleure sécurité.
- Les champs `pseudo` et `id_user` sont uniques afin de garantir l'intégrité des données.
- Le champ `isAdmin` est un indicateur pour distinguer les administrateurs des utilisateurs réguliers.

### Tableau récapitulatif

| **Ressource**      | **URL**                          | **Méthodes HTTP**  | **Paramètres d’URL**           | **Commentaire**                                  |
|---------------------|----------------------------------|--------------------|---------------------------------|------------------------------------------------|
| `Users`            | `/api/users`                    | `POST, GET`       | Aucun                          | Création d'un utilisateur / Liste des utilisateurs. |
| `Terrains`         | `/api/terrains`                 | `GET`             | Aucun                          | Liste des terrains disponibles.                |
| `Terrains`         | `/api/terrains/:id`             | `GET`             | `id` : Identifiant du terrain  | Détail d'un terrain spécifique.                |
| `Login`            | `/api/users/login`              | `POST`            | Aucun                          | Authentification de l'utilisateur.             |
| `Terrains dispo`   | `/api/terrains/:id/availability`| `PUT`             | `id` : Identifiant du terrain  | Modifier la disponibilité d'un terrain.        |

---

#### Notes
- Les actions sur les terrains sont accessibles à tous les utilisateurs sauf la modification de disponibilité, qui est réservée aux administrateurs.
- Les endpoints pour l'authentification et la création d'utilisateur doivent garantir la sécurité via des mécanismes comme le hachage des mots de passe et la gestion des sessions.


## API Documentation



#### GraphQL
```graphql
query GetAvailableSlots {
  availableSlots(date: "2024-11-27", terrain: "A") {
    time
    isAvailable
  }
}
```

