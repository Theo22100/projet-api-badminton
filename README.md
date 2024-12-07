
# Badminton Reservation API

Mettre explication projet

## Fonctionnalités

Mettre résumé des features

## Disctionnaires de données



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

