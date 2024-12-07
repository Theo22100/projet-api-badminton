const { buildSchema } = require("graphql");

module.exports = buildSchema(`
  type Query {
    availableSlots(date: String!, terrain: String!): [Slot]
  }
  type Slot {
    time: String
    isAvailable: Boolean
  }
`);
