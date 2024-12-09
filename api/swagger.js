const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'

const endpointsFiles = ['./app.js'];


//@See: https://swagger-autogen.github.io/docs/getting-started/
const doc = {
  info: {
    version: '3.0.0',
    title: 'Badminton RESTful API',
    description: 'Documentation pour l\'API de badminton',
  },
  host: 'localhost:5001',
  basePath: '',
  schemes: ['http'], // Utilisez 'https' si votre API est sécurisée
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey', // Swagger 2.0 utilise `apiKey` pour représenter un Bearer Token
      name: 'Authorization', // Le header attendu pour le token
      in: 'header', // Le token sera envoyé dans le header
      description: 'Entrez "Bearer <votre-token>" pour vous authentifier.',
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
  tags: [
    {
      name: 'Users',
      description: 'Routes liées aux utilisateurs',
    },
    {
      name: 'Terrains',
      description: 'Routes liées aux Terrains',
    },
    {
      name: 'Réservations',
      description: 'Routes liées aux réservations',
    },
    {
      name: 'Home',
      description: 'Routes liées à la page d\'accueil ou au point de base de l\'API',
    },
  ],
};

swaggerAutogen(outputFile, endpointsFiles, doc)