const express = require('express');
const router = express.Router();
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

// Définir le schéma GraphQL
const schema = buildSchema(`
  type Query {
    availableSlots(date: String!, terrain: String!): [Slot]
  }
  type Slot {
    time: String
    isAvailable: Boolean
  }
`);

// Fonction pour valider une date au format YYYY-MM-DD
const isValidDate = (date) => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(date)) return false;

  const parsedDate = new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
};

// Résolveurs GraphQL
const rootValue = {
  availableSlots: ({ date, terrain }) => {
    if (!date || !terrain) {
      throw new Error("Les paramètres 'date' et 'terrain' sont requis.");
    }
    if (!isValidDate(date)) {
      throw new Error("Le paramètre 'date' doit être au format YYYY-MM-DD.");
    }

    // Exemple de données
    const slots = [
      { time: "10:00", isAvailable: true },
      { time: "10:45", isAvailable: false },
      { time: "11:30", isAvailable: true },
      { time: "12:15", isAvailable: true },
      { time: "13:00", isAvailable: false },
      { time: "13:45", isAvailable: true },
      { time: "14:30", isAvailable: true },
      { time: "15:15", isAvailable: false },
      { time: "16:00", isAvailable: true },
      { time: "16:45", isAvailable: true },
      { time: "17:30", isAvailable: false },
      { time: "18:15", isAvailable: false },
      { time: "19:00", isAvailable: true },
      { time: "19:45", isAvailable: true },
      { time: "20:30", isAvailable: true },
      { time: "21:15", isAvailable: true },
    ];

    console.log(`Query received for date: ${date}, terrain: ${terrain}`);
    return slots;
  },
};


// Configurer express-graphql
router.use(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true, // Interface interactive pour tester les requêtes
  })
);



module.exports = router;