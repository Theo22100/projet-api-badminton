
# Badminton Reservation API

This project is a web API for managing badminton court reservations. It supports both RESTful endpoints and a GraphQL query for retrieving available slots.

## Features

- Manage users (adhérents and admin).
- Reserve and cancel reservations for badminton courts.
- Temporarily disable courts due to maintenance or weather issues.
- Retrieve available slots via GraphQL.

## Installation

1. Clone the repository:
   ```bash
   docker-compose up --build

   ```
2. Install dependencies:
   ```bash
   docker-compose up --build
   docker exec -it <container_name> npm run migrate
   docker exec -it <container_name> npm run seed

   ```
3. Configure environment variables:
   ```bash
   cp .env.dist .env
   ```


## Starting the Server

1. Run database migrations and seeders:
   ```bash
   npm migrate
   npm seed
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. The API will be available at `http://localhost:<port>`.

## API Documentation

### RESTful Endpoints

#### Reservations
- **GET /reservations**: Fetch all reservations.
- **POST /reservations**: Create a new reservation.
  - Request body:
    ```json
    {
      "userId": 1,
      "terrainId": 2,
      "timeSlot": "10:00"
    }
    ```

#### Terrains
- **GET /terrains**: Fetch all available courts.
- **PUT /terrains/:id**: Update a court's availability (admin only).
  - Request body:
    ```json
    {
      "isAvailable": false
    }
    ```

### GraphQL

#### Endpoint
- URL: `http://localhost:<port>/graphql`

#### Query Example
```graphql
query GetAvailableSlots {
  availableSlots(date: "2024-11-27", terrain: "A") {
    time
    isAvailable
  }
}
```

## Testing

Use tools like Postman or Apollo Studio to test RESTful endpoints and GraphQL queries.

## License

This project is for educational purposes only.
