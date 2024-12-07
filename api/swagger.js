const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'

const endpointsFiles = ['./app.js'];


//@See: https://swagger-autogen.github.io/docs/getting-started/
const doc = {
    info: {
      version: '3.0.0',            
      title: 'Badminton RESTful API', 
      description: ''     
    },
    host: 'localhost:5001',                 // by default: 'localhost:3000'
    basePath: '',             // by default: '/'
    schemes: ['http'],              // by default: ['http']
    consumes: [],             // by default: ['application/json']
    produces: [],             // by default: ['application/json']
    tags: [ 
      {
        name: 'Users',
        description: 'Routes liées aux utilisateurs'
      },
      {
        name: 'Terrains',
        description: 'Routes liées aux Terrains'
      },
      {
        name: 'Réservations',
        description: 'Routes liées aux réservations'
      },
      {
        name: 'Home',
        description: 'Routes liées à la page d\'accueil ou au point de base de l\'API'
      }
    ],
    securityDefinitions: {},  // by default: empty object
    definitions: {}           // by default: empty object
  };
  

swaggerAutogen(outputFile, endpointsFiles, doc)