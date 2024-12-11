# Projet API Badminton

Cette API permet de gérer un système de réservation pour des terrains de badminton. <br>
Elle inclut des fonctionnalités pour :
- Gérer les utilisateurs (authentification, rôles, création).
- Gérer les terrains (ajout, disponibilité).
- Gérer les réservations (création, suppression, validation).

Un jeu de données est directement inséré dans la base de données MySQL, disponible dans `api/seeder/seed_initial_data.js`.

---

## Table des matières
- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Conception](#conception)
- [Sécurité](#sécurité)
- [Endpoints](#tableau-récapitulatif)
- [GraphQL](#graphql)


## Fonctionnalités

- Un utilisateur peut créer un utilisateur, modifier son mot de passe, son pseudo, peut s'authentifier et avoir la liste des utilisateurs.
- Un utilisateur ne peut pas modifier les mots de passes et pseudos des autres, alors qu'un admin si.
- Un utilisateur peut récupérer la liste des réservations, créer une réservation, et supprimer ses réservations, alors qu'un admin peut supprimer les réservations de n'importe qui.
- Un admin peut mettre à jour la disponibilité d'un terrain.

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

Un fichier .json est disponible avec le nom de `swagger_output.json`, qui sert comme exemple, mais ne sert pas dans le projet.

> **Remarque :** Le port (`5001`) peut varier en fonction de la configuration dans votre fichier `.env` via la variable `HOST_PORT_API`. 

## Adminer

1. Accéder à l'adminer :
   [http://localhost:5003](http://localhost:5003)

> **Remarque :** Le port (`5003`) peut varier en fonction de la configuration dans votre fichier `.env` via la variable `HOST_PORT_ADMINER`. 


## Conception


### Dictionnaire de données


#### Table `User`
| **Nom du Champ** | **Type de Donnée** | **Taille/Format**           | **Contraintes**                | **Description**                  |
|-------------------|--------------------|------------------------------|---------------------------------|----------------------------------|
| `id_user`         | Integer           | 4 octets (32 bits)           | Primary key, auto-incrémentée  | Identifiant unique de l'utilisateur. |
| `pseudo`          | String            | 255 caractères               | Unique, non nul , Taille [3:50]               | Pseudo de l'utilisateur.         |
| `password`        | String            | 128 caractères SHA 512       | Non nul Taille [6:50]                        | Mot de passe hashé de l'utilisateur. |
| `isAdmin`         | Boolean           | 1 bit                        | Non nul                        | Indique si l'utilisateur est administrateur. |

#### Table `Terrain`
| **Nom du Champ** | **Type de Donnée** | **Taille/Format**           | **Contraintes**                | **Description**                  |
|-------------------|--------------------|------------------------------|---------------------------------|----------------------------------|
| `id_terrain`      | Integer           | 4 octets (32 bits)           | Primary key, auto-incrémentée  | Identifiant unique du terrain.   |
| `name`            | String            | 255 caractères               | Unique, non nul, Taille [1:10] | Nom du terrain.                  | 
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
| **Utilisateur**     | `/api/users/:id/pseudo`                | `PUT`             | `id` : Identifiant de l'utilisateur          | Mettre à jour le pseudo d'un utilisateur. |
| **Utilisateur**     | `/api/users/:id/password`                | `PUT`             | `id` : Identifiant de l'utilisateur          | Mettre à jour le mot de passe d'un utilisateur |
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


---

### Sécurité

- Lorsqu'un utilisateur tente de se connecter trop de fois (10 tentatives), il est bloqué pendant 15 minutes, empêchant ainsi les attaques par force brute grâce à `express-rate-limit`.
- À chaque connexion, l'utilisateur se voit attribuer un token JWT qui permet de l'identifier dans l'API à chacune de ses requêtes.
- Le token JWT est enregistré dans l'onglet Authorization Bearer du header de chaque requête.
- Sur chaque route est branché un middleware qui contrôle la connexion de l'utilisateur en vérifiant le token via le `JWT_SECRET` stocké dans le fichier d'environnement de l'API. Sur les routes nécessitant un compte administrateur, un middleware spécifique a également été prévu.


---

## Cas nominal : Réserver un terrain de badminton

### Accéder à Swagger UI
1. Ouvrez [http://localhost:5001/doc](http://localhost:5001/doc) dans votre navigateur.
2. Cette interface liste tous les endpoints disponibles, avec des descriptions et des options pour tester directement les requêtes.

> **Remarque :** Le port (`5001`) peut varier en fonction de la configuration dans votre fichier `.env` via la variable `HOST_PORT_API`. 

---

### Étapes principales

#### 1. Créer un utilisateur
- Allez à l’endpoint **`POST /api/users`** dans Swagger.
- Cliquez sur **"Try it out"**, puis remplissez les champs requis avec un pseudo et un mot de passe.
- Exemple de corps de requête :
  ```json
  {
    "pseudo": "joueur1",
    "password": "P4$sw0rd!"
  }

#### 2. Se connecter et récupérer un token
- Allez à l’endpoint **`POST /api/users/login`** dans Swagger.
- Cliquez sur **"Try it out"**, puis remplissez les champs requis avec votre pseudo et mot de passe.
- Exemple de corps de requête :
  ```json
  {
    "pseudo": "joueur1",
    "password": "P4$sw0rd!"
  }
- Une fois la requête exécutée, un token JWT sera généré dans la réponse.
- Copiez ce token, il sera nécessaire pour autoriser vos requêtes aux autres endpoints.

#### 3. Ajouter le token JWT
- Dans Swagger, cliquez sur le bouton **"Authorize"** situé en haut à droite de l’interface.
- Une fenêtre apparaîtra pour entrer le token d’autorisation.
- Veuillez le mettre.
- Cliquez sur "Authorize" pour valider. Une fois le token ajouté, vous pourrez effectuer des requêtes authentifiées sur les endpoints nécessitant une autorisation.

#### 4. Consulter les terrains disponibles
- Allez à l’endpoint **`GET /api/terrains`** dans Swagger.
- Cliquez sur **"Try it out"** pour exécuter la requête.
- Vous obtiendrez une liste des terrains avec leurs détails, y compris leur disponibilité.
- Utilisez les informations des terrains pour identifier celui que vous souhaitez réserver.
  
#### 5. Créer une réservation
- Allez à l’endpoint **`POST /api/reservations`** dans Swagger.
- Cliquez sur **"Try it out"**, puis remplissez les champs requis dans le corps de la requête.
- Exemple de corps de requête :

```json
  {
    "terrainId": 1,
    "date": "2024-12-12",
    "startTime": "18:00",
  }
```
- Cliquez sur "Execute" pour envoyer la requête.
- Si la réservation est réussie, vous obtiendrez une réponse contenant les détails de la réservation, comme ci-dessous :

```json
{
  "_links": {
    "self": {
      "href": "/reservations/2",
      "templated": false
    },
    "reservations": {
      "href": "/reservations",
      "templated": false
    }
  },
  "id": 2,
  "userId": 1,
  "terrainId": "1",
  "startTime": "18:00",
  "endTime": "18:45:00",
  "createdAt": "2024-12-11T19:28:08.314Z",
  "date": "2024-12-12",
  "updatedAt": "2024-12-11T19:28:08.314Z",
  "_embedded": {
    "user": {
      "_links": {
        "self": {
          "href": "/users/1",
          "templated": false
        },
        "users": {
          "href": "/users",
          "templated": false
        }
      },
      "pseudo": "admybad",
      "id": 1
    },
    "terrain": {
      "_links": {
        "self": {
          "href": "/terrains/1",
          "templated": false
        },
        "terrains": {
          "href": "/terrains",
          "templated": false
        }
      },
      "name": "A",
      "id": 1,
      "isAvailable": true,
      "createdAt": "2024-12-11T19:23:26.000Z",
      "updatedAt": "2024-12-11T19:23:26.000Z"
    }
  }
}
```
- Vous pouvez maintenant vérifier votre réservation dans la prochaine étape.

#### 6. Vérifier vos réservations
- Allez à l’endpoint **`GET /api/reservations`** dans Swagger.
- Cliquez sur **"Try it out"** pour exécuter la requête.
- Vous obtiendrez une liste de toutes vos réservations sous forme de réponse JSON.

#### 7. Annuler une réservation
- Allez à l’endpoint **`DELETE /api/reservations/{id}`** dans Swagger.
- Cliquez sur **"Try it out"**, puis remplacez `{id}` par l’identifiant de la réservation que vous souhaitez annuler.
- Exemple : `2`
- Cliquez sur **"Execute"**.
- Deux cas sont possibles :
  1. **Vous n’avez pas la permission** : Cela se produit si vous tentez de supprimer une réservation qui ne vous appartient pas et que vous n’êtes pas administrateur.
  2. **La réservation est supprimée avec succès** : Cela se produit si la réservation vous appartient ou si vous êtes administrateur.

---

## GraphQL

L'API GraphQL est accessible à l'adresse suivante :  
[http://localhost:5001/graphql](http://localhost:5001/graphql)

> **Remarque :** Le port (`5001`) peut varier en fonction de la configuration dans votre fichier `.env` via la variable `HOST_PORT_API`. 


Pour l'exercice, ce sont toujours les mêmes slots qui sont disponibles/indisponibles pour chaque jour.

Par exemple, voici une requête permettant de récupérer les créneaux horaires disponibles pour une date et un terrain spécifiques :
```graphql
query {
  availableSlots(date: "2024-12-11", terrain: "A") {
    time
    isAvailable
  }
}
```

