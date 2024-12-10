# Projet API Badminton

Cette API permet de gérer un système de réservation pour des terrains de badminton. Elle inclut des fonctionnalités pour :
- Gérer les utilisateurs (authentification, rôles, création).
- Gérer les terrains (ajout, disponibilité).
- Gérer les réservations (création, suppression, validation).

---

## Table des matières
- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Conception](#conception)
- [Endpoints](#tableau-récapitulatif)
- [GraphQL](#graphql)


## Fonctionnalités

### Gestion des Réservations
- Création, suppression et visualisation des réservations.
- Validation des règles métier (horaires valides, créneaux disponibles, etc.).

### Gestion des Terrains
- Consultation de la liste des terrains.
- Modification de la disponibilité des terrains (réservé aux administrateurs).

### Gestion des Utilisateurs
- Création, authentification, modification et gestion des droits d'accès.

---

## Installation

### Pré-requis
- Node.js
- Docker
- Un fichier `.env` pour les variables d'environnement.

## Étapes

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

## Arreter les services
1. Stopper :
   ```bash
   docker compose down
   ```

## Documentation Swagger

1. Générer la documentation :
   ```bash
   docker exec -it projet-api-badminton-api npm run swagger-autogen
   ```
2. Accéder à la documentation Swagger :  
   [http://localhost:5001/doc](http://localhost:5001/doc)

A voir en fonction de votre choix dans le .env (HOST_PORT_API)


## Conception



### Dictionnaire de données


#### Table `User`
| **Nom du Champ** | **Type de Donnée** | **Taille/Format**           | **Contraintes**                | **Description**                  |
|-------------------|--------------------|------------------------------|---------------------------------|----------------------------------|
| `id_user`         | Integer           | 4 octets (32 bits)           | Primary key, auto-incrémentée  | Identifiant unique de l'utilisateur. |
| `pseudo`          | String            | 255 caractères               | Unique, non nul                | Pseudo de l'utilisateur.         |
| `password`        | String            | 128 caractères SHA 512       | Non nul                        | Mot de passe hashé de l'utilisateur. |
| `isAdmin`         | Boolean           | 1 bit                        | Non nul                        | Indique si l'utilisateur est administrateur. |

#### Table `Terrain`
| **Nom du Champ** | **Type de Donnée** | **Taille/Format**           | **Contraintes**                | **Description**                  |
|-------------------|--------------------|------------------------------|---------------------------------|----------------------------------|
| `id_terrain`      | Integer           | 4 octets (32 bits)           | Primary key, auto-incrémentée  | Identifiant unique du terrain.   |
| `name`            | String            | 255 caractères               | Unique, non nul                | Nom du terrain.                  | 
| `isAvailable`     | Boolean           | 1 bit                        | Non nul                        | Disponibilité du terrain.        |

#### Table `Reservation`
| **Nom du Champ**    | **Type de Donnée** | **Taille/Format**           | **Contraintes**                | **Description**                      |
|----------------------|--------------------|------------------------------|---------------------------------|--------------------------------------|
| `id_reservation`     | Integer           | 4 octets (32 bits)           | Primary key, auto-incrémentée  | Identifiant unique de la réservation. |
| `date`               | Date              | Format `YYYY-MM-DD`          | Non nul                        | Date de la réservation.              |
| `startTime`          | Time              | Format `HH:mm:ss`            | Non nul                        | Heure de début de la réservation.    |
| `endTime`            | Time              | Format `HH:mm:ss`            | Non nul                        | Heure de fin de la réservation.      |
| `createdAt`          | DateTime          | Format `YYYY-MM-DD HH:mm:ss` | Valeur par défaut : actuelle   | Date et heure de création de la réservation. |


---

#### Notes
- Les mots de passe sont stockés en utilisant l'algorithme SHA-512 pour garantir une meilleure sécurité.
- Les champs `pseudo` et `id_user` sont uniques afin de garantir l'intégrité des données.
- Le champ `isAdmin` est un indicateur pour distinguer les administrateurs des utilisateurs réguliers.

### Tableau récapitulatif

| **Ressource**      | **URL**                          | **Méthode HTTP**  | **Paramètres**                                 | **Description**                                  |
|---------------------|----------------------------------|-------------------|-----------------------------------------------|------------------------------------------------|
| **Home**            | `/api`                          | `GET`             | Aucun                                        | - Pour savoir si l'API est en marche             |
| **Utilisateurs**    | `/api/users`                    | `POST, GET`       | Aucun                                        | - **POST** : Créer un utilisateur. <br>- **GET** : Obtenir la liste des utilisateurs. |
| **Utilisateur**     | `/api/users/:id`                | `PUT`             | `id` : Identifiant de l'utilisateur          | Mettre à jour les informations d'un utilisateur. |
| **Terrains**        | `/api/terrains`                 | `GET`             | Aucun                                        | Obtenir la liste des terrains disponibles.      |
| **Terrain**         | `/api/terrains/:id`             | `GET`             | `id` : Identifiant du terrain                | Obtenir les détails d'un terrain spécifique.    |
| **Login**           | `/api/users/login`              | `POST`            | Aucun                                        | Authentifier un utilisateur.                    |
| **Disponibilité**   | `/api/terrains/:id/availability`| `PUT`             | `id` : Identifiant du terrain                | Modifier la disponibilité d'un terrain.         |
| **Réservations**    | `/api/reservations`             | `GET`             | Aucun                                        | Obtenir la liste des réservations.              |
| **Réservation**     | `/api/reservations`             | `POST`            | `terrainId` : ID du terrain, <br>`date` : Date (AAAA-MM-JJ), <br>`startTime` : Heure de début (HH:MM) | Créer une réservation.                          |
| **Réservation**     | `/api/reservations`             | `DELETE`            | `id` : ID de la réservation                | Supprimer une réservation.                      |

---

#### Notes
- Les actions sur les terrains sont accessibles à tous les utilisateurs sauf la modification de disponibilité, qui est réservée aux administrateurs.
- Les endpoints pour l'authentification et la création d'utilisateur doivent garantir la sécurité via des mécanismes comme le hachage des mots de passe et la gestion des sessions.
- Un utilisateur peut réserver seulement un terrain entre 10h et 22h du lundi au samedi. (Le créneau ne doit pas dépasser 22h)




#### GraphQL
```graphql
query GetAvailableSlots {
  availableSlots(date: "2024-11-27", terrain: "A") {
    time
    isAvailable
  }
}
```

